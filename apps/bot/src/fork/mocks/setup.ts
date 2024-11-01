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
  // Set up mock oracles
  const amountToEnter = BigInt(1e25);

  return Promise.all([
    setupOracles(transactionFactory),
    setupFactors(transactionFactory),
    transactionFactory.depositTokenFlow(pWETH, pWETH, amountToEnter),
    transactionFactory.depositTokenFlow(pUSDC, pUSDC, amountToEnter),
    transactionFactory.depositTokenFlow(pstETH, pstETH, amountToEnter),
  ]);
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
