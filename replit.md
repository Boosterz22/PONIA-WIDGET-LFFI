# Overview

Ponia Demo is a cross-chain cryptocurrency payment widget that integrates with LI.FI's API to enable seamless token swaps across multiple blockchain networks. The application provides a user-friendly interface for obtaining quotes and executing cross-chain transactions using various wallet providers (MetaMask, WalletConnect, Coinbase Wallet, Phantom for Solana).

The project is a demonstration/proof-of-concept for a universal checkout widget that allows users to pay with any crypto on any chain, with automatic cross-chain routing handled by LI.FI infrastructure.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Single-Page Application (SPA)**
- Self-contained HTML application with embedded CSS and JavaScript
- No build process or bundler required - uses CDN-loaded dependencies
- Modal-based widget UI overlaying the host page
- Responsive design with CSS custom properties for theming

**Technology Stack**
- Vanilla JavaScript (ES6+) for application logic
- CSS3 with custom properties for dark theme (black/yellow color scheme)
- Font: Space Grotesk / Inter / system fonts

**Design Pattern**
- Function-based approach with global functions (`openPonia()`, `closePonia()`)
- Event-driven UI updates via DOM manipulation
- Stateless quote fetching with demo addresses for testing

## Wallet Integration

**Multi-Chain Wallet Support**
- EVM chains: MetaMask, Coinbase Wallet, any injected provider, WalletConnect v1
- Solana: Phantom wallet detection
- Uses ethers.js v6 for EVM wallet interactions
- Uses @solana/web3.js for Solana support

**Wallet Connection Flow**
1. Detect available wallet providers in browser
2. User selects wallet type
3. Connect and retrieve user address
4. Use address for quote/transaction operations

**Fallback Mechanism**
- Demo addresses used when no wallet connected (`0x0000000000000000000000000000000000000001`)
- Allows quote testing without wallet connection

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
- Ethereum (mainnet)
- Polygon
- BNB Chain (BSC)
- Arbitrum
- Extensible to other EVM chains and Solana

# External Dependencies

## Third-Party Libraries (CDN)

**ethers.js v6.8.0**
- Purpose: EVM blockchain interactions and wallet connectivity
- Source: `https://cdn.jsdelivr.net/npm/ethers@6.8.0/dist/ethers.min.js`
- Used for: Transaction signing, provider connection, address validation

**WalletConnect Web3 Provider v1.8.0**
- Purpose: Mobile wallet connectivity via QR code
- Source: `https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js`
- Used for: Connecting mobile wallets to desktop browsers

**Solana Web3.js v1.78.0**
- Purpose: Solana blockchain interactions
- Source: `https://unpkg.com/@solana/web3.js@1.78.0/lib/index.iife.js`
- Used for: Phantom wallet integration, Solana transaction handling

**Google Fonts**
- Space Grotesk font family (weights: 400, 600, 700)
- Fallback to Inter and system fonts

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