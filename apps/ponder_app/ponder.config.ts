import { createConfig } from "@ponder/core";
import { http } from "viem";
import { RiskEngineAbi } from "./abis/RiskEngineAbi";
import { pTokenAbi } from "./abis/pTokenAbi";

const pstETH = "0x429eE52f7E9310F6B835018C8A1C99EA9fE3a5a3";
const pWETH = "0x1Efd1B20B51B16c0f5378311DA5047AC8EeAf03c";
const pUSDC = "0x2cE3bC8EA6f706aa5E0eBA99087d6fCA1D3705Ef";

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532,
      transport: http("https://base-sepolia.blockpi.network/v1/rpc/public"),
      // transport: http(process.env.BASE_SEPOLIA_RPC_URL),
    },
  },
  contracts: {
    pToken: {
      address: [pstETH, pWETH, pUSDC],
      abi: pTokenAbi,
      network: "baseSepolia",
      startBlock: 16959390,
    },
    RiskEngine: {
      address: "0x67C92c13c8c16D6e526CcB6095F618e402dFB098",
      abi: RiskEngineAbi,
      network: "baseSepolia",
      startBlock: 16959396,
    },
    // DoubleJumpRateModel: {
    //   address: "0x8b1e610594377914E00FBc8c79253DD4987947b6",
    //   abi: DoubleJumpRateModelAbi,
    //   network: "baseSepolia",
    //   startBlock: 16959382,
    // },
    // ChainlinkOracleProvider: {
    //   abi: chainlinkOracleProviderAbi,
    //   address: "0x10D679a9B4A32890dC61B22b0500265686451cD2",
    //   network: "baseSepolia",
    //   startBlock: 16959390,
    // },
    // PythOracleProvider: {
    //   abi: pythOracleProviderAbi,
    //   address: "0x463713B598690b9102FE4De1311ea7e8F48a8526",
    //   network: "baseSepolia",
    //   startBlock: 16959390,
    // },
    // OracleEngine: {
    //   abi: oracleEngineAbi,
    //   address: "0x67C8DB5A5eD014071A929380e04c081ae3437e41",
    //   network: "baseSepolia",
    //   startBlock: 16959390,
    // },
  },
});
