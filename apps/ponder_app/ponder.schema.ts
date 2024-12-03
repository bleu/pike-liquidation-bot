// src/schema/ponder.schema.ts
import { onchainTable, primaryKey, relations } from "@ponder/core";

export const riskEngine = onchainTable("riskEngine", (t) => ({
  id: t.hex().primaryKey(), // RiskEngine address
  oracleEngine: t.hex().default("0x0000000000000000000000000000000000000000"), // OracleEngine address
  closeFactorMantissa: t.bigint().default(0n), // Close factor
  liquidationIncentiveMantissa: t.bigint().default(0n), // Liquidation incentive
  lastUpdated: t.bigint().default(0n), // Last update timestamp
}));

export const market = onchainTable("market", (t) => ({
  id: t.hex().primaryKey(), // Market (rToken) address
  supplyCap: t.bigint().default(0n), // Supply cap
  borrowCap: t.bigint().default(0n), // Borrow cap
  collateralFactor: t.bigint().default(0n), // Collateral factor
  liquidationThreshold: t.bigint().default(0n), // Liquidation threshold
  reserveFactorMantissa: t.bigint().default(0n), // Reserve factor
  protocolSeizeShareMantissa: t.bigint().default(0n), // Protocol seize share
  riskEngineId: t.hex().default("0x0000000000000000000000000000000000000000"), // RiskEngine address
  initialExchangeRateMantissa: t.bigint().default(0n), // Initial exchange rate
  borrowRateMaxMantissa: t.bigint().default(0n), // Maximum borrow rate
  baseRatePerSecond: t.bigint().default(0n), // Base rate per second
  multiplierPerSecond: t.bigint().default(0n), // Multiplier per second
  firstJumpMultiplierPerSecond: t.bigint().default(0n), // First jump multiplier per second
  secondJumpMultiplierPerSecond: t.bigint().default(0n), // Second jump multiplier per second
  firstKink: t.bigint().default(0n), // First kink
  secondKink: t.bigint().default(0n), // Second kink
  isListed: t.boolean().default(false), // Market listing status
  lastUpdated: t.bigint().default(0n), // Last update timestamp
}));

export const user = onchainTable("user", (t) => ({
  id: t.hex().primaryKey(), // User address
  lastUpdated: t.bigint().notNull(), // Last update timestamp
}));

export const position = onchainTable(
  "position",
  (t) => ({
    id: t.uuid(), // Position ID
    marketId: t.hex().notNull(), // Market (rToken) address
    userId: t.hex().notNull(), // User address
    balance: t.bigint().notNull(), // pToken balance
    borrowed: t.bigint().notNull(), // Amount borrowed
    isOnMarket: t.boolean().notNull(), // User is on market
    lastUpdated: t.bigint().notNull(), // Last update timestamp
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.marketId, table.userId] }),
  })
);

export const riskEngineRelations = relations(riskEngine, ({ many }) => ({
  markets: many(market),
}));

export const usersRelations = relations(user, ({ many }) => ({
  positions: many(position),
}));

export const marketsRelations = relations(market, ({ many, one }) => ({
  positions: many(position),
  riskEngine: one(riskEngine, {
    fields: [market.riskEngineId],
    references: [riskEngine.id],
  }),
}));

export const positionsRelations = relations(position, ({ one }) => ({
  user: one(user, { fields: [position.userId], references: [user.id] }),
  market: one(market, {
    fields: [position.marketId],
    references: [market.id],
  }),
}));
