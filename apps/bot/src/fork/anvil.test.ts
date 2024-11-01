import { setupAnvil, withAnvilProvider } from "./anvil";
import { expect, describe, it, beforeAll, afterAll } from "vitest";
import type { Anvil } from "@viem/anvil";
import { ethers } from "ethers";

describe("Anvil Setup", () => {
  let anvil: Anvil;
  let provider: ethers.JsonRpcProvider;

  beforeAll(async () => {
    const setup = await setupAnvil();
    anvil = setup.anvil;
    provider = setup.provider;
  });

  afterAll(async () => {
    if (anvil) {
      await anvil.stop();
    }
  });

  it("should have a anvil instance", () => {
    console.log("Anvil created at", anvil.host, anvil.port);
    expect(anvil).toBeDefined();
  });

  it("should have a block number", async () => {
    const blockNumber = await provider.getBlockNumber();
    expect(blockNumber).toBeDefined();
  });

  it("should be running locally", () => {
    const { host } = anvil;
    expect(host).toBe("127.0.0.1");
  });
});

// Testing the withAnvilProvider wrapper
describe("withAnvilProvider", () => {
  it("should properly setup and teardown anvil", async () => {
    await withAnvilProvider(async (transactionFactory) => {
      const provider = transactionFactory.provider;
      const blockNumber = await provider.getBlockNumber();
      expect(blockNumber).toBeDefined();
    });
  });

  it("should handle errors gracefully", async () => {
    await expect(
      withAnvilProvider(async () => {
        throw new Error("Test error");
      })
    ).rejects.toThrow("Test error");
  });
});
