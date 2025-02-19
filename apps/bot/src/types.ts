import { Address } from "viem";
import { schema } from "./utils/ponder/ponderClient";

export interface UserPositionData {
  userBalance: typeof schema.userBalance.$inferSelect;
  pToken: typeof schema.pToken.$inferSelect;
  eMode: typeof schema.eMode.$inferSelect | null;
  userEMode?: typeof schema.userEMode.$inferSelect | null;
  underlyingTokenPrice: bigint;
}

export interface UserPositionDataWithMetrics extends UserPositionData {
  metrics: {
    storedBorrowAssets: bigint;
    supplyAssets: bigint;
    borrowUsdValue: string;
    supplyUsdValue: string;
  };
}

export interface BiggestUserPositions {
  biggestBorrowPosition: UserPositionDataWithMetrics;
  biggestCollateralPosition: UserPositionDataWithMetrics;
}

export interface LiquidationData {
  borrower: Address;
  repayAmount: bigint;
  borrowPToken: Address;
  collateralPToken: Address;
}
