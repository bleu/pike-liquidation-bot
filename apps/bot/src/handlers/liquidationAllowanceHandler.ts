import { getUnderlying, pstETH, pUSDC, pWETH } from "@pike-liq-bot/utils";
import { logger } from "../services/logger";
import { AllUserPositions } from "#/types";
import { PriceHandler } from "./priceHandler";
import { MarketHandler } from "./marketHandler";

export class LiquidationAllowanceHandler {
  private marketHandlers: Record<string, MarketHandler> = {};
  constructor(private readonly priceHandler: PriceHandler) {
    logger.debug("Initializing LiquidationHandler", {
      class: "LiquidationHandler",
    });

    this.marketHandlers = {
      [pWETH]: new MarketHandler(pWETH),
      [pUSDC]: new MarketHandler(pUSDC),
      [pstETH]: new MarketHandler(pstETH),
    };
  }

  async updateMarketHandlerParameters() {
    logger.debug("Updating market handler parameters", {
      class: "LiquidationHandler",
    });

    await Promise.all(
      Object.values(this.marketHandlers).map((marketHandler) =>
        marketHandler.updateMarketParameters()
      )
    );
  }

  checkLiquidationAllowed(userPositions: AllUserPositions) {
    logger.debug("Checking liquidation allowance", {
      class: "LiquidationHandler",
      user: userPositions.id,
    });

    const sumBorrowPlusEffects = Object.values(userPositions.positions)
      .map((position) => {
        const marketHandler = this.marketHandlers[position.marketId];
        if (!marketHandler) {
          throw new Error("Market handler not found");
        }

        return (
          marketHandler.calculateBorrowBalancePlusEffects(position) *
          this.priceHandler.getPrice(getUnderlying(position.marketId))
        );
      })
      .reduce((acc, val) => acc + val, 0n);

    const sumCollateralPlusEffects = Object.values(userPositions.positions)
      .map((position) => {
        const marketHandler = this.marketHandlers[position.marketId];
        if (!marketHandler) {
          throw new Error("Market handler not found");
        }

        return (
          marketHandler.calculateCollateralBalancePlusEffects(position) *
          this.priceHandler.getPrice(getUnderlying(position.marketId))
        );
      })
      .reduce((acc, val) => acc + val, 0n);

    return sumBorrowPlusEffects > sumCollateralPlusEffects;
  }
}
