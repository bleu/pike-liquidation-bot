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
import { pWETH, pstETH } from "@pike-liq-bot/utils";
import { parseEther } from "viem";

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
    expect(dataToMonitor[0].id).toBe(userD);

    positionHandler.minCollateralUsdValue = 1800;
    const dataToMonitor2 = positionHandler.getDataToMonitor();

    expect(dataToMonitor2[0].id).toBe(userB);
  });
});
