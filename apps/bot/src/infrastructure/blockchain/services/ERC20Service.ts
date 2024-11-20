import { createWalletClientFromPrivateKey } from "#/utils/clients";
import { TxSender } from "#/infrastructure/blockchain/services/TxSender";
import { getEnv } from "#/utils/env";
import { mockTokenAbi } from "@pike-liq-bot/utils";
import { MaxUint256 } from "ethers";
import { encodeFunctionData, type Address, type WalletClient } from "viem";

export const tokenOwnerWalletClient = createWalletClientFromPrivateKey(
  getEnv("TOKEN_OWNER_PRIVATE_KEY") as `0x${string}`
);

export class ERC20Service {
  private txSender: TxSender;

  constructor(private readonly walletClient: WalletClient) {
    this.txSender = new TxSender(walletClient);
  }

  async mintToken({ token, amount }: { token: Address; amount: bigint }) {
    return this.txSender.sendAndWaitForReceipt({
      to: token,
      data: encodeFunctionData({
        abi: mockTokenAbi,
        functionName: "mint",
        args: [this.walletClient.account!.address, amount],
      }),
      value: 0n,
      walletClient: tokenOwnerWalletClient,
    });
  }

  async approveToken({ token, spender }: { token: Address; spender: Address }) {
    return this.txSender.sendAndWaitForReceipt({
      to: token,
      data: encodeFunctionData({
        abi: mockTokenAbi,
        functionName: "approve",
        args: [spender, MaxUint256],
      }),
      value: 0n,
    });
  }
}
