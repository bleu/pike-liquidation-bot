import { Address } from "viem";

import { PTokenService } from "#/infrastructure/blockchain/services/PTokenService";
import { RiskEngineService } from "#/infrastructure/blockchain/services/RiskEngineService";
import { publicClient } from "#/utils/clients";

export class LiquidationHandler {
  private readonly riskEngine: RiskEngineService;
  private readonly pTokenService: PTokenService;

  constructor() {
    this.riskEngine = new RiskEngineService(undefined, publicClient);
    this.pTokenService = new PTokenService(undefined, publicClient);
  }

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
    const liquidationErrorCode = await this.riskEngine.liquidateBorrowAllowed({
      borrowPToken,
      borrower,
      collateralPToken,
      amountToLiquidate,
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
    const amount = await this.pTokenService.borrowBalanceCurrent({
      borrowPToken,
      borrower,
      blockNumber,
    });

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
