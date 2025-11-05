// Moteur de règles IA pour prédictions de stock
// Basé sur calculs mathématiques simples mais précis

export class InventoryRulesEngine {
  
  // 1️⃣ PRÉDICTION RUPTURE (jours restants)
  predictStockout(product) {
    // Consommation moyenne estimée = 40% du seuil par semaine (règle empirique)
    const threshold = product.alertThreshold || product.threshold || 10
    const weeklyConsumption = threshold * 0.4
    const dailyConsumption = weeklyConsumption / 7
    
    // Protection division par zéro
    if (dailyConsumption === 0) {
      return {
        daysRemaining: 999,
        severity: 'low',
        action: { type: 'monitor', urgency: 'low' },
        message: `🟢 ${product.name} : Pas de consommation estimée.`
      }
    }
    
    const daysUntilStockout = product.currentQuantity / dailyConsumption
    
    return {
      daysRemaining: Math.ceil(daysUntilStockout),
      severity: this._getSeverity(daysUntilStockout),
      action: this._getAction(daysUntilStockout, product),
      message: this._getStockoutMessage(daysUntilStockout, product)
    }
  }
  
  // 2️⃣ DÉTECTION SUR-STOCK
  detectOverstock(product) {
    const threshold = product.alertThreshold || product.threshold || 10
    const weeklyConsumption = threshold * 0.4
    
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
        }
      }
    }
    return null
  }
  
  // 3️⃣ SUGGESTION QUANTITÉ COMMANDE OPTIMALE
  suggestOrderQuantity(product) {
    // Formule : Commande pour 2 semaines + buffer sécurité 20%
    const threshold = product.alertThreshold || product.threshold || 10
    const weeklyConsumption = threshold * 0.4
    const optimalOrder = weeklyConsumption * 2 * 1.2
    
    return {
      quantity: Math.ceil(optimalOrder),
      unit: product.unit,
      reasoning: `Basé sur consommation estimée ${weeklyConsumption.toFixed(1)}${product.unit}/semaine`,
      timing: this._getOptimalOrderTiming(product),
      weeklyConsumption: weeklyConsumption.toFixed(1)
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
  
  _getStockoutMessage(days, product) {
    const daysRounded = Math.ceil(days)
    
    if (days <= 2) {
      return `🔴 URGENT : Rupture ${product.name} dans ${daysRounded} jour${daysRounded > 1 ? 's' : ''} ! Commandez MAINTENANT.`
    }
    if (days <= 5) {
      return `🟠 ATTENTION : Rupture ${product.name} prévue dans ${daysRounded} jours. Commandez cette semaine.`
    }
    if (days <= 10) {
      return `🟡 ${product.name} : Stock suffisant pour ${daysRounded} jours. Prévoyez commande prochaine semaine.`
    }
    return `🟢 ${product.name} : Stock OK (${daysRounded} jours).`
  }
  
  _getAction(days, product) {
    const threshold = product.alertThreshold || product.threshold || 10
    const optimalQuantity = Math.ceil(threshold * 2 * 1.2) // 2 semaines + 20%
    
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
  
  _getOptimalOrderTiming(product) {
    const prediction = this.predictStockout(product)
    const daysRemaining = prediction.daysRemaining
    
    if (daysRemaining <= 3) return 'Aujourd\'hui'
    if (daysRemaining <= 7) return 'Cette semaine'
    if (daysRemaining <= 14) return 'Semaine prochaine'
    return 'Dans 2 semaines'
  }
}

// Export instance singleton
export const rulesEngine = new InventoryRulesEngine()
