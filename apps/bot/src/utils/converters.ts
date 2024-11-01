import { ethers } from "ethers";

export const fnCalldata = (sig: string, encodedData: string) =>
  ethers.solidityPacked(["bytes4", "bytes"], [fnSelector(sig), encodedData]);

export const toHex = (num: bigint) => `0x${num.toString(16)}`;

export const toBigInt = (hex: string) => BigInt(hex);

export function normalizeAddress(paddedAddress: string): string {
  const cleaned = paddedAddress.replace("0x", "");
  return "0x" + cleaned.slice(-40);
}

export const DEFAULT_ABI_CODER = new ethers.AbiCoder();

export const fnSelector = (sig: string) => ethers.id(sig).slice(0, 10);
