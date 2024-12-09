import { Address, parseUnits } from "viem";
import { USDC, WETH, stETH, getDecimals } from "@pike-liq-bot/utils";
import { logger } from "../services/logger";

const priceUrl = "http://localhost:3000/price";
export class PriceHandler {
  private tokenPrices: Record<Address, bigint> = {};

  async updatePrices(blockNumber?: bigint) {
    logger.debug("Updating token prices", {
      class: "PriceHandler",
      blockNumber: blockNumber?.toString(),
      trackedTokens: [USDC, WETH, stETH],
    });

    const ret = (await Promise.all(
      [USDC, WETH, stETH].map(async (token) => {
        try {
          const res = await fetch(`${priceUrl}/${token.toLowerCase()}`);
          if (!res.ok) {
            throw new Error(
              `Failed to fetch price for token ${token}: ${res.statusText}`
            );
          }

          return res.json();
        } catch (error) {
          logger.error("Failed to update price for token", {
            class: "PriceHandler",
            token,
            error,
          });
          return { error };
        }
      })
    )) as {
      success: boolean;
      data: {
        assetAddress: string;
        price: string;
        timestamp: number;
      };
    }[];

    [USDC, WETH, stETH].forEach((token, i) => {
      this.tokenPrices[token] = parseUnits(
        ret[i].data.price,
        30 - Number(getDecimals(token))
      );
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
