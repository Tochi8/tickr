# Tickr

Buy Coinbase Tokenized Stocks on Base with USDC — from a self-custody wallet.

Tickr is a JavaScript app for the Base Builder Quest. It helps eligible **non-US** users trade or use [Coinbase Tokenized Stocks](https://www.base.org/stocks) (`NVDAc`, `AAPLc`, `METAc`, `GOOGLc`).

Repo: https://github.com/Tochi8/tickr

## Stack

- Next.js 15 (App Router, JavaScript)
- wagmi + viem
- Optional 0x Swap API for in-app quotes
- Aerodrome deep link as the no-key live swap path

## Quick start

```bash
npm install
cp .env.example .env.local
# add NEXT_PUBLIC_BUILDER_CODE from https://base.dev
npm run dev
```

Open http://localhost:3000

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BUILDER_CODE` | Yes for attribution | base.dev Builder Code |
| `ZEROEX_API_KEY` | No | In-app quote + swap via `/api/quote` |
| `NEXT_PUBLIC_BASE_RPC` | No | Custom Base RPC |

Without a 0x key the UI still works: connect, see balances, and **Open Aerodrome** to complete a real swap for the Loom.

## Official token addresses

Re-check on https://www.base.org/stocks before any mainnet transaction.

- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- NVDAc: `0xb20000000000000000000078ee7ce2fE4908108C`
- AAPLc: `0xb200000000000000000000C2e324d24d7eEcd1fb`
- METAc: `0xb2000000000000000000008bC8786B856E61707C`
- GOOGLc: `0xb2000000000000000000002D0BA3164cc74f58B7`

## Deploy

1. Import [Tochi8/tickr](https://github.com/Tochi8/tickr) in [Vercel](https://vercel.com)
2. Add env vars
3. Deploy
4. Use the `*.vercel.app` URL on the quest form

## Quest submission

- Form: https://docs.google.com/forms/d/e/1FAIpQLSfru57ZLO9AQ-hgWX_G5ZAzmAKkzFLZCyqe5wTyBSwACFX5tg/viewform
- Record a Loom, post on X tagging `@buildonbase`
- Deadline: 9 Sep 2026, 11:59pm EST
- Do **not** enable trading for US users

## Compliance

Coinbase Tokenized Stocks are only available to eligible persons outside the United States. Tickr is not a broker and is not investment advice.
