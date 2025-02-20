import { logger } from "../services/logger";
import { UserPositionData } from "../types";
import { graphQLClient } from "#/utils/graphql/client";
import { GetProtocolDataQuery } from "#/utils/graphql/generated/graphql";
import { GET_PROTOCOL_DATA } from "#/utils/graphql/query";
import { publicClient } from "#/services/clients";
import { oracleEngine, oracleEngineAbi } from "@pike-liq-bot/utils";
import { Address } from "viem";

export class DataLoaderHandler {
  constructor(private protocolId: string) {}

  transformProtocolDataToUserPositions(
    data: GetProtocolDataQuery,
    underlyingPrices: {
      [key: string]: bigint;
    }
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
            underlyingPriceCurrent: BigInt(underlyingPrices[pToken.id]),
          },
          eMode: eModeData,
          underlyingTokenPrice: BigInt(underlyingPrices[pToken.id]),
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

  async loadCurrentUnderlyingPrices(data: GetProtocolDataQuery) {
    logger.debug("Loading current oracle prices");

    const pTokens = data.protocol?.pTokens?.items;

    if (!pTokens || !pTokens.length) {
      throw Error("Non pTokens found");
    }

    const multicallResponse = await publicClient.multicall({
      contracts: pTokens.map(({ address }) => ({
        address: data.protocol?.oracle as Address,
        abi: oracleEngineAbi,
        functionName: "getUnderlyingPrice",
        args: [address],
      })),
    });

    const prices = multicallResponse.map(({ result }) => result);

    if (
      !prices.every(
        (price) => typeof price === "string" || typeof price === "bigint"
      )
    ) {
      throw Error("No price tokens found");
    }

    return pTokens.reduce((acc, pToken, i) => {
      acc[pToken.id] = BigInt(prices[i]);
      return acc;
    }, {} as { [key: string]: bigint });
  }

  async loadUserPositionData(): Promise<UserPositionData[][]> {
    const usersData = await this.loadUsersData();
    const prices = await this.loadCurrentUnderlyingPrices(usersData);

    return this.transformProtocolDataToUserPositions(usersData, prices);
  }
}
