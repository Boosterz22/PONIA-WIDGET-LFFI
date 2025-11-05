// Service IA principal - Orchestration des analyses d'inventaire
import { rulesEngine } from './rulesEngine'

export class AIService {
  
  // Analyse complète de l'inventaire
  analyzeInventory(products, businessType = 'commerce') {
    const insights = {
      stockoutRisks: [],
      overstockAlerts: [],
      orderSuggestions: [],
      wasteAlerts: [],
      summary: {}
    }
    
    // Protection : si pas de produits
    if (!products || products.length === 0) {
      insights.summary = {
        status: 'empty',
        message: '📦 Ajoutez des produits pour voir l\'analyse IA',
        healthScore: 0,
        actionRequired: 0,
        totalProducts: 0
      }
      return insights
    }
    
    // 1. Analyse chaque produit
    products.forEach(product => {
      // Prédiction rupture
      const stockoutPrediction = rulesEngine.predictStockout(product)
      if (stockoutPrediction.severity !== 'low') {
        insights.stockoutRisks.push({
          product: product.name,
          productId: product.id,
          ...stockoutPrediction
        })
      }
      
      // Détection sur-stock
      const overstockAlert = rulesEngine.detectOverstock(product)
      if (overstockAlert) {
        insights.overstockAlerts.push({
          ...overstockAlert,
          productId: product.id
        })
      }
      
      // Suggestion commande (pour produits nécessitant attention)
      if (stockoutPrediction.daysRemaining <= 7) {
        const orderSuggestion = rulesEngine.suggestOrderQuantity(product)
        insights.orderSuggestions.push({
          product: product.name,
          productId: product.id,
          priority: stockoutPrediction.severity,
          ...orderSuggestion
        })
      }
    })
    
    // 2. Détection gaspillage global
    insights.wasteAlerts = rulesEngine.detectWaste(products)
    
    // 3. Génération résumé et score santé
    insights.summary = this._generateSummary(insights, products)
    
    return insights
  }
  
  // Résumé intelligent avec score de santé
  _generateSummary(insights, products) {
    const criticalCount = insights.stockoutRisks.filter(r => r.severity === 'critical').length
    const highCount = insights.stockoutRisks.filter(r => r.severity === 'high').length
    const totalProducts = products.length
    const healthyProducts = totalProducts - insights.stockoutRisks.length - insights.overstockAlerts.length
    
    let status = 'good'
    let message = '🟢 Votre stock est bien géré !'
    
    if (criticalCount > 0) {
      status = 'critical'
      message = `🔴 ${criticalCount} produit${criticalCount > 1 ? 's' : ''} en rupture imminente !`
    } else if (highCount > 0) {
      status = 'warning'
      message = `🟠 ${highCount} produit${highCount > 1 ? 's' : ''} nécessite${highCount > 1 ? 'nt' : ''} attention`
    } else if (insights.stockoutRisks.length > 0) {
      status = 'warning'
      message = `🟡 ${insights.stockoutRisks.length} produit${insights.stockoutRisks.length > 1 ? 's' : ''} à surveiller`
    }
    
    return {
      status,
      message,
      healthScore: Math.max(0, Math.round((healthyProducts / totalProducts) * 100)),
      actionRequired: criticalCount + highCount,
      totalProducts,
      criticalCount,
      highCount
    }
  }
  
  // Top 3 actions prioritaires pour affichage
  getTopActions(insights) {
    const actions = []
    
    // 1. Ruptures critiques en priorité absolue
    insights.stockoutRisks
      .filter(r => r.severity === 'critical')
      .slice(0, 3)
      .forEach(risk => {
        actions.push({
          priority: 1,
          icon: '🔴',
          title: `Commander ${risk.product}`,
          description: risk.message,
          action: risk.action,
          productId: risk.productId
        })
      })
    
    // 2. Commandes cette semaine (high priority)
    if (actions.length < 3) {
      insights.stockoutRisks
        .filter(r => r.severity === 'high')
        .slice(0, 3 - actions.length)
        .forEach(risk => {
          actions.push({
            priority: 2,
            icon: '🟠',
            title: `Prévoir ${risk.product}`,
            description: risk.message,
            action: risk.action,
            productId: risk.productId
          })
        })
    }
    
    // 3. Alertes gaspillage
    if (actions.length < 3 && insights.wasteAlerts.length > 0) {
      insights.wasteAlerts.slice(0, 3 - actions.length).forEach(waste => {
        actions.push({
          priority: 3,
          icon: '🟡',
          title: 'Réduire gaspillage',
          description: waste.message,
          productId: waste.productId
        })
      })
    }
    
    // 4. Si toujours moins de 3 actions, ajouter suggestions positives
    if (actions.length < 3 && insights.stockoutRisks.length === 0) {
      const overstockCount = insights.overstockAlerts.length
      if (overstockCount > 0) {
        actions.push({
          priority: 3,
          icon: '💡',
          title: 'Optimiser stock',
          description: `Vous avez ${overstockCount} produit${overstockCount > 1 ? 's' : ''} en sur-stock. Réduisez vos prochaines commandes.`
        })
      } else {
        actions.push({
          priority: 4,
          icon: '🎉',
          title: 'Parfait !',
          description: 'Votre gestion de stock est optimale. Continuez comme ça !'
        })
      }
    }
    
    return actions.slice(0, 3)
  }
  
  // Statistiques pour affichage
  getStats(insights) {
    return {
      stockoutRisks: insights.stockoutRisks.length,
      orderSuggestions: insights.orderSuggestions.length,
      wasteAlerts: insights.wasteAlerts.length,
      overstockAlerts: insights.overstockAlerts.length
    }
  }
}

// Export instance singleton
export const aiService = new AIService()
