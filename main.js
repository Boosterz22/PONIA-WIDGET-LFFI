import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, polygon, bsc, arbitrum, base, optimism, zkSync, blast, worldchain } from '@reown/appkit/networks'

// Token configuration
const TOKENS = {
  native: {
    name: 'Native',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    decimals: 18,
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23627EEA"/%3E%3C/svg%3E'
  },
  usdc: {
    name: 'USDC',
    addresses: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',      // Ethereum
      10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',     // Optimism
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',     // BSC
      137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',    // Polygon
      324: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',     // zkSync (USDC.e)
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',   // Base
      42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'   // Arbitrum
    },
    decimals: 6,
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%232775CA"/%3E%3Ctext x="16" y="22" font-size="14" font-weight="bold" text-anchor="middle" fill="%23FFF"%3E$%3C/text%3E%3C/svg%3E'
  },
  usdt: {
    name: 'USDT',
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',      // Ethereum
      10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',     // Optimism
      56: '0x55d398326f99059fF775485246999027B3197955',     // BSC
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',    // Polygon
      324: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',     // zkSync
      42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'   // Arbitrum
    },
    decimals: 6,
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%2350AF95"/%3E%3Ctext x="16" y="22" font-size="14" font-weight="bold" text-anchor="middle" fill="%23FFF"%3ET%3C/text%3E%3C/svg%3E'
  }
};

// Chain configuration with logos
const CHAIN_CONFIG = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23627EEA"/%3E%3Cpath fill="%23FFF" d="M16 4l-8 13.5 8 4.75 8-4.75L16 4zm0 16.25l-8-4.75L16 28l8-12.5-8 4.75z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%238247E5"/%3E%3Cpath fill="%23FFF" d="M21 11l-5 3-3 2-5 3v6l5-3 3-2 5-3v-6zm-3-2l3 2v4l-3-2v-4zm-6 12l-3 2v-4l3-2v4z"/%3E%3C/svg%3E',
    symbol: 'POL'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%2328A0F0"/%3E%3Cpath fill="%23FFF" d="M10 12l6 10 6-10-6-4-6 4zm6 8l-4-6.5L16 10l4 3.5-4 6.5z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  base: {
    id: 8453,
    name: 'Base',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%230052FF"/%3E%3Cpath fill="%23FFF" d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8c3.7 0 6.8-2.5 7.7-6h-7.7v-4h7.7c-0.9-3.5-4-6-7.7-6z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23FF0420"/%3E%3Cpath fill="%23FFF" d="M10 14c0-1.1 0.9-2 2-2s2 0.9 2 2-0.9 2-2 2-2-0.9-2-2zm8 0c0-1.1 0.9-2 2-2s2 0.9 2 2-0.9 2-2 2-2-0.9-2-2zm-8 4h12c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  bsc: {
    id: 56,
    name: 'BNB Chain',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23F3BA2F"/%3E%3Cpath fill="%23000" d="M16 8l3 3-3 3-3-3 3-3zm-5 5l3 3-3 3-3-3 3-3zm10 0l3 3-3 3-3-3 3-3zm-5 5l3 3-3 3-3-3 3-3z"/%3E%3C/svg%3E',
    symbol: 'BNB'
  },
  zksync: {
    id: 324,
    name: 'zkSync',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%238C8DFC"/%3E%3Cpath fill="%23FFF" d="M10 12l6-4 6 4v8l-6 4-6-4v-8zm6 10l4-2.7v-5.3l-4 2.7v5.3zm-4-8l4-2.7 4 2.7-4 2.7-4-2.7z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  blast: {
    id: 81457,
    name: 'Blast',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23FCFC03"/%3E%3Cpath fill="%23000" d="M16 6l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"/%3E%3C/svg%3E',
    symbol: 'ETH'
  },
  worldchain: {
    id: 480,
    name: 'World Chain',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23000"/%3E%3Ccircle cx="16" cy="16" r="8" fill="none" stroke="%23FFF" stroke-width="2"/%3E%3Ccircle cx="16" cy="16" r="2" fill="%23FFF"/%3E%3C/svg%3E',
    symbol: 'ETH'
  }
};

// State
let ethersAdapter = null;
let modal = null;
let currentStage = 'select';
let selectedSourceChain = 'ethereum';
let destinationChain = 'polygon';

// Initialize Reown AppKit
const projectId = 'f83cf00007509459345871b429d32db0';
const metadata = {
  name: 'PONIA Widget',
  description: 'Cross-chain payment widget',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

ethersAdapter = new EthersAdapter();
modal = createAppKit({
  adapters: [ethersAdapter],
  networks: [mainnet, polygon, arbitrum, base, optimism, bsc, zkSync, blast, worldchain],
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

// Detect destination chain from URL
function detectDestinationChain() {
  const params = new URLSearchParams(window.location.search);
  const chain = params.get('chain');
  if (chain && CHAIN_CONFIG[chain.toLowerCase()]) {
    return chain.toLowerCase();
  }
  return 'polygon';
}

// Initialize UI
function initializeUI() {
  destinationChain = detectDestinationChain();
  const destConfig = CHAIN_CONFIG[destinationChain];
  
  // Set destination chain display
  document.getElementById('destinationLogo').src = destConfig.logo;
  document.getElementById('destinationName').textContent = destConfig.name;
  
  // Create source chain buttons (exclude destination)
  const chainButtons = document.getElementById('chainButtons');
  chainButtons.innerHTML = '';
  
  Object.keys(CHAIN_CONFIG).forEach(chainKey => {
    if (chainKey === destinationChain) return;
    
    const config = CHAIN_CONFIG[chainKey];
    const button = document.createElement('button');
    button.className = 'chain-btn';
    button.textContent = config.name;
    button.onclick = () => selectSourceChain(chainKey);
    
    if (chainKey === selectedSourceChain) {
      button.classList.add('active');
    }
    
    chainButtons.appendChild(button);
  });
  
  // Set default source chain (first available)
  const availableChains = Object.keys(CHAIN_CONFIG).filter(c => c !== destinationChain);
  selectedSourceChain = availableChains[0];
  updateSourceChainSelection();
}

function selectSourceChain(chainKey) {
  selectedSourceChain = chainKey;
  updateSourceChainSelection();
}

function updateSourceChainSelection() {
  document.querySelectorAll('.chain-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === CHAIN_CONFIG[selectedSourceChain].name) {
      btn.classList.add('active');
    }
  });
}

// Stage transitions
function showStage(stage) {
  document.getElementById('stageSelect').classList.add('hidden');
  document.getElementById('stageProcessing').classList.add('hidden');
  document.getElementById('stageSuccess').classList.add('hidden');
  
  if (stage === 'select') {
    document.getElementById('stageSelect').classList.remove('hidden');
  } else if (stage === 'processing') {
    document.getElementById('stageProcessing').classList.remove('hidden');
  } else if (stage === 'success') {
    document.getElementById('stageSuccess').classList.remove('hidden');
  }
  
  currentStage = stage;
}

// Get connected wallet address
async function getConnectedAddress() {
  try {
    const account = modal.getAccount();
    if (!account || !account.isConnected || !account.address) {
      throw new Error('Please connect your wallet first');
    }
    return account.address;
  } catch (error) {
    throw new Error('Please connect your wallet first');
  }
}

// Convert amount to wei
function toWei(amount) {
  const parts = String(amount).split('.');
  const whole = BigInt(parts[0] || 0);
  const frac = (parts[1] || '').padEnd(18, '0').slice(0, 18);
  return whole * BigInt("1000000000000000000") + BigInt(frac || '0');
}

// Format wei to readable
function formatAmount(weiAmount, decimals = 6) {
  const wei = BigInt(weiAmount);
  const eth = Number(wei) / 1e18;
  return eth.toFixed(decimals);
}

// Handle swap confirmation
async function handleConfirmSwap() {
  try {
    const amount = document.getElementById('amountInput').value;
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Get wallet address
    const fromAddress = await getConnectedAddress();
    
    // Calculate fees
    const userAmount = toWei(amount);
    const poniaFee = (userAmount * BigInt(150)) / BigInt(10000); // 1.5%
    const totalAmount = userAmount + poniaFee;
    
    // Update UI
    const sourceConfig = CHAIN_CONFIG[selectedSourceChain];
    const destConfig = CHAIN_CONFIG[destinationChain];
    
    // Set swap animation logos
    document.getElementById('sourceLogoAnim').src = sourceConfig.logo;
    document.getElementById('destLogoAnim').src = destConfig.logo;
    document.getElementById('swapRoute').textContent = `${sourceConfig.name} → ${destConfig.name}`;
    
    // Set fee breakdown
    document.getElementById('feeUserAmount').textContent = `${formatAmount(userAmount)} ${sourceConfig.symbol}`;
    document.getElementById('feePoniaFee').textContent = `${formatAmount(poniaFee)} ${sourceConfig.symbol} (1.5%)`;
    document.getElementById('feeTotalAmount').textContent = `${formatAmount(totalAmount)} ${sourceConfig.symbol}`;
    
    // Show processing stage
    showStage('processing');
    
    // Fetch Across Protocol quote
    const nativeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const params = new URLSearchParams({
      originChainId: sourceConfig.id,
      destinationChainId: destConfig.id,
      inputToken: nativeToken,
      outputToken: nativeToken,
      amount: totalAmount.toString(),
      depositor: fromAddress,
      recipient: fromAddress,
      tradeType: 'exactInput',
      integratorId: '0x504F'
    });
    
    const url = `https://app.across.to/api/swap/approval?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Across API error: ${error}`);
    }
    
    const quote = await response.json();
    
    if (!quote.swapTx) {
      throw new Error('No transaction data received');
    }
    
    // Update fee breakdown with quote data
    const expectedOutput = quote.expectedOutputAmount || '0';
    const expectedTime = quote.expectedFillTime || 3;
    
    document.getElementById('feeOutputAmount').textContent = `${formatAmount(expectedOutput)} ${destConfig.symbol}`;
    document.getElementById('feeEstimatedTime').textContent = `~${expectedTime} min`;
    
    // Start progress animation
    startProgress();
    
    // Get provider and execute transaction
    const provider = ethersAdapter.getProvider();
    if (!provider) {
      throw new Error('Wallet not connected');
    }
    
    const signer = await provider.getSigner();
    
    const tx = {
      to: quote.swapTx.to,
      data: quote.swapTx.data,
      value: '0x0',
      gasLimit: quote.swapTx.gas,
      maxFeePerGas: quote.swapTx.maxFeePerGas,
      maxPriorityFeePerGas: quote.swapTx.maxPriorityFeePerGas
    };
    
    const txResponse = await signer.sendTransaction(tx);
    console.log('Transaction submitted:', txResponse.hash);
    
    // Wait for confirmation
    await txResponse.wait();
    
    // Show success
    showSuccess(txResponse.hash, sourceConfig, destConfig);
    
  } catch (error) {
    console.error('Swap error:', error);
    alert(`Swap failed: ${error.message}`);
    showStage('select');
  }
}

// Progress animation
let progressInterval = null;
function startProgress() {
  let progress = 0;
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  
  if (progressInterval) clearInterval(progressInterval);
  
  progressInterval = setInterval(() => {
    progress += 0.5;
    if (progress > 99) progress = 99;
    
    progressBar.style.width = `${progress}%`;
    progressPercent.textContent = `${Math.round(progress)}%`;
  }, 100);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  document.getElementById('progressBar').style.width = '100%';
  document.getElementById('progressPercent').textContent = '100%';
}

// Show success screen
function showSuccess(txHash, sourceConfig, destConfig) {
  stopProgress();
  
  document.getElementById('successSourceChain').textContent = sourceConfig.name;
  document.getElementById('successDestChain').textContent = destConfig.name;
  document.getElementById('successDestChainName').textContent = destConfig.name;
  document.getElementById('txHashDisplay').textContent = txHash;
  
  setTimeout(() => {
    showStage('success');
  }, 500);
}

// Event listeners
document.getElementById('btnConfirmSwap').addEventListener('click', handleConfirmSwap);

// Initialize on load
initializeUI();
console.log('PONIA Widget initialized successfully');
