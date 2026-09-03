"use client";

import { useConnect } from "wagmi";
import { base } from "wagmi/chains";

const SITE_HOST = "tickr-base.vercel.app";
const SITE = `https://${SITE_HOST}`;

const LINKS = {
  metamask: {
    app: `https://metamask.app.link/dapp/${SITE_HOST}`,
    install: "https://metamask.io/download/",
  },
  coinbase: {
    app: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(SITE)}`,
    install: "https://www.coinbase.com/wallet/downloads",
  },
};

export default function ConnectModal({ onClose }) {
  const { connectors, connect, isPending } = useConnect();
  const injected = connectors.find((c) => c.id === "injected");
  const wc = connectors.find((c) => c.id === "walletConnect");
  const hasEthereum = typeof window !== "undefined" && Boolean(window.ethereum);

  async function connectInjected() {
    if (!injected) return;
    if (!hasEthereum) {
      window.open(LINKS.metamask.install, "_blank", "noopener");
      return;
    }
    await connect({ connector: injected, chainId: base.id });
    onClose();
  }

  async function connectWc() {
    if (!wc) {
      window.open("https://metamask.io/download/", "_blank", "noopener");
      return;
    }
    await connect({ connector: wc, chainId: base.id });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="modal-kicker">You'll need an Ethereum wallet to continue.</p>
        <button className="wallet-row" onClick={connectInjected} disabled={isPending}>
          <span className="wallet-icon">◉</span>
          Browser Wallet
        </button>
        <button className="wallet-row" onClick={connectWc} disabled={isPending}>
          <span className="wallet-icon">WC</span>
          WalletConnect
        </button>
        <a className="wallet-row" href={hasEthereum ? undefined : LINKS.coinbase.app} onClick={async (e) => {
          if (hasEthereum) {
            e.preventDefault();
            await connectInjected();
          }
        }}>
          <span className="wallet-icon">CB</span>
          Coinbase Wallet
        </a>
        <a className="wallet-row" href={hasEthereum ? undefined : LINKS.metamask.app} onClick={async (e) => {
          if (hasEthereum) {
            e.preventDefault();
            await connectInjected();
          }
        }}>
          <span className="wallet-icon">MM</span>
          MetaMask
        </a>
        <p className="modal-note">
          No wallet yet? MetaMask or Coinbase Wallet will open the install page.
          WalletConnect shows a QR you scan with any wallet app.
        </p>
        <button className="btn ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
