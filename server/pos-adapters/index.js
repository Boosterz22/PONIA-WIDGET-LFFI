import { SquareAdapter } from './square.js'
import { ZettleAdapter } from './zettle.js'
import { HiboutikAdapter } from './hiboutik.js'
import { SumupAdapter } from './sumup.js'
import { LightspeedXAdapter } from './lightspeed-x.js'
import { LightspeedKAdapter } from './lightspeed-k.js'

const adapters = {
  'square': SquareAdapter,
  'zettle': ZettleAdapter,
  'hiboutik': HiboutikAdapter,
  'sumup': SumupAdapter,
  'lightspeed-x': LightspeedXAdapter,
  'lightspeed-k': LightspeedKAdapter
}

export const SUPPORTED_POS_SYSTEMS = [
  {
    id: 'square',
    name: 'Square',
    logo: '🟦',
    description: 'Caisse tout-en-un populaire',
    category: 'universal',
    authType: 'oauth',
    popular: true,
    available: true
  },
  {
    id: 'zettle',
    name: 'Zettle (PayPal)',
    logo: '💰',
    description: 'Solution PayPal pour TPE',
    category: 'universal',
    authType: 'oauth',
    popular: true,
    available: true
  },
  {
    id: 'hiboutik',
    name: 'Hiboutik',
    logo: '🛒',
    description: 'Caisse française pour commerce',
    category: 'retail',
    authType: 'apikey',
    popular: true,
    available: true
  },
  {
    id: 'sumup',
    name: 'SumUp / Tiller',
    logo: '📱',
    description: 'Leader restauration en France',
    category: 'restaurant',
    authType: 'oauth',
    popular: true,
    available: true
  },
  {
    id: 'lightspeed-x',
    name: 'Lightspeed X-Series',
    logo: '⚡',
    description: 'Retail international',
    category: 'retail',
    authType: 'oauth',
    popular: false,
    available: true
  },
  {
    id: 'lightspeed-k',
    name: 'Lightspeed K-Series',
    logo: '🍽️',
    description: 'Restaurant international',
    category: 'restaurant',
    authType: 'oauth',
    popular: false,
    available: true
  }
]

export function getAdapter(provider) {
  const AdapterClass = adapters[provider]
  if (!AdapterClass) {
    throw new Error(`Unknown POS provider: ${provider}`)
  }
  return new AdapterClass()
}

export function getSupportedProviders() {
  return SUPPORTED_POS_SYSTEMS
}

export function isProviderSupported(provider) {
  return provider in adapters
}

export function getProviderInfo(provider) {
  return SUPPORTED_POS_SYSTEMS.find(p => p.id === provider)
}

export function isDemoMode(provider) {
  const envKeys = {
    'square': ['SQUARE_CLIENT_ID', 'SQUARE_CLIENT_SECRET'],
    'zettle': ['ZETTLE_CLIENT_ID', 'ZETTLE_CLIENT_SECRET'],
    'hiboutik': [],
    'sumup': ['SUMUP_CLIENT_ID', 'SUMUP_CLIENT_SECRET'],
    'lightspeed-x': ['LIGHTSPEED_X_CLIENT_ID', 'LIGHTSPEED_X_CLIENT_SECRET'],
    'lightspeed-k': ['LIGHTSPEED_K_CLIENT_ID', 'LIGHTSPEED_K_CLIENT_SECRET']
  }

  const keys = envKeys[provider] || []
  if (keys.length === 0) {
    return false
  }
  return keys.some(key => !process.env[key])
}

export {
  SquareAdapter,
  ZettleAdapter,
  HiboutikAdapter,
  SumupAdapter,
  LightspeedXAdapter,
  LightspeedKAdapter
}
