import { PublicClient } from "viem";
import { getUnderlying } from "./utils";
import { TransactionFactory } from "./utils/transactions";

export class LiquidationBot {
  address: string;
  transactionFactory: TransactionFactory;
  liquidations: number = 0;
  publicClient: PublicClient;
  unwatchesFn: Record<string, () => void> = {};

  constructor(
    transactionFactory: TransactionFactory,
    address: string,
    publicClient: PublicClient
  ) {
    this.transactionFactory = transactionFactory;
    this.address = address;
    this.publicClient = publicClient;
  }

  checkAndLiquidatePosition = async (
    borrower: string,
    borrowPToken: string,
    collateralPToken: string
  ) => {
    const amount = await this.transactionFactory.getCurrentBorrowAmount(
      borrowPToken,
      borrower
    );
    const amountToLiquidate = amount / 2n;
    const canLiquidate = await this.transactionFactory.checkIfCanLiquidate(
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate
    );
    if (canLiquidate) {
      await this.liquidatePosition(
        borrower,
        borrowPToken,
        amountToLiquidate,
        collateralPToken
      );
      return true;
    }
    return false;
  };

  startMonitorPosition = (
    borrower: string,
    pToken: string,
    collateral: string
  ) => {
    const unwatchesFn = this.publicClient.watchBlocks({
      onBlock: (block) =>
        this.checkAndLiquidatePosition(borrower, pToken, collateral),
    });
    this.unwatchesFn[borrower + pToken + collateral] = unwatchesFn;
  };

  stopMonitorPosition = (
    borrower: string,
    pToken: string,
    collateral: string
  ) => {
    this.unwatchesFn[borrower + pToken + collateral]();
  };

  liquidatePosition = async (
    borrower: string,
    borrowedPToken: string,
    amount: bigint,
    collateralPToken: string
  ) => {
    await this.transactionFactory.mintToken(
      getUnderlying(borrowedPToken),
      this.address,
      amount
    );
    await this.transactionFactory.approveToken(
      getUnderlying(borrowedPToken),
      this.address,
      borrowedPToken,
      amount
    );
    return this.transactionFactory.liquidateUser(
      this.address,
      borrower,
      borrowedPToken,
      amount,
      collateralPToken
    );
  };
}
