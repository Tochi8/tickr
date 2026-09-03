"use client";

import { useState } from "react";
import { useConnect } from "wagmi";
import { base } from "wagmi/chains";

const HOST = "tickr-base.vercel.app";
const SITE = `https://${HOST}`;
const LINKS = {
  metamaskApp: `https://metamask.app.link/dapp/${HOST}`,
  metamaskInstall: "https://metamask.io/download/",
  coinbaseApp: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(SITE)}`,
};

export default function ConnectModal({ onClose }) {
  const { connectors, connect, isPending } = useConnect();
  const injected = connectors.find((c) => c.id === "injected") || connectors[0];
  const [error, setError] = useState("");
  const hasEthereum = typeof window !== "undefined" && Boolean(window.ethereum);

  async function connectBrowser() {
    setError("");
    if (!hasEthereum || !injected) {
      window.open(LINKS.metamaskInstall, "_blank", "noopener");
      return;
    }
    try {
      await connect({ connector: injected, chainId: base.id });
      onClose();
    } catch (err) {
      setError(err?.shortMessage || err?.message || "Connect failed");
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="modal-kicker">You will need an Ethereum wallet to continue.</p>
        <button className="wallet-row" onClick={connectBrowser} disabled={isPending}>
          <span className="wallet-icon">W</span>
          Browser Wallet
        </button>
        <a className="wallet-row" href={hasEthereum ? undefined : LINKS.metamaskApp} onClick={(e) => {
          if (hasEthereum) {
            e.preventDefault();
            connectBrowser();
          }
        }}>
          <span className="wallet-icon">M</span>
          MetaMask
        </a>
        <a className="wallet-row" href={LINKS.coinbaseApp}>
          <span className="wallet-icon">C</span>
          Coinbase Wallet
        </a>
        <a className="wallet-row" href={LINKS.metamaskInstall} target="_blank" rel="noreferrer">
          <span className="wallet-icon">+</span>
          Get a wallet
        </a>
        {error && <p className="err">{error}</p>}
        <p className="modal-note">
          On iPhone, open Tickr inside MetaMask or Coinbase Wallet. On desktop,
          install an extension, then use Browser Wallet.
        </p>
        <button className="btn ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
