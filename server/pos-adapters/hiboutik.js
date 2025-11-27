import { BasePosAdapter } from './base.js'

export class HiboutikAdapter extends BasePosAdapter {
  constructor(config = {}) {
    super(config)
    this.name = 'hiboutik'
    this.displayName = 'Hiboutik'
  }

  getApiBase(account) {
    return `https://${account}.hiboutik.com/api`
  }

  getAuthorizationUrl(state) {
    return null
  }

  async authenticate(credentials) {
    const { account, email, apiKey } = credentials
    
    const response = await fetch(`${this.getApiBase(account)}/store/1`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Invalid Hiboutik credentials')
    }

    const data = await response.json()
    
    return {
      accessToken: Buffer.from(`${email}:${apiKey}`).toString('base64'),
      account: account,
      storeInfo: data
    }
  }

  async getProducts(accessToken, options = {}) {
    const { account } = options
    
    const response = await fetch(`${this.getApiBase(account)}/products/`, {
      headers: {
        'Authorization': `Basic ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Hiboutik products')
    }

    return (data || []).map(product => this.normalizeProduct({
      id: product.product_id,
      name: product.product_model,
      sku: product.product_barcode,
      price: parseFloat(product.product_price) || 0,
      category: product.category_name || 'Non catégorisé',
      quantity: parseFloat(product.product_quantity) || 0
    }))
  }

  async getSales(accessToken, options = {}) {
    const { account, startDate, endDate } = options
    
    const params = new URLSearchParams()
    if (startDate) params.append('date_from', startDate.split('T')[0])
    if (endDate) params.append('date_to', endDate.split('T')[0])
    
    const url = `${this.getApiBase(account)}/sales/?${params.toString()}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Hiboutik sales')
    }

    return (data || []).map(sale => this.normalizeSale({
      id: sale.sale_id,
      date: sale.sale_date,
      total: parseFloat(sale.sale_total) || 0,
      items: (sale.line_items || []).map(item => ({
        productId: item.product_id,
        name: item.product_model,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.line_price)
      })),
      paymentMethod: sale.payment_type || 'unknown'
    }))
  }

  async getInventory(accessToken, options = {}) {
    const { account } = options
    
    const response = await fetch(`${this.getApiBase(account)}/stock_available/warehouse_id/0`, {
      headers: {
        'Authorization': `Basic ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Hiboutik inventory')
    }

    return (data || []).map(item => ({
      productId: item.product_id,
      sizeId: item.product_size_id,
      quantity: parseFloat(item.stock_available) || 0
    }))
  }

  supportsWebhooks() {
    return true
  }

  getWebhookEndpoint() {
    return '/api/pos/webhook/hiboutik'
  }

  getDemoProducts() {
    return [
      { id: 'hb_001', name: 'Fromage Comté AOP', sku: 'FRO-001', price: 28.00, category: 'Fromages' },
      { id: 'hb_002', name: 'Brie de Meaux', sku: 'FRO-002', price: 22.00, category: 'Fromages' },
      { id: 'hb_003', name: 'Camembert Normandie', sku: 'FRO-003', price: 8.50, category: 'Fromages' },
      { id: 'hb_004', name: 'Roquefort', sku: 'FRO-004', price: 32.00, category: 'Fromages' },
      { id: 'hb_005', name: 'Chèvre frais', sku: 'FRO-005', price: 6.00, category: 'Fromages' },
      { id: 'hb_006', name: 'Vin rouge Bordeaux', sku: 'VIN-001', price: 15.00, category: 'Vins' },
      { id: 'hb_007', name: 'Confiture artisanale', sku: 'EPI-001', price: 7.50, category: 'Épicerie' },
      { id: 'hb_008', name: 'Miel de lavande', sku: 'EPI-002', price: 12.00, category: 'Épicerie' }
    ].map(p => this.normalizeProduct(p))
  }
}

export default HiboutikAdapter
