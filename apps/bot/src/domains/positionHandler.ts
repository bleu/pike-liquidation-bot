import {
  AllUserPositions,
  LiquidationData,
  defaultUserPositionData,
} from "../types";
import { PriceHandler } from "./priceHandler";
import { getUnderlying } from "#/utils/consts";

export class PositionHandler {
  constructor(private readonly priceHandler: PriceHandler) {}

  findBiggestPositionTypeFromAllUserPositions(
    userPositions: AllUserPositions,
    isCollateral: boolean
  ) {
    const biggestPosition = userPositions.positions.reduce(
      (biggest, position) => {
        if (!position.isOnMarket) return biggest;
        const biggestAmount = isCollateral ? biggest.balance : biggest.borrowed;
        const biggestValue =
          biggest.marketId === "0x0"
            ? 0n
            : biggestAmount *
              this.priceHandler.getPrice(getUnderlying(biggest.marketId));

        const positionAmount = isCollateral
          ? position.balance
          : position.borrowed;
        const positionValue =
          positionAmount *
          this.priceHandler.getPrice(getUnderlying(position.marketId));
        return positionValue > biggestValue ? position : biggest;
      },
      defaultUserPositionData
    );

    return biggestPosition.isOnMarket ? biggestPosition : undefined;
  }

  getLiquidationDataFromAllUserPositions(
    userPosition: AllUserPositions
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
