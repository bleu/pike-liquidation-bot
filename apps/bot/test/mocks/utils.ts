import { AllUserPositions } from "#/types";
import { pstETH, pUSDC, pWETH } from "@pike-liq-bot/utils";
import { type Block } from "viem";

export function createMockBlock(number: bigint = 1n): Block {
  return {
    number,
    hash: `0x${number.toString(16)}`,
    timestamp: BigInt(Date.now()),
    parentHash: "0x0",
    nonce: "0x0",
    difficulty: 0n,
    gasLimit: 30000000n,
    gasUsed: 0n,
    miner: "0x0000000000000000000000000000000000000000",
    extraData: "0x",
    baseFeePerGas: 1000000000n,
    size: 1000n,
    transactions: [],
    stateRoot: "0x0",
    receiptsRoot: "0x0",
    transactionsRoot: "0x0",
    mixHash: "0x0",
    totalDifficulty: 0n,
    blobGasUsed: 0n,
    excessBlobGas: 0n,
    logsBloom: "0x0",
    sealFields: [],
    sha3Uncles: "0x0",
    uncles: [],
  } as Block;
}

export const userA = "0x62dd5bf48a9dc65113df25b3c68d01a7c161bb63" as const;
export const userB = "0x87a02bd69cfa511faccc97cd339e16243daf4a5e" as const;
export const userC = "0x96520fb8fe267034e23accbd4940dfb4648e7c3a" as const;
export const userD = "0xcbe2195005c4b8692dbcca5fa9511de2efa32c8d" as const;
export const userE = "0x0e10f9a63a7800fe4c657334dd6543068ab8a50d" as const;

export const positionUserA = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const positionUserB = {
  borrowPTokens: [pWETH, pstETH] as const,
  collateralPTokens: [pUSDC] as const,
};

export const positionUserC = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH, pUSDC] as const,
};

export const positionUserD = {
  borrowPTokens: [pUSDC, pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const positionUserE = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const initialPricesBlock = 18486556n;

export const usdcLowPriceBlock = 18486558n;
export const usdcHighPriceBlock = 18486562n;
export const wethLowPriceBlock = 18486569n;
export const wethHighPriceBlock = 18486573n;
export const stEthLowPriceBlock = 18486581n;
export const stEthHighPriceBlock = 18486586n;

export const mockUserAPosition: AllUserPositions = {
  id: userA,
  lastUpdated: 100n,
  positions: [
    // Collateral: WETH
    {
      marketId: pWETH,
      balance: 1000000000000000000n, // 1 WETH
      borrowed: 0n,
      isOnMarket: true,
    },
    // Borrow: stETH
    {
      marketId: pstETH,
      balance: 0n,
      borrowed: 500000000000000000n, // 0.5 stETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
  ],
};

export const mockUserBPosition: AllUserPositions = {
  id: userB,
  lastUpdated: 100n,
  positions: [
    // Collateral: USDC
    {
      marketId: pUSDC,
      balance: 2000000000n, // 2000 USDC (6 decimals)
      borrowed: 0n,
      isOnMarket: true,
    },
    // Borrow: WETH and stETH
    {
      marketId: pWETH,
      balance: 0n,
      borrowed: 300000000000000000n, // 0.3 WETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
    {
      marketId: pstETH,
      balance: 0n,
      borrowed: 200000000000000000n, // 0.2 stETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
  ],
};

export const mockUserCPosition: AllUserPositions = {
  id: userC,
  lastUpdated: 100n,
  positions: [
    {
      marketId: pWETH,
      balance: 500000000000000000n, // 0.5 WETH
      borrowed: 0n,
      isOnMarket: true,
    },
    {
      marketId: pUSDC,
      balance: 1500000000n, // 1500 USDC
      borrowed: 0n,
      isOnMarket: true,
    },
    // Borrow: stETH
    {
      marketId: pstETH,
      balance: 0n,
      borrowed: 400000000000000000n, // 0.4 stETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
  ],
};

export const mockUserDPosition: AllUserPositions = {
  id: userD,
  lastUpdated: 100n,
  positions: [
    // Collateral: WETH
    {
      marketId: pWETH,
      balance: 800000000000000000n, // 0.8 WETH
      borrowed: 0n,
      isOnMarket: true,
    },
    // Borrow: USDC and stETH
    {
      marketId: pUSDC,
      balance: 0n,
      borrowed: 1000000000n, // 1000 USDC
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
    {
      marketId: pstETH,
      balance: 0n,
      borrowed: 250000000000000000n, // 0.25 stETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
  ],
};

export const mockUserEPosition: AllUserPositions = {
  id: userE,
  lastUpdated: 100n,
  positions: [
    // Collateral: WETH
    {
      marketId: pWETH,
      balance: 1200000000000000000n, // 1.2 WETH
      borrowed: 0n,
      isOnMarket: true,
    },
    // Borrow: stETH
    {
      marketId: pstETH,
      balance: 0n,
      borrowed: 600000000000000000n, // 0.6 stETH
      isOnMarket: true,
      interestIndex: 1000000000000000000n,
    },
  ],
};

export const mockPositions = {
  userA: mockUserAPosition,
  userB: mockUserBPosition,
  userC: mockUserCPosition,
  userD: mockUserDPosition,
  userE: mockUserEPosition,
};
