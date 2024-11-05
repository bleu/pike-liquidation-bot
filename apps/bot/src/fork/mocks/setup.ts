import {
  initialCF,
  initialLF,
  initialStEthPrice,
  initialUsdcPrice,
  ISendTransaction,
  pstETH,
  pUSDC,
  pWETH,
  stETH,
  TransactionFactory,
  USDC,
  WETH,
} from "../../utils";

export async function completeSetup(transactionFactory: TransactionFactory) {
  await Promise.all([
    setupOracles(transactionFactory),
    setupFactors(transactionFactory),
    setupBalances(transactionFactory),
  ]);
}

export async function setupBalances(transactionFactory: TransactionFactory) {
  await transactionFactory.depositTokenFlow(WETH, pWETH, BigInt(1e20));
  await transactionFactory.depositTokenFlow(USDC, pUSDC, BigInt(1e13));
  await transactionFactory.depositTokenFlow(stETH, pstETH, BigInt(1e20));
}

export async function setupFactors(transactionFactory: TransactionFactory) {
  await transactionFactory.setCollateralFactor(pWETH, initialCF, initialLF);
  await transactionFactory.setCollateralFactor(pUSDC, initialCF, initialLF);
  await transactionFactory.setCollateralFactor(pstETH, initialCF, initialLF);
}

export async function setupOracles(transactionFactory: TransactionFactory) {
  // TODO: make this async and debug conflicting transactions
  await transactionFactory.setMockOracle(WETH);
  await transactionFactory.setMockOracle(USDC);
  await transactionFactory.setMockOracle(stETH);
  await transactionFactory.setMockOraclePrice(initialUsdcPrice, USDC);
  await transactionFactory.setMockOraclePrice(initialStEthPrice, WETH);
  await transactionFactory.setMockOraclePrice(initialStEthPrice, stETH);
}
