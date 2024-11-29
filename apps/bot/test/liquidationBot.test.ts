// test/bot/liquidationBot.test.ts
import { describe, test, expect, vi, beforeEach } from "vitest";
import { LiquidationBot } from "#/liquidationBot";
import { PikeClient, publicClient } from "#/services/clients";
import {
  wethLowPriceBlock,
  mockUserAPosition,
  mockUserBPosition,
} from "./mocks/utils";
import type { Block } from "viem";
import { getUserPositionsUpdatesAfterBlock } from "#/services/ponder/positions";

// Mock module first
vi.mock("#/services/ponder/positions", () => ({
  getUserPositionsUpdatesAfterBlock: vi.fn(),
}));

// Then get the mocked function
const mockedGetUserPositionsUpdatesAfterBlock = vi.mocked(
  getUserPositionsUpdatesAfterBlock
);

// Track block callbacks
let blockCallback: ((block: Block) => Promise<void>) | undefined;

// Mock the clients
vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  return {
    ...actual,
    publicClient: {
      multicall: vi.fn().mockResolvedValue([
        { result: 1000000n, status: "success" }, // USDC price
        { result: 2000000000n, status: "success" }, // WETH price
        { result: 1900000000n, status: "success" }, // stETH price
      ]),
      readContract: vi.fn(),
      watchBlocks: vi.fn(({ onBlock }) => {
        blockCallback = onBlock;
        return vi.fn(); // Return cleanup function
      }),
    },
  };
});

describe("LiquidationBot", () => {
  let liquidationBot: LiquidationBot;
  let mockPikeClient: PikeClient;

  beforeEach(() => {
    vi.clearAllMocks();
    blockCallback = undefined;
    mockPikeClient = new PikeClient(null as any);
    vi.spyOn(mockPikeClient, "sendAndWaitForReceipt").mockResolvedValue(
      {} as any
    );
    liquidationBot = new LiquidationBot({ pikeClient: mockPikeClient });
  });

  describe("Initialization and monitoring", () => {
    test("should start monitoring correctly", async () => {
      const mockPositions = [mockUserAPosition, mockUserBPosition];
      mockedGetUserPositionsUpdatesAfterBlock.mockResolvedValue(mockPositions);

      await liquidationBot.startToMonitor();

      expect(publicClient.multicall).toHaveBeenCalled();
      expect(mockedGetUserPositionsUpdatesAfterBlock).toHaveBeenCalled();
    });

    test("should stop monitoring all positions", async () => {
      const mockPositions = [mockUserAPosition];
      mockedGetUserPositionsUpdatesAfterBlock.mockResolvedValue(mockPositions);
      const stopWatchSpy = vi.fn();
      vi.mocked(publicClient.watchBlocks).mockReturnValue(stopWatchSpy);

      await liquidationBot.startToMonitor();
      liquidationBot.stop();

      expect(stopWatchSpy).toHaveBeenCalled();
    });
  });

  describe("Price and block management", () => {
    test("should update prices with specific block number", async () => {
      liquidationBot.setBlockNumber(wethLowPriceBlock);
      await liquidationBot.startToMonitor();

      expect(publicClient.multicall).toHaveBeenCalledWith({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            blockNumber: wethLowPriceBlock,
          }),
        ]),
      });
    });
  });

  describe("Liquidation checks", () => {
    test("should attempt liquidation when conditions are met", async () => {
      mockedGetUserPositionsUpdatesAfterBlock.mockResolvedValue([
        mockUserAPosition,
      ]);
      vi.mocked(publicClient.readContract).mockResolvedValue(0n); // liquidation allowed

      await liquidationBot.startToMonitor();

      // Trigger block callback
      if (blockCallback) {
        await blockCallback({
          number: 1n,
          timestamp: BigInt(Date.now()),
        } as Block);

        expect(mockPikeClient.sendAndWaitForReceipt).toHaveBeenCalled();
      }
    });

    test("should not liquidate when conditions are not met", async () => {
      mockedGetUserPositionsUpdatesAfterBlock.mockResolvedValue([
        mockUserAPosition,
      ]);
      vi.mocked(publicClient.readContract).mockResolvedValue(1n); // liquidation not allowed

      await liquidationBot.startToMonitor();

      // Trigger block callback
      if (blockCallback) {
        await blockCallback({
          number: 1n,
          timestamp: BigInt(Date.now()),
        } as Block);

        expect(mockPikeClient.sendAndWaitForReceipt).not.toHaveBeenCalled();
      }
    });
  });

  describe("Error handling", () => {
    test("should handle position update errors", async () => {
      mockedGetUserPositionsUpdatesAfterBlock.mockRejectedValue(
        new Error("Failed to fetch")
      );

      await expect(() => liquidationBot.startToMonitor()).rejects.toThrow(
        "Failed to fetch"
      );
    });

    test("should handle price update errors", async () => {
      vi.mocked(publicClient.multicall).mockRejectedValueOnce(
        new Error("Price fetch failed")
      );

      await expect(() => liquidationBot.startToMonitor()).rejects.toThrow(
        "Price fetch failed"
      );
    });

    test("should handle liquidation errors gracefully", async () => {
      mockedGetUserPositionsUpdatesAfterBlock.mockResolvedValue([
        mockUserAPosition,
      ]);
      vi.mocked(publicClient.readContract).mockResolvedValue(0n);
      vi.mocked(mockPikeClient.sendAndWaitForReceipt).mockRejectedValueOnce(
        new Error("Liquidation failed")
      );

      await liquidationBot.startToMonitor();

      if (blockCallback) {
        await blockCallback({
          number: 1n,
          timestamp: BigInt(Date.now()),
        } as Block);

        expect(mockPikeClient.sendAndWaitForReceipt).toHaveBeenCalled();
      }
    });
  });
});
