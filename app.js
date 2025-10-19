const CHAIN_OPTIONS = [
  { key: 'ethereum', label: 'Ethereum (ETH)', decimals: 18 },
  { key: 'polygon',  label: 'Polygon (MATIC)', decimals: 18 },
  { key: 'bsc',      label: 'BNB Chain (BNB)', decimals: 18 },
  { key: 'arbitrum', label: 'Arbitrum (ETH)', decimals: 18 },
  { key: 'base',     label: 'Base (ETH)', decimals: 18 },
  { key: 'optimism', label: 'Optimism (ETH)', decimals: 18 },
  { key: 'avalanche',label: 'Avalanche (AVAX)', decimals: 18 },
];

const LI_FI_QUOTE = 'https://li.quest/v1/quote';

const els = {
  overlay: document.getElementById('ponia-overlay'),
  modal: document.getElementById('ponia-modal'),
  detected: document.getElementById('detectedChain'),
  fromChain: document.getElementById('fromChain'),
  toChain: document.getElementById('toChain'),
  amount: document.getElementById('fromAmount'),
  quoteBtn: document.getElementById('quoteBtn'),
  routeLabel: document.getElementById('routeLabel'),
  toolLabel: document.getElementById('toolLabel'),
  etaLabel: document.getElementById('etaLabel'),
  outLabel: document.getElementById('outLabel'),
  errorBox: document.getElementById('errorBox')
};

function populateChains(selectEl, selectedKey) {
  selectEl.innerHTML = '';
  CHAIN_OPTIONS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.key;
    opt.textContent = c.label;
    if (selectedKey && c.key === selectedKey) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

function toWei(amountStr, decimals = 18) {
  if (!amountStr || isNaN(+amountStr)) return '0';
  const [intPart, fracPart = ''] = amountStr.split('.');
  const frac = (fracPart + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt(intPart + frac).toString();
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

let platformChain = null;

async function fetchQuote({ fromChain, toChain, amountWei }) {
  const params = new URLSearchParams({
    fromChain,
    toChain,
    fromToken: '0x0000000000000000000000000000000000000000',
    toToken:   '0x0000000000000000000000000000000000000000',
    fromAmount: amountWei
  });

  const res = await fetch(`${LI_FI_QUOTE}?${params.toString()}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`LI.FI error ${res.status}: ${txt}`);
  }
  return res.json();
}

function resetResult() {
  els.routeLabel.textContent = '–';
  els.toolLabel.textContent = '–';
  els.etaLabel.textContent = '–';
  els.outLabel.textContent = '–';
  els.errorBox.classList.add('hidden');
  els.errorBox.textContent = '';
}

async function onQuote() {
  try {
    resetResult();

    const fromKey = els.fromChain.value;
    const toKey   = els.toChain.value;
    const amount  = els.amount.value.trim();

    if (!amount || Number(amount) <= 0) {
      throw new Error('Please enter a valid amount.');
    }
    if (fromKey === toKey) {
      throw new Error('From chain and destination chain must be different.');
    }

    const decFrom = CHAIN_OPTIONS.find(c => c.key === fromKey)?.decimals ?? 18;
    const wei = toWei(amount, decFrom);

    els.quoteBtn.disabled = true;
    els.quoteBtn.textContent = 'Quoting…';

    const data = await fetchQuote({ fromChain: fromKey, toChain: toKey, amountWei: wei });

    const est = data?.estimate || data?.toAmount ? data : null;

    const tool = data?.tools?.[0]?.name || data?.tool || '—';
    const etaSec = data?.estimate?.executionDuration || data?.estimate?.duration || null;
    const toAmount = data?.estimate?.toAmount || data?.toAmount || null;

    els.routeLabel.textContent = `${fromKey} → ${toKey}`;
    els.toolLabel.textContent  = tool;
    els.etaLabel.textContent   = etaSec ? `${etaSec}s` : '—';
    els.outLabel.textContent   = toAmount ? `${toAmount} (wei native)` : '—';

  } catch (err) {
    els.errorBox.classList.remove('hidden');
    els.errorBox.textContent = String(err.message || err);
  } finally {
    els.quoteBtn.disabled = false;
    els.quoteBtn.textContent = 'Get quote';
  }
}

window.openPonia = function(config = {}) {
  platformChain = getQueryParam('chain') || config.chain || null;

  populateChains(els.fromChain);
  populateChains(els.toChain, platformChain || 'polygon');
  resetResult();
  els.amount.value = '';

  els.detected.textContent = platformChain || '—';

  els.overlay.classList.add('show');
  els.modal.classList.add('show');
};

window.closePonia = function() {
  els.overlay.classList.remove('show');
  els.modal.classList.remove('show');
};

els.quoteBtn.addEventListener('click', onQuote);

const auto = getQueryParam('chain');
if (auto) {
  openPonia({ chain: auto });
}
