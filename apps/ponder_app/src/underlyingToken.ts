import { ponder } from "@/generated";
import { getPToken } from "packages/utils/src";
import { market } from "../ponder.schema";

ponder.on("underlyingToken:Transfer", async ({ event, context }) => {
  try {
    const marketId = getPToken(event.log.address);
    const { from, to, value } = event.args;
    if (from.toLowerCase() === marketId.toLowerCase()) {
      await context.db.update(market, { id: marketId }).set(({ cash }) => ({
        cash: (cash || 0n) - value,
      }));
    }
    if (to.toLowerCase() === marketId.toLowerCase()) {
      await context.db.update(market, { id: marketId }).set(({ cash }) => ({
        cash: (cash || 0n) + value,
      }));
    }
  } catch (e) {}
});
