import { Address } from "viem";
import { AllUserPositionsWithValue } from "./types";
import { PriceHandler } from "./handlers/priceHandler";
import { PositionHandler } from "./handlers/positionHandler";
import { LiquidationHandler } from "./handlers/liquidationHandler";
import { ContractReader } from "./services/contractReader";
import { PikeClient, publicClient } from "./services/clients";
import { logger } from "./services/logger";
import { getUnderlying } from "@pike-liq-bot/utils";

export class LiquidationBot {
  private onMonitoringData: Record<
    Address,
    { data: AllUserPositionsWithValue; unwatchFn: () => void }
  > = {};

  private blockNumber?: bigint = undefined;

  private contractReader: ContractReader;
  private priceHandler: PriceHandler;
  private positionHandler: PositionHandler;
  private liquidationHandler: LiquidationHandler;

  constructor({
    pikeClient,
    positionsToMonitorLimit = 2,
    minCollateralUsdValue = 500,
  }: {
    pikeClient: PikeClient;
    positionsToMonitorLimit?: number;
    minCollateralUsdValue?: number;
  }) {
    this.contractReader = new ContractReader(publicClient);
    this.priceHandler = new PriceHandler(this.contractReader);
    this.positionHandler = new PositionHandler(
      this.priceHandler,
      positionsToMonitorLimit,
      minCollateralUsdValue
    );
    this.liquidationHandler = new LiquidationHandler(
      this.contractReader,
      pikeClient
    );
  }

  startToMonitor = async () => {
    await this.updatePositionsToMonitor();
  };

  stop = () => {
    Object.keys(this.onMonitoringData).forEach((borrower) =>
      this.stopMonitorPosition(borrower as Address)
    );
  };

  public updatePositionsToMonitor = async () => {
    logger.debug("Updating positions...", {
      class: "LiquidationBot",
    });

    await this.priceHandler.updatePrices(this.blockNumber);
    await this.positionHandler.updatePositions();
    await this.liquidationHandler.updateRiskEngineParameters();

    const newDataToMonitor = this.positionHandler.getDataToMonitor();

    logger.debug(`Found ${newDataToMonitor.length} positions to monitor`, {
      class: "LiquidationBot",
    });

    // Stop existing position monitoring
    Object.keys(this.onMonitoringData).forEach((borrower) =>
      this.stopMonitorPosition(borrower as Address)
    );

    newDataToMonitor.forEach(this.startOrUpdateMonitorPosition);
  };

  private startOrUpdateMonitorPosition = (data: AllUserPositionsWithValue) => {
    this.stopMonitorPosition(data.id);

    logger.debug(`Starting monitoring for borrower ${data.id}`, {
      class: "LiquidationBot",
    });

    const unwatchFn = publicClient.watchBlocks({
      onBlock: async (block) => {
        logger.info(`Checking liquidation for borrower ${data.id}`, {
          class: "LiquidationBot",
          blockNumber: block.number.toString(),
        });

        const isAllowed = this.liquidationHandler.checkLiquidationAllowed(data);

        if (!isAllowed) return;

        const repayAmount =
          this.liquidationHandler.checkAmountToLiquidate(data);

        if (repayAmount > 0n) {
          logger.info(`Liquidating position for borrower ${data.id}`, {
            class: "LiquidationBot",
            blockNumber: block.number.toString(),
          });

          const liquidationData =
            this.liquidationHandler.getLiquidationDataFromAllUserPositions(
              data
            );

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
              collateralPToken:
                liquidationData.biggestCollateralPosition.marketId,
              borrowTokenPrice: this.priceHandler.getPrice(
                getUnderlying(liquidationData.biggestBorrowPosition.marketId)
              ),
              collateralTokenPrice: this.priceHandler.getPrice(
                getUnderlying(
                  liquidationData.biggestCollateralPosition.marketId
                )
              ),
            });

          logger.info(
            `Position liquidated for borrower ${liquidationData.borrower} on tx: ${liquidationReceipt.transactionHash}`
          );
          return true;
        }
        return false;
      },
    });

    this.onMonitoringData[data.id] = { data, unwatchFn };
  };

  private stopMonitorPosition = (borrower: Address) => {
    if (this.onMonitoringData[borrower]) {
      this.onMonitoringData[borrower].unwatchFn();
      delete this.onMonitoringData[borrower];
    }
  };

  setBlockNumber = (blockNumber: bigint) => {
    this.blockNumber = blockNumber;
  };
}
