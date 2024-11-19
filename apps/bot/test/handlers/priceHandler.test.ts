import { describe, test, expect, vi, beforeEach } from "vitest";
import { PriceHandler } from "#/handlers/priceHandler";
import { ContractReader } from "#/services/contractReader";
import { publicClient } from "#/services/clients";
import { USDC, WETH, stETH } from "@pike-liq-bot/utils";

vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  return {
    ...actual,
    publicClient: {
      multicall: vi.fn().mockImplementation(async ({ contracts }) => {
        return [
          { result: 1000n, status: "success" },
          { result: 2000n, status: "success" },
          { result: 1900n, status: "success" },
        ];
      }),
    },
  };
});

describe("PriceHandler", () => {
  let priceHandler: PriceHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    const contractReader = new ContractReader(publicClient);
    priceHandler = new PriceHandler(contractReader);
  });

  test("should update token prices", async () => {
    await priceHandler.updatePrices();

    // First verify the multicall was made correctly
    expect(publicClient.multicall).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({ args: [USDC] }),
          expect.objectContaining({ args: [WETH] }),
          expect.objectContaining({ args: [stETH] }),
        ]),
      })
    );

    // Then verify the prices are stored correctly
    expect(priceHandler.getPrice(USDC)).toBe(1000n);
    expect(priceHandler.getPrice(WETH)).toBe(2000n);
    expect(priceHandler.getPrice(stETH)).toBe(1900n);
  });

  test("should handle price update errors", async () => {
    vi.mocked(publicClient.multicall).mockResolvedValueOnce([
      { error: new Error("Failed"), status: "failure" },
      { result: 2000n, status: "success" },
      { result: 1900n, status: "success" },
    ]);

    await priceHandler.updatePrices();

    expect(priceHandler.getPrice(USDC)).toBeUndefined();
    expect(priceHandler.getPrice(WETH)).toBe(2000n);
    expect(priceHandler.getPrice(stETH)).toBe(1900n);
  });
});
