"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useReadContract,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import {
  aerodromeUrl,
  coinbaseDappUrl,
  isMobileBrowser,
  metamaskDappUrl,
} from "../lib/swap";
import { fetchStockMoves } from "../lib/prices";
import { ERC20_ABI, STOCKS, USDC } from "../lib/tokens";
import ConnectModal from "./ConnectModal";
import StockBalance from "./StockBalance";
import StockMark from "./StockMark";

function formatToken(value, decimals, digits = 4) {
  if (value === undefined || value === null) return "—";
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function App() {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [openConnect, setOpenConnect] = useState(false);
  const [stockSymbol, setStockSymbol] = useState("NVDAc");
  const [amount, setAmount] = useState("5");
  const [eligible, setEligible] = useState(false);
  const [hint, setHint] = useState("");
  const [moves, setMoves] = useState({});

  const stock = useMemo(
    () => STOCKS.find((s) => s.symbol === stockSymbol) || STOCKS[0],
    [stockSymbol]
  );

  useEffect(() => {
    let live = true;
    fetchStockMoves().then((data) => {
      if (live) setMoves(data);
    });
    const id = setInterval(() => {
      fetchStockMoves().then((data) => {
        if (live) setMoves(data);
      });
    }, 60_000);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  const ethBalance = useBalance({ address, chainId: base.id });
  const usdcBalance = useReadContract({
    address: USDC.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address) },
  });

  const wrongNetwork = isConnected && chainId !== base.id;
  const swapUrl = aerodromeUrl(stock.address);
  const mobile = isMobileBrowser();

  function startBuy(kind) {
    setHint("");
    if (!eligible) {
      setHint("Confirm you are an eligible non-US user first.");
      return;
    }
    if (kind === "metamask") {
      window.location.href = metamaskDappUrl(swapUrl);
      return;
    }
    if (kind === "coinbase") {
      window.location.href = coinbaseDappUrl(swapUrl);
      return;
    }
    window.open(swapUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="shell">
      <nav className="nav">
        <a className="brand" href="#top">
          <span className="logo-wrap">
            <img className="logo" src="/tickr-logo.JPG" alt="Tickr" width="48" height="48" />
          </span>
          Tickr
        </a>
        {!isConnected && (
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
          </div>
        )}
        {isConnected ? (
          <div className="wallet">
            <p className="addr">{address.slice(0, 6)}…{address.slice(-4)}</p>
            <button className="btn ghost nav-cta" onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button className="btn primary nav-cta" onClick={() => setOpenConnect(true)}>
            Connect wallet
          </button>
        )}
      </nav>

      {!isConnected && (
        <>
          <section className="hero" id="top">
            <p className="eyebrow">Tickr · Base · Coinbase Tokenized Stocks</p>
            <h1>Buy the <span className="stock-word">stocks</span> you already know, onchain.</h1>
            <p className="lede hero-lede">
              Eligible non-US users can buy fractional NVIDIA, Apple, Meta, and
              Alphabet with USDC from a self-custody wallet.
            </p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => setOpenConnect(true)}>Get started</button>
              <a className="btn ghost" href="#how">See how it works</a>
            </div>
            <div className="hero-stage">
              <article className="float-card c1">
                <p className="float-kicker">Balances</p>
                <p>USDC <strong>48.50</strong></p>
                <p>NVDAc <strong>0.028</strong></p>
              </article>
              <article className="float-card c2">
                <p className="float-kicker">Buy with USDC</p>
                <div className="mini-picks">
                  {STOCKS.slice(0, 3).map((item) => (
                    <span key={item.symbol} className={item.symbol === "NVDAc" ? "chip on chip-row" : "chip chip-row"}>
                      <StockMark symbol={item.symbol} />{item.symbol}
                    </span>
                  ))}
                </div>
                <button className="btn primary mini" type="button">Buy NVDAc</button>
              </article>
              <article className="float-card c3">
                <p className="float-kicker">On Base</p>
                <p>Official B20 contracts. Not a broker.</p>
              </article>
            </div>
          </section>

          <section className="features" id="features">
            <article className="feature">
              <h3>Self-custody</h3>
              <p>Connect MetaMask or Coinbase Wallet. Tickr never holds your keys.</p>
            </article>
            <article className="feature">
              <h3>Official tokens</h3>
              <p>NVDAc, AAPLc, METAc, and GOOGLc from Coinbase Tokenized Stocks on Base.</p>
            </article>
            <article className="feature">
              <h3>Routed swap</h3>
              <p>Tickr picks the Base pair. Aerodrome processes the buy in your wallet.</p>
            </article>
          </section>

          <section className="how" id="how">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Three steps to a first fill</h2>
            </div>
            <ol className="steps">
              <li><strong>Connect</strong> a wallet on Base.</li>
              <li><strong>Pick</strong> a stock and a USDC amount.</li>
              <li><strong>Buy</strong> on Aerodrome, opened from Tickr with the pair set.</li>
            </ol>
          </section>

          <div className="banner">
            Coinbase Tokenized Stocks are offered to eligible persons outside the
            United States. Tickr does not onboard US users and is not a broker.
            Verify contract addresses on{" "}
            <a href="https://www.base.org/stocks" target="_blank" rel="noreferrer">base.org/stocks</a>.
          </div>
        </>
      )}

      {wrongNetwork && (
        <div className="banner warn">
          Wallet is not on Base.
          <button className="btn small" onClick={() => switchChain({ chainId: base.id })}>Switch to Base</button>
        </div>
      )}

      {isConnected && (
        <>
          <header className="desk-head">
            <div>
              <p className="eyebrow">Desk</p>
              <h1>Buy with USDC</h1>
            </div>
          </header>
          <div className="banner">
            Coinbase Tokenized Stocks are offered to eligible persons outside the
            United States. Tickr does not onboard US users and is not a broker.
            Verify contract addresses on{" "}
            <a href="https://www.base.org/stocks" target="_blank" rel="noreferrer">base.org/stocks</a>.
          </div>
          <section className="grid">
            <div className="card">
              <h2>Balances</h2>
              <ul className="balances">
                <li><span>ETH (gas)</span><strong>{ethBalance.data ? formatToken(ethBalance.data.value, 18, 5) : "—"}</strong></li>
                <li><span>USDC</span><strong>{usdcBalance.data !== undefined ? formatToken(usdcBalance.data, USDC.decimals, 2) : "—"}</strong></li>
                {STOCKS.map((item) => (
                  <StockBalance
                    key={item.symbol}
                    stock={item}
                    address={address}
                    change24h={moves[item.symbol]}
                  />
                ))}
              </ul>
            </div>
            <div className="card">
              <h2>Buy with USDC</h2>
              <div className="picks">
                {STOCKS.map((item) => (
                  <button key={item.symbol} className={item.symbol === stock.symbol ? "chip on chip-row" : "chip chip-row"} onClick={() => setStockSymbol(item.symbol)}>
                    <StockMark symbol={item.symbol} />
                    <span className="chip-copy">
                      {item.symbol}
                      <span>{item.name}</span>
                    </span>
                  </button>
                ))}
              </div>
              <label className="field">Amount (USDC)
                <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="5" />
              </label>
              <div className="presets">
                {["1", "5", "10"].map((v) => (
                  <button key={v} className="chip" onClick={() => setAmount(v)}>${v}</button>
                ))}
              </div>
              <label className="check">
                <input type="checkbox" checked={eligible} onChange={(e) => setEligible(e.target.checked)} />
                I am not a US person and I am in an eligible jurisdiction.
              </label>
              <p className="ok">
                Tickr sets USDC → {stock.symbol} on Base. Aerodrome runs the swap in your wallet.
              </p>
              <div className="actions">
                {mobile ? (
                  <>
                    <button className="btn primary" onClick={() => startBuy("metamask")}>
                      Buy {stock.symbol} in MetaMask
                    </button>
                    <button className="btn" onClick={() => startBuy("coinbase")}>
                      Buy {stock.symbol} in Coinbase Wallet
                    </button>
                  </>
                ) : (
                  <button className="btn primary" onClick={() => startBuy("web")}>
                    Buy {stock.symbol} on Aerodrome
                  </button>
                )}
              </div>
              {hint && <p className="err">{hint}</p>}
            </div>
          </section>
        </>
      )}

      <footer className="foot">
        <p>© 2026 Tickr. All rights reserved.</p>
        <p>Official contracts only. Not investment advice. Availability, rights, and features vary by jurisdiction.</p>
      </footer>
      {openConnect && !isConnected && <ConnectModal onClose={() => setOpenConnect(false)} />}
    </main>
  );
}
