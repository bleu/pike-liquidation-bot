import { Address } from "viem";
import { ContractReader } from "../services/contractReader";
import { PikeClient } from "../services/clients";
import {
  riskEngine,
  riskEngineAbi,
  pTokenAbi,
  WETH,
  USDC,
  WETH_USDC_POOL,
  stETH,
  WETH_stETH_POOL,
  USDC_stETH_POOL,
} from "@pike-liq-bot/utils";
import { getUnderlying } from "#/utils/consts";

export class LiquidationHandler {
  constructor(
    private readonly contractReader: ContractReader,
    private readonly pikeClient: PikeClient
  ) {}

  async checkLiquidationAllowed({
    borrowPToken,
    borrower,
    collateralPToken,
    amountToLiquidate,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    amountToLiquidate: bigint;
    blockNumber?: bigint;
  }) {
    const liquidationErrorCode = await this.contractReader.readContract({
      address: riskEngine,
      abi: riskEngineAbi,
      functionName: "liquidateBorrowAllowed",
      args: [borrowPToken, collateralPToken, borrower, amountToLiquidate],
      blockNumber,
    });

    return liquidationErrorCode == BigInt(0);
  }

  async checkAmountToLiquidate({
    borrowPToken,
    borrower,
    collateralPToken,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    blockNumber?: bigint;
  }) {
    const amount = (await this.contractReader.readContract({
      address: borrowPToken,
      abi: pTokenAbi,
      functionName: "borrowBalanceCurrent",
      args: [borrower],
      blockNumber,
    })) as bigint;

    const amountToLiquidate = amount / 2n;

    const liquidationAllowed = await this.checkLiquidationAllowed({
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate,
      blockNumber,
    });

    return liquidationAllowed ? amountToLiquidate : 0n;
  }

  getPoolAddress({
    borrowPToken,
    collateralPToken,
  }: {
    borrowPToken: Address;
    collateralPToken: Address;
  }) {
    const borrowToken = getUnderlying(borrowPToken);
    const collateralToken = getUnderlying(collateralPToken);
    if (borrowToken === collateralToken) {
      throw new Error("Same tokens");
    }

    if (
      [borrowToken, collateralToken].includes(WETH) &&
      [borrowToken, collateralToken].includes(USDC)
    ) {
      return WETH_USDC_POOL;
    }

    if (
      [borrowToken, collateralToken].includes(WETH) &&
      [borrowToken, collateralToken].includes(stETH)
    ) {
      return WETH_stETH_POOL;
    }

    if (
      [borrowToken, collateralToken].includes(USDC) &&
      [borrowToken, collateralToken].includes(stETH)
    ) {
      return USDC_stETH_POOL;
    }

    throw new Error("No pool found");
  }

  async liquidatePosition({
    borrowPToken,
    borrower,
    amountToLiquidate,
    collateralPToken,
    borrowTokenPrice,
    collateralTokenPrice,
  }: {
    borrower: Address;
    borrowPToken: Address;
    amountToLiquidate: bigint;
    collateralPToken: Address;
    borrowTokenPrice: bigint;
    collateralTokenPrice: bigint;
  }) {
    const expectedAmountOut =
      (amountToLiquidate * borrowTokenPrice) / collateralTokenPrice;
    const minAmountOut = (expectedAmountOut * 1n) / 100n;
    const pool = this.getPoolAddress({
      borrowPToken,
      collateralPToken,
    });

    return this.pikeClient.liquidatePosition({
      pool,
      borrower,
      borrowPToken,
      amountToLiquidate,
      collateralPToken,
      minAmountOut,
    });
  }
}
