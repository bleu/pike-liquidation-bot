import { Address } from "viem";
import { publicClient } from "./clients";

export class ContractReader {
  private blockNumber?: bigint;

  constructor(private readonly _publicClient: typeof publicClient) {}

  setBlockNumber(blockNumber: bigint) {
    this.blockNumber = blockNumber;
  }

  async readContract({
    address,
    abi,
    functionName,
    args,
    blockNumber,
  }: {
    address: Address;
    abi: any;
    functionName: string;
    args: any[];
    blockNumber?: bigint;
  }) {
    return await this._publicClient.readContract({
      address,
      abi,
      functionName,
      args,
      blockNumber: blockNumber ?? this.blockNumber,
    });
  }

  async multicall({
    contracts,
    blockNumber,
  }: {
    contracts: any[];
    blockNumber?: bigint;
  }) {
    // Add block number to each contract call if specified
    const contractsWithBlock = contracts.map((contract) => ({
      ...contract,
      blockNumber: blockNumber ?? this.blockNumber ?? contract.blockNumber,
    }));

    return await this._publicClient.multicall({
      contracts: contractsWithBlock,
    });
  }
}
