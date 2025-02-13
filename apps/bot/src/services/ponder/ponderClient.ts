import { createClient } from "@ponder/client";
import * as schema from "./ponder.schema";

export const ponderClient = createClient(
  "https://pike-indexer-production.up.railway.app/sql",
  { schema }
);
