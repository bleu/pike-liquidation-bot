import { createPublicClient, createWalletClient, http } from "viem";
import { getEnv } from "./utils/env";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { type Address, type WalletClient } from "viem";
import { mockOracle, riskEngine } from "./utils/contracts";
import { MaxUint256 } from "ethers";
import { getDecimals, getUnderlying } from "./utils/consts";
import { encodeFunctionData } from "viem";
import { mockOracleAbi } from "./abis/mockOracleAbi";
import { mockTokenAbi } from "./abis/mockTokenAbi";
import { pTokenAbi } from "./abis/pTokenAbi";
import { riskEngineAbi } from "./abis/riskEngineAbi";

export const chain = baseSepolia;
export const transport = http(getEnv("FORK_URL"));

export const publicClient = createPublicClient({
  chain,
  transport,
});

export function createWalletClientFromPrivateKey(privateKey: `0x${string}`) {
  return createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain,
    transport,
  });
}

export const tokenOwnerWalletClient = createWalletClientFromPrivateKey(
  getEnv("TOKEN_OWNER_PRIVATE_KEY") as `0x${string}`
);
export class PikeClient {
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
    const maxPriorityFeePerGas = 5_000_000_000n;

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
  async setOraclePrice({ token, price }: { token: Address; price: bigint }) {
    return this.sendAndWaitForReceipt({
      to: mockOracle,
      data: encodeFunctionData({
        abi: mockOracleAbi,
        functionName: "setPrice",
        args: [token, price, getDecimals(token)],
      }),
      value: 0n,
    });
  }

  async sendEth({ to, amount }: { to: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to,
      data: "0x",
      value: amount,
    });
  }

  async mintToken({ token, amount }: { token: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to: token,
      data: encodeFunctionData({
        abi: mockTokenAbi,
        functionName: "mint",
        args: [this.walletClient.account!.address, amount],
      }),
      value: 0n,
      walletClient: tokenOwnerWalletClient,
    });
  }

  async approveToken({ token, spender }: { token: Address; spender: Address }) {
    return this.sendAndWaitForReceipt({
      to: token,
      data: encodeFunctionData({
        abi: mockTokenAbi,
        functionName: "approve",
        args: [spender, MaxUint256],
      }),
      value: 0n,
    });
  }

  async depositToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "mint",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async enterMarket({ pTokens }: { pTokens: Address[] }) {
    return this.sendAndWaitForReceipt({
      to: riskEngine,
      data: encodeFunctionData({
        abi: riskEngineAbi,
        functionName: "enterMarkets",
        args: [pTokens],
      }),
      value: 0n,
    });
  }

  async borrowToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "borrow",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async createPositionRecipe({
    deposits,
    borrows,
  }: {
    deposits?: { pToken: Address; amount: bigint }[];
    borrows?: { pToken: Address; amount: bigint }[];
  }) {
    for (const { pToken, amount } of deposits ?? []) {
      await this.mintToken({ token: getUnderlying(pToken), amount });

      await this.approveToken({
        token: getUnderlying(pToken),
        spender: pToken,
      });

      await this.depositToken({ pToken, amount });
    }

    if (deposits) {
      await this.enterMarket({ pTokens: deposits.map(({ pToken }) => pToken) });
    }

    for (const { pToken, amount } of borrows ?? []) {
      await this.borrowToken({ pToken, amount });
    }
  }

  async repayToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "repayBorrow",
        args: [amount],
      }),
      value: 0n,
    });
  }

  async redeemToken({ pToken, amount }: { pToken: Address; amount: bigint }) {
    return this.sendAndWaitForReceipt({
      to: pToken,
      data: encodeFunctionData({
        abi: pTokenAbi,
        functionName: "redeem",
        args: [amount],
      }),
      value: 0n,
    });
  }
}
