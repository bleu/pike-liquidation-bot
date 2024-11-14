import { Address } from "viem";

export interface UserPositionData {
  marketId: Address;
  balance: bigint;
  borrowed: bigint;
  isOnMarket: boolean;
}

export interface AllUserPositions {
  id: Address;
  positions: UserPositionData[];
}

export interface LiquidationData {
  borrower: Address;
  biggestBorrowPosition: UserPositionData;
  biggestCollateralPosition: UserPositionData;
}

export const defaultUserPositionData: UserPositionData = {
  marketId: "0x0",
  balance: 0n,
  borrowed: 0n,
  isOnMarket: false,
};
