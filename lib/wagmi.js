"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected({ shimDisconnect: true }),
];

if (projectId) {
  connectors.push(
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "Tickr",
        description: "Buy Coinbase Tokenized Stocks on Base",
        url: "https://tickr-base.vercel.app",
        icons: ["https://tickr-base.vercel.app/favicon.ico"],
      },
    })
  );
}

export const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"),
  },
  ssr: true,
});
