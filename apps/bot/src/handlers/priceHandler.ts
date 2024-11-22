import { Address } from "viem";
import {
  USDC,
  WETH,
  stETH,
  mockOracle,
  mockOracleAbi,
} from "@pike-liq-bot/utils";
import { ContractReader } from "#/services/contractReader";

export class PriceHandler {
  private tokenPrices: Record<Address, bigint> = {};

  constructor(private readonly contractReader: ContractReader) {}

  async updatePrices(blockNumber?: bigint) {
    const ret = await this.contractReader.multicall({
      contracts: [USDC, WETH, stETH].map((token) => ({
        address: mockOracle,
        abi: mockOracleAbi,
        functionName: "getPrice",
        args: [token],
        blockNumber,
      })),
    });

    [USDC, WETH, stETH].forEach((token, i) => {
      if (ret[i].error) return;
      this.tokenPrices[token] = ret[i].result as bigint;
    });
  }

  getPrice(token: Address): bigint {
    return this.tokenPrices[token];
  }
}
