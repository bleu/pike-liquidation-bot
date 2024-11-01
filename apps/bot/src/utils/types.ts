import { ethers } from "ethers";

export type ISendTransaction = (
  data: ethers.TransactionRequest & { from?: string }
) => void;
