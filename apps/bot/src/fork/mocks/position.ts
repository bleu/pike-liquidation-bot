import { initialCF, initialLF, TransactionFactory } from "../../utils";

export async function createHealthPosition({
  transactionFactory,
  owner,
  collateralPToken,
  borrowPToken,
  collateralTokenPrice,
  borrowTokenPrice,
  collateralAmount,
}: {
  transactionFactory: TransactionFactory;
  owner: string;
  collateralPToken: string;
  borrowPToken: string;
  collateralTokenPrice: bigint;
  borrowTokenPrice: bigint;
  collateralAmount: bigint;
}) {
  const amountToBorrow =
    (collateralAmount *
      collateralTokenPrice *
      (initialCF - BigInt(0.00001e16))) /
    (borrowTokenPrice * BigInt(1e30));

  await transactionFactory.depositTokenFlow(
    owner,
    collateralPToken,
    collateralAmount
  );
  await transactionFactory.borrowToken(owner, borrowPToken, amountToBorrow);
}

export async function transformPositionOnUnhealth({
  transactionFactory,
  collateralToken,
  collateralAmount,
  borrowAmount,
  initialBorrowTokenPrice,
}: {
  transactionFactory: TransactionFactory;
  collateralToken: string;
  collateralAmount: bigint;
  borrowAmount: bigint;
  initialBorrowTokenPrice: bigint;
}) {
  const newCollateralTokenPrice =
    (borrowAmount * initialBorrowTokenPrice * BigInt(1e30)) /
    (initialLF * collateralAmount);
  console.log(newCollateralTokenPrice);
  await transactionFactory.setMockOraclePrice(
    newCollateralTokenPrice,
    collateralToken
  );
}
