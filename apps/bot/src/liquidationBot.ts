import { Address } from "viem";
import { AllUserPositionsWithValue } from "./types";
import { PriceHandler } from "./handlers/priceHandler";
import { PositionHandler } from "./handlers/positionHandler";
import { LiquidationHandler } from "./handlers/liquidationHandler";
import { PikeClient } from "./services/clients";
import { logger } from "./services/logger";
import { getUnderlying } from "@pike-liq-bot/utils";
import { LiquidationAllowanceHandler } from "./handlers/liquidationAllowanceHandler";

export class LiquidationBot {
  private onLiquidation: Address[] = [];
  private priceHandler: PriceHandler;
  private positionHandler: PositionHandler;
  private liquidationHandler: LiquidationHandler;
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
    this.positionHandler = new PositionHandler(
      this.priceHandler,
      minCollateralUsdValue
    );
    this.liquidationHandler = new LiquidationHandler(
      pikeClient,
      minProfitUsdValue
    );
    this.liquidationAllowanceHandler = new LiquidationAllowanceHandler(
      this.priceHandler
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

  public updatePricesAndCheckForLiquidation = async () => {
    await this.priceHandler.updatePrices();

    const allUserPositionsWithValue =
      this.positionHandler.getAllPositionsWithUsdValue();

    const liquidatablePositions = allUserPositionsWithValue.filter(
      (userPosition) =>
        this.liquidationAllowanceHandler.checkLiquidationAllowed(
          userPosition
        ) && !this.onLiquidation.includes(userPosition.id)
    );

    logger.info(
      `Found ${liquidatablePositions.length} liquidatable positions`,
      {
        class: "LiquidationBot",
      }
    );

    liquidatablePositions.forEach(this.liquidatePosition);
    liquidatablePositions.forEach((position) =>
      this.onLiquidation.push(position.id)
    );
  };

  private liquidatePosition = async (data: AllUserPositionsWithValue) => {
    const repayAmount = this.liquidationHandler.checkAmountToLiquidate(data);

    if (repayAmount > 0n) {
      logger.info(`Liquidating position for borrower ${data.id}`, {
        class: "LiquidationBot",
      });

      const liquidationData =
        this.liquidationHandler.getLiquidationDataFromAllUserPositions(data);

      if (!liquidationData) {
        logger.error("No liquidation data found", {
          class: "LiquidationBot",
          borrower: data.id,
        });
        return;
      }

      const liquidationReceipt =
        await this.liquidationHandler.liquidatePosition({
          borrower: liquidationData.borrower,
          borrowPToken: liquidationData.biggestBorrowPosition.marketId,
          repayAmount,
          collateralPToken: liquidationData.biggestCollateralPosition.marketId,
          borrowTokenPrice: this.priceHandler.getPrice(
            getUnderlying(liquidationData.biggestBorrowPosition.marketId)
          ),
          collateralTokenPrice: this.priceHandler.getPrice(
            getUnderlying(liquidationData.biggestCollateralPosition.marketId)
          ),
        });

      if (liquidationReceipt) {
        logger.info(
          `Position liquidated for borrower ${liquidationData.borrower} on tx: ${liquidationReceipt}`
        );
      }

      this.onLiquidation = this.onLiquidation.filter((id) => id !== data.id);
    }
  };
}
