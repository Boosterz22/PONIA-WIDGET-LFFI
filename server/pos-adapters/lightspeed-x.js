import { BasePosAdapter } from './base.js'

const LIGHTSPEED_X_API_BASE = 'https://api.vendhq.com/2.0'
const LIGHTSPEED_OAUTH_URL = 'https://secure.vendhq.com/connect'
const LIGHTSPEED_TOKEN_URL = 'https://api.vendhq.com/1.0/token'

export class LightspeedXAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'lightspeed-x'
    this.displayName = 'Lightspeed X-Series (Retail)'
    this.clientId = process.env.LIGHTSPEED_X_CLIENT_ID
    this.clientSecret = process.env.LIGHTSPEED_X_CLIENT_SECRET
    const domain = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://myponia.fr'
    this.redirectUri = process.env.LIGHTSPEED_X_REDIRECT_URI || `${domain}/api/pos/callback/lightspeed-x`
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state
    })
    return `${LIGHTSPEED_OAUTH_URL}?${params.toString()}`
  }

  async handleCallback(code, state) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(LIGHTSPEED_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Lightspeed OAuth failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      domainPrefix: data.domain_prefix
    }
  }

  async refreshToken(refreshToken) {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(LIGHTSPEED_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Lightspeed token refresh failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async getProducts(accessToken, options = {}) {
    const { domainPrefix } = options
    const baseUrl = domainPrefix ? `https://${domainPrefix}.vendhq.com/api/2.0` : LIGHTSPEED_X_API_BASE
    
    const response = await fetch(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed products')
    }

    return (data.data || []).map(product => this.normalizeProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: parseFloat(product.price_including_tax) || 0,
      category: product.type?.name || 'Non catégorisé',
      quantity: product.inventory?.[0]?.inventory_level || 0
    }))
  }

  async getSales(accessToken, options = {}) {
    const { domainPrefix, startDate, endDate } = options
    const baseUrl = domainPrefix ? `https://${domainPrefix}.vendhq.com/api/2.0` : LIGHTSPEED_X_API_BASE
    
    const params = new URLSearchParams()
    if (startDate) params.append('after', startDate)
    if (endDate) params.append('before', endDate)
    
    const response = await fetch(`${baseUrl}/sales?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed sales')
    }

    return (data.data || []).map(sale => this.normalizeSale({
      id: sale.id,
      date: sale.sale_date,
      total: parseFloat(sale.total_price_incl) || 0,
      items: (sale.line_items || []).map(item => ({
        productId: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price_total) || 0
      })),
      paymentMethod: sale.payments?.[0]?.payment_type?.name || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    const { domainPrefix } = options
    const baseUrl = domainPrefix ? `https://${domainPrefix}.vendhq.com/api/2.0` : LIGHTSPEED_X_API_BASE
    
    const response = await fetch(`${baseUrl}/inventory`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed inventory')
    }

    return (data.data || []).map(item => ({
      productId: item.product_id,
      outletId: item.outlet_id,
      quantity: parseFloat(item.inventory_level) || 0
    }))
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/lightspeed-x'
  }

  getDemoProducts() {
    return [
      { id: 'lsx_001', name: 'T-shirt coton bio', sku: 'VET-001', price: 29.00, category: 'Vêtements' },
      { id: 'lsx_002', name: 'Jean slim', sku: 'VET-002', price: 79.00, category: 'Vêtements' },
      { id: 'lsx_003', name: 'Sneakers blanches', sku: 'CHU-001', price: 89.00, category: 'Chaussures' },
      { id: 'lsx_004', name: 'Sac à main cuir', sku: 'ACC-001', price: 120.00, category: 'Accessoires' },
      { id: 'lsx_005', name: 'Ceinture cuir', sku: 'ACC-002', price: 45.00, category: 'Accessoires' },
      { id: 'lsx_006', name: 'Montre classique', sku: 'BIJ-001', price: 150.00, category: 'Bijoux' },
      { id: 'lsx_007', name: 'Parfum 50ml', sku: 'PAR-001', price: 65.00, category: 'Parfums' },
      { id: 'lsx_008', name: 'Écharpe laine', sku: 'ACC-003', price: 35.00, category: 'Accessoires' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default LightspeedXAdapter
