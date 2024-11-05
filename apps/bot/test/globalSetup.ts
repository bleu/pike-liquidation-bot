import { startProxy } from "@viem/anvil";

export default async function () {
  return await startProxy({
    port: 8545, // By default, the proxy will listen on port 8545.
    host: "::", // By default, the proxy will listen on all interfaces.
    options: {
      chainId: 84532,
      forkUrl: process.env.FORK_URL,
      autoImpersonate: true,
      stepsTracing: false,
      disableBlockGasLimit: true,
      noMining: true,
      gasPrice: 0,
      retries: 0,
      forkRetryBackoff: 0,
      noRateLimit: true,
    },
  });
}
