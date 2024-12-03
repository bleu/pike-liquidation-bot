import { describe, test, expect, vi, beforeEach } from "vitest";
import { LiquidationHandler } from "#/handlers/liquidationHandler";
import { ContractReader } from "#/services/contractReader";
import { publicClient } from "#/services/clients";
import { riskEngine, pWETH, pUSDC } from "@pike-liq-bot/utils";
import { PikeClient } from "#/services/clients";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  return {
    ...actual,
    publicClient: {
      readContract: vi.fn(),
      getBlock: vi.fn().mockResolvedValue({ baseFeePerGas: 1000000000n }),
      estimateGas: vi.fn().mockResolvedValue(100000n),
      getTransactionReceipt: vi.fn().mockResolvedValue({ status: "success" }),
    },
    PikeClient: vi.fn().mockImplementation(() => ({
      sendAndWaitForReceipt: vi.fn().mockResolvedValue({ status: "success" }),
    })),
  };
});

describe("LiquidationHandler", () => {
  let liquidationHandler: LiquidationHandler;
  let mockPikeClient: PikeClient;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock wallet client with proper 32-byte private key
    const mockWalletClient = createWalletClient({
      account: privateKeyToAccount(
        "0x1234567890123456789012345678901234567890123456789012345678901234" as `0x${string}`
      ),
      chain: baseSepolia,
      transport: http(),
    });

    // Initialize mocked PikeClient
    mockPikeClient = new PikeClient(mockWalletClient);

    const contractReader = new ContractReader(publicClient);
    liquidationHandler = new LiquidationHandler(contractReader, mockPikeClient);
    liquidationHandler.closeFactorMantissa = 500000000000000000n;
    liquidationHandler.liquidationIncentiveMantissa = 1050000000000000000n;
  });

  test("should check if liquidation is allowed", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(0n); // 0 means allowed

    const allowed = await liquidationHandler.checkLiquidationAllowed({
      borrowPToken: pWETH,
      borrower: "0x123" as const,
      collateralPToken: pUSDC,
      amountToLiquidate: 100n,
    });

    expect(allowed).toBe(true);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: riskEngine,
        functionName: "liquidateBorrowAllowed",
        args: [pWETH, pUSDC, "0x123", 100n],
      })
    );
  });

  test("should check amount to liquidate", async () => {
    // Mock borrow balance
    vi.mocked(publicClient.readContract).mockResolvedValueOnce(0n); // liquidateBorrowAllowed

    const amount = await liquidationHandler.checkAmountToLiquidate({
      borrowPToken: pWETH,
      borrower: "0x123" as const,
      collateralPToken: pUSDC,
      borrowAmount: 1000n,
    });

    expect(amount).toBe(500n); // Half of borrow balance
    expect(publicClient.readContract).toHaveBeenCalledTimes(1);
  });

  test("should return 0 if liquidation not allowed", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValueOnce(1n); // liquidateBorrowAllowed (not 0, means not allowed)

    const amount = await liquidationHandler.checkAmountToLiquidate({
      borrowPToken: pWETH,
      borrower: "0x123" as const,
      collateralPToken: pUSDC,
      borrowAmount: 1000n,
    });

    expect(amount).toBe(0n);
  });
});
