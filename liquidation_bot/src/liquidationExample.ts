import { withAnvilProvider } from "./anvil";
import { pUSDC, pWETH, USDC, WETH } from "./contracts";
import { IWithTransactionFactory } from "./transactions";
import { withTenderlyProvider } from "./tenderly";
import { defaultAddresses } from "./utils";

const liquidationTest: IWithTransactionFactory = async (
  wallets,
  transactionFactory
) => {
  console.log("Provider and wallets are ready");
  const amountToDeposit = BigInt(1e18);
  const amountToBorrow = BigInt(1e6);
  const usdcPrice = BigInt(1e6);
  const wethPrice = BigInt(1000e6);
  const wethCF = BigInt(72.5e16);
  const wethLF = BigInt(90e16);
  const usdcCF = BigInt(74.5e16);
  const usdcLF = BigInt(84.5e16);
  const amountToRepay = amountToBorrow / 2n;
  const user = wallets[0];
  const liquidator = wallets[1];

  console.log(
    "Liquidator entering on market for testing reasons to provide liquidity for the borrow"
  );
  await transactionFactory.mintToken(USDC, liquidator, amountToBorrow * 5n);
  await transactionFactory.approveToken(
    USDC,
    liquidator,
    pUSDC,
    amountToBorrow
  );
  await transactionFactory.depositToken(liquidator, pUSDC, amountToBorrow);
  await transactionFactory.enterMarket([pUSDC], liquidator);

  console.log("Mocking tokens...");
  await transactionFactory.mintToken(WETH, user, amountToDeposit);

  console.log("Setting risk engine...");
  // set collateral factor
  await transactionFactory.setCollateralFactor(pWETH, wethCF, wethLF);
  await transactionFactory.setCollateralFactor(pUSDC, usdcCF, usdcLF);

  console.log("Setting price oracles...");
  await transactionFactory.setMockOracle(WETH);
  await transactionFactory.setMockOracle(USDC);
  await transactionFactory.setMockOraclePrice(usdcPrice, USDC);
  await transactionFactory.setMockOraclePrice(wethPrice, WETH);

  console.log("Depositing WETH...");

  await transactionFactory.approveToken(WETH, user, pWETH, amountToDeposit);
  await transactionFactory.depositToken(user, pWETH, amountToDeposit);
  await transactionFactory.enterMarket([pWETH], user);

  console.log("Borrowing USDC...");
  await transactionFactory.borrowToken(user, pUSDC, amountToBorrow);

  console.log("Mocking price change...");
  await transactionFactory.setMockOraclePrice(
    (amountToBorrow * usdcPrice * BigInt(1e30)) / (wethLF * amountToDeposit),
    WETH
  );

  console.log("Liquidating...");
  await transactionFactory.approveToken(USDC, liquidator, pUSDC, amountToRepay);
  await transactionFactory.liquidateUser(
    liquidator,
    user,
    pUSDC,
    amountToRepay,
    pWETH
  );

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
