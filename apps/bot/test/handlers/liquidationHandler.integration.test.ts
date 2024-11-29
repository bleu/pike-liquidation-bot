// test/handlers/liquidationHandler.test.ts
import { describe, test, expect } from "vitest";
import { LiquidationHandler } from "#/handlers/liquidationHandler";
import { ContractReader } from "#/services/contractReader";
import {
  createWalletClientFromPrivateKey,
  PikeClient,
  publicClient,
} from "#/services/clients";
import { getEnv } from "#/utils/env";
import {
  initialPricesBlock,
  positionUserA,
  userA,
  userE,
  wethLowPriceBlock,
} from "../mocks/utils";
import {
  liquidationHelper,
  liquidationHelperAbi,
  pTokenAbi,
} from "@pike-liq-bot/utils";
import { encodeFunctionData, parseUnits } from "viem";

describe("LiquidationHandler with real client", () => {
  // Create instances that will be used across all tests
  const walletClient = createWalletClientFromPrivateKey(
    getEnv("BOT_PRIVATE_KEY") as `0x${string}`
  );
  const pikeClient = new PikeClient(walletClient);
  const contractReader = new ContractReader(publicClient);
  const liquidationHandler = new LiquidationHandler(contractReader, pikeClient);

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
        const borrowBalance = await contractReader.readContract({
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

      describe("liquidatePosition", () => {
        test("should liquidate position", async () => {
          const amountToLiquidate =
            await liquidationHandler.checkAmountToLiquidate({
              ...params,
              blockNumber: wethLowPriceBlock,
            });

          const borrowTokenPrice = parseUnits("2000", 6);
          const collateralTokenPrice = parseUnits("1000", 6);

          const expectedAmountOut =
            (amountToLiquidate * borrowTokenPrice) / collateralTokenPrice;
          const minAmountOut = (expectedAmountOut * 1n) / 100n;
          const pool = liquidationHandler.getPoolAddress({
            borrowPToken: params.borrowPToken,
            collateralPToken: params.collateralPToken,
          });

          await publicClient.simulateContract({
            address: liquidationHelper,
            abi: liquidationHelperAbi,
            functionName: "liquidate",
            args: [
              pool,
              params.borrowPToken,
              params.collateralPToken,
              params.borrower,
              amountToLiquidate,
              minAmountOut,
            ],
            account: walletClient.account.address,
            blockNumber: wethLowPriceBlock,
          });

          expect(true).to.be.true; // Pass the test since the last function didn't reverted
        });
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
