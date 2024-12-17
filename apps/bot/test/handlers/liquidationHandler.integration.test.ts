// test/handlers/liquidationHandler.test.ts
import { describe, test, expect, vi, beforeEach } from "vitest";
import { LiquidationHandler } from "#/handlers/liquidationHandler";
import {
  createWalletClientFromPrivateKey,
  PikeClient,
  publicClient,
} from "#/services/clients";
import { getEnv } from "#/utils/env";
import { mockUserAPosition, userA, wethLowPriceBlock } from "../mocks/utils";
import {
  liquidationHelper,
  liquidationHelperAbi,
  stETH,
  USDC,
  WETH,
} from "@pike-liq-bot/utils";
import { PriceHandler } from "#/handlers/priceHandler";
import { PositionHandler } from "#/handlers/positionHandler";
import { AllUserPositionsWithValue, LiquidationData } from "#/types";
import { parseEther, parseUnits } from "viem";
import { MockMarketHandler } from "../mocks/mockMarketHandler";

describe("checkAmountToLiquidate", () => {
  let positionHandler: PositionHandler;
  let liquidationHandler: LiquidationHandler;
  let priceHandler: PriceHandler;
  let walletClient: ReturnType<typeof createWalletClientFromPrivateKey>;

  beforeEach(async () => {
    vi.clearAllMocks();

    priceHandler = new PriceHandler();

    const mockPrices: Record<string, bigint> = {
      [USDC]: parseUnits("1", 30),
      [WETH]: parseUnits("1000", 18),
      [stETH]: parseUnits("1900", 18),
    };

    // Mock the getPrice method
    const getPriceMock = vi.spyOn(priceHandler, "getPrice");
    getPriceMock.mockImplementation((token) => {
      return mockPrices[token] || BigInt(0);
    });
    const marketHandler = new MockMarketHandler();
    positionHandler = new PositionHandler(priceHandler, marketHandler);

    positionHandler.allPositions = {
      [userA]: mockUserAPosition,
    };
    walletClient = createWalletClientFromPrivateKey(
      getEnv("BOT_PRIVATE_KEY") as `0x${string}`
    );
    const pikeClient = new PikeClient(walletClient);
    liquidationHandler = new LiquidationHandler(pikeClient, marketHandler);
    liquidationHandler.closeFactorMantissa = 500000000000000000n;
    liquidationHandler.liquidationIncentiveMantissa = 1050000000000000000n;
  });
  test("should liquidate position", async () => {
    const userPositions =
      positionHandler.getUserPositionWithValue(mockUserAPosition);

    expect(userPositions).toBeDefined();

    const biggestUserPositions =
      liquidationHandler.getBiggestPositionsFromAllUserPositions(userPositions);

    expect(biggestUserPositions).toBeDefined();

    if (!biggestUserPositions) {
      return;
    }

    const liquidationData =
      liquidationHandler.getLiquidationDataFromBiggestUserPositions(
        biggestUserPositions
      ) as LiquidationData;

    const pool = liquidationHandler.getPoolAddress({
      borrowPToken: biggestUserPositions.biggestBorrowPosition.marketId,
      collateralPToken: biggestUserPositions.biggestCollateralPosition.marketId,
    });

    await publicClient.simulateContract({
      address: liquidationHelper,
      abi: liquidationHelperAbi,
      functionName: "liquidate",
      args: [
        pool,
        liquidationData.borrowPToken,
        liquidationData.collateralPToken,
        liquidationData.borrower,
        liquidationData.repayAmount,
        liquidationData.minAmountOut,
      ],
      account: walletClient.account.address,
      blockNumber: wethLowPriceBlock,
    });

    expect(true).to.be.true; // Pass the test since the last function didn't reverted
  });
});
