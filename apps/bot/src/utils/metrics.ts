import { formatEther } from "viem";
import { MathSol } from "@pike-liq-bot/utils";
import { UserPositionData } from "#/types";

const YEAR = BigInt(365 * 24 * 60 * 60);

export function calculateStoredBorrowAssets(
  borrowAssets: bigint,
  borrowIndex: bigint,
  interestIndex: bigint
) {
  return MathSol.divDownFixed(
    MathSol.mulDownFixed(borrowAssets, borrowIndex),
    interestIndex
  );
}

export function sharesToAssets(shares: bigint, exchangeRate: bigint) {
  return MathSol.mulDownFixed(shares, exchangeRate);
}

export function assetsToShares(assets: bigint, exchangeRate: bigint) {
  return MathSol.divDownFixed(assets, exchangeRate);
}

export function currentRatePerSecondToAPY(ratePerSecond: bigint) {
  return formatEther(ratePerSecond * YEAR);
}

export function calculateUsdValueFromShares(
  shares: bigint,
  exchangeRate: bigint,
  underlyingPrice: bigint
) {
  return formatEther(
    MathSol.mulDownFixed(sharesToAssets(shares, exchangeRate), underlyingPrice)
  );
}

export function calculateUsdValueFromAssets(
  assets: bigint,
  underlyingPrice: bigint
) {
  return formatEther(MathSol.mulDownFixed(assets, underlyingPrice));
}

export function calculateUserBalanceMetrics(
  userPositionData: UserPositionData
) {
  const storedBorrowAssets = calculateStoredBorrowAssets(
    userPositionData.userBalance.borrowAssets,
    userPositionData.pToken.borrowIndex,
    userPositionData.userBalance.interestIndex
  );

  const supplyAssets = sharesToAssets(
    userPositionData.userBalance.supplyShares,
    userPositionData.pToken.exchangeRateStored
  );

  return {
    storedBorrowAssets,
    supplyAssets,
    borrowUsdValue: calculateUsdValueFromAssets(
      storedBorrowAssets,
      userPositionData.underlyingTokenPrice
    ),
    supplyUsdValue: calculateUsdValueFromAssets(
      supplyAssets,
      userPositionData.underlyingTokenPrice
    ),
  };
}
