import { parseUnits } from "viem";
import { logger } from "../services/logger";
import { ponderClient, schema } from "../utils/ponder/ponderClient";
import { and, eq } from "ponder";
import { getEnv } from "../utils/env";
import { UserPositionData } from "../types";

const priceUrl = getEnv("PRICE_URL");

export class DataLoaderHandler {
  constructor(private protocolId: string) {}

  async loadTokenPrices(
    tokens: (typeof schema.underlyingToken.$inferSelect)[]
  ) {
    logger.debug("Loading token prices", {
      class: "DataLoaderHandler",
      trackedTokens: tokens,
    });

    const ret = (await Promise.all(
      tokens.map(async (token) => {
        try {
          const res = await fetch(`${priceUrl}/${token.address.toLowerCase()}`);
          if (!res.ok) {
            throw new Error(
              `Failed to fetch price for token ${token}: ${res.statusText}`
            );
          }

          return res.json();
        } catch (error) {
          logger.error("Failed to update price for token", {
            class: "PriceHandler",
            token,
            error,
          });
          return { error };
        }
      })
    )) as {
      success: boolean;
      data: {
        assetAddress: string;
        price: string;
        timestamp: number;
      };
    }[];

    return tokens.map((token, i) => {
      return parseUnits(ret[i].data.price, 30 - Number(token.decimals));
    });
  }

  async loadUnderlyingTokens() {
    logger.debug("Loading underlying tokens", {
      class: "DataLoaderHandler",
    });
    // for some reason while using merge to do 1 SQL it return an error.
    // So I will do 2 SQLs to update the current price
    const queryResponse = await ponderClient.db
      .select()
      .from(schema.pToken)
      .innerJoin(
        schema.underlyingToken,
        eq(schema.pToken.underlyingId, schema.underlyingToken.id)
      )
      .where(eq(schema.pToken.protocolId, this.protocolId));

    // Merge the results based on protocolId
    return queryResponse.map((token) => token.underlyingToken);
  }

  async loadUsersData() {
    logger.debug("Loading user data", {
      class: "DataLoaderHandler",
    });
    return await ponderClient.db
      .select()
      .from(schema.userBalance)
      .innerJoin(
        schema.pToken,
        and(
          eq(schema.userBalance.pTokenId, schema.pToken.id),
          eq(schema.userBalance.chainId, schema.pToken.chainId)
        )
      )
      .leftJoin(
        schema.userEMode,
        and(
          eq(schema.userEMode.userId, schema.userBalance.userId),
          eq(schema.userEMode.chainId, schema.userBalance.chainId)
        )
      )
      .leftJoin(
        schema.pTokenEMode,
        and(
          eq(schema.pTokenEMode.pTokenId, schema.pToken.id),
          eq(schema.pTokenEMode.eModeId, schema.userEMode.eModeId),
          eq(schema.pTokenEMode.chainId, schema.userBalance.chainId)
        )
      )
      .leftJoin(
        schema.eMode,
        and(
          eq(schema.eMode.id, schema.userEMode.eModeId),
          eq(schema.eMode.chainId, schema.userBalance.chainId),
          eq(schema.eMode.protocolId, schema.pToken.protocolId)
        )
      )
      .where(eq(schema.pToken.protocolId, this.protocolId));
  }

  async loadUserPositionData(): Promise<UserPositionData[][]> {
    // const tokens = await this.loadUnderlyingTokens();
    const usersData = await this.loadUsersData();
    // const [tokenPrices, _usersData] = await Promise.all([
    //   this.loadTokenPrices(tokens),
    //   this.loadUsersData(),
    // ]);

    const usersIds = [
      ...new Set(usersData.map((position) => position.userBalance.userId)),
    ];

    return usersIds.map((userId) => {
      const userPositions = usersData.filter(
        (position) => position.userBalance.userId === userId
      );

      return userPositions.map((userPosition) => {
        // const token = tokens.find(
        //   (token) => token.id === userPosition.pToken.underlyingId
        // );

        // if (!token) {
        //   throw new Error("Token not found");
        // }

        return {
          userBalance: userPosition.userBalance,
          pToken: userPosition.pToken,
          eMode: userPosition.eMode,
          userEMode: userPosition.userEMode,
          underlyingTokenPrice: userPosition.pToken.underlyingPriceCurrent,
        };
      });
    });
  }
}
