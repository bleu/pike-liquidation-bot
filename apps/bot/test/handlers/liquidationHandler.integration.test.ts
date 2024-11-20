// test/handlers/liquidationHandler.test.ts
import { LiquidationHandler } from "#/domains/liquidationHandler";
import {
  createWalletClientFromPrivateKey,
  publicClient,
} from "#/utils/clients";
import { getEnv } from "#/utils/env";
import { pTokenAbi } from "@pike-liq-bot/utils";
import { describe, expect, test } from "vitest";
import {
  initialPricesBlock,
  positionUserA,
  userA,
  userE,
  wethLowPriceBlock,
} from "../mocks/utils";

describe("LiquidationHandler with real client", () => {
  // Create instances that will be used across all tests
  const walletClient = createWalletClientFromPrivateKey(
    getEnv("BOT_PRIVATE_KEY") as `0x${string}`
  );
  const liquidationHandler = new LiquidationHandler();

  describe("checkAmountToLiquidate", () => {
    const params = {
      borrowPToken: positionUserA.borrowPTokens[0],
      borrower: userA,
      collateralPToken: positionUserA.collateralPTokens[0],
    };

    describe("at initial prices block", () => {
      test("should return 0n amount when liquidation not allowed", async () => {
        const amountToLiquidate =
          await liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: initialPricesBlock,
          });

        expect(amountToLiquidate).toBe(0n);
      });

      test("should match half of borrow balance", async () => {
        const borrowBalance = await publicClient.readContract({
          address: params.borrowPToken,
          abi: pTokenAbi,
          functionName: "borrowBalanceCurrent",
          args: [params.borrower],
          blockNumber: initialPricesBlock,
        });

        const amountToLiquidate =
          await liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: initialPricesBlock,
          });

        // Since liquidation is not allowed at initial prices, amount should be 0
        expect(amountToLiquidate).toBe(0n);
        expect(borrowBalance).toBeGreaterThan(0n);
      });
    });

    describe("at WETH low price block", () => {
      test("should return positive amount when liquidation allowed", async () => {
        const amountToLiquidate =
          await liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: wethLowPriceBlock,
          });

        expect(amountToLiquidate).toBeGreaterThan(0n);
      });

      test("should be exactly half of borrow balance", async () => {
        const borrowBalance = (await contractReader.readContract({
          address: params.borrowPToken,
          abi: pTokenAbi,
          functionName: "borrowBalanceCurrent",
          args: [params.borrower],
          blockNumber: wethLowPriceBlock,
        })) as bigint;

        const amountToLiquidate =
          (await liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: wethLowPriceBlock,
          })) as bigint;

        expect(amountToLiquidate).toBe(borrowBalance / 2n);
      });
    });

    describe("edge cases", () => {
      test("should return 0n for non-existent user position", async () => {
        const amountToLiquidate =
          await liquidationHandler.checkAmountToLiquidate({
            ...params,
            borrower: userE, // User with no position
            blockNumber: wethLowPriceBlock,
          });

        expect(amountToLiquidate).toBe(0n);
      });

      test("should handle same user at different blocks", async () => {
        const [amountInitial, amountLowWeth] = await Promise.all([
          liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: initialPricesBlock,
          }),
          liquidationHandler.checkAmountToLiquidate({
            ...params,
            blockNumber: wethLowPriceBlock,
          }),
        ]);

        expect(amountInitial).toBe(0n);
        expect(amountLowWeth).toBeGreaterThan(0n);
      });
    });
  });
});
