// Moteur de règles IA pour prédictions de stock
// Basé sur calculs mathématiques simples mais précis
// AMÉLIORÉ : Utilise l'historique réel de ventes quand disponible

export class InventoryRulesEngine {
  
  // 1️⃣ PRÉDICTION RUPTURE (jours restants)
  // Nouveau paramètre optionnel : salesStats (calculé via AnalyticsService)
  predictStockout(product, salesStats = null) {
    let dailyConsumption
    let source = 'estimation' // Pour savoir si on utilise des données réelles ou estimées
    
    // PRIORITÉ : Utiliser les données réelles si disponibles
    if (salesStats && salesStats.hasData && salesStats.averageDaily > 0) {
      dailyConsumption = salesStats.averageDaily
      source = 'real_history'
    } else {
      // FALLBACK : Consommation moyenne estimée = 40% du seuil par semaine (règle empirique)
      const threshold = product.alertThreshold || product.threshold || 10
      const weeklyConsumption = threshold * 0.4
      dailyConsumption = weeklyConsumption / 7
    }
    
    // Protection division par zéro
    if (dailyConsumption === 0) {
      return {
        daysRemaining: 999,
        severity: 'low',
        action: { type: 'monitor', urgency: 'low' },
        message: `🟢 ${product.name} : Pas de consommation ${source === 'real_history' ? 'détectée' : 'estimée'}.`,
        source,
        confidence: source === 'real_history' ? 'high' : 'low'
      }
    }
    
    const daysUntilStockout = product.currentQuantity / dailyConsumption
    
    return {
      daysRemaining: Math.ceil(daysUntilStockout),
      severity: this._getSeverity(daysUntilStockout),
      action: this._getAction(daysUntilStockout, product, dailyConsumption),
      message: this._getStockoutMessage(daysUntilStockout, product, source),
      dailyConsumption: Math.round(dailyConsumption * 10) / 10,
      source,
      confidence: source === 'real_history' ? (salesStats.daysInHistory >= 7 ? 'high' : 'medium') : 'low'
    }
  }
  
  // 2️⃣ DÉTECTION SUR-STOCK
  detectOverstock(product, salesStats = null) {
    let weeklyConsumption
    let source = 'estimation'
    
    if (salesStats && salesStats.hasData && salesStats.averageWeekly > 0) {
      weeklyConsumption = salesStats.averageWeekly
      source = 'real_history'
    } else {
      const threshold = product.alertThreshold || product.threshold || 10
      weeklyConsumption = threshold * 0.4
    }
    
    if (weeklyConsumption === 0) return null
    
    const weeksOfStock = product.currentQuantity / weeklyConsumption
    
    // Sur-stock si > 4 semaines
    if (weeksOfStock > 4) {
      return {
        type: 'overstock',
        weeksOfStock: weeksOfStock.toFixed(1),
        severity: weeksOfStock > 8 ? 'high' : 'medium',
        message: `🟡 Sur-stock ${product.name} : ${weeksOfStock.toFixed(1)} semaines. Réduisez votre prochaine commande de 50%.`,
        recommendation: {
          action: 'reduce_order',
          percentage: 50
        },
        source,
        weeklyConsumption: weeklyConsumption.toFixed(1)
      }
    }
    return null
  }
  
  // 3️⃣ SUGGESTION QUANTITÉ COMMANDE OPTIMALE
  suggestOrderQuantity(product, salesStats = null) {
    let weeklyConsumption
    let source = 'estimation'
    
    if (salesStats && salesStats.hasData && salesStats.averageWeekly > 0) {
      weeklyConsumption = salesStats.averageWeekly
      source = 'real_history'
    } else {
      // Formule : Commande pour 2 semaines + buffer sécurité 20%
      const threshold = product.alertThreshold || product.threshold || 10
      weeklyConsumption = threshold * 0.4
    }
    
    const optimalOrder = weeklyConsumption * 2 * 1.2
    
    return {
      quantity: Math.ceil(optimalOrder),
      unit: product.unit,
      reasoning: `Basé sur consommation ${source === 'real_history' ? 'réelle' : 'estimée'} ${weeklyConsumption.toFixed(1)}${product.unit}/semaine`,
      timing: this._getOptimalOrderTiming(product, salesStats),
      weeklyConsumption: weeklyConsumption.toFixed(1),
      source,
      confidence: source === 'real_history' ? 'high' : 'low'
    }
  }
  
  // 4️⃣ DÉTECTION GASPILLAGE
  detectWaste(products) {
    const wasteAlerts = []
    
    products.forEach(product => {
      const threshold = product.alertThreshold || product.threshold || 10
      // Si stock > 5x le seuil = risque péremption/gaspillage
      if (product.currentQuantity > threshold * 5) {
        const excessRatio = (product.currentQuantity / threshold).toFixed(1)
        wasteAlerts.push({
          product: product.name,
          severity: product.currentQuantity > threshold * 8 ? 'high' : 'medium',
          excessRatio: excessRatio,
          message: `🔴 Risque gaspillage ${product.name} : ${product.currentQuantity}${product.unit} (${excessRatio}x le seuil). Utilisez rapidement.`
        })
      }
    })
    
    return wasteAlerts
  }
  
  // HELPERS PRIVÉS
  
  _getSeverity(days) {
    if (days <= 2) return 'critical'
    if (days <= 5) return 'high'
    if (days <= 10) return 'medium'
    return 'low'
  }
  
  _getStockoutMessage(days, product, source = 'estimation') {
    const daysRounded = Math.ceil(days)
    const sourceLabel = source === 'real_history' ? ' (basé sur historique réel)' : ''
    
    if (days <= 2) {
      return `🔴 URGENT : Rupture ${product.name} dans ${daysRounded} jour${daysRounded > 1 ? 's' : ''} ! Commandez MAINTENANT${sourceLabel}.`
    }
    if (days <= 5) {
      return `🟠 ATTENTION : Rupture ${product.name} prévue dans ${daysRounded} jours. Commandez cette semaine${sourceLabel}.`
    }
    if (days <= 10) {
      return `🟡 ${product.name} : Stock suffisant pour ${daysRounded} jours. Prévoyez commande prochaine semaine${sourceLabel}.`
    }
    return `🟢 ${product.name} : Stock OK (${daysRounded} jours)${sourceLabel}.`
  }
  
  _getAction(days, product, dailyConsumption = null) {
    let optimalQuantity
    
    if (dailyConsumption) {
      // Utiliser la consommation réelle pour calculer la quantité optimale
      optimalQuantity = Math.ceil(dailyConsumption * 14 * 1.2) // 14 jours + 20%
    } else {
      const threshold = product.alertThreshold || product.threshold || 10
      optimalQuantity = Math.ceil(threshold * 2 * 1.2) // 2 semaines + 20%
    }
    
    if (days <= 2) return {
      type: 'order_now',
      quantity: optimalQuantity,
      unit: product.unit,
      urgency: 'immediate'
    }
    if (days <= 5) return {
      type: 'order_this_week',
      quantity: optimalQuantity,
      unit: product.unit,
      urgency: 'high'
    }
    if (days <= 10) return {
      type: 'plan_order',
      quantity: optimalQuantity,
      unit: product.unit,
      urgency: 'medium'
    }
    return {
      type: 'monitor',
      urgency: 'low'
    }
  }
  
  _getOptimalOrderTiming(product, salesStats = null) {
    const prediction = this.predictStockout(product, salesStats)
    const daysRemaining = prediction.daysRemaining
    
    if (daysRemaining <= 3) return 'Aujourd\'hui'
    if (daysRemaining <= 7) return 'Cette semaine'
    if (daysRemaining <= 14) return 'Semaine prochaine'
    return 'Dans 2 semaines'
  }
}

// 🎯 NOUVELLE MÉTHODE : Analyse complète d'un produit avec historique réel
InventoryRulesEngine.prototype.analyzeProductWithHistory = function(product, salesStats) {
  return {
    stockout: this.predictStockout(product, salesStats),
    overstock: this.detectOverstock(product, salesStats),
    orderSuggestion: this.suggestOrderQuantity(product, salesStats),
    usesRealData: salesStats && salesStats.hasData,
    confidence: salesStats && salesStats.hasData ? 
      (salesStats.daysInHistory >= 7 ? 'high' : 'medium') : 'low'
  }
}


// Export instance singleton
export const rulesEngine = new InventoryRulesEngine()
