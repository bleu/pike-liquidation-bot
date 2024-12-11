import { createConfig } from "@ponder/core";
import { erc20Abi, http } from "viem";
import {
  pstETH,
  pTokenAbi,
  pUSDC,
  pWETH,
  riskEngine,
  riskEngineAbi,
  stETH,
  USDC,
  WETH,
} from "@pike-liq-bot/utils";

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532,
      transport: http("https://base-sepolia.blockpi.network/v1/rpc/public"),
    },
  },
  contracts: {
    pToken: {
      address: [pstETH, pWETH, pUSDC],
      abi: pTokenAbi,
      network: "baseSepolia",
      startBlock: 17605796,
    },
    RiskEngine: {
      address: riskEngine,
      abi: riskEngineAbi,
      network: "baseSepolia",
      startBlock: 17605781,
    },
    underlyingToken: {
      address: [stETH, WETH, USDC],
      abi: erc20Abi,
      network: "baseSepolia",
      startBlock: 17605796,
    },
  },
});
