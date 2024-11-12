import { publicClient } from "../clients";

export async function executeOnFutureBlock(
  blocksToWait: number,
  execute: () => Promise<void>
): Promise<void> {
  const currentBlock = await publicClient.getBlockNumber();
  const targetBlock = currentBlock + BigInt(blocksToWait);

  return new Promise<void>((resolve, reject) => {
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: async (blockNumber) => {
        try {
          console.log(`Current block: ${blockNumber}, Target: ${targetBlock}`);

          if (blockNumber >= targetBlock) {
            await execute();
            unwatch();
            resolve();
          }
        } catch (error) {
          unwatch();
          reject(error);
        }
      },
      onError: (error) => {
        unwatch();
        reject(error);
      },
    });
  });
}
