import { ethers } from "ethers";
import { config } from "dotenv";

export const toHex = (num: bigint) => `0x${num.toString(16)}`;

export function normalizeAddress(paddedAddress: string): string {
  const cleaned = paddedAddress.replace("0x", "");
  return "0x" + cleaned.slice(-40);
}

export const DEFAULT_ABI_CODER = new ethers.AbiCoder();

export const fnSelector = (sig: string) => ethers.id(sig).slice(0, 10);

export const getEnv = (env: string, def?: string) => {
  config();
  const val = process.env[env];
  if (!val) {
    if (!def) throw new Error(`Environment var not set: ${env}`);
    return def;
  }
  return val;
};

export const fnCalldata = (sig: string, encodedData: string) =>
  ethers.solidityPacked(["bytes4", "bytes"], [fnSelector(sig), encodedData]);
