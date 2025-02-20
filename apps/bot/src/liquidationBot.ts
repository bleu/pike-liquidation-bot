import { LiquidationHandler } from "./handlers/liquidationHandler";
import { PikeClient } from "./services/clients";
import { logger } from "./services/logger";
import { LiquidationAllowanceHandler } from "./handlers/liquidationAllowanceHandler";
import { DataLoaderHandler } from "./handlers/dataLoaderHandler";

export class LiquidationBot {
  private dataLoaderHandler: DataLoaderHandler;
  private liquidationHandler: LiquidationHandler;
  private liquidationAllowanceHandler: LiquidationAllowanceHandler;

  constructor({
    pikeClient,
    protocolId,
  }: {
    pikeClient: PikeClient;
    protocolId: string;
  }) {
    logger.info("Initializing LiquidationBot", {
      class: "LiquidationBot",
      protocolId: protocolId,
    });
    this.dataLoaderHandler = new DataLoaderHandler(protocolId);
    this.liquidationHandler = new LiquidationHandler(pikeClient);
    this.liquidationAllowanceHandler = new LiquidationAllowanceHandler();
  }

  public runLiquidationCycle = async () => {
    logger.info("Starting liquidation cycle", {
      class: "LiquidationBot",
    });
    const usersData = await this.dataLoaderHandler.loadUserPositionData();
    const usersToLiquidateBiggestPositions =
      this.liquidationAllowanceHandler.getUsersToLiquidateBiggestPositions(
        usersData
      );

    logger.info(
      `${usersToLiquidateBiggestPositions.length} to liquidate positions found `,
      {
        class: "LiquidationBot",
        users: usersToLiquidateBiggestPositions.map(
          (user) => user.biggestBorrowPosition.userBalance.userId
        ),
        data: usersToLiquidateBiggestPositions,
      }
    );
    usersToLiquidateBiggestPositions.forEach(async (userBiggestPosition) => {
      try {
        const liquidationData =
          this.liquidationHandler.getLiquidationDataFromBiggestUserPositions(
            userBiggestPosition
          );
        await this.liquidationHandler.liquidatePosition(liquidationData);
      } catch (error) {
        logger.error("Failed to liquidate position", {
          class: "Liquidation",
          address: userBiggestPosition.biggestBorrowPosition.userBalance.userId,
          error,
        });
      }
    });
  };
}
