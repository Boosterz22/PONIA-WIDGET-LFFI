const CHAINS = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  base: 8453,
  bsc: 56
};

document.getElementById('getQuote').addEventListener('click', async () => {
  const from = document.getElementById('fromChain').value;
  const to = document.getElementById('toChain').value;
  const amount = Number(document.getElementById('amount').value);

  const fromChainId = CHAINS[from];
  const toChainId = CHAINS[to];

  const resultBox = document.getElementById('quoteResult');
  resultBox.textContent = "Fetching best route via LI.FI...";

  try {
    const res = await fetch(`https://li.quest/v1/quote?fromChain=${fromChainId}&toChain=${toChainId}&fromToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&toToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&fromAmount=${amount * 1e6}`);
    const data = await res.json();

    const eta = data.estimatedExecutionDuration || 60;
    const estOut = data.toAmount ? (Number(data.toAmount) / 1e6).toFixed(2) : "N/A";

    resultBox.innerHTML = `
      <p>From: ${from} → To: ${to}</p>
      <p>ETA: ${eta}s</p>
      <p>Estimated Output: ${estOut} USDC</p>
    `;
  } catch (e) {
    resultBox.textContent = "Error fetching quote.";
  }
});
