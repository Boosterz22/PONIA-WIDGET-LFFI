import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, polygon, bsc, arbitrum } from '@reown/appkit/networks'

const statusEl = document.getElementById('status');
const out = document.getElementById('output');
const btnSendTransfer = document.getElementById('btnSendTransfer');
const platformInput = document.getElementById('platformChain');
const feeBreakdown = document.getElementById('feeBreakdown');
const feeUserAmount = document.getElementById('feeUserAmount');
const feePoniaFee = document.getElementById('feePoniaFee');
const feeTotalAmount = document.getElementById('feeTotalAmount');
const feeOutputAmount = document.getElementById('feeOutputAmount');
const feeToChain = document.getElementById('feeToChain');
const feeEstimatedTime = document.getElementById('feeEstimatedTime');

let lastQuote = null;
let ethersAdapter = null;
let modal = null;

function log(...args){
  console.log(...args);
  out.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
}

// Initialize Reown AppKit
const projectId = 'f83cf00007509459345871b429d32db0';

const metadata = {
  name: 'PONIA Widget',
  description: 'Cross-chain payment widget powered by LI.FI',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

ethersAdapter = new EthersAdapter();

modal = createAppKit({
  adapters: [ethersAdapter],
  networks: [mainnet, polygon, bsc, arbitrum],
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

statusEl.textContent = 'AppKit ready. Click the "Connect Wallet" button above.';
log('Reown AppKit initialized successfully with multi-wallet support!');

function toSmallestUnit(chain, readableAmount){
  if(!readableAmount) return "0";
  const ra = String(readableAmount).trim();
  const parts = ra.split('.');
  const whole = BigInt(parts[0] || 0);
  const frac = parts[1] || '';
  const fracPadded = (frac + '0'.repeat(18)).slice(0,18);
  const val = whole * BigInt("1000000000000000000") + BigInt(fracPadded || '0');
  return val.toString();
}

function getChainId(chainName){
  const chainMap = {
    'ethereum': 1,
    'polygon': 137,
    'bsc': 56,
    'arbitrum': 42161
  };
  return chainMap[chainName] || chainName;
}

function nativeTokenForChain(chain){
  return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
}

function getChainName(chainId) {
  const names = {
    1: 'Ethereum',
    137: 'Polygon',
    56: 'BNB Chain',
    42161: 'Arbitrum'
  };
  return names[chainId] || `Chain ${chainId}`;
}

function formatAmount(weiAmount) {
  const wei = BigInt(weiAmount);
  const eth = Number(wei) / 1e18;
  return eth.toFixed(6);
}

async function getConnectedAddress() {
  try {
    const account = modal.getAccount();
    if (!account || !account.isConnected || !account.address) {
      throw new Error('Wallet not connected. Click "Connect Wallet" button first.');
    }
    return account.address;
  } catch (error) {
    throw new Error('Wallet not connected. Click "Connect Wallet" button first.');
  }
}

btnSendTransfer.addEventListener('click', async () => {
  try {
    statusEl.textContent = 'Preparing transfer...';
    const fromChain = document.getElementById('fromChain').value;
    const toChain = document.getElementById('toChain').value;
    const readableAmount = document.getElementById('amount').value;

    const fromAddress = await getConnectedAddress();
    const fromAmount = toSmallestUnit(fromChain, readableAmount);
    const fromToken = nativeTokenForChain(fromChain);
    const toToken = nativeTokenForChain(toChain);
    const fromChainId = getChainId(fromChain);
    const toChainId = getChainId(toChain);
    const toAddress = fromAddress;

    const poniaFeePercent = 1.5;
    const userAmount = BigInt(fromAmount);
    const poniaFee = (userAmount * BigInt(150)) / BigInt(10000);
    const totalAmount = userAmount + poniaFee;

    const fromTokenSymbol = fromChain.toUpperCase() === 'ETHEREUM' ? 'ETH' : 
                            fromChain.toUpperCase() === 'POLYGON' ? 'POL' :
                            fromChain.toUpperCase() === 'BSC' ? 'BNB' : 
                            fromChain.toUpperCase() === 'ARBITRUM' ? 'ETH' : 'tokens';

    feeUserAmount.textContent = `${formatAmount(userAmount)} ${fromTokenSymbol}`;
    feePoniaFee.textContent = `${formatAmount(poniaFee)} ${fromTokenSymbol} (${poniaFeePercent}%)`;
    feeTotalAmount.textContent = `${formatAmount(totalAmount)} ${fromTokenSymbol}`;
    feeBreakdown.classList.remove('hidden');

    statusEl.textContent = `💰 PONIA fee: ${poniaFeePercent}% — Getting best route...`;

    const base = 'https://app.across.to/api/swap/approval';
    const params = new URLSearchParams({
      originChainId: fromChainId,
      destinationChainId: toChainId,
      inputToken: fromToken,
      outputToken: toToken,
      amount: totalAmount.toString(),
      depositor: fromAddress,
      recipient: toAddress,
      tradeType: 'exactInput',
      integratorId: '0xP0N1'
    });

    const url = base + '?' + params.toString();

    statusEl.textContent = '⚡ Getting fastest route via Across Protocol...';
    log('Fetching Across quote:', url);

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      throw new Error('Across Protocol error ' + r.status + ': ' + txt);
    }
    const quote = await r.json();
    log('Across quote received:', quote);
    out.textContent = JSON.stringify(quote, null, 2);

    if (!quote.swapTx) {
      throw new Error('No transaction data from Across. Please try again.');
    }

    const swapTx = quote.swapTx;
    const toChainName = getChainName(toChainId);
    const toTokenSymbol = quote.outputToken?.symbol || 'tokens';
    const expectedOutput = quote.expectedOutputAmount || '0';
    const expectedFillTime = quote.expectedFillTime || 3;

    feeOutputAmount.textContent = `${formatAmount(expectedOutput)} ${toTokenSymbol}`;
    feeToChain.textContent = toChainName;
    feeEstimatedTime.textContent = `~${expectedFillTime} min`;

    statusEl.textContent = `📊 You'll receive ~${formatAmount(expectedOutput)} ${toTokenSymbol} on ${toChainName}`;

    const provider = ethersAdapter.getProvider();
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    
    const tx = {
      to: swapTx.to,
      data: swapTx.data,
      value: '0x0',
      gasLimit: swapTx.gas,
      maxFeePerGas: swapTx.maxFeePerGas,
      maxPriorityFeePerGas: swapTx.maxPriorityFeePerGas
    };

    statusEl.textContent = '⏳ Please confirm in your wallet...';
    const txResponse = await signer.sendTransaction(tx);
    
    statusEl.textContent = `✅ Transaction submitted! Hash: ${txResponse.hash.slice(0,10)}...`;
    log('Transaction hash:', txResponse.hash);

    statusEl.textContent = '⏳ Processing transfer...';
    await txResponse.wait();
    
    statusEl.textContent = `🎉 Transfer complete! You'll receive your ${toTokenSymbol} on ${toChainName} shortly.`;

  } catch (err) {
    if (err.code === 'ACTION_REJECTED') {
      statusEl.textContent = '❌ Transaction cancelled.';
    } else {
      statusEl.textContent = 'Transfer failed: ' + (err.message || err);
    }
    log('Transfer error:', err);
  }
});

function autoDetectPlatform() {
  const url = new URL(location.href);
  const chainParam = url.searchParams.get('chain');
  if (chainParam) {
    platformInput.value = chainParam;
  }
}

autoDetectPlatform();
