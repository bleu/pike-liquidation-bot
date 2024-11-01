import { withAnvilProvider } from "../anvil";
import { expect, describe, it } from "vitest";
import { completeSetup, setupOracles } from "./setup";
import { initialWethPrice, pstETH, pUSDC, pWETH, WETH } from "../../utils";

describe("setup", () => {
  it("should properly setup oracles", async () => {
    await withAnvilProvider(async (transactionFactory) => {
      await setupOracles(transactionFactory);
      const [pWethPrice, wethPrice] = await Promise.all([
        transactionFactory.getPTokenPrice(pWETH),
        transactionFactory.getTokenPrice(WETH),
      ]);

      expect(pWethPrice).toBe(wethPrice);
      expect(pWethPrice).toBe(initialWethPrice);
    });
  });

  it("should have liquidity of pTokens", async () => {
    await withAnvilProvider(async (transactionFactory) => {
      await completeSetup(transactionFactory);
      const pTokensTotalSupply = await Promise.all([
        transactionFactory.getTokenTotalSupply(pWETH),
        transactionFactory.getTokenTotalSupply(pUSDC),
        transactionFactory.getTokenTotalSupply(pstETH),
      ]);

      expect;
      expect(pTokensTotalSupply[0]).toBeGreaterThan(0n);
      expect(pTokensTotalSupply[1]).toBeGreaterThan(0n);
      expect(pTokensTotalSupply[2]).toBeGreaterThan(0n);
    });
  });
});
