import { anvilProvider, anvilTransactionFactory } from "../../src/fork/anvil";
import { expect, describe, it } from "vitest";
import { defaultAddresses, pWETH, WETH } from "../../src/utils";

describe("Anvil Setup", () => {
  it("should have a block number on provider", async () => {
    const blockNumber = await anvilProvider.getBlockNumber();
    expect(blockNumber).toBeDefined();
  });

  it("should properly setup and teardown anvil", async () => {
    const provider = anvilTransactionFactory.provider;
    const blockNumber = await provider.getBlockNumber();
    expect(blockNumber).toBeDefined();
  });

  it("should run a transaction", async () => {
    await anvilTransactionFactory.approveToken(
      WETH,
      defaultAddresses[0],
      pWETH,
      BigInt(1e18)
    );
  });
});
