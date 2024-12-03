import { Address } from "viem";
import {
  USDC,
  WETH,
  stETH,
  mockOracle,
  mockOracleAbi,
} from "@pike-liq-bot/utils";
import { ContractReader } from "#/services/contractReader";
import { logger } from "../services/logger";

export class PriceHandler {
  private tokenPrices: Record<Address, bigint> = {};

  constructor(private readonly contractReader: ContractReader) {
    logger.debug("Initializing PriceHandler", {
      class: "PriceHandler",
      trackedTokens: [USDC, WETH, stETH],
    });
  }

  async updatePrices(blockNumber?: bigint) {
    logger.debug("Updating token prices", {
      class: "PriceHandler",
      blockNumber: blockNumber?.toString(),
      trackedTokens: [USDC, WETH, stETH],
    });

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
      if (ret[i].error) {
        logger.error("Failed to update price for token", {
          class: "PriceHandler",
          token,
          error: ret[i].error,
        });
        return;
      }

      const newPrice = ret[i].result as bigint;
      const oldPrice = this.tokenPrices[token];

      this.tokenPrices[token] = newPrice;

      logger.debug("Updated token price", {
        class: "PriceHandler",
        token,
        oldPrice: oldPrice?.toString(),
        newPrice: newPrice.toString(),
        percentageChange: oldPrice
          ? ((Number(newPrice - oldPrice) / Number(oldPrice)) * 100).toFixed(
              2
            ) + "%"
          : "initial price",
      });
    });

    logger.info("Price update completed", {
      class: "PriceHandler",
      updatedPrices: Object.fromEntries(
        Object.entries(this.tokenPrices).map(([token, price]) => [
          token,
          price.toString(),
        ])
      ),
    });
  }

  getPrice(token: Address): bigint {
    const price = this.tokenPrices[token];

    if (!price) {
      logger.warn("Price requested for token with no price data", {
        class: "PriceHandler",
        token,
        availableTokens: Object.keys(this.tokenPrices),
      });
    } else {
      logger.debug("Price retrieved for token", {
        class: "PriceHandler",
        token,
        price: price.toString(),
      });
    }

    return price;
  }
}
