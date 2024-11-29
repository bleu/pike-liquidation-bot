import { describe, test, expect, vi, beforeEach } from "vitest";
import { PositionHandler } from "#/handlers/positionHandler";
import { PriceHandler } from "#/handlers/priceHandler";
import { ContractReader } from "#/services/contractReader";
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
import { publicClient } from "#/services/clients";
import { pUSDC, pWETH, pstETH } from "@pike-liq-bot/utils";
import { AllUserPositionsWithValue } from "#/types";
import { parseEther, parseUnits } from "viem";

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
    positionHandler.allPositions = {
      [userA]: mockUserAPosition,
      [userB]: mockUserBPosition,
      [userC]: mockUserCPosition,
      [userD]: mockUserDPosition,
      [userE]: mockUserEPosition,
    };
  });

  test("should find biggest collateral position for user A (WETH)", () => {
    const biggestPosition =
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler
          .getAllPositionsWithUsdValue()
          .find(
            ({ id }) => id === mockUserAPosition.id
          ) as AllUserPositionsWithValue,
        true // isCollateral
      );

    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.balance).toBe(1000000000000000000n); // 1 WETH
  });

  test("should find biggest collateral position for user C (multiple collaterals)", () => {
    const biggestPosition =
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler
          .getAllPositionsWithUsdValue()
          .find(
            ({ id }) => id === mockUserCPosition.id
          ) as AllUserPositionsWithValue,
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
      positionHandler.findBiggestPositionTypeFromAllUserPositions(
        positionHandler
          .getAllPositionsWithUsdValue()
          .find(
            ({ id }) => id === mockUserBPosition.id
          ) as AllUserPositionsWithValue,
        false // isCollateral
      );

    // WETH borrow should be bigger in value than stETH
    expect(biggestPosition?.marketId).toBe(pWETH);
    expect(biggestPosition?.borrowed).toBe(300000000000000000n); // 0.3 WETH
  });

  test("should get liquidation data for user A", () => {
    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(
        positionHandler
          .getAllPositionsWithUsdValue()
          .find(
            ({ id }) => id === mockUserAPosition.id
          ) as AllUserPositionsWithValue
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
        },
      ],
    };

    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(userPositions);

    expect(liquidationData).toBeUndefined();
  });

  test("should consider token prices when finding biggest positions", () => {
    const liquidationData =
      positionHandler.getLiquidationDataFromAllUserPositions(
        positionHandler
          .getAllPositionsWithUsdValue()
          .find(
            ({ id }) => id === mockUserBPosition.id
          ) as AllUserPositionsWithValue
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

  test("should get until the limit of accounts to data", () => {
    const dataToMonitor = positionHandler.getDataToMonitor();
    expect(dataToMonitor.length).toBe(positionHandler.positionsToMonitorLimit);
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
          },
          // Borrow: stETH
          {
            marketId: pstETH,
            balance: 0n,
            borrowed: parseEther("0.01"), // 0.001 stETH
            isOnMarket: true,
          },
        ],
      },
    };
    const dataToMonitor = positionHandler.getDataToMonitor();

    expect(dataToMonitor.length).toBe(0);
  });
  test("should get near liquidation positions", () => {
    // Total value of borrowed / total value of collateral (bigger -> most near liquidation)
    // user A -> 950 / 2000 -> 0.475
    // user B -> 975 / 2000 -> 0.4875
    // user C -> 760 / 2500 -> 0.304
    // user D -> 1475 / 1600 -> 0.92
    // user E -> 1140 / 2400 -> 0.475
    positionHandler.positionsToMonitorLimit = 1;
    const dataToMonitor = positionHandler.getDataToMonitor();

    expect(dataToMonitor.length).toBe(1);
    expect(dataToMonitor[0].borrower).toBe(userD);

    positionHandler.minCollateralUsdValue = 1800;
    const dataToMonitor2 = positionHandler.getDataToMonitor();

    expect(dataToMonitor2[0].borrower).toBe(userB);
  });
});
