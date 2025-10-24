# Overview

PONIA is a cross-chain cryptocurrency payment widget designed for Web3 applications (gaming dApps, NFT marketplaces, crypto casinos, DeFi platforms). It enables instant deposits/withdrawals across multiple blockchains, allowing users to top-up accounts with any crypto from any supported chain without external conversions. The business model involves a 1.5% fee on every cross-chain transaction. It integrates Reown AppKit for professional wallet connection (300+ wallets) and deBridge for instant cross-chain bridging (~43 second transfers). The project aims to provide a professional, self-service solution for Web3 apps needing cross-chain payment functionality, supporting 8 major deBridge-compatible chains including EVM networks, Solana, and TRON.

# Recent Changes

**October 24, 2025:**
- **Production wallet addresses configured:** Set up secure Replit Secrets for fee collection wallets
  - EVM chains (Ethereum, Polygon, Arbitrum, Base, Optimism, BNB Chain): `0x280714ff27a52920bfcb75e2ec61027a93e8e9ac`
  - Solana: `9ZXoZdeR4aNVKmmegyVwfXjkKBG3BCcRXo961aSnD5fT`
  - TRON: `TQG4iEuaS2PEtFvnGGvG5utBbBuFuHSSFR`
- **Professional demo widget for marketing videos:** Created `ponia-demo-widget.html` - cinema-quality simulated version
  - **Lucide Icons integration:** Professional icon library (Send, Git-Branch, Check-Circle) replacing emojis
  - **Golden flash transition:** Smooth radial gradient effect when transitioning from selection to progress screen
  - **Wallet address display:** MetaMask 🦊 + truncated address (0xC7E3...42b9) appears after connection
  - **Multi-stage progress screen:** Dedicated screen showing real-time bridging progress with animated progress bar
  - **Micro-animations:** Each step (Sending → Bridging → Received) lights up with green glow effect on completion
  - **Pulsating success check:** Large checkmark with breathing animation and "🎉 Funds successfully bridged" floating text
  - **Cinematic finale:** Entire widget fades to centered PONIA logo with golden glow effect (2s after completion)
  - **Final fade out:** Logo progressively fades out (1.5s) while neon tagline appears: "One widget. Any chain. Anywhere." in Space Grotesk with golden glow effect
  - **Enhanced visuals:** Gradient background (dark → purple tint), golden shadow on widget container
  - **Timeline:** Connect Wallet (1s) → Confirm Swap → Golden Flash → Progress 25%/60%/100% (4s) → Success → Logo (1.5s) → Tagline Fade-in
  - 0.85 scale for perfect 1080p Runway video recording
  - All interactions self-contained (no real blockchain, no popups)
- **UI improvements:** Replaced USDC and USDT emoji icons with professional brand logos (blue USDC, turquoise USDT)
- **Widget layout optimization:** Logo enlarged from 70px to 90px for better visibility, reduced header/body padding for compact layout
- **Documentation design:** Enlarged PONIA logo on docs page (280px width) for better brand presence

**October 23, 2025:**
- Created comprehensive developer documentation page (`/docs.html`) with full integration guides
- Documented bidirectional flows: deposits AND withdrawals
- Added Quick Start examples for both deposit and withdrawal modes
- Included API Reference with `mode` parameter for transaction type selection
- Added real-world examples for Web3 Gaming, NFT Marketplaces, and Crypto Casinos
- Implemented FAQ section with withdrawal-specific guidance
- **Fixed deBridge integration:** Removed zkSync and World Chain (not supported by deBridge), now using 8 compatible chains
- **Fixed token addresses:** Changed native token addresses from `0xEeee...` to `0x0000...` (address zero) as required by deBridge API
- **Fixed API calls:** Changed from POST to GET with query parameters, added `prependOperatingExpenses=true`, set `dstChainTokenOutAmount='auto'` for optimal quotes
- **Fixed fee structure:** Changed `affiliateFeePercent` from 1.5 to '0.15' (0.15% fee on top of bridge fees)
- **Added multi-chain address handling:** Chain-specific affiliate recipient addresses (Solana base58, TRON, EVM formats)
- **Integrated Solana wallet support:** Added `@reown/appkit-adapter-solana` - users can now send FROM Solana using Phantom, Solflare, etc.
- **Full multi-chain support:** All 8 chains now work as SOURCE and DESTINATION (6 EVM + Solana + TRON)
- **Environment-based fee addresses:** Using Vite env variables for production wallet addresses with fallback placeholders for testing

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Multi-Page Application

PONIA utilizes a multi-page structure with a landing page (`/`), a widget demo (`/widget`), and comprehensive documentation (`/docs.html`). The landing page focuses on marketing with features and use cases, the widget page hosts the functional payment widget, and the documentation provides self-service integration guides for developers with complete code examples for both deposits and withdrawals.

## User Interface (UI/UX)

The widget features a modern, professional design with a 3-stage user flow (selection, processing, success). Key UI elements include:
- Animated gradient background on the landing page.
- Stats bar and feature highlights.
- Visual chain selection with logos for 8 supported blockchains (6 EVM + Solana + TRON).
- Token selector for Native, USDC, and USDT with smart availability.
- Transparent fee breakdown showing PONIA's 1.5% fee, total debited, and expected output.
- Professional branding with a black/yellow color scheme.

## Technical Implementations

- **Frontend:** Single-Page Application (SPA) architecture using Vanilla JavaScript (ES6+) with ES modules, built with Vite for fast development and optimized builds.
- **Wallet Integration:** Reown AppKit 1.8.x is used for universal wallet connectivity (300+ wallets) and integrates with `ethers.js` via `Reown AppKit Ethers Adapter`.
- **Cross-Chain Bridging:** deBridge is the sole bridging solution, offering instant (~2 second) transfer speeds with Zero-TVL architecture for maximum security. PONIA integrates its 1.5% transaction fee directly into the quote.
- **Supported Chains:** Currently supports 8 deBridge-compatible blockchains: 6 EVM chains (Ethereum, Polygon, Arbitrum, Base, Optimism, BNB Chain) plus Solana and TRON for broader market coverage.
- **Token Support:** Comprehensive support for native tokens, USDC (on 7 chains), and USDT (on 5 chains), with automatic mapping of correct token addresses (including Solana base58 and TRON formats).
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