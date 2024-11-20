import { LiquidationBot } from "./liquidationBot";

async function main(): Promise<void> {
  const bot = new LiquidationBot();

  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    bot.stop();
    process.exit(0);
  });

  // Start the bot
  try {
    await bot.startMonitoring();
    console.log("Bot is running. Press Ctrl+C to stop.");

    // Keep the process running
    await new Promise(() => {}); // Never resolves, keeps process alive
  } catch (error) {
    console.error("Error running bot:", error);
    bot.stop();
    process.exit(1);
  }
}

// Explicitly handle promise rejection
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
