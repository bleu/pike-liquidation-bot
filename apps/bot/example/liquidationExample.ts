import { withAnvilProvider } from "../src/fork/anvil";
import {
  pUSDC,
  pWETH,
  USDC,
  WETH,
  defaultAddresses,
  initialLF,
  initialUsdcPrice,
  IWithTransactionFactory,
} from "apps/bot/src/utils";
import { withTenderlyProvider } from "../src/fork/tenderly";
import { LiquidationBot } from "../src/liquidationBot";
import { completeSetup } from "../src/fork/mocks/setup";

const liquidationTest: IWithTransactionFactory = async (
  wallets,
  transactionFactory
) => {
  console.log("Provider and wallets are ready");
  const amountToDeposit = BigInt(1e18);
  const amountToBorrow = BigInt(1e6);
  const amountToRepay = amountToBorrow / 2n;
  const user = wallets[0];
  const bot = new LiquidationBot(transactionFactory, wallets[1]);

  await completeSetup(transactionFactory);

  console.log("Depositing WETH...");

  await transactionFactory.depositTokenFlow(user, pWETH, amountToDeposit);

  console.log("Borrowing USDC...");
  await transactionFactory.borrowToken(user, pUSDC, amountToBorrow);

  console.log("Mocking price change...");
  await transactionFactory.setMockOraclePrice(
    (amountToBorrow * initialUsdcPrice * BigInt(1e30)) /
      (initialLF * amountToDeposit),
    WETH
  );

  console.log("Liquidating...");
  await bot.liquidatePosition(user, pUSDC, amountToRepay, pWETH);

  console.log("Liquidation executed");
};

export const anvilTestMain = async () => {
  await withAnvilProvider(async (transactionFactory) => {
    await liquidationTest(defaultAddresses, transactionFactory);
  });
};

anvilTestMain();

export const tenderlyTestMain = async () => {
  await withTenderlyProvider(async (transactionFactory) => {
    liquidationTest(defaultAddresses, transactionFactory);
  });
};

// tenderlyTestMain();
