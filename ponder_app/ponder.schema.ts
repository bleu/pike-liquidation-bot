// src/schema/ponder.schema.ts
import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // Markets represent lending pools with risk parameters
  Market: p.createTable({
    id: p.string(), // Market (rToken) address
    supplyCap: p.bigint(), // Supply cap
    borrowCap: p.bigint(), // Borrow cap
    collateralFactor: p.bigint(), // Collateral factor
    liquidationThreshold: p.bigint(), // Liquidation threshold
    reserveFactorMantissa: p.bigint(), // Reserve factor
    protocolSeizeShareMantissa: p.bigint(), // Protocol seize share
    riskEngine: p.string(), // RiskEngine address
    initialExchangeRateMantissa: p.bigint(), // Initial exchange rate
    borrowRateMaxMantissa: p.bigint(), // Maximum borrow rate
    baseRatePerSecond: p.bigint(), // Base rate per second
    multiplierPerSecond: p.bigint(), // Multiplier per second
    firstJumpMultiplierPerSecond: p.bigint(), // First jump multiplier per second
    secondJumpMultiplierPerSecond: p.bigint(), // Second jump multiplier per second
    firstKink: p.bigint(), // First kink
    secondKink: p.bigint(), // Second kink
    isListed: p.boolean(), // Market listing status
    lastUpdated: p.bigint(), // Last update timestamp
  }),

  // User positions in markets
  Position: p.createTable(
    {
      id: p.string(), // {market}-{user} composite
      marketId: p.string().references("Market.id"),
      userAddress: p.string(), // User address
      balance: p.bigint(), // pToken balance
      borrowed: p.bigint(), // Amount borrowed
      borrowIndex: p.bigint(), // User's borrow index in market
      isCollateral: p.boolean(), // Used as collateral?
      lastUpdated: p.bigint(), // Last update timestamp
    },
    {
      byUser: p.index("userAddress"),
      byMarket: p.index("marketId"),
      byUserMarket: p.index(["userAddress", "marketId"]),
    }
  ),

  // Delegate permissions
  Delegate: p.createTable({
    id: p.string(), // {permission}-{nestedAddress}-{target} composite
    permission: p.string(), // Permission identifier (bytes32 as hex string)
    nestedAddress: p.string(), // Nested contract address
    target: p.string(), // Target address
    approved: p.boolean(), // Approval status
    lastUpdated: p.bigint(), // Last update timestamp
  }),

  // Transaction history for mint/burn/borrow/repay
  Transaction: p.createTable(
    {
      id: p.string(), // Transaction hash + log index + type (to ensure uniqueness)
      marketId: p.string().references("Market.id"),
      userAddress: p.string(), // User address
      type: p.string(), // Transaction type (mint, redeem, borrow, repay, liquidate, transfer_in, transfer_out)
      amount: p.bigint(), // Transaction amount
      timestamp: p.bigint(), // Transaction timestamp
    },
    {
      byUser: p.index("userAddress"),
      byMarket: p.index("marketId"),
      byTimestamp: p.index("timestamp"),
    }
  ),
}));
