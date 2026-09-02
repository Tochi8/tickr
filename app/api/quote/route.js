import { NextResponse } from "next/server";
import { USDC } from "../../../lib/tokens";

const ZEROX_BASE = "https://api.0x.org/swap/allowance-holder";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const buyToken = searchParams.get("buyToken");
  const sellAmount = searchParams.get("sellAmount");
  const taker = searchParams.get("taker");

  if (!buyToken || !sellAmount || !taker) {
    return NextResponse.json(
      { error: "buyToken, sellAmount, and taker are required" },
      { status: 400 }
    );
  }

  const apiKey =
    process.env.ZEROEX_API_KEY || process.env.NEXT_PUBLIC_ZEROEX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "missing_key" }, { status: 501 });
  }

  const params = new URLSearchParams({
    chainId: "8453",
    sellToken: USDC.address,
    buyToken,
    sellAmount,
    taker,
  });

  const res = await fetch(`${ZEROX_BASE}/quote?${params.toString()}`, {
    headers: {
      "0x-api-key": apiKey,
      "0x-version": "v2",
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "quote_failed", detail: text },
      { status: res.status }
    );
  }

  return NextResponse.json(JSON.parse(text));
}
