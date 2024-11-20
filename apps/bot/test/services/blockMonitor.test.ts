import { describe, test, expect, vi, beforeEach } from "vitest";
import { BlockMonitor } from "#/application/blockMonitor";
import { createMockBlock } from "../mocks/utils";
import { publicClient } from "#/utils/clients";
import type { Block } from "viem";

vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  let blockCallback: ((block: Block) => void) | undefined;

  return {
    ...actual,
    publicClient: {
      watchBlocks: vi
        .fn()
        .mockImplementation((args: { onBlock: (block: Block) => void }) => {
          blockCallback = args.onBlock;
          return () => {};
        }),
      _triggerBlock: (block: Block) => {
        if (blockCallback) {
          blockCallback(block);
        }
      },
    },
  };
});

describe("BlockMonitor", () => {
  let blockMonitor: BlockMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    blockMonitor = new BlockMonitor(publicClient);
  });

  test("should start monitoring blocks", async () => {
    await blockMonitor.startMonitoring();
    expect(publicClient.watchBlocks).toHaveBeenCalled();
  });

  test("should handle multiple block handlers", async () => {
    const handler1 = vi.fn().mockResolvedValue(undefined);
    const handler2 = vi.fn().mockResolvedValue(undefined);
    const mockBlock = createMockBlock();

    blockMonitor.addHandler("handler1", handler1);
    blockMonitor.addHandler("handler2", handler2);

    await blockMonitor.startMonitoring();

    // Trigger the block callback
    (publicClient as any)._triggerBlock(mockBlock);

    // Wait for promises to resolve
    await vi.waitFor(() => {
      return handler1.mock.calls.length > 0 && handler2.mock.calls.length > 0;
    });

    expect(handler1).toHaveBeenCalledWith(mockBlock);
    expect(handler2).toHaveBeenCalledWith(mockBlock);
  });

  test("should remove handler", () => {
    const handler = vi.fn();
    blockMonitor.addHandler("test", handler);
    expect(blockMonitor.hasHandler("test")).toBe(true);

    blockMonitor.removeHandler("test");
    expect(blockMonitor.hasHandler("test")).toBe(false);
  });

  test("should clear all handlers", () => {
    blockMonitor.addHandler("test1", vi.fn());
    blockMonitor.addHandler("test2", vi.fn());

    blockMonitor.clearHandlers();
    expect(blockMonitor.hasHandler("test1")).toBe(false);
    expect(blockMonitor.hasHandler("test2")).toBe(false);
  });
});
