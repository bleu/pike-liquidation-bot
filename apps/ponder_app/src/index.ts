// src/handlers.ts
import { ponder } from "@/generated";

const defaultMarketData = {
  supplyCap: 0n,
  borrowCap: 0n,
  collateralFactor: 0n,
  liquidationThreshold: 0n,
  reserveFactorMantissa: 0n,
  protocolSeizeShareMantissa: 0n,
  riskEngine: "0x0000000000000000000000000000000000000000",
  initialExchangeRateMantissa: 0n,
  borrowRateMaxMantissa: 0n,
  baseRatePerSecond: 0n,
  multiplierPerSecond: 0n,
  firstJumpMultiplierPerSecond: 0n,
  secondJumpMultiplierPerSecond: 0n,
  firstKink: 0n,
  secondKink: 0n,
  isListed: false,
  lastUpdated: 0n,
};

// Handler for MarketListed event
ponder.on("RiskEngine:MarketListed", async ({ event, context }) => {
  const { Market } = context.db;
  const args = event.args;
  const { pToken } = args;

  try {
    await Market.upsert({
      id: pToken,
      update: {
        isListed: true,
        lastUpdated: BigInt(event.block.timestamp),
      },
      create: {
        ...defaultMarketData,
        isListed: true,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(`Market listed or updated: ${pToken}`);
  } catch (error) {
    console.error(`Error upserting market ${pToken}:`, error);
  }
});

// Handler for NewSupplyCap event
ponder.on("RiskEngine:NewSupplyCap", async ({ event, context }) => {
  const { Market } = context.db;
  const { pToken, newSupplyCap } = event.args;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        supplyCap: newSupplyCap,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        supplyCap: newSupplyCap,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(`Supply cap updated for ${pToken}: ${newSupplyCap}`);
  } catch (error) {
    console.error(`Error updating supply cap for ${pToken}:`, error);
  }
});

// Handler for NewBorrowCap event
ponder.on("RiskEngine:NewBorrowCap", async ({ event, context }) => {
  const { Market } = context.db;
  const { pToken, newBorrowCap } = event.args;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        borrowCap: newBorrowCap,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        borrowCap: newBorrowCap,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(`Borrow cap updated for ${pToken}: ${newBorrowCap}`);
  } catch (error) {
    console.error(`Error updating borrow cap for ${pToken}:`, error);
  }
});

// Handler for NewCollateralFactor event
ponder.on("RiskEngine:NewCollateralFactor", async ({ event, context }) => {
  const { Market } = context.db;
  const { pToken, newCollateralFactorMantissa } = event.args;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        collateralFactor: newCollateralFactorMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        collateralFactor: newCollateralFactorMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Collateral factor updated for ${pToken}: ${newCollateralFactorMantissa}`
    );
  } catch (error) {
    console.error(`Error updating collateral factor for ${pToken}:`, error);
  }
});

// Handler for NewLiquidationThreshold event
ponder.on("RiskEngine:NewLiquidationThreshold", async ({ event, context }) => {
  const { Market } = context.db;
  const { pToken, newLiquidationThresholdMantissa } = event.args;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        liquidationThreshold: newLiquidationThresholdMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        liquidationThreshold: newLiquidationThresholdMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Liquidation threshold updated for ${pToken}: ${newLiquidationThresholdMantissa}`
    );
  } catch (error) {
    console.error(`Error updating liquidation threshold for ${pToken}:`, error);
  }
});

// Handler for NewInterestParams event
ponder.on("pToken:NewInterestParams", async ({ event, context }) => {
  const { Market } = context.db;

  // Destructure the actual properties from event.args
  const {
    baseRatePerSecond,
    multiplierPerSecond,
    firstJumpMultiplierPerSecond,
    secondJumpMultiplierPerSecond,
    firstKink,
    secondKink,
  } = event.args;

  // Derive pToken from event log address
  const pToken = event.log.address;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        baseRatePerSecond: baseRatePerSecond,
        multiplierPerSecond: multiplierPerSecond,
        firstJumpMultiplierPerSecond: firstJumpMultiplierPerSecond,
        secondJumpMultiplierPerSecond: secondJumpMultiplierPerSecond,
        firstKink: firstKink,
        secondKink: secondKink,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        baseRatePerSecond: baseRatePerSecond,
        multiplierPerSecond: multiplierPerSecond,
        firstJumpMultiplierPerSecond: firstJumpMultiplierPerSecond,
        secondJumpMultiplierPerSecond: secondJumpMultiplierPerSecond,
        firstKink: firstKink,
        secondKink: secondKink,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Interest parameters updated for ${pToken}: 
      Base Rate Per Second - ${baseRatePerSecond}, 
      Multiplier Per Second - ${multiplierPerSecond}, 
      First Jump Multiplier Per Second - ${firstJumpMultiplierPerSecond}, 
      Second Jump Multiplier Per Second - ${secondJumpMultiplierPerSecond}, 
      First Kink - ${firstKink}, 
      Second Kink - ${secondKink}`
    );
  } catch (error) {
    console.error(`Error updating interest parameters for ${pToken}:`, error);
  }
});
// Handler for NewReserveFactor event
ponder.on("pToken:NewReserveFactor", async ({ event, context }) => {
  const { Market } = context.db;
  const { newReserveFactorMantissa } = event.args;
  const pToken = event.log.address;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        reserveFactorMantissa: newReserveFactorMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        reserveFactorMantissa: newReserveFactorMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Reserve factor updated for ${pToken}: ${newReserveFactorMantissa}`
    );
  } catch (error) {
    console.error(`Error updating reserve factor for ${pToken}:`, error);
  }
});

// Handler for NewRiskEngine event
ponder.on("pToken:NewRiskEngine", async ({ event, context }) => {
  const { Market } = context.db;
  const { newRiskEngine } = event.args;
  const pToken = event.log.address;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        riskEngine: newRiskEngine,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        riskEngine: newRiskEngine,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(`RiskEngine updated for ${pToken}: ${newRiskEngine}`);
  } catch (error) {
    console.error(`Error updating RiskEngine for ${pToken}:`, error);
  }
});

// Handler for NewProtocolSeizeShare event
ponder.on("pToken:NewProtocolSeizeShare", async ({ event, context }) => {
  const { Market } = context.db;
  const { newProtocolSeizeShareMantissa } = event.args;

  const pToken = event.log.address;

  try {
    await Market.upsert({
      id: pToken,
      create: {
        ...defaultMarketData,
        protocolSeizeShareMantissa: newProtocolSeizeShareMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
      update: {
        protocolSeizeShareMantissa: newProtocolSeizeShareMantissa,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Protocol Seize Share updated for ${pToken}: ${newProtocolSeizeShareMantissa}`
    );
  } catch (error) {
    console.error(`Error updating Protocol Seize Share for ${pToken}:`, error);
  }
});

// Handler for NestedPermissionGranted event
ponder.on("pToken:NestedPermissionGranted", async ({ event, context }) => {
  const { Delegate } = context.db;
  const { permission, nestedAddress, target } = event.args;

  try {
    await Delegate.create({
      id: `${permission}-${nestedAddress}-${target}`,
      data: {
        permission: permission,
        nestedAddress: nestedAddress,
        target: target,
        approved: true,
        lastUpdated: BigInt(event.block.timestamp),
      },
    });
    console.log(
      `Nested permission granted: ${permission} for ${target} by ${nestedAddress}`
    );
  } catch (error) {
    console.error(`Error granting nested permission:`, error);
  }
});

// Handler for Mint event
ponder.on("pToken:Mint", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
  const { minter, onBehalfOf, mintAmount, mintTokens } = event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Create Transaction entry
    await Transaction.create({
      id: `${txHash}-${logIndex}`,
      data: {
        marketId: marketId,
        userAddress: onBehalfOf,
        type: "mint",
        amount: mintAmount,
        timestamp: timestamp,
      },
    });

    // Update or create Position entry
    const positionId = `${marketId}-${onBehalfOf}`;
    const existingPosition = await Position.findUnique({ id: positionId });

    if (existingPosition) {
      await Position.update({
        id: positionId,
        data: {
          balance: existingPosition.balance + mintTokens,
          lastUpdated: timestamp,
        },
      });
    } else {
      await Position.create({
        id: positionId,
        data: {
          marketId: marketId,
          userAddress: onBehalfOf,
          balance: mintTokens,
          borrowed: 0n,
          borrowIndex: 0n, // Initialize appropriately
          isCollateral: false, // Set based on your logic
          lastUpdated: timestamp,
        },
      });
    }

    console.log(`Mint transaction recorded: ${txHash}`);
  } catch (error) {
    console.error(`Error recording mint transaction ${txHash}:`, error);
  }
});

// Handler for Borrow event
ponder.on("pToken:Borrow", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
  const { borrower, onBehalfOf, borrowAmount, accountBorrows, totalBorrows } =
    event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Create Transaction entry
    await Transaction.create({
      id: `${txHash}-${logIndex}`,
      data: {
        marketId: marketId,
        userAddress: onBehalfOf,
        type: "borrow",
        amount: borrowAmount,
        timestamp: timestamp,
      },
    });

    // Update or create Position entry
    const positionId = `${marketId}-${onBehalfOf}`;
    const existingPosition = await Position.findUnique({ id: positionId });

    if (existingPosition) {
      await Position.update({
        id: positionId,
        data: {
          borrowed: existingPosition.borrowed + borrowAmount,
          borrowIndex: accountBorrows, // Update based on your logic
          lastUpdated: timestamp,
        },
      });
    } else {
      await Position.create({
        id: positionId,
        data: {
          marketId: marketId,
          userAddress: onBehalfOf,
          balance: 0n,
          borrowed: borrowAmount,
          borrowIndex: accountBorrows, // Initialize appropriately
          isCollateral: false, // Set based on your logic
          lastUpdated: timestamp,
        },
      });
    }

    console.log(`Borrow transaction recorded: ${txHash}`);
  } catch (error) {
    console.error(`Error recording borrow transaction ${txHash}:`, error);
  }
});

// Handler for Redeem event
ponder.on("pToken:Redeem", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
  const { redeemer, onBehalfOf, redeemAmount, redeemTokens } = event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Create Transaction entry
    await Transaction.create({
      id: `${txHash}-${logIndex}`,
      data: {
        marketId: marketId,
        userAddress: onBehalfOf,
        type: "redeem",
        amount: redeemAmount,
        timestamp: timestamp,
      },
    });

    // Update Position entry
    const positionId = `${marketId}-${onBehalfOf}`;
    const existingPosition = await Position.findUnique({ id: positionId });

    if (existingPosition) {
      await Position.update({
        id: positionId,
        data: {
          balance: existingPosition.balance - redeemTokens,
          lastUpdated: timestamp,
        },
      });
    } else {
      console.warn(`Redeem event for non-existing position: ${positionId}`);
    }

    console.log(`Redeem transaction recorded: ${txHash}`);
  } catch (error) {
    console.error(`Error recording redeem transaction ${txHash}:`, error);
  }
});

// Handler for RepayBorrow event
ponder.on("pToken:RepayBorrow", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
  const { payer, onBehalfOf, repayAmount, accountBorrows, totalBorrows } =
    event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken address
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Create Transaction entry
    await Transaction.create({
      id: `${txHash}-${logIndex}`,
      data: {
        marketId: marketId,
        userAddress: onBehalfOf,
        type: "repay",
        amount: repayAmount,
        timestamp: timestamp,
      },
    });

    // Update Position entry
    const positionId = `${marketId}-${onBehalfOf}`;
    const existingPosition = await Position.findUnique({ id: positionId });

    if (existingPosition) {
      await Position.update({
        id: positionId,
        data: {
          borrowed: existingPosition.borrowed - repayAmount,
          borrowIndex: accountBorrows, // Update based on your logic
          lastUpdated: timestamp,
        },
      });
    } else {
      console.warn(
        `RepayBorrow event for non-existing position: ${positionId}`
      );
    }

    console.log(`RepayBorrow transaction recorded: ${txHash}`);
  } catch (error) {
    console.error(`Error recording repay borrow transaction ${txHash}:`, error);
  }
});

// Handler for LiquidateBorrow event
ponder.on("pToken:LiquidateBorrow", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
  const { liquidator, borrower, repayAmount, pTokenCollateral, seizeTokens } =
    event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const marketId = event.log.address; // pToken being repaid
  const collateralMarketId = pTokenCollateral; // pToken collateral address
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Create Transaction entry for repayment
    await Transaction.create({
      id: `${txHash}-${logIndex}-repay`,
      data: {
        marketId: marketId,
        userAddress: borrower,
        type: "liquidate_repay",
        amount: repayAmount,
        timestamp: timestamp,
      },
    });

    // Update borrower's Position
    const borrowerPositionId = `${marketId}-${borrower}`;
    const borrowerPosition = await Position.findUnique({
      id: borrowerPositionId,
    });

    if (borrowerPosition) {
      await Position.update({
        id: borrowerPositionId,
        data: {
          borrowed: borrowerPosition.borrowed - repayAmount,
          lastUpdated: timestamp,
        },
      });
    } else {
      console.warn(
        `LiquidateBorrow event for non-existing borrower position: ${borrowerPositionId}`
      );
    }

    // Create Transaction entry for seizure
    await Transaction.create({
      id: `${txHash}-${logIndex}-seize`,
      data: {
        marketId: collateralMarketId,
        userAddress: liquidator,
        type: "liquidate_seize",
        amount: seizeTokens,
        timestamp: timestamp,
      },
    });

    // Update liquidator's Position
    const liquidatorPositionId = `${collateralMarketId}-${liquidator}`;
    const liquidatorPosition = await Position.findUnique({
      id: liquidatorPositionId,
    });

    if (liquidatorPosition) {
      await Position.update({
        id: liquidatorPositionId,
        data: {
          balance: liquidatorPosition.balance + seizeTokens,
          lastUpdated: timestamp,
        },
      });
    } else {
      await Position.create({
        id: liquidatorPositionId,
        data: {
          marketId: collateralMarketId,
          userAddress: liquidator,
          balance: seizeTokens,
          borrowed: 0n,
          borrowIndex: 0n, // Initialize appropriately
          isCollateral: false, // Set based on your logic
          lastUpdated: timestamp,
        },
      });
    }

    console.log(`LiquidateBorrow transaction recorded: ${txHash}`);
  } catch (error) {
    console.error(
      `Error recording LiquidateBorrow transaction ${txHash}:`,
      error
    );
  }
});

// Handler for Transfer event
ponder.on("pToken:Transfer", async ({ event, context }) => {
  const { Transaction, Position } = context.db;
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

  try {
    // Create Transaction entry for Transfer Out
    await Transaction.create({
      id: `${txHash}-${logIndex}-transfer_out`,
      data: {
        marketId: marketId,
        userAddress: from,
        type: "transfer_out",
        amount: value,
        timestamp: timestamp,
      },
    });

    // Create Transaction entry for Transfer In
    await Transaction.create({
      id: `${txHash}-${logIndex}-transfer_in`,
      data: {
        marketId: marketId,
        userAddress: to,
        type: "transfer_in",
        amount: value,
        timestamp: timestamp,
      },
    });

    // Update sender's Position
    const fromPositionId = `${marketId}-${from}`;
    const fromPosition = await Position.findUnique({ id: fromPositionId });

    if (fromPosition) {
      await Position.update({
        id: fromPositionId,
        data: {
          balance: fromPosition.balance - value,
          lastUpdated: timestamp,
        },
      });
    } else {
      console.warn(`Transfer out for non-existing position: ${fromPositionId}`);
    }

    // Update recipient's Position
    const toPositionId = `${marketId}-${to}`;
    const toPosition = await Position.findUnique({ id: toPositionId });

    if (toPosition) {
      await Position.update({
        id: toPositionId,
        data: {
          balance: toPosition.balance + value,
          lastUpdated: timestamp,
        },
      });
    } else {
      await Position.create({
        id: toPositionId,
        data: {
          marketId: marketId,
          userAddress: to,
          balance: value,
          borrowed: 0n,
          borrowIndex: 0n, // Initialize appropriately
          isCollateral: false, // Set based on your logic
          lastUpdated: timestamp,
        },
      });
    }

    console.log(`Transfer event recorded: ${txHash}`);
  } catch (error) {
    console.error(`Error recording Transfer event ${txHash}:`, error);
  }
});

// Handler for Approval event
ponder.on("pToken:Approval", async ({ event, context }) => {
  const { Delegate } = context.db;
  const { owner, spender, value } = event.args;
  const txHash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const timestamp = BigInt(event.block.timestamp);
  const marketId = event.log.address; // pToken address

  try {
    // Since your schema's Delegate table is for nested permissions,
    // and not general ERC20 allowances, you can choose to ignore or log Approval events.
    // For simplicity, we'll log them here.
    console.log(
      `Approval event: ${owner} approved ${spender} to spend ${value} on ${marketId}`
    );
  } catch (error) {
    console.error(`Error handling Approval event ${txHash}:`, error);
  }
});
