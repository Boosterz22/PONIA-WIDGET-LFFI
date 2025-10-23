// WHITE-LABEL CONFIGURATION
// Personnalisation par casino via URL params

export const WHITE_LABEL_THEMES = {
  default: {
    primaryColor: '#FFD73F',
    logo: 'P',
    name: 'PONIA',
    borderRadius: '16px'
  },
  casino1: {
    primaryColor: '#FF6B6B',
    logo: 'C1',
    name: 'Casino One',
    borderRadius: '12px'
  },
  stake: {
    primaryColor: '#00E701',
    logo: 'S',
    name: 'Stake',
    borderRadius: '8px'
  },
  rollbit: {
    primaryColor: '#9D4EDD',
    logo: 'R',
    name: 'Rollbit',
    borderRadius: '20px'
  }
};

// Fonction pour récupérer le thème depuis l'URL
export function getTheme() {
  const params = new URLSearchParams(window.location.search);
  const themeId = params.get('theme') || 'default';
  return WHITE_LABEL_THEMES[themeId] || WHITE_LABEL_THEMES.default;
}

// Appliquer le thème CSS
export function applyTheme(theme) {
  document.documentElement.style.setProperty('--accent', theme.primaryColor);
  document.documentElement.style.setProperty('--widget-border-radius', theme.borderRadius);
}

// MULTI-LANGUE CONFIGURATION
export const TRANSLATIONS = {
  en: {
    title: 'PONIA',
    subtitle: 'Cross-chain swap',
    platformUses: 'This platform uses:',
    sendFrom: 'Send from which chain?',
    amountLabel: 'Amount to send',
    connectWallet: 'Connect Wallet',
    detectInfo: 'Platform blockchain detected automatically. Choose which wallet you want to send from.',
    confirmSwap: 'Confirm swap',
    converting: 'Converting your funds to platform currency',
    processingSwap: 'Processing swap...',
    swapSuccessful: 'Swap Successful!',
    fundsArrived: 'Funds arrived on',
    txId: 'Transaction ID',
    close: 'Close',
    feeBreakdown: 'Transaction Details',
    amountToTransfer: 'Amount to transfer',
    poniaFee: 'PONIA fee',
    totalDebited: 'Total debited',
    youllReceive: "You'll receive",
    estimatedTime: 'Estimated time',
    minutes: 'min',
    selectToken: 'Select token'
  },
  fr: {
    title: 'PONIA',
    subtitle: 'Échange cross-chain',
    platformUses: 'Cette plateforme utilise :',
    sendFrom: 'Envoyer depuis quelle chaîne ?',
    amountLabel: 'Montant à envoyer',
    connectWallet: 'Connecter Portefeuille',
    detectInfo: 'Blockchain de la plateforme détectée automatiquement. Choisissez depuis quel portefeuille envoyer.',
    confirmSwap: 'Confirmer l\'échange',
    converting: 'Conversion de vos fonds vers la devise de la plateforme',
    processingSwap: 'Traitement de l\'échange...',
    swapSuccessful: 'Échange Réussi !',
    fundsArrived: 'Fonds arrivés sur',
    txId: 'ID de Transaction',
    close: 'Fermer',
    feeBreakdown: 'Détails de la Transaction',
    amountToTransfer: 'Montant à transférer',
    poniaFee: 'Frais PONIA',
    totalDebited: 'Total débité',
    youllReceive: 'Vous recevrez',
    estimatedTime: 'Temps estimé',
    minutes: 'min',
    selectToken: 'Sélectionner token'
  },
  es: {
    title: 'PONIA',
    subtitle: 'Intercambio cross-chain',
    platformUses: 'Esta plataforma usa:',
    sendFrom: '¿Enviar desde qué cadena?',
    amountLabel: 'Cantidad a enviar',
    connectWallet: 'Conectar Cartera',
    detectInfo: 'Blockchain de la plataforma detectada automáticamente. Elige desde qué cartera quieres enviar.',
    confirmSwap: 'Confirmar intercambio',
    converting: 'Convirtiendo tus fondos a la moneda de la plataforma',
    processingSwap: 'Procesando intercambio...',
    swapSuccessful: '¡Intercambio Exitoso!',
    fundsArrived: 'Fondos llegaron a',
    txId: 'ID de Transacción',
    close: 'Cerrar',
    feeBreakdown: 'Detalles de la Transacción',
    amountToTransfer: 'Cantidad a transferir',
    poniaFee: 'Comisión PONIA',
    totalDebited: 'Total debitado',
    youllReceive: 'Recibirás',
    estimatedTime: 'Tiempo estimado',
    minutes: 'min',
    selectToken: 'Seleccionar token'
  },
  pt: {
    title: 'PONIA',
    subtitle: 'Troca cross-chain',
    platformUses: 'Esta plataforma usa:',
    sendFrom: 'Enviar de qual chain?',
    amountLabel: 'Quantia para enviar',
    connectWallet: 'Conectar Carteira',
    detectInfo: 'Blockchain da plataforma detectada automaticamente. Escolha de qual carteira você quer enviar.',
    confirmSwap: 'Confirmar troca',
    converting: 'Convertendo seus fundos para a moeda da plataforma',
    processingSwap: 'Processando troca...',
    swapSuccessful: 'Troca Bem-Sucedida!',
    fundsArrived: 'Fundos chegaram em',
    txId: 'ID da Transação',
    close: 'Fechar',
    feeBreakdown: 'Detalhes da Transação',
    amountToTransfer: 'Quantia para transferir',
    poniaFee: 'Taxa PONIA',
    totalDebited: 'Total debitado',
    youllReceive: 'Você receberá',
    estimatedTime: 'Tempo estimado',
    minutes: 'min',
    selectToken: 'Selecionar token'
  },
  zh: {
    title: 'PONIA',
    subtitle: '跨链交换',
    platformUses: '此平台使用：',
    sendFrom: '从哪条链发送？',
    amountLabel: '发送数量',
    connectWallet: '连接钱包',
    detectInfo: '自动检测平台区块链。选择您要发送的钱包。',
    confirmSwap: '确认交换',
    converting: '正在将您的资金转换为平台货币',
    processingSwap: '处理交换中...',
    swapSuccessful: '交换成功！',
    fundsArrived: '资金已到达',
    txId: '交易ID',
    close: '关闭',
    feeBreakdown: '交易详情',
    amountToTransfer: '转账金额',
    poniaFee: 'PONIA费用',
    totalDebited: '总扣款',
    youllReceive: '您将收到',
    estimatedTime: '预计时间',
    minutes: '分钟',
    selectToken: '选择代币'
  }
};

// Fonction pour détecter la langue
export function detectLanguage() {
  // 1. Depuis URL
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if (urlLang && TRANSLATIONS[urlLang]) {
    return urlLang;
  }
  
  // 2. Depuis navigateur
  const browserLang = navigator.language.split('-')[0];
  if (TRANSLATIONS[browserLang]) {
    return browserLang;
  }
  
  // 3. Par défaut
  return 'en';
}

// Fonction pour obtenir les traductions
export function getTranslations(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
