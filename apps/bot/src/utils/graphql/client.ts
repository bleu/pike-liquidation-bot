import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(
  "https://pike-indexer-production.up.railway.app/"
);
