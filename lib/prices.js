import { STOCKS } from "./tokens";

const DEX = "https://api.dexscreener.com/latest/dex/tokens";

function pickPair(pairs, tokenAddress) {
  const list = (pairs || []).filter((p) => {
    const base = p.chainId === "base" || p.chainId === "8453";
    const match =
      p.baseToken?.address?.toLowerCase() === tokenAddress.toLowerCase() ||
      p.quoteToken?.address?.toLowerCase() === tokenAddress.toLowerCase();
    return base && match;
  });
  if (!list.length) return null;
  return list.sort((a, b) => Number(b.liquidity?.usd || 0) - Number(a.liquidity?.usd || 0))[0];
}

export async function fetchStockMoves() {
  const moves = {};
  await Promise.all(
    STOCKS.map(async (stock) => {
      try {
        const res = await fetch(`${DEX}/${stock.address}`);
        if (!res.ok) return;
        const json = await res.json();
        const pair = pickPair(json.pairs, stock.address);
        const change = pair?.priceChange?.h24;
        if (typeof change === "number" && Number.isFinite(change)) {
          moves[stock.symbol] = change;
        }
      } catch {
        // leave row without a %
      }
    })
  );
  return moves;
}
