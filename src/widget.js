import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { mainnet, polygon, bsc, arbitrum, base, optimism, solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { ethers } from 'ethers'

// Token configuration (EVM + Solana + TRON)
const TOKENS = {
  native: {
    name: 'Native',
    addresses: {
      // EVM chains use 0x0000... (address zero) for native tokens
      1: '0x0000000000000000000000000000000000000000',       // ETH
      10: '0x0000000000000000000000000000000000000000',      // ETH
      56: '0x0000000000000000000000000000000000000000',      // BNB
      137: '0x0000000000000000000000000000000000000000',     // POL
      8453: '0x0000000000000000000000000000000000000000',    // ETH
      42161: '0x0000000000000000000000000000000000000000',   // ETH
      // Solana wrapped SOL
      7565164: 'So11111111111111111111111111111111111111112',
      // TRON native TRX (zero address)
      728126428: '0x0000000000000000000000000000000000000000'
    },
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
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',   // Base
      42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',  // Arbitrum
      // Solana USDC
      7565164: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      // TRON USDC
      728126428: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
    },
    decimals: 6,
    logo: '/assets/usdc-logo.png'
  },
  usdt: {
    name: 'USDT',
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',      // Ethereum
      10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',     // Optimism
      56: '0x55d398326f99059fF775485246999027B3197955',     // BSC
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',    // Polygon
      42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',   // Arbitrum
      // Solana USDT
      7565164: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      // TRON USDT (most popular)
      728126428: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    },
    decimals: 6,
    logo: '/assets/usdt-logo.png'
  }
};

// Chain configuration with logos (8 deBridge-supported chains)
const CHAIN_CONFIG = {
  solana: {
    id: 7565164,
    name: 'Solana',
    logo: '/assets/chains/solana.png',
    symbol: 'SOL',
    type: 'solana'
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    logo: '/assets/chains/ethereum.png',
    symbol: 'ETH',
    type: 'evm'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    logo: '/assets/chains/polygon.png',
    symbol: 'POL',
    type: 'evm'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    logo: '/assets/chains/arbitrum.png',
    symbol: 'ETH',
    type: 'evm'
  },
  base: {
    id: 8453,
    name: 'Base',
    logo: '/assets/chains/base.png',
    symbol: 'ETH',
    type: 'evm'
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    logo: '/assets/chains/optimism.png',
    symbol: 'ETH',
    type: 'evm'
  },
  bsc: {
    id: 56,
    name: 'BNB Chain',
    logo: '/assets/chains/bnb.png',
    symbol: 'BNB',
    type: 'evm'
  },
  tron: {
    id: 728126428,
    name: 'TRON',
    logo: '/assets/chains/tron.png',
    symbol: 'TRX',
    type: 'tron'
  }
};

// State
let ethersAdapter = null;
let solanaAdapter = null;
let modal = null;
let currentStage = 'select';
let selectedSourceChain = 'solana';
let destinationChain = 'ethereum';
let selectedToken = 'native';

// Initialize Reown AppKit (Multi-chain: EVM + Solana)
const projectId = 'f83cf00007509459345871b429d32db0';
const metadata = {
  name: 'PONIA',
  description: 'Cross-chain payment widget',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://ponia.io',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Create adapters for EVM and Solana
ethersAdapter = new EthersAdapter();
solanaAdapter = new SolanaAdapter();

// Create multi-chain AppKit modal
modal = createAppKit({
  adapters: [ethersAdapter, solanaAdapter],
  networks: [mainnet, polygon, arbitrum, base, optimism, bsc, solana],
  projectId,
  metadata
});

// Detect destination chain from URL
function detectDestinationChain() {
  const params = new URLSearchParams(window.location.search);
  const chain = params.get('chain');
  if (chain && CHAIN_CONFIG[chain.toLowerCase()]) {
    return chain.toLowerCase();
  }
  return 'ethereum';
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
    
    // Add logo
    const logo = document.createElement('img');
    logo.src = config.logo;
    logo.alt = config.name;
    logo.className = 'chain-btn-logo';
    button.appendChild(logo);
    
    // Add text
    const text = document.createTextNode(config.name);
    button.appendChild(text);
    
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
  updateTokenAvailability();
  updateRouteVisual();
  updateFeePreview();
}

function selectSourceChain(chainKey) {
  selectedSourceChain = chainKey;
  updateSourceChainSelection();
  updateTokenAvailability();
  updateRouteVisual();
  updateFeePreview();
}

function updateSourceChainSelection() {
  document.querySelectorAll('.chain-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === CHAIN_CONFIG[selectedSourceChain].name) {
      btn.classList.add('active');
    }
  });
}

// Token selection
window.selectToken = function(tokenType) {
  selectedToken = tokenType;
  updateTokenSelection();
  updateAmountPlaceholder();
  updateFeePreview();
}

// Update route visualization
function updateRouteVisual() {
  const routeVisual = document.getElementById('routeVisual');
  if (!routeVisual) return;
  
  const sourceConfig = CHAIN_CONFIG[selectedSourceChain];
  const destConfig = CHAIN_CONFIG[destinationChain];
  
  document.getElementById('routeSourceLogo').src = sourceConfig.logo;
  document.getElementById('routeSourceName').textContent = sourceConfig.name;
  document.getElementById('routeDestLogo').src = destConfig.logo;
  document.getElementById('routeDestName').textContent = destConfig.name;
  
  routeVisual.classList.remove('hidden');
}

// Update fee preview
function updateFeePreview() {
  const feePreview = document.getElementById('feePreview');
  if (!feePreview) return;
  
  const amount = document.getElementById('amountInput').value;
  if (!amount || parseFloat(amount) <= 0) {
    feePreview.classList.add('hidden');
    return;
  }
  
  const sourceConfig = CHAIN_CONFIG[selectedSourceChain];
  let tokenSymbol;
  
  if (selectedToken === 'native') {
    tokenSymbol = sourceConfig.symbol;
  } else if (selectedToken === 'usdc') {
    tokenSymbol = 'USDC';
  } else if (selectedToken === 'usdt') {
    tokenSymbol = 'USDT';
  }
  
  const poniaFee = (parseFloat(amount) * 0.015).toFixed(selectedToken === 'native' ? 6 : 2);
  const bridgeFee = '~0.04%';
  const estimatedTime = '~43 sec';
  
  document.getElementById('previewPoniaFee').textContent = `${poniaFee} ${tokenSymbol}`;
  document.getElementById('previewBridgeFee').textContent = bridgeFee;
  document.getElementById('previewTime').textContent = estimatedTime;
  
  feePreview.classList.remove('hidden');
}

// Listen to amount changes
document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amountInput');
  if (amountInput) {
    amountInput.addEventListener('input', updateFeePreview);
  }
});

function updateTokenSelection() {
  document.querySelectorAll('.token-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`btn${selectedToken.charAt(0).toUpperCase() + selectedToken.slice(1)}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

function updateTokenAvailability() {
  const chainId = CHAIN_CONFIG[selectedSourceChain].id;
  
  // Check Native availability (should always be available)
  const nativeBtn = document.getElementById('btnNative');
  if (TOKENS.native.addresses[chainId]) {
    nativeBtn.classList.remove('disabled');
  } else {
    nativeBtn.classList.add('disabled');
    if (selectedToken === 'native') {
      // Try to select USDC or USDT if native not available
      if (TOKENS.usdc.addresses[chainId]) {
        selectToken('usdc');
      } else if (TOKENS.usdt.addresses[chainId]) {
        selectToken('usdt');
      }
    }
  }
  
  // Check USDC availability
  const usdcBtn = document.getElementById('btnUsdc');
  if (TOKENS.usdc.addresses[chainId]) {
    usdcBtn.classList.remove('disabled');
  } else {
    usdcBtn.classList.add('disabled');
    if (selectedToken === 'usdc') {
      selectToken('native');
    }
  }
  
  // Check USDT availability
  const usdtBtn = document.getElementById('btnUsdt');
  if (TOKENS.usdt.addresses[chainId]) {
    usdtBtn.classList.remove('disabled');
  } else {
    usdtBtn.classList.add('disabled');
    if (selectedToken === 'usdt') {
      selectToken('native');
    }
  }
}

function updateAmountPlaceholder() {
  const amountInput = document.getElementById('amountInput');
  if (selectedToken === 'native') {
    amountInput.value = '0.01';
    amountInput.placeholder = '0.01';
  } else {
    amountInput.value = '100';
    amountInput.placeholder = '100';
  }
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

// Get connected wallet address (supports EVM, Solana, TRON)
async function getConnectedAddress(chainId) {
  try {
    const sourceConfig = CHAIN_CONFIG[Object.keys(CHAIN_CONFIG).find(k => CHAIN_CONFIG[k].id === chainId)];
    
    // For TRON chains - use direct TronLink injection
    if (sourceConfig?.type === 'tron') {
      if (window.tronWeb && window.tronWeb.defaultAddress?.base58) {
        return window.tronWeb.defaultAddress.base58;
      }
      if (window.tronLink?.ready) {
        const response = await window.tronLink.request({ method: 'tron_requestAccounts' });
        if (response.code === 200 && window.tronLink.tronWeb?.defaultAddress?.base58) {
          return window.tronLink.tronWeb.defaultAddress.base58;
        }
      }
      throw new Error('Please connect your TRON wallet (TronLink)');
    }
    
    // For EVM and Solana chains - use AppKit's getAddress()
    // This works for multi-chain wallets like Phantom that support both
    const address = modal.getAddress();
    
    if (!address) {
      throw new Error('Please connect your wallet first');
    }
    
    return address;
  } catch (error) {
    throw new Error(error.message || 'Please connect your wallet first');
  }
}

// Get affiliate fee recipient address for the specific chain
function getAffiliateFeeRecipient(chainId) {
  // Use environment variables for production addresses, fallback to valid test addresses
  
  // Solana chain - use a valid Solana base58 address
  if (chainId === 7565164) {
    return import.meta.env.PONIA_SOLANA_FEE_ADDRESS || '9aHhLYXj1YbFLxNqBJzQZXd4rJYz9YQBv6g3dP7KHM8d';
  }
  
  // TRON chain - use a valid TRON address format
  if (chainId === 728126428) {
    return import.meta.env.PONIA_TRON_FEE_ADDRESS || 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
  }
  
  // EVM chains (default) - return as-is, will be checksummed when needed
  return import.meta.env.PONIA_EVM_FEE_ADDRESS || '0xE16C0f75AC560df3B37428a8670574679Fbcfa3e';
}

// Convert amount to smallest unit (wei for native, mwei for USDC/USDT)
function toSmallestUnit(amount, tokenType) {
  const decimals = tokenType === 'native' ? 18 : 6;
  const parts = String(amount).split('.');
  const whole = BigInt(parts[0] || 0);
  const fracPadded = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  const multiplier = BigInt(10) ** BigInt(decimals);
  return whole * multiplier + BigInt(fracPadded || '0');
}

// Format smallest unit to readable
function formatAmount(smallestUnit, tokenType = 'native') {
  const decimals = tokenType === 'native' ? 18 : 6;
  const units = BigInt(smallestUnit);
  const divisor = 10 ** decimals;
  const amount = Number(units) / divisor;
  return amount.toFixed(tokenType === 'native' ? 6 : 2);
}

// Get platform destination address (where funds will be deposited)
// In production, this would come from URL params or integration config
function getPlatformAddress(chainId) {
  const chainConfig = CHAIN_CONFIG[Object.keys(CHAIN_CONFIG).find(k => CHAIN_CONFIG[k].id === chainId)];
  
  // For testing: use placeholder addresses for each chain type
  if (chainConfig.type === 'evm') {
    // EVM chains - return as-is, will be checksummed when needed
    return import.meta.env.PONIA_PLATFORM_EVM_ADDRESS || '0xE16C0f75AC560df3B37428a8670574679Fbcfa3e';
  } else if (chainConfig.type === 'solana') {
    // Solana - use env variable or test address
    return import.meta.env.PONIA_PLATFORM_SOLANA_ADDRESS || '9aHhLYXj1YbFLxNqBJzQZXd4rJYz9YQBv6g3dP7KHM8d';
  } else if (chainConfig.type === 'tron') {
    // TRON - use env variable or test address
    return import.meta.env.PONIA_PLATFORM_TRON_ADDRESS || 'TY2ykZKLNNfvCJdL4QHW5pX2n3wQv7eVHb';
  }
  
  throw new Error(`Unsupported chain type: ${chainConfig.type}`);
}

// Handle swap confirmation
async function handleConfirmSwap() {
  try {
    const amount = document.getElementById('amountInput').value;
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Animate button to loading state
    const btn = document.getElementById('btnConfirmSwap');
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Wait for animation to complete (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get chain configs
    const sourceConfig = CHAIN_CONFIG[selectedSourceChain];
    const destConfig = CHAIN_CONFIG[destinationChain];
    
    // Get user's wallet address for the source chain (works for EVM, Solana, TRON)
    const sourceAddress = await getConnectedAddress(sourceConfig.id);
    console.log('Source address:', sourceAddress);
    
    // Get platform destination address (where funds will be deposited)
    const destinationAddress = getPlatformAddress(destConfig.id);
    console.log('Destination address:', destinationAddress);
    
    // Calculate fees
    const userAmount = toSmallestUnit(amount, selectedToken);
    const poniaFee = (userAmount * BigInt(150)) / BigInt(10000); // 1.5%
    const totalAmount = userAmount + poniaFee;
    
    // Get token addresses based on chain type
    let inputTokenAddress, outputTokenAddress;
    let tokenSymbol;
    
    if (selectedToken === 'native') {
      inputTokenAddress = TOKENS.native.addresses[sourceConfig.id];
      outputTokenAddress = TOKENS.native.addresses[destConfig.id];
      tokenSymbol = sourceConfig.symbol;
      
      if (!inputTokenAddress || !outputTokenAddress) {
        throw new Error(`Native token not supported on selected chains`);
      }
    } else if (selectedToken === 'usdc') {
      inputTokenAddress = TOKENS.usdc.addresses[sourceConfig.id];
      outputTokenAddress = TOKENS.usdc.addresses[destConfig.id];
      tokenSymbol = 'USDC';
      
      if (!inputTokenAddress || !outputTokenAddress) {
        throw new Error('USDC not available on selected chains');
      }
    } else if (selectedToken === 'usdt') {
      inputTokenAddress = TOKENS.usdt.addresses[sourceConfig.id];
      outputTokenAddress = TOKENS.usdt.addresses[destConfig.id];
      tokenSymbol = 'USDT';
      
      if (!inputTokenAddress || !outputTokenAddress) {
        throw new Error('USDT not available on selected chains');
      }
    }
    
    // Set swap animation logos
    document.getElementById('sourceLogoAnim').src = sourceConfig.logo;
    document.getElementById('destLogoAnim').src = destConfig.logo;
    document.getElementById('swapRoute').textContent = `${sourceConfig.name} → ${destConfig.name}`;
    
    // Set fee breakdown
    document.getElementById('feeUserAmount').textContent = `${formatAmount(userAmount, selectedToken)} ${tokenSymbol}`;
    document.getElementById('feePoniaFee').textContent = `${formatAmount(poniaFee, selectedToken)} ${tokenSymbol} (1.5%)`;
    document.getElementById('feeTotalAmount').textContent = `${formatAmount(totalAmount, selectedToken)} ${tokenSymbol}`;
    
    // Show processing stage (smooth transition)
    showStage('processing');
    
    // Reset button state for next use
    btn.classList.remove('loading');
    btn.disabled = false;
    
    // Get affiliate fee recipient
    let affiliateFeeRecipient = getAffiliateFeeRecipient(sourceConfig.id);
    
    // Checksum EVM addresses for deBridge
    let checksummedSource = sourceAddress;
    let checksummedDestination = destinationAddress;
    let checksummedAffiliate = affiliateFeeRecipient;
    
    if (sourceConfig.type === 'evm') {
      checksummedSource = ethers.getAddress(sourceAddress);
    }
    if (destConfig.type === 'evm') {
      checksummedDestination = ethers.getAddress(destinationAddress);
      checksummedAffiliate = ethers.getAddress(affiliateFeeRecipient);
    }
    
    console.log('Source address:', checksummedSource);
    console.log('Destination address:', checksummedDestination);
    console.log('Affiliate fee recipient:', checksummedAffiliate);
    console.log('Input token address:', inputTokenAddress);
    console.log('Output token address:', outputTokenAddress);
    
    // Fetch complete order from deBridge (quote + transaction in one call)
    const orderParams = {
      srcChainId: sourceConfig.id,
      srcChainTokenIn: inputTokenAddress,
      srcChainTokenInAmount: totalAmount.toString(),
      dstChainId: destConfig.id,
      dstChainTokenOut: outputTokenAddress,
      dstChainTokenOutAmount: 'auto',  // Let deBridge calculate optimal output
      dstChainTokenOutRecipient: checksummedDestination,  // Destination address (checksummed for EVM)
      srcChainOrderAuthorityAddress: checksummedSource,  // Source wallet address (checksummed for EVM)
      dstChainOrderAuthorityAddress: checksummedDestination,  // Destination address (checksummed for EVM)
      affiliateFeePercent: '0.15',  // 0.15% = our additional fee on top of user's amount
      affiliateFeeRecipient: checksummedAffiliate,  // Chain-specific format (checksummed for EVM)
      prependOperatingExpenses: 'true'  // Add fees to input, don't deduct from output
    };
    
    console.log('Full deBridge params:', JSON.stringify(orderParams, null, 2));
    
    const orderUrl = `https://dln.debridge.finance/v1.0/dln/order/create-tx?${new URLSearchParams(orderParams).toString()}`;
    console.log('Fetching deBridge order:', orderUrl);
    
    const orderResponse = await fetch(orderUrl);  // GET request with query params
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('deBridge API error:', errorText);
      throw new Error(`deBridge API error: ${errorText}`);
    }
    
    const orderData = await orderResponse.json();
    console.log('deBridge order received:', orderData);
    
    if (!orderData.estimation) {
      throw new Error('No estimation received from deBridge');
    }
    
    // Update fee breakdown with actual data
    const expectedOutput = orderData.estimation.dstChainTokenOut?.amount || '0';
    const expectedTime = orderData.estimation.approximateFulfillmentDelay || 60;
    
    document.getElementById('feeOutputAmount').textContent = `${formatAmount(expectedOutput, selectedToken)} ${tokenSymbol}`;
    document.getElementById('feeEstimatedTime').textContent = `~${Math.ceil(expectedTime / 60)} min`;
    
    // Start progress animation
    startProgress();
    
    if (!orderData.tx) {
      throw new Error('No transaction data received from deBridge');
    }
    
    // Execute transaction based on chain type
    let txHash;
    
    if (sourceConfig.type === 'solana') {
      // Solana transaction - use Solana wallet
      throw new Error('Solana transactions not yet implemented');
    } else if (sourceConfig.type === 'evm') {
      // EVM transaction - get provider from AppKit
      const walletProvider = await modal.getWalletProvider();
      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      const tx = {
        to: orderData.tx.to,
        data: orderData.tx.data,
        value: orderData.tx.value || '0x0',
        gasLimit: orderData.tx.gas || '500000'
      };
      
      console.log('Sending EVM transaction:', tx);
      const txResponse = await signer.sendTransaction(tx);
      console.log('Transaction submitted:', txResponse.hash);
      txHash = txResponse.hash;
      
      // Wait for confirmation
      await txResponse.wait();
    } else if (sourceConfig.type === 'tron') {
      // TRON transaction
      throw new Error('TRON transactions not yet implemented');
    } else {
      throw new Error(`Unsupported chain type: ${sourceConfig.type}`);
    }
    
    // Show success
    showSuccess(txHash, sourceConfig, destConfig);
    
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
