import {
  DEFAULT_ABI_CODER,
  fnCalldata,
  normalizeAddress,
  toBigInt,
} from "./converters";
import { mockOracle, oracleEngine, riskEngine, WETH } from "./contracts";
import { ethers, MaxUint256 } from "ethers";
import { ISendTransaction } from "./types";
import { getUnderlying } from "./consts";
import { PublicClient, TestClient, WalletClient } from "viem";

export class TransactionFactory {
  sendTransaction: ISendTransaction;
  provider: TestClient & PublicClient & WalletClient;
  contractOwner: Record<string, string>;
  tokenDecimals: Record<string, bigint>;

  constructor(
    sendTransaction: ISendTransaction,
    provider: TestClient & PublicClient & WalletClient
  ) {
    this.sendTransaction = sendTransaction;
    this.provider = provider;
    this.contractOwner = {};
    this.tokenDecimals = {};
  }

  approveToken = async (
    token: `0x${string}`,
    user: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint
  ) => {
    return this.sendTransaction({
      from: user,
      to: token,
      data: fnCalldata(
        "approve(address,uint256)",
        DEFAULT_ABI_CODER.encode(["address", "uint"], [spender, amount])
      ),
    });
  };

  mintToken = async (
    token: `0x${string}`,
    to: `0x${string}`,
    amount: bigint
  ) => {
    const tokenOwner = await this.getOwner(token);

    const mintCalldata = fnCalldata(
      "mint(address,uint256)",
      DEFAULT_ABI_CODER.encode(["address", "uint"], [to, amount])
    );

    return this.sendTransaction({
      from: tokenOwner,
      to: token,
      data: mintCalldata,
    });
  };

  depositToken = async (
    user: `0x${string}`,
    pToken: `0x${string}`,
    amount: bigint
  ) => {
    return this.sendTransaction({
      from: user,
      to: pToken,
      data: fnCalldata(
        "mint(uint256)",
        DEFAULT_ABI_CODER.encode(["uint"], [amount])
      ),
    });
  };

  borrowToken = async (
    user: `0x${string}`,
    pToken: `0x${string}`,
    amount: bigint
  ) => {
    return this.sendTransaction({
      from: user,
      to: pToken,
      data: fnCalldata(
        "borrow(uint256)",
        DEFAULT_ABI_CODER.encode(["uint"], [amount])
      ),
    });
  };

  setMockOraclePrice = async (price: bigint, token: `0x${string}`) => {
    const tokenDecimals = await this.getTokenDecimals(token);
    return this.sendTransaction({
      from: token, // there is no owner for mockOracle so we can call it from any address
      to: mockOracle,
      data: fnCalldata(
        "setPrice(address,uint256,uint256)",
        DEFAULT_ABI_CODER.encode(
          ["address", "uint", "uint"],
          [token, price, tokenDecimals]
        )
      ),
    });
  };

  setMockOracle = async (token: `0x${string}`) => {
    const oracleEngineOwner = await this.getOwner(oracleEngine);
    return this.sendTransaction({
      from: oracleEngineOwner,
      to: oracleEngine,
      data: fnCalldata(
        "setAssetConfig(address,address,address,uint256,uint256)",
        DEFAULT_ABI_CODER.encode(
          ["address", "address", "address", "uint256", "uint256"],
          [token, mockOracle, mockOracle, 0n, MaxUint256]
        )
      ),
    });
  };

  enterMarket = async (pTokens: `0x${string}`, [], from: `0x${string}`) => {
    return this.sendTransaction({
      from,
      to: riskEngine,
      data: fnCalldata(
        "enterMarkets(address[])",
        DEFAULT_ABI_CODER.encode(["address[]"], [pTokens])
      ),
    });
  };

  depositTokenFlow = async (
    user: `0x${string}`,
    pToken: `0x${string}`,
    amount: bigint
  ) => {
    const token = getUnderlying(pToken);
    await this.mintToken(token, user, amount);
    await this.approveToken(token, user, pToken, amount);
    await this.depositToken(user, pToken, amount);
    await this.enterMarket([pToken], user);
  };

  setCollateralFactor = async (
    pToken: `0x${string}`,
    collateralFactor: bigint,
    liquidationFactor: bigint
  ) => {
    const pTokeOwner = await this.getOwner(pToken);
    return this.sendTransaction({
      from: pTokeOwner,
      to: riskEngine,
      data: fnCalldata(
        "setCollateralFactor(address,uint256,uint256)",
        DEFAULT_ABI_CODER.encode(
          ["address", "uint", "uint"],
          [pToken, collateralFactor, liquidationFactor]
        )
      ),
    });
  };

  liquidateUser = async (
    liquidator: `0x${string}`,
    borrower: `0x${string}`,
    pToken: `0x${string}`,
    amount: bigint,
    collateralPToken: `0x${string}`
  ) => {
    return this.sendTransaction({
      from: liquidator,
      to: pToken,
      data: fnCalldata(
        "liquidateBorrow(address,uint256,address)",
        DEFAULT_ABI_CODER.encode(
          ["address", "uint", "address"],
          [borrower, amount, collateralPToken]
        )
      ),
    });
  };

  getOwner = async (address: `0x${string}`) => {
    if (this.contractOwner[address]) {
      return this.contractOwner[address];
    }

    const res = await this.provider.call({
      to: address,
      data: fnCalldata("owner()", DEFAULT_ABI_CODER.encode([], [])),
    });

    console.log({ address, res });
    const owner = normalizeAddress(res.data);

    this.contractOwner[address] = owner;

    return owner;
  };

  getTokenDecimals = async (
    token: `0x${string}`
  ): Promise<bigint | undefined> => {
    if (this.tokenDecimals[token]) {
      return this.tokenDecimals[token];
    }

    const res = await this.provider.call({
      to: token,
      data: fnCalldata("decimals()", DEFAULT_ABI_CODER.encode([], [])),
    });
    console.log({ res });
    const decimals = DEFAULT_ABI_CODER.decode(["uint256"], res.data)[0];
    return decimals;
  };

  getTokenBalance = async (
    token: `0x${string}`,
    owner: `0x${string}`
  ): Promise<bigint | undefined> => {
    const ret = await this.provider.call({
      to: token,
      data: fnCalldata(
        "balanceOf(address)",
        DEFAULT_ABI_CODER.encode(["address"], [owner])
      ),
    });
    const bal = DEFAULT_ABI_CODER.decode(["uint256"], ret.data)[0];
    return bal;
  };

  getPTokenPrice = async (
    pToken: `0x${string}`
  ): Promise<bigint | undefined> => {
    const ret = await this.provider.call({
      to: oracleEngine,
      data: fnCalldata(
        "getUnderlyingPrice(address)",
        DEFAULT_ABI_CODER.encode(["address"], [pToken])
      ),
    });
    const price = toBigInt(ret.data);
    return price;
  };

  getTokenPrice = async (token: `0x${string}`): Promise<bigint | undefined> => {
    const ret = await this.provider.call({
      to: oracleEngine,
      data: fnCalldata(
        "getPrice(address)",
        DEFAULT_ABI_CODER.encode(["address"], [token])
      ),
    });

    const price = toBigInt(ret.data);
    return price;
  };

  getCurrentBorrowAmount = async (
    pToken: `0x${string}`,
    user: `0x${string}`
  ): Promise<bigint | undefined> => {
    const ret = await this.provider.call({
      to: pToken,
      data: fnCalldata(
        "borrowBalanceCurrent(address)",
        DEFAULT_ABI_CODER.encode(["address"], [user])
      ),
    });
    const borrowAmount = toBigInt(ret.data);
    return borrowAmount;
  };

  checkIfCanLiquidate = async (
    borrowToken: `0x${string}`,
    borrower: `0x${string}`,
    collateralToken: `0x${string}`,
    amount: bigint
  ): Promise<boolean> => {
    const ret = await this.provider.call({
      to: riskEngine,
      data: fnCalldata(
        "liquidateBorrowAllowed(address,address,address,uint256)",
        DEFAULT_ABI_CODER.encode(
          ["address", "address", "address", "uint"],
          [borrowToken, collateralToken, borrower, amount]
        )
      ),
    });
    const errorCode = toBigInt(ret.data);
    console.log(`Liquidation check error code: ${errorCode.toString()}`);
    return errorCode == BigInt(0);
  };

  getTokenTotalSupply = async (
    token: `0x${string}`
  ): Promise<bigint | undefined> => {
    const ret = await this.provider.call({
      to: token,
      data: fnCalldata("totalSupply()", DEFAULT_ABI_CODER.encode([], [])),
    });
    const totalSupply = toBigInt(ret.data);
    return totalSupply;
  };
}

export type IWithTransactionFactory = (
  wallets: `0x${string}`,
  [],
  transactionFactory: TransactionFactory
) => void;
