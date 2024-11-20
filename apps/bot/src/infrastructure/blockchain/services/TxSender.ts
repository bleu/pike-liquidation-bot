import type { WalletClient, Address } from "viem";
import { publicClient } from "../../../utils/clients";

export class TxSender {
  private log: boolean;

  constructor(private walletClient: WalletClient) {
    this.log = false;
  }

  setLog(log: boolean) {
    this.log = log;
  }

  private async getOptimizedGasFees() {
    // Get current block's base fee
    const block = await publicClient.getBlock();
    const baseFee = block.baseFeePerGas!;

    // Set priority fee (2 Gwei)
    const maxPriorityFeePerGas = 5000000000n;

    // maxFeePerGas must be at least baseFee + maxPriorityFeePerGas
    // Add 20% buffer to ensure better inclusion
    const maxFeePerGas =
      baseFee + maxPriorityFeePerGas + (baseFee * 50n) / 100n;

    if (this.log) {
      console.log(`Base fee: ${baseFee} wei`);
      console.log(`Max priority fee: ${maxPriorityFeePerGas} wei`);
      console.log(`Max fee: ${maxFeePerGas} wei`);
    }

    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }

  private async waitForTransactionWithTimeout(
    hash: `0x${string}`,
    timeoutMs: number = 15000, // 1 minute default timeout
    pollIntervalMs: number = 5000 // 5 second polling interval
  ) {
    const startTime = Date.now();

    while (true) {
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash });
        if (receipt) return receipt;
      } catch (error) {
        if (this.log) {
          // @ts-ignore
          console.warn(`Error fetching receipt: ${error.message}`);
        }
      }

      if (Date.now() - startTime > timeoutMs) {
        throw new Error(
          `Transaction ${hash} not mined within ${timeoutMs / 1000} seconds`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }

  async sendAndWaitForReceipt(tx: {
    to: Address;
    data: `0x${string}`;
    value: bigint;
    walletClient?: WalletClient;
    maxRetries?: number;
  }) {
    const maxRetries = tx.maxRetries ?? 3;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxRetries) {
      try {
        const walletClientToUse = tx.walletClient ?? this.walletClient;

        // Get optimized gas fees
        const gasFees = await this.getOptimizedGasFees();

        // Estimate gas with a buffer
        const gasEstimate = await publicClient.estimateGas({
          account: walletClientToUse.account!,
          ...tx,
        });
        const gasLimit = (gasEstimate * 120n) / 100n; // Add 20% buffer

        if (this.log) {
          console.log(
            `Sending transaction from ${walletClientToUse.account?.address} to ${tx.to}`,
            `data: ${tx.data}`,
            `value: ${tx.value}`,
            `\nValue: ${tx.value}`,
            `\nGas Limit: ${gasLimit}`,
            `\nMax Fee: ${gasFees.maxFeePerGas} wei`,
            `\nPriority Fee: ${gasFees.maxPriorityFeePerGas} wei`
          );
        }

        const hash = await walletClientToUse.sendTransaction({
          ...tx,
          account: walletClientToUse.account!,
          chain: walletClientToUse.chain,
          ...gasFees,
          gas: gasLimit,
        });

        if (this.log) {
          console.log(`Transaction hash: ${hash}`);
        }

        // Wait for receipt with timeout
        const receipt = await this.waitForTransactionWithTimeout(hash);

        if (receipt.status === "reverted") {
          console.error(`Transaction reverted: ${JSON.stringify(receipt)}`);
          throw new Error("Transaction reverted");
        }

        if (this.log) {
          console.log(`Transaction ${hash} mined successfully`);
        }
        return receipt;
      } catch (error) {
        // @ts-ignore
        lastError = error;
        attempt++;

        if (attempt === maxRetries) {
          console.error(
            // @ts-ignore
            `Failed after ${maxRetries} attempts. Last error: ${error.message}`
          );
          throw error;
        }

        // Exponential backoff between retries
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 30000);
        if (this.log) {
          console.log(
            `Attempt ${attempt} failed. Retrying in ${
              backoffMs / 1000
            } seconds...`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw lastError || new Error("Transaction failed for unknown reason");
  }
}
