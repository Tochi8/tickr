"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContract,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits, parseUnits } from "viem";
import { getDataSuffix } from "../lib/builderCode";
import { aerodromeUrl, basescanTx } from "../lib/swap";
import { ERC20_ABI, STOCKS, USDC } from "../lib/tokens";
import StockBalance from "./StockBalance";

const SITE = "https://tickr-base.vercel.app";
const METAMASK_DAPP = `https://metamask.app.link/dapp/${SITE.replace("https://", "")}`;
const COINBASE_DAPP = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(SITE)}`;

function formatToken(value, decimals, digits = 4) {
  if (value === undefined || value === null) return "—";
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function App() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [hasProvider, setHasProvider] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [stockSymbol, setStockSymbol] = useState("NVDAc");
  const [amount, setAmount] = useState("5");
  const [eligible, setEligible] = useState(false);
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoting, setQuoting] = useState(false);

  useEffect(() => {
    setHasProvider(typeof window !== "undefined" && Boolean(window.ethereum));
  }, []);

  const stock = useMemo(
    () => STOCKS.find((s) => s.symbol === stockSymbol) || STOCKS[0],
    [stockSymbol]
  );

  const ethBalance = useBalance({ address, chainId: base.id });
  const usdcBalance = useReadContract({
    address: USDC.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address) },
  });

  const { writeContractAsync, data: approveHash, isPending: isApproving } =
    useWriteContract();
  const { sendTransactionAsync, data: swapHash, isPending: isSwapping } =
    useSendTransaction();

  const pendingHash = swapHash || approveHash;
  const receipt = useWaitForTransactionReceipt({ hash: pendingHash });
  const wrongNetwork = isConnected && chainId !== base.id;

  async function handleConnect(connector) {
    setConnectError("");
    if (!window.ethereum) {
      setConnectError(
        "No wallet in this browser. Open Tickr inside MetaMask or Coinbase Wallet."
      );
      return;
    }
    try {
      await connect({ connector, chainId: base.id });
    } catch (error) {
      setConnectError(error?.shortMessage || error?.message || "Connect failed");
    }
  }

  async function handleQuote() {
    setQuoteError("");
    setQuote(null);
    if (!address) return;
    if (!eligible) {
      setQuoteError("Confirm you are an eligible non-US user first.");
      return;
    }
    let sellAmount;
    try {
      sellAmount = parseUnits(amount || "0", USDC.decimals).toString();
    } catch {
      setQuoteError("Enter a valid USDC amount.");
      return;
    }
    if (sellAmount === "0") {
      setQuoteError("Amount must be greater than 0.");
      return;
    }
    setQuoting(true);
    try {
      const res = await fetch(
        `/api/quote?buyToken=${stock.address}&sellAmount=${sellAmount}&taker=${address}`
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "missing_key") {
          setQuoteError("In-app quote needs a 0x key. Use Open Aerodrome for a live swap.");
        } else {
          setQuoteError(data.detail || data.error || "Quote failed");
        }
        return;
      }
      setQuote(data);
    } catch (error) {
      setQuoteError(error.message || "Quote failed");
    } finally {
      setQuoting(false);
    }
  }

  async function handleSwap() {
    if (!quote?.transaction) {
      setQuoteError("Get a quote first, or swap on Aerodrome.");
      return;
    }
    const tx = quote.transaction;
    const spender = quote.allowanceTarget || tx.to;
    const sellAmount = quote.sellAmount || parseUnits(amount, USDC.decimals).toString();
    if (spender) {
      await writeContractAsync({
        address: USDC.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spender, BigInt(sellAmount)],
        chainId: base.id,
        dataSuffix: getDataSuffix(),
      });
    }
    await sendTransactionAsync({
      to: tx.to,
      data: tx.data,
      value: tx.value ? BigInt(tx.value) : undefined,
      chainId: base.id,
      dataSuffix: getDataSuffix(),
    });
  }

  return (
    <main className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">Tickr · Base · Coinbase Tokenized Stocks</p>
          <h1>Tickr</h1>
          <p className="lede">
            Buy fractional NVIDIA, Apple, Meta, or Alphabet with USDC from a
            self-custody wallet. Eligible non-US users only.
          </p>
        </div>
        {isConnected && (
          <div className="wallet">
            <p className="addr">
              {address.slice(0, 6)}…{address.slice(-4)}
            </p>
            <button className="btn ghost" onClick={() => disconnect()}>
              Disconnect
            </button>
          </div>
        )}
      </header>

      <div className="banner">
        Coinbase Tokenized Stocks are offered to eligible persons outside the
        United States. Tickr does not onboard US users and is not a broker.
        Verify contract addresses on{" "}
        <a href="https://www.base.org/stocks" target="_blank" rel="noreferrer">
          base.org/stocks
        </a>
        .
      </div>

      {!isConnected && (
        <section className="card gate">
          <h2>Sign in with a wallet</h2>
          <p className="lede">
            Balances and buying unlock after you connect on Base. Safari and Chrome
            on iPhone do not contain a wallet — open this site inside MetaMask or
            Coinbase Wallet.
          </p>
          {hasProvider ? (
            <div className="actions">
              {connectors.map((c) => (
                <button
                  key={c.uid}
                  className="btn primary"
                  disabled={isConnecting}
                  onClick={() => handleConnect(c)}
                >
                  {isConnecting ? "Connecting…" : `Connect ${c.name}`}
                </button>
              ))}
            </div>
          ) : (
            <div className="actions">
              <a className="btn primary" href={METAMASK_DAPP}>
                Open in MetaMask
              </a>
              <a className="btn" href={COINBASE_DAPP}>
                Open in Coinbase Wallet
              </a>
            </div>
          )}
          {connectError && <p className="err">{connectError}</p>}
        </section>
      )}

      {wrongNetwork && (
        <div className="banner warn">
          Wallet is not on Base.
          <button className="btn small" onClick={() => switchChain({ chainId: base.id })}>
            Switch to Base
          </button>
        </div>
      )}

      {isConnected && (
        <section className="grid">
          <div className="card">
            <h2>Balances</h2>
            <ul className="balances">
              <li>
                <span>ETH (gas)</span>
                <strong>
                  {ethBalance.data ? formatToken(ethBalance.data.value, 18, 5) : "—"}
                </strong>
              </li>
              <li>
                <span>USDC</span>
                <strong>
                  {usdcBalance.data !== undefined
                    ? formatToken(usdcBalance.data, USDC.decimals, 2)
                    : "—"}
                </strong>
              </li>
              {STOCKS.map((item) => (
                <StockBalance key={item.symbol} stock={item} address={address} />
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Buy with USDC</h2>
            <div className="picks">
              {STOCKS.map((item) => (
                <button
                  key={item.symbol}
                  className={item.symbol === stock.symbol ? "chip on" : "chip"}
                  onClick={() => {
                    setStockSymbol(item.symbol);
                    setQuote(null);
                  }}
                >
                  {item.symbol}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <label className="field">
              Amount (USDC)
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="5"
              />
            </label>
            <div className="presets">
              {["1", "5", "10"].map((v) => (
                <button key={v} className="chip" onClick={() => setAmount(v)}>
                  ${v}
                </button>
              ))}
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={eligible}
                onChange={(e) => setEligible(e.target.checked)}
              />
              I am not a US person and I am in an eligible jurisdiction.
            </label>
            <div className="actions">
              <button className="btn" onClick={handleQuote} disabled={quoting}>
                {quoting ? "Quoting…" : "Get quote"}
              </button>
              <button
                className="btn primary"
                onClick={handleSwap}
                disabled={!quote || isApproving || isSwapping}
              >
                {isApproving || isSwapping ? "Confirm in wallet…" : `Buy ${stock.symbol}`}
              </button>
              <a className="btn ghost" href={aerodromeUrl(stock.address)} target="_blank" rel="noreferrer">
                Open Aerodrome
              </a>
            </div>
            {quoteError && <p className="err">{quoteError}</p>}
            {quote?.buyAmount && (
              <p className="ok">
                Quote: you send {formatToken(BigInt(quote.sellAmount || "0"), 6, 2)} USDC
                for about {formatToken(BigInt(quote.buyAmount), stock.decimals, 6)}{" "}
                {stock.symbol}
              </p>
            )}
            {pendingHash && (
              <p className="ok">
                Tx submitted:{" "}
                <a href={basescanTx(pendingHash)} target="_blank" rel="noreferrer">
                  {pendingHash.slice(0, 10)}…
                </a>
                {receipt.isLoading ? " · waiting" : receipt.isSuccess ? " · confirmed" : ""}
              </p>
            )}
          </div>
        </section>
      )}

      <footer className="foot">
        <p>
          Official contracts only. Not investment advice. Availability, rights, and
          features vary by jurisdiction.
        </p>
      </footer>
    </main>
  );
}
