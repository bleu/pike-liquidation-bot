import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseEther, parseUnits } from "viem";
import { AllUserPositions, MarketParameters } from "#/types";
import { pWETH, pUSDC, WETH, USDC, stETH } from "@pike-liq-bot/utils";
import { PriceHandler } from "#/handlers/priceHandler";
import { LiquidationAllowanceHandler } from "#/handlers/liquidationAllowanceHandler";

class MockPriceHandler extends PriceHandler {
  public getPrice = vi.fn();
  public updatePrices = vi.fn();
}

describe("LiquidationAllowanceHandler Tests", () => {
  let mockPriceHandler: PriceHandler;

  beforeEach(() => {
    mockPriceHandler = new MockPriceHandler();
    vi.clearAllMocks();
  });

  const generateMarketParams = (
    liquidationThreshold: bigint = parseEther("0.85")
  ): MarketParameters => ({
    borrowIndex: parseEther("1.0"),
    totalSupply: parseEther("1000"),
    totalBorrows: parseEther("500"),
    totalReserves: 0n,
    liquidationThreshold,
    cash: parseEther("500"),
    lastUpdated: 0n,
  });

  it("should return true for liquidatable position (underwater)", () => {
    // Setup: User has 1 ETH ($2000) as collateral and borrowed 1800 USDC
    // With 72.5% CF, max borrow is $2000 * 0.725 = $1450
    // Therefore position should be liquidatable

    const wethDeposit = parseEther("1.0"); // 1 ETH
    const usdcBorrow = parseUnits("1800", 6); // 1800 USDC

    // Set prices
    vi.mocked(mockPriceHandler.getPrice).mockImplementation((token: string) => {
      switch (token) {
        case WETH:
          return parseUnits("2000", 18); // ETH = $2000
        case USDC:
          return parseUnits("1", 36); // USDC = $1
        case stETH:
          return parseUnits("2000", 18);
        default:
          return 0n;
      }
    });

    const positions = [
      {
        marketId: pWETH,
        balance: wethDeposit,
        borrowed: 0n,
        isOnMarket: true,
        interestIndex: parseEther("1.0"),
      },
      {
        marketId: pUSDC,
        balance: 0n,
        borrowed: usdcBorrow,
        isOnMarket: false,
        interestIndex: parseEther("1.0"),
      },
    ];

    const userPositions: AllUserPositions = {
      id: "0x1234",
      lastUpdated: 1234n,
      positions,
    };

    const handler = new LiquidationAllowanceHandler(mockPriceHandler);

    // Set market parameters
    Object.values(handler["marketHandlers"]).forEach((marketHandler) => {
      marketHandler.marketParameters = generateMarketParams();
    });

    const result = handler.checkLiquidationAllowed(userPositions);
    expect(result).toBe(true);
  });

  it("should return false for healthy position (higher collateral)", () => {
    // Setup: User has 2 ETH ($4000) as collateral and borrowed 1800 USDC
    // With 72.5% CF, max borrow is $4000 * 0.725 = $2900
    // Therefore position should be healthy

    const wethDeposit = parseEther("2.0"); // 2 ETH
    const usdcBorrow = parseUnits("1800", 6); // 1800 USDC

    // Set prices
    vi.mocked(mockPriceHandler.getPrice).mockImplementation((token: string) => {
      switch (token) {
        case WETH:
          return parseUnits("2000", 18); // ETH = $2000
        case USDC:
          return parseUnits("1", 30); // USDC = $1
        case stETH:
          return parseUnits("2000", 18);
        default:
          return 0n;
      }
    });

    const positions = [
      {
        marketId: pWETH,
        balance: wethDeposit,
        borrowed: 0n,
        isOnMarket: true,
        interestIndex: parseEther("1.0"),
      },
      {
        marketId: pUSDC,
        balance: 0n,
        borrowed: usdcBorrow,
        isOnMarket: false,
        interestIndex: parseEther("1.0"),
      },
    ];

    const userPositions: AllUserPositions = {
      id: "0x1234",
      lastUpdated: 1234n,
      positions,
    };

    const handler = new LiquidationAllowanceHandler(mockPriceHandler);

    // Set market parameters
    Object.values(handler["marketHandlers"]).forEach((marketHandler) => {
      marketHandler.marketParameters = generateMarketParams();
    });

    const result = handler.checkLiquidationAllowed(userPositions);
    expect(result).toBe(false);
  });
});
