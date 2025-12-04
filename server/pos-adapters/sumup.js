import { BasePosAdapter } from './base.js'

const SUMUP_API_BASE = 'https://api.sumup.com'
const SUMUP_OAUTH_URL = 'https://api.sumup.com/authorize'
const SUMUP_TOKEN_URL = 'https://api.sumup.com/token'

const TILLER_API_BASE = 'https://api.tillersystems.com/v3'

export class SumupAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'sumup'
    this.displayName = 'SumUp / Tiller'
    this.clientId = process.env.SUMUP_CLIENT_ID
    this.clientSecret = process.env.SUMUP_CLIENT_SECRET
    const domain = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://myponia.fr'
    this.redirectUri = process.env.SUMUP_REDIRECT_URI || `${domain}/api/pos/callback/sumup`
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'payments transactions.history user.app-settings',
      state: state
    })
    return `${SUMUP_OAUTH_URL}?${params.toString()}`
  }

  async handleCallback(code, state) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(SUMUP_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'SumUp OAuth failed')
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
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret
    })

    const response = await fetch(SUMUP_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error_description || 'SumUp token refresh failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async getProducts(accessToken, options = {}) {
    const response = await fetch(`${SUMUP_API_BASE}/v0.1/me/merchant-profile/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 404) {
      return this.getProductsFromTiller(accessToken, options)
    }

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch SumUp products')
    }

    return (data.items || []).map(product => this.normalizeProduct({
      id: product.id,
      name: product.name,
      sku: product.sku || product.id,
      price: product.price || 0,
      category: product.category || 'Non catégorisé'
    }))
  }

  async getProductsFromTiller(accessToken, options = {}) {
    const { restaurantId } = options
    
    if (!restaurantId) {
      return []
    }

    const response = await fetch(`${TILLER_API_BASE}/restaurants/${restaurantId}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch Tiller products')
    }

    return (data.data || []).map(product => this.normalizeProduct({
      id: product.id,
      name: product.name,
      sku: product.sku || product.id,
      price: (product.price || 0) / 100,
      category: product.category?.name || 'Non catégorisé'
    }))
  }

  async getSales(accessToken, options = {}) {
    const { startDate, endDate } = options
    
    const params = new URLSearchParams({
      oldest_time: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      newest_time: endDate || new Date().toISOString(),
      limit: '100'
    })

    const response = await fetch(`${SUMUP_API_BASE}/v0.1/me/transactions/history?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch SumUp sales')
    }

    return (data.items || []).map(tx => this.normalizeSale({
      id: tx.id,
      date: tx.timestamp,
      total: tx.amount || 0,
      items: tx.products || [],
      paymentMethod: tx.payment_type || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    return []
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/sumup'
  }

  getDemoProducts() {
    return [
      { id: 'su_001', name: 'Entrecôte 300g', sku: 'VIA-001', price: 24.00, category: 'Viandes' },
      { id: 'su_002', name: 'Filet de bar', sku: 'POI-001', price: 22.00, category: 'Poissons' },
      { id: 'su_003', name: 'Salade César', sku: 'ENT-001', price: 14.00, category: 'Entrées' },
      { id: 'su_004', name: 'Burger maison', sku: 'PLA-001', price: 16.50, category: 'Plats' },
      { id: 'su_005', name: 'Frites fraîches', sku: 'ACC-001', price: 4.50, category: 'Accompagnements' },
      { id: 'su_006', name: 'Tiramisu', sku: 'DES-001', price: 8.00, category: 'Desserts' },
      { id: 'su_007', name: 'Café gourmand', sku: 'CAF-001', price: 7.50, category: 'Cafés' },
      { id: 'su_008', name: 'Menu enfant', sku: 'MEN-001', price: 9.90, category: 'Menus' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default SumupAdapter
