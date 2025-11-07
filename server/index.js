import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = 3000

// Middleware
app.use(express.json())

// Configuration OpenAI côté serveur (SÉCURISÉ - jamais exposé au frontend)
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
})

// Helper pour construire le contexte stock enrichi
function buildStockContext(products, insights = null) {
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
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, products, conversationHistory = [], insights = null } = req.body
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message utilisateur requis' })
    }
    
    const stockContext = buildStockContext(products || [], insights)
    
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
    console.error('Erreur chat IA:', error)
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PONIA AI Backend' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend PONIA AI démarré sur port ${PORT}`)
})
