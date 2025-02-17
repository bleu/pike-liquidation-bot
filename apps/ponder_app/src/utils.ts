import { Context } from "@/generated";
import { Address } from "viem";
import { user } from "../ponder.schema";

export const createOrUpdateUser = async (
  ctx: Context,
  userAddress: Address,
  blockTimestamp: bigint
) => {
  await ctx.db
    .insert(user)
    .values({
      id: userAddress,
      lastUpdated: blockTimestamp,
    })
    .onConflictDoUpdate({ lastUpdated: blockTimestamp });
};

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;
