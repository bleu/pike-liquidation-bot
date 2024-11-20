import { Address, WalletClient, encodeFunctionData } from "viem";
import { pTokenAbi } from "@pike-liq-bot/utils";
import { TxSender } from "#/infrastructure/blockchain/services/TxSender";
import { publicClient } from "#/utils/clients";
import invariant from "tiny-invariant";

export class PTokenService {
  private txSender?: TxSender;
  private publicClient?: typeof publicClient;

  constructor(
    private readonly walletClient?: WalletClient,
    _publicClient?: typeof publicClient
  ) {
    this.txSender = walletClient ? new TxSender(walletClient) : undefined;
    this.publicClient = _publicClient;
  }

  async borrowBalanceCurrent({
    borrowPToken,
    borrower,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    blockNumber?: bigint;
  }): Promise<bigint> {
    invariant(this.publicClient, "publicClient is not set");

    return await this.publicClient.readContract({
      address: borrowPToken,
      abi: pTokenAbi,
      functionName: "borrowBalanceCurrent",
      args: [borrower],
      blockNumber,
    });
  }
  async liquidateBorrow(params: {
    borrower: Address;
    repayAmount: bigint;
    pTokenBorrowed: Address;
    pTokenCollateral: Address;
  }): Promise<void> {
    invariant(this.txSender, "txSender is not set");

    const { borrower, repayAmount, pTokenBorrowed, pTokenCollateral } = params;

    await this.txSender.sendAndWaitForReceipt({
      to: pTokenBorrowed,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "liquidateBorrow",
        args: [borrower, repayAmount, pTokenCollateral],
      }),
      value: 0n,
    });
  }

  async depositToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    invariant(this.txSender, "txSender is not set");

    return this.txSender.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "mint",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async borrowToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    invariant(this.txSender, "txSender is not set");

    return this.txSender.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "borrow",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async repayToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    invariant(this.txSender, "txSender is not set");

    return this.txSender.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "repayBorrow",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async redeemToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    invariant(this.txSender, "txSender is not set");

    return this.txSender.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "redeem",
        args: [amount],
      }),
      value: 0n,
    });
  }
}
