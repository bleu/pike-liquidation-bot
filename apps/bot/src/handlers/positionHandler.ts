import { AllUserPositions, AllUserPositionsWithValue } from "../types";
import { PriceHandler } from "./priceHandler";
import { Address, formatUnits } from "viem";
import { getUserPositionsUpdatesAfterBlock } from "#/services/ponder/positions";
import { logger } from "../services/logger";
import { getUnderlying } from "@pike-liq-bot/utils";
import { MarketHandler } from "./marketHandler";

export class PositionHandler {
  public allPositions: Record<Address, AllUserPositions> = {};
  public lastUpdateGt?: bigint = undefined;

  constructor(
    private readonly priceHandler: PriceHandler,
    private readonly marketHandler: MarketHandler,
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

    logger.debug(
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

  getUserPositionWithValue(
    userPosition: AllUserPositions
  ): AllUserPositionsWithValue {
    logger.debug("Calculating USD values for all positions", {
      class: "PositionHandler",
    });

    const userPositionsWithUsdValue = userPosition.positions.map((position) => {
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
          tokenPrice,
        }
      );

      return {
        ...position,
        balanceUsdValue,
        borrowedUsdValue,
        tokenPrice,
      };
    });

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
  }

  getUpdatedPositions(userPositions: AllUserPositions) {
    logger.debug("Updating positions", {
      class: "LiquidationHandler",
      user: userPositions.id,
    });

    return {
      ...userPositions,
      positions: Object.values(userPositions.positions).map((position) => {
        const marketHandler = this.marketHandler.markets[position.marketId];
        if (!marketHandler) {
          throw new Error("Market handler not found");
        }

        return {
          ...position,
          borrowed: marketHandler.calculateBorrowBalancePlusEffects(position),
        };
      }),
    };
  }
}
