import { BasePosAdapter } from './base.js'

const SQUARE_API_BASE = 'https://connect.squareup.com/v2'
const SQUARE_OAUTH_URL = 'https://connect.squareup.com/oauth2/authorize'
const SQUARE_TOKEN_URL = 'https://connect.squareup.com/oauth2/token'

export class SquareAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'square'
    this.displayName = 'Square'
    this.clientId = process.env.SQUARE_CLIENT_ID
    this.clientSecret = process.env.SQUARE_CLIENT_SECRET
    const domain = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://myponia.fr'
    this.redirectUri = process.env.SQUARE_REDIRECT_URI || `${domain}/api/pos/callback/square`
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: 'ITEMS_READ INVENTORY_READ ORDERS_READ MERCHANT_PROFILE_READ',
      session: 'false',
      state: state
    })
    return `${SQUARE_OAUTH_URL}?${params.toString()}`
  }

  async handleCallback(code, state) {
    const response = await fetch(SQUARE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18'
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Square OAuth failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(data.expires_at),
      merchantId: data.merchant_id
    }
  }

  async refreshToken(refreshToken) {
    const response = await fetch(SQUARE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18'
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Square token refresh failed')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(data.expires_at)
    }
  }

  async getProducts(accessToken, options = {}) {
    const response = await fetch(`${SQUARE_API_BASE}/catalog/list?types=ITEM`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to fetch Square products')
    }

    return (data.objects || []).map(item => this.normalizeProduct({
      id: item.id,
      name: item.item_data?.name,
      sku: item.item_data?.variations?.[0]?.item_variation_data?.sku,
      price: (item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount || 0) / 100,
      category: item.item_data?.category_id || 'Non catégorisé'
    }))
  }

  async getSales(accessToken, options = {}) {
    const { startDate, endDate } = options
    const body = {
      location_ids: options.locationIds || [],
      query: {
        filter: {
          date_time_filter: {
            created_at: {
              start_at: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              end_at: endDate || new Date().toISOString()
            }
          }
        },
        sort: { sort_field: 'CREATED_AT', sort_order: 'DESC' }
      }
    }

    const response = await fetch(`${SQUARE_API_BASE}/orders/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to fetch Square sales')
    }

    return (data.orders || []).map(order => this.normalizeSale({
      id: order.id,
      date: order.created_at,
      total: (order.total_money?.amount || 0) / 100,
      items: (order.line_items || []).map(item => ({
        productId: item.catalog_object_id,
        name: item.name,
        quantity: parseInt(item.quantity),
        price: (item.base_price_money?.amount || 0) / 100
      })),
      paymentMethod: order.tenders?.[0]?.type || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    const response = await fetch(`${SQUARE_API_BASE}/inventory/counts/batch-retrieve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        catalog_object_ids: options.productIds || [],
        location_ids: options.locationIds || []
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to fetch Square inventory')
    }

    return (data.counts || []).map(count => ({
      productId: count.catalog_object_id,
      quantity: parseFloat(count.quantity) || 0,
      state: count.state
    }))
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/square'
  }

  getDemoProducts() {
    return [
      { id: 'sq_001', name: 'Café Latte', sku: 'CAF-001', price: 4.50, category: 'Boissons' },
      { id: 'sq_002', name: 'Cappuccino', sku: 'CAF-002', price: 4.00, category: 'Boissons' },
      { id: 'sq_003', name: 'Croissant', sku: 'VIE-001', price: 2.50, category: 'Viennoiseries' },
      { id: 'sq_004', name: 'Pain au chocolat', sku: 'VIE-002', price: 2.80, category: 'Viennoiseries' },
      { id: 'sq_005', name: 'Sandwich Jambon', sku: 'SAN-001', price: 6.50, category: 'Sandwichs' },
      { id: 'sq_006', name: 'Salade César', sku: 'SAL-001', price: 9.00, category: 'Salades' },
      { id: 'sq_007', name: 'Jus d\'orange frais', sku: 'JUS-001', price: 4.00, category: 'Boissons' },
      { id: 'sq_008', name: 'Cookie chocolat', sku: 'DES-001', price: 2.50, category: 'Desserts' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default SquareAdapter
