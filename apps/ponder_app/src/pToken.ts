import { ponder } from "@/generated";
import { market, position } from "../ponder.schema";
import { createOrUpdateUser, NULL_ADDRESS } from "./utils";
import { MathSol } from "packages/utils/src";

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
        borrowed: borrowAmount,
        isOnMarket: true,
        lastUpdated: timestamp,
        interestIndex: interestIndex,
      })
      .onConflictDoUpdate(({ borrowed }) => ({
        borrowed: borrowAmount + borrowed,
        lastUpdated: timestamp,
        interestIndex: interestIndex,
        isOnMarket: true,
      })),
  ]);
});

ponder.on("pToken:RepayBorrow", async ({ event, context }) => {
  const { onBehalfOf, repayAmount } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  const borrowIndex = await context.client.readContract({
    abi: context.contracts.pToken.abi,
    address: marketId,
    functionName: "borrowIndex",
  });

  await createOrUpdateUser(context, onBehalfOf, timestamp);
  await Promise.all([
    context.db
      .update(position, { marketId, userId: onBehalfOf })
      .set(({ borrowed }) => ({
        borrowed: borrowed - repayAmount,
        lastUpdated: timestamp,
        interestIndex: borrowIndex,
      })),
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

ponder.on("pToken:Mint", async ({ event, context }) => {
  const { mintAmount } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  await context.db.update(market, { id: marketId }).set(({ totalSupply }) => ({
    totalSupply: (totalSupply || 0n) + mintAmount,
    lastUpdated: timestamp,
  }));
});

ponder.on("pToken:Redeem", async ({ event, context }) => {
  const { redeemAmount } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  await context.db.update(market, { id: marketId }).set(({ totalSupply }) => ({
    totalSupply: (totalSupply || 0n) - redeemAmount,
    lastUpdated: timestamp,
  }));
});

// Handler for Transfer event
ponder.on("pToken:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  if (to.toLowerCase() === marketId.toLowerCase()) {
    await context.db
      .update(market, { id: marketId })
      .set(({ totalSupply }) => ({
        totalSupply: (totalSupply || 0n) - value,
        lastUpdated: timestamp,
      }));
  }

  if (
    from.toLowerCase() !== marketId.toLowerCase() &&
    from.toLowerCase() !== NULL_ADDRESS.toLowerCase()
  ) {
    await createOrUpdateUser(context, from, timestamp);
    await context.db
      .update(position, { marketId, userId: from })
      .set((position) => ({
        balance: position.balance - value,
        lastUpdated: timestamp,
      }));
  }

  if (
    to.toLowerCase() !== marketId.toLowerCase() &&
    to.toLowerCase() !== NULL_ADDRESS.toLowerCase()
  ) {
    await createOrUpdateUser(context, to, timestamp);
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
  }
});
