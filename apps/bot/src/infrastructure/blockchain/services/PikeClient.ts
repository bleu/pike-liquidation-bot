import { ERC20Service } from "#/infrastructure/blockchain/services/ERC20Service";
import { PTokenService } from "#/infrastructure/blockchain/services/PTokenService";
import { getUnderlying } from "#/utils/consts";
import { type Address, type WalletClient } from "viem";
import { RiskEngineService } from "./RiskEngineService";

export class PikeClient {
  private erc20: ERC20Service;
  private pTokenService: PTokenService;
  private riskEngineService: RiskEngineService;

  constructor(private readonly walletClient: WalletClient) {
    this.erc20 = new ERC20Service(this.walletClient);
    this.pTokenService = new PTokenService(this.walletClient);
    this.riskEngineService = new RiskEngineService(this.walletClient);
  }

  async createPositionRecipe({
    deposits,
    borrows,
  }: {
    deposits?: { pToken: Address; amount: bigint }[];
    borrows?: { pToken: Address; amount: bigint }[];
  }) {
    for (const { pToken, amount } of deposits ?? []) {
      await this.erc20.mintToken({ token: getUnderlying(pToken), amount });

      await this.erc20.approveToken({
        token: getUnderlying(pToken),
        spender: pToken,
      });

      await this.pTokenService.depositToken({ pToken, amount });
    }

    if (deposits) {
      await this.riskEngineService.enterMarket({
        pTokens: deposits.map(({ pToken }) => pToken),
      });
    }

    for (const { pToken, amount } of borrows ?? []) {
      await this.pTokenService.borrowToken({ pToken, amount });
    }
  }
}
