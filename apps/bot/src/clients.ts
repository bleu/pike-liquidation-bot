import { createPublicClient, createWalletClient, http } from "viem";
import { getEnv } from "./utils/env";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

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
