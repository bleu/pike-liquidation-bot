import { getEnv } from "./utils";
import { ISendTransaction, TransactionFactory } from "./transactions";
import { ethers } from "ethers";

const SIMULATE_API = `https://api.tenderly.co/api/v1/account/${getEnv(
  "TENDERLY_ACCOUNT_SLUG"
)}/project/${getEnv("TENDERLY_PROJECT_SLUG")}/vnets`;

const tenderlyApyKey = getEnv("TENDERLY_API_KEY");

export const createTenderlyVNet = async () => {
  const currentTime = new Date().getTime();
  const body = JSON.stringify({
    slug: `vnet-${currentTime}`,
    fork_config: {
      block_number: "latest",
      network_id: Number(getEnv("NETWORK_ID")),
    },
    virtual_network_config: {
      chain_config: {
        chain_id: Number(getEnv("NETWORK_ID")),
      },
    },
  });

  const res = (await fetch(`${SIMULATE_API}`, {
    method: "POST",
    body,
    headers: {
      "X-Access-Key": tenderlyApyKey,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      throw new Error("failed to create tenderly vnet");
    })) as { id: string; rpcs: { name: string; url: string }[] };

  return {
    id: res.id,
    rpc: res.rpcs.find(({ name }) => name === "Admin RPC")?.url,
  };
};

export const withTenderlyProvider = async (
  callback: (transactionFactory: TransactionFactory) => void
) => {
  const { id: tenderlyId, rpc } = await createTenderlyVNet();

  console.log(`Tenderly VNet created: ${tenderlyId}`);
  const tenderlySendTransaction: ISendTransaction = async (data) => {
    const simulationResult = await fetch(
      `${SIMULATE_API}/${tenderlyId}/transactions`,
      {
        method: "POST",
        body: JSON.stringify({
          callArgs: {
            from: data.from,
            input: data.data,
            to: data.to,
            gasPrice: "0x0",
            value: "0x0",
          },
        }),
        headers: {
          "X-Access-Key": tenderlyApyKey,
        },
      }
    ).then((res) => res.json());

    if (simulationResult.status !== "success") {
      await fetch(`${SIMULATE_API}/simulate`, {
        method: "POST",
        body: JSON.stringify({
          callArgs: {
            from: data.from,
            input: data.data,
            to: data.to,
            gasPrice: "0x0",
            value: "0x0",
          },
        }),
        headers: {
          "X-Access-Key": tenderlyApyKey,
        },
      });
      throw new Error("tenderly transaction failed");
    }
  };

  const provider = new ethers.JsonRpcProvider(rpc);

  const tenderlyTransactionFactory = new TransactionFactory(
    tenderlySendTransaction,
    provider
  );

  callback(tenderlyTransactionFactory);
};
