import fetch from 'node-fetch'

const CHIFT_API_BASE = 'https://api.chift.eu/v1'

const POS_PROVIDERS = {
  tiller: { name: 'Tiller (SumUp)', chiftId: 'tiller' },
  zettle: { name: 'Zettle (PayPal)', chiftId: 'zettle' },
  square: { name: 'Square', chiftId: 'square' },
  zelty: { name: 'Zelty', chiftId: 'zelty' },
  laddition: { name: "L'Addition", chiftId: 'laddition' },
  lightspeed: { name: 'Lightspeed', chiftId: 'lightspeed' },
  innovorder: { name: 'Innovorder', chiftId: 'innovorder' },
  hiboutik: { name: 'Hiboutik', chiftId: 'hiboutik' },
  cashmag: { name: 'Cashmag', chiftId: 'cashmag' },
  cashpad: { name: 'Cashpad', chiftId: 'cashpad' },
  clyo: { name: 'Clyo Systems', chiftId: 'clyo-systems' },
  synapsy: { name: 'Synapsy', chiftId: 'synapsy' },
  popina: { name: 'Popina', chiftId: 'popina' },
  jalia: { name: 'Jalia JDC', chiftId: 'jalia' },
  apitic: { name: 'Apitic', chiftId: 'apitic' },
  trivec: { name: 'Trivec', chiftId: 'trivec' },
  odoo: { name: 'Odoo POS', chiftId: 'odoo-pos' },
  restomax: { name: 'Restomax', chiftId: 'restomax' },
  hellocash: { name: 'HelloCash', chiftId: 'hellocash' },
  connectill: { name: 'Connectill', chiftId: 'connectill' },
  fulleapps: { name: 'Fülleapps', chiftId: 'fulleapps' },
  addictill: { name: 'Addictill', chiftId: 'addictill' },
  abill: { name: 'Abill', chiftId: 'abill' },
  planity: { name: 'Planity', chiftId: 'planity' },
  lastapp: { name: 'LastApp', chiftId: 'lastapp' }
}

class ChiftService {
  constructor() {
    this.apiKey = process.env.CHIFT_API_KEY
    this.clientId = process.env.CHIFT_CLIENT_ID
    this.clientSecret = process.env.CHIFT_CLIENT_SECRET
    this.redirectUri = process.env.CHIFT_REDIRECT_URI || 'https://myponia.fr/api/integrations/callback'
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  async getAuthorizationUrl(provider, userId, storeId) {
    const chiftProvider = POS_PROVIDERS[provider]
    if (!chiftProvider) {
      throw new Error(`Provider ${provider} not supported`)
    }

    const state = Buffer.from(JSON.stringify({ 
      userId, 
      storeId, 
      provider,
      timestamp: Date.now() 
    })).toString('base64')

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'pos:read pos:write',
      connector: chiftProvider.chiftId,
      state
    })

    return `https://auth.chift.eu/oauth2/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code) {
    try {
      const response = await fetch('https://auth.chift.eu/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri
        }).toString()
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Token exchange failed: ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      throw error
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const response = await fetch('https://auth.chift.eu/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }).toString()
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  async getProducts(connectionId, accessToken) {
    try {
      const response = await fetch(`${CHIFT_API_BASE}/pos/connections/${connectionId}/products`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      return data.products || data.data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getSales(connectionId, accessToken, startDate, endDate) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const url = `${CHIFT_API_BASE}/pos/connections/${connectionId}/sales${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }

      const data = await response.json()
      return data.sales || data.data || []
    } catch (error) {
      console.error('Error fetching sales:', error)
      throw error
    }
  }

  async getZTickets(connectionId, accessToken, date) {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)

      const url = `${CHIFT_API_BASE}/pos/connections/${connectionId}/z-tickets${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Z-tickets')
      }

      const data = await response.json()
      return data.z_tickets || data.data || []
    } catch (error) {
      console.error('Error fetching Z-tickets:', error)
      throw error
    }
  }

  async getTransactions(connectionId, accessToken, startDate, endDate) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const url = `${CHIFT_API_BASE}/pos/connections/${connectionId}/transactions${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()
      return data.transactions || data.data || []
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }

  async createWebhook(connectionId, accessToken, webhookUrl, events) {
    try {
      const response = await fetch(`${CHIFT_API_BASE}/pos/connections/${connectionId}/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: events || ['sale.created', 'product.updated', 'inventory.updated']
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create webhook')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating webhook:', error)
      throw error
    }
  }

  getProviderInfo(providerId) {
    return POS_PROVIDERS[providerId]
  }

  getAllProviders() {
    return Object.entries(POS_PROVIDERS).map(([id, info]) => ({
      id,
      ...info
    }))
  }
}

export const chiftService = new ChiftService()
export { POS_PROVIDERS }
