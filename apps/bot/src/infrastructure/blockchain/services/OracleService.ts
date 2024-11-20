import { TxSender } from "#/infrastructure/blockchain/services/TxSender";
import { publicClient } from "#/utils/clients";
import { getDecimals } from "#/utils/consts";
import { mockOracle, mockOracleAbi } from "@pike-liq-bot/utils";
import invariant from "tiny-invariant";
import { encodeFunctionData, type Address, type WalletClient } from "viem";

export class OracleService {
  private txSender?: TxSender;
  private publicClient?: typeof publicClient;

  constructor(
    private readonly walletClient?: WalletClient,
    _publicClient?: typeof publicClient
  ) {
    this.txSender = walletClient ? new TxSender(walletClient) : undefined;
    this.publicClient = _publicClient;
  }

  async setOraclePrice({ token, price }: { token: Address; price: bigint }) {
    invariant(this.txSender, "txSender is not set");

    return this.txSender.sendAndWaitForReceipt({
      to: mockOracle,
      data: encodeFunctionData({
        abi: mockOracleAbi,
        functionName: "setPrice",
        args: [token, price, getDecimals(token)],
      }),
      value: 0n,
    });
  }

  async getPriceMulticall({
    tokens,
    blockNumber,
  }: {
    tokens: Address[];
    blockNumber?: bigint;
  }) {
    invariant(this.publicClient, "publicClient is not set");

    return await this.publicClient.multicall({
      contracts: tokens.map((token) => ({
        address: mockOracle,
        abi: mockOracleAbi,
        functionName: "getPrice",
        args: [token],
        blockNumber,
      })),
    });
  }
}
