import { Address } from "viem";
import { LiquidationData } from "./types";
import { PriceHandler } from "./handlers/priceHandler";
import { PositionHandler } from "./handlers/positionHandler";
import { LiquidationHandler } from "./handlers/liquidationHandler";
import { ContractReader } from "./services/contractReader";
import { PikeClient, publicClient } from "./services/clients";
import { getUnderlying } from "./utils/consts";
import { logger } from "./services/logger";

export class LiquidationBot {
  private onMonitoringData: Record<
    Address,
    { data: LiquidationData; unwatchFn: () => void }
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

  private startOrUpdateMonitorPosition = (data: LiquidationData) => {
    this.stopMonitorPosition(data.borrower);

    logger.debug(`Starting monitoring for borrower ${data.borrower}`, {
      class: "LiquidationBot",
    });

    const unwatchFn = publicClient.watchBlocks({
      onBlock: async (block) => {
        logger.info(`Checking liquidation for borrower ${data.borrower}`, {
          class: "LiquidationBot",
          blockNumber: block.number.toString(),
        });

        const amountToLiquidate =
          await this.liquidationHandler.checkAmountToLiquidate({
            borrowPToken: data.biggestBorrowPosition.marketId,
            borrower: data.borrower,
            collateralPToken: data.biggestCollateralPosition.marketId,
            borrowAmount: data.biggestBorrowPosition.borrowed,
          });

        if (amountToLiquidate > 0n) {
          logger.info(`Liquidating position for borrower ${data.borrower}`, {
            class: "LiquidationBot",
            blockNumber: block.number.toString(),
            marketId: data.biggestBorrowPosition.marketId,
          });

          const liquidationReceipt =
            await this.liquidationHandler.liquidatePosition({
              borrower: data.borrower,
              borrowPToken: data.biggestBorrowPosition.marketId,
              amountToLiquidate,
              collateralPToken: data.biggestCollateralPosition.marketId,
              borrowTokenPrice: this.priceHandler.getPrice(
                getUnderlying(data.biggestBorrowPosition.marketId)
              ),
              collateralTokenPrice: this.priceHandler.getPrice(
                getUnderlying(data.biggestCollateralPosition.marketId)
              ),
            });

          logger.info(
            `Position liquidated for borrower ${data.borrower} on tx: ${liquidationReceipt.transactionHash}`
          );
          return true;
        }
        return false;
      },
    });

    this.onMonitoringData[data.borrower] = { data, unwatchFn };
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
