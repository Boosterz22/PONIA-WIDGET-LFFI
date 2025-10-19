const CHAINS = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  base: 8453,
  bsc: 56
};

const CHAIN_NAMES = {
  1: 'Ethereum',
  137: 'Polygon',
  42161: 'Arbitrum',
  8453: 'Base',
  56: 'BNB Chain'
};

let detectedChainId = null;

document.getElementById('connect').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      detectedChainId = parseInt(chainId, 16);
      
      document.getElementById('detChain').textContent = CHAIN_NAMES[detectedChainId] || `Chain ${detectedChainId}`;
      statusEl.textContent = `✓ Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
    } catch (error) {
      statusEl.textContent = 'Connection failed';
    }
  } else {
    statusEl.textContent = 'No wallet detected (simulating Polygon)';
    detectedChainId = 137;
    document.getElementById('detChain').textContent = 'Polygon (simulated)';
  }
});

document.getElementById('getQuote').addEventListener('click', async () => {
  const to = document.getElementById('toChain').value;
  const amount = Number(document.getElementById('amount').value);
  
  const fromChainId = detectedChainId || 137;
  const toChainId = CHAINS[to];
  
  const statusEl = document.getElementById('status');
  const quoteBox = document.getElementById('quoteBox');
  
  statusEl.textContent = "Fetching best route via LI.FI...";
  quoteBox.classList.add('hidden');

  try {
    const res = await fetch(`https://li.quest/v1/quote?fromChain=${fromChainId}&toChain=${toChainId}&fromToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&toToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&fromAmount=${amount * 1e6}`);
    const data = await res.json();

    const eta = data.estimate?.executionDuration || 60;
    const estOut = data.estimate?.toAmount ? (Number(data.estimate.toAmount) / 1e6).toFixed(2) : "N/A";

    document.getElementById('fromSummary').textContent = `${CHAIN_NAMES[fromChainId]} • ${amount} USDC`;
    document.getElementById('toSummary').textContent = `${to.charAt(0).toUpperCase() + to.slice(1)} • USDC`;
    document.getElementById('eta').textContent = `~${eta}s`;
    document.getElementById('outAmount').textContent = `${estOut} USDC`;
    
    quoteBox.classList.remove('hidden');
    statusEl.textContent = '✓ Quote ready';
  } catch (e) {
    statusEl.textContent = "Error fetching quote. Check console.";
    console.error('LI.FI error:', e);
  }
});

document.getElementById('simulate').addEventListener('click', () => {
  document.getElementById('done').classList.remove('hidden');
  document.getElementById('status').textContent = '✓ Swap simulated successfully';
});
