import { formatEther } from "viem";
import { MathSol } from "@pike-liq-bot/utils";
import { schema } from "#/utils/ponder/ponderClient";

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

export function calculateUserBalanceMetrics(userBalanceWithPToken: {
  userBalance: typeof schema.userBalance.$inferSelect;
  pToken: typeof schema.pToken.$inferSelect;
  underlyingTokenPrice: bigint;
}) {
  const storedBorrowAssets = calculateStoredBorrowAssets(
    userBalanceWithPToken.userBalance.borrowAssets,
    userBalanceWithPToken.pToken.borrowIndex,
    userBalanceWithPToken.userBalance.interestIndex
  );

  const supplyAssets = sharesToAssets(
    userBalanceWithPToken.userBalance.supplyShares,
    userBalanceWithPToken.pToken.exchangeRateStored
  );

  return {
    storedBorrowAssets,
    supplyAssets,
    borrowUsdValue: calculateUsdValueFromAssets(
      storedBorrowAssets,
      userBalanceWithPToken.underlyingTokenPrice
    ),
    supplyUsdValue: calculateUsdValueFromAssets(
      supplyAssets,
      userBalanceWithPToken.underlyingTokenPrice
    ),
  };
}
