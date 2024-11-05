import { startProxy } from "@viem/anvil";
import { ethers, JsonRpcProvider } from "ethers";
import { getEnv, ISendTransaction, toHex, TransactionFactory } from "../utils";
import { createPublicClient, http, PublicClient } from "viem";
import { baseSepolia } from "viem/chains";

/**
 * The id of the current test worker.
 *
 * This is used by the anvil proxy to route requests to the correct anvil instance.
 */
export const anvilPool = Number(process.env.VITEST_POOL_ID ?? 1);
export const anvilRpcUrl = `http://127.0.0.1:8545/${anvilPool}`;

function parseBlockNumber(blockNumber: string): number | undefined {
  if (blockNumber === "latest") {
    return undefined;
  }
  const parsed = Number(blockNumber);
  if (isNaN(parsed)) {
    throw new Error(
      `Invalid block number: ${blockNumber}. Must be 'latest' or a valid number.`
    );
  }
  return parsed;
}

export const setupAnvil = async () => {
  const forkUrl = getEnv("FORK_URL");
  if (!forkUrl) {
    throw new Error("FORK_URL environment variable must be set");
  }

  const forkBlockNumber = getEnv("FORK_BLOCK_NUMBER", "latest");
  const parsedBlockNumber = parseBlockNumber(forkBlockNumber);

  return await startProxy({
    options: {
      forkUrl: forkUrl,
      forkBlockNumber: parsedBlockNumber,
      autoImpersonate: true,
      stepsTracing: true,
      disableBlockGasLimit: true,
      blockTime: 0.01,
      gasPrice: 0,
    },
  });
};

export const anvilProvider = new JsonRpcProvider(anvilRpcUrl);

export const anvilGetSigner = async (
  who: string,
  provider: ethers.JsonRpcProvider
) => {
  try {
    return await provider.getSigner(who);
  } catch (err) {
    await provider.send("anvil_impersonateAccount", [who]);
    return await provider.getSigner(who);
  }
};

export const anvilSendTransaction: ISendTransaction = async (data) => {
  if (!data.from) throw new Error("from address not set");
  if (!anvilProvider) throw new Error("provider not initialized");
  const signer = await anvilGetSigner(data.from, anvilProvider);
  const tx = await signer.sendTransaction(data).catch((error) => {
    if (error.code === "INSUFFICIENT_FUNDS") {
      anvilProvider?.send("anvil_setBalance", [
        data.from,
        toHex(ethers.parseEther("10000")),
      ]);
      return signer.sendTransaction(data);
    }
    console.log(`Transaction send error: ${JSON.stringify(data)}`);
    throw error;
  });

  const receipt = await tx.wait();
  if (receipt?.status === 0) {
    throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
  }
};

export const anvilTransactionFactory = new TransactionFactory(
  anvilSendTransaction,
  anvilProvider
);

export const anvilPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(anvilRpcUrl),
}) as PublicClient;
