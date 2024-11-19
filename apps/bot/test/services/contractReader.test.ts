import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContractReader } from "#/services/contractReader";
import { publicClient } from "#/services/clients";
import { USDC, WETH } from "@pike-liq-bot/utils";

vi.mock("#/services/clients", async () => {
  const actual = await vi.importActual("#/services/clients");
  return {
    ...actual,
    publicClient: {
      readContract: vi.fn(),
      multicall: vi.fn(),
    },
  };
});

describe("ContractReader", () => {
  let contractReader: ContractReader;

  beforeEach(() => {
    vi.clearAllMocks();
    contractReader = new ContractReader(publicClient);
  });

  test("should read contract", async () => {
    const expectedResult = 100n;
    (publicClient.readContract as any).mockResolvedValue(expectedResult);

    const mockAbi = [{ name: "test", type: "function" }] as const;
    const mockArgs = ["arg1"];

    const result = await contractReader.readContract({
      address: WETH,
      abi: mockAbi,
      functionName: "test",
      args: mockArgs,
    });

    expect(publicClient.readContract).toHaveBeenCalledWith({
      address: WETH,
      abi: mockAbi,
      functionName: "test",
      args: mockArgs,
      blockNumber: undefined,
    });
    expect(result).toBe(expectedResult);
  });

  test("should perform multicall", async () => {
    const mockResults = [
      { result: 100n, status: "success" },
      { result: 200n, status: "success" },
    ];
    (publicClient.multicall as any).mockResolvedValue(mockResults);

    const mockCalls = [
      { address: WETH, abi: [], functionName: "test1", args: [] },
      { address: USDC, abi: [], functionName: "test2", args: [] },
    ];

    const result = await contractReader.multicall({
      contracts: mockCalls,
    });

    expect(publicClient.multicall).toHaveBeenCalledWith({
      contracts: mockCalls,
    });
    expect(result).toEqual(mockResults);
  });

  test("should handle read contract errors", async () => {
    const mockError = new Error("Contract read failed");
    (publicClient.readContract as any).mockRejectedValue(mockError);

    const mockAbi = [{ name: "test", type: "function" }] as const;

    await expect(
      contractReader.readContract({
        address: WETH,
        abi: mockAbi,
        functionName: "test",
        args: [],
      })
    ).rejects.toThrow(mockError);
  });

  test("should handle multicall errors", async () => {
    const mockResults = [
      { error: new Error("Failed"), status: "failure" },
      { result: 200n, status: "success" },
    ];
    (publicClient.multicall as any).mockResolvedValue(mockResults);

    const mockCalls = [
      { address: WETH, abi: [], functionName: "test1", args: [] },
      { address: USDC, abi: [], functionName: "test2", args: [] },
    ];

    const result = await contractReader.multicall({
      contracts: mockCalls,
    });

    expect(result).toEqual(mockResults);
  });
});
