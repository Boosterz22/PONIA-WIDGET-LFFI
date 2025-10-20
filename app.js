const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

let providerEVM = null;
let signer = null;
let walletType = null;
let solanaProvider = null;
let lastQuote = null;

function log(...args){
  console.log(...args);
  outputEl.textContent = (outputEl.textContent + '\n' + args.map(a => typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' ')).slice(-20000);
}
function setStatus(s){ statusEl.textContent = s; log('[status]', s); }

async function connectInjectedEVM(){
  if(window.ethereum){
    try{
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      providerEVM = new ethers.BrowserProvider(window.ethereum);
      signer = await providerEVM.getSigner();
      walletType = 'injected';
      const addr = await signer.getAddress();
      setStatus('Connected (injected) ' + addr);
      log('connected injected', addr);
      return addr;
    }catch(e){ setStatus('User rejected'); throw e; }
  } else {
    throw new Error('No injected wallet found');
  }
}

async function connectWalletConnect(){
  const WalletConnectProvider = window.WalletConnectProvider.default;
  const wcProvider = new WalletConnectProvider({
    rpc: {
      1: "https://rpc.ankr.com/eth",
      137: "https://rpc.ankr.com/polygon",
      56: "https://bsc-dataseed.binance.org/",
    },
  });
  await wcProvider.enable();
  providerEVM = new ethers.BrowserProvider(wcProvider);
  signer = await providerEVM.getSigner();
  walletType = 'walletconnect';
  const addr = await signer.getAddress();
  setStatus('Connected (WalletConnect) ' + addr);
  log('wc connected', addr);
  return addr;
}

async function connectPhantom(){
  if(window.solana && window.solana.isPhantom){
    solanaProvider = window.solana;
    await solanaProvider.connect();
    walletType = 'phantom';
    setStatus('Connected Phantom ' + solanaProvider.publicKey.toString());
    log('phantom connected', solanaProvider.publicKey.toString());
    return solanaProvider.publicKey.toString();
  } else {
    throw new Error('Phantom not found');
  }
}

async function connectAny(preferred){
  try{
    if(preferred === 'phantom'){
      return await connectPhantom();
    }
    if(window.ethereum && (preferred === 'injected' || !preferred)){
      return await connectInjectedEVM();
    }
    return await connectWalletConnect();
  } catch(e){
    log('connect error', e);
    throw e;
  }
}

async function getQuoteFromLIFI(params){
  const query = new URLSearchParams(params).toString();
  const url = `https://li.quest/v1/quote?${query}`;
  setStatus('Fetching quote from LI.FI...');
  const r = await fetch(url);
  if(!r.ok){
    const text = await r.text();
    throw new Error('LI.FI error ' + r.status + ' ' + text);
  }
  const data = await r.json();
  lastQuote = data;
  setStatus('Quote received');
  log('quote', data);
  return data;
}

async function executeRoute(route){
  if(!route) throw new Error('No route supplied');
  setStatus('Executing route, steps: ' + (route.steps?.length || 0));

  for(let i=0;i<route.steps.length;i++){
    const step = route.steps[i];
    log('step', i, step);
    if(step.action && step.action.fromType === 'EVM' || step.chain?.toLowerCase && ['ethereum','polygon','bsc','arbitrum','optimism'].includes(String(step.chain).toLowerCase())){
      const tx = step.tx;
      if(!tx){
        log('no tx in step (maybe native bridging or external). skipping.');
        continue;
      }
      if(!signer){
        throw new Error('No EVM signer connected');
      }
      const txReq = {
        to: tx.to,
        data: tx.data || '0x',
        value: tx.value ? ethers.BigInt(tx.value) : undefined,
        gasLimit: tx.gasLimit ? ethers.BigInt(tx.gasLimit) : undefined,
      };
      setStatus(`Sending tx on ${step.chain} -> ${txReq.to}`);
      log('sending evm tx', txReq);
      const txResponse = await signer.sendTransaction(txReq);
      log('txResponse', txResponse);
      setStatus('Tx sent: ' + txResponse.hash);
      await txResponse.wait();
      log('tx mined', txResponse.hash);
    } else if(step.chain && String(step.chain).toLowerCase() === 'solana'){
      if(!solanaProvider) throw new Error('No Solana wallet connected');
      const raw = step.transaction;
      if(!raw){
        log('no solana tx in step, skipping');
        continue;
      }
      const txBytes = Buffer.from(raw, 'base64');
      const { Connection, Transaction } = solanaWeb3;
      const resp = await solanaProvider.signAndSendTransaction({ serializedTransaction: txBytes });
      log('solana resp', resp);
    } else {
      log('Unknown step kind, skipping', step);
    }
  }

  setStatus('Route execution finished');
}

document.getElementById('connectBtn').addEventListener('click', async ()=>{
  try{
    const choice = prompt('connect with: injected | walletconnect | phantom (type one)');
    await connectAny(choice || undefined);
  } catch(err){
    log('connect error', err.message || err);
    setStatus('connect failed: ' + (err.message || err));
  }
});

document.getElementById('getQuoteBtn').addEventListener('click', async ()=>{
  try{
    const fromChain = document.getElementById('fromChain').value;
    const toChain   = document.getElementById('toChain').value;
    const amount = (document.querySelector('input#amount') && document.querySelector('input#amount').value) || '100000000000000000';
    const query = {
      fromChain: fromChain,
      toChain: toChain,
      fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      toToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      fromAmount: amount
    };
    const quote = await getQuoteFromLIFI(query);
    log('best route', quote);
    alert('Quote received; see logs');
  } catch(e){
    log('quote error', e);
    setStatus('Quote failed: ' + (e.message || e));
  }
});

document.getElementById('executeBtn').addEventListener('click', async ()=>{
  try{
    if(!lastQuote) throw new Error('No quote in memory. Get quote first.');
    const route = lastQuote.route || lastQuote.routes?.[0] || lastQuote;
    if(!route) throw new Error('No route found in quote');
    await executeRoute(route);
    alert('Execution done. Check logs');
  } catch(e){
    log('execute error', e);
    setStatus('Execution failed: ' + (e.message || e));
  }
});
