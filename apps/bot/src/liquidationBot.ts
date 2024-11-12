import { Address, encodeFunctionData } from "viem";
import { pTokenAbi } from "./abis/pTokenAbi";
import { riskEngine } from "./utils/contracts";
import { riskEngineAbi } from "./abis/riskEngineAbi";
import { PikeClient, publicClient } from "./clients";

export class LiquidationBot {
  pikeClient: PikeClient;
  unwatchesFn: Record<string, () => void> = {};
  blockNumber?: bigint = undefined;

  constructor({ pikeClient }: { pikeClient: PikeClient }) {
    this.pikeClient = pikeClient;
  }

  setBlockNumber = (blockNumber: bigint) => {
    this.blockNumber = blockNumber;
  };

  checkAndLiquidatePosition = async ({
    borrowPToken,
    borrower,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
  }) => {
    const amountToLiquidate = await this.checkAmountToLiquidate({
      borrowPToken,
      borrower,
      collateralPToken,
    });

    if (amountToLiquidate > 0n) {
      await this.liquidatePosition({
        borrower,
        borrowPToken,
        amountToLiquidate,
        collateralPToken,
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

  startMonitorPosition = ({
    borrower,
    borrowPToken,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
  }) => {
    const unwatchesFn = publicClient.watchBlocks({
      onBlock: (block) =>
        this.checkAndLiquidatePosition({
          borrower,
          borrowPToken,
          collateralPToken,
        }),
    });
    this.unwatchesFn[borrower + borrowPToken + collateralPToken] = unwatchesFn;
  };

  stopMonitorPosition = ({
    borrower,
    borrowPToken,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
  }) => {
    this.unwatchesFn[borrower + borrowPToken + collateralPToken]();
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
    // await this.pikeClient.mintToken(
    //   getUnderlying(borrowedPToken),
    //   this.address,
    //   amount
    // );
    // await this.transactionFactory.approveToken(
    //   getUnderlying(borrowedPToken),
    //   this.address,
    //   borrowedPToken,
    //   amount
    // );
    // return this.transactionFactory.liquidateUser(
    //   this.address,
    //   borrower,
    //   borrowedPToken,
    //   amount,
    //   collateralPToken
    // );
  };
}
