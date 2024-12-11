import { ponder } from "@/generated";
import { market, position } from "../ponder.schema";
import { createOrUpdateUser, NULL_ADDRESS } from "./utils";

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

ponder.on("pToken:NewReserveFactor", async ({ event, context }) => {
  const { newReserveFactorMantissa } = event.args;
  const pToken = event.log.address;

  await context.db.update(market, { id: pToken }).set({
    reserveFactorMantissa: newReserveFactorMantissa,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

ponder.on("pToken:NewRiskEngine", async ({ event, context }) => {
  const { newRiskEngine } = event.args;
  const pToken = event.log.address;

  await context.db.update(market, { id: pToken }).set({
    riskEngineId: newRiskEngine,
    lastUpdated: BigInt(event.block.timestamp),
  });
});

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

ponder.on("pToken:AccrueInterest", async ({ event, context }) => {
  const { borrowIndex, totalBorrows, totalReserves, cashPrior } = event.args;
  const pToken = event.log.address;
  const lastUpdated = BigInt(event.block.timestamp);

  await context.db
    .insert(market)
    .values({
      id: pToken,
      totalBorrows,
      totalReserves,
      borrowIndex,
      cash: cashPrior,
      lastUpdated,
    })
    .onConflictDoUpdate({
      totalBorrows,
      totalReserves,
      borrowIndex,
      cash: cashPrior,
      lastUpdated,
    });
});

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

ponder.on("pToken:Borrow", async ({ event, context }) => {
  const { onBehalfOf, borrowAmount, totalBorrows } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  const interestIndex = await context.client.readContract({
    abi: context.contracts.pToken.abi,
    address: marketId,
    functionName: "borrowIndex",
  });

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await Promise.all([
    context.db.update(market, { id: marketId }).set(({ totalBorrows }) => ({
      totalBorrows: (totalBorrows || 0n) + borrowAmount,
    })),
    context.db
      .insert(position)
      .values({
        marketId: marketId,
        userId: onBehalfOf,
        balance: 0n,
        borrowed: totalBorrows,
        isOnMarket: true,
        lastUpdated: timestamp,
        interestIndex: interestIndex,
      })
      .onConflictDoUpdate({
        borrowed: totalBorrows,
        lastUpdated: timestamp,
        interestIndex: interestIndex,
      }),
  ]);
});

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

ponder.on("pToken:RepayBorrow", async ({ event, context }) => {
  const { onBehalfOf, accountBorrows, repayAmount } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  const borrowIndex = await context.client.readContract({
    abi: context.contracts.pToken.abi,
    address: marketId,
    functionName: "borrowIndex",
  });

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await Promise.all([
    context.db.update(position, { marketId, userId: onBehalfOf }).set({
      borrowed: accountBorrows,
      lastUpdated: timestamp,
      interestIndex: borrowIndex,
    }),
    context.db.update(market, { id: marketId }).set(({ totalBorrows }) => ({
      totalBorrows: (totalBorrows || 0n) - repayAmount,
    })),
  ]);
});

ponder.on("pToken:ReservesAdded", async ({ event, context }) => {
  const { newTotalReserves } = event.args;
  const marketId = event.log.address;

  await context.db.update(market, { id: marketId }).set({
    totalReserves: newTotalReserves,
  });
});

ponder.on("pToken:ReservesReduced", async ({ event, context }) => {
  const { newTotalReserves } = event.args;
  const marketId = event.log.address;

  await context.db.update(market, { id: marketId }).set({
    totalReserves: newTotalReserves,
  });
});

// Handler for Transfer event
ponder.on("pToken:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  if (from === NULL_ADDRESS) {
    await context.db
      .update(market, { id: marketId })
      .set(({ totalSupply }) => ({
        totalSupply: (totalSupply || 0n) + value,
      }));
    return;
  }

  if (to === NULL_ADDRESS) {
    await context.db
      .update(market, { id: marketId })
      .set(({ totalSupply }) => ({
        totalSupply: (totalSupply || 0n) - value,
      }));
    return;
  }

  if (
    from.toLowerCase() === marketId.toLowerCase() ||
    to.toLowerCase() === marketId.toLowerCase()
  )
    return;

  await Promise.all([
    createOrUpdateUser(context, from, timestamp),
    createOrUpdateUser(context, to, timestamp),
  ]);

  await Promise.all([
    context.db.update(position, { marketId, userId: from }).set((position) => ({
      balance: position.balance - value,
      lastUpdated: timestamp,
    })),
    context.db
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
      })),
  ]);
});
