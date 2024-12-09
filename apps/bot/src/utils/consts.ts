import { Address } from "viem";
import { pstETH, pUSDC, pWETH, stETH, USDC, WETH } from "@pike-liq-bot/utils";

export const defaultAddresses = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
];

export const initialUsdcPrice = BigInt(1e6);
export const initialWethPrice = BigInt(1000e6);
export const initialStEthPrice = BigInt(1000e6);

export const initialCF = BigInt(75e16);
export const initialLF = BigInt(90e16);
