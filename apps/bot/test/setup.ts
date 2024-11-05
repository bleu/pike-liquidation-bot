import { fetchLogs } from "@viem/anvil";
import { afterAll, afterEach } from "vitest";
import { anvilPool, anvilProvider, anvilRpcUrl } from "../src/fork/anvil";

afterAll(async () => {
  // If you are using a fork, you can reset your anvil instance to the initial fork block.
  anvilProvider.send("anvil_reset", []);
});

afterEach(async (context) => {
  context.onTestFailed(async () => {
    // If a test fails, you can fetch and print the logs of your anvil instance.
    const logs = await fetchLogs("http://localhost:8545", anvilPool);
    // Only print the 20 most recent log messages.
    console.log(...logs.slice(-20));
    console.log({ anvilPool, anvilRpcUrl });
  });
});
