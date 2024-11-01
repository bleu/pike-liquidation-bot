import { getUnderlying } from "./utils";
import { TransactionFactory } from "./utils/transactions";

export class LiquidationBot {
  address: string;
  transactionFactory: TransactionFactory;
  constructor(transactionFactory: TransactionFactory, address: string) {
    this.transactionFactory = transactionFactory;
    this.address = address;
  }

  liquidatePosition = async (
    borrower: string,
    pToken: string,
    amount: bigint,
    collateral: string
  ) => {
    const mintUnderlying = await this.transactionFactory.mintToken(
      getUnderlying(pToken),
      this.address,
      amount
    );
    await this.transactionFactory.approveToken(
      getUnderlying(pToken),
      this.address,
      pToken,
      amount
    );
    return this.transactionFactory.liquidateUser(
      this.address,
      borrower,
      pToken,
      amount,
      collateral
    );
  };
}
