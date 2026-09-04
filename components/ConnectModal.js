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

function BrowserMark() {
  return (
    <span className="wallet-logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="28" height="28">
        <rect width="32" height="32" rx="8" fill="#1d4ed8" />
        <rect x="6" y="8" width="20" height="16" rx="3" fill="#fff" />
        <rect x="6" y="8" width="20" height="5" rx="3" fill="#93c5fd" />
        <circle cx="9.5" cy="10.5" r="1" fill="#1d4ed8" />
        <circle cx="13" cy="10.5" r="1" fill="#1d4ed8" />
      </svg>
    </span>
  );
}

function WalletMark({ src, alt }) {
  return (
    <span className="wallet-logo">
      <img src={src} alt={alt} width={28} height={28} />
    </span>
  );
}

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
          <BrowserMark />
          Browser Wallet
        </button>
        <a
          className="wallet-row"
          href={hasEthereum ? undefined : LINKS.metamaskApp}
          onClick={(e) => {
            if (hasEthereum) {
              e.preventDefault();
              connectBrowser();
            }
          }}
        >
          <WalletMark src="/wallets/metamask.svg" alt="MetaMask" />
          MetaMask
        </a>
        <a className="wallet-row" href={LINKS.coinbaseApp}>
          <WalletMark src="/wallets/coinbase.svg" alt="Coinbase Wallet" />
          Coinbase Wallet
        </a>
        <a className="wallet-row" href={LINKS.metamaskInstall} target="_blank" rel="noreferrer">
          <span className="wallet-logo wallet-logo-plus" aria-hidden="true">+</span>
          Get a wallet
        </a>
        {error && <p className="err">{error}</p>}
        <p className="modal-note">
          Browser Wallet uses whatever wallet is already installed in this browser.
          On iPhone, open Tickr inside MetaMask or Coinbase Wallet.
        </p>
        <button type="button" className="modal-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
