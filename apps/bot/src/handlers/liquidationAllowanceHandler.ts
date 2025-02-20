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
  constructor(private readonly minCollateralUsdValue: string = "0") {
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
      ({ healthIndex, totalCollateralUsdValue }) => {
        const healthIndexNegative = healthIndex < parseEther("1");
        const aboveCollateral =
          totalCollateralUsdValue > parseEther(this.minCollateralUsdValue);
        return healthIndexNegative && aboveCollateral;
      }
    );

    return usersToLiquidateMetrics.map(({ userBalancesWithMetrics }) => {
      const sortedBorrowPositions = [...userBalancesWithMetrics].sort(
        (a, b) =>
          Number(b.metrics.borrowUsdValue) - Number(a.metrics.borrowUsdValue)
      );

      const sortedCollateralPosition = [...userBalancesWithMetrics]
        .filter((balance) => balance.userBalance.isCollateral)
        .sort(
          (a, b) =>
            Number(b.metrics.supplyUsdValue) - Number(a.metrics.supplyUsdValue)
        );

      const firstBorrowPosition = sortedBorrowPositions[0];
      const firstCollateralPosition = sortedCollateralPosition[0];

      if (firstBorrowPosition.pToken.id !== firstCollateralPosition.pToken.id) {
        return {
          biggestBorrowPosition: firstBorrowPosition,
          biggestCollateralPosition: firstCollateralPosition,
        };
      }

      return {
        biggestBorrowPosition: firstBorrowPosition,
        biggestCollateralPosition: sortedCollateralPosition[1],
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
              BigInt(liquidationThreshold)
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

    const healthIndex =
      totalBorrowUsdValue === 0n
        ? parseEther("999")
        : MathSol.divDownFixed(
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
