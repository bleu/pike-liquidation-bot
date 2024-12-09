import { gql } from "graphql-request";

import { type Address } from "viem";
import { AllUserPositions } from "../../types";
import { gqlClient } from "./client";

interface IQuery {
  users: {
    items: {
      id: Address;
      lastUpdated: bigint;
      positions: {
        items: {
          marketId: Address;
          balance: string;
          borrowed: string;
          isOnMarket: boolean;
        }[];
      };
    }[];
  };
}

const QUERY = gql`
  query getUserPositionsAfterUpdate($lastUpdateGt: BigInt) {
    users(where: { lastUpdated_gt: $lastUpdateGt }) {
      items {
        id
        lastUpdated
        positions {
          items {
            marketId
            balance
            borrowed
            isOnMarket
          }
        }
      }
    }
  }
`;

export async function getUserPositionsUpdatesAfterBlock(
  lastUpdateGt?: bigint
): Promise<AllUserPositions[]> {
  const queryResponse = await gqlClient.request<IQuery>(QUERY, {
    lastUpdateGt: lastUpdateGt ? String(lastUpdateGt) : undefined,
  });

  return queryResponse.users.items.map((user) => ({
    id: user.id,
    lastUpdated: user.lastUpdated,
    positions: user.positions.items.map((position) => ({
      marketId: position.marketId,
      balance: BigInt(position.balance),
      borrowed: BigInt(position.borrowed),
      isOnMarket: position.isOnMarket,
    })),
  }));
}
