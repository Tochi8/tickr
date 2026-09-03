"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Injected only. The coinbaseWallet connector pulls @base-org/account
// → @coinbase/cdp-sdk → @x402/* which Next cannot resolve on Vercel.
// MetaMask, Rabby, and Coinbase Wallet extension all work as injected.
export const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
      target: "metaMask",
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"),
  },
  ssr: true,
});
