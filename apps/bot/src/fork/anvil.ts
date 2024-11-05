import { testClient } from "../../test/utils";
import { Address, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ISendTransaction, toHex, TransactionFactory } from "../utils";
import { getTransactionCount } from "viem/_types/actions/public/getTransactionCount";

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

const impersonateAccount = async (address: Address) => {
  await testClient.request({
    method: "anvil_impersonateAccount",
    params: [address],
  });
};

const setBalance = async (address: `0x${string}`) => {
  await testClient.request({
    method: "anvil_setBalance",
    params: [address, toHex(parseEther("10000"))],
  });
};

export const anvilSendTransaction: ISendTransaction = async (data) => {
  if (!data.from || data.from === "0x") throw new Error("from address not set");

  try {
    await impersonateAccount(data.from);

    console.log({ data });
    const txCount = await testClient.getTransactionCount({
      address: data.from as `0x${string}`,
      blockTag: "latest",
    });

    const hash = await testClient
      .sendTransaction({
        nonce: txCount + 1,
        account: data.from as `0x${string}`,
        to: data.to as `0x${string}`,
        data: data.data as `0x${string}`,
        value: data.value ? BigInt(data.value.toString()) : 0n,
      })
      .catch(async (error) => {
        if (error.message.includes("Insufficient funds")) {
          await setBalance(data.from!);
          return testClient.sendTransaction({
            account: data.from as `0x${string}`,
            to: data.to as `0x${string}`,
            data: data.data as `0x${string}`,
            value: data.value ? BigInt(data.value.toString()) : 0n,
          });
        }
        console.log(`Transaction send error: ${JSON.stringify(data)}`);
        throw error;
      });

    // const receipt = await testClient.waitForTransactionReceipt({ hash });
    // if (receipt.status === "reverted") {
    //   throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
    // }
    await testClient.mine({
      blocks: 1,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};

// Create transaction factory using the Viem-based sender but keeping the original interface
export const anvilTransactionFactory = new TransactionFactory(
  anvilSendTransaction,
  testClient
);

export const anvilPublicClient = testClient;
