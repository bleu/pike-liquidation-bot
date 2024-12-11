import { describe, test, expect, vi, beforeEach } from "vitest";
import { PositionHandler } from "#/handlers/positionHandler";
import { PriceHandler } from "#/handlers/priceHandler";
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
import { USDC, WETH, pWETH, pstETH, stETH } from "@pike-liq-bot/utils";
import { parseEther, parseUnits } from "viem";

describe("PositionHandler", () => {
  let positionHandler: PositionHandler;
  let priceHandler: PriceHandler;

  beforeEach(async () => {
    vi.clearAllMocks();
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
    positionHandler = new PositionHandler(priceHandler);

    // Initialize price handler
    positionHandler.allPositions = {
      [userA]: mockUserAPosition,
      [userB]: mockUserBPosition,
      [userC]: mockUserCPosition,
      [userD]: mockUserDPosition,
      [userE]: mockUserEPosition,
    };
  });

  test("should return empty if none account is above USD threshold", () => {
    positionHandler.minCollateralUsdValue = 2000;
    positionHandler.allPositions = {
      [userE]: {
        id: userE,
        lastUpdated: 100n,
        positions: [
          // Collateral: WETH
          {
            marketId: pWETH,
            balance: parseEther("0.01"),
            borrowed: 0n,
            isOnMarket: true,
            interestIndex: 1n,
          },
          // Borrow: stETH
          {
            marketId: pstETH,
            balance: 0n,
            borrowed: parseEther("0.01"), // 0.001 stETH
            isOnMarket: true,
            interestIndex: 1n,
          },
        ],
      },
    };
    const dataToMonitor = positionHandler.getDataToMonitor();

    expect(dataToMonitor.length).toBe(0);
  });
});
