import { expect, describe, it } from "vitest";

import { LiquidationBot } from "#/liquidationBot";
import { createWalletClientFromPrivateKey, PikeClient } from "#/clients";
import { getEnv } from "#/utils/env";
import {
  initialPricesBlock,
  positionUserA,
  userA,
  userE,
  wethLowPriceBlock,
} from "../consts";

describe("checkAmountToLiquidate", () => {
  const walletClient = createWalletClientFromPrivateKey(
    getEnv("BOT_PRIVATE_KEY") as `0x${string}`
  );
  const pikeClient = new PikeClient(walletClient);
  const liquidationBot = new LiquidationBot({ pikeClient });

  it("should return 0n amount when liquidation not allowed", async () => {
    liquidationBot.setBlockNumber(initialPricesBlock);

    const amountToLiquidate = await liquidationBot.checkAmountToLiquidate({
      borrowPToken: positionUserA.borrowPTokens[0],
      borrower: userA,
      collateralPToken: positionUserA.collateralPTokens[0],
    });

    expect(amountToLiquidate).toBe(0n);
  });
  it("should return positive bigint when liquidation is allowed", async () => {
    liquidationBot.setBlockNumber(wethLowPriceBlock);

    const amountToLiquidate = await liquidationBot.checkAmountToLiquidate({
      borrowPToken: positionUserA.borrowPTokens[0],
      borrower: userA,
      collateralPToken: positionUserA.collateralPTokens[0],
    });

    expect(amountToLiquidate).toBeGreaterThan(0n);
  });

  it("should return 0n amount when invalid data is passed", async () => {
    liquidationBot.setBlockNumber(wethLowPriceBlock);

    const amountToLiquidate = await liquidationBot.checkAmountToLiquidate({
      borrowPToken: positionUserA.borrowPTokens[0],
      borrower: userE,
      collateralPToken: positionUserA.collateralPTokens[0],
    });

    expect(amountToLiquidate).toBe(0n);
  });
});
