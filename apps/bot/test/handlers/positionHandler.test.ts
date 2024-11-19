import { describe, test, expect, vi, beforeEach } from "vitest";
import { PositionHandler } from "#/handlers/positionHandler";
import { PriceHandler } from "#/handlers/priceHandler";
import { ContractReader } from "#/services/contractReader";
import {
  mockUserAPosition,
  mockUserBPosition,
  mockUserCPosition,
  userA,
} from "../mocks/utils";
import { publicClient } from "#/services/clients";
import { pUSDC, pWETH, pstETH } from "@pike-liq-bot/utils";

vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  return {
    ...actual,
    publicClient: {
      multicall: vi.fn().mockResolvedValue([
        { result: 1000000n, status: "success" }, // USDC price ($1)
        { result: 2000000000n, status: "success" }, // WETH price ($2000)
        { result: 1900000000n, status: "success" }, // stETH price ($1900)
      ]),
    },
  };
});

describe("PositionHandler", () => {
  let positionHandler: PositionHandler;
  let priceHandler: PriceHandler;

  beforeEach(async () => {
    vi.clearAllMocks();
    const contractReader = new ContractReader(publicClient);
    priceHandler = new PriceHandler(contractReader);
    positionHandler = new PositionHandler(priceHandler);

    // Initialize price handler
    await priceHandler.updatePrices();
  });

  test("should find biggest collateral position for user A (WETH)", () => {
    const biggestPosition =
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        mockUserAPosition,
        true // isCollateral
      );

    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.balance).toBe(1000000000000000000n); // 1 WETH
  });

  test("should find biggest collateral position for user C (multiple collaterals)", () => {
    const biggestPosition =
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        mockUserCPosition,
        true // isCollateral
      );

    // WETH should be bigger in value than USDC
    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.balance).toBe(500000000000000000n); // 0.5 WETH
  });

  test("should find biggest borrow position for user B (multiple borrows)", () => {
    const biggestPosition =
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        mockUserBPosition,
        false // isCollateral
      );

    // WETH borrow should be bigger in value than stETH
    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.borrowed).toBe(300000000000000000n); // 0.3 WETH
  });

  test("should get liquidation data for user A", () => {
    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(mockUserAPosition);

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

  test("should handle positions with no liquidation opportunity", () => {
    const userPositions = {
      id: userA,
      positions: [
        {
          marketId: pWETH,
          balance: 0n,
          borrowed: 0n,
          isOnMarket: false,
        },
      ],
    };

    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(userPositions);

    expect(liquidationData).toBeUndefined();
  });

  test("should consider token prices when finding biggest positions", () => {
    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(mockUserBPosition);

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
});
