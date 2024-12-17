import { logger } from "#/services/logger";
import { getMarketParameters } from "#/services/ponder/marketHandlerParameters";
import { MarketParameters, UserPositionData } from "#/types";
import { MathSol, pstETH, pUSDC, pWETH } from "@pike-liq-bot/utils";

export class MarketHandler {
  public markets: Record<string, IndividualMarketHandler> = {};
  constructor() {
    logger.debug("Initializing LiquidationHandler", {
      class: "LiquidationHandler",
    });

    this.markets = {
      [pWETH]: new IndividualMarketHandler(pWETH),
      [pUSDC]: new IndividualMarketHandler(pUSDC),
      [pstETH]: new IndividualMarketHandler(pstETH),
    };
  }

  async updateMarketHandlerParameters() {
    logger.debug("Updating market handler parameters", {
      class: "LiquidationHandler",
    });

    await Promise.all(
      Object.values(this.markets).map((marketHandler) =>
        marketHandler.updateMarketParameters()
      )
    );
  }
}

export class IndividualMarketHandler {
  public marketParameters?: MarketParameters;

  constructor(readonly marketId: string) {}

  async updateMarketParameters() {
    this.marketParameters = await getMarketParameters(this.marketId);
  }

  calculateCollateralRate() {
    if (!this.marketParameters) {
      throw new Error("Market parameters not set");
    }

    return MathSol.divDownFixed(
      this.marketParameters.cash +
        this.marketParameters.totalBorrows -
        this.marketParameters.totalReserves,
      this.marketParameters.totalSupply
    );
  }

  calculateBorrowRate(interestIndex: bigint) {
    if (!this.marketParameters) {
      throw new Error("Market parameters not set");
    }

    return MathSol.divDownFixed(
      this.marketParameters.borrowIndex,
      interestIndex
    );
  }

  calculateBorrowBalancePlusEffects(
    position: Pick<UserPositionData, "borrowed" | "interestIndex">
  ) {
    if (!position?.interestIndex) {
      return 0n;
    }

    const borrowRate = this.calculateBorrowRate(position.interestIndex);

    return MathSol.mulUpFixed(position.borrowed, borrowRate);
  }

  calculateCollateralBalancePlusEffects(position: UserPositionData) {
    if (!position.isOnMarket) return 0n;
    const collateralRate = this.calculateCollateralRate();

    return MathSol.mulUpFixed(
      MathSol.mulUpFixed(position.balance, collateralRate),
      this.marketParameters?.liquidationThreshold || 0n
    );
  }
}
