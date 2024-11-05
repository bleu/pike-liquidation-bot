import {
  encodeFunctionData,
  parseAbiItem,
  getAddress,
  encodePacked,
  keccak256,
  encodeAbiParameters,
  decodeAbiParameters,
  decodeFunctionData,
} from "viem";

// Create a reusable ABI coder instance
export const DEFAULT_ABI_CODER = {
  encode: (types, values) =>
    encodeAbiParameters(
      types.map((type) => ({ type })),
      values
    ),
  decode: (types, data) =>
    decodeAbiParameters(
      types.map((type) => ({ type })),
      data
    ),
};

export const fnSelector = (sig: string): `0x${string}` => {
  // Get the function selector (first 4 bytes of the hash)
  return keccak256(Buffer.from(sig)).slice(0, 10) as `0x${string}`;
};

export const fnCalldata = (
  sig: string,
  encodedData: `0x${string}`
): `0x${string}` => {
  // Concatenate function selector with encoded data
  return encodePacked(["bytes4", "bytes"], [fnSelector(sig), encodedData]);
};

export const toHex = (num: bigint): `0x${string}` =>
  `0x${num.toString(16)}` as `0x${string}`;

export const toBigInt = (hex?: string): undefined | bigint =>
  !!hex ? BigInt(hex) : undefined;

export function normalizeAddress(
  paddedAddress: undefined | string | { data: string }
): `0x${string}` {
  if (!paddedAddress) {
    console.log({ paddedAddress });
    return "0x";
  }

  // Use Viem's getAddress to normalize and checksum the address
  if (typeof paddedAddress === "object") {
    return getAddress("0x" + paddedAddress.data.slice(-40));
  }

  return getAddress("0x" + paddedAddress.slice(-40));
}

// Helper function to parse ABI signatures
export const parseSignature = (signature: string) => parseAbiItem(signature);
