async function getQuote() {
  const fromChain = "ethereum";
  const toChain = "bsc";
  const fromToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC sur Ethereum
  const toToken = "0x55d398326f99059fF775485246999027B3197955";   // USDT sur BSC
  const fromAmount = "1000000000"; // 1000 USDC avec 6 décimales

  const url = `https://li.quest/v1/quote?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
}
