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

export default function StockBalance({ stock, address }) {
  const { data } = useReadContract({
    address: stock.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address) },
  });

  return (
    <li>
      <span className="asset">
        <StockMark symbol={stock.symbol} />
        {stock.symbol}
        <a className="tiny" href={basescanToken(stock.address)} target="_blank" rel="noreferrer">token</a>
      </span>
      <strong>{formatToken(data, stock.decimals, 6)}</strong>
    </li>
  );
}
