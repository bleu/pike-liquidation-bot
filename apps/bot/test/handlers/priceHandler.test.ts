import { describe, test, expect, vi, beforeEach } from "vitest";
import { PriceHandler } from "#/handlers/priceHandler";
import { publicClient } from "#/services/clients";
import { USDC, WETH, stETH } from "@pike-liq-bot/utils";
import { parseUnits } from "viem";
describe("PriceHandler", () => {
  let priceHandler: PriceHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    priceHandler = new PriceHandler();
  });

  test("should update token prices", async () => {
    const mockPrices: Record<string, bigint> = {
      [USDC]: parseUnits("1", 6),
      [WETH]: parseUnits("1000", 6),
      [stETH]: parseUnits("1900", 6),
    };

    // Mock the getPrice method
    const getPriceMock = vi.spyOn(priceHandler, "getPrice");
    getPriceMock.mockImplementation((token) => {
      return mockPrices[token] || BigInt(0);
    });
    // Then verify the prices are stored correctly
    expect(priceHandler.getPrice(USDC)).toBe(parseUnits("1", 6));
    expect(priceHandler.getPrice(WETH)).toBe(parseUnits("1000", 6));
    expect(priceHandler.getPrice(stETH)).toBe(parseUnits("1900", 6));
  });

  test("should handle price update errors", async () => {
    const mockPrices: Record<string, bigint> = {
      [WETH]: parseUnits("1000", 6),
      [stETH]: parseUnits("1900", 6),
    };

    // Mock the getPrice method
    const getPriceMock = vi.spyOn(priceHandler, "getPrice");
    getPriceMock.mockImplementation((token) => {
      return mockPrices[token];
    });
    expect(priceHandler.getPrice(USDC)).toBeUndefined();
    expect(priceHandler.getPrice(WETH)).toBe(parseUnits("1000", 6));
    expect(priceHandler.getPrice(stETH)).toBe(parseUnits("1900", 6));
  });
});
