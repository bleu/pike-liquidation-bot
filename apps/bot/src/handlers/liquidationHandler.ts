import { Address, formatUnits, parseUnits } from "viem";
import { PikeClient } from "../services/clients";
import {
  WETH,
  USDC,
  WETH_USDC_POOL,
  stETH,
  WETH_stETH_POOL,
  USDC_stETH_POOL,
  getUnderlying,
} from "@pike-liq-bot/utils";
import { logger } from "../services/logger";
import { getRiskEngineParameters } from "#/services/ponder/riskEngineParameters";
import {
  AllUserPositionsWithValue,
  defaultUserPositionData,
  LiquidationData,
} from "#/types";

export class LiquidationHandler {
  public liquidationIncentiveMantissa: bigint = 0n;
  public closeFactorMantissa: bigint = 0n;

  constructor(
    private readonly pikeClient: PikeClient,
    private readonly minProfitUsdValue: number = 0
  ) {
    logger.debug("Initializing LiquidationHandler", {
      class: "LiquidationHandler",
    });
  }

  async updateRiskEngineParameters() {
    logger.debug("Updating risk engine parameters", {
      class: "LiquidationHandler",
    });

    const riskEngineParameters = await getRiskEngineParameters();

    this.liquidationIncentiveMantissa = BigInt(
      riskEngineParameters.liquidationIncentiveMantissa
    );
    this.closeFactorMantissa = BigInt(riskEngineParameters.closeFactorMantissa);

    logger.info("Updated risk engine parameters", {
      class: "LiquidationHandler",
      liquidationIncentiveMantissa:
        this.liquidationIncentiveMantissa.toString(),
      closeFactorMantissa: this.closeFactorMantissa.toString(),
    });
  }

  checkAmountToLiquidate(userPositions: AllUserPositionsWithValue) {
    logger.debug("Checking amount to liquidate", {
      class: "LiquidationHandler",
      userPositions,
    });

    const liquidationData =
      this.getLiquidationDataFromAllUserPositions(userPositions);

    if (!liquidationData) {
      logger.info("No liquidation data found", {
        class: "LiquidationHandler",
        user: userPositions.id,
      });
      return 0n;
    }

    const amountToLiquidate =
      (liquidationData?.biggestBorrowPosition.borrowed *
        this.closeFactorMantissa) /
      parseUnits("1", 18);

    logger.debug("Calculated liquidation amount", {
      class: "LiquidationHandler",
      borrower: liquidationData.borrower,
      totalAmount: liquidationData?.biggestBorrowPosition.borrowed.toString(),
      amountToLiquidate: amountToLiquidate.toString(),
    });

    return amountToLiquidate;
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

  calculateMinAmountOut({
    collateralTokenPrice,
    borrowTokenPrice,
    repayAmount,
  }: {
    collateralTokenPrice: bigint;
    borrowTokenPrice: bigint;
    repayAmount: bigint;
  }): bigint {
    const amountToLiquidateInCollateralToken =
      (repayAmount * borrowTokenPrice) / collateralTokenPrice;

    const expectedAmountOut =
      (amountToLiquidateInCollateralToken -
        (this.liquidationIncentiveMantissa - parseUnits("1", 18))) /
      parseUnits("1", 18);

    // 90% of expected amount out to cover the pool fee cost
    // if use a real pool to perform the liquidation this would be more complex and involve slippage, mev, etc
    return (expectedAmountOut * 90n) / 100n;
  }

  calculateExpectedLiquidationProfit({
    collateralTokenPrice,
    borrowTokenPrice,
    repayAmount,
    expectedAmountOut,
  }: {
    collateralTokenPrice: bigint;
    borrowTokenPrice: bigint;
    repayAmount: bigint;
    expectedAmountOut: bigint;
  }) {
    const collateralValue = Number(
      formatUnits(expectedAmountOut * collateralTokenPrice, 36)
    );
    const borrowValue = Number(formatUnits(repayAmount * borrowTokenPrice, 36));

    const profit = collateralValue - borrowValue;

    logger.debug("Calculated liquidation profit", {
      class: "LiquidationHandler",
      profit: profit.toString(),
    });

    return profit;
  }

  async liquidatePositionRaw({
    borrowPToken,
    borrower,
    repayAmount,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    repayAmount: bigint;
    collateralPToken: Address;
  }) {
    logger.info("Initiating position liquidation using bot liquidity", {
      class: "LiquidationHandler",
      borrower,
      borrowPToken,
      collateralPToken,
      repayAmount: repayAmount.toString(),
    });

    const tx = await this.pikeClient.liquidatePositionRaw({
      borrower,
      borrowPToken,
      repayAmount,
      collateralPToken,
    });

    return tx.transactionHash;
  }

  async liquidatePositionWithProfit({
    minAmountOut,
    borrowPToken,
    collateralPToken,
    borrower,
    repayAmount,
  }: {
    borrower: Address;
    borrowPToken: Address;
    repayAmount: bigint;
    collateralPToken: Address;
    minAmountOut: bigint;
  }) {
    const pool = this.getPoolAddress({
      borrowPToken,
      collateralPToken,
    });

    logger.info("Executing liquidation", {
      class: "LiquidationHandler",
      borrower,
      pool,
      minAmountOut: minAmountOut.toString(),
    });

    return this.pikeClient.liquidatePosition({
      pool,
      borrower,
      borrowPToken,
      repayAmount,
      collateralPToken,
      minAmountOut,
    });
  }

  async liquidatePosition({
    borrowPToken,
    borrower,
    repayAmount,
    collateralPToken,
    borrowTokenPrice,
    collateralTokenPrice,
  }: {
    borrower: Address;
    borrowPToken: Address;
    repayAmount: bigint;
    collateralPToken: Address;
    borrowTokenPrice: bigint;
    collateralTokenPrice: bigint;
  }) {
    logger.info("Initiating position liquidation", {
      class: "LiquidationHandler",
      borrower,
      borrowPToken,
      collateralPToken,
      repayAmount: repayAmount.toString(),
    });

    const minAmountOut = this.calculateMinAmountOut({
      collateralTokenPrice,
      borrowTokenPrice,
      repayAmount,
    });

    const expectedProfitUsdValue = this.calculateExpectedLiquidationProfit({
      collateralTokenPrice,
      borrowTokenPrice,
      repayAmount,
      expectedAmountOut: minAmountOut,
    });

    logger.debug("Calculated liquidation amounts", {
      class: "LiquidationHandler",
      minAmountOut: minAmountOut.toString(),
    });

    if (expectedProfitUsdValue < this.minProfitUsdValue) {
      logger.info("Expected profit is below minimum", {
        class: "LiquidationHandler",
        borrower,
        expectedProfitUsdValue: expectedProfitUsdValue.toString(),
        minProfitUsdValue: this.minProfitUsdValue.toString(),
      });
      return;
    }

    if (expectedProfitUsdValue > 0) {
      return this.liquidatePositionWithProfit({
        minAmountOut,
        borrowPToken,
        collateralPToken,
        borrower,
        repayAmount,
      });
    }

    return this.liquidatePositionRaw({
      borrowPToken,
      borrower,
      repayAmount,
      collateralPToken,
    });
  }

  findBiggestPositionTypeFromAllUserPositions(
    userPositions: AllUserPositionsWithValue,
    isCollateral: boolean
  ) {
    const positionType = isCollateral ? "collateral" : "borrow";
    logger.info(
      `Finding biggest ${positionType} position for user ${userPositions.id}`,
      {
        class: "PositionHandler",
      }
    );

    const biggestPosition = userPositions.positions.reduce(
      (biggest, position) => {
        if (!position.isOnMarket) return biggest;
        const biggestAmount = isCollateral
          ? biggest.balanceUsdValue
          : biggest.borrowedUsdValue;
        const positionAmount = isCollateral
          ? position.balanceUsdValue
          : position.borrowedUsdValue;

        return positionAmount > biggestAmount ? position : biggest;
      },
      defaultUserPositionData
    );

    if (biggestPosition.isOnMarket) {
      logger.info(`Found biggest ${positionType} position`, {
        class: "PositionHandler",
        user: userPositions.id,
        marketId: biggestPosition.marketId,
        amount: isCollateral
          ? biggestPosition.balanceUsdValue
          : biggestPosition.borrowedUsdValue,
      });
    }

    return biggestPosition.isOnMarket ? biggestPosition : undefined;
  }

  getLiquidationDataFromAllUserPositions(
    userPosition: AllUserPositionsWithValue
  ): LiquidationData | undefined {
    logger.info(`Getting liquidation data for user ${userPosition.id}`, {
      class: "PositionHandler",
    });

    const biggestBorrowPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, false);
    const biggestCollateralPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, true);

    if (!biggestBorrowPosition || !biggestCollateralPosition) {
      logger.debug(`No valid liquidation data for user ${userPosition.id}`, {
        class: "PositionHandler",
        hasBorrowPosition: !!biggestBorrowPosition,
        hasCollateralPosition: !!biggestCollateralPosition,
      });
      return undefined;
    }

    logger.debug(`Generated liquidation data for user ${userPosition.id}`, {
      class: "PositionHandler",
      borrowMarketId: biggestBorrowPosition.marketId,
      collateralMarketId: biggestCollateralPosition.marketId,
    });

    return {
      borrower: userPosition.id,
      biggestBorrowPosition,
      biggestCollateralPosition,
    };
  }
}
