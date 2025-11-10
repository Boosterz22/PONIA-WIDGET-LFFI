import express from 'express'
import OpenAI from 'openai'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { eq, and } from 'drizzle-orm'
import { db } from './db.js'
import { users, stores } from '../shared/schema.js'
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
  getMainStore
} from './storage.js'

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
})

const app = express()
const PORT = 3000

// Supabase client for JWT verification
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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

// Trial enforcement middleware - block expired trials from premium endpoints
async function enforceTrialStatus(req, res, next) {
  try {
    const user = await getUserBySupabaseId(req.supabaseUserId)
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    if (user.plan !== 'basique' || !user.trialEndsAt) {
      return next()
    }

    const trialEnd = new Date(user.trialEndsAt)
    const now = new Date()

    if (trialEnd <= now) {
      return res.status(403).json({ 
        error: 'Essai gratuit expiré',
        trialExpired: true,
        message: 'Passez à un plan payant pour continuer'
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
        plan: 'basique',
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
    // Use VERIFIED user ID from JWT
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
        content: `Tu es PONIA AI, l'expert en gestion de stock le plus sophistiqué pour commerçants français. Tu combines l'expertise d'un consultant supply-chain senior avec la simplicité d'un collègue de confiance.

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
1. **Analyse** : État actuel + diagnostic rapide
2. **Actions immédiates** : Quoi faire MAINTENANT (produit, quantité, timing)
3. **Projection** : Impact chiffré (économies, jours de couverture)
4. **Recommandations process** : Amélioration continue

RÈGLES STRICTES :
- Réponds en français naturel mais PRÉCIS (données exactes, calculs rigoureux)
- Toujours justifier avec des chiffres : "15kg de farine = 7 jours de couverture à ta conso moyenne"
- Pense comme un expert : considère DLC, coûts, cash-flow, pas juste les quantités
- Adapte au secteur : une boulangerie ≠ un bar ≠ un restaurant
- Sois proactif : suggère des améliorations même si on ne demande pas
- Utilise des emojis stratégiquement pour structurer (pas décorer)

EXEMPLES DE NIVEAU D'EXPERTISE :
❌ Basique : "Tu manques de farine, commande-en"
✅ Expert : "🔴 Farine T55 : 2kg restants = 1,5 jours de couverture. Risque rupture dimanche. Commande 25kg aujourd'hui (5 jours de prod + marge) via ton fournisseur habituel. Économie : -12% vs commande urgente."

❌ Vague : "Fais attention aux DLC"
✅ Expert : "⚠️ 3 produits expirent sous 48h (valeur 45€). Plan d'action : Beurre (1,2kg) → promo -30% aujourd'hui | Crème (0,8L) → intégrer menu du jour | Fromage (400g) → offre employés. Économie gaspillage : 35€."

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

// Endpoint génération bon de commande intelligent (SÉCURISÉ)
app.post('/api/generate-order', authenticateSupabaseUser, enforceTrialStatus, async (req, res) => {
  try {
    // Verify user ownership
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

    // Validation de base AVANT normalisation (évite crashes)
    for (const p of products) {
      if (!p || typeof p !== 'object') {
        return res.status(400).json({ error: 'Produits invalides (objets requis)' })
      }
      if (!p.name || typeof p.name !== 'string' || !p.unit || typeof p.unit !== 'string') {
        return res.status(400).json({ error: 'Produits invalides (name et unit string requis)' })
      }
    }

    // Normaliser les produits : convertir strings en nombres (PostgreSQL decimal → string)
    const normalizedProducts = products.map(p => ({
      ...p,
      currentQuantity: parseFloat(p.currentQuantity),
      alertThreshold: p.alertThreshold !== undefined ? parseFloat(p.alertThreshold) : undefined
    }))

    // Validation numérique après normalisation
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
      return res.json({ 
        content: null,
        message: 'Aucun produit à commander pour le moment !'
      })
    }

    const productsContext = orderProducts.map(p => {
      const threshold = Number.isFinite(p.alertThreshold) && p.alertThreshold > 0 ? p.alertThreshold : 10
      const dailyConsumption = threshold / 7
      const coverageDays = dailyConsumption > 0 ? (p.currentQuantity / dailyConsumption).toFixed(1) : '0.0'
      return `- ${p.name}: ${p.currentQuantity} ${p.unit} (seuil: ${threshold} ${p.unit}, couverture: ~${coverageDays}j, fournisseur: ${p.supplier || 'À définir'})`
    }).join('\n')

    const prompt = `Tu es un expert en gestion de stock pour ${businessType || 'commerce'}. 

MISSION : Génère un bon de commande professionnel pour "${businessName}".

PRODUITS À COMMANDER :
${productsContext}

INSTRUCTIONS CRITIQUES :
1. **Quantités suggérées** : Propose quantités pour atteindre 7-14 jours de couverture
   - Base-toi sur les seuils fournis (consommation hebdomadaire = seuil)
   - Produits critiques (<2j couverture) → 14 jours minimum
   - Produits faibles (3-7j) → 10 jours standard
   - IMPORTANT : Ne fabrique PAS de formules EOQ complexes, suggère des quantités RONDES et pratiques

2. **Priorisation** :
   - 🔴 URGENT (couverture <2j) : commande aujourd'hui
   - 🟠 CETTE SEMAINE (couverture 3-7j) : planifier sous 3-5j
   - Regroupe par fournisseur pour optimiser livraison

3. **Tarifs** :
   - Indique clairement : "Prix indicatifs marché français ${new Date().getFullYear()}"
   - Estime selon standards secteur ${businessType || 'commerce'}
   - Précise que ce sont des ESTIMATIONS, pas des prix contractuels

4. **Recommandations** :
   - 2-3 conseils actionnables (ajuster seuils, négocier volumes, diversifier fournisseurs)
   - Base-toi sur les données fournies, ne suppose rien

FORMAT REQUIS :
═══════════════════════════════════════════════════════
              BON DE COMMANDE - ${businessName.toUpperCase()}
═══════════════════════════════════════════════════════
Date : ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
Généré par : PONIA AI

───────────────────────────────────────────────────────
🔴 COMMANDES URGENTES (livraison <48h)
───────────────────────────────────────────────────────
[Si produits critiques : liste avec nom, quantité suggérée, prix unitaire indicatif, total]
[Sinon : "Aucune urgence détectée"]

───────────────────────────────────────────────────────
🟠 COMMANDES SEMAINE (livraison 3-5j)
───────────────────────────────────────────────────────
[Si produits faibles : liste avec nom, quantité suggérée, prix unitaire indicatif, total]
[Sinon : "Aucune commande planifiée"]

───────────────────────────────────────────────────────
📦 RÉCAPITULATIF PAR FOURNISSEUR
───────────────────────────────────────────────────────
[Fournisseur] : X produits → Total indicatif: XXX€

───────────────────────────────────────────────────────
💡 RECOMMANDATIONS
───────────────────────────────────────────────────────
1. [Recommandation actionnable 1]
2. [Recommandation actionnable 2]

═══════════════════════════════════════════════════════
TOTAL INDICATIF : XXX€ (prix marché ${new Date().getFullYear()}, à confirmer)
═══════════════════════════════════════════════════════`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const orderContent = completion.choices[0].message.content
    
    res.json({ 
      content: orderContent,
      productsCount: orderProducts.length,
      criticalCount: critical.length,
      lowCount: low.length
    })

  } catch (error) {
    console.error('Erreur génération bon de commande:', error.message)
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: 'Impossible de générer le bon de commande.'
    })
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
    // Use VERIFIED user ID from JWT
    const user = await getUserBySupabaseId(req.supabaseUserId)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const productData = {
      name: req.body.name,
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
        await addStockMovement(
          productId,
          quantityChange,
          parseFloat(updates.currentQuantity),
          quantityChange > 0 ? 'increase' : 'decrease',
          req.body.notes || null
        )
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

// Update user plan (TEST MODE - désactiver en production)
app.put('/api/users/plan', authenticateSupabaseUser, async (req, res) => {
  // POUR TESTS UNIQUEMENT : Décommenter la ligne suivante pour activer les tests de changement de plan
  // if (process.env.NODE_ENV === 'production' && process.env.ENABLE_TEST_MODE !== 'true') {
  //   return res.status(403).json({ 
  //     error: 'Plan changes only allowed via Stripe checkout in production',
  //     message: 'Utilisez la page /upgrade pour changer de plan'
  //   })
  // }

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
      if (process.env.REPLIT_DEV_DOMAIN) {
        return `https://${process.env.REPLIT_DEV_DOMAIN}`
      }
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
      u.trialEndsAt && new Date(u.trialEndsAt) > now && u.plan === 'basique'
    ).length

    const paidUsers = allUsers.filter(u => u.plan === 'standard' || u.plan === 'pro').length

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PONIA AI Backend' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend PONIA AI démarré sur port ${PORT}`)
})
