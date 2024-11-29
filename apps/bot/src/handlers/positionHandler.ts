import {
  AllUserPositions,
  AllUserPositionsWithValue,
  LiquidationData,
  defaultUserPositionData,
} from "../types";
import { PriceHandler } from "./priceHandler";
import { getDecimals, getUnderlying } from "#/utils/consts";
import { Address, formatUnits } from "viem";
import { getUserPositionsUpdatesAfterBlock } from "#/services/ponderQuerier";

export class PositionHandler {
  public allPositions: Record<Address, AllUserPositions> = {};
  public lastUpdateGt?: bigint = undefined;

  constructor(
    private readonly priceHandler: PriceHandler,
    public positionsToMonitorLimit: number = 2,
    public minCollateralUsdValue: number = 500
  ) {}

  async updatePositions() {
    const newUserPositions = await getUserPositionsUpdatesAfterBlock(
      this.lastUpdateGt
    );

    newUserPositions.forEach((userPosition) => {
      this.allPositions[userPosition.id] = userPosition;
    });

    const allUpdatedAt = Object.values(newUserPositions).map(
      ({ lastUpdated }) => lastUpdated
    );

    this.lastUpdateGt = BigInt(Math.max(...allUpdatedAt.map(Number)));
  }

  getAllPositionsWithUsdValue(): AllUserPositionsWithValue[] {
    return Object.values(this.allPositions).map((userPosition) => {
      const userPositionsWithUsdValue = userPosition.positions.map(
        (position) => {
          const underlying = getUnderlying(position.marketId);
          const tokenPrice = this.priceHandler.getPrice(underlying);
          const decimals = Number(getDecimals(underlying));

          const balanceUsdValue = Number(
            formatUnits(position.balance * tokenPrice, 6 + decimals)
          );
          const borrowedUsdValue = Number(
            formatUnits(position.borrowed * tokenPrice, 6 + decimals)
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

      return {
        ...userPosition,
        positions: userPositionsWithUsdValue,
        totalBorrowedUsdValue,
        totalCollateralUsdValue,
      };
    });
  }

  getDataToMonitor(): LiquidationData[] {
    const allPositionsWithValue = this.getAllPositionsWithUsdValue();
    const allPositionsFiltered = allPositionsWithValue.filter(
      (position) =>
        position.totalCollateralUsdValue > this.minCollateralUsdValue
    );
    const allPositionsToMonitor = allPositionsFiltered
      .sort((a, b) => {
        const diffA =
          (a.totalCollateralUsdValue - a.totalBorrowedUsdValue) /
          a.totalCollateralUsdValue;

        const diffB =
          (b.totalCollateralUsdValue - b.totalBorrowedUsdValue) /
          b.totalCollateralUsdValue;

        return diffA - diffB; // Sort ascending to get smallest differences first
      })
      .slice(0, this.positionsToMonitorLimit);
    return allPositionsToMonitor
      .map((allPositions) =>
        this.getLiquidationDataFromAllUserPositions(allPositions)
      )
      .filter((data) => !!data);
  }

  findBiggestPositionTypeFromAllUserPositions(
    userPositions: AllUserPositionsWithValue,
    isCollateral: boolean
  ) {
    const biggestPosition = userPositions.positions.reduce(
      (biggest, position) => {
        if (!position.isOnMarket) return biggest;
        const biggestAmount = isCollateral
          ? biggest.balanceUsdValue
          : biggest.borrowedUsdValue;
        const positionAmount = isCollateral
          ? position.balanceUsdValue
          : position.borrowedUsdValue;

        return positionAmount > biggestAmount ? position : biggest;
      },
      defaultUserPositionData
    );

    return biggestPosition.isOnMarket ? biggestPosition : undefined;
  }

  getLiquidationDataFromAllUserPositions(
    userPosition: AllUserPositionsWithValue
  ): LiquidationData | undefined {
    const biggestBorrowPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, false);
    const biggestCollateralPosition =
      this.findBiggestPositionTypeFromAllUserPositions(userPosition, true);

    if (!biggestBorrowPosition || !biggestCollateralPosition) {
      return undefined;
    }

    return {
      borrower: userPosition.id,
      biggestBorrowPosition,
      biggestCollateralPosition,
    };
  }
}
