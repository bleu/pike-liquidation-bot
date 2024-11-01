export const DoubleJumpRateModelAbi = [
  {
    type: "function",
    name: "baseRatePerSecond",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "configureInterestRateModel",
    inputs: [
      {
        name: "baseRatePerYear",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "multiplierPerYear",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "firstJumpMultiplierPerYear",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "secondJumpMultiplierPerYear",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "firstKink",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "secondKink",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBorrowRate",
    inputs: [
      {
        name: "cash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrows",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserves",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getSupplyRate",
    inputs: [
      {
        name: "cash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrows",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserves",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveFactorMantissa",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getUtilization",
    inputs: [
      {
        name: "cash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrows",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserves",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "kinks",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "multipliers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "NewInterestParams",
    inputs: [
      {
        name: "baseRatePerSecond",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "multiplierPerSecond",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "firstJumpMultiplierPerSecond",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "secondJumpMultiplierPerSecond",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "firstKink",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "secondKink",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidKinkOrMultiplierOrder",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMultiplierForNonZeroBaseRate",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidPermission",
    inputs: [],
  },
  {
    type: "error",
    name: "NestedPermissionDenied",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "PermissionDenied",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroValue",
    inputs: [],
  },
] as const;
