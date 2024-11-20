import { Address, parseUnits } from "viem";
import { createWalletClientFromPrivateKey } from "#/utils/clients";

import { stETH, USDC, WETH } from "@pike-liq-bot/utils";
import { getSymbol } from "#/utils/consts";
import { getEnv } from "#/utils/env";
import { OracleService } from "#/infrastructure/blockchain/services/OracleService";

export type WalletInfo = {
  address: Address;
  privateKey: `0x${string}`;
};

const funderClient = new OracleService(
  createWalletClientFromPrivateKey(getEnv("BOT_PRIVATE_KEY") as `0x${string}`)
);

async function setInitialPrices(tokens: Address[], initialPrices: bigint[]) {
  for (let i = 0; i < tokens.length; i++) {
    await funderClient.setOraclePrice({
      token: tokens[i],
      price: initialPrices[i],
    });
  }

  console.log("Initial prices set");
}

async function manipulatePrices(initialPrice: bigint, token: Address) {
  const { blockNumber: blockNumberPriceDropped } =
    await funderClient.setOraclePrice({
      token,
      price: initialPrice / 2n,
    });

  console.log(
    `${getSymbol(token)} price dropped at block ${blockNumberPriceDropped}`
  );

  const { blockNumber: blockNumberPriceIncreased } =
    await funderClient.setOraclePrice({
      token,
      price: initialPrice * 2n,
    });

  console.log(
    `${getSymbol(token)} price increased at block ${blockNumberPriceIncreased}`
  );

  await funderClient.setOraclePrice({
    token,
    price: initialPrice,
  });

  console.log(`${getSymbol(token)} price restored`);
}

async function main() {
  const initialPrices = [
    parseUnits("1", 6),
    parseUnits("2000", 6),
    parseUnits("2000", 6),
  ];

  const tokens = [USDC, WETH, stETH];

  await setInitialPrices(tokens, initialPrices);

  for (let i = 0; i < tokens.length; i++) {
    await manipulatePrices(initialPrices[i], tokens[i]);
  }
}

main();
