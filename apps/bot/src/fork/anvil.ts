import { Anvil, createAnvil } from "@viem/anvil";
import { ethers } from "ethers";
import {
  defaultAddresses,
  getEnv,
  ISendTransaction,
  toHex,
  TransactionFactory,
} from "../utils";

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
  const forkUrl = getEnv("FORK_URL");
  if (!forkUrl) {
    throw new Error("FORK_URL environment variable must be set");
  }

  const forkBlockNumber = getEnv("FORK_BLOCK_NUMBER", "latest");
  const parsedBlockNumber = parseBlockNumber(forkBlockNumber);

  console.log("Starting Anvil with configuration:", {
    forkUrl,
    forkBlockNumber: parsedBlockNumber ?? "latest",
  });

  const anvil = createAnvil({
    forkUrl: forkUrl,
    forkBlockNumber: parsedBlockNumber,
    autoImpersonate: true,
  });

  // Start anvil
  await anvil.start();

  // Create and test provider
  const rpcUrl = `http://${anvil.host}:${anvil.port}`;
  console.log("Anvil created at", rpcUrl);
  const provider = new ethers.JsonRpcProvider(
    `http://${anvil.host}:${anvil.port}`
  );

  return { anvil, provider };
};

export const withAnvilProvider = async (
  callback: (transactionFactory: TransactionFactory) => Promise<void>
) => {
  let anvil: Anvil | undefined;
  let provider: ethers.JsonRpcProvider | undefined;

  try {
    console.log("Setting up Anvil...");
    const setup = await setupAnvil();
    anvil = setup.anvil;
    provider = setup.provider;

    console.log("Successfully connected to Anvil");

    const targetBalance = ethers.parseEther("1000000000");

    // Set balances with retry mechanism
    await Promise.all(
      defaultAddresses.map(async (address) => {
        provider?.send("anvil_setBalance", [address, toHex(targetBalance)]);
      })
    );

    const anvilSendTransaction: ISendTransaction = async (data) => {
      if (!data.from) throw new Error("from address not set");
      if (!provider) throw new Error("provider not initialized");
      const signer = await getSigner(data.from, provider);
      const tx = await signer.sendTransaction(data).catch((error) => {
        if (error.code === "INSUFFICIENT_FUNDS") {
          console.log(
            `Insufficient funds for transaction from ${data.from}. Sending 10000 ETH to the address`
          );
          provider?.send("anvil_setBalance", [
            data.from,
            toHex(ethers.parseEther("10000")),
          ]);
          return signer.sendTransaction(data);
        }
        throw error;
      });
      const receipt = await tx.wait();
      if (receipt?.status === 0) {
        throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
      }
    };

    const anvilTransactionFactory = new TransactionFactory(
      anvilSendTransaction,
      provider
    );

    await callback(anvilTransactionFactory);
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
    await provider.send("anvil_impersonateAccount", [who]);
    return await provider.getSigner(who);
  }
};
