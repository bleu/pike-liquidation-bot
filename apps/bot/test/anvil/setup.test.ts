import { expect, describe, it } from "vitest";
import { completeSetup, setupOracles } from "../../src/fork/mocks/setup";
import { initialWethPrice, pstETH, pUSDC, pWETH, WETH } from "../../src/utils";
import { anvilTransactionFactory } from "../../src/fork/anvil";

describe("setup", () => {
  it("should complete setup", async () => {
    await completeSetup(anvilTransactionFactory);
    const [pWethPrice, wethPrice] = await Promise.all([
      anvilTransactionFactory.getPTokenPrice(pWETH),
      anvilTransactionFactory.getTokenPrice(WETH),
    ]);

    expect(pWethPrice).toBeDefined();
    expect(wethPrice).toBeDefined();

    const pTokensTotalSupply = await Promise.all([
      anvilTransactionFactory.getTokenTotalSupply(pWETH),
      anvilTransactionFactory.getTokenTotalSupply(pUSDC),
      anvilTransactionFactory.getTokenTotalSupply(pstETH),
    ]);

    expect(pTokensTotalSupply[0]).toBeGreaterThan(0n);
    expect(pTokensTotalSupply[1]).toBeGreaterThan(0n);
    expect(pTokensTotalSupply[2]).toBeGreaterThan(0n);
  });
});
