import { gql } from "graphql-tag";

export const GET_PROTOCOL_DATA = gql`
  query GetProtocolData($protocolId: String!) {
    protocol(id: $protocolId) {
      pTokens {
        items {
          id
          address
          decimals
          liquidationThreshold
          liquidationIncentive
          reserveFactor
          collateralFactor
          closeFactor
          supplyCap
          borrowCap
          exchangeRateStored
          borrowIndex
          underlyingPriceCurrent
          userBalances {
            items {
              id
              chainId
              userId
              pTokenId
              supplyShares
              borrowAssets
              isCollateral
              interestIndex
              updatedAt
            }
          }
        }
      }
      eModes {
        items {
          id
          chainId
          protocolId
          categoryId
          collateralFactor
          liquidationThreshold
          liquidationIncentive
          users {
            items {
              userId
              eModeId
              chainId
              id
            }
          }
        }
      }
    }
  }
`;
