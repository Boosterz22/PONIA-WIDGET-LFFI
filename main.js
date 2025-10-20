import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, polygon, bsc, arbitrum } from '@reown/appkit/networks'

const statusEl = document.getElementById('status');
const out = document.getElementById('output');
const btnGetQuote = document.getElementById('btnGetQuote');
const btnExecute = document.getElementById('btnExecute');
const platformInput = document.getElementById('platformChain');

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

async function getConnectedAddress() {
  try {
    const provider = ethersAdapter.getProvider();
    if (!provider) {
      throw new Error('No provider available. Please connect your wallet first.');
    }
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    throw new Error('Wallet not connected. Click "Connect Wallet" button first.');
  }
}

btnGetQuote.addEventListener('click', async () => {
  try {
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
    const toAddress = '0x000000000000000000000000000000000000dEaD';

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
    statusEl.textContent = 'Quote fetched successfully!';
    log(json);
    out.textContent = JSON.stringify(json, null, 2);

  } catch (err) {
    statusEl.textContent = 'Quote failed: ' + (err.message || err);
    log('quote failed', err);
  }
});

btnExecute.addEventListener('click', async () => {
  try {
    if (!lastQuote) throw new Error('No quote in memory. Get quote first.');
    statusEl.textContent = 'Preparing to execute route...';

    let found = null;
    for (const step of lastQuote.steps || []) {
      if (step.calls && step.calls.length) {
        for (const call of step.calls) {
          if (call.to && call.data && call.value !== undefined) {
            found = { step, call };
            break;
          }
        }
      }
      if (found) break;
    }

    if (!found) {
      statusEl.textContent = 'No simple EVM tx found — use LI.FI widget/SDK to execute full route.';
      log('execute: route details', lastQuote);
      return;
    }

    const provider = ethersAdapter.getProvider();
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    const call = found.call;
    
    const tx = {
      to: call.to,
      data: call.data,
      value: call.value ? BigInt(call.value) : 0n
    };

    statusEl.textContent = 'Sending transaction via wallet...';
    const txResponse = await signer.sendTransaction(tx);
    statusEl.textContent = 'Transaction submitted: ' + txResponse.hash;
    log('txHash', txResponse.hash);

    statusEl.textContent = 'Waiting for confirmation...';
    await txResponse.wait();
    statusEl.textContent = 'Transaction confirmed! Hash: ' + txResponse.hash;

  } catch (e) {
    statusEl.textContent = 'Execute failed: ' + (e.message || e);
    log('execute error', e);
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
