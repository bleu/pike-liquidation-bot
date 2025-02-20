import { Address } from "viem";
import { EMode, PToken, UserBalance } from "./utils/graphql/generated/graphql";

export interface UserPositionData {
  userBalance: UserBalance;
  pToken: Pick<
    PToken,
    | "id"
    | "address"
    | "decimals"
    | "liquidationThreshold"
    | "liquidationIncentive"
    | "reserveFactor"
    | "collateralFactor"
    | "closeFactor"
    | "supplyCap"
    | "borrowCap"
    | "exchangeRateStored"
    | "borrowIndex"
    | "underlyingPriceCurrent"
  >;
  eMode?: Pick<
    EMode,
    | "id"
    | "categoryId"
    | "collateralFactor"
    | "liquidationThreshold"
    | "liquidationIncentive"
  >;
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
