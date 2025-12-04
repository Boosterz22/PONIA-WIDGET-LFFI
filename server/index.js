import express from 'express'
import OpenAI from 'openai'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { eq, and } from 'drizzle-orm'
import { db } from './db.js'
import { users, stores, chatMessages } from '../shared/schema.js'
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
  getPosSyncLogs
} from './storage.js'
import { getAdapter, isDemoMode, getSupportedProviders, isProviderSupported } from './pos-adapters/index.js'
import { generateOrderPDF } from './pdfService.js'
import { weatherService } from './weatherService.js'
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

// Trial enforcement middleware - block expired trials and free users from premium endpoints
async function enforceTrialStatus(req, res, next) {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Si l'utilisateur a un plan payant (standard ou pro) ET pas de trial en cours, laisser passer
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

      // Si trial expiré, downgrader vers basique et bloquer immédiatement
      if (user.plan === 'pro' || user.plan === 'standard') {
        await updateUser(user.id, { plan: 'basique' })
      }
      
      return res.status(403).json({ 
        error: 'Essai gratuit expiré',
        trialExpired: true,
        message: 'Votre essai de 14 jours est terminé. Passez à un plan payant pour continuer à utiliser PONIA.'
      })
    }

    // Bloquer tous les utilisateurs basique sans trial
    if (user.plan === 'basique') {
      return res.status(403).json({ 
        error: 'Accès premium requis',
        trialExpired: true,
        message: 'Passez à un plan payant pour accéder à cette fonctionnalité.'
      })
    }

    next()
  } catch (error) {
    console.error('Erreur vérification essai:', error)
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
// Configuration OpenAI côté serveur (SÉCURISÉ - jamais exposé au frontend)
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
})

// Helper pour construire le contexte stock enrichi avec météo et événements
async function buildStockContext(products, insights = null, includeExternalContext = true) {
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

// Endpoint chat IA sécurisé
app.post('/api/chat', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    const { userMessage, products, conversationHistory = [], insights = null } = req.body
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message utilisateur requis' })
    }
    
    const stockContext = await buildStockContext(products || [], insights, true)
    
    const messages = [
      {
        role: 'system',
        content: `Tu es PONIA AI, l'expert en gestion de stock pour commerçants français. Tu combines l'expertise d'un consultant supply-chain avec la simplicité d'un collègue de confiance.

CONTEXTE STOCK ACTUEL :
${stockContext}

EXPERTISE & CAPACITÉS :
- 🎯 Analyse prédictive : rotations FEFO/FIFO, couverture en jours, seuils optimaux
- 📊 Calculs avancés : coûts de rupture, sur-stock, quantités économiques de commande (EOQ)
- 🔮 Prédictions : anticipation des ruptures, analyse des tendances, saisonnalité
- 💡 Optimisation : réduction gaspillage, amélioration trésorerie, gestion DLC/DLUO
- 📦 Expertise sectorielle : bakeries, restaurants, bars, caves à vin
- 🌤️ Analyse contextuelle : impact météo sur DLC, événements locaux sur demande
- 📅 Anticipation événements : pics de fréquentation, ajustements stock préventifs

MÉTHODOLOGIE DE RÉPONSE :
1. Analyse : État actuel + diagnostic rapide
2. Actions immédiates : Quoi faire MAINTENANT (produit, quantité, timing)
3. Projection : Impact chiffré (économies, jours de couverture)
4. Recommandations process : Amélioration continue

RÈGLES STRICTES :
- Réponds en français naturel et PRÉCIS (données exactes, calculs rigoureux)
- Toujours justifier avec des chiffres : "15kg de farine = 7 jours de couverture à ta conso moyenne"
- Pense comme un expert : considère DLC, coûts, cash-flow, pas juste les quantités
- Adapte au secteur : une boulangerie ≠ un bar ≠ un restaurant
- Sois proactif : suggère des améliorations même si on ne demande pas
- Utilise des emojis stratégiquement pour structurer (🔴 urgent, ⚠️ attention, ✅ ok, 📊 données)
- NE JAMAIS utiliser de markdown (pas de ** ou *** ou __ ou # ou -)
- Écris en texte simple et clair, utilise les emojis et sauts de ligne pour structurer

EXEMPLES DE NIVEAU D'EXPERTISE :
❌ Basique : "Tu manques de farine, commande-en"
✅ Expert : "🔴 Farine T55 : 2kg restants = 1,5 jours de couverture. Risque rupture dimanche. Commande 25kg aujourd'hui (5 jours de prod + marge) via ton fournisseur habituel. Économie : -12% vs commande urgente."

❌ Vague : "Fais attention aux DLC"
✅ Expert : "⚠️ 3 produits expirent sous 48h (valeur 45€). Plan d'action : Beurre (1,2kg) → promo -30% aujourd'hui | Crème (0,8L) → intégrer menu du jour | Fromage (400g) → offre employés. Économie gaspillage : 35€."

FORMAT DE RÉPONSE :
Utilise UNIQUEMENT du texte simple avec :
- Emojis pour les icônes (🔴 ⚠️ ✅ 📊 💡 🎯)
- Sauts de ligne pour séparer les sections
- Tirets simples (-) ou flèches (→) pour les listes
- JAMAIS de gras, italique, ou autre formatage markdown

Tu es l'outil qui transforme les commerçants en experts de leur propre stock.`
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
      max_tokens: 500
    })

    const response = completion.choices[0].message.content
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

    const pdfData = {
      storeName: businessName,
      storeAddress: storeAddress,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      urgentProducts: aiData.urgentProducts,
      weeklyProducts: aiData.weeklyProducts,
      recommendations: aiData.recommendations,
      totalAmount: totalAmount
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
    
    const productData = {
      name: req.body.name,
      category: req.body.category || null,
      subcategory: req.body.subcategory || null,
      barcode: req.body.barcode || null,
      currentQuantity: req.body.currentQuantity,
      unit: req.body.unit,
      alertThreshold: req.body.alertThreshold,
      supplier: req.body.supplier || null,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      userId: user.id
    }
    
    const product = await createProduct(productData)
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

    res.json({
      access_token: verified.session.access_token,
      refresh_token: verified.session.refresh_token,
      user: verified.user
    })
  } catch (error) {
    console.error('Erreur admin auth:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// Admin check middleware
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

// Admin: Get all users and stats (SECURED with admin check)
app.get('/api/admin/users', authenticateSupabaseUser, requireAdmin, async (req, res) => {
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
    console.error('Erreur admin users:', error)
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
  try {
    const { provider } = req.params
    const { code, state, error: oauthError } = req.query

    if (oauthError) {
      console.error('OAuth error:', oauthError)
      return res.redirect('/integrations?error=' + encodeURIComponent(oauthError))
    }

    if (!code || !state) {
      return res.redirect('/integrations?error=missing_params')
    }

    // Decode state
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (e) {
      return res.redirect('/integrations?error=invalid_state')
    }

    const { userId, connectionId } = stateData

    // Get adapter and exchange code for tokens
    const adapter = getAdapter(provider)
    const tokenData = await adapter.handleCallback(code, state)

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

    res.redirect('/integrations?success=true&provider=' + provider)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.redirect('/integrations?error=callback_failed')
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PONIA AI Backend' })
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
  console.log(`🚀 Backend PONIA AI démarré sur port ${PORT}`)
})
