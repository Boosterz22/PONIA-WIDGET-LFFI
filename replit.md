# Overview

PONIA is a cross-chain cryptocurrency payment widget designed for Web3 applications (gaming dApps, NFT marketplaces, crypto casinos, DeFi platforms). It enables instant deposits/withdrawals across multiple blockchains, allowing users to top-up accounts with any crypto from any supported chain without external conversions. The business model involves a 1.5% fee on every cross-chain transaction. It integrates Reown AppKit for professional wallet connection (300+ wallets) and deBridge for instant cross-chain bridging (~43 second transfers). The project aims to provide a professional, self-service solution for Web3 apps needing cross-chain payment functionality, supporting 8 major deBridge-compatible chains including EVM networks, Solana, and TRON.

# Recent Changes

**October 25, 2025 (Latest):**
- **Stats counter animation fixed:** Added automatic triggering for stats animations when section becomes visible
  - Reduced IntersectionObserver threshold from 0.3 to 0.1 for earlier trigger
  - Added initial visibility check 500ms after page load
  - Added scroll event listener as fallback mechanism
  - Stats (43s ETA, 99.2% success rate, 1.5% fee) now animate properly on scroll
- **TRON logo size increased across all pages:** Larger logo for better visibility
  - Homepage: 56px → 68px (+20%)
  - Widget: 20px → 26px (+30%)
  - Docs page: 24px → 32px (+33%)
  - Demo widget: 16px → 22px (+37%)
- **Social links updated:** Added working Twitter and Discord links to footer
  - Twitter: https://x.com/ponia_hq?s=21
  - Discord: https://discord.gg/rKWxddAp

**October 25, 2025:**
- **Brand refinement complete:** Replaced emojis with professional Lucide icons across all documentation pages
  - Replaced emoji icons with Lucide icons in `docs.html` key features section (zap, link, dollar-sign, lock, refresh-cw, plug)
  - Added Lucide settings icon to integration.html configuration section
  - Initialized Lucide icon library on all pages for consistent rendering
  - All pages now display professional vector icons instead of emoji for better cross-platform consistency
- **Unified brand slogan implemented:** Added "One widget. Any Chain. Anywhere." to all page footers
  - Homepage footer updated with new tagline in Space Grotesk font with accent color
  - Integration page footer includes slogan with proper styling
  - Documentation page footer displays slogan consistently
  - Slogan presented in brand accent color (#FFD700) for visual consistency
- **Dedicated integration page created:** Professional `/integration.html` page showcasing how simple it is to integrate PONIA
  - Hero section emphasizing "Add cross-chain payments in 60 seconds"
  - Quick start section with one-line iframe embed code
  - Complete code examples for HTML, React, Vue, and Next.js frameworks
  - Separate examples for deposit and withdrawal modes
  - Real-world use cases: Gaming dApps, Crypto Casinos, NFT Marketplaces
  - Configuration parameters table explaining all URL options
  - Interactive tabs for switching between different frameworks
  - Professional design with code syntax highlighting (JetBrains Mono font)
  - Updated navigation menu to link to /integration.html
- **Withdrawal mode implemented:** Added full support for bidirectional transactions (deposit AND withdrawal)
  - URL parameter `?mode=withdrawal` activates withdrawal mode
  - Withdrawal UI: Manual address input field replaces Connect Wallet button (no wallet popup needed)
  - Smart source/destination inversion: Deposit = user→platform, Withdrawal = platform→user
  - Labels adapt automatically: "Withdraw to which chain?" vs "Send from which chain?"
  - Transaction logic inverses addresses: platform wallet sends to user's manually entered address
  - Address validation: Basic checks for minimum length and format

**October 24, 2025:**
- **Production wallet addresses configured:** Set up secure Replit Secrets for fee collection wallets
  - EVM chains (Ethereum, Polygon, Arbitrum, Base, Optimism, BNB Chain): `0x280714ff27a52920bfcb75e2ec61027a93e8e9ac`
  - Solana: `9ZXoZdeR4aNVKmmegyVwfXjkKBG3BCcRXo961aSnD5fT`
  - TRON: `TQG4iEuaS2PEtFvnGGvG5utBbBuFuHSSFR`
- **Professional demo widget for marketing videos:** Created `ponia-demo-widget.html` - cinema-quality simulated version
  - **Lucide Icons integration:** Professional icon library (Send, Git-Branch, Check-Circle) replacing emojis
  - **Smooth slide transition:** Clean horizontal slide (0.6s ease-out) when moving from selection to progress screen
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