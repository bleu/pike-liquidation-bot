import { createWalletClientFromPrivateKey, PikeClient } from "./clients";
import { LiquidationBot } from "./liquidationBot";
import { getEnv } from "./utils/env";

async function startBot() {
  console.log("Starting liquidation bot...");

  // Initialize clients
  const walletClient = createWalletClientFromPrivateKey(
    getEnv("BOT_PRIVATE_KEY") as `0x${string}`
  );
  const pikeClient = new PikeClient(walletClient);

  // Create bot instance
  const bot = new LiquidationBot({ pikeClient });

  // Setup graceful shutdown
  let isShuttingDown = false;

  async function shutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log("\nShutting down bot...");

    // Stop all position monitors
    Object.keys(bot.unwatchesFn).forEach((borrower) => {
      bot.stopMonitorPosition(borrower as any);
    });

    // Add any cleanup logic here

    console.log("Bot shutdown complete");
    process.exit(0);
  }

  // Handle shutdown signals
  process.on("SIGINT", shutdown); // Ctrl+C
  process.on("SIGTERM", shutdown); // Kill command

  try {
    // Start monitoring
    await bot.startToMonitor();

    // Keep the process running
    console.log("Bot is running. Press Ctrl+C to stop.");

    // Optional: Periodically update positions and prices
    const updateInterval = 5 * 60 * 1000; // 5 minutes
    setInterval(async () => {
      try {
        await bot.updateTokenPrices();
        await bot.updatePositionsToMonitor();
      } catch (error) {
        console.error("Error during periodic update:", error);
      }
    }, updateInterval);
  } catch (error) {
    console.error("Error starting bot:", error);
    await shutdown();
  }
}

// Start the bot
startBot().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
