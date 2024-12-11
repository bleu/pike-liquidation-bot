import { gql } from "graphql-request";

import { gqlClient } from "./client";
import { MarketParameters } from "#/types";

interface IQuery {
  market: MarketParameters;
}

const QUERY = gql`
  query getMarketParameters($id: String!) {
    market(id: $id) {
      borrowIndex
      totalSupply
      totalBorrows
      totalReserves
      liquidationThreshold
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

  return queryResponse.market;
}
