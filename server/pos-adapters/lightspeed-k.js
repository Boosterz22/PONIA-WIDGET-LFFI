import { BasePosAdapter } from './base.js'

const LIGHTSPEED_K_API_BASE = 'https://api.lsk.lightspeed.app'
const LIGHTSPEED_K_OAUTH_URL = 'https://cloud.lsk.lightspeed.app/oauth/authorize'
const LIGHTSPEED_K_TOKEN_URL = 'https://cloud.lsk.lightspeed.app/oauth/token'

export class LightspeedKAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'lightspeed-k'
    this.displayName = 'Lightspeed K-Series (Restaurant)'
    this.clientId = process.env.LIGHTSPEED_K_CLIENT_ID
    this.clientSecret = process.env.LIGHTSPEED_K_CLIENT_SECRET
    const domain = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://myponia.fr'
    this.redirectUri = process.env.LIGHTSPEED_K_REDIRECT_URI || `${domain}/api/pos/callback/lightspeed-k`
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state
    })
    return `${LIGHTSPEED_K_OAUTH_URL}?${params.toString()}`
  }

  async handleCallback(code, state) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(LIGHTSPEED_K_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Lightspeed K-Series OAuth failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      companyId: data.company_id
    }
  }

  async refreshToken(refreshToken) {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(LIGHTSPEED_K_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Lightspeed K-Series token refresh failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async getProducts(accessToken, options = {}) {
    const { companyId } = options
    
    const response = await fetch(`${LIGHTSPEED_K_API_BASE}/api/v2/companies/${companyId}/menu/items`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed K-Series products')
    }

    return (data.data || []).map(product => this.normalizeProduct({
      id: product.id,
      name: product.name,
      sku: product.sku || product.id,
      price: parseFloat(product.price) || 0,
      category: product.category?.name || 'Non catégorisé'
    }))
  }

  async getSales(accessToken, options = {}) {
    const { companyId, startDate, endDate } = options
    
    const params = new URLSearchParams()
    if (startDate) params.append('from', startDate)
    if (endDate) params.append('to', endDate)
    
    const response = await fetch(`${LIGHTSPEED_K_API_BASE}/api/v2/companies/${companyId}/orders?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed K-Series sales')
    }

    return (data.data || []).map(order => this.normalizeSale({
      id: order.id,
      date: order.created_at,
      total: parseFloat(order.total) || 0,
      items: (order.items || []).map(item => ({
        productId: item.menu_item_id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price) || 0
      })),
      paymentMethod: order.payments?.[0]?.type || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    const { companyId } = options
    
    const response = await fetch(`${LIGHTSPEED_K_API_BASE}/api/v2/companies/${companyId}/inventory`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Lightspeed K-Series inventory')
    }

    return (data.data || []).map(item => ({
      productId: item.menu_item_id,
      locationId: item.location_id,
      quantity: parseFloat(item.quantity) || 0
    }))
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/lightspeed-k'
  }

  getDemoProducts() {
    return [
      { id: 'lsk_001', name: 'Pizza Margherita', sku: 'PIZ-001', price: 12.00, category: 'Pizzas' },
      { id: 'lsk_002', name: 'Pizza 4 Fromages', sku: 'PIZ-002', price: 14.00, category: 'Pizzas' },
      { id: 'lsk_003', name: 'Pâtes Carbonara', sku: 'PAT-001', price: 13.00, category: 'Pâtes' },
      { id: 'lsk_004', name: 'Risotto aux champignons', sku: 'RIS-001', price: 15.00, category: 'Risottos' },
      { id: 'lsk_005', name: 'Bruschetta', sku: 'ENT-001', price: 8.00, category: 'Entrées' },
      { id: 'lsk_006', name: 'Tiramisu', sku: 'DES-001', price: 7.00, category: 'Desserts' },
      { id: 'lsk_007', name: 'Café espresso', sku: 'CAF-001', price: 2.50, category: 'Cafés' },
      { id: 'lsk_008', name: 'Chianti (verre)', sku: 'VIN-001', price: 6.00, category: 'Vins' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default LightspeedKAdapter
