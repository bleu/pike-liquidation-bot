import { Address } from "viem";

export interface UserPositionData {
  marketId: Address;
  balance: bigint;
  borrowed: bigint;
  isOnMarket: boolean;
  interestIndex?: bigint;
}
export interface UserPositionDataWithValue extends UserPositionData {
  balanceUsdValue: number;
  borrowedUsdValue: number;
}

export interface AllUserPositions {
  id: Address;
  lastUpdated: bigint;
  positions: UserPositionData[];
}

export interface AllUserPositionsWithValue {
  id: Address;
  lastUpdated: bigint;
  positions: UserPositionDataWithValue[];
  totalCollateralUsdValue: number;
  totalBorrowedUsdValue: number;
}

export interface LiquidationData {
  borrower: Address;
  biggestBorrowPosition: UserPositionData;
  biggestCollateralPosition: UserPositionData;
}

export interface MarketParameters {
  borrowIndex: bigint;
  totalBorrows: bigint;
  totalReserves: bigint;
  totalSupply: bigint;
  cash: bigint;
  liquidationThreshold: bigint;
  lastUpdated: bigint;
}

export const defaultUserPositionData: UserPositionDataWithValue = {
  marketId: "0x0",
  balance: 0n,
  borrowed: 0n,
  balanceUsdValue: 0,
  borrowedUsdValue: 0,
  isOnMarket: false,
};
