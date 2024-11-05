import { expect, describe, it, beforeEach } from "vitest";
import { completeSetup } from "../../src/fork/mocks/setup";
import {
  defaultAddresses,
  getUnderlying,
  initialUsdcPrice,
  initialWethPrice,
  pUSDC,
  pWETH,
} from "../../src/utils";
import {
  anvilPublicClient,
  anvilTransactionFactory,
} from "../../src/fork/anvil";
import {
  createHealthPosition,
  transformPositionOnUnhealth,
} from "../../src/fork/mocks/position";
import { LiquidationBot } from "../../src/liquidationBot";

describe("monitor single position", () => {
  const borrowPToken = pUSDC;
  const collateralPToken = pWETH;
  const borrower = defaultAddresses[0];
  const liquidator = defaultAddresses[1];
  const collateralAmount = BigInt(1e18);

  beforeEach(async () => {
    await completeSetup(anvilTransactionFactory);
  });

  it("should create health position", async () => {
    await createHealthPosition({
      transactionFactory: anvilTransactionFactory,
      owner: borrower,
      collateralPToken,
      borrowPToken,
      collateralAmount,
      collateralTokenPrice: initialWethPrice,
      borrowTokenPrice: initialUsdcPrice,
    });
    const bot = new LiquidationBot(
      anvilTransactionFactory,
      defaultAddresses[1],
      anvilPublicClient
    );

    const isLiquidatable = await bot.checkAndLiquidatePosition(
      liquidator,
      borrowPToken,
      collateralPToken
    );

    expect(isLiquidatable).toBe(false);
  });

  it("should liquidate unhealth position", async () => {
    await createHealthPosition({
      transactionFactory: anvilTransactionFactory,
      owner: borrower,
      collateralPToken,
      borrowPToken,
      collateralAmount,
      collateralTokenPrice: initialWethPrice,
      borrowTokenPrice: initialUsdcPrice,
    });
    const bot = new LiquidationBot(
      anvilTransactionFactory,
      defaultAddresses[1],
      anvilPublicClient
    );

    const isLiquidatable = await bot.checkAndLiquidatePosition(
      liquidator,
      borrowPToken,
      collateralPToken
    );

    expect(isLiquidatable).toBe(false);

    await transformPositionOnUnhealth({
      transactionFactory: anvilTransactionFactory,
      collateralToken: getUnderlying(collateralPToken),
      collateralAmount,
      borrowAmount: BigInt(1e6),
      initialBorrowTokenPrice: initialUsdcPrice,
    });

    const isLiquidatableAfterPriceChange = await bot.checkAndLiquidatePosition(
      liquidator,
      borrowPToken,
      collateralPToken
    );

    expect(isLiquidatableAfterPriceChange).toBe(true);
  });
});
