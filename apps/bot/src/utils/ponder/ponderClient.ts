import { createClient } from "@ponder/client";
import * as schema from "./ponder.schema";

const ponderClient = createClient(
  "https://pike-indexer-production.up.railway.app/sql",
  { schema }
);

export { ponderClient, schema };
