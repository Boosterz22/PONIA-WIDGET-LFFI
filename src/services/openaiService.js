// Service OpenAI pour suggestions IA personnalisées
// Utilise Replit AI Integrations (pas besoin de clé API perso)
import OpenAI from 'openai'

export class OpenAIService {
  constructor() {
    // Intégration Replit OpenAI (variables d'env configurées automatiquement)
    this.client = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
    })
    
    // Tracking usage pour limite Standard (1/semaine)
    this.lastSuggestionDate = {}
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
      .filter(p => p.currentQuantity <= p.threshold * 1.5)
      .slice(0, 5) // Max 5 produits pour rester concis
      .map(p => `- ${p.name}: ${p.currentQuantity}${p.unit} (seuil: ${p.threshold}${p.unit})`)
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

// Export instance singleton
export const openaiService = new OpenAIService()
