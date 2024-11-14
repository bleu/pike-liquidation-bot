import { Address } from "viem";
import {
  riskEngine,
  pTokenAbi,
  riskEngineAbi,
  USDC,
  WETH,
  stETH,
  mockOracle,
  mockOracleAbi,
} from "@pike-liq-bot/utils";
import { PikeClient, publicClient } from "./clients";
import {
  AllUserPositions,
  defaultUserPositionData,
  LiquidationData,
} from "./types";
import { getUserPositionsUpdatesAfterBlock } from "./queries";
import { getUnderlying } from "./utils/consts";

export class LiquidationBot {
  pikeClient: PikeClient;
  unwatchesFn: Record<string, () => void> = {};
  blockNumber?: bigint = undefined;
  positions: Record<Address, LiquidationData> = {};
  tokenPrices: Record<Address, bigint> = {};
  lastUpdateGt?: bigint = undefined;

  constructor({ pikeClient }: { pikeClient: PikeClient }) {
    this.pikeClient = pikeClient;
  }

  startToMonitor = async () => {
    await this.updateTokenPrices();
    await this.updatePositionsToMonitor();
  };

  updatePositionsToMonitor = async () => {
    const userPositions = await getUserPositionsUpdatesAfterBlock(
      this.lastUpdateGt
    );

    const liquidationData = userPositions
      .map(this.getLiquidationDataFromAllUserPositions)
      .filter((data) => data !== undefined) as LiquidationData[];

    liquidationData.forEach(this.startOrUpdateMonitorPosition);
  };

  updateTokenPrices = async () => {
    const ret = await publicClient.multicall({
      contracts: [USDC, WETH, stETH].map((token) => ({
        address: mockOracle,
        abi: mockOracleAbi,
        functionName: "getPrice",
        args: [token],
        blockNumber: this.blockNumber,
      })),
    });

    [USDC, WETH, stETH].forEach((token, i) => {
      if (ret[i].error) return;
      this.tokenPrices[token] = ret[i].result;
    });
  };

  getLiquidationDataFromAllUserPositions = (
    userPosition: AllUserPositions
  ): LiquidationData | undefined => {
    const biggestBorrowPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, false);
    const biggestCollateralPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, true);

    if (!biggestBorrowPosition || !biggestCollateralPosition) {
      return undefined;
    }

    return {
      borrower: userPosition.id,
      biggestBorrowPosition,
      biggestCollateralPosition,
    };
  };

  findBiggestPositionTypeFromAllUserPositions = (
    userPositions: AllUserPositions,
    isCollateral: boolean
  ) => {
    const biggestPosition = userPositions.positions.reduce(
      (biggest, position) => {
        if (!position.isOnMarket) return biggest;
        const biggestAmount = isCollateral ? biggest.balance : biggest.borrowed;
        const biggestValue =
          biggest.marketId === "0x0"
            ? 0n
            : biggestAmount * this.tokenPrices[getUnderlying(biggest.marketId)];

        const positionAmount = isCollateral
          ? position.balance
          : position.borrowed;
        const positionValue =
          positionAmount * this.tokenPrices[getUnderlying(position.marketId)];
        return positionValue > biggestValue ? position : biggest;
      },
      defaultUserPositionData
    );

    return biggestPosition.isOnMarket ? biggestPosition : undefined;
  };

  setBlockNumber = (blockNumber: bigint) => {
    this.blockNumber = blockNumber;
  };

  checkAndLiquidatePosition = async (data: LiquidationData) => {
    const amountToLiquidate = data.biggestCollateralPosition.balance / 2n;
    const liquidationAllowed = await this.checkLiquidationAllowed({
      borrowPToken: data.biggestBorrowPosition.marketId,
      borrower: data.borrower,
      collateralPToken: data.biggestCollateralPosition.marketId,
      amountToLiquidate: amountToLiquidate,
    });

    if (liquidationAllowed) {
      await this.liquidatePosition({
        borrower: data.borrower,
        borrowPToken: data.biggestBorrowPosition.marketId,
        amountToLiquidate: amountToLiquidate,
        collateralPToken: data.biggestCollateralPosition.marketId,
      });
      return true;
    }
    return false;
  };

  checkAmountToLiquidate = async ({
    borrowPToken,
    borrower,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
  }) => {
    const amount = await publicClient.readContract({
      address: borrowPToken,
      abi: pTokenAbi,
      functionName: "borrowBalanceCurrent",
      args: [borrower],
    });

    const amountToLiquidate = amount / 2n;

    const liquidationAllowed = await this.checkLiquidationAllowed({
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate,
    });

    return liquidationAllowed ? amountToLiquidate : 0n;
  };

  checkLiquidationAllowed = async ({
    borrowPToken,
    borrower,
    collateralPToken,
    amountToLiquidate,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    amountToLiquidate: bigint;
  }) => {
    const liquidationErrorCode = await this.readContract({
      address: riskEngine,
      abi: riskEngineAbi,
      functionName: "liquidateBorrowAllowed",
      args: [borrowPToken, collateralPToken, borrower, amountToLiquidate],
    });

    return liquidationErrorCode == BigInt(0);
  };

  startOrUpdateMonitorPosition = (data: LiquidationData) => {
    // if there is already a watcher for this borrower, stop it
    this.stopMonitorPosition(data.borrower);

    const unwatchesFn = publicClient.watchBlocks({
      onBlock: (block) => this.checkAndLiquidatePosition(data),
    });
    this.unwatchesFn[data.borrower] = unwatchesFn;
    this.positions[data.borrower] = data;
  };

  stopMonitorPosition = (borrower: Address) => {
    if (!this.unwatchesFn[borrower]) {
      return;
    }
    this.unwatchesFn[borrower]();
  };

  readContract = async ({
    address,
    abi,
    functionName,
    args,
  }: {
    address: Address;
    abi: any;
    functionName: string;
    args: any[];
  }) => {
    return await publicClient.readContract({
      address,
      abi,
      functionName,
      args,
      blockNumber: this.blockNumber,
    });
  };

  liquidatePosition = async ({
    borrowPToken,
    borrower,
    amountToLiquidate,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    amountToLiquidate: bigint;
    collateralPToken: Address;
  }) => {
    // TODO: Implement liquidation
    return;
  };
}
