import { expect, describe, it, vi, beforeEach } from "vitest";
import { LiquidationBot } from "#/liquidationBot";
import { publicClient, PikeClient } from "#/clients";
import { positionUserA, userA, userB } from "../consts";

// Mock the publicClient
vi.mock("#/clients", async () => {
  const actual = await vi.importActual("#/clients");
  return {
    ...actual,
    publicClient: {
      watchBlocks: vi.fn(),
    },
  };
});

describe("startMonitorPosition", () => {
  let liquidationBot: LiquidationBot;
  const mockPikeClient = {} as PikeClient;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    liquidationBot = new LiquidationBot({ pikeClient: mockPikeClient });
  });

  it("should start watching blocks and call checkAndLiquidatePosition on each block", async () => {
    // Spy on checkAndLiquidatePosition method
    const checkAndLiquidateSpy = vi.spyOn(
      liquidationBot,
      "checkAndLiquidatePosition"
    );

    // Mock watchBlocks to simulate block updates
    const mockWatchBlocks = vi.fn().mockImplementation(({ onBlock }) => {
      // Simulate 3 blocks being received
      onBlock({ number: 1n });
      onBlock({ number: 2n });
      onBlock({ number: 3n });

      // Return unwatch function
      return () => {};
    });

    // Replace the watchBlocks implementation
    (publicClient.watchBlocks as any) = mockWatchBlocks;

    // Start monitoring position
    liquidationBot.startMonitorPosition({
      borrower: userA,
      borrowPToken: positionUserA.borrowPTokens[0],
      collateralPToken: positionUserA.collateralPTokens[0],
    });

    // Verify checkAndLiquidatePosition was called for each block
    expect(checkAndLiquidateSpy).toHaveBeenCalledTimes(3);
    expect(checkAndLiquidateSpy).toHaveBeenCalledWith({
      borrower: userA,
      borrowPToken: positionUserA.borrowPTokens[0],
      collateralPToken: positionUserA.collateralPTokens[0],
    });
  });

  it("should store unwatch function and allow stopping monitoring", () => {
    const mockUnwatch = vi.fn();
    (publicClient.watchBlocks as any).mockReturnValue(mockUnwatch);

    const params = {
      borrower: userA,
      borrowPToken: positionUserA.borrowPTokens[0],
      collateralPToken: positionUserA.collateralPTokens[0],
    };

    // Start monitoring
    liquidationBot.startMonitorPosition(params);

    // Stop monitoring
    liquidationBot.stopMonitorPosition(params);

    // Verify unwatch was called
    expect(mockUnwatch).toHaveBeenCalledTimes(1);
  });

  it("should create separate watchers for different positions", () => {
    const mockUnwatch1 = vi.fn();
    const mockUnwatch2 = vi.fn();
    let watchBlocksCalls = 0;

    (publicClient.watchBlocks as any).mockImplementation(() => {
      watchBlocksCalls++;
      return watchBlocksCalls === 1 ? mockUnwatch1 : mockUnwatch2;
    });

    const position1 = {
      borrower: userA,
      borrowPToken: positionUserA.borrowPTokens[0],
      collateralPToken: positionUserA.collateralPTokens[0],
    };

    const position2 = {
      borrower: userB,
      borrowPToken: positionUserA.borrowPTokens[0],
      collateralPToken: positionUserA.collateralPTokens[0],
    };

    // Start monitoring both positions
    liquidationBot.startMonitorPosition(position1);
    liquidationBot.startMonitorPosition(position2);

    // Stop monitoring both positions
    liquidationBot.stopMonitorPosition(position1);
    liquidationBot.stopMonitorPosition(position2);

    // Verify each position had its own watcher
    expect(watchBlocksCalls).toBe(2);
    expect(mockUnwatch1).toHaveBeenCalledTimes(1);
    expect(mockUnwatch2).toHaveBeenCalledTimes(1);
  });
});
