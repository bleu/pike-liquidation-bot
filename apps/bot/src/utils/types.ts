import { TransactionRequest } from "viem";

export type ISendTransaction = (
  data: TransactionRequest & { from?: `0x${string}` }
) => void;
