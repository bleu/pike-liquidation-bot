import { Address } from "viem";
import { LiquidationData } from "./types";
import { PriceHandler } from "./handlers/priceHandler";
import { PositionHandler } from "./handlers/positionHandler";
import { LiquidationHandler } from "./handlers/liquidationHandler";
import { ContractReader } from "./services/contractReader";
import { PikeClient, publicClient } from "./services/clients";
import { getUserPositionsUpdatesAfterBlock } from "./services/ponderQuerier";

export class LiquidationBot {
  private unwatchesFn: Record<Address, () => void> = {};
  private blockNumber?: bigint = undefined;
  private positions: Record<Address, LiquidationData> = {};
  private lastUpdateGt?: bigint = undefined;

  private contractReader: ContractReader;
  private priceHandler: PriceHandler;
  private positionHandler: PositionHandler;
  private liquidationHandler: LiquidationHandler;

  constructor({ pikeClient }: { pikeClient: PikeClient }) {
    this.contractReader = new ContractReader(publicClient);
    this.priceHandler = new PriceHandler(this.contractReader);
    this.positionHandler = new PositionHandler(this.priceHandler);
    this.liquidationHandler = new LiquidationHandler(
      this.contractReader,
      pikeClient
    );
  }

  startToMonitor = async () => {
    await this.updateTokenPrices();
    await this.updatePositionsToMonitor();
  };

  stop = () => {
    Object.keys(this.unwatchesFn).forEach((borrower) =>
      this.stopMonitorPosition(borrower as Address)
    );
  };

  private updateTokenPrices = async () => {
    await this.priceHandler.updatePrices(this.blockNumber);
  };

  private updatePositionsToMonitor = async () => {
    const userPositions = await getUserPositionsUpdatesAfterBlock(
      this.lastUpdateGt
    );

    const liquidationData = userPositions
      .map((pos) =>
        this.positionHandler.getLiquidationDataFromAllUserPositions(pos)
      )
      .filter((data) => data !== undefined) as LiquidationData[];

    liquidationData.forEach(this.startOrUpdateMonitorPosition);
  };

  private startOrUpdateMonitorPosition = (data: LiquidationData) => {
    this.stopMonitorPosition(data.borrower);

    const unwatchesFn = publicClient.watchBlocks({
      onBlock: async (block) => {
        const amountToLiquidate = data.biggestCollateralPosition.balance / 2n;
        const liquidationAllowed =
          await this.liquidationHandler.checkLiquidationAllowed({
            borrowPToken: data.biggestBorrowPosition.marketId,
            borrower: data.borrower,
            collateralPToken: data.biggestCollateralPosition.marketId,
            amountToLiquidate,
          });

        if (liquidationAllowed) {
          await this.liquidationHandler.liquidatePosition({
            borrower: data.borrower,
            borrowPToken: data.biggestBorrowPosition.marketId,
            amountToLiquidate,
            collateralPToken: data.biggestCollateralPosition.marketId,
          });
          return true;
        }
        return false;
      },
    });

    this.unwatchesFn[data.borrower] = unwatchesFn;
    this.positions[data.borrower] = data;
  };

  private stopMonitorPosition = (borrower: Address) => {
    if (this.unwatchesFn[borrower]) {
      this.unwatchesFn[borrower]();
    }
  };

  setBlockNumber = (blockNumber: bigint) => {
    this.blockNumber = blockNumber;
  };
}
