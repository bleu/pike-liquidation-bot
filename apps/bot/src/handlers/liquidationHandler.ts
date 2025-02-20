import { Address } from "viem";
import { PikeClient } from "../services/clients";
import { MathSol } from "@pike-liq-bot/utils";
import { logger } from "../services/logger";
import { BiggestUserPositions, LiquidationData } from "#/types";

export class LiquidationHandler {
  constructor(private readonly pikeClient: PikeClient) {}

  checkAmountToLiquidate(biggestUserPositions: BiggestUserPositions) {
    const borrowPrice =
      biggestUserPositions?.biggestBorrowPosition.underlyingTokenPrice;
    const collateralPrice =
      biggestUserPositions?.biggestCollateralPosition.underlyingTokenPrice;

    const amountToLiquidate = MathSol.mulDownFixed(
      biggestUserPositions?.biggestBorrowPosition.metrics.storedBorrowAssets,
      biggestUserPositions.biggestBorrowPosition.pToken.closeFactor
    );

    logger.debug("Calculated liquidation amount", {
      borrower: biggestUserPositions.biggestBorrowPosition.userBalance.userId,
      amountToLiquidate: amountToLiquidate.toString(),
    });

    // Avoid try to liquidate more than the account has on collateral
    const repayValue = MathSol.mulUpFixed(amountToLiquidate, borrowPrice);

    const totalCollateralValue = MathSol.mulDownFixed(
      biggestUserPositions?.biggestCollateralPosition.metrics.supplyAssets,
      collateralPrice
    );

    if (totalCollateralValue > repayValue) {
      return amountToLiquidate;
    }

    const liquidationIncentive =
      biggestUserPositions.biggestBorrowPosition.eMode?.liquidationIncentive ||
      biggestUserPositions.biggestBorrowPosition.pToken.liquidationIncentive;

    return MathSol.divDownFixed(
      totalCollateralValue,
      MathSol.mulUpFixed(borrowPrice, BigInt(liquidationIncentive))
    );
  }

  async liquidatePosition({
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

  getLiquidationDataFromBiggestUserPositions(
    userPositions: BiggestUserPositions
  ): LiquidationData {
    const repayAmount = this.checkAmountToLiquidate(userPositions);

    // userId is address-chainId
    const borrower = userPositions.biggestBorrowPosition.userBalance
      .userId as Address;

    return {
      borrower,
      borrowPToken: userPositions.biggestBorrowPosition.pToken
        .address as Address,
      repayAmount,
      collateralPToken: userPositions.biggestCollateralPosition.pToken
        .address as Address,
    };
  }
}
