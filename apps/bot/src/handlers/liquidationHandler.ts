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
import { logger } from "../services/logger";

export class LiquidationHandler {
  constructor(
    private readonly contractReader: ContractReader,
    private readonly pikeClient: PikeClient
  ) {
    logger.debug("Initializing LiquidationHandler", {
      class: "LiquidationHandler",
    });
  }

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
    logger.debug("Checking liquidation allowance", {
      class: "LiquidationHandler",
      borrower,
      borrowPToken,
      collateralPToken,
      amountToLiquidate: amountToLiquidate.toString(),
      blockNumber: blockNumber?.toString(),
    });

    const liquidationErrorCode = (await this.contractReader.readContract({
      address: riskEngine,
      abi: riskEngineAbi,
      functionName: "liquidateBorrowAllowed",
      args: [borrowPToken, collateralPToken, borrower, amountToLiquidate],
      blockNumber,
    })) as bigint;

    const isAllowed = liquidationErrorCode == BigInt(0);
    logger.info(`Liquidation check result: ${isAllowed}`, {
      class: "LiquidationHandler",
      borrower,
      errorCode: liquidationErrorCode.toString(),
    });

    return isAllowed;
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
    logger.debug("Checking amount to liquidate", {
      class: "LiquidationHandler",
      borrower,
      borrowPToken,
      collateralPToken,
      blockNumber: blockNumber?.toString(),
    });

    const amount = (await this.contractReader.readContract({
      address: borrowPToken,
      abi: pTokenAbi,
      functionName: "borrowBalanceCurrent",
      args: [borrower],
      blockNumber,
    })) as bigint;

    const amountToLiquidate = amount / 2n;

    logger.debug("Calculated liquidation amount", {
      class: "LiquidationHandler",
      borrower,
      totalAmount: amount.toString(),
      amountToLiquidate: amountToLiquidate.toString(),
    });

    const liquidationAllowed = await this.checkLiquidationAllowed({
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate,
      blockNumber,
    });

    const finalAmount = liquidationAllowed ? amountToLiquidate : 0n;
    logger.info("Amount to liquidate determined", {
      class: "LiquidationHandler",
      borrower,
      finalAmount: finalAmount.toString(),
      liquidationAllowed,
    });

    return finalAmount;
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

    logger.debug("Getting pool address", {
      class: "LiquidationHandler",
      borrowToken,
      collateralToken,
    });

    if (borrowToken === collateralToken) {
      logger.error("Attempted to get pool for same tokens", {
        class: "LiquidationHandler",
        token: borrowToken,
      });
      throw new Error("Same tokens");
    }

    let pool: Address;
    if (
      [borrowToken, collateralToken].includes(WETH) &&
      [borrowToken, collateralToken].includes(USDC)
    ) {
      pool = WETH_USDC_POOL;
    } else if (
      [borrowToken, collateralToken].includes(WETH) &&
      [borrowToken, collateralToken].includes(stETH)
    ) {
      pool = WETH_stETH_POOL;
    } else if (
      [borrowToken, collateralToken].includes(USDC) &&
      [borrowToken, collateralToken].includes(stETH)
    ) {
      pool = USDC_stETH_POOL;
    } else {
      logger.error("No pool found for token pair", {
        class: "LiquidationHandler",
        borrowToken,
        collateralToken,
      });
      throw new Error("No pool found");
    }

    logger.debug("Pool address found", {
      class: "LiquidationHandler",
      pool,
      borrowToken,
      collateralToken,
    });

    return pool;
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
    logger.info("Initiating position liquidation", {
      class: "LiquidationHandler",
      borrower,
      borrowPToken,
      collateralPToken,
      amountToLiquidate: amountToLiquidate.toString(),
    });

    const expectedAmountOut =
      (amountToLiquidate * borrowTokenPrice) / collateralTokenPrice;
    const minAmountOut = (expectedAmountOut * 1n) / 100n;

    logger.debug("Calculated liquidation amounts", {
      class: "LiquidationHandler",
      expectedAmountOut: expectedAmountOut.toString(),
      minAmountOut: minAmountOut.toString(),
      borrowTokenPrice: borrowTokenPrice.toString(),
      collateralTokenPrice: collateralTokenPrice.toString(),
    });

    const pool = this.getPoolAddress({
      borrowPToken,
      collateralPToken,
    });

    logger.info("Executing liquidation", {
      class: "LiquidationHandler",
      borrower,
      pool,
      amountToLiquidate: amountToLiquidate.toString(),
      minAmountOut: minAmountOut.toString(),
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
