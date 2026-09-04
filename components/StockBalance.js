"use client";

import { useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { ERC20_ABI } from "../lib/tokens";
import { basescanToken } from "../lib/swap";
import StockMark from "./StockMark";

function formatToken(value, decimals, digits = 6) {
  if (value === undefined || value === null) return "—";
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatChange(change) {
  if (typeof change !== "number" || !Number.isFinite(change)) return null;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export default function StockBalance({ stock, address, change24h }) {
  const { data } = useReadContract({
    address: stock.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address) },
  });

  const label = formatChange(change24h);
  const tone = typeof change24h === "number" ? (change24h > 0 ? "up" : change24h < 0 ? "down" : "flat") : "";

  return (
    <li>
      <span className="asset">
        <StockMark symbol={stock.symbol} />
        {stock.symbol}
        <a className="tiny" href={basescanToken(stock.address)} target="_blank" rel="noreferrer">token</a>
      </span>
      <span className="bal-right">
        <strong>{formatToken(data, stock.decimals, 6)}</strong>
        {label ? <span className={`chg ${tone}`}>{label}</span> : <span className="chg flat">—</span>}
      </span>
    </li>
  );
}
