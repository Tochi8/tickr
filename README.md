# Tickr

Tickr is a web app for buying Coinbase Tokenized Stocks on Base.

You connect a self-custody wallet, pick a name you already know (NVDAc, AAPLc, METAc, GOOGLc), and buy it with USDC on Base. Tickr is the desk in front of the chain. The swap itself is completed on Base through the connected wallet.

Live: [tickr-base.vercel.app](https://tickr-base.vercel.app)

## What problem it solves

Most people who want exposure to names like Nvidia or Apple do not want to learn a DEX from scratch.

Tickr gives them:

- A simple place to see those tokenized stocks on Base
- Wallet connect that works from a browser wallet or from MetaMask / Coinbase Wallet on mobile
- Balances for USDC and the stocks they already hold
- A path to get a quote and complete a buy without hunting pool links by hand

Tickr is not a broker and not investment advice. Coinbase Tokenized Stocks are only for eligible people outside the United States.

## How to use the platform

1. Open [tickr-base.vercel.app](https://tickr-base.vercel.app).
2. Tap **Connect wallet**.
3. On desktop, use **Browser Wallet** if MetaMask, Rabby, or Coinbase Wallet is installed in the browser.
4. On iPhone, open the site inside the MetaMask or Coinbase Wallet in-app browser, then connect.
5. Confirm you are on **Base**.
6. Pick a stock (NVDAc, AAPLc, METAc, or GOOGLc).
7. Check your USDC balance. You need USDC on Base to buy.
8. Get a quote or continue to the buy flow for that stock.
9. Approve the transaction in your wallet and wait for confirmation.
10. The new stock balance shows on Tickr after the transaction lands.

If you have no wallet yet, use **Get a wallet**, install MetaMask or Coinbase Wallet, then come back.

## Tech stack

- JavaScript
- Next.js 15 (App Router)
- React 19
- wagmi and viem for wallet connect, Base chain, and balances
- TanStack Query
- Vercel for hosting

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
