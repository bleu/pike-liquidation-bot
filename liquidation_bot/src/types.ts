import { ethers } from "ethers";
import { TransactionFactory } from "./transactions";

export type ISendTransaction = (
  data: ethers.TransactionRequest & { from?: string }
) => void;

export type IWithProvider = (
  wallets: string[],
  transactionFactory: TransactionFactory
) => void;
