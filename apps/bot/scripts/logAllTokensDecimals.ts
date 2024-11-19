import { Address } from "viem";
import { publicClient } from "#/services/clients";
import {
  pstETH,
  pTokenAbi,
  pUSDC,
  pWETH,
  stETH,
  USDC,
  WETH,
} from "@pike-liq-bot/utils";

const allTokens: Address[] = [pWETH, pUSDC, pstETH, WETH, USDC, stETH] as const;

const allTokensNames = [
  "pWETH",
  "pUSDC",
  "pstETH",
  "WETH",
  "USDC",
  "stETH",
] as const;

async function logAllTokensDecimals() {
  // @ts-ignore
  const ret = await publicClient.multicall({
    contracts: allTokens.map((token) => ({
      address: token,
      abi: pTokenAbi,
      functionName: "decimals",
    })),
  });

  console.log("Tokens decimals");
  ret.forEach((r, i) => {
    console.log(`${allTokensNames[i]}: ${r.result}`);
  });
}

logAllTokensDecimals();
