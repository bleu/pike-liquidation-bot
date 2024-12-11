import { AllUserPositions, AllUserPositionsWithValue } from "../types";
import { PriceHandler } from "./priceHandler";
import { Address, formatUnits } from "viem";
import { getUserPositionsUpdatesAfterBlock } from "#/services/ponder/positions";
import { logger } from "../services/logger";
import { getUnderlying } from "@pike-liq-bot/utils";

export class PositionHandler {
  public allPositions: Record<Address, AllUserPositions> = {};
  public lastUpdateGt?: bigint = undefined;

  constructor(
    private readonly priceHandler: PriceHandler,
    public minCollateralUsdValue: number = 500
  ) {
    logger.debug("Initializing PositionHandler");
  }

  async updatePositions() {
    logger.debug("Updating positions...", {
      class: "PositionHandler",
      lastUpdateGt: this.lastUpdateGt?.toString(),
    });

    const newUserPositions = await getUserPositionsUpdatesAfterBlock(
      this.lastUpdateGt
    );

    logger.info(
      `Retrieved ${Object.keys(newUserPositions).length} new positions`,
      {
        class: "PositionHandler",
      }
    );

    newUserPositions.forEach((userPosition) => {
      this.allPositions[userPosition.id] = userPosition;
      logger.debug(`Updated position for user ${userPosition.id}`, {
        class: "PositionHandler",
        positionsCount: userPosition.positions.length,
      });
    });

    const allUpdatedAt = Object.values(newUserPositions).map(
      ({ lastUpdated }) => lastUpdated
    );

    this.lastUpdateGt = allUpdatedAt.length
      ? BigInt(Math.max(...allUpdatedAt.map(Number)))
      : this.lastUpdateGt;

    logger.debug("Updated lastUpdateGt", {
      class: "PositionHandler",
      newLastUpdateGt: this.lastUpdateGt?.toString(),
    });
  }

  getAllPositionsWithUsdValue(): AllUserPositionsWithValue[] {
    logger.debug("Calculating USD values for all positions", {
      class: "PositionHandler",
    });

    return Object.values(this.allPositions).map((userPosition) => {
      const userPositionsWithUsdValue = userPosition.positions.map(
        (position) => {
          const underlying = getUnderlying(position.marketId);
          const tokenPrice = this.priceHandler.getPrice(underlying);

          const balanceUsdValue = Number(
            formatUnits(position.balance * tokenPrice, 36)
          );
          const borrowedUsdValue = Number(
            formatUnits(position.borrowed * tokenPrice, 36)
          );

          logger.debug(
            `Calculated USD values for position in market ${position.marketId}`,
            {
              class: "PositionHandler",
              user: userPosition.id,
              marketId: position.marketId,
              balanceUsdValue,
              borrowedUsdValue,
            }
          );

          return {
            ...position,
            balanceUsdValue,
            borrowedUsdValue,
          };
        }
      );

      const onMarketPositions = userPositionsWithUsdValue.filter(
        (position) => position.isOnMarket
      );
      const totalCollateralUsdValue = onMarketPositions
        .map((position) => position.balanceUsdValue)
        .reduce((acc, value) => acc + value, 0);
      const totalBorrowedUsdValue = onMarketPositions
        .map((position) => position.borrowedUsdValue)
        .reduce((acc, value) => acc + value, 0);

      logger.debug(`Calculated totals for user ${userPosition.id}`, {
        class: "PositionHandler",
        totalCollateralUsdValue,
        totalBorrowedUsdValue,
      });

      return {
        ...userPosition,
        positions: userPositionsWithUsdValue,
        totalBorrowedUsdValue,
        totalCollateralUsdValue,
      };
    });
  }

  getDataToMonitor(): AllUserPositionsWithValue[] {
    logger.debug("Getting positions to monitor", {
      class: "PositionHandler",
    });

    const allPositionsWithValue = this.getAllPositionsWithUsdValue();
    return allPositionsWithValue.filter(
      (position) =>
        position.totalCollateralUsdValue > this.minCollateralUsdValue
    );
  }
}
