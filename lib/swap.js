import { STOCKS, USDC } from "./tokens";

const ZEROX_BASE = "https://api.0x.org/swap/allowance-holder";

export function aerodromeUrl(tokenAddress) {
  return `https://aerodrome.finance/swap?from=${USDC.address}&to=${tokenAddress}&chain=8453`;
}

export function basescanTx(hash) {
  return `https://basescan.org/tx/${hash}`;
}

export function basescanToken(address) {
  return `https://basescan.org/token/${address}`;
}

export function stockBySymbol(symbol) {
  return STOCKS.find((s) => s.symbol === symbol);
}

export async function quoteUsdcToStock({ sellAmount, buyToken, taker }) {
  const apiKey = process.env.NEXT_PUBLIC_ZEROEX_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing_key" };
  }

  const params = new URLSearchParams({
    chainId: "8453",
    sellToken: USDC.address,
    buyToken,
    sellAmount,
    taker,
  });

  const res = await fetch(`${ZEROX_BASE}/quote?${params.toString()}`, {
    headers: { "0x-api-key": apiKey, "0x-version": "v2" },
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, reason: "quote_failed", detail: text };
  }

  const data = await res.json();
  return { ok: true, data };
}
