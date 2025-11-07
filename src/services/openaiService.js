// Service OpenAI pour suggestions IA personnalisées
// Utilise Replit AI Integrations (pas besoin de clé API perso)
import OpenAI from 'openai'

export class OpenAIService {
  constructor() {
    // Client créé de manière lazy au premier appel
    this._client = null
    this._clientError = null
    
    // Tracking usage pour limite Standard (1/semaine)
    this.lastSuggestionDate = {}
  }
  
  _getClient() {
    if (this._clientError) {
      throw this._clientError
    }
    
    if (!this._client) {
      const baseURL = import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL
      const apiKey = import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY
      
      if (!baseURL || !apiKey) {
        this._clientError = new Error('Configuration OpenAI manquante. Vérifiez que Vite expose AI_INTEGRATIONS_OPENAI_* (envPrefix dans vite.config.js).')
        console.warn('⚠️', this._clientError.message)
        throw this._clientError
      }
      
      // Intégration Replit OpenAI (variables d'env configurées automatiquement)
      this._client = new OpenAI({
        baseURL,
        apiKey,
        dangerouslyAllowBrowser: true
      })
    }
    
    return this._client
  }
  
  get client() {
    return this._getClient()
  }
  
  // Génération suggestions intelligentes avec contexte
  async generateSmartSuggestions(products, businessType, insights, userPlan = 'standard') {
    try {
      // Vérification limite Standard (1 suggestion par semaine)
      if (userPlan === 'standard' && !this._canGenerateSuggestion()) {
        return this._getStandardLimitMessage()
      }
      
      const prompt = this._buildPrompt(products, businessType, insights)
      
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Modèle rapide et économique
        max_tokens: 500,
        temperature: 0.7,
        messages: [{
          role: 'system',
          content: `Tu es un expert en gestion de stock pour petits commerces en France. Tu donnes des conseils ULTRA-CONCRETS et ACTIONNABLES en français, style direct et professionnel.`
        }, {
          role: 'user',
          content: prompt
        }]
      })
      
      const suggestions = this._parseResponse(response.choices[0]?.message?.content || '')
      
      // Marquer usage pour utilisateurs Standard
      if (userPlan === 'standard') {
        this._markSuggestionGenerated()
      }
      
      return suggestions
      
    } catch (error) {
      console.error('Erreur OpenAI:', error)
      return this._getFallbackSuggestions(insights)
    }
  }
  
  _buildPrompt(products, businessType, insights) {
    // Produits critiques seulement (économise tokens)
    const criticalProducts = products
      .filter(p => {
        const threshold = p.alertThreshold || p.threshold || 10
        return p.currentQuantity <= threshold * 1.5
      })
      .slice(0, 5) // Max 5 produits pour rester concis
      .map(p => {
        const threshold = p.alertThreshold || p.threshold || 10
        return `- ${p.name}: ${p.currentQuantity}${p.unit} (seuil: ${threshold}${p.unit})`
      })
      .join('\n')
    
    const hasProducts = criticalProducts.length > 0
    
    return `Commerce: ${businessType}

${hasProducts ? `Produits nécessitant attention:\n${criticalProducts}` : 'Tous les produits sont au-dessus du seuil.'}

Analyse automatique:
- ${insights.stockoutRisks.length} produit(s) en risque rupture
- ${insights.overstockAlerts.length} produit(s) en sur-stock
- Score santé stock: ${insights.summary.healthScore}%

Génère 3 conseils ULTRA-CONCRETS en français:
1. Quelle commande prioritaire faire MAINTENANT (produit + quantité précise + timing)
2. Un conseil pour économiser de l'argent cette semaine
3. Une astuce métier spécifique à ce type de commerce

Format: Liste numérotée, max 2 lignes par conseil, style direct et professionnel.`
  }
  
  _parseResponse(text) {
    // Parse la réponse GPT en tableau de suggestions
    const lines = text.split('\n').filter(l => l.trim() && /^\d+\./.test(l.trim()))
    
    return lines.map((line, idx) => {
      const cleanLine = line.replace(/^\d+\.\s*/, '').trim()
      return {
        id: idx + 1,
        text: cleanLine,
        type: idx === 0 ? 'order' : idx === 1 ? 'cost' : 'tip',
        icon: idx === 0 ? '🎯' : idx === 1 ? '💰' : '💡'
      }
    }).slice(0, 3) // Max 3 suggestions
  }
  
  _getFallbackSuggestions(insights) {
    // Suggestions basiques si OpenAI échoue
    const suggestions = []
    
    if (insights.stockoutRisks.length > 0) {
      suggestions.push({
        id: 1,
        text: `Commandez en priorité les ${insights.stockoutRisks.length} produit(s) en alerte rouge/orange`,
        type: 'order',
        icon: '🎯'
      })
    } else {
      suggestions.push({
        id: 1,
        text: 'Votre stock est bien géré ! Maintenez vos seuils d\'alerte actuels.',
        type: 'order',
        icon: '🎯'
      })
    }
    
    suggestions.push({
      id: 2,
      text: 'Groupez vos commandes pour économiser sur les frais de livraison (15-20% d\'économies)',
      type: 'cost',
      icon: '💰'
    })
    
    suggestions.push({
      id: 3,
      text: 'Vérifiez vos stocks chaque lundi matin pour anticiper la semaine',
      type: 'tip',
      icon: '💡'
    })
    
    return suggestions
  }
  
  _getStandardLimitMessage() {
    const nextDate = this._getNextAvailableDate()
    return [{
      id: 1,
      text: `Vous avez utilisé votre conseil IA de la semaine. Prochaine suggestion disponible ${nextDate}.`,
      type: 'limit',
      icon: '🔒'
    }, {
      id: 2,
      text: 'Passez au plan Pro pour suggestions IA illimitées (€99/mois)',
      type: 'upgrade',
      icon: '⭐'
    }]
  }
  
  // Gestion limite 1/semaine pour Standard
  _canGenerateSuggestion() {
    const lastDate = localStorage.getItem('ponia_last_gpt_suggestion')
    if (!lastDate) return true
    
    const lastTime = new Date(lastDate).getTime()
    const now = new Date().getTime()
    const weekInMs = 7 * 24 * 60 * 60 * 1000
    
    return (now - lastTime) >= weekInMs
  }
  
  _markSuggestionGenerated() {
    localStorage.setItem('ponia_last_gpt_suggestion', new Date().toISOString())
  }
  
  _getNextAvailableDate() {
    const lastDate = localStorage.getItem('ponia_last_gpt_suggestion')
    if (!lastDate) return 'maintenant'
    
    const nextDate = new Date(new Date(lastDate).getTime() + 7 * 24 * 60 * 60 * 1000)
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    return `${days[nextDate.getDay()]} ${nextDate.getDate()}/${nextDate.getMonth() + 1}`
  }
}

// Fonction pour générer des suggestions IA pour produits en péremption
export async function getExpiryAISuggestions(product) {
  const { name, daysUntilExpiry, currentQuantity, unit, severity } = product
  
  try {
    const client = new OpenAI({
      baseURL: import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant IA pour commerçants français. Donne des conseils pratiques et courts pour gérer les produits en péremption. Format: 3 suggestions max, chacune avec un emoji et un texte court (max 40 caractères).`
        },
        {
          role: 'user',
          content: `Produit: ${name}
Périme dans: ${daysUntilExpiry} jour(s)
Stock actuel: ${currentQuantity} ${unit}
Gravité: ${severity}

Donne 3 actions concrètes pour éviter le gaspillage.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    const response = completion.choices[0].message.content
    
    // Parser la réponse pour extraire les suggestions
    const suggestions = []
    const lines = response.split('\n').filter(line => line.trim())
    
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim()
      // Extraire emoji et texte
      const emojiMatch = line.match(/^(\p{Emoji}+)\s*(.+)$/u)
      if (emojiMatch) {
        suggestions.push({
          icon: emojiMatch[1],
          text: emojiMatch[2].replace(/^[:\-]\s*/, '').substring(0, 50),
          action: 'ai_suggestion'
        })
      } else if (line.length > 0) {
        suggestions.push({
          icon: '💡',
          text: line.substring(0, 50),
          action: 'ai_suggestion'
        })
      }
    }
    
    return suggestions
  } catch (error) {
    console.error('Erreur lors de la génération de suggestions IA:', error)
    return []
  }
}

// Fonction pour parser les commandes vocales avec IA quand le parsing local échoue
export async function parseVoiceCommandWithAI(transcript) {
  try {
    const client = new OpenAI({
      baseURL: import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un parser de commandes vocales pour gestion de stock. L'utilisateur peut dire des choses comme "plus 5", "moins 10", "ajouter 2.5", "retirer 3".
Réponds UNIQUEMENT avec un JSON au format: {"action": "add" ou "subtract", "quantity": nombre}.
Si tu ne comprends pas, réponds: {"action": null, "quantity": 0}`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      temperature: 0.3,
      max_tokens: 50
    })

    const response = completion.choices[0].message.content.trim()
    
    // Extraire le JSON de la réponse
    const jsonMatch = response.match(/\{[^}]+\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        action: parsed.action,
        quantity: parseFloat(parsed.quantity) || 0,
        isValid: parsed.action !== null && !isNaN(parsed.quantity) && parsed.quantity > 0
      }
    }
    
    return { action: null, quantity: 0, isValid: false }
  } catch (error) {
    console.error('Erreur lors du parsing IA de la commande vocale:', error)
    return { action: null, quantity: 0, isValid: false }
  }
}

// Fonction pour chat conversationnel intelligent avec contexte stock complet
export async function getChatResponse(userMessage, products, conversationHistory = [], insights = null) {
  try {
    const client = new OpenAI({
      baseURL: import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
    
    const stockContext = buildStockContext(products, insights)
    
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
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.4,
      max_tokens: 500
    })

    return completion.choices[0].message.content

  } catch (error) {
    console.error('Erreur chat IA:', error)
    return "Désolé, j'ai un souci technique 😅 Réessaie dans quelques secondes !"
  }
}

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
  
  // Ajouter analyse globale si disponible
  if (insights) {
    context += `📊 ANALYSE GLOBALE :\n`
    context += `  - Score santé stock : ${insights.summary?.healthScore || 'N/A'}%\n`
    context += `  - Produits en risque rupture : ${insights.stockoutRisks?.length || 0}\n`
    context += `  - Produits en sur-stock : ${insights.overstockAlerts?.length || 0}\n`
    if (insights.recommendations?.length > 0) {
      context += `  - Recommandations prioritaires : ${insights.recommendations.length}\n`
    }
    context += '\n'
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
  
  // Ajouter produits avec DLC proche si disponible
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

// Export instance singleton
export const openaiService = new OpenAIService()
