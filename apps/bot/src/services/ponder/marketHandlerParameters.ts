import { gql } from "graphql-request";

import { gqlClient } from "./client";
import { MarketParameters } from "#/types";

interface IQuery {
  market: {
    borrowIndex: string;
    totalBorrows: string;
    totalReserves: string;
    totalSupply: string;
    cash: string;
    liquidationThreshold: string;
    protocolSeizeShareMantissa: string;
    lastUpdated: string;
  };
}

const QUERY = gql`
  query getMarketParameters($id: String!) {
    market(id: $id) {
      borrowIndex
      totalSupply
      totalBorrows
      totalReserves
      liquidationThreshold
      protocolSeizeShareMantissa
      cash
    }
  }
`;

export async function getMarketParameters(
  pToken: string
): Promise<MarketParameters> {
  const queryResponse = await gqlClient.request<IQuery>(QUERY, {
    id: pToken,
  });

  return Object.entries(queryResponse.market).reduce((acc, [key, value]) => {
    // @ts-ignore
    acc[key] = BigInt(value);
    return acc;
  }, {} as MarketParameters);
}
