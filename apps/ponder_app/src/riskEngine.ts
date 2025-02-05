import { ponder } from "@/generated";
import { market, position, riskEngine } from "../ponder.schema";
import { createOrUpdateUser, NULL_ADDRESS } from "./utils";

// Handler for MarketListed event
ponder.on("RiskEngine:MarketListed", async ({ event, context }) => {
  const args = event.args;
  const { pToken } = args;

  await context.db.update(market, { id: pToken }).set({
    isListed: true,
    riskEngineId: event.log.address,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewSupplyCap event
ponder.on("RiskEngine:NewSupplyCap", async ({ event, context }) => {
  const { pToken, newSupplyCap } = event.args;
  // ignore null address
  if (pToken == NULL_ADDRESS) return;

  await context.db.update(market, { id: pToken }).set({
    supplyCap: newSupplyCap,
    lastUpdated: BigInt(event.block.timestamp),
  });

});

// Handler for NewBorrowCap event
ponder.on("RiskEngine:NewBorrowCap", async ({ event, context }) => {
  const { pToken, newBorrowCap } = event.args;
  // ignore null address
  if (pToken == NULL_ADDRESS) return;
  
  await context.db.update(market, { id: pToken }).set({
    borrowCap: newBorrowCap,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewCollateralFactor event
ponder.on("RiskEngine:NewCollateralFactor", async ({ event, context }) => {
  const { pToken, newCollateralFactorMantissa } = event.args;

  await context.db.update(market, { id: pToken }).set({
    collateralFactor: newCollateralFactorMantissa,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewLiquidationThreshold event
ponder.on("RiskEngine:NewLiquidationThreshold", async ({ event, context }) => {
  const { pToken, newLiquidationThresholdMantissa } = event.args;

  await context.db.update(market, { id: pToken }).set({
    liquidationThreshold: newLiquidationThresholdMantissa,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

ponder.on("RiskEngine:MarketEntered", async ({ event, context }) => {
  const { pToken, account } = event.args;

  await createOrUpdateUser(context, account, event.block.timestamp);
  await context.db
    .insert(position)
    .values({
      marketId: pToken,
      userId: account,
      balance: 0n,
      borrowed: 0n,
      isOnMarket: true,
      lastUpdated: event.block.timestamp,
    })
    .onConflictDoUpdate({
      isOnMarket: true,
      lastUpdated: event.block.timestamp,
    });
});

ponder.on("RiskEngine:MarketExited", async ({ event, context }) => {
  const { pToken, account } = event.args;

  await createOrUpdateUser(context, account, event.block.timestamp);
  await context.db
    .insert(position)
    .values({
      marketId: pToken,
      userId: account,
      balance: 0n,
      borrowed: 0n,
      isOnMarket: false,
      lastUpdated: event.block.timestamp,
    })
    .onConflictDoUpdate({
      isOnMarket: false,
      lastUpdated: event.block.timestamp,
    });
});

ponder.on("RiskEngine:NewOracleEngine", async ({ event, context }) => {
  const { newOracleEngine } = event.args;
  const riskEngineId = event.log.address;
  await context.db
    .insert(riskEngine)
    .values({
      id: riskEngineId,
      oracleEngine: newOracleEngine,
      lastUpdated: BigInt(event.block.timestamp),
    })
    .onConflictDoUpdate({
      oracleEngine: newOracleEngine,
      lastUpdated: BigInt(event.block.timestamp),
    });
});

ponder.on("RiskEngine:NewCloseFactor", async ({ event, context }) => {
  const { newCloseFactorMantissa } = event.args;
  const riskEngineId = event.log.address;
  await context.db
    .insert(riskEngine)
    .values({
      id: riskEngineId,
      closeFactorMantissa: newCloseFactorMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    })
    .onConflictDoUpdate({
      closeFactorMantissa: newCloseFactorMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    });
});

ponder.on("RiskEngine:NewLiquidationIncentive", async ({ event, context }) => {
  const { newLiquidationIncentiveMantissa } = event.args;
  const riskEngineId = event.log.address;
  await context.db
    .insert(riskEngine)
    .values({
      id: riskEngineId,
      liquidationIncentiveMantissa: newLiquidationIncentiveMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    })
    .onConflictDoUpdate({
      liquidationIncentiveMantissa: newLiquidationIncentiveMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    });
});
