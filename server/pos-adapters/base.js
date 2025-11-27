export class BasePosAdapter {
  constructor(config = {}) {
    this.config = config
    this.name = 'base'
    this.displayName = 'Base Adapter'
  }

  async authenticate(credentials) {
    throw new Error('authenticate() must be implemented by subclass')
  }

  async refreshToken(refreshToken) {
    throw new Error('refreshToken() must be implemented by subclass')
  }

  async getProducts(accessToken, options = {}) {
    throw new Error('getProducts() must be implemented by subclass')
  }

  async getSales(accessToken, options = {}) {
    throw new Error('getSales() must be implemented by subclass')
  }

  async getInventory(accessToken, options = {}) {
    throw new Error('getInventory() must be implemented by subclass')
  }

  getAuthorizationUrl(state) {
    throw new Error('getAuthorizationUrl() must be implemented by subclass')
  }

  async handleCallback(code, state) {
    throw new Error('handleCallback() must be implemented by subclass')
  }

  normalizeProduct(rawProduct) {
    return {
      id: rawProduct.id,
      name: rawProduct.name || 'Sans nom',
      sku: rawProduct.sku || null,
      price: parseFloat(rawProduct.price) || 0,
      category: rawProduct.category || 'Non catégorisé',
      quantity: rawProduct.quantity || 0,
      unit: rawProduct.unit || 'unité'
    }
  }

  normalizeSale(rawSale) {
    return {
      id: rawSale.id,
      date: rawSale.date || new Date().toISOString(),
      total: parseFloat(rawSale.total) || 0,
      items: rawSale.items || [],
      paymentMethod: rawSale.paymentMethod || 'unknown'
    }
  }

  supportsWebhooks() {
    return false
  }

  getWebhookEndpoint() {
    return null
  }
}

export default BasePosAdapter
