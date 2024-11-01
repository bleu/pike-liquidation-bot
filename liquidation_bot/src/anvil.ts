import { Anvil, createAnvil } from "@viem/anvil";
import { join } from "path";
import fs from "fs";
import { ethers } from "ethers";
import { getEnv, toHex } from "./utils";
import { ISendTransaction, TransactionFactory } from "./transactions";

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

export const setupAnvil = async (): Promise<{
  anvil: Anvil;
  provider: ethers.JsonRpcProvider;
}> => {
  const homeDir = getEnv("HOME");
  const defaultAnvilPath = join(homeDir, ".foundry", "bin", "anvil");

  if (!fs.existsSync(defaultAnvilPath)) {
    throw new Error(
      "Anvil binary not found at " +
        defaultAnvilPath +
        ". Please install Foundry: curl -L https://foundry.paradigm.xyz | bash"
    );
  }

  const forkUrl = getEnv("FORK_URL");
  if (!forkUrl) {
    throw new Error("FORK_URL environment variable must be set");
  }

  const forkBlockNumber = getEnv("FORK_BLOCK_NUMBER", "latest");
  const parsedBlockNumber = parseBlockNumber(forkBlockNumber);

  console.log("Starting Anvil with configuration:", {
    forkUrl,
    forkBlockNumber: parsedBlockNumber ?? "latest",
    anvilPath: defaultAnvilPath,
  });

  const anvil = createAnvil({
    anvilBinary: defaultAnvilPath,
    forkUrl: forkUrl,
    forkBlockNumber: parsedBlockNumber,
    autoImpersonate: true,
    timeout: 60000,
    port: 8545,
    host: "127.0.0.1",
    noMining: true,
  });

  // Start anvil
  await anvil.start();
  console.log("Anvil started, waiting for initialization...");

  // Wait for node to initialize
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Create and test provider
  const provider = new ethers.JsonRpcProvider(
    `http://${anvil.host}:${anvil.port}`
  );

  // Test connection with retries
  let connected = false;
  for (let i = 0; i < 5; i++) {
    try {
      await provider.getNetwork();
      connected = true;
      break;
    } catch (error) {
      if (i === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!connected) {
    throw new Error("Failed to connect to Anvil after multiple attempts");
  }

  return { anvil, provider };
};

export const withAnvilProvider = async (
  callback: (
    wallets: string[],
    transactionFactory: TransactionFactory
  ) => Promise<void>
) => {
  let anvil: Anvil | undefined;
  let provider: ethers.JsonRpcProvider | undefined;

  try {
    console.log("Setting up Anvil...");
    const setup = await setupAnvil();
    anvil = setup.anvil;
    provider = setup.provider;

    console.log("Successfully connected to Anvil");

    const defaultSigners = [
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    ].map((key) => new ethers.Wallet(key, provider));

    const targetBalance = ethers.parseEther("1000000000");

    console.log(
      `Default signers:\n${defaultSigners
        .map((signer) => `${signer.privateKey} => ${signer.address}`)
        .join("\n")}`
    );

    // Set balances with retry mechanism
    for (const signer of defaultSigners) {
      let success = false;
      for (let i = 0; i < 3; i++) {
        try {
          const address = await signer.getAddress();
          await provider.send("anvil_setBalance", [
            address,
            toHex(targetBalance),
          ]);
          success = true;
          break;
        } catch (error) {
          console.log(
            `Retry ${i + 1} setting balance for ${await signer.getAddress()}`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      if (!success) {
        throw new Error(
          `Failed to set balance for ${await signer.getAddress()}`
        );
      }
    }

    const anvilSendTransaction: ISendTransaction = async (data) => {
      console.log("Sending transaction");
      if (!data.from) throw new Error("from address not set");
      if (!provider) throw new Error("provider not initialized");
      console.log(`Sending transaction: ${JSON.stringify(data)}`);
      const signer = await getSigner(data.from, provider);
      console.log(`Sending transaction from: ${signer.address}`);
      const tx = await signer.sendTransaction(data);
      const receipt = await tx.wait();
      if (receipt?.status === 0) {
        throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
      }
    };

    const anvilTransactionFactory = new TransactionFactory(
      anvilSendTransaction,
      provider
    );

    await callback(
      defaultSigners.map((signer) => signer.address),
      anvilTransactionFactory
    );
  } catch (error) {
    console.error("Error in withAnvilProvider:", error);
    throw error;
  } finally {
    if (anvil) {
      console.log("Stopping anvil");
      try {
        await anvil.stop();
      } catch (error) {
        console.error("Error stopping anvil:", error);
      }
    }
  }
};

export const getSigner = async (
  who: string,
  provider: ethers.JsonRpcProvider
) => {
  try {
    return await provider.getSigner(who);
  } catch (err) {
    console.log(`Impersonating account: ${who}`);
    await provider.send("anvil_impersonateAccount", [who]);
    return await provider.getSigner(who);
  }
};
