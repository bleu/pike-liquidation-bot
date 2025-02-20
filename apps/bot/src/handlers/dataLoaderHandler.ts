import { logger } from "../services/logger";
import { getEnv } from "../utils/env";
import { UserPositionData } from "../types";
import { graphQLClient } from "#/utils/graphql/client";
import { GetProtocolDataQuery } from "#/utils/graphql/generated/graphql";
import { GET_PROTOCOL_DATA } from "#/utils/graphql/query";

const priceUrl = getEnv("PRICE_URL");

export class DataLoaderHandler {
  constructor(private protocolId: string) {}

  transformProtocolDataToUserPositions(
    data: GetProtocolDataQuery
  ): UserPositionData[][] {
    if (!data.protocol?.pTokens?.items) {
      return [];
    }

    const pTokens = data.protocol.pTokens.items;

    const positions = pTokens.flatMap(
      (pToken) => pToken.userBalances?.items || []
    );

    const uniqueUserIds = [
      ...new Set<string>(positions.map((position) => position.userId)),
    ];

    const eModes = data.protocol.eModes?.items || [];

    const userEModes = eModes?.flatMap((eMode) => eMode.users?.items || []);

    return uniqueUserIds.map((userId) => {
      const userPositions = positions.filter(
        (position) => position.userId === userId
      );

      return userPositions.map((userPosition) => {
        const pToken = pTokens.find(
          (pToken) => pToken.id === userPosition.pTokenId
        );

        if (!pToken) {
          throw new Error("PToken not found");
        }

        const userEMode = userEModes.find(
          (userEMode) => userEMode.userId === userId
        );

        const eMode = eModes.find((eMode) => eMode.id === userEMode?.eModeId);

        const eModeData = eMode
          ? {
              id: eMode.id,
              categoryId: eMode.categoryId,
              collateralFactor: eMode.collateralFactor,
              liquidationThreshold: eMode.liquidationThreshold,
              liquidationIncentive: eMode.liquidationIncentive,
            }
          : undefined;

        return {
          userBalance: {
            ...userPosition,
            supplyShares: BigInt(userPosition.supplyShares),
            borrowAssets: BigInt(userPosition.borrowAssets),
            interestIndex: BigInt(userPosition.interestIndex),
            updatedAt: BigInt(userPosition.updatedAt),
            chainId: BigInt(userPosition.chainId),
          },
          pToken: {
            id: pToken.id,
            address: pToken.address,
            decimals: pToken.decimals,
            liquidationThreshold: BigInt(pToken.liquidationThreshold),
            liquidationIncentive: BigInt(pToken.liquidationIncentive),
            reserveFactor: BigInt(pToken.reserveFactor),
            collateralFactor: BigInt(pToken.collateralFactor),
            closeFactor: BigInt(pToken.closeFactor),
            supplyCap: BigInt(pToken.supplyCap),
            borrowCap: BigInt(pToken.borrowCap),
            exchangeRateStored: BigInt(pToken.exchangeRateStored),
            borrowIndex: BigInt(pToken.borrowIndex),
            underlyingPriceCurrent: BigInt(pToken.underlyingPriceCurrent),
          },
          eMode: eModeData,
          underlyingTokenPrice: BigInt(pToken.underlyingPriceCurrent),
        };
      });
    });
  }

  async loadUsersData() {
    logger.debug("Loading user data", {
      class: "DataLoaderHandler",
    });
    return await graphQLClient.request<GetProtocolDataQuery>(
      GET_PROTOCOL_DATA,
      {
        protocolId: this.protocolId,
      }
    );
  }

  async loadUserPositionData(): Promise<UserPositionData[][]> {
    const usersData = await this.loadUsersData();

    return this.transformProtocolDataToUserPositions(usersData);
  }
}
