import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import OpenAI from 'openai'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { eq, and, gte, lte, sql, desc, or, isNull, gt, ne } from 'drizzle-orm'
import { db } from './db.js'
import { generateCommercialKitPDF } from './commercialPdfService.js'
import { users, stores, chatMessages, partners, aiSuggestions } from '../shared/schema.js'
import { 
  getUserByEmail,
  getUserBySupabaseId, 
  createUser, 
  getProductsByUserId, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addStockMovement,
  getAllStockHistory,
  updateUser,
  getProductById,
  createStore,
  getMainStore,
  addSaleRecord,
  getSalesHistory,
  getSalesByPeriod,
  getSalesForProduct,
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
  createChatMessage,
  getChatMessages,
  getMessagesByConversation,
  deleteMessagesByConversation,
  createPosConnection,
  getPosConnectionsByUser,
  getPosConnectionById,
  getPosConnectionByProvider,
  updatePosConnection,
  deletePosConnection,
  createPosProductMapping,
  getPosProductMappings,
  updatePosProductMapping,
  createPosSale,
  getUnprocessedPosSales,
  markPosSaleProcessed,
  createPosSyncLog,
  updatePosSyncLog,
  getPosSyncLogs,
  getAlertPreferences,
  updateAlertPreferences,
  getUsersForAlerts,
  getLowStockProducts,
  getExpiringProducts,
  createEmailLog,
  getEmailLogs,
  getAllUsers,
  getUserAiMemory,
  upsertUserAiMemory,
  getSalesAnalytics,
  getProductCompositions,
  addProductComposition,
  updateProductComposition,
  deleteProductComposition,
  deleteAllProductCompositions,
  calculateProductCost
} from './storage.js'
import { sendLowStockAlert, sendExpiryAlert, sendTestEmail, sendWelcomeEmail } from './email-service.js'
import { getAdapter, isDemoMode, getSupportedProviders, isProviderSupported } from './pos-adapters/index.js'
import { generateOrderPDF } from './pdfService.js'
import { generateGuidePDF } from './guideService.js'
import { weatherService } from './weatherService.js'
import { 
  generateAllSuggestions, 
  getUserSuggestions, 
  getUnreadCount, 
  markSuggestionViewed, 
  dismissSuggestion, 
  actOnSuggestion, 
  shouldShowPopup,
  cleanupExpiredSuggestions
} from './suggestionsEngine.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
})

const app = express()
const PORT = process.env.PORT || 3000

// Supabase client for JWT verification
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Supabase admin client (service role - for admin operations only)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Stripe webhook handler MUST be BEFORE express.json() to preserve raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const poniaUserId = parseInt(session.metadata.poniaUserId)
        const plan = session.metadata.plan

        await updateUser(poniaUserId, {
          plan,
          stripeSubscriptionId: session.subscription,
          subscriptionStatus: 'active',
          trialEndsAt: null
        })
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer)
        const poniaUserId = parseInt(customer.metadata.poniaUserId)

        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await updateUser(poniaUserId, {
            plan: 'basique',
            subscriptionStatus: 'canceled'
          })
        }
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handling failed' })
  }
})

// Middleware - JSON parser for all other routes
app.use(express.json())
app.use(cookieParser())

const ADMIN_JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 64)
if (!ADMIN_JWT_SECRET) {
  console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is required for admin JWT signing')
}

// Auth middleware to verify Supabase JWT and extract user
async function authenticateSupabaseUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non autorisé - token manquant' })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Non autorisé - token invalide' })
    }

    // Attach verified user ID to request
    req.supabaseUserId = user.id
    next()
  } catch (error) {
    console.error('Erreur authentification:', error)
    return res.status(401).json({ error: 'Non autorisé' })
  }
}

// Trial enforcement middleware - handles expired trials and plan limits
async function enforceTrialStatus(req, res, next) {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Attach user to request for limit checks
    req.poniaUser = user

    // Si l'utilisateur a un plan payant (standard ou pro) sans trial, laisser passer
    if ((user.plan === 'standard' || user.plan === 'pro') && !user.trialEndsAt) {
      return next()
    }

    // Si l'utilisateur a un trial en cours
    if (user.trialEndsAt) {
      const trialEnd = new Date(user.trialEndsAt)
      const now = new Date()

      // Si trial encore valide, laisser passer
      if (trialEnd > now) {
        return next()
      }

      // Trial expiré - bloquer immédiatement et forcer le choix
      return res.status(403).json({ 
        error: 'Essai gratuit expiré',
        trialExpired: true,
        requiresChoice: true,
        message: 'Votre essai de 14 jours est terminé. Choisissez un plan pour continuer.'
      })
    }

    // Utilisateur basique (sans trial) - laisser passer avec limites
    // Les limites sont vérifiées dans chaque endpoint
    if (user.plan === 'basique') {
      return next()
    }

    next()
  } catch (error) {
    console.error('Erreur vérification essai:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Middleware to block basique users from premium features (POS integrations)
async function requirePremiumPlan(req, res, next) {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    if (user.plan === 'basique') {
      return res.status(403).json({
        error: 'Fonctionnalité premium requise',
        upgradeRequired: true,
        message: 'Les intégrations POS sont disponibles avec les plans Standard et Pro.'
      })
    }
    
    next()
  } catch (error) {
    console.error('Erreur vérification plan premium:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ============================================
// ENDPOINTS USERS (Supabase sync)
// ============================================

// Créer ou synchroniser utilisateur après inscription Supabase (SECURED)
app.post('/api/users/sync', authenticateSupabaseUser, async (req, res) => {
  try {
    const { supabaseId, email, businessName, businessType, posSystem, address, city, postalCode, latitude, longitude, referralCode, referredBy } = req.body
    
    if (!supabaseId || !email) {
      return res.status(400).json({ error: 'supabaseId et email requis' })
    }

    if (supabaseId !== req.supabaseUserId) {
      return res.status(403).json({ error: 'Supabase ID mismatch - impossible de créer un compte pour un autre utilisateur' })
    }
    
    let user = await getUserBySupabaseId(supabaseId)
    
    if (!user) {
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 14)
      
      user = await createUser({
        supabaseId,
        email,
        businessName,
        businessType,
        posSystem,
        plan: 'pro',
        referralCode,
        referredBy,
        trialEndsAt
      })

      if (businessName && (address || city)) {
        await createStore({
          userId: user.id,
          name: businessName,
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          latitude: latitude || null,
          longitude: longitude || null,
          isMain: true
        })
      }
    }
    
    res.json({ user })
  } catch (error) {
    console.error('Erreur sync user:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer les données utilisateur complètes (SÉCURISÉ)
app.get('/api/users/me', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    res.json({ user })
  } catch (error) {
    console.error('Erreur get user:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Statistiques temps économisé (vraies données)
app.get('/api/stats/time-saved', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const products = await getProductsByUserId(user.id)
    const stockMovements = await getAllStockHistory(user.id)
    const sales = await getSalesHistory(user.id, 30)
    
    const productCount = products.length
    const alertsActive = products.filter(p => parseFloat(p.currentQuantity) <= parseFloat(p.alertThreshold)).length
    const movementsThisWeek = stockMovements.filter(m => {
      const moveDate = new Date(m.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return moveDate >= weekAgo
    }).length

    const minutesSavedPerProduct = 5
    const minutesSavedPerMovement = 2
    const minutesSavedPerAlert = 15

    const weeklyMinutesSaved = (productCount * minutesSavedPerProduct) + 
                               (movementsThisWeek * minutesSavedPerMovement) + 
                               (alertsActive * minutesSavedPerAlert)
    
    const hourlyRate = 20
    const moneyValue = Math.round((weeklyMinutesSaved / 60) * hourlyRate)

    const rupturesAvoided = alertsActive
    const expiringProducts = products.filter(p => {
      if (!p.expiryDate) return false
      const expiry = new Date(p.expiryDate)
      const inTwoWeeks = new Date()
      inTwoWeeks.setDate(inTwoWeeks.getDate() + 14)
      return expiry <= inTwoWeeks && expiry >= new Date()
    }).length
    
    const wasteSaved = expiringProducts * 15

    res.json({
      timeSavedMinutes: weeklyMinutesSaved,
      moneyValue,
      stats: {
        caOptimized: Math.min(15, Math.round(movementsThisWeek / 2)),
        rupturesAvoided,
        wasteSaved
      },
      details: {
        productCount,
        alertsActive,
        movementsThisWeek,
        expiringProducts
      }
    })
  } catch (error) {
    console.error('Erreur stats temps économisé:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// ALERTES EMAIL
// ============================================

app.get('/api/alerts/preferences', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    let prefs = await getAlertPreferences(user.id)
    
    if (!prefs) {
      prefs = await updateAlertPreferences(user.id, {
        emailAlertsEnabled: false,
        lowStockAlerts: true,
        expiryAlerts: true,
        expiryDaysThreshold: 3,
        alertFrequency: 'daily',
        alertTime: '08:00'
      })
    }

    res.json({ preferences: prefs })
  } catch (error) {
    console.error('Erreur get alert preferences:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.put('/api/alerts/preferences', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { emailAlertsEnabled, lowStockAlerts, expiryAlerts, expiryDaysThreshold, alertFrequency, alertTime } = req.body

    const updates = {}
    if (emailAlertsEnabled !== undefined) updates.emailAlertsEnabled = emailAlertsEnabled
    if (lowStockAlerts !== undefined) updates.lowStockAlerts = lowStockAlerts
    if (expiryAlerts !== undefined) updates.expiryAlerts = expiryAlerts
    if (expiryDaysThreshold !== undefined) updates.expiryDaysThreshold = expiryDaysThreshold
    if (alertFrequency !== undefined) updates.alertFrequency = alertFrequency
    if (alertTime !== undefined) updates.alertTime = alertTime

    const prefs = await updateAlertPreferences(user.id, updates)
    res.json({ preferences: prefs })
  } catch (error) {
    console.error('Erreur update alert preferences:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/alerts/test', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const result = await sendTestEmail(user.email)
    
    if (result.success) {
      await createEmailLog({
        userId: user.id,
        emailType: 'test',
        recipientEmail: user.email,
        subject: 'Test alertes PONIA',
        status: 'sent',
        messageId: result.messageId
      })
      res.json({ success: true, message: 'Email de test envoyé avec succès' })
    } else {
      res.status(500).json({ success: false, error: result.error })
    }
  } catch (error) {
    console.error('Erreur envoi test email:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/alerts/send-now', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const prefs = await getAlertPreferences(user.id)
    const results = { lowStock: null, expiry: null }

    if (!prefs || prefs.lowStockAlerts !== false) {
      const lowStockProducts = await getLowStockProducts(user.id)
      if (lowStockProducts.length > 0) {
        const emailResult = await sendLowStockAlert(user.email, user.businessName || 'Mon commerce', lowStockProducts)
        results.lowStock = {
          sent: emailResult.success,
          productCount: lowStockProducts.length,
          error: emailResult.error
        }
        
        if (emailResult.success) {
          await createEmailLog({
            userId: user.id,
            emailType: 'low_stock',
            recipientEmail: user.email,
            subject: `Alerte Stock Bas - ${lowStockProducts.length} produit(s)`,
            status: 'sent',
            messageId: emailResult.messageId,
            productIds: lowStockProducts.map(p => p.id)
          })
          await updateAlertPreferences(user.id, { lastLowStockAlertAt: new Date() })
        }
      } else {
        results.lowStock = { sent: false, productCount: 0, message: 'Aucun produit en stock bas' }
      }
    }

    const daysThreshold = prefs?.expiryDaysThreshold || 3
    if (!prefs || prefs.expiryAlerts !== false) {
      const expiringProducts = await getExpiringProducts(user.id, daysThreshold)
      if (expiringProducts.length > 0) {
        const emailResult = await sendExpiryAlert(user.email, user.businessName || 'Mon commerce', expiringProducts)
        results.expiry = {
          sent: emailResult.success,
          productCount: expiringProducts.length,
          error: emailResult.error
        }
        
        if (emailResult.success) {
          await createEmailLog({
            userId: user.id,
            emailType: 'expiry',
            recipientEmail: user.email,
            subject: `Alerte DLC - ${expiringProducts.length} produit(s)`,
            status: 'sent',
            messageId: emailResult.messageId,
            productIds: expiringProducts.map(p => p.id)
          })
          await updateAlertPreferences(user.id, { lastExpiryAlertAt: new Date() })
        }
      } else {
        results.expiry = { sent: false, productCount: 0, message: 'Aucun produit proche de péremption' }
      }
    }

    res.json({ success: true, results })
  } catch (error) {
    console.error('Erreur envoi alertes:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/alerts/logs', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const logs = await getEmailLogs(user.id, 50)
    res.json({ logs })
  } catch (error) {
    console.error('Erreur get email logs:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/cron/send-alerts', async (req, res) => {
  const cronSecret = req.headers['x-cron-secret']
  const expectedSecret = process.env.CRON_SECRET || 'ponia-cron-dev-secret-2024'
  
  if (cronSecret !== expectedSecret) {
    console.log('[CRON] Tentative non autorisée - secret invalide')
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    console.log('[CRON] Démarrage envoi alertes automatiques...')
    const usersWithAlerts = await getUsersForAlerts()
    let totalSent = 0
    let errors = []

    for (const { user, prefs } of usersWithAlerts) {
      try {
        if (!prefs || prefs.emailAlertsEnabled === false) {
          continue
        }
        
        const now = new Date()
        const shouldSendLowStock = prefs.lowStockAlerts !== false
        const shouldSendExpiry = prefs.expiryAlerts !== false
        
        const lastLowStockAlert = prefs?.lastLowStockAlertAt ? new Date(prefs.lastLowStockAlertAt) : null
        const lastExpiryAlert = prefs?.lastExpiryAlertAt ? new Date(prefs.lastExpiryAlertAt) : null
        const frequency = prefs?.alertFrequency || 'daily'
        
        const hoursSinceLastLowStock = lastLowStockAlert ? (now - lastLowStockAlert) / (1000 * 60 * 60) : 999
        const hoursSinceLastExpiry = lastExpiryAlert ? (now - lastExpiryAlert) / (1000 * 60 * 60) : 999
        const minHours = frequency === 'daily' ? 20 : frequency === 'weekly' ? 144 : 20

        if (shouldSendLowStock && hoursSinceLastLowStock >= minHours) {
          const lowStockProducts = await getLowStockProducts(user.id)
          if (lowStockProducts.length > 0) {
            const result = await sendLowStockAlert(user.email, user.businessName || 'Mon commerce', lowStockProducts)
            if (result.success) {
              await createEmailLog({
                userId: user.id,
                emailType: 'low_stock',
                recipientEmail: user.email,
                subject: `Alerte Stock Bas - ${lowStockProducts.length} produit(s)`,
                status: 'sent',
                messageId: result.messageId,
                productIds: lowStockProducts.map(p => p.id)
              })
              await updateAlertPreferences(user.id, { lastLowStockAlertAt: now })
              totalSent++
            }
          }
        }

        if (shouldSendExpiry && hoursSinceLastExpiry >= minHours) {
          const daysThreshold = prefs?.expiryDaysThreshold || 3
          const expiringProducts = await getExpiringProducts(user.id, daysThreshold)
          if (expiringProducts.length > 0) {
            const result = await sendExpiryAlert(user.email, user.businessName || 'Mon commerce', expiringProducts)
            if (result.success) {
              await createEmailLog({
                userId: user.id,
                emailType: 'expiry',
                recipientEmail: user.email,
                subject: `Alerte DLC - ${expiringProducts.length} produit(s)`,
                status: 'sent',
                messageId: result.messageId,
                productIds: expiringProducts.map(p => p.id)
              })
              await updateAlertPreferences(user.id, { lastExpiryAlertAt: now })
              totalSent++
            }
          }
        }
      } catch (userError) {
        console.error(`[CRON] Erreur pour user ${user.id}:`, userError)
        errors.push({ userId: user.id, error: userError.message })
      }
    }

    console.log(`[CRON] ✅ Alertes envoyées: ${totalSent}, Erreurs: ${errors.length}`)
    res.json({ success: true, sent: totalSent, errors })
  } catch (error) {
    console.error('[CRON] Erreur globale:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// Configuration OpenAI côté serveur (SÉCURISÉ - jamais exposé au frontend)
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
})

// Helper pour construire le contexte stock enrichi avec ventes POS, météo et événements
async function buildStockContext(products, insights = null, includeExternalContext = true, userId = null, aiMemory = null) {
  if (!products || products.length === 0) {
    return "Aucun produit en stock pour le moment."
  }
  
  const critical = products.filter(p => {
    const threshold = p.alertThreshold || 10
    return p.currentQuantity <= threshold * 0.5
  })
  
  const low = products.filter(p => {
    const threshold = p.alertThreshold || 10
    return p.currentQuantity <= threshold && p.currentQuantity > threshold * 0.5
  })
  
  const healthy = products.filter(p => {
    const threshold = p.alertThreshold || 10
    return p.currentQuantity > threshold
  })
  
  let context = `INVENTAIRE COMPLET (${products.length} produits) :\n\n`
  
  if (aiMemory) {
    context += `🧠 MÉMOIRE COMMERCE (ce que je sais sur vous) :\n`
    if (aiMemory.businessContext) context += `  - Contexte: ${aiMemory.businessContext}\n`
    if (aiMemory.preferredSuppliers) context += `  - Fournisseurs favoris: ${aiMemory.preferredSuppliers}\n`
    if (aiMemory.busyDays) context += `  - Jours chargés: ${aiMemory.busyDays}\n`
    if (aiMemory.peakHours) context += `  - Heures de pointe: ${aiMemory.peakHours}\n`
    if (aiMemory.specialNotes) context += `  - Notes: ${aiMemory.specialNotes}\n`
    context += '\n'
  }
  
  if (userId) {
    try {
      const salesData = await getSalesAnalytics(userId, 30)
      if (salesData && salesData.length > 0) {
        context += `📈 HISTORIQUE VENTES (30 derniers jours depuis votre caisse) :\n`
        const topSellers = salesData.slice(0, 5)
        topSellers.forEach(sale => {
          const avgDaily = parseFloat(sale.avgDailySales) || 0
          context += `  - ${sale.productName}: ${parseFloat(sale.totalSold).toFixed(1)} vendus (moy. ${avgDaily.toFixed(1)}/jour)\n`
        })
        
        const totalSales = salesData.reduce((acc, s) => acc + parseFloat(s.totalSold || 0), 0)
        context += `  → Total: ${totalSales.toFixed(0)} unités vendues sur ${salesData.length} produits\n`
        
        const productsWithStock = products.map(p => {
          const saleData = salesData.find(s => s.productId === p.id)
          if (saleData) {
            const avgDaily = parseFloat(saleData.avgDailySales) || 0
            const daysRemaining = avgDaily > 0 ? Math.floor(p.currentQuantity / avgDaily) : 999
            return { ...p, avgDailySales: avgDaily, daysRemaining }
          }
          return p
        })
        
        const lowCoverage = productsWithStock.filter(p => p.daysRemaining && p.daysRemaining < 7 && p.daysRemaining < 999)
        if (lowCoverage.length > 0) {
          context += `\n⚠️ PRODUITS À RISQUE (couverture < 7 jours basée sur ventes réelles) :\n`
          lowCoverage.slice(0, 5).forEach(p => {
            context += `  - ${p.name}: ${p.currentQuantity} ${p.unit} restants = ${p.daysRemaining}j de couverture\n`
          })
        }
        context += '\n'
      }
    } catch (error) {
      console.log('Données ventes non disponibles:', error.message)
    }
  }
  
  if (insights) {
    context += `📊 ANALYSE GLOBALE :\n`
    context += `  - Score santé stock : ${insights.summary?.healthScore || 'N/A'}%\n`
    context += `  - Produits en risque rupture : ${insights.stockoutRisks?.length || 0}\n`
    context += `  - Produits en sur-stock : ${insights.overstockAlerts?.length || 0}\n\n`
  }
  
  if (includeExternalContext) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY
      if (apiKey) {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Paris,FR&appid=${apiKey}&units=metric&lang=fr`
        )
        const weatherData = await weatherRes.json()
        
        context += `🌤️ MÉTÉO ACTUELLE (Paris) :\n`
        context += `  - Température: ${Math.round(weatherData.main?.temp || 0)}°C (ressenti ${Math.round(weatherData.main?.feels_like || 0)}°C)\n`
        context += `  - Humidité: ${weatherData.main?.humidity || 0}%\n`
        context += `  - Conditions: ${weatherData.weather?.[0]?.description || 'N/A'}\n`
        
        if (weatherData.main?.temp > 30) {
          context += `  ⚠️ ALERTE CHALEUR : Surveiller DLC produits frais, augmenter renouvellement\n`
        }
        if (weatherData.main?.humidity > 70) {
          context += `  ⚠️ HUMIDITÉ ÉLEVÉE : Risque moisissures produits secs, vérifier stockage\n`
        }
        context += '\n'
      }
    } catch (error) {
      console.log('Météo non disponible')
    }
    
    try {
      const { getLocalPublicEvents } = await import('./googleCalendar.js')
      const events = await getLocalPublicEvents('Paris')
      
      if (events && events.length > 0) {
        context += `📅 ÉVÉNEMENTS LOCAUX PROCHAINS :\n`
        events.slice(0, 3).forEach(event => {
          const daysUntil = Math.ceil((new Date(event.start) - new Date()) / (1000 * 60 * 60 * 24))
          context += `  - ${event.name} (dans ${daysUntil}j): ${event.impact.expectedVisitors} fréquentation → ${event.impact.stockAdvice}\n`
        })
        context += '\n'
      }
    } catch (error) {
      console.log('Événements non disponibles')
    }
  }
  
  if (critical.length > 0) {
    context += `🔴 STOCK CRITIQUE - ACTION URGENTE (${critical.length}) :\n`
    critical.slice(0, 5).forEach(p => {
      const threshold = p.alertThreshold || 10
      const coverageDays = Math.floor(p.currentQuantity / (threshold / 7))
      context += `  - ${p.name}: ${p.currentQuantity} ${p.unit} (seuil: ${threshold}) → Couverture: ~${coverageDays}j`
      if (p.supplier) context += ` | Fournisseur: ${p.supplier}`
      context += '\n'
    })
    context += '\n'
  }
  
  if (low.length > 0) {
    context += `🟠 STOCK FAIBLE - SURVEILLER (${low.length}) :\n`
    low.slice(0, 5).forEach(p => {
      const threshold = p.alertThreshold || 10
      const coverageDays = Math.floor(p.currentQuantity / (threshold / 7))
      context += `  - ${p.name}: ${p.currentQuantity} ${p.unit} (seuil: ${threshold}) → Couverture: ~${coverageDays}j\n`
    })
    context += '\n'
  }
  
  if (healthy.length > 0) {
    context += `✅ STOCK OPTIMAL (${healthy.length}) :\n`
    healthy.slice(0, 3).forEach(p => {
      context += `  - ${p.name}: ${p.currentQuantity} ${p.unit}\n`
    })
    if (healthy.length > 3) {
      context += `  ... et ${healthy.length - 3} autres produits OK\n`
    }
  }
  
  const productsWithExpiry = products.filter(p => p.expiryDate)
  if (productsWithExpiry.length > 0) {
    context += `\n⏰ PRODUITS AVEC DATE LIMITE :\n`
    productsWithExpiry.slice(0, 3).forEach(p => {
      const daysUntil = Math.floor((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
      context += `  - ${p.name}: expire dans ${daysUntil}j (${p.currentQuantity} ${p.unit})\n`
    })
  }
  
  return context
}

// Endpoint chat IA sécurisé (basique users allowed with 5 msg/day limit)
app.post('/api/chat', authenticateSupabaseUser, async (req, res) => {
  try {
    const { userMessage, products, conversationHistory = [], insights = null } = req.body
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message utilisateur requis' })
    }
    
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    if (user.plan === 'basique') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayMessages = await db.select({ count: sql`count(*)` })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.userId, user.id),
            eq(chatMessages.role, 'user'),
            gte(chatMessages.createdAt, today)
          )
        )
      
      const messageCount = parseInt(todayMessages[0]?.count || 0)
      
      if (messageCount >= 5) {
        return res.status(403).json({ 
          error: 'Limite atteinte',
          message: 'Vous avez atteint la limite de 5 messages IA par jour avec le plan Basique. Passez au plan Standard pour un accès illimité.',
          upgradeRequired: true,
          currentCount: messageCount,
          limit: 5
        })
      }
    }
    
    const aiMemory = await getUserAiMemory(user.id)
    const stockContext = await buildStockContext(products || [], insights, true, user.id, aiMemory)
    
    const memoryInstructions = aiMemory ? '' : `
MÉMOIRE LONG-TERME :
Tu n'as pas encore d'informations mémorisées sur ce commerce. Si l'utilisateur te partage des informations importantes (type de commerce, jours chargés, heures de pointe, fournisseurs préférés, habitudes), retiens-les pour les prochaines conversations.`
    
    const messages = [
      {
        role: 'system',
        content: `Tu es PONIA, l'expert en gestion de stock pour commerçants français. Tu combines l'expertise d'un consultant supply-chain avec la simplicité d'un collègue de confiance.

INFOS COMMERCE :
- Nom: ${user.businessName || 'Non renseigné'}
- Type: ${user.businessType || 'Non renseigné'}
- Système de caisse: ${user.posSystem || 'Non connecté'}

CONTEXTE STOCK ACTUEL :
${stockContext}
${memoryInstructions}

EXPERTISE & CAPACITÉS :
- 🎯 Analyse prédictive basée sur les VRAIES ventes de ta caisse
- 📊 Calculs avancés : coûts de rupture, sur-stock, quantités économiques
- 🔮 Prédictions : anticipation des ruptures basées sur ton historique de ventes
- 💡 Optimisation : réduction gaspillage, amélioration trésorerie, gestion DLC/DLUO
- 📦 Expertise sectorielle : boulangeries, restaurants, bars, caves à vin
- 🌤️ Analyse contextuelle : impact météo sur ventes et DLC
- 📅 Anticipation événements : pics de fréquentation, ajustements stock préventifs

MÉTHODOLOGIE DE RÉPONSE :
1. Analyse : État actuel + diagnostic basé sur tes ventes réelles
2. Actions immédiates : Quoi faire MAINTENANT (produit, quantité, timing)
3. Projection : Impact chiffré (économies, jours de couverture selon ta conso)
4. Recommandations process : Amélioration continue

RÈGLES STRICTES :
- Réponds en français naturel et PRÉCIS (données exactes basées sur tes ventes)
- Toujours justifier avec des chiffres de TES ventes : "Tu vends 3kg/jour de farine, 15kg = 5 jours"
- Pense comme un expert : considère DLC, coûts, cash-flow, pas juste les quantités
- Adapte au secteur du commerçant
- Sois proactif : suggère des améliorations même si on ne demande pas
- Utilise des emojis stratégiquement pour structurer (🔴 urgent, ⚠️ attention, ✅ ok, 📊 données)
- NE JAMAIS utiliser de markdown (pas de ** ou *** ou __ ou # ou -)
- Écris en texte simple et clair, utilise les emojis et sauts de ligne pour structurer

FORMAT DE RÉPONSE :
Utilise UNIQUEMENT du texte simple avec :
- Emojis pour les icônes (🔴 ⚠️ ✅ 📊 💡 🎯)
- Sauts de ligne pour séparer les sections
- Tirets simples (-) ou flèches (→) pour les listes
- JAMAIS de gras, italique, ou autre formatage markdown

Tu es l'outil qui transforme les commerçants en experts de leur propre stock grâce aux données de leur caisse.`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ]
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.4,
      max_tokens: 600
    })

    const response = completion.choices[0].message.content
    
    const memoryPatterns = {
      busyDays: /(?:jours? charg[ée]s?|pic d'activit[ée]|plus de monde|samedi|dimanche|week-?end)/i,
      peakHours: /(?:heures? de pointe|rush|coup de feu|midi|soir|service)/i,
      preferredSuppliers: /(?:fournisseur|je commande chez|j'ach[èe]te chez|mon fournisseur)/i,
      businessContext: /(?:je suis|on est|c'est un|type de commerce|boulangerie|restaurant|bar|cave)/i
    }
    
    const extractedMemory = {}
    for (const [key, pattern] of Object.entries(memoryPatterns)) {
      if (pattern.test(userMessage)) {
        const sentences = userMessage.split(/[.!?]/).filter(s => pattern.test(s))
        if (sentences.length > 0) {
          extractedMemory[key] = sentences[0].trim().substring(0, 200)
        }
      }
    }
    
    if (Object.keys(extractedMemory).length > 0) {
      try {
        const mergedMemory = aiMemory ? { ...aiMemory, ...extractedMemory } : extractedMemory
        await upsertUserAiMemory(user.id, mergedMemory)
      } catch (memErr) {
        console.log('Erreur sauvegarde mémoire IA:', memErr.message)
      }
    }
    
    res.json({ response })

  } catch (error) {
    console.error('Erreur chat IA:', error.message)
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: 'Une erreur est survenue lors du traitement de votre demande.'
    })
  }
})

// Endpoint pour sauvegarder un message de chat
app.post('/api/chat/messages', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { role, content } = req.body
    
    if (!role || !content) {
      return res.status(400).json({ error: 'Role et content requis' })
    }

    if (role !== 'user' && role !== 'assistant') {
      return res.status(400).json({ error: 'Role doit être "user" ou "assistant"' })
    }

    const message = await createChatMessage({
      userId: user.id,
      role,
      content
    })

    res.json({ message })
  } catch (error) {
    console.error('Erreur sauvegarde message:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Endpoint pour récupérer l'historique des messages
app.get('/api/chat/messages', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const limit = parseInt(req.query.limit) || 100
    const messages = await getChatMessages(user.id, limit)
    
    res.json({ messages: messages.reverse() })
  } catch (error) {
    console.error('Erreur récupération messages:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Clear chat history
app.delete('/api/chat/messages/clear', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    await db.delete(chatMessages).where(eq(chatMessages.userId, user.id))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression messages:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============ CONVERSATIONS API ============

// Créer une nouvelle conversation
app.post('/api/chat/conversations', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { title } = req.body
    const conversation = await createConversation(user.id, title || 'Nouvelle conversation')
    
    res.json({ conversation })
  } catch (error) {
    console.error('Erreur création conversation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Lister toutes les conversations
app.get('/api/chat/conversations', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const conversations = await getConversations(user.id)
    res.json({ conversations })
  } catch (error) {
    console.error('Erreur récupération conversations:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer les messages d'une conversation spécifique
app.get('/api/chat/conversations/:id/messages', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const conversationId = parseInt(req.params.id)
    const conversation = await getConversationById(conversationId)
    
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversation non trouvée' })
    }

    const messages = await getMessagesByConversation(conversationId)
    res.json({ messages, conversation })
  } catch (error) {
    console.error('Erreur récupération messages conversation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Ajouter un message à une conversation
app.post('/api/chat/conversations/:id/messages', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const conversationId = parseInt(req.params.id)
    const conversation = await getConversationById(conversationId)
    
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversation non trouvée' })
    }

    const { role, content } = req.body
    if (!role || !content) {
      return res.status(400).json({ error: 'Role et content requis' })
    }

    const message = await createChatMessage({
      userId: user.id,
      conversationId,
      role,
      content
    })

    // Mettre à jour le titre de la conversation si c'est le premier message utilisateur
    if (role === 'user' && conversation.title === 'Nouvelle conversation') {
      const newTitle = content.length > 50 ? content.substring(0, 50) + '...' : content
      await updateConversation(conversationId, { title: newTitle })
    } else {
      await updateConversation(conversationId, {})
    }

    res.json({ message })
  } catch (error) {
    console.error('Erreur ajout message:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une conversation
app.delete('/api/chat/conversations/:id', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const conversationId = parseInt(req.params.id)
    const conversation = await getConversationById(conversationId)
    
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversation non trouvée' })
    }

    await deleteConversation(conversationId)
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression conversation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Renommer une conversation
app.patch('/api/chat/conversations/:id', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const conversationId = parseInt(req.params.id)
    const conversation = await getConversationById(conversationId)
    
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversation non trouvée' })
    }

    const { title } = req.body
    if (!title) {
      return res.status(400).json({ error: 'Titre requis' })
    }

    const updated = await updateConversation(conversationId, { title })
    res.json({ conversation: updated })
  } catch (error) {
    console.error('Erreur renommage conversation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============ DOCUMENT ANALYSIS & BARCODE API ============

// Analyser un document (facture, bon de livraison, photo stock) avec IA
app.post('/api/analyze-document', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { image, mimeType, businessType } = req.body
    
    if (!image) {
      return res.status(400).json({ error: 'Image requise' })
    }

    const prompt = `Tu es un expert en gestion de stock pour les commerces alimentaires français (${businessType || 'commerce alimentaire'}).

Analyse cette image (facture, bon de livraison, ou photo de stock) et extrait TOUS les produits visibles.

Pour chaque produit, retourne un objet JSON avec:
- name: nom du produit (en français, sans marque si possible)
- currentQuantity: quantité détectée (nombre)
- unit: unité (kg, L, pièces, bouteilles, sachets, boîtes, cartons)
- category: catégorie appropriée
- alertThreshold: seuil d'alerte suggéré (environ 20% de la quantité)

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.
Exemple: [{"name":"Farine T55","currentQuantity":25,"unit":"kg","category":"Matières premières","alertThreshold":5}]

Si tu ne détectes aucun produit, retourne un tableau vide: []`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${image}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    })

    const content = response.choices[0].message.content
    
    let products = []
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        products = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Erreur parsing réponse IA:', parseError)
    }

    res.json({ products })
  } catch (error) {
    console.error('Erreur analyse document:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

// Lookup code-barres (Open Food Facts API)
app.get('/api/barcode-lookup/:code', authenticateSupabaseUser, async (req, res) => {
  try {
    const { code } = req.params
    
    if (!code || code.length < 8) {
      return res.status(400).json({ error: 'Code-barres invalide' })
    }

    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`)
    
    if (!response.ok) {
      return res.json({ product: null })
    }

    const data = await response.json()
    
    if (data.status !== 1 || !data.product) {
      return res.json({ product: null })
    }

    const product = data.product
    const name = product.product_name_fr || product.product_name || null
    const category = product.categories_tags?.[0]?.replace('en:', '').replace('fr:', '') || null
    
    let unit = 'pièces'
    if (product.quantity) {
      const qty = product.quantity.toLowerCase()
      if (qty.includes('kg') || qty.includes('kilo')) unit = 'kg'
      else if (qty.includes('g') && !qty.includes('kg')) unit = 'g'
      else if (qty.includes('l') || qty.includes('litre')) unit = 'L'
      else if (qty.includes('cl') || qty.includes('ml')) unit = 'cl'
    }

    res.json({
      product: name ? {
        name,
        category,
        unit,
        barcode: code
      } : null
    })
  } catch (error) {
    console.error('Erreur lookup code-barres:', error)
    res.json({ product: null })
  }
})

// Endpoint génération bon de commande intelligent (SÉCURISÉ) - PDF
app.post('/api/generate-order', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { products, businessName, businessType } = req.body
    
    if (!businessName || typeof businessName !== 'string') {
      return res.status(400).json({ error: 'Nom du commerce requis' })
    }
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Produits requis (tableau non vide)' })
    }

    for (const p of products) {
      if (!p || typeof p !== 'object') {
        return res.status(400).json({ error: 'Produits invalides (objets requis)' })
      }
      if (!p.name || typeof p.name !== 'string' || !p.unit || typeof p.unit !== 'string') {
        return res.status(400).json({ error: 'Produits invalides (name et unit string requis)' })
      }
    }

    const normalizedProducts = products.map(p => ({
      ...p,
      currentQuantity: parseFloat(p.currentQuantity),
      alertThreshold: p.alertThreshold !== undefined ? parseFloat(p.alertThreshold) : undefined
    }))

    for (const p of normalizedProducts) {
      if (!Number.isFinite(p.currentQuantity) || p.currentQuantity < 0) {
        return res.status(400).json({ error: 'Produits invalides (currentQuantity nombre positif requis)' })
      }
      if (p.alertThreshold !== undefined && (!Number.isFinite(p.alertThreshold) || p.alertThreshold <= 0)) {
        return res.status(400).json({ error: 'Produits invalides (alertThreshold doit être > 0 si fourni)' })
      }
    }

    const critical = normalizedProducts.filter(p => {
      const threshold = Number.isFinite(p.alertThreshold) && p.alertThreshold > 0 ? p.alertThreshold : 10
      return p.currentQuantity <= threshold * 0.5
    })
    
    const low = normalizedProducts.filter(p => {
      const threshold = Number.isFinite(p.alertThreshold) && p.alertThreshold > 0 ? p.alertThreshold : 10
      return p.currentQuantity > threshold * 0.5 && p.currentQuantity <= threshold
    })
    
    const orderProducts = [...critical, ...low]
    
    if (orderProducts.length === 0) {
      return res.status(200).json({ 
        noProducts: true,
        message: 'Aucun produit à commander pour le moment !'
      })
    }

    const productsContext = orderProducts.map(p => {
      const threshold = Number.isFinite(p.alertThreshold) && p.alertThreshold > 0 ? p.alertThreshold : 10
      const dailyConsumption = threshold / 7
      const coverageDays = dailyConsumption > 0 ? (p.currentQuantity / dailyConsumption).toFixed(1) : '0.0'
      return {
        name: p.name,
        currentQuantity: p.currentQuantity,
        unit: p.unit,
        threshold: threshold,
        coverageDays: parseFloat(coverageDays),
        supplier: p.supplier || 'À définir',
        isCritical: p.currentQuantity <= threshold * 0.5
      }
    })

    const prompt = `Tu es un expert en gestion de stock. Génère les recommandations pour un bon de commande de "${businessName}" (${businessType || 'commerce'}).

PRODUITS À COMMANDER :
${productsContext.map(p => `- ${p.name}: ${p.currentQuantity} ${p.unit} (seuil: ${p.threshold} ${p.unit}, couverture: ~${p.coverageDays}j, urgence: ${p.isCritical ? 'CRITIQUE' : 'semaine'})`).join('\n')}

RETOURNE un objet JSON STRICTEMENT avec cette structure :
{
  "urgentProducts": [
    {"name": "...", "suggestedQuantity": <nombre>, "unit": "...", "unitPrice": <prix estimé marché FR>}
  ],
  "weeklyProducts": [
    {"name": "...", "suggestedQuantity": <nombre>, "unit": "...", "unitPrice": <prix estimé marché FR>}
  ],
  "recommendations": [
    "Recommandation actionnable 1",
    "Recommandation actionnable 2"
  ]
}

RÈGLES :
- urgentProducts = produits avec couverture <2j (quantité pour 14j minimum)
- weeklyProducts = produits avec couverture 3-7j (quantité pour 10j)
- suggestedQuantity = nombres ENTIERS pratiques
- unitPrice = estimation réaliste marché français ${new Date().getFullYear()} pour ${businessType || 'commerce'}
- 2-3 recommendations max, concrètes et actionnables
- Retourne SEULEMENT le JSON, rien d'autre`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Tu retournes UNIQUEMENT du JSON valide, sans texte supplémentaire. Pas de markdown, pas d\'explication.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    let aiData
    try {
      aiData = JSON.parse(completion.choices[0].message.content)
    } catch (parseError) {
      console.error('JSON parsing error:', completion.choices[0].message.content)
      return res.status(500).json({ error: 'Erreur de formatage IA' })
    }

    if (!aiData.urgentProducts || !Array.isArray(aiData.urgentProducts)) {
      aiData.urgentProducts = []
    }
    if (!aiData.weeklyProducts || !Array.isArray(aiData.weeklyProducts)) {
      aiData.weeklyProducts = []
    }
    if (!aiData.recommendations || !Array.isArray(aiData.recommendations)) {
      aiData.recommendations = []
    }

    const allProducts = [...aiData.urgentProducts, ...aiData.weeklyProducts]
    const totalAmount = allProducts.reduce((sum, p) => {
      const qty = parseFloat(p.suggestedQuantity) || 0
      const price = parseFloat(p.unitPrice) || 0
      return sum + (qty * price)
    }, 0)

    const mainStore = await getMainStore(user.id)
    const storeAddress = mainStore?.address ? 
      `${mainStore.address}${mainStore.postalCode ? ', ' + mainStore.postalCode : ''}${mainStore.city ? ' ' + mainStore.city : ''}` : 
      null

    // Récupérer TOUS les produits de la base pour les stats complètes
    const allDbProducts = await getProductsByUserId(user.id)
    const stockMovements = await getAllStockHistory(user.id)

    // Récupérer les suggestions IA
    let suggestions = []
    try {
      suggestions = await getUserSuggestions(user.id)
    } catch (e) {
      console.error('Error fetching suggestions for PDF:', e)
    }

    // Récupérer météo
    let weatherData = null
    try {
      if (mainStore?.city) {
        weatherData = await weatherService.getWeatherForecast(mainStore.city)
      }
    } catch (e) {
      console.error('Error fetching weather for PDF:', e)
    }

    // Calculer score de santé stock (sur TOUS les produits DB)
    const totalProducts = allDbProducts.length
    const dbCritical = allDbProducts.filter(p => {
      const qty = parseFloat(p.currentQuantity) || 0
      const threshold = parseFloat(p.alertThreshold) || 10
      return qty <= threshold * 0.5
    })
    const dbLow = allDbProducts.filter(p => {
      const qty = parseFloat(p.currentQuantity) || 0
      const threshold = parseFloat(p.alertThreshold) || 10
      return qty > threshold * 0.5 && qty <= threshold
    })
    const dbHealthy = allDbProducts.filter(p => {
      const qty = parseFloat(p.currentQuantity) || 0
      const threshold = parseFloat(p.alertThreshold) || 10
      return qty > threshold
    })
    const stockHealthScore = totalProducts > 0 ? Math.round((dbHealthy.length / totalProducts) * 100) : 100

    // Alertes péremption (produits DB avec date de péremption valide)
    const expiryAlerts = allDbProducts.filter(p => {
      if (!p.expiryDate) return false
      const expiry = new Date(p.expiryDate)
      if (isNaN(expiry.getTime())) return false
      const daysUntil = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 && daysUntil >= 0
    }).map(p => {
      const expiry = new Date(p.expiryDate)
      return {
        name: p.name,
        expiryDate: p.expiryDate,
        daysUntil: Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24)),
        quantity: parseFloat(p.currentQuantity) || 0,
        unit: p.unit
      }
    })

    // Temps économisé (même logique que /api/stats/time-saved)
    const alertsActive = allDbProducts.filter(p => parseFloat(p.currentQuantity) <= parseFloat(p.alertThreshold)).length
    const movementsThisWeek = stockMovements.filter(m => {
      const moveDate = new Date(m.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return moveDate >= weekAgo
    }).length
    
    const minutesSavedPerProduct = 5
    const minutesSavedPerMovement = 2
    const minutesSavedPerAlert = 15
    const weeklyMinutesSaved = (totalProducts * minutesSavedPerProduct) + 
                               (movementsThisWeek * minutesSavedPerMovement) + 
                               (alertsActive * minutesSavedPerAlert)
    const hourlyRate = 20
    const timeSavedValue = Math.round((weeklyMinutesSaved / 60) * hourlyRate)

    // Code parrainage utilisateur
    const referralCode = user.referralCode || `PONIA-${user.id.toString().slice(0, 6).toUpperCase()}`

    const pdfData = {
      storeName: businessName,
      storeAddress: storeAddress,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      urgentProducts: aiData.urgentProducts,
      weeklyProducts: aiData.weeklyProducts,
      recommendations: aiData.recommendations,
      totalAmount: totalAmount,
      suggestions: suggestions.slice(0, 5),
      weatherData: weatherData,
      stockHealth: {
        score: stockHealthScore,
        total: totalProducts,
        critical: dbCritical.length,
        low: dbLow.length,
        healthy: dbHealthy.length
      },
      expiryAlerts: expiryAlerts,
      timeSaved: {
        minutes: weeklyMinutesSaved,
        value: timeSavedValue
      },
      referralCode: referralCode,
      userPlan: user.subscriptionTier || 'basique'
    }

    const pdfDoc = generateOrderPDF(pdfData)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=bon-de-commande-${businessName.replace(/\s+/g, '-')}-${Date.now()}.pdf`)
    res.setHeader('X-Products-Count', orderProducts.length.toString())
    res.setHeader('X-Critical-Count', critical.length.toString())
    res.setHeader('X-Low-Count', low.length.toString())

    pdfDoc.pipe(res)
    pdfDoc.end()

  } catch (error) {
    console.error('Erreur génération bon de commande:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erreur serveur',
        message: 'Impossible de générer le bon de commande.'
      })
    }
  }
})

// Products endpoints (avec auth Supabase SÉCURISÉ)
app.get('/api/products', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    // Use VERIFIED user ID from JWT, not client-supplied value
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const products = await getProductsByUserId(user.id)
    res.json({ products })
  } catch (error) {
    console.error('Erreur récupération produits:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// REMOVED: Insecure legacy endpoint that allowed user impersonation

app.post('/api/products', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    // Basique plan: max 10 products
    if (user.plan === 'basique') {
      const existingProducts = await getProductsByUserId(user.id)
      if (existingProducts.length >= 10) {
        return res.status(403).json({ 
          error: 'Limite atteinte',
          limitReached: true,
          message: 'Le plan Basique est limité à 10 produits. Passez à Standard ou Pro pour ajouter plus de produits.'
        })
      }
    }
    
    // Standard plan: max 100 products
    if (user.plan === 'standard') {
      const existingProducts = await getProductsByUserId(user.id)
      if (existingProducts.length >= 100) {
        return res.status(403).json({ 
          error: 'Limite atteinte',
          limitReached: true,
          message: 'Le plan Standard est limité à 100 produits. Passez à Pro pour des produits illimités.'
        })
      }
    }
    
    const productData = {
      name: req.body.name,
      category: req.body.category || null,
      subcategory: req.body.subcategory || null,
      barcode: req.body.barcode || null,
      currentQuantity: req.body.currentQuantity,
      unit: req.body.unit,
      alertThreshold: req.body.alertThreshold,
      supplier: req.body.supplier || null,
      purchasePrice: req.body.purchasePrice || null,
      salePrice: req.body.salePrice || null,
      isComposite: req.body.isComposite || false,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      userId: user.id
    }
    
    const product = await createProduct(productData)
    
    // Si c'est un produit composé avec des ingrédients
    if (req.body.isComposite && req.body.ingredients && req.body.ingredients.length > 0) {
      for (const ingredient of req.body.ingredients) {
        await addProductComposition(
          product.id,
          ingredient.ingredientId,
          ingredient.quantity,
          ingredient.unit
        )
      }
    }
    
    res.json({ product })
  } catch (error) {
    console.error('Erreur création produit:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

// Scan barcode and add product
app.post('/api/products/scan', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const productData = {
      name: req.body.name,
      currentQuantity: req.body.quantity || 1,
      unit: req.body.unit || 'unité',
      alertThreshold: req.body.minStock || 5,
      supplier: null,
      expiryDate: null,
      userId: user.id,
      category: req.body.category || 'Autre',
      barcode: req.body.barcode
    }
    
    const product = await createProduct(productData)
    res.json({ success: true, product })
  } catch (error) {
    console.error('Erreur scan produit:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

app.put('/api/products/:id', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const productToUpdate = await getProductById(productId)
    
    if (!productToUpdate) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }

    // Verify ownership
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || productToUpdate.userId !== user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    const { previousQuantity, ...updates } = req.body
    
    // Convert expiryDate string to Date object if present
    if (updates.expiryDate && typeof updates.expiryDate === 'string') {
      updates.expiryDate = new Date(updates.expiryDate)
    }
    
    const product = await updateProduct(productId, updates)
    
    // Si la quantité change, enregistrer le mouvement
    if (updates.currentQuantity !== undefined && previousQuantity !== undefined) {
      const quantityChange = parseFloat(updates.currentQuantity) - parseFloat(previousQuantity)
      if (quantityChange !== 0) {
        const changeType = quantityChange > 0 ? 'increase' : 'decrease'
        await addStockMovement(
          productId,
          quantityChange,
          parseFloat(updates.currentQuantity),
          changeType,
          req.body.notes || null
        )
        
        // Si c'est une diminution (vente), enregistrer dans salesHistory
        if (changeType === 'decrease') {
          await addSaleRecord(
            productId,
            user.id,
            productToUpdate.storeId || null,
            Math.abs(quantityChange),
            null // salePrice non fourni pour l'instant
          )
        }
      }
    }
    
    res.json(product)
  } catch (error) {
    console.error('Erreur modification produit:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.delete('/api/products/:id', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const productToDelete = await getProductById(productId)
    
    if (!productToDelete) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }

    // Verify ownership
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || productToDelete.userId !== user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    await deleteProduct(productId)
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression produit:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Product Compositions API
app.get('/api/products/:id/compositions', authenticateSupabaseUser, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const product = await getProductById(productId)
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }
    
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || product.userId !== user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }
    
    const compositions = await getProductCompositions(productId)
    const cost = await calculateProductCost(productId)
    
    res.json({ compositions, cost })
  } catch (error) {
    console.error('Erreur récupération compositions:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/products/:id/compositions', authenticateSupabaseUser, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const product = await getProductById(productId)
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }
    
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || product.userId !== user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }
    
    const { ingredientId, quantity, unit } = req.body
    const composition = await addProductComposition(productId, ingredientId, quantity, unit)
    
    // Marquer le produit comme composé
    await updateProduct(productId, { isComposite: true })
    
    res.json({ composition })
  } catch (error) {
    console.error('Erreur ajout composition:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.delete('/api/compositions/:id', authenticateSupabaseUser, async (req, res) => {
  try {
    const compositionId = parseInt(req.params.id)
    await deleteProductComposition(compositionId)
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression composition:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/stock-history', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    // Use VERIFIED user ID from JWT
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const limit = parseInt(req.query.limit) || 100
    const history = await getAllStockHistory(user.id, limit)
    res.json({ history })
  } catch (error) {
    console.error('Erreur récupération historique:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get sales history for a specific product
app.get('/api/sales-history/:productId', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const product = await getProductById(productId)
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }
    
    // Verify ownership
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || product.userId !== user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }
    
    const daysBack = parseInt(req.query.days) || 30
    const salesHistory = await getSalesForProduct(productId, daysBack)
    
    res.json({ salesHistory })
  } catch (error) {
    console.error('Erreur récupération ventes:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get sales statistics for all products of a user
app.get('/api/sales-stats', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const daysBack = parseInt(req.query.days) || 30
    const sales = await getSalesByPeriod(user.id, daysBack)
    
    res.json({ sales })
  } catch (error) {
    console.error('Erreur récupération stats ventes:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get current weather for store location
app.get('/api/weather/current', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const mainStore = await getMainStore(user.id)
    const city = mainStore?.city || req.query.city || 'Paris'
    const country = req.query.country || 'FR'
    
    const weather = await weatherService.getCurrentWeather(city, country)
    
    if (!weather) {
      return res.status(503).json({ 
        error: 'Service météo temporairement indisponible',
        fallback: { temp: 20, condition: 'clear', description: 'Conditions normales' }
      })
    }
    
    res.json({ weather })
  } catch (error) {
    console.error('Erreur récupération météo:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get weather forecast for next days
app.get('/api/weather/forecast', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const mainStore = await getMainStore(user.id)
    const city = mainStore?.city || req.query.city || 'Paris'
    const country = req.query.country || 'FR'
    const days = parseInt(req.query.days) || 7
    
    const forecast = await weatherService.getForecast(city, country, days)
    
    if (!forecast) {
      return res.status(503).json({ 
        error: 'Service météo temporairement indisponible'
      })
    }
    
    res.json({ forecast })
  } catch (error) {
    console.error('Erreur récupération prévisions météo:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// AI SUGGESTIONS API
// ============================================

app.get('/api/suggestions', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const limit = parseInt(req.query.limit) || 20
    const includeViewed = req.query.includeViewed !== 'false'
    
    const suggestions = await getUserSuggestions(user.id, { limit, includeViewed })
    const unreadInfo = await getUnreadCount(user.id)
    
    res.json({ 
      suggestions,
      unreadCount: unreadInfo.count,
      hasCritical: unreadInfo.hasCritical
    })
  } catch (error) {
    console.error('Erreur récupération suggestions:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/suggestions/popup-status', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const popupStatus = await shouldShowPopup(user.id)
    
    res.json(popupStatus)
  } catch (error) {
    console.error('Erreur vérification popup:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/suggestions/generate', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const result = await generateAllSuggestions(user.id)
    
    res.json({ 
      success: true,
      generated: result.generated,
      message: `${result.generated} nouvelle(s) suggestion(s) générée(s)`
    })
  } catch (error) {
    console.error('Erreur génération suggestions:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/suggestions/:id/view', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    await markSuggestionViewed(suggestionId, user.id)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur marquage suggestion vue:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/suggestions/:id/dismiss', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    await dismissSuggestion(suggestionId, user.id)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur dismiss suggestion:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/suggestions/:id/act', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    const { action } = req.body
    await actOnSuggestion(suggestionId, user.id, action || 'clicked')
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur action suggestion:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/suggestions/unread-count', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const unreadInfo = await getUnreadCount(user.id)
    
    res.json(unreadInfo)
  } catch (error) {
    console.error('Erreur comptage suggestions:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// Control Center API - Tour de Contrôle IA
// ============================================

app.get('/api/control-center/suggestions', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    await db.update(aiSuggestions)
      .set({ status: 'pending', isRead: false, snoozeUntil: null })
      .where(and(
        eq(aiSuggestions.userId, user.id),
        eq(aiSuggestions.status, 'snoozed'),
        lte(aiSuggestions.snoozeUntil, new Date())
      ))
    
    const { domain, severity, status, sort } = req.query
    
    let query = db.select().from(aiSuggestions).where(eq(aiSuggestions.userId, user.id))
    
    const conditions = [eq(aiSuggestions.userId, user.id)]
    
    if (domain && domain !== 'all') {
      conditions.push(eq(aiSuggestions.domain, domain))
    }
    
    if (severity && severity !== 'all') {
      conditions.push(eq(aiSuggestions.priority, severity))
    }
    
    if (status === 'unread') {
      conditions.push(eq(aiSuggestions.isRead, false))
    } else if (status === 'read') {
      conditions.push(eq(aiSuggestions.isRead, true))
    }
    
    conditions.push(
      or(
        isNull(aiSuggestions.expiresAt),
        gt(aiSuggestions.expiresAt, new Date())
      )
    )
    conditions.push(ne(aiSuggestions.status, 'dismissed'))
    conditions.push(ne(aiSuggestions.status, 'applied'))
    conditions.push(
      or(
        ne(aiSuggestions.status, 'snoozed'),
        and(
          eq(aiSuggestions.status, 'snoozed'),
          lte(aiSuggestions.snoozeUntil, new Date())
        )
      )
    )
    
    const suggestions = await db.select()
      .from(aiSuggestions)
      .where(and(...conditions))
      .orderBy(
        sort === 'date' ? desc(aiSuggestions.createdAt) :
        sort === 'impact' ? desc(aiSuggestions.impactValue) :
        desc(aiSuggestions.severityScore)
      )
      .limit(100)
    
    const allSuggestions = await db.select()
      .from(aiSuggestions)
      .where(and(
        eq(aiSuggestions.userId, user.id),
        ne(aiSuggestions.status, 'dismissed'),
        ne(aiSuggestions.status, 'applied'),
        or(
          ne(aiSuggestions.status, 'snoozed'),
          and(
            eq(aiSuggestions.status, 'snoozed'),
            lte(aiSuggestions.snoozeUntil, new Date())
          )
        ),
        or(
          isNull(aiSuggestions.expiresAt),
          gt(aiSuggestions.expiresAt, new Date())
        )
      ))
    
    const stats = {
      total: allSuggestions.length,
      critical: allSuggestions.filter(s => s.priority === 'critical').length,
      high: allSuggestions.filter(s => s.priority === 'high').length,
      unread: allSuggestions.filter(s => !s.isRead).length,
      potentialSavings: allSuggestions.reduce((sum, s) => sum + (parseFloat(s.impactValue) || 0), 0)
    }
    
    res.json({ suggestions, stats })
  } catch (error) {
    console.error('Erreur control center suggestions:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/control-center/suggestions/:id/read', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    
    await db.update(aiSuggestions)
      .set({ isRead: true })
      .where(and(
        eq(aiSuggestions.id, suggestionId),
        eq(aiSuggestions.userId, user.id)
      ))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur marquage lu:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/control-center/suggestions/:id/dismiss', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    
    await db.update(aiSuggestions)
      .set({ status: 'dismissed' })
      .where(and(
        eq(aiSuggestions.id, suggestionId),
        eq(aiSuggestions.userId, user.id)
      ))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur dismiss suggestion:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/control-center/suggestions/mark-all-read', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    await db.update(aiSuggestions)
      .set({ isRead: true })
      .where(eq(aiSuggestions.userId, user.id))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur tout marquer lu:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/control-center/suggestions/:id/snooze', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    const hours = parseInt(req.body.hours) || 24
    const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000)
    
    await db.update(aiSuggestions)
      .set({ status: 'snoozed', isRead: true, snoozeUntil })
      .where(and(
        eq(aiSuggestions.id, suggestionId),
        eq(aiSuggestions.userId, user.id)
      ))
    
    res.json({ success: true, snoozeUntil })
  } catch (error) {
    console.error('Erreur snooze suggestion:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/control-center/suggestions/:id/apply', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const suggestionId = parseInt(req.params.id)
    
    await db.update(aiSuggestions)
      .set({ status: 'applied', isRead: true })
      .where(and(
        eq(aiSuggestions.id, suggestionId),
        eq(aiSuggestions.userId, user.id)
      ))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur apply suggestion:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// End Control Center API
// ============================================

// REMOVED: Insecure legacy endpoints that allowed user impersonation and data exfiltration
// - POST /api/users (unauthenticated user creation)
// - GET /api/users/email/:email (email enumeration + data leak)
// - GET /api/users/supabase/:supabaseId (UUID enumeration + data leak)

// Update user business info
app.put('/api/users/business', authenticateSupabaseUser, async (req, res) => {
  try {
    // Use VERIFIED user ID from JWT
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const updates = {}
    if (req.body.businessName) updates.businessName = req.body.businessName
    if (req.body.businessType) updates.businessType = req.body.businessType
    if (req.body.posSystem !== undefined) updates.posSystem = req.body.posSystem || null
    
    const updatedUser = await updateUser(user.id, updates)
    res.json({ user: updatedUser })
  } catch (error) {
    console.error('Erreur mise à jour commerce:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

// Update user plan (PRODUCTION MODE - protection active)
app.put('/api/users/plan', authenticateSupabaseUser, async (req, res) => {
  // Protection production : changements de plan UNIQUEMENT via Stripe
  if (process.env.ENABLE_TEST_MODE !== 'true') {
    return res.status(403).json({ 
      error: 'Plan changes only allowed via Stripe checkout in production',
      message: 'Utilisez la page /upgrade pour changer de plan'
    })
  }

  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const { plan } = req.body
    if (!['basique', 'standard', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Plan invalide' })
    }
    
    const updatedUser = await updateUser(user.id, { plan })
    res.json({ user: updatedUser })
  } catch (error) {
    console.error('Erreur mise à jour plan:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

// Downgrade to Basique (used when trial expires and user doesn't want to pay)
// This endpoint handles product deletion and plan change in one transaction
app.post('/api/users/downgrade-to-basique', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const { productsToKeep } = req.body
    
    // If user has products to manage, verify they selected exactly 10 or less
    const userProducts = await getProductsByUserId(user.id)
    
    if (userProducts.length > 10) {
      if (!productsToKeep || !Array.isArray(productsToKeep)) {
        return res.status(400).json({ 
          error: 'Sélection requise',
          message: 'Vous devez sélectionner les 10 produits à garder',
          productCount: userProducts.length
        })
      }
      
      if (productsToKeep.length !== 10) {
        return res.status(400).json({ 
          error: 'Sélection invalide',
          message: 'Vous devez sélectionner exactement 10 produits à garder'
        })
      }
      
      // Delete products not in the keep list
      const productsToDelete = userProducts.filter(p => !productsToKeep.includes(p.id))
      
      for (const product of productsToDelete) {
        await db.delete(products).where(eq(products.id, product.id))
      }
      
      console.log(`[DOWNGRADE] Deleted ${productsToDelete.length} products for user ${user.email}`)
    }
    
    // Update plan to basique and clear trial
    const updatedUser = await updateUser(user.id, { 
      plan: 'basique',
      trialEndsAt: null
    })
    
    console.log(`[DOWNGRADE] User ${user.email} downgraded to basique`)
    
    res.json({ 
      success: true,
      user: updatedUser,
      message: 'Plan mis à jour vers Basique'
    })
  } catch (error) {
    console.error('Erreur downgrade to basique:', error)
    res.status(500).json({ error: 'Erreur serveur', message: error.message })
  }
})

// Events endpoint (Google Calendar) - secured and uses user's business context
app.get('/api/events', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const businessType = user.businessType || 'commerce'
    
    let city = 'Paris'
    let postalCode = '75001'
    let latitude = null
    let longitude = null
    
    try {
      const mainStore = await db.select()
        .from(stores)
        .where(and(
          eq(stores.userId, user.id),
          eq(stores.isMain, true)
        ))
        .limit(1)
      
      if (mainStore.length > 0) {
        if (mainStore[0].city) {
          city = mainStore[0].city
        }
        if (mainStore[0].postalCode) {
          postalCode = mainStore[0].postalCode
        }
        if (mainStore[0].latitude) {
          latitude = parseFloat(mainStore[0].latitude)
        }
        if (mainStore[0].longitude) {
          longitude = parseFloat(mainStore[0].longitude)
        }
      }
    } catch (storeError) {
      console.log('Impossible de récupérer le store principal, utilisation de Paris par défaut')
    }
    
    const { getLocalPublicEvents } = await import('./googleCalendar.js')
    const events = await getLocalPublicEvents(city, businessType, postalCode, latitude, longitude)
    res.json({ 
      events, 
      userCity: city, 
      userPostalCode: postalCode,
      userLocation: latitude && longitude ? { lat: latitude, lon: longitude } : null
    })
  } catch (error) {
    console.error('Events API error:', error)
    res.json({ events: [], error: error.message })
  }
})

// Referral stats endpoint (sécurisé)
app.get('/api/referral/stats', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user || !user.referralCode) {
      return res.json({ 
        referredCount: 0,
        paidReferralsCount: 0,
        earningsTotal: 0,
        referralCode: user?.referralCode || null
      })
    }

    const allReferrals = await db.select()
      .from(users)
      .where(eq(users.referredBy, user.referralCode))

    const paidReferrals = allReferrals.filter(r => r.plan === 'standard' || r.plan === 'pro')

    res.json({
      referredCount: allReferrals.length,
      paidReferralsCount: paidReferrals.length,
      earningsTotal: paidReferrals.length * 10,
      referralCode: user.referralCode
    })
  } catch (error) {
    console.error('Erreur stats parrainage:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Weather endpoint (sécurisé côté serveur)
app.get('/api/weather', async (req, res) => {
  try {
    const { city = 'Paris', country = 'FR' } = req.query
    const apiKey = process.env.OPENWEATHER_API_KEY
    
    if (!apiKey) {
      return res.json({ 
        weather: null, 
        message: 'OpenWeatherMap API key not configured' 
      })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric&lang=fr`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    
    const weather = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: Math.round(data.wind.speed * 3.6),
      city: data.name
    }

    res.json({ weather })
  } catch (error) {
    console.error('Weather API error:', error)
    res.json({ weather: null, error: error.message })
  }
})

// ============================================
// STRIPE ENDPOINTS
// ============================================

// Create Stripe checkout session for subscription upgrade
app.post('/api/stripe/create-checkout', authenticateSupabaseUser, async (req, res) => {
  try {
    const { plan, billingPeriod = 'monthly' } = req.body
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Price IDs from environment variables
    const prices = {
      standard: {
        monthly: process.env.STRIPE_PRICE_STANDARD_MONTHLY,
        yearly: process.env.STRIPE_PRICE_STANDARD_YEARLY
      },
      pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
        yearly: process.env.STRIPE_PRICE_PRO_YEARLY
      }
    }

    if (!prices[plan] || !prices[plan][billingPeriod]) {
      return res.status(400).json({ error: 'Plan ou période de facturation invalide' })
    }

    const selectedPriceId = prices[plan][billingPeriod]

    // Validate that price ID exists
    if (!selectedPriceId) {
      console.error(`Missing Stripe Price ID for plan=${plan}, period=${billingPeriod}`)
      return res.status(500).json({ 
        error: 'Configuration Stripe manquante. Les Price IDs ne sont pas configurés. Veuillez contacter le support.' 
      })
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          poniaUserId: user.id.toString(),
          supabaseId: user.supabaseId
        }
      })
      customerId = customer.id
      await updateUser(user.id, { stripeCustomerId: customerId })
    }

    const getBaseUrl = () => {
      // Production: myponia.fr
      if (process.env.REPLIT_DEPLOYMENT === '1') {
        return 'https://myponia.fr'
      }
      // Dev: Replit preview
      if (process.env.REPLIT_DEV_DOMAIN) {
        return `https://${process.env.REPLIT_DEV_DOMAIN}`
      }
      // Local dev
      return 'http://localhost:5000'
    }

    const baseUrl = getBaseUrl()

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: selectedPriceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/settings?upgrade=cancelled`,
      metadata: {
        poniaUserId: user.id.toString(),
        plan,
        billingPeriod
      }
    })

    res.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Erreur création checkout Stripe:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Rate limiting for admin login (in-memory - simple but effective)
const adminLoginAttempts = new Map()

function checkAdminRateLimit(ip) {
  const now = Date.now()
  const attempts = adminLoginAttempts.get(ip) || []
  
  const recentAttempts = attempts.filter(time => now - time < 3600000)
  
  if (recentAttempts.length >= 5) {
    return false
  }
  
  recentAttempts.push(now)
  adminLoginAttempts.set(ip, recentAttempts)
  return true
}

// Admin login endpoint (no JWT required)
app.post('/api/admin/auth', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  
  try {
    const { code } = req.body

    if (!code || typeof code !== 'string') {
      console.warn(`[ADMIN AUTH] Code manquant depuis IP: ${clientIp}`)
      return res.status(400).json({ message: 'Code admin requis' })
    }

    if (!checkAdminRateLimit(clientIp)) {
      console.warn(`[ADMIN AUTH] Rate limit dépassé pour IP: ${clientIp}`)
      return res.status(429).json({ message: 'Trop de tentatives. Réessayez dans 1 heure.' })
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
    const adminEmail = (code.trim() + '@myponia.fr').toLowerCase()

    if (!adminEmails.includes(adminEmail)) {
      console.warn(`[ADMIN AUTH] Code invalide depuis IP: ${clientIp}, code: ${code}`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return res.status(401).json({ message: 'Code admin invalide' })
    }

    console.log(`[ADMIN AUTH] Tentative de connexion valide pour: ${adminEmail} depuis IP: ${clientIp}`)

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Erreur listUsers:', listError)
      return res.status(500).json({ message: 'Erreur serveur' })
    }

    const existingUser = users.find(u => u.email && u.email.toLowerCase() === adminEmail)

    if (!existingUser) {
      const { data: newUserData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      })

      if (signUpError) {
        console.error('Erreur création admin:', signUpError)
        return res.status(500).json({ message: 'Erreur création compte admin' })
      }

      const poniaUser = await getUserByEmail(adminEmail)
      if (!poniaUser) {
        await createUser({
          supabaseId: newUserData.user.id,
          email: adminEmail,
          businessName: 'PONIA Admin',
          businessType: 'admin',
          plan: 'pro',
          trialEndsAt: null
        })
      }
    } else if (!existingUser.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true
      })
    }

    const { data: magicLink, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: adminEmail
    })

    if (linkError) {
      console.error('Erreur génération magic link:', linkError)
      return res.status(500).json({ message: 'Erreur serveur' })
    }

    const { data: verified, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: magicLink.properties.hashed_token,
      type: 'email'
    })

    if (verifyError) {
      console.error('Erreur vérification OTP:', verifyError)
      return res.status(500).json({ message: 'Erreur de connexion' })
    }

    console.log(`[ADMIN AUTH] ✅ Connexion réussie pour ${adminEmail} depuis IP: ${clientIp}`)

    const adminJwt = jwt.sign(
      { email: adminEmail, isAdmin: true },
      ADMIN_JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie('ponia_admin_token', adminJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      message: 'Admin session created'
    })
  } catch (error) {
    console.error('Erreur admin auth:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// Admin check middleware (for Supabase session based auth)
async function requireAdmin(req, res, next) {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
    const isAdmin = adminEmails.includes(user.email.toLowerCase())

    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Accès refusé - droits admin requis',
        message: 'Cette page est réservée aux administrateurs'
      })
    }

    next()
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Admin check middleware (for JWT cookie-based auth)
function requireAdminCookie(req, res, next) {
  try {
    const adminToken = req.cookies?.ponia_admin_token
    
    if (!adminToken) {
      return res.status(401).json({ error: 'Session admin expirée' })
    }

    try {
      const decoded = jwt.verify(adminToken, ADMIN_JWT_SECRET)
      if (!decoded.isAdmin) {
        return res.status(403).json({ error: 'Accès admin non autorisé' })
      }
      req.adminEmail = decoded.email
      next()
    } catch (jwtError) {
      return res.status(401).json({ error: 'Session admin invalide' })
    }
  } catch (error) {
    console.error('Erreur vérification admin cookie:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Admin: Get all users - DEPRECATED, use /api/admin/users-by-code with httpOnly cookie
app.get('/api/admin/users', (req, res) => {
  res.status(410).json({ 
    error: 'This endpoint is deprecated. Please use /admin-login to access admin dashboard.' 
  })
})

// Admin logout - clear the admin session cookie
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('ponia_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  res.json({ success: true, message: 'Admin session ended' })
})

// ============ PARTNER ENDPOINTS ============

// Generate unique partner referral code
function generatePartnerCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'CPT-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Register new partner (accountant)
app.post('/api/partners', async (req, res) => {
  try {
    const { name, companyName, email, phone, partnerType, estimatedClients } = req.body

    if (!name || !companyName || !email) {
      return res.status(400).json({ error: 'Nom, cabinet et email requis' })
    }

    const existingPartner = await db.select().from(partners).where(eq(partners.email, email)).limit(1)
    if (existingPartner.length > 0) {
      return res.status(400).json({ error: 'Un partenaire avec cet email existe déjà' })
    }

    let referralCode = generatePartnerCode()
    let codeExists = true
    while (codeExists) {
      const existing = await db.select().from(partners).where(eq(partners.referralCode, referralCode)).limit(1)
      if (existing.length === 0) codeExists = false
      else referralCode = generatePartnerCode()
    }

    const [newPartner] = await db.insert(partners).values({
      name,
      companyName,
      email,
      phone: phone || null,
      partnerType: partnerType || 'comptable',
      commissionRate: 50,
      estimatedClients: estimatedClients || null,
      referralCode,
      status: 'pending'
    }).returning()

    // Send emails
    console.log('Checking RESEND_API_KEY for partner emails...')
    if (process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY found, sending partner emails...')
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        // 1. Send confirmation email to partner (pending analysis)
        const partnerEmailResult = await resend.emails.send({
          from: 'PONIA <noreply@myponia.fr>',
          to: email,
          subject: 'Votre demande de partenariat PONIA a bien été reçue',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                  <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Merci ${name} !</h1>
                  <p style="color: #FFD700; margin: 0; font-weight: 600;">Votre demande a été reçue</p>
                </div>
                
                <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  <div style="background: linear-gradient(135deg, #FFD700 0%, #FFC000 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 48px; font-weight: 800; color: #1a1a1a;">50%</div>
                    <div style="color: #333; font-weight: 600;">de commission pendant 6 mois</div>
                  </div>
                  
                  <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px; text-align: center;">Prochaines étapes</h2>
                  
                  <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background: #FFD700; color: #1a1a1a; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; margin-right: 12px;">1</div>
                      <div>
                        <div style="font-weight: 600; color: #1a1a1a;">Analyse de votre dossier</div>
                        <div style="color: #666; font-size: 14px;">Notre équipe examine votre candidature</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #666; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; margin-right: 12px;">2</div>
                      <div>
                        <div style="font-weight: 600; color: #1a1a1a;">Validation sous quelques minutes</div>
                        <div style="color: #666; font-size: 14px;">Nous vous recontacterons très rapidement</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: flex-start;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #666; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; margin-right: 12px;">3</div>
                      <div>
                        <div style="font-weight: 600; color: #1a1a1a;">Votre code partenaire</div>
                        <div style="color: #666; font-size: 14px;">Vous recevrez votre lien unique par email</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style="background: #fef3c7; border-radius: 8px; padding: 16px; text-align: center;">
                    <p style="color: #92400e; font-size: 14px; margin: 0;">
                      <strong>Bon à savoir :</strong> Avec 10 clients Standard (49€/mois), vous gagnez <strong>1 470€ sur 6 mois</strong> de commission !
                    </p>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin-top: 24px; text-align: center;">
                    Des questions ? Répondez directement à cet email.<br>
                    Nous vous recontacterons dans les plus brefs délais.
                  </p>
                </div>
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
                  PONIA - support@myponia.fr
                </p>
              </div>
            </body>
            </html>
          `
        })
        console.log('Partner email result:', JSON.stringify(partnerEmailResult, null, 2))
        
        // 2. Send notification to admin
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['support@myponia.fr']
        console.log('Sending admin notification to:', adminEmails)
        const adminEmailResult = await resend.emails.send({
          from: 'PONIA <noreply@myponia.fr>',
          to: adminEmails,
          subject: `Nouveau partenaire comptable : ${companyName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
                  <h1 style="color: white; font-size: 24px; margin: 0;">Nouveau partenaire !</h1>
                </div>
                
                <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px;">Informations du partenaire</h2>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #666;">Nom</td>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #666;">Cabinet</td>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a;">${companyName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #666;">Email</td>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #666;">Téléphone</td>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a;">${phone || 'Non renseigné'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #666;">Clients food estimés</td>
                      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a;">${estimatedClients || 'Non renseigné'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; font-weight: 600; color: #666;">Code réservé</td>
                      <td style="padding: 12px; color: #FFD700; font-weight: 700; font-family: monospace;">${referralCode}</td>
                    </tr>
                  </table>
                  
                  <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>Action requise :</strong> Valider ce partenaire dans l'admin pour activer son compte et lui envoyer son code.
                    </p>
                  </div>
                  
                  <div style="margin-top: 24px; text-align: center;">
                    <a href="https://myponia.fr/admin" style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFC000 100%); color: #1a1a1a; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600;">
                      Aller dans l'admin
                    </a>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        })
        console.log('Admin email result:', JSON.stringify(adminEmailResult, null, 2))
        
        console.log('Partner emails sent successfully!')
      } catch (emailErr) {
        console.error('Error sending partner emails:', emailErr)
      }
    } else {
      console.log('RESEND_API_KEY not found, skipping emails')
    }

    res.json({ 
      success: true, 
      partner: newPartner,
      message: 'Inscription réussie ! Vérifiez votre email.'
    })
  } catch (error) {
    console.error('Error creating partner:', error)
    res.status(500).json({ error: 'Erreur lors de l\'inscription' })
  }
})

// Get partner data and their referrals
app.get('/api/partners/:code', async (req, res) => {
  try {
    const { code } = req.params

    const [partner] = await db.select().from(partners).where(eq(partners.referralCode, code)).limit(1)
    if (!partner) {
      return res.status(404).json({ error: 'Partenaire non trouvé' })
    }

    const referrals = await db.select().from(users).where(eq(users.referredBy, code))

    res.json({ partner, referrals })
  } catch (error) {
    console.error('Error fetching partner:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Commercial Dashboard - Get commercial data by code
app.get('/api/commercials/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase()

    const [commercial] = await db.select().from(partners)
      .where(and(
        eq(partners.referralCode, code),
        eq(partners.partnerType, 'commercial')
      ))
      .limit(1)
    
    if (!commercial) {
      return res.status(404).json({ error: 'Code commercial non trouvé' })
    }

    const referrals = await db.select().from(users).where(eq(users.referredBy, code))
    
    const now = new Date()
    const sanitizedReferrals = referrals.map(r => {
      const trialEnded = r.trialEndsAt && new Date(r.trialEndsAt) < now
      const isPaying = (r.plan === 'standard' || r.plan === 'pro') && 
                       (trialEnded || r.subscriptionStatus === 'active')
      return {
        email: r.email,
        businessName: r.businessName,
        businessType: r.businessType,
        plan: r.plan,
        createdAt: r.createdAt,
        isPaying
      }
    })

    const safeCommercial = {
      id: commercial.id,
      name: commercial.name,
      email: commercial.email,
      referralCode: commercial.referralCode,
      commissionRate: commercial.commissionRate,
      status: commercial.status,
      createdAt: commercial.createdAt
    }

    res.json({ commercial: safeCommercial, referrals: sanitizedReferrals })
  } catch (error) {
    console.error('Error fetching commercial:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Commercial Kit PDF Download
app.get('/api/commercial-kit-pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateCommercialKitPDF()
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=PONIA-Kit-Commercial.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)
    
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Error generating commercial kit PDF:', error)
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' })
  }
})

// Create commercial partner
app.post('/api/commercials', async (req, res) => {
  try {
    const { name, email, phone } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Nom et email requis' })
    }

    const generateCommercialCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = 'COM-'
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    let referralCode = generateCommercialCode()
    let codeExists = true
    while (codeExists) {
      const existing = await db.select().from(partners).where(eq(partners.referralCode, referralCode)).limit(1)
      if (existing.length === 0) codeExists = false
      else referralCode = generateCommercialCode()
    }

    const [newCommercial] = await db.insert(partners).values({
      name,
      companyName: 'Commercial PONIA',
      email,
      phone: phone || null,
      partnerType: 'commercial',
      commissionRate: 35,
      referralCode,
      status: 'active'
    }).returning()

    res.json({ 
      success: true, 
      commercial: newCommercial,
      message: `Commercial créé avec le code ${referralCode}`
    })
  } catch (error) {
    console.error('Error creating commercial:', error)
    res.status(500).json({ error: 'Erreur lors de la création du commercial' })
  }
})

// Admin: Get all users and stats (SECURED with admin cookie)
app.get('/api/admin/users-by-code', requireAdminCookie, async (req, res) => {
  try {
    const allUsers = await db.select().from(users).orderBy(users.createdAt)

    const now = new Date()
    const activeTrials = allUsers.filter(u => 
      u.trialEndsAt && new Date(u.trialEndsAt) > now
    ).length

    const paidUsers = allUsers.filter(u => 
      (u.plan === 'standard' || u.plan === 'pro') && (!u.trialEndsAt || new Date(u.trialEndsAt) <= now)
    ).length

    const totalRevenue = allUsers.reduce((sum, u) => {
      const isInTrial = u.trialEndsAt && new Date(u.trialEndsAt) > now
      if (isInTrial) return sum
      if (u.plan === 'standard') return sum + 49
      if (u.plan === 'pro') return sum + 69
      return sum
    }, 0)

    res.json({
      users: allUsers,
      stats: {
        totalUsers: allUsers.length,
        activeTrials,
        paidUsers,
        totalRevenue: Math.round(totalRevenue)
      }
    })
  } catch (error) {
    console.error('Erreur admin users-by-code:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ==========================================
// ADMIN: PARTNER MANAGEMENT
// ==========================================

// Admin: Get all partners
app.get('/api/admin/partners', requireAdminCookie, async (req, res) => {
  try {
    const allPartners = await db.select().from(partners).orderBy(partners.createdAt)
    res.json({ partners: allPartners })
  } catch (error) {
    console.error('Error fetching partners:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Admin: Validate a partner (change status to active and send activation email)
app.post('/api/admin/partners/:id/validate', requireAdminCookie, async (req, res) => {
  try {
    const partnerId = parseInt(req.params.id)
    const { resend: resendEmail } = req.query
    
    const [partner] = await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1)
    if (!partner) {
      return res.status(404).json({ error: 'Partenaire non trouvé' })
    }
    
    const isAlreadyActive = partner.status === 'active'
    
    if (isAlreadyActive && resendEmail !== 'true') {
      return res.status(400).json({ error: 'Ce partenaire est déjà actif. Utilisez ?resend=true pour renvoyer l\'email.' })
    }
    
    // Send activation email FIRST, before updating status
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured - cannot send activation email')
      return res.status(500).json({ error: 'Configuration email manquante. Contactez le support.' })
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY)
      
      const dashboardUrl = 'https://myponia.fr/partenaire/dashboard'
      
      await resend.emails.send({
        from: 'PONIA <noreply@myponia.fr>',
        to: partner.email,
        subject: 'Votre compte partenaire PONIA est activé !',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://myponia.fr/logo-ponia-full.png" alt="PONIA" style="height: 50px;" />
              </div>
              
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                <h1 style="color: white; font-size: 28px; margin: 0;">Félicitations ${partner.name} !</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Votre compte partenaire est maintenant actif</p>
              </div>
              
              <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: #FFF7E6; border: 2px solid #FFD700; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <p style="color: #92400e; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Votre code de parrainage exclusif</p>
                  <p style="font-size: 32px; font-weight: 800; color: #000; margin: 0; letter-spacing: 2px;">${partner.referralCode}</p>
                </div>
                
                <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                  Partagez ce code avec vos clients commerçants. Pour chaque client qui s'abonne à PONIA avec votre code, vous recevez <strong>50% de commission récurrente pendant 6 mois</strong>.
                </p>
                
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px 0;">Comment ça marche ?</h3>
                  <ol style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>Partagez votre code <strong>${partner.referralCode}</strong> à vos clients</li>
                    <li>Ils l'entrent lors de leur inscription sur PONIA</li>
                    <li>Vous gagnez 50% de leur abonnement pendant 6 mois</li>
                  </ol>
                </div>
                
                <a href="${dashboardUrl}" style="display: block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 24px;">
                  Accéder à mon tableau de bord
                </a>
                
                <p style="color: #6b7280; font-size: 14px; text-align: center;">
                  Des questions ? Répondez à cet email ou contactez-nous à support@myponia.fr
                </p>
              </div>
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
                PONIA - support@myponia.fr
              </p>
            </div>
          </body>
          </html>
        `
    })
    console.log('Activation email sent to partner:', partner.email)
    
    // Update status to active ONLY after email is successfully sent
    if (!isAlreadyActive) {
      await db.update(partners).set({ status: 'active' }).where(eq(partners.id, partnerId))
    }
    
    res.json({ success: true, message: isAlreadyActive ? 'Email renvoyé avec succès' : 'Partenaire activé avec succès' })
  } catch (error) {
    console.error('Error validating partner:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ==========================================
// POS INTEGRATIONS (Direct Adapters)
// ==========================================

// Get list of supported POS providers
app.get('/api/integrations/providers', (req, res) => {
  res.json({ providers: getSupportedProviders() })
})

// Get all POS connections for user
app.get('/api/integrations/connections', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const connections = await getPosConnectionsByUser(user.id)
    res.json({ connections })
  } catch (error) {
    console.error('Error fetching POS connections:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Initiate POS connection (get OAuth URL or handle API key auth)
app.post('/api/integrations/connect', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Check plan - only Standard and Pro can connect POS
    if (user.plan === 'basique') {
      return res.status(403).json({ 
        error: 'Abonnement requis',
        message: 'L\'intégration caisse est disponible à partir du plan Standard.'
      })
    }

    const { provider, providerName, credentials } = req.body
    if (!provider) {
      return res.status(400).json({ error: 'Provider requis' })
    }

    // Check if provider is supported
    if (!isProviderSupported(provider)) {
      return res.status(400).json({ error: 'Caisse non supportée' })
    }

    // Check if already connected
    const existingConnection = await getPosConnectionByProvider(user.id, provider)
    if (existingConnection && existingConnection.status === 'active') {
      return res.status(400).json({ 
        error: 'Déjà connecté',
        message: `Vous êtes déjà connecté à ${providerName}`
      })
    }

    // Get main store
    const store = await getMainStore(user.id)

    // Get adapter for this provider
    const adapter = getAdapter(provider)

    // Check if we're in demo mode for this provider
    if (isDemoMode(provider)) {
      // Create connection in demo mode
      const connection = await createPosConnection({
        userId: user.id,
        storeId: store?.id,
        provider,
        providerName: providerName || adapter.displayName,
        status: 'active',
        connectionId: `demo_${Date.now()}`,
        metadata: JSON.stringify({ demoMode: true })
      })

      return res.json({
        success: true,
        demoMode: true,
        connection: await getPosConnectionById(connection.id),
        message: `Mode démo: ${providerName || adapter.displayName} simulé comme connecté`
      })
    }

    // For API key auth (like Hiboutik)
    if (credentials) {
      try {
        const authResult = await adapter.authenticate(credentials)
        
        const connection = await createPosConnection({
          userId: user.id,
          storeId: store?.id,
          provider,
          providerName: providerName || adapter.displayName,
          status: 'active',
          accessToken: authResult.accessToken,
          metadata: JSON.stringify({ account: credentials.account })
        })

        return res.json({
          success: true,
          connection: await getPosConnectionById(connection.id),
          message: `Connecté à ${providerName || adapter.displayName}`
        })
      } catch (authError) {
        return res.status(401).json({ error: 'Identifiants invalides', message: authError.message })
      }
    }

    // For OAuth flow - create pending connection first
    const connection = await createPosConnection({
      userId: user.id,
      storeId: store?.id,
      provider,
      providerName: providerName || adapter.displayName,
      status: 'pending'
    })

    // Generate state for OAuth
    const state = Buffer.from(JSON.stringify({
      userId: user.id,
      storeId: store?.id,
      provider,
      connectionId: connection.id
    })).toString('base64')

    // Get authorization URL
    const authUrl = adapter.getAuthorizationUrl(state)

    if (!authUrl) {
      // If no OAuth URL (API key auth required), return instruction
      return res.json({
        requiresCredentials: true,
        credentialsType: 'apikey',
        message: 'Cette caisse nécessite des identifiants API'
      })
    }

    res.json({ authUrl, connectionId: connection.id })
  } catch (error) {
    console.error('Error initiating POS connection:', error)
    res.status(500).json({ error: 'Erreur de connexion' })
  }
})

// OAuth callback handler for each provider
app.get('/api/pos/callback/:provider', async (req, res) => {
  console.log('OAuth callback received for provider:', req.params.provider)
  console.log('Query params:', req.query)
  
  try {
    const { provider } = req.params
    const { code, state, error: oauthError, error_description } = req.query

    if (oauthError) {
      console.error('OAuth error from provider:', oauthError, error_description)
      return res.redirect('/integrations?error=' + encodeURIComponent(oauthError))
    }

    if (!code || !state) {
      console.error('Missing code or state:', { code: !!code, state: !!state })
      return res.redirect('/integrations?error=missing_params')
    }

    // Decode state
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
      console.log('Decoded state:', stateData)
    } catch (e) {
      console.error('Failed to decode state:', e)
      return res.redirect('/integrations?error=invalid_state')
    }

    const { userId, connectionId } = stateData

    // Get adapter and exchange code for tokens
    console.log('Exchanging code for tokens with', provider, 'adapter...')
    const adapter = getAdapter(provider)
    const tokenData = await adapter.handleCallback(code, state)
    console.log('Token exchange successful, merchantId:', tokenData.merchantId || tokenData.companyId)

    // Update connection with tokens
    await updatePosConnection(connectionId, {
      connectionId: tokenData.merchantId || tokenData.companyId || `${provider}_${connectionId}`,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenExpiresAt: tokenData.expiresAt,
      status: 'active',
      lastSyncAt: new Date(),
      metadata: JSON.stringify({
        domainPrefix: tokenData.domainPrefix,
        merchantId: tokenData.merchantId,
        companyId: tokenData.companyId
      })
    })

    // Create sync log
    await createPosSyncLog({
      posConnectionId: connectionId,
      syncType: 'oauth_complete',
      status: 'success'
    })

    console.log('OAuth flow completed successfully for', provider)
    res.redirect('/integrations?success=true&provider=' + provider)
  } catch (error) {
    console.error('OAuth callback error:', error.message || error)
    console.error('Stack:', error.stack)
    res.redirect('/integrations?error=callback_failed&detail=' + encodeURIComponent(error.message || 'unknown'))
  }
})

// Disconnect POS
app.delete('/api/integrations/connections/:id', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const connection = await getPosConnectionById(parseInt(req.params.id))
    if (!connection || connection.userId !== user.id) {
      return res.status(404).json({ error: 'Connexion non trouvée' })
    }

    await deletePosConnection(connection.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting POS:', error)
    res.status(500).json({ error: 'Erreur de déconnexion' })
  }
})

// Sync products from POS
app.post('/api/integrations/sync/:id', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const connection = await getPosConnectionById(parseInt(req.params.id))
    if (!connection || connection.userId !== user.id) {
      return res.status(404).json({ error: 'Connexion non trouvée' })
    }

    // Get adapter for this provider
    const adapter = getAdapter(connection.provider)

    // Create sync log
    const syncLog = await createPosSyncLog({
      posConnectionId: connection.id,
      syncType: 'manual_sync',
      status: 'in_progress'
    })

    // Check if demo mode
    const isDemo = isDemoMode(connection.provider) || connection.connectionId?.startsWith('demo_')
    
    let products = []
    
    if (isDemo) {
      // Get demo products from adapter
      products = adapter.getDemoProducts()
    } else {
      // Get real products from POS
      try {
        const metadata = connection.metadata ? JSON.parse(connection.metadata) : {}
        products = await adapter.getProducts(connection.accessToken, {
          account: metadata.account,
          domainPrefix: metadata.domainPrefix,
          companyId: metadata.companyId,
          restaurantId: metadata.restaurantId
        })
      } catch (fetchError) {
        await updatePosSyncLog(syncLog.id, {
          status: 'error',
          errorMessage: fetchError.message,
          completedAt: new Date()
        })
        throw fetchError
      }
    }

    // Process products
    let itemsProcessed = 0
    for (const product of products) {
      try {
        // Check if mapping already exists
        const existingMappings = await getPosProductMappings(connection.id)
        const exists = existingMappings.some(m => m.posProductId === product.id)
        
        if (!exists) {
          await createPosProductMapping({
            posConnectionId: connection.id,
            posProductId: product.id,
            posProductName: product.name,
            posProductSku: product.sku,
            posProductPrice: product.price,
            posProductCategory: product.category
          })
          itemsProcessed++
        }
      } catch (err) {
        console.log('Error processing product:', product.name, err.message)
      }
    }

    await updatePosSyncLog(syncLog.id, {
      status: 'success',
      itemsProcessed,
      completedAt: new Date()
    })

    await updatePosConnection(connection.id, {
      lastSyncAt: new Date()
    })

    res.json({
      success: true,
      message: isDemo 
        ? `Mode démo: ${itemsProcessed} produits synchronisés` 
        : `${itemsProcessed} produits synchronisés`,
      itemsProcessed,
      demoMode: isDemo
    })
  } catch (error) {
    console.error('Error syncing POS:', error)
    res.status(500).json({ error: 'Erreur de synchronisation' })
  }
})

// Get product mappings for a connection
app.get('/api/integrations/mappings/:connectionId', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const connection = await getPosConnectionById(parseInt(req.params.connectionId))
    if (!connection || connection.userId !== user.id) {
      return res.status(404).json({ error: 'Connexion non trouvée' })
    }

    const mappings = await getPosProductMappings(connection.id)
    const poniaProducts = await getProductsByUserId(user.id)

    res.json({ 
      mappings,
      poniaProducts 
    })
  } catch (error) {
    console.error('Error fetching mappings:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Update product mapping (link POS product to PONIA product)
app.put('/api/integrations/mappings/:mappingId', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const { poniaProductId, autoSync } = req.body
    
    const updated = await updatePosProductMapping(parseInt(req.params.mappingId), {
      poniaProductId: poniaProductId || null,
      isMapped: !!poniaProductId,
      autoSync: autoSync !== false
    })

    res.json({ mapping: updated })
  } catch (error) {
    console.error('Error updating mapping:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get sync logs for a connection
app.get('/api/integrations/logs/:connectionId', authenticateSupabaseUser, async (req, res) => {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    const connection = await getPosConnectionById(parseInt(req.params.connectionId))
    if (!connection || connection.userId !== user.id) {
      return res.status(404).json({ error: 'Connexion non trouvée' })
    }

    const logs = await getPosSyncLogs(connection.id)
    res.json({ logs })
  } catch (error) {
    console.error('Error fetching sync logs:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Webhook endpoint for real-time POS updates
app.post('/api/integrations/webhook', express.json(), async (req, res) => {
  try {
    const { event_type, connection_id, data } = req.body

    console.log('[POS Webhook] Received:', event_type, 'for connection:', connection_id)

    // Find connection by Chift connection ID
    // Note: In production, you'd verify the webhook signature
    
    if (event_type === 'sale.created') {
      // Process new sale
      const { transaction_id, items, total, payment_method, timestamp } = data
      
      // Find connection and process each item
      // This would update stock based on mapped products
      console.log('[POS Webhook] Sale processed:', transaction_id)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Endpoint téléchargement Guide PONIA A-Z (PUBLIC)
app.get('/api/guide-ponia-az', (req, res) => {
  try {
    const doc = generateGuidePDF()
    const pdfPath = path.join(__dirname, '../public/Guide-PONIA-A-Z.pdf')
    
    const writeStream = fs.createWriteStream(pdfPath)
    doc.pipe(writeStream)
    doc.pipe(res)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="Guide-PONIA-A-Z.pdf"')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    doc.end()
  } catch (error) {
    console.error('Erreur generation guide PDF:', error)
    res.status(500).json({ error: 'Erreur lors de la generation du guide' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PONIA Backend' })
})

// Serve static files from dist (production mode)
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  console.log('📦 Production mode: serving static files from dist/')
  app.use(express.static(distPath))
  
  // Catch-all: serve index.html for all non-API routes (React Router)
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  console.log('🔧 Development mode: dist/ not found')
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend PONIA démarré sur port ${PORT}`)
})
