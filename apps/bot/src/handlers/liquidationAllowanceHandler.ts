import { getUnderlying, MathSol } from "@pike-liq-bot/utils";
import { logger } from "../services/logger";
import { AllUserPositions } from "#/types";
import { PriceHandler } from "./priceHandler";
import { MarketHandler } from "./marketHandler";

export class LiquidationAllowanceHandler {
  constructor(
    private readonly priceHandler: PriceHandler,
    private readonly markerHandler: MarketHandler
  ) {
    logger.debug("Initializing LiquidationHandler", {
      class: "LiquidationHandler",
    });
  }

  checkLiquidationAllowed(userPositions: AllUserPositions) {
    logger.debug("Checking liquidation allowance", {
      class: "LiquidationHandler",
      user: userPositions.id,
    });

    const sumBorrowPlusEffects = Object.values(userPositions.positions)
      .map((position) => {
        const marketHandler = this.markerHandler.markets[position.marketId];
        if (!marketHandler) {
          throw new Error("Market handler not found");
        }

        const borrowPlusEffects = MathSol.mulDownFixed(
          marketHandler.calculateBorrowBalancePlusEffects(position),
          this.priceHandler.getPrice(getUnderlying(position.marketId))
        );

        return borrowPlusEffects;
      })
      .reduce((acc, val) => acc + val, 0n);

    const sumCollateralPlusEffects = Object.values(userPositions.positions)
      .map((position) => {
        const marketHandler = this.markerHandler.markets[position.marketId];
        if (!marketHandler) {
          throw new Error("Market handler not found");
        }

        const collateralPlusEffects = MathSol.mulDownFixed(
          marketHandler.calculateCollateralBalancePlusEffects(position),
          this.priceHandler.getPrice(getUnderlying(position.marketId))
        );
        return collateralPlusEffects;
      })
      .reduce((acc, val) => acc + val, 0n);

    return sumBorrowPlusEffects > sumCollateralPlusEffects;
  }
}
