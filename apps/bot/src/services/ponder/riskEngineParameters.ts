import { gql } from "graphql-request";

import { gqlClient } from "./client";
import { riskEngine } from "@pike-liq-bot/utils";

interface IQuery {
  riskEngine: {
    closeFactorMantissa: bigint;
    liquidationIncentiveMantissa: bigint;
    lastUpdated: bigint;
  };
}

const QUERY = gql`
  query getRiskEngine($riskEngineId: String!) {
    riskEngine(id: $riskEngineId) {
      closeFactorMantissa
      liquidationIncentiveMantissa
      lastUpdated
    }
  }
`;

export async function getRiskEngineParameters(lastUpdateGt?: bigint) {
  const queryResponse = await gqlClient.request<IQuery>(QUERY, {
    riskEngineId: riskEngine,
    lastUpdateGt,
  });

  return queryResponse.riskEngine;
}
