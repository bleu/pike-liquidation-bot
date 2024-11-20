import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { getEnv } from "./env";

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
