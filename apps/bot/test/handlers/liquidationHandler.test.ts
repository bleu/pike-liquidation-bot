import { describe, test, expect, vi, beforeEach } from "vitest";
import { LiquidationHandler } from "#/handlers/liquidationHandler";
import { pstETH, pUSDC, pWETH, stETH, USDC, WETH } from "@pike-liq-bot/utils";
import { PikeClient } from "#/services/clients";
import { createWalletClient, http, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import {
  mockUserAPosition,
  mockUserBPosition,
  mockUserCPosition,
  mockUserDPosition,
  mockUserEPosition,
  userA,
  userB,
  userC,
  userD,
  userE,
} from "../mocks/utils";
import { PositionHandler } from "#/handlers/positionHandler";
import { PriceHandler } from "#/handlers/priceHandler";
import { MockMarketHandler } from "../mocks/mockMarketHandler";

describe("LiquidationHandler", () => {
  let liquidationHandler: LiquidationHandler;
  let positionHandler: PositionHandler;
  let priceHandler: PriceHandler;
  let mockPikeClient: PikeClient;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Create mock wallet client with proper 32-byte private key
    const mockWalletClient = createWalletClient({
      account: privateKeyToAccount(
        "0x1234567890123456789012345678901234567890123456789012345678901234" as `0x${string}`
      ),
      chain: baseSepolia,
      transport: http(),
    });

    // Initialize mocked PikeClient
    mockPikeClient = new PikeClient(mockWalletClient);

    const marketHandler = new MockMarketHandler();

    liquidationHandler = new LiquidationHandler(mockPikeClient, marketHandler);
    liquidationHandler.closeFactorMantissa = 500000000000000000n;
    liquidationHandler.liquidationIncentiveMantissa = 1050000000000000000n;

    priceHandler = new PriceHandler();

    const mockPrices: Record<string, bigint> = {
      [USDC]: parseUnits("1", 30),
      [WETH]: parseUnits("2000", 18),
      [stETH]: parseUnits("1900", 18),
    };

    // Mock the getPrice method
    const getPriceMock = vi.spyOn(priceHandler, "getPrice");
    getPriceMock.mockImplementation((token) => {
      return mockPrices[token] || BigInt(0);
    });
    positionHandler = new PositionHandler(priceHandler, marketHandler);

    // Initialize price handler
    positionHandler.allPositions = {
      [userA]: mockUserAPosition,
      [userB]: mockUserBPosition,
      [userC]: mockUserCPosition,
      [userD]: mockUserDPosition,
      [userE]: mockUserEPosition,
    };
  });

  test("should handle positions with no liquidation opportunity", () => {
    const userPositions = {
      id: userA,
      lastUpdated: 10n,
      totalCollateralUsdValue: 10,
      totalBorrowedUsdValue: 0,
      positions: [
        {
          marketId: pWETH,
          balance: 1n,
          balanceUsdValue: 10,
          borrowedUsdValue: 0,
          borrowed: 0n,
          isOnMarket: false,
          interestIndex: 1n,
          tokenPrice: 10n,
        },
      ],
    };

    const liquidationData =
      liquidationHandler.getBiggestPositionsFromAllUserPositions(userPositions);

    expect(liquidationData).toBeUndefined();
  });

  test("should consider token prices when finding biggest positions", () => {
    const liquidationData =
      liquidationHandler.getBiggestPositionsFromAllUserPositions(
        positionHandler.getUserPositionWithValue(mockUserBPosition)
      );

    expect(liquidationData).toEqual({
      borrower: mockUserBPosition.id,
      biggestBorrowPosition: expect.objectContaining({
        marketId: pWETH, // WETH borrow has higher value than stETH
      }),
      biggestCollateralPosition: expect.objectContaining({
        marketId: pUSDC, // Only collateral
      }),
    });
  });

  test("should find biggest collateral position for user A (WETH)", () => {
    const biggestPosition =
      liquidationHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler.getUserPositionWithValue(mockUserAPosition),
        true // isCollateral
      );

    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.balance).toBe(1000000000000000000n); // 1 WETH
  });

  test("should find biggest collateral position for user C (multiple collaterals)", () => {
    const biggestPosition =
      liquidationHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler.getUserPositionWithValue(mockUserCPosition),
        true // isCollateral
      );

    // USDC should be bigger in value than WETH
    // 1500 USDC -> 1500 USD
    // 0.5 psETH -> 1000 USD
    expect(biggestPosition?.marketId).toBe(pUSDC);
    expect(biggestPosition?.balance).toBe(parseUnits("1500", 6)); // 1500 USDC
  });

  test("should find biggest borrow position for user B (multiple borrows)", () => {
    const biggestPosition =
      liquidationHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler.getUserPositionWithValue(mockUserBPosition),
        false // isCollateral
      );

    // WETH borrow should be bigger in value than stETH
    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.borrowed).toBe(300000000000000000n); // 0.3 WETH
  });

  test("should get liquidation data for user A", () => {
    const liquidationData =
      liquidationHandler.getBiggestPositionsFromAllUserPositions(
        positionHandler.getUserPositionWithValue(mockUserAPosition)
      );

    expect(liquidationData).toEqual({
      borrower: mockUserAPosition.id,
      biggestBorrowPosition: expect.objectContaining({
        marketId: pstETH,
        borrowed: 500000000000000000n, // 0.5 stETH
      }),
      biggestCollateralPosition: expect.objectContaining({
        marketId: pWETH,
        balance: 1000000000000000000n, // 1 WETH
      }),
    });
  });
});
