// src/index.ts

import { LiquidationBot } from "./liquidationBot";
import {
  createWalletClientFromPrivateKey,
  PikeClient,
} from "./services/clients";
import { getEnv } from "./utils/env";

async function main(): Promise<void> {
  const pikeClient = new PikeClient(
    createWalletClientFromPrivateKey(
      process.env.BOT_PRIVATE_KEY as `0x${string}`
    )
  );
  const protocolId = getEnv("PROTOCOL_ID");
  const bot = new LiquidationBot({ pikeClient, protocolId });

  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    process.exit(0);
  });

  // Start the bot
  try {
    console.log("Bot is running. Press Ctrl+C to stop.");
    // Initial update
    await bot.runLiquidationCycle();

    setInterval(bot.runLiquidationCycle, 1000 * 60 * 5); // 5 minutes

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
