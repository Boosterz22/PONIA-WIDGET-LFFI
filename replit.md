# Overview

PONIA is a cross-chain cryptocurrency payment widget designed for Web3 applications (gaming dApps, NFT marketplaces, crypto casinos, DeFi platforms). It enables instant deposits/withdrawals across multiple blockchains, allowing users to top-up accounts with any crypto from any supported chain without external conversions. The business model involves a 1.5% fee on every cross-chain transaction. It integrates Reown AppKit for professional wallet connection (300+ wallets) and deBridge for instant cross-chain bridging (~2 second transfers). The project aims to provide a professional, self-service solution for Web3 apps needing cross-chain payment functionality, supporting 10 major chains including EVM networks, Solana, and TRON.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Multi-Page Application

PONIA utilizes a multi-page structure with a landing page (`/`), a widget demo (`/widget`), and comprehensive documentation (`/docs`). The landing page focuses on marketing with features and use cases, the widget page hosts the functional payment widget, and the documentation provides self-service integration guides for developers.

## User Interface (UI/UX)

The widget features a modern, professional design with a 3-stage user flow (selection, processing, success). Key UI elements include:
- Animated gradient background on the landing page.
- Stats bar and feature highlights.
- Visual chain selection with logos for 10 supported blockchains (8 EVM + Solana + TRON).
- Token selector for Native, USDC, and USDT with smart availability.
- Transparent fee breakdown showing PONIA's 1.5% fee, total debited, and expected output.
- Professional branding with a black/yellow color scheme.

## Technical Implementations

- **Frontend:** Single-Page Application (SPA) architecture using Vanilla JavaScript (ES6+) with ES modules, built with Vite for fast development and optimized builds.
- **Wallet Integration:** Reown AppKit 1.8.x is used for universal wallet connectivity (300+ wallets) and integrates with `ethers.js` via `Reown AppKit Ethers Adapter`.
- **Cross-Chain Bridging:** deBridge is the sole bridging solution, offering instant (~2 second) transfer speeds with Zero-TVL architecture for maximum security. PONIA integrates its 1.5% transaction fee directly into the quote.
- **Supported Chains:** Currently supports 10 major blockchains: 8 EVM chains (Ethereum, Polygon, Arbitrum, Base, Optimism, BNB Chain, zkSync, World Chain) plus Solana and TRON for broader market coverage.
- **Token Support:** Comprehensive support for native tokens, USDC (on 7 chains), and USDT (on 6 chains), with automatic mapping of correct token addresses and decimal handling.
- **Platform Chain Detection:** The widget can auto-detect the target blockchain or be configured via URL parameters.

# External Dependencies

## Third-Party Libraries

- **Reown AppKit (`@reown/appkit`):** Universal wallet connection.
- **Reown AppKit Ethers Adapter (`@reown/appkit-adapter-ethers`):** Bridge between AppKit and `ethers.js`.
- **ethers.js (`ethers`):** Ethereum library for blockchain interactions.
- **React & React-DOM:** Peer dependencies for Reown AppKit's UI components.
- **Vite (`vite`):** Development server and build tool.

## External APIs

- **deBridge API (`https://dln.debridge.finance/v1.0/`):** Used for cross-chain bridge quotes and transaction generation with instant execution via Zero-TVL model.

## Browser APIs

- **Window.ethereum:** For detecting and interacting with MetaMask and compatible EVM wallets.
- **Window.solana:** For detecting and interacting with Solana wallets like Phantom.