import { Block, PublicClient } from "viem";
import { logger } from "../services/logger";

export type BlockHandler = (block: Block) => Promise<void>;

export class BlockMonitor {
  private handlers: Map<string, BlockHandler> = new Map();
  private watching: boolean = false;
  private unwatchFn?: () => void;

  constructor(private readonly publicClient: PublicClient) {
    logger.debug("Initializing BlockMonitor", {
      class: "BlockMonitor",
    });
  }

  /**
   * Start monitoring blocks
   */
  async startMonitoring() {
    if (this.watching) {
      logger.debug("Block monitoring already active", {
        class: "BlockMonitor",
        handlersCount: this.handlers.size,
      });
      return;
    }

    logger.info("Starting block monitoring", {
      class: "BlockMonitor",
      handlersCount: this.handlers.size,
    });

    this.unwatchFn = this.publicClient.watchBlocks({
      onBlock: async (block) => {
        await this.handleBlock(block);
      },
    });

    this.watching = true;
  }

  /**
   * Stop monitoring blocks
   */
  stopMonitoring() {
    if (!this.watching) {
      logger.debug("Block monitoring already stopped", {
        class: "BlockMonitor",
      });
      return;
    }

    logger.info("Stopping block monitoring", {
      class: "BlockMonitor",
      handlersCount: this.handlers.size,
    });

    this.unwatchFn?.();
    this.watching = false;
  }

  /**
   * Add a new block handler
   * @param id Unique identifier for the handler
   * @param handler Function to be called for each block
   */
  addHandler(id: string, handler: BlockHandler) {
    if (this.handlers.has(id)) {
      logger.warn("Overwriting existing block handler", {
        class: "BlockMonitor",
        handlerId: id,
      });
    }

    this.handlers.set(id, handler);
    logger.debug("Added block handler", {
      class: "BlockMonitor",
      handlerId: id,
      totalHandlers: this.handlers.size,
    });
  }

  /**
   * Remove a block handler
   * @param id Handler identifier to remove
   */
  removeHandler(id: string) {
    const existed = this.handlers.delete(id);
    logger.debug("Removed block handler", {
      class: "BlockMonitor",
      handlerId: id,
      existed,
      remainingHandlers: this.handlers.size,
    });
  }

  /**
   * Check if a handler exists
   * @param id Handler identifier to check
   */
  hasHandler(id: string): boolean {
    const exists = this.handlers.has(id);
    logger.debug("Checked handler existence", {
      class: "BlockMonitor",
      handlerId: id,
      exists,
    });
    return exists;
  }

  /**
   * Clear all handlers
   */
  clearHandlers() {
    const count = this.handlers.size;
    this.handlers.clear();
    logger.info("Cleared all block handlers", {
      class: "BlockMonitor",
      handlersCleared: count,
    });
  }

  private async handleBlock(block: Block) {
    logger.debug("Processing new block", {
      class: "BlockMonitor",
      blockNumber: block.number?.toString(),
      handlersCount: this.handlers.size,
    });

    const startTime = performance.now();
    const promises = Array.from(this.handlers.entries()).map(
      async ([id, handler]) => {
        try {
          await handler(block);
          logger.debug("Handler completed successfully", {
            class: "BlockMonitor",
            handlerId: id,
            blockNumber: block.number?.toString(),
          });
        } catch (error) {
          logger.error("Error in block handler", {
            class: "BlockMonitor",
            handlerId: id,
            blockNumber: block.number?.toString(),
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    );

    await Promise.all(promises);
    const duration = performance.now() - startTime;

    logger.debug("Block processing completed", {
      class: "BlockMonitor",
      blockNumber: block.number?.toString(),
      durationMs: duration.toFixed(2),
      handlersCount: this.handlers.size,
    });
  }
}
