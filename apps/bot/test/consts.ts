import { pstETH, pUSDC, pWETH } from "@pike-liq-bot/utils";

export const userA = "0x62dd5BF48A9DC65113DF25B3C68d01A7c161BB63" as const;
export const userB = "0x87A02bD69cFa511FaccC97CD339e16243daF4a5E" as const;
export const userC = "0x96520Fb8FE267034e23aCcBD4940dfB4648e7C3A" as const;
export const userD = "0xCbe2195005c4B8692DbCCA5FA9511DE2eFa32C8d" as const;
export const userE = "0x0E10f9A63A7800fE4c657334dd6543068ab8A50D" as const;

export const positionUserA = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const positionUserB = {
  borrowPTokens: [pWETH, pstETH] as const,
  collateralPTokens: [pUSDC] as const,
};

export const positionUserC = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH, pUSDC] as const,
};

export const positionUserD = {
  borrowPTokens: [pUSDC, pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const positionUserE = {
  borrowPTokens: [pstETH] as const,
  collateralPTokens: [pWETH] as const,
};

export const initialPricesBlock = 17828741n;

export const usdcLowPriceBlock = 17828742n;
export const usdcHighPriceBlock = 17828746n;
export const wethLowPriceBlock = 17828753n;
export const wethHighPriceBlock = 17828757n;
export const stEthLowPriceBlock = 17828765n;
export const stEthHighPriceBlock = 17828769n;
