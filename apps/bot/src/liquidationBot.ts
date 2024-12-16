import { Address } from "viem";
import { LiquidationData } from "./types";
import { PriceHandler } from "./handlers/priceHandler";
import { PositionHandler } from "./handlers/positionHandler";
import { LiquidationHandler } from "./handlers/liquidationHandler";
import { PikeClient } from "./services/clients";
import { logger } from "./services/logger";
import { LiquidationAllowanceHandler } from "./handlers/liquidationAllowanceHandler";
import { MarketHandler } from "./handlers/marketHandler";

export class LiquidationBot {
  private onLiquidation: Address[] = [];
  private priceHandler: PriceHandler;
  private positionHandler: PositionHandler;
  private liquidationHandler: LiquidationHandler;
  private marketHandler: MarketHandler;
  private liquidationAllowanceHandler: LiquidationAllowanceHandler;

  constructor({
    pikeClient,
    minCollateralUsdValue = 500,
    minProfitUsdValue,
  }: {
    pikeClient: PikeClient;
    positionsToMonitorLimit?: number;
    minCollateralUsdValue?: number;
    minProfitUsdValue?: number;
  }) {
    this.priceHandler = new PriceHandler();
    this.marketHandler = new MarketHandler();
    this.positionHandler = new PositionHandler(
      this.priceHandler,
      this.marketHandler,
      minCollateralUsdValue
    );
    this.liquidationHandler = new LiquidationHandler(
      pikeClient,
      this.marketHandler,
      minProfitUsdValue
    );
    this.liquidationAllowanceHandler = new LiquidationAllowanceHandler(
      this.priceHandler,
      this.marketHandler
    );
  }

  public updatePositionsToMonitor = async () => {
    logger.debug("Updating positions...", {
      class: "LiquidationBot",
    });

    return Promise.all([
      this.positionHandler.updatePositions(),
      this.liquidationHandler.updateRiskEngineParameters(),
    ]);
  };

  public updateMarketHandlerParameters = async () => {
    await this.marketHandler.updateMarketHandlerParameters();
  };

  public updatePricesAndCheckForLiquidation = async () => {
    await this.priceHandler.updatePrices();

    logger.info("updatePricesAndCheckForLiquidation", {
      allPositionsLength: Object.values(this.positionHandler.allPositions)
        .length,
      onLiquidationLength: this.onLiquidation.length,
    });

    const liquidatablePositions = Object.values(
      this.positionHandler.allPositions
    ).filter(
      (userPosition) =>
        this.liquidationAllowanceHandler.checkLiquidationAllowed(
          userPosition
        ) && !this.onLiquidation.includes(userPosition.id)
    );

    logger.info(
      `Found ${liquidatablePositions.length} liquidatable positions`,
      {
        class: "LiquidationBot",
        addresses: liquidatablePositions.map((position) => position.id),
      }
    );

    const liquidationPositionUpdatedWithValue = liquidatablePositions
      .map((position) => this.positionHandler.getUpdatedPositions(position))
      .map((position) =>
        this.positionHandler.getUserPositionWithValue(position)
      );

    const biggestUserPostions = liquidationPositionUpdatedWithValue
      .map((position) =>
        this.liquidationHandler.getBiggestPositionsFromAllUserPositions(
          position
        )
      )
      .filter((position) => !!position);

    const liquidationData = biggestUserPostions
      .map((position) =>
        this.liquidationHandler.getLiquidationDataFromBiggestUserPositions(
          position
        )
      )
      .filter((position) =>
        this.liquidationHandler.checkIfLiquidationIsAboveProfitThreshold(
          position.expectedProfitUsdValue
        )
      );

    logger.info(
      `Found ${liquidationData.length} liquidatable positions that passing the filters`,
      {
        class: "LiquidationBot",
        addresses: liquidationData.map((position) => position.borrower),
      }
    );

    liquidationData.forEach((data) => {
      this.onLiquidation.push(data.borrower);
      this.liquidatePosition(data);
    });
  };

  private liquidatePosition = async (data: LiquidationData) => {
    await this.liquidationHandler
      .liquidatePosition(data)
      .then((liquidationReceipt) => {
        logger.info(
          `Position liquidated for borrower ${data.borrower} on tx: ${liquidationReceipt}`
        );
      })
      .catch((error) => {
        logger.error("Failed to liquidate position", {
          class: "LiquidationBot",
          error,
        });
      });

    const index = this.onLiquidation.indexOf(data.borrower);
    if (index > -1) {
      this.onLiquidation = this.onLiquidation.splice(index, 1);
    }
  };
}
