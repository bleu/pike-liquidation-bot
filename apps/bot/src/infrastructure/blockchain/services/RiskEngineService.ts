import { Address, WalletClient, encodeFunctionData } from "viem";
import { pTokenAbi, riskEngine, riskEngineAbi } from "@pike-liq-bot/utils";
import { TxSender } from "#/infrastructure/blockchain/services/TxSender";
import { publicClient } from "#/utils/clients";
import invariant from "tiny-invariant";

export class RiskEngineService {
  private txSender?: TxSender;
  private publicClient?: typeof publicClient;

  constructor(
    private readonly walletClient?: WalletClient,
    _publicClient?: typeof publicClient
  ) {
    this.txSender = walletClient ? new TxSender(walletClient) : undefined;
    this.publicClient = _publicClient;
  }

  async enterMarket({ pTokens }: { pTokens: Address[] }) {
    invariant(this.txSender, "txSender is not initialized");

    return this.txSender.sendAndWaitForReceipt({
      to: riskEngine,
      data: encodeFunctionData({
        abi: riskEngineAbi,
        functionName: "enterMarkets",
        args: [pTokens],
      }),
      value: 0n,
    });
  }

  async liquidateBorrowAllowed({
    borrowPToken,
    borrower,
    collateralPToken,
    amountToLiquidate,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    amountToLiquidate: bigint;
    blockNumber?: bigint;
  }) {
    invariant(this.publicClient, "publicClient is not initialized");

    return await this.publicClient.readContract({
      address: riskEngine,
      abi: riskEngineAbi,
      functionName: "liquidateBorrowAllowed",
      args: [borrowPToken, collateralPToken, borrower, amountToLiquidate],
      blockNumber,
    });
  }
}
