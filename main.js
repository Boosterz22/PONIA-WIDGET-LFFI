import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, polygon, bsc, arbitrum } from '@reown/appkit/networks'

const statusEl = document.getElementById('status');
const out = document.getElementById('output');
const btnGetQuote = document.getElementById('btnGetQuote');
const btnConfirm = document.getElementById('btnConfirm');
const platformInput = document.getElementById('platformChain');
const recapEl = document.getElementById('recap');

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

function formatAmount(amount, decimals = 18) {
  const val = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = val / divisor;
  const frac = val % divisor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 6);
  return `${whole}.${fracStr}`;
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

btnGetQuote.addEventListener('click', async () => {
  try {
    recapEl.style.display = 'none';
    statusEl.textContent = 'Building quote...';
    const fromChain = document.getElementById('fromChain').value;
    const toChain = document.getElementById('toChain').value;
    const readableAmount = document.getElementById('amount').value;

    const fromAddress = await getConnectedAddress();
    statusEl.textContent = 'Connected: ' + fromAddress.slice(0,6) + '...' + fromAddress.slice(-4);

    const fromAmount = toSmallestUnit(fromChain, readableAmount);
    const fromToken = nativeTokenForChain(fromChain);
    const toToken = nativeTokenForChain(toChain);
    const fromChainId = getChainId(fromChain);
    const toChainId = getChainId(toChain);
    const toAddress = fromAddress;

    const base = 'https://li.quest/v1/quote';
    const params = new URLSearchParams({
      fromChain: fromChainId,
      toChain: toChainId,
      fromToken: fromToken,
      toToken: toToken,
      fromAmount: fromAmount,
      fromAddress: fromAddress,
      toAddress: toAddress
    });

    const url = base + '?' + params.toString();

    statusEl.textContent = 'Fetching quote from LI.FI...';
    log('fetching quote url', url);

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      throw new Error('LI.FI error ' + r.status + ': ' + txt);
    }
    const json = await r.json();
    lastQuote = json;
    
    displayRecap(json, fromChain, toChain, readableAmount);
    
    statusEl.textContent = 'Quote ready! Review and confirm below.';
    log(json);
    out.textContent = JSON.stringify(json, null, 2);

  } catch (err) {
    statusEl.textContent = 'Quote failed: ' + (err.message || err);
    log('quote failed', err);
    recapEl.style.display = 'none';
  }
});

function displayRecap(quote, fromChain, toChain, readableAmount) {
  const fromChainId = getChainId(fromChain);
  const toChainId = getChainId(toChain);
  const fromToken = quote.action.fromToken.symbol || 'ETH';
  const toToken = quote.action.toToken.symbol || 'POL';
  const toAmount = formatAmount(quote.estimate.toAmount, quote.action.toToken.decimals);
  const bridge = quote.toolDetails?.name || 'LI.FI';
  const duration = quote.estimate.executionDuration || 0;

  document.getElementById('recapFrom').textContent = getChainName(fromChainId);
  document.getElementById('recapTo').textContent = getChainName(toChainId);
  document.getElementById('recapSend').textContent = `${readableAmount} ${fromToken}`;
  document.getElementById('recapReceive').textContent = `~${toAmount} ${toToken}`;
  document.getElementById('recapBridge').textContent = bridge;
  document.getElementById('recapTime').textContent = `~${duration}s`;

  recapEl.style.display = 'block';
}

btnConfirm.addEventListener('click', async () => {
  try {
    if (!lastQuote) throw new Error('No quote available. Get a quote first.');
    if (!lastQuote.transactionRequest) {
      throw new Error('No transaction data in quote. Please try again.');
    }

    const txReq = lastQuote.transactionRequest;
    const toChainName = getChainName(lastQuote.action.toChainId);
    
    statusEl.textContent = 'Preparing transaction...';

    const provider = ethersAdapter.getProvider();
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    
    const tx = {
      to: txReq.to,
      data: txReq.data,
      value: txReq.value || '0x0',
      gasLimit: txReq.gasLimit,
      gasPrice: txReq.gasPrice
    };

    statusEl.textContent = '⏳ Please confirm the transaction in your wallet...';
    const txResponse = await signer.sendTransaction(tx);
    
    statusEl.textContent = `✅ Transaction submitted! Hash: ${txResponse.hash.slice(0,10)}...`;
    log('Transaction hash:', txResponse.hash);

    statusEl.textContent = '⏳ Processing your transfer... This may take a few seconds.';
    await txResponse.wait();
    
    statusEl.textContent = `🎉 Transfer complete! You'll receive your tokens on ${toChainName} shortly.`;
    recapEl.style.display = 'none';

  } catch (e) {
    if (e.code === 'ACTION_REJECTED') {
      statusEl.textContent = 'Transaction cancelled by user.';
    } else {
      statusEl.textContent = 'Transfer failed: ' + (e.message || e);
    }
    log('Execute error:', e);
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
