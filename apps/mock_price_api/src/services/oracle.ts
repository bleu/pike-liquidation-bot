import { PriceCache } from '@/types';
import {
  getDecimals,
  mockOracle,
  mockOracleAbi,
  oracleEngine,
  oracleEngineAbi,
} from '@pike-liq-bot/utils';
import { injectable } from 'inversify';
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  formatUnits,
  http,
  parseUnits,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

export interface PriceService {
  getPrice(assetAddress: `0x${string}`): Promise<number>;
  setPrice(
    assetAddress: `0x${string}`,
    newPrice: number,
  ): Promise<{
    transactionHash: string;
    cachedPrice: number;
  }>;
}

export const priceServiceSymbol = Symbol('PriceService');

@injectable()
export class PriceServiceMain implements PriceService {
  private publicClient;
  private walletClient;
  private account;
  private cache: PriceCache = {};

  constructor() {
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.RPC_URL!),
    });

    this.walletClient = createWalletClient({
      chain: baseSepolia,
      transport: http(process.env.RPC_URL!),
    });

    this.account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  }

  async getPrice(assetAddress: `0x${string}`): Promise<number> {
    const cachedPrice = this.cache[assetAddress];

    // Check if we have a valid cached price
    if (
      cachedPrice &&
      Date.now() - cachedPrice.timestamp < 60000 // Additional 1-minute time-based cache
    ) {
      return cachedPrice.price;
    }

    // Fetch new price
    const priceWei = await this.publicClient.readContract({
      address: oracleEngine,
      abi: oracleEngineAbi,
      functionName: 'getPrice',
      args: [assetAddress],
    });

    const price = Number(formatUnits(priceWei, 36 - Number(getDecimals(assetAddress))));

    // Update cache
    this.cache[assetAddress] = {
      price,
      timestamp: Date.now(),
    };

    return price;
  }

  async setPrice(assetAddress: `0x${string}`, newPrice: number) {
    this.cache[assetAddress] = {
      price: newPrice,
      timestamp: Date.now(),
    };

    const priceWithDecimals = parseUnits(String(newPrice), 6);

    // Prepare and send transaction
    const gasLimit = await this.publicClient.estimateGas({
      account: this.account,
      to: mockOracle,
      data: encodeFunctionData({
        abi: mockOracleAbi,
        functionName: 'setPrice',
        args: [assetAddress, priceWithDecimals, getDecimals(assetAddress)],
      }),
    });

    const hash = await this.walletClient.sendTransaction({
      to: mockOracle,
      data: encodeFunctionData({
        abi: mockOracleAbi,
        functionName: 'setPrice',
        args: [assetAddress, priceWithDecimals, getDecimals(assetAddress)],
      }),
      account: this.account,
      value: 0n,
      gas: gasLimit,
    });

    return {
      transactionHash: hash,
      cachedPrice: newPrice,
    };
  }
}
