export interface PriceResponse {
  success: boolean;
  data: {
    assetAddress: string;
    timestamp: number;
  };
}

export interface SetPriceResponse {
  success: boolean;
  data: {
    assetAddress: string;
    transactionHash: string;
    cachedPrice: string;
    timestamp: number;
  };
}

export interface ErrorResponse {
  success: boolean;
  error: string;
}
export interface CacheEntry {
  price: number;
  timestamp: number;
}

export interface PriceCache {
  [assetAddress: string]: CacheEntry;
}
