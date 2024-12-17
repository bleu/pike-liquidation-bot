import { MarketHandler } from "#/handlers/marketHandler";
import { MarketParameters, UserPositionData } from "#/types";
import { MathSol, pstETH, pUSDC, pWETH } from "@pike-liq-bot/utils";
import { parseEther } from "viem";

// Mock market parameters
export const mockMarketParameters: MarketParameters = {
  cash: parseEther("1"),
  totalBorrows: parseEther("0.5"),
  totalReserves: parseEther("0.5"),
  totalSupply: parseEther("1"),
  borrowIndex: parseEther("1"),
  liquidationThreshold: parseEther("0.9"),
  protocolSeizeShareMantissa: parseEther("0.1"),
  lastUpdated: 1n,
};

// Mock IndividualMarketHandler class
export class MockIndividualMarketHandler {
  public marketParameters?: MarketParameters;

  constructor(readonly marketId: string) {
    this.marketParameters = mockMarketParameters;
  }

  async updateMarketParameters() {
    return;
  }

  calculateCollateralRate() {
    if (!this.marketParameters) {
      throw new Error("Market parameters not set");
    }
    return parseEther("1");
  }

  calculateBorrowRate(interestIndex: bigint) {
    if (!this.marketParameters) {
      throw new Error("Market parameters not set");
    }
    return parseEther("1");
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

// Mock MarketHandler class
export class MockMarketHandler implements MarketHandler {
  public markets: Record<string, MockIndividualMarketHandler> = {};

  constructor() {
    this.markets = {
      [pWETH]: new MockIndividualMarketHandler(pWETH),
      [pUSDC]: new MockIndividualMarketHandler(pUSDC),
      [pstETH]: new MockIndividualMarketHandler(pstETH),
    };
  }

  async updateMarketHandlerParameters() {
    await Promise.all(
      Object.values(this.markets).map((marketHandler) =>
        marketHandler.updateMarketParameters()
      )
    );
  }
}
