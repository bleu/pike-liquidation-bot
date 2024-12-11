// src/index.ts

import { LiquidationBot } from "./liquidationBot";
import {
  createWalletClientFromPrivateKey,
  PikeClient,
} from "./services/clients";
import { logger } from "./services/logger";

async function main(): Promise<void> {
  const pikeClient = new PikeClient(
    createWalletClientFromPrivateKey(
      process.env.BOT_PRIVATE_KEY as `0x${string}`
    )
  );
  const bot = new LiquidationBot({ pikeClient });

  // Function to update positions
  const updatePositionsAndMarketData = async () => {
    try {
      await Promise.all([
        bot.updatePositionsToMonitor(),
        bot.updateMarketHandlerParameters(),
      ]);
    } catch (error) {
      logger.error("Error updating positions");
    }
  };

  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    process.exit(0);
  });

  // Start the bot
  try {
    console.log("Bot is running. Press Ctrl+C to stop.");

    // Set up periodic updates every 30 seconds
    setInterval(updatePositionsAndMarketData, 30000);

    // Set up periodic liquidation checks every 500ms
    setInterval(bot.updatePricesAndCheckForLiquidation, 500);

    // Initial update
    await updatePositionsAndMarketData();

    // Keep the process running
    await new Promise(() => {}); // Never resolves, keeps process alive
  } catch (error) {
    console.error("Error running bot:", error);
    process.exit(1);
  }
}

// Explicitly handle promise rejection
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
