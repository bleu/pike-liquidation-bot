import { ponder } from "@/generated";
import { market, position } from "../ponder.schema";
import { createOrUpdateUser } from "./utils";

// Handler for NewInterestParams event
ponder.on("pToken:NewInterestParams", async ({ event, context }) => {
  const {
    baseRatePerSecond,
    multiplierPerSecond,
    firstJumpMultiplierPerSecond,
    secondJumpMultiplierPerSecond,
    firstKink,
    secondKink,
  } = event.args;
  const pToken = event.log.address;

  await context.db.update(market, { id: pToken }).set({
    baseRatePerSecond,
    multiplierPerSecond,
    firstJumpMultiplierPerSecond,
    secondJumpMultiplierPerSecond,
    firstKink,
    secondKink,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewReserveFactor event
ponder.on("pToken:NewReserveFactor", async ({ event, context }) => {
  const { newReserveFactorMantissa } = event.args;
  const pToken = event.log.address;

  await context.db.update(market, { id: pToken }).set({
    reserveFactorMantissa: newReserveFactorMantissa,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewRiskEngine event
ponder.on("pToken:NewRiskEngine", async ({ event, context }) => {
  const { newRiskEngine } = event.args;
  const pToken = event.log.address;

  await context.db.update(market, { id: pToken }).set({
    riskEngineId: newRiskEngine,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

// Handler for NewProtocolSeizeShare event
ponder.on("pToken:NewProtocolSeizeShare", async ({ event, context }) => {
  const { newProtocolSeizeShareMantissa } = event.args;
  const pToken = event.log.address;

  await context.db
    .insert(market)
    .values({
      id: pToken,
      protocolSeizeShareMantissa: newProtocolSeizeShareMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    })
    .onConflictDoUpdate({
      protocolSeizeShareMantissa: newProtocolSeizeShareMantissa,
      lastUpdated: BigInt(event.block.timestamp),
    });
});

// Handler for Mint event
ponder.on("pToken:Mint", async ({ event, context }) => {
  const { onBehalfOf, mintTokens } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await context.db
    .insert(position)
    .values({
      marketId: marketId,
      userId: onBehalfOf,
      balance: mintTokens,
      borrowed: 0n,
      isOnMarket: false,
      lastUpdated: timestamp,
    })
    .onConflictDoUpdate((position) => ({
      borrowed: position.borrowed + mintTokens,
      lastUpdated: timestamp,
    }));
});

// Handler for Borrow event
ponder.on("pToken:Borrow", async ({ event, context }) => {
  const { onBehalfOf, borrowAmount } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await context.db
    .insert(position)
    .values({
      marketId: marketId,
      userId: onBehalfOf,
      balance: 0n,
      borrowed: borrowAmount,
      isOnMarket: true,
      lastUpdated: timestamp,
    })
    .onConflictDoUpdate((position) => ({
      borrowed: position.borrowed + borrowAmount,
      lastUpdated: timestamp,
    }));
});

// Handler for Redeem event
ponder.on("pToken:Redeem", async ({ event, context }) => {
  const { onBehalfOf, redeemTokens } = event.args;
  const marketId = event.log.address;
  const timestamp = BigInt(event.block.timestamp);

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await context.db
    .update(position, { marketId, userId: onBehalfOf })
    .set((position) => ({
      balance: position.balance - redeemTokens,
      lastUpdated: timestamp,
    }));
});

// Handler for RepayBorrow event
ponder.on("pToken:RepayBorrow", async ({ event, context }) => {
  const { onBehalfOf, accountBorrows } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await context.db.update(position, { marketId, userId: onBehalfOf }).set({
    borrowed: accountBorrows,
    lastUpdated: timestamp,
  });
});

// Handler for LiquidateBorrow event
ponder.on("pToken:LiquidateBorrow", async ({ event, context }) => {
  const { borrower, repayAmount, pTokenCollateral, seizeTokens } = event.args;
  const marketId = event.log.address; // pToken being repaid
  const collateralMarketId = pTokenCollateral; // pToken collateral address
  const timestamp = BigInt(event.block.timestamp);

  await createOrUpdateUser(context, borrower, timestamp);
  await context.db
    .update(position, { marketId, userId: borrower })
    .set((position) => ({
      borrowed: position.borrowed - repayAmount,
      lastUpdated: timestamp,
    }));
  await context.db
    .update(position, { marketId: collateralMarketId, userId: borrower })
    .set((position) => ({
      balance: position.balance - seizeTokens,
      lastUpdated: timestamp,
    }));
});

// Handler for Transfer event
ponder.on("pToken:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  // Ignore mint (from address(0)) and burn (to address(0)) as they are handled by Mint/Redeem handlers
  if (
    from === "0x0000000000000000000000000000000000000000" ||
    to === "0x0000000000000000000000000000000000000000"
  ) {
    return;
  }

  await createOrUpdateUser(context, from, timestamp);
  await createOrUpdateUser(context, to, timestamp);

  await context.db
    .update(position, { marketId, userId: from })
    .set((position) => ({
      balance: position.balance - value,
      lastUpdated: timestamp,
    }));

  await context.db
    .insert(position)
    .values({
      marketId,
      userId: to,
      balance: value,
      borrowed: 0n,
      isOnMarket: false,
      lastUpdated: timestamp,
    })
    .onConflictDoUpdate((position) => ({
      balance: position.balance + value,
      lastUpdated: timestamp,
    }));
});
