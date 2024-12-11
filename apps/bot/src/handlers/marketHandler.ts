import { getMarketParameters } from "#/services/ponder/marketHandlerParameters";
import { MarketParameters, UserPositionData } from "#/types";
import { getSymbol, MathSol } from "@pike-liq-bot/utils";

export class MarketHandler {
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
      MathSol.mulDownFixed(
        this.marketParameters.cash +
          this.marketParameters.totalBorrows -
          this.marketParameters.totalReserves,
        this.marketParameters.liquidationThreshold
      ),
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

  calculateBorrowBalancePlusEffects(position: UserPositionData) {
    if (!position?.interestIndex) {
      return 0n;
    }

    const borrowRate = this.calculateBorrowRate(position.interestIndex);

    return MathSol.mulUpFixed(position.borrowed, borrowRate);
  }

  calculateCollateralBalancePlusEffects(position: UserPositionData) {
    if (!position.isOnMarket) return 0n;
    const collateralRate = this.calculateCollateralRate();

    return MathSol.mulUpFixed(position.balance, collateralRate);
  }
}
