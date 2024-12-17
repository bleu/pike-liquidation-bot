import { Address, formatUnits, parseEther, parseUnits } from "viem";
import { PikeClient } from "../services/clients";
import {
  WETH,
  USDC,
  WETH_USDC_POOL,
  stETH,
  WETH_stETH_POOL,
  USDC_stETH_POOL,
  getUnderlying,
  MathSol,
  getDecimals,
} from "@pike-liq-bot/utils";
import { logger } from "../services/logger";
import { getRiskEngineParameters } from "#/services/ponder/riskEngineParameters";
import {
  AllUserPositionsWithValue,
  BiggestUserPositions,
  defaultUserPositionData,
  LiquidationData,
} from "#/types";
import { MarketHandler } from "./marketHandler";

export class LiquidationHandler {
  public liquidationIncentiveMantissa: bigint = 0n;
  public closeFactorMantissa: bigint = 0n;
  public maxSlippage: bigint = parseUnits("10", 16);

  constructor(
    private readonly pikeClient: PikeClient,
    public readonly marketHandler: MarketHandler,
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

    logger.debug("Updated risk engine parameters", {
      class: "LiquidationHandler",
      liquidationIncentiveMantissa:
        this.liquidationIncentiveMantissa.toString(),
      closeFactorMantissa: this.closeFactorMantissa.toString(),
    });
  }

  checkAmountToLiquidate(biggestUserPositions: BiggestUserPositions) {
    const borrowPrice = biggestUserPositions?.biggestBorrowPosition.tokenPrice;
    const collateralPrice =
      biggestUserPositions?.biggestCollateralPosition.tokenPrice;

    const amountToLiquidate = MathSol.mulDownFixed(
      biggestUserPositions?.biggestBorrowPosition.borrowed,
      this.closeFactorMantissa
    );

    logger.debug("Calculated liquidation amount", {
      class: "LiquidationHandler",
      borrower: biggestUserPositions.borrower,
      totalAmount:
        biggestUserPositions?.biggestBorrowPosition.borrowed.toString(),
      amountToLiquidate: amountToLiquidate.toString(),
    });

    // Avoid try to liquidate more than the account has on collateral
    const repayValue = MathSol.mulUpFixed(amountToLiquidate, borrowPrice);

    const totalCollateralValue = MathSol.mulDownFixed(
      biggestUserPositions?.biggestCollateralPosition.balance,
      collateralPrice
    );

    if (totalCollateralValue > repayValue) {
      return amountToLiquidate;
    }

    return MathSol.divDownFixed(
      totalCollateralValue,
      MathSol.mulUpFixed(borrowPrice, this.liquidationIncentiveMantissa)
    );
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

  calculateExpectedAmountOut({
    collateralTokenRate,
    collateralTokenPrice,
    borrowTokenPrice,
    repayAmount,
    protocolSeizeShareMantissa,
  }: {
    collateralTokenRate: bigint;
    collateralTokenPrice: bigint;
    borrowTokenPrice: bigint;
    repayAmount: bigint;
    protocolSeizeShareMantissa: bigint;
  }): bigint {
    const repayValue = MathSol.mulDownFixed(repayAmount, borrowTokenPrice);
    const collateralValue = MathSol.mulDownFixed(
      MathSol.divDownFixed(repayValue, collateralTokenPrice),
      collateralTokenRate
    );

    const expectedAmountOut = MathSol.mulDownFixed(
      MathSol.mulDownFixed(
        collateralValue,
        this.liquidationIncentiveMantissa - parseUnits("1", 18)
      ),
      protocolSeizeShareMantissa
    );

    const minAmountOut = MathSol.mulDownFixed(
      expectedAmountOut,
      parseEther("1") - this.maxSlippage
    );

    logger.debug("Calculated min amount out", {
      class: "LiquidationHandler",
      repayAmount: repayAmount.toString(),
      expectedAmountOut: expectedAmountOut.toString(),
      minAmountOut: minAmountOut.toString(),
    });
    return minAmountOut;
  }

  checkIfLiquidationIsAboveProfitThreshold(expectedProfitUsdValue: number) {
    return expectedProfitUsdValue > this.minProfitUsdValue;
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
    logger.debug("Initiating position liquidation using bot liquidity", {
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

    logger.debug("Executing liquidation using handler", {
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
    expectedProfitUsdValue,
    minAmountOut,
    borrowPToken,
    borrower,
    repayAmount,
    collateralPToken,
  }: LiquidationData) {
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
      logger.debug(`Found biggest ${positionType} position`, {
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

  getBiggestPositionsFromAllUserPositions(
    userPosition: AllUserPositionsWithValue
  ): BiggestUserPositions | undefined {
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

  getLiquidationDataFromBiggestUserPositions(
    userPositions: BiggestUserPositions
  ): LiquidationData {
    const repayAmount = this.checkAmountToLiquidate(userPositions);

    const collateralTokenRate =
      this.marketHandler.markets[
        userPositions.biggestCollateralPosition.marketId
      ].calculateCollateralRate();

    const minAmountOut = this.calculateExpectedAmountOut({
      collateralTokenPrice: userPositions.biggestCollateralPosition.tokenPrice,
      borrowTokenPrice: userPositions.biggestBorrowPosition.tokenPrice,
      repayAmount,
      collateralTokenRate,
      protocolSeizeShareMantissa:
        this.marketHandler.markets[
          userPositions.biggestCollateralPosition.marketId
        ].marketParameters?.protocolSeizeShareMantissa || 0n,
    });

    const expectedProfitUsdValue = Number(
      formatUnits(
        MathSol.mulDownFixed(
          minAmountOut,
          userPositions.biggestCollateralPosition.tokenPrice
        ),
        Number(
          getDecimals(
            getUnderlying(userPositions.biggestCollateralPosition.marketId)
          )
        )
      )
    );

    return {
      borrower: userPositions.borrower,
      borrowPToken: userPositions.biggestBorrowPosition.marketId,
      repayAmount,
      collateralPToken: userPositions.biggestCollateralPosition.marketId,
      minAmountOut,
      expectedProfitUsdValue,
    };
  }
}
