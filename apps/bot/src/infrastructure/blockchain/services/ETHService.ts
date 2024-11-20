import { TxSender } from "#/infrastructure/blockchain/services/TxSender";
import { type Address, type WalletClient } from "viem";

export class ETHService {
  private txSender: TxSender;

  constructor(private readonly walletClient: WalletClient) {
    this.txSender = new TxSender(walletClient);
  }
  async sendEth({ to, amount }: { to: Address; amount: bigint }) {
    return this.txSender.sendAndWaitForReceipt({
      to,
      data: "0x",
      value: amount,
    });
  }
}
