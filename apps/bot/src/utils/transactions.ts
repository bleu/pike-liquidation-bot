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

export class TransactionFactory {
  sendTransaction: ISendTransaction;
  provider: ethers.JsonRpcProvider;

  constructor(
    sendTransaction: ISendTransaction,
    provider: ethers.JsonRpcProvider
  ) {
    this.sendTransaction = sendTransaction;
    this.provider = provider;
  }

  approveToken = async (
    token: string,
    user: string,
    spender: string,
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

  mintToken = async (token: string, to: string, amount: bigint) => {
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

  depositToken = async (user: string, pToken: string, amount: bigint) => {
    return this.sendTransaction({
      from: user,
      to: pToken,
      data: fnCalldata(
        "mint(uint256)",
        DEFAULT_ABI_CODER.encode(["uint"], [amount])
      ),
    });
  };

  borrowToken = async (user: string, pToken: string, amount: bigint) => {
    return this.sendTransaction({
      from: user,
      to: pToken,
      data: fnCalldata(
        "borrow(uint256)",
        DEFAULT_ABI_CODER.encode(["uint"], [amount])
      ),
    });
  };

  setMockOraclePrice = async (price: bigint, token: string) => {
    const tokenDecimals = await this.getTokenDecimals(token);
    return this.sendTransaction({
      from: WETH, // there is no owner for mockOracle so we can call it from any address
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

  setMockOracle = async (token: string) => {
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

  enterMarket = async (pTokens: string[], from: string) => {
    return this.sendTransaction({
      from,
      to: riskEngine,
      data: fnCalldata(
        "enterMarkets(address[])",
        DEFAULT_ABI_CODER.encode(["address[]"], [pTokens])
      ),
    });
  };

  depositTokenFlow = async (user: string, pToken: string, amount: bigint) => {
    const token = getUnderlying(pToken);
    await this.mintToken(token, user, amount);
    await this.approveToken(token, user, pToken, amount);
    await this.depositToken(user, pToken, amount);
    return this.enterMarket([pToken], user);
  };

  setCollateralFactor = async (
    pToken: string,
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
    liquidator: string,
    borrower: string,
    pToken: string,
    amount: bigint,
    collateral: string
  ) => {
    return this.sendTransaction({
      from: liquidator,
      to: pToken,
      data: fnCalldata(
        "liquidateBorrow(address,uint256,address)",
        DEFAULT_ABI_CODER.encode(
          ["address", "uint", "address"],
          [borrower, amount, collateral]
        )
      ),
    });
  };

  getOwner = async (address: string) => {
    console.log(`Getting owner of ${address}`);
    const owner = await this.provider
      .call({
        to: address,
        data: fnCalldata("owner()", DEFAULT_ABI_CODER.encode([], [])),
      })
      .then((res) => normalizeAddress(res));
    return owner;
  };

  getTokenDecimals = async (token: string): Promise<bigint> => {
    const decimals = await this.provider
      .call({
        to: token,
        data: fnCalldata("decimals()", DEFAULT_ABI_CODER.encode([], [])),
      })
      .then((res) => DEFAULT_ABI_CODER.decode(["uint"], res)[0]);
    return decimals;
  };

  getTokenBalance = async (token: string, owner: string): Promise<bigint> => {
    const ret = await this.provider.call({
      to: token,
      data: fnCalldata(
        "balanceOf(address)",
        DEFAULT_ABI_CODER.encode(["address"], [owner])
      ),
    });
    const bal = DEFAULT_ABI_CODER.decode(["uint"], ret)[0];
    return bal;
  };

  getPTokenPrice = async (pToken: string): Promise<bigint> => {
    const ret = await this.provider.call({
      to: oracleEngine,
      data: fnCalldata(
        "getUnderlyingPrice(address)",
        DEFAULT_ABI_CODER.encode(["address"], [pToken])
      ),
    });
    const price = toBigInt(ret);
    return price;
  };

  getTokenPrice = async (token: string): Promise<bigint> => {
    const ret = await this.provider.call({
      to: oracleEngine,
      data: fnCalldata(
        "getPRice(address)",
        DEFAULT_ABI_CODER.encode(["address"], [token])
      ),
    });
    const price = toBigInt(ret);
    return price;
  };

  getTokenTotalSupply = async (token: string): Promise<bigint> => {
    const ret = await this.provider.call({
      to: token,
      data: fnCalldata("totalSupply()", DEFAULT_ABI_CODER.encode([], [])),
    });
    const totalSupply = toBigInt(ret);
    return totalSupply;
  };
}

export type IWithTransactionFactory = (
  wallets: string[],
  transactionFactory: TransactionFactory
) => void;
