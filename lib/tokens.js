export const BASE_CHAIN_ID = 8453;

export const USDC = {
  symbol: "USDC",
  name: "USD Coin",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
};

// Official Coinbase Tokenized Stocks (B20) on Base.
// Source of truth: https://www.base.org/stocks
export const STOCKS = [
  {
    symbol: "NVDAc",
    name: "NVIDIA",
    address: "0xb20000000000000000000078ee7ce2fE4908108C",
    decimals: 18,
  },
  {
    symbol: "AAPLc",
    name: "Apple",
    address: "0xb200000000000000000000C2e324d24d7eEcd1fb",
    decimals: 18,
  },
  {
    symbol: "METAc",
    name: "Meta",
    address: "0xb2000000000000000000008bC8786B856E61707C",
    decimals: 18,
  },
  {
    symbol: "GOOGLc",
    name: "Alphabet",
    address: "0xb2000000000000000000002D0BA3164cc74f58B7",
    decimals: 18,
  },
];

export const REGISTRY = "0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD";

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];
