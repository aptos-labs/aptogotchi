# Aptogotchi (Random mint)

Deployed at https://aptogotchi-random-mint.aptoslabs.com/.

## Difference from main branch (aptogotchi beginner)

A simplified version that uses on chain randomness to determine the look of Aptogotchi at minting instead of manually passing in, and each address can mint as many Aptogotchis as possible instead of 1 per address.

### Prerequisite

You need to switch to [randomnet](https://explorer.aptoslabs.com/?network=randomnet), which is a standalone network different from mainnet and testnet. It has its own chain ID and you need to get randomnet APT.

To add randomnet to your petra wallet, click add network in setting.
Name enters `randomnet`.
Node url enters `https://fullnode.random.aptoslabs.com/v1`.
Faucet url enters `https://faucet.random.aptoslabs.com`.

## Overview

Aptogotchi is a simple and fun full-stack, end-to-end dApp demonstrating the basics of how to build a dApp using Move.

We introduce the following concepts:

1. how to create a full-stack dApp
2. how to connect to smart contracts on the Aptos blockchain
3. how to integrate with Petra Wallet/Explorer/ANS and other services.
4. how to create events and use indexer to get off-chain data.
5. how to write unit tests for the smart contracts.

This dApp will be used as an educational demo hosted on [Builder Hub](https://github.com/aptos-labs/aptos-builder-hub).

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
