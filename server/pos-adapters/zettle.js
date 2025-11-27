import { BasePosAdapter } from './base.js'

const ZETTLE_API_BASE = 'https://products.izettle.com'
const ZETTLE_OAUTH_URL = 'https://oauth.zettle.com/authorize'
const ZETTLE_TOKEN_URL = 'https://oauth.zettle.com/token'
const ZETTLE_INVENTORY_API = 'https://inventory.izettle.com'
const ZETTLE_PURCHASE_API = 'https://purchase.izettle.com'

export class ZettleAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'zettle'
    this.displayName = 'Zettle (PayPal)'
    this.clientId = process.env.ZETTLE_CLIENT_ID
    this.clientSecret = process.env.ZETTLE_CLIENT_SECRET
    this.redirectUri = process.env.ZETTLE_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN || 'https://myponia.fr'}/api/pos/callback/zettle`
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'READ:PRODUCT READ:PURCHASE READ:INVENTORY',
      state: state
    })
    return `${ZETTLE_OAUTH_URL}?${params.toString()}`
  }

  async handleCallback(code, state) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    })

    const response = await fetch(ZETTLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Zettle OAuth failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async refreshToken(refreshToken) {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })

    const response = await fetch(ZETTLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Zettle token refresh failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async getProducts(accessToken, options = {}) {
    const response = await fetch(`${ZETTLE_API_BASE}/organizations/self/products/v2`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Zettle products')
    }

    return (data || []).map(product => this.normalizeProduct({
      id: product.uuid,
      name: product.name,
      sku: product.variants?.[0]?.sku,
      price: (product.variants?.[0]?.price?.amount || 0) / 100,
      category: product.category?.name || 'Non catégorisé'
    }))
  }

  async getSales(accessToken, options = {}) {
    const { startDate, endDate } = options
    const params = new URLSearchParams({
      startDate: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate || new Date().toISOString()
    })

    const response = await fetch(`${ZETTLE_PURCHASE_API}/purchases/v2?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Zettle sales')
    }

    return (data.purchases || []).map(purchase => this.normalizeSale({
      id: purchase.purchaseUUID,
      date: purchase.timestamp,
      total: (purchase.amount || 0) / 100,
      items: (purchase.products || []).map(item => ({
        productId: item.productUuid,
        name: item.name,
        quantity: item.quantity,
        price: (item.unitPrice || 0) / 100
      })),
      paymentMethod: purchase.paymentType || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    const response = await fetch(`${ZETTLE_INVENTORY_API}/organizations/self/inventory`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Zettle inventory')
    }

    return (data.trackedProducts || []).map(item => ({
      productId: item.productUuid,
      variantId: item.variantUuid,
      quantity: item.balance || 0
    }))
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/zettle'
  }

  getDemoProducts() {
    return [
      { id: 'zt_001', name: 'Bière pression 25cl', sku: 'BIE-001', price: 4.50, category: 'Bières' },
      { id: 'zt_002', name: 'Bière pression 50cl', sku: 'BIE-002', price: 7.50, category: 'Bières' },
      { id: 'zt_003', name: 'Coca-Cola', sku: 'SOF-001', price: 3.50, category: 'Soft' },
      { id: 'zt_004', name: 'Orangina', sku: 'SOF-002', price: 3.50, category: 'Soft' },
      { id: 'zt_005', name: 'Café expresso', sku: 'CAF-001', price: 2.00, category: 'Cafés' },
      { id: 'zt_006', name: 'Verre de vin rouge', sku: 'VIN-001', price: 5.00, category: 'Vins' },
      { id: 'zt_007', name: 'Mojito', sku: 'COC-001', price: 9.00, category: 'Cocktails' },
      { id: 'zt_008', name: 'Planche apéro', sku: 'FOO-001', price: 14.00, category: 'Food' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default ZettleAdapter
