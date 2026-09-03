"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Injected only. Do not import walletConnect or coinbaseWallet — both pull
// optional packages that Next cannot resolve on Vercel.
export const config = createConfig({
  chains: [base],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"),
  },
  ssr: true,
});
