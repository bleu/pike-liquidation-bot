import { Address } from "viem";
import { pstETH, pUSDC, pWETH, stETH, USDC, WETH } from "@pike-liq-bot/utils";

export const defaultAddresses = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
];

export const initialUsdcPrice = BigInt(1e6);
export const initialWethPrice = BigInt(1000e6);
export const initialStEthPrice = BigInt(1000e6);

export const getUnderlying = (pToken: Address) => {
  if (pToken === pWETH) return WETH;
  if (pToken === pUSDC) return USDC;
  if (pToken === pstETH) return stETH;
  throw new Error(`Unknown pToken: ${pToken}`);
};

export const getDecimals = (token: Address) => {
  // @ts-ignore
  if ([WETH, stETH, pUSDC, pWETH, pstETH].includes(token)) return 18n;
  if (token === USDC) return 6n;
  throw new Error(`Unknown token: ${token}`);
};

export const getSymbol = (token: Address) => {
  switch (token) {
    case WETH:
      return "WETH";
    case USDC:
      return "USDC";
    case stETH:
      return "stETH";
    case pWETH:
      return "pWETH";
    case pUSDC:
      return "pUSDC";
    case pstETH:
      return "pstETH";
    default:
      throw new Error(`Unknown token: ${token}`);
  }
};

export const initialCF = BigInt(75e16);
export const initialLF = BigInt(90e16);
