import {
  pUSDC,
  pWETH,
  WETH,
  defaultAddresses,
  initialLF,
  initialUsdcPrice,
  IWithTransactionFactory,
} from "../utils";
import { withTenderlyProvider } from "../fork/tenderly";
import { LiquidationBot } from "../liquidationBot";
import { completeSetup } from "../fork/mocks/setup";

const liquidationTest: IWithTransactionFactory = async (
  wallets,
  transactionFactory
) => {
  console.log("Provider and wallets are ready");

  await completeSetup(transactionFactory);

  console.log("Setup complete");
};

export const tenderlyTestMain = async () => {
  await withTenderlyProvider(async (transactionFactory) => {
    liquidationTest(defaultAddresses, transactionFactory);
  });
};

tenderlyTestMain();
