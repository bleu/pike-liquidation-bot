import { logger } from "../services/logger";
import { calculateUserBalanceMetrics } from "#/utils/metrics";
import { parseEther } from "viem";
import {
  BiggestUserPositions,
  UserPositionData,
  UserPositionDataWithMetrics,
} from "#/types";
import { MathSol } from "@pike-liq-bot/utils";

export class LiquidationAllowanceHandler {
  constructor(private readonly minCollateralUsdValue?: string) {
    logger.debug("Initializing LiquidationAllowanceHandler");
  }

  getUsersToLiquidateBiggestPositions(
    userPositionData: UserPositionData[][]
  ): BiggestUserPositions[] {
    logger.debug("Checking liquidation allowance", {
      class: "LiquidationAllowanceHandler",
    });

    const usersMetrics = userPositionData.map(this.getUserMetrics);

    const usersToLiquidateMetrics = usersMetrics.filter(
      ({ healthIndex, totalCollateralUsdValue }) =>
        healthIndex < parseEther("1") &&
        (!this.minCollateralUsdValue ||
          totalCollateralUsdValue > parseEther(this.minCollateralUsdValue))
    );

    return usersToLiquidateMetrics.map(({ userBalancesWithMetrics }) => {
      const biggestBorrowPosition = userBalancesWithMetrics.reduce(
        // @ts-ignore
        (acc, { metrics }) => {
          if (
            parseEther(metrics.borrowUsdValue) >
            parseEther(acc.metrics.borrowUsdValue)
          ) {
            return metrics;
          }
          return acc;
        },
        userBalancesWithMetrics[0]
      );

      const biggestCollateralPosition = userBalancesWithMetrics.reduce(
        // @ts-ignore
        (acc, { metrics }) => {
          if (
            parseEther(metrics.supplyUsdValue) >
            parseEther(acc.metrics.supplyUsdValue)
          ) {
            return metrics;
          }
          return acc;
        },
        userBalancesWithMetrics[0]
      );

      return {
        biggestBorrowPosition,
        biggestCollateralPosition,
      };
    });
  }

  getUserMetrics(data: UserPositionData[]): {
    healthIndex: bigint;
    totalCollateralUsdValue: bigint;
    totalBorrowUsdValue: bigint;
    userBalancesWithMetrics: UserPositionDataWithMetrics[];
  } {
    const userBalancesWithMetrics = data.map((d) => {
      return {
        ...d,
        metrics: calculateUserBalanceMetrics(d),
      };
    });

    const totalCollateralWithLiquidationThreshold =
      userBalancesWithMetrics.reduce(
        (acc, { metrics, eMode, pToken, userBalance }) => {
          if (!userBalance.isCollateral) return acc;

          const liquidationThreshold = eMode
            ? eMode.liquidationThreshold
            : pToken.liquidationThreshold;

          return (
            acc +
            MathSol.divDownFixed(
              parseEther(metrics.supplyUsdValue),
              liquidationThreshold
            )
          );
        },
        0n
      );

    const totalBorrowUsdValue = userBalancesWithMetrics.reduce(
      (acc, { metrics }) => acc + parseEther(metrics.borrowUsdValue),
      0n
    );

    const totalCollateralUsdValue = userBalancesWithMetrics.reduce(
      (acc, { metrics }) => acc + parseEther(metrics.supplyUsdValue),
      0n
    );

    const healthIndex = MathSol.divDownFixed(
      totalCollateralWithLiquidationThreshold,
      totalBorrowUsdValue
    );

    return {
      healthIndex,
      totalCollateralUsdValue,
      totalBorrowUsdValue,
      userBalancesWithMetrics,
    };
  }
}
