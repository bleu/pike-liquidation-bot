import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import { Address, createWalletClient, parseEther, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import {
  createWalletClientFromPrivateKey,
  publicClient,
  transport,
} from "#/utils/clients";
import { PikeClient } from "#/services/PikeClient";
import { pstETH, pUSDC, pWETH, stETH, USDC, WETH } from "@pike-liq-bot/utils";
import { getDecimals, getUnderlying } from "#/utils/consts";
import { getEnv } from "#/utils/env";
import { MaxUint256 } from "ethers";

export type WalletInfo = {
  address: Address;
  privateKey: `0x${string}`;
};

const funderClient = new PikeClient(
  createWalletClientFromPrivateKey(getEnv("BOT_PRIVATE_KEY") as `0x${string}`)
);

async function createUsers(n: number) {
  // Random wallets are created and logged on a json file
  // All wallets receive 0.1 Eth to pay for gas fees from the funder wallet
  const walletsInfo: WalletInfo[] = [];
  const users: PikeClient[] = [];

  for (let i = 0; i < n; i++) {
    // Create a new random wallet
    const randomPrivateKey = generatePrivateKey();
    const wallet = privateKeyToAccount(randomPrivateKey);

    const walletInfo = {
      address: wallet.address,
      privateKey: randomPrivateKey,
    };

    walletsInfo.push(walletInfo);
    users.push(
      new PikeClient(
        createWalletClient({ account: wallet, chain: baseSepolia, transport })
      )
    );
  }

  fs.writeFileSync(
    "sepolia-wallets.json",
    JSON.stringify(walletsInfo, null, 2)
  );

  for (const walletInfo of walletsInfo) {
    await funderClient.sendEth({
      to: walletInfo.address,
      amount: parseEther("0.01"),
    });
  }

  return users;
}

async function funderDepositLiquidity() {
  // Deposit a large amount of tokens on all markets to ensure that the market is liquid

  const amounts = ["100000", "100", "100"];
  const pTokens = [pUSDC, pWETH, pstETH] as const;

  await funderClient.createPositionRecipe({
    deposits: pTokens.map((pToken, i) => ({
      pToken,
      amount: parseUnits(
        amounts[i],
        Number(getDecimals(getUnderlying(pToken)))
      ),
    })),
  });
}

async function createPositionUserA(user: PikeClient) {
  // user A deposit token WETH and borrow stETH
  const position = {
    deposits: [
      {
        pToken: pWETH,
        amount: parseUnits("1", Number(getDecimals(WETH))),
      },
    ],
    borrows: [
      {
        pToken: pstETH,
        amount: parseUnits("0.8", Number(getDecimals(stETH))),
      },
    ],
  };

  await user.createPositionRecipe(position);
}

async function createPositionUserB(user: PikeClient) {
  // user B deposit USDC and borrow token WETH and stETH
  const position = {
    deposits: [
      {
        pToken: pUSDC,
        amount: parseUnits("4000", Number(getDecimals(USDC))),
      },
    ],
    borrows: [
      {
        pToken: pWETH,
        amount: parseUnits("0.5", Number(getDecimals(WETH))),
      },
      {
        pToken: pstETH,
        amount: parseUnits("0.5", Number(getDecimals(stETH))),
      },
    ],
  };

  await user.createPositionRecipe(position);
}

async function createPositionUserC(user: PikeClient) {
  // user C deposit USDC and WETH to borrow stETH

  const position = {
    deposits: [
      {
        pToken: pUSDC,
        amount: parseUnits("200", Number(getDecimals(USDC))),
      },
      {
        pToken: pWETH,
        amount: parseUnits("0.1", Number(getDecimals(WETH))),
      },
    ],
    borrows: [
      {
        pToken: pstETH,
        amount: parseUnits("0.12", Number(getDecimals(stETH))),
      },
    ],
  };

  await user.createPositionRecipe(position);
}

async function createPositionUserD(user: PikeClient) {
  // user D deposit WETH and borrow USDC and stETH
  // after some blocks the user D repay totally the USDC loan
  // and redeem partially the WETH deposit

  const position = {
    deposits: [
      {
        pToken: pWETH,
        amount: parseUnits("0.1", Number(getDecimals(WETH))),
      },
    ],
    borrows: [
      {
        pToken: pUSDC,
        amount: parseUnits("100", Number(getDecimals(USDC))),
      },
      {
        pToken: pstETH,
        amount: parseUnits("0.01", Number(getDecimals(stETH))),
      },
    ],
  };

  await user.createPositionRecipe(position);
  await user.approveToken({
    token: USDC,
    spender: pUSDC,
  });
  await user.repayToken({
    pToken: pUSDC,
    amount: MaxUint256,
  });
  await user.redeemToken({
    pToken: pWETH,
    amount: parseUnits("0.01", Number(getDecimals(pWETH))),
  });
}

async function createPositionUserE(user: PikeClient) {
  // user E deposit WETH and borrow stETH
  // after some blocks the user E repay partially the stETH loan

  const position = {
    deposits: [
      {
        pToken: pWETH,
        amount: parseUnits("0.1", Number(getDecimals(WETH))),
      },
    ],
    borrows: [
      {
        pToken: pstETH,
        amount: parseUnits("0.05", Number(getDecimals(stETH))),
      },
    ],
  };

  await user.createPositionRecipe(position);

  await user.approveToken({
    token: stETH,
    spender: pstETH,
  });

  await user.repayToken({
    pToken: pstETH,
    amount: parseUnits("0.01", Number(getDecimals(stETH))),
  });
}

async function main() {
  // Generate 5 wallets
  const initialBlock = await publicClient.getBlockNumber();
  console.log(`Initial block: ${initialBlock}`);
  const wallets = await createUsers(5);
  console.log(`Users created`);
  await funderDepositLiquidity();
  console.log(`Funder deposited liquidity`);
  await createPositionUserA(wallets[0]).then(() =>
    console.log("Position A created")
  );
  await createPositionUserB(wallets[1]).then(() =>
    console.log("Position B created")
  );
  await createPositionUserC(wallets[2]).then(() =>
    console.log("Position C created")
  );
  await createPositionUserD(wallets[3]).then(() =>
    console.log("Position D created")
  );
  await createPositionUserE(wallets[4]).then(() =>
    console.log("Position E created")
  );
  console.log(`Positions created`);
  const finalBlock = await publicClient.getBlockNumber();
  console.log(`final block: ${finalBlock}`);
}

main();
