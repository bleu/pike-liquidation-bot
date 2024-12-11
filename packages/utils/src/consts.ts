import { pstETH, pUSDC, pWETH, stETH, USDC, WETH } from "./contracts";
import { Address } from "viem";

export const getUnderlying = (pToken: Address) => {
  if (pToken.toLowerCase() === pWETH.toLowerCase()) return WETH;
  if (pToken.toLowerCase() === pUSDC.toLowerCase()) return USDC;
  if (pToken.toLowerCase() === pstETH.toLowerCase()) return stETH;
  throw new Error(`Unknown pToken: ${pToken}`);
};

export const getPToken = (underlying: Address) => {
  if (underlying.toLowerCase() === WETH.toLowerCase()) return pWETH;
  if (underlying.toLowerCase() === USDC.toLowerCase()) return pUSDC;
  if (underlying.toLowerCase() === stETH.toLowerCase()) return pstETH;
  throw new Error(`Unknown underlying: ${underlying}`);
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
