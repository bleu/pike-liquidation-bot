import { Block, PublicClient } from "viem";

export type BlockHandler = (block: Block) => Promise<void>;

export class BlockMonitor {
  private handlers: Map<string, BlockHandler> = new Map();
  private watching: boolean = false;
  private unwatchFn?: () => void;

  constructor(private readonly publicClient: PublicClient) {}

  /**
   * Start monitoring blocks
   */
  async startMonitoring() {
    if (this.watching) return;

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
    if (!this.watching) return;

    this.unwatchFn?.();
    this.watching = false;
  }

  /**
   * Add a new block handler
   * @param id Unique identifier for the handler
   * @param handler Function to be called for each block
   */
  addHandler(id: string, handler: BlockHandler) {
    this.handlers.set(id, handler);
  }

  /**
   * Remove a block handler
   * @param id Handler identifier to remove
   */
  removeHandler(id: string) {
    this.handlers.delete(id);
  }

  /**
   * Check if a handler exists
   * @param id Handler identifier to check
   */
  hasHandler(id: string): boolean {
    return this.handlers.has(id);
  }

  /**
   * Clear all handlers
   */
  clearHandlers() {
    this.handlers.clear();
  }

  private async handleBlock(block: Block) {
    const promises = Array.from(this.handlers.values()).map((handler) =>
      handler(block).catch((error) => {
        console.error("Error in block handler:", error);
      })
    );

    await Promise.all(promises);
  }
}
