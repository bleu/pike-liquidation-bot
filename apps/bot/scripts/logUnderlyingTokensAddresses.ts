import { publicClient } from "#/services/clients";
import { pstETH, pTokenAbi, pUSDC, pWETH } from "@pike-liq-bot/utils";

async function logUnderlyingTokensAddresses() {
  const ret = await publicClient.multicall({
    contracts: [
      {
        address: pWETH,
        abi: pTokenAbi,
        functionName: "underlying",
      },
      {
        address: pUSDC,
        abi: pTokenAbi,
        functionName: "underlying",
      },
      {
        address: pstETH,
        abi: pTokenAbi,
        functionName: "underlying",
      },
    ],
  });

  console.log("Underlying tokens addresses:");
  const tokenNames = ["WETH", "USDC", "stETH"];
  ret.forEach((r, i) => {
    console.log(`${tokenNames[i]}: ${r.result}`);
  });
}

logUnderlyingTokensAddresses();
