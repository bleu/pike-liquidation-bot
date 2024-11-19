import { Address } from "viem";
import { ContractReader } from "../services/contractReader";
import { PikeClient } from "../services/clients";
import { riskEngine, riskEngineAbi, pTokenAbi } from "@pike-liq-bot/utils";

export class LiquidationHandler {
  constructor(
    private readonly contractReader: ContractReader,
    private readonly pikeClient: PikeClient
  ) {}

  async checkLiquidationAllowed({
    borrowPToken,
    borrower,
    collateralPToken,
    amountToLiquidate,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    amountToLiquidate: bigint;
    blockNumber?: bigint;
  }) {
    const liquidationErrorCode = await this.contractReader.readContract({
      address: riskEngine,
      abi: riskEngineAbi,
      functionName: "liquidateBorrowAllowed",
      args: [borrowPToken, collateralPToken, borrower, amountToLiquidate],
      blockNumber,
    });

    return liquidationErrorCode == BigInt(0);
  }

  async checkAmountToLiquidate({
    borrowPToken,
    borrower,
    collateralPToken,
    blockNumber,
  }: {
    borrower: Address;
    borrowPToken: Address;
    collateralPToken: Address;
    blockNumber?: bigint;
  }) {
    const amount = (await this.contractReader.readContract({
      address: borrowPToken,
      abi: pTokenAbi,
      functionName: "borrowBalanceCurrent",
      args: [borrower],
      blockNumber,
    })) as bigint;

    const amountToLiquidate = amount / 2n;

    const liquidationAllowed = await this.checkLiquidationAllowed({
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate,
      blockNumber,
    });

    return liquidationAllowed ? amountToLiquidate : 0n;
  }

  async liquidatePosition({
    borrowPToken,
    borrower,
    amountToLiquidate,
    collateralPToken,
  }: {
    borrower: Address;
    borrowPToken: Address;
    amountToLiquidate: bigint;
    collateralPToken: Address;
  }) {
    // Implement liquidation logic
  }
}
