# Overview

Ponia Demo is a cross-chain cryptocurrency payment widget that integrates with LI.FI's API to enable seamless token swaps across multiple blockchain networks. The application provides a professional wallet connection interface powered by **Reown AppKit** (formerly Web3Modal), supporting 300+ wallets including MetaMask, Coinbase Wallet, Trust Wallet, WalletConnect, and more.

The project is a demonstration/proof-of-concept for a universal checkout widget that allows users to pay with any crypto on any chain, with automatic cross-chain routing handled by LI.FI infrastructure and universal wallet support via Reown AppKit.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Single-Page Application (SPA) with Build System**
- Modern JavaScript application using ES modules
- Vite as build tool and development server
- Component-based architecture with Reown AppKit integration
- Responsive design with CSS custom properties for dark theme (black/yellow color scheme)

**Technology Stack**
- Vite 7.x for fast development and optimized builds
- Vanilla JavaScript (ES6+) with ES modules
- Reown AppKit 1.8.x for universal wallet connectivity
- Ethers.js v6 for blockchain interactions
- React & React-DOM (peer dependencies for AppKit)
- CSS3 with custom properties
- Font: Inter / system fonts

**Design Pattern**
- Modular ES6 code structure (main.js + index.html)
- Event-driven architecture
- Async/await for wallet and API interactions
- Separation of concerns: UI (HTML/CSS) and logic (JavaScript modules)

## Wallet Integration

**Reown AppKit (Universal Wallet Connection)**
- **Provider**: Reown AppKit 1.8.x (formerly Web3Modal/WalletConnect)
- **Supported Wallets**: 300+ wallets including:
  - Browser extensions: MetaMask, Coinbase Wallet, Trust Wallet, Brave Wallet
  - Mobile wallets: via WalletConnect v2 QR code
  - Hardware wallets: Ledger, Trezor
  - Smart contract wallets: Safe, Argent
- **Project ID**: f83cf00007509459345871b429d32db0
- **Adapter**: EthersAdapter for seamless ethers.js integration

**Wallet Connection Flow**
1. User clicks `<appkit-button>` web component
2. AppKit modal opens with detected wallets + WalletConnect QR
3. User selects wallet and approves connection
4. EthersAdapter provides ethers.js provider and signer
5. Application retrieves address and chain info
6. Address used for LI.FI quote and transaction operations

**Supported Networks**
- Ethereum mainnet (chain ID: 1)
- Polygon (chain ID: 137)
- BNB Chain (chain ID: 56)
- Arbitrum (chain ID: 42161)

## Cross-Chain Quote System

**LI.FI Integration**
- Primary API: `https://li.quest/v1/quote`
- No API key required for client-side widget usage (public endpoint)
- Supports native token swaps (ETH, MATIC, BNB, etc.)
- Future expansion planned for USDC and custom tokens

**Quote Parameters**
- `fromChain`: Source blockchain (ethereum, polygon, bsc, arbitrum)
- `toChain`: Destination blockchain
- `fromToken`: Source token address (0x0000... for native)
- `toToken`: Destination token address (0x0000... for native)
- `fromAmount`: Amount in smallest unit (wei)
- `fromAddress`: User's source address
- `toAddress`: User's destination address
- `integrator`: Identifier tag ('ponia-demo')

**Quote Response Handling**
- Parse route information (steps, tools used)
- Extract estimated output amount
- Display ETA and bridging protocol
- Error handling with user-friendly messages

## Platform Chain Detection

**Automatic Detection**
- Widget can auto-detect target blockchain from context
- Manual override via `openPonia({ chain: 'polygon' })`
- Supports pre-configuring destination chain for merchant use cases

**Supported Chains**
- Ethereum (mainnet, chain ID: 1)
- Polygon (chain ID: 137)
- BNB Chain / BSC (chain ID: 56)
- Arbitrum (chain ID: 42161)
- Extensible to other EVM chains supported by Reown AppKit

# External Dependencies

## Third-Party Libraries (npm)

**Reown AppKit**
- Package: `@reown/appkit@^1.8.10`
- Purpose: Universal wallet connection modal with 300+ wallet support
- Features: WalletConnect v2, auto-detection, QR codes, network switching
- Documentation: https://docs.reown.com/appkit

**Reown AppKit Ethers Adapter**
- Package: `@reown/appkit-adapter-ethers@^1.8.10`
- Purpose: Bridge between AppKit and ethers.js
- Provides: EthersAdapter class for seamless provider/signer access

**ethers.js**
- Package: `ethers@^6.15.0`
- Purpose: Ethereum library for blockchain interactions
- Used for: Transaction signing, contract calls, provider management

**React & React-DOM**
- Packages: `react` and `react-dom`
- Purpose: Peer dependencies required by Reown AppKit's UI components
- Note: Not used directly in application code

**Vite**
- Package: `vite@^7.1.10` (dev dependency)
- Purpose: Fast development server and build tool
- Features: Hot module replacement, optimized bundling, ES module support

## External APIs

**LI.FI Quote API**
- Endpoint: `https://li.quest/v1/quote`
- Authentication: None required (public widget endpoint)
- Rate Limits: Not specified (consider server-side API key for production)
- Purpose: Cross-chain routing and quote generation
- Response: Route data including steps, tools, estimated output, ETA

**Future Considerations**
- Server-side API key implementation for rate limit management
- LI.FI execution SDK for transaction submission
- Alternative: LI.FI Widget for full-featured integration
- Token address mappings for USDC and other standard tokens

## Browser APIs

**Window.ethereum**
- MetaMask and compatible EVM wallet injection
- Used for: Detecting installed wallets, connecting accounts

**Window.solana**
- Phantom wallet injection for Solana
- Used for: Solana wallet detection and connection

**LocalStorage** (potential future use)
- Store user preferences, last used wallet, chain selections