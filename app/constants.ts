// Scope to swap directory for now

export const CHAIN_IDS: Record<string, number> = {
  mainnet: 1,
  ethereum: 1,
  polygon: 142,
};

export const ENDPOINTS: Record<number, string> = {
  1: "https://api.0x.org",
  142: "https://polygon-api.matcha.0x.org",
};

interface ITokenDetail {
  chainId?: number;
  decimal: number;
  address?: string;
}

export const TOKENS: Record<string, ITokenDetail> = {
  zrx: {
    decimal: 18,
    chainId: 1,
    address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
  },
  "1inch": { decimal: 18 },
  bal: { decimal: 18 },
  bnt: { decimal: 18 },
  crv: { decimal: 18 },
  comp: { decimal: 18 },
  dai: {
    decimal: 18,
    chainId: 1,
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  ens: { decimal: 18 },
  /**
   * Investigate. Seems like passing symbols work for all ERC-20 tokens, except for `link`.
   * However, passing it's contract address (Polygon network) _does_ work.
   * Maybe bug with 0x API? Should investigate and maybe submit a juicy juicy fix.
   */
  link: { decimal: 18 },
  aave: { decimal: 18 },
  sushi: { decimal: 18 },
  sos: { decimal: 18 },
  snx: { decimal: 18 },
  uni: { decimal: 18 },
  usdt: { decimal: 6 },
  usdc: {
    decimal: 6,
    chainId: 1,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  wbtc: { decimal: 8 },
  weth: {
    decimal: 18,
    chainId: 1,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  matic: {
    decimal: 18,
    chainId: 1,
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
};
