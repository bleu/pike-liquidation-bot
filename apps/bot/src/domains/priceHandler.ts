import { OracleService } from "#/infrastructure/blockchain/services/OracleService";
import { publicClient } from "#/utils/clients";
import { USDC, WETH, stETH } from "@pike-liq-bot/utils";
import { Address } from "viem";

export class PriceHandler {
  private tokenPrices: Record<Address, bigint> = {};
  private oracleService: OracleService;

  constructor() {
    this.oracleService = new OracleService(undefined, publicClient);
  }

  async updatePrices(blockNumber?: bigint) {
    const ret = await this.oracleService.getPriceMulticall({
      tokens: [USDC, WETH, stETH],
      blockNumber,
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
