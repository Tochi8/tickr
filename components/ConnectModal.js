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

function BrowserLogo() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1d4ed8" />
      <path d="M8 12h16v2H8zm0 4h16v8H8z" fill="#fff" />
      <circle cx="12" cy="20" r="1.2" fill="#1d4ed8" />
    </svg>
  );
}

function MetaMaskLogo() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#f6851b" />
      <path fill="#e2761b" d="M16.2 7.2 9 12.4l2.6 6.2 1.5-1.3 2.3 1.8 2.3-1.8 1.5 1.3 2.6-6.2-7.2-5.2z" />
      <path fill="#fff" d="M12.8 17.2 11.6 21l2.6-1.6zm6.4 0L17.8 19.4 20.4 21z" />
      <path fill="#c0ad9e" d="M13.2 20.2 16 18.6l2.8 1.6-1.1 2.2h-3.4z" />
    </svg>
  );
}

function CoinbaseLogo() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0052ff" />
      <circle cx="16" cy="16" r="8" fill="#fff" />
      <circle cx="16" cy="16" r="3.2" fill="#0052ff" />
    </svg>
  );
}

function PlusLogo() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#111" />
      <path d="M15 9h2v14h-2zM9 15h14v2H9z" fill="#fff" />
    </svg>
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
          <span className="wallet-logo"><BrowserLogo /></span>
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
          <span className="wallet-logo"><MetaMaskLogo /></span>
          MetaMask
        </a>
        <a className="wallet-row" href={LINKS.coinbaseApp}>
          <span className="wallet-logo"><CoinbaseLogo /></span>
          Coinbase Wallet
        </a>
        <a className="wallet-row" href={LINKS.metamaskInstall} target="_blank" rel="noreferrer">
          <span className="wallet-logo"><PlusLogo /></span>
          Get a wallet
        </a>
        {error && <p className="err">{error}</p>}
        <p className="modal-note">
          On iPhone, open Tickr inside MetaMask or Coinbase Wallet. On desktop,
          install an extension, then use Browser Wallet.
        </p>
        <button type="button" className="modal-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
