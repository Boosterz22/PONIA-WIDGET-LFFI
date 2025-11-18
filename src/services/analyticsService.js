/**
 * Service d'analytics avancé pour PONIA
 * Analyse l'historique réel des ventes pour fournir des prédictions précises
 */

export class AnalyticsService {
  
  /**
   * Calcule les statistiques de ventes pour un produit
   * @param {Array} salesHistory - Historique des ventes (de getSalesForProduct)
   * @returns {Object} Statistiques détaillées
   */
  static calculateSalesStats(salesHistory) {
    if (!salesHistory || salesHistory.length === 0) {
      return {
        totalSales: 0,
        averageDaily: 0,
        averageWeekly: 0,
        byDayOfWeek: {},
        trend: 'insufficient_data',
        hasData: false
      }
    }

    // 🔧 FIX: Agréger les ventes par jour d'abord (un seul total par jour)
    const dailyAggregates = {}
    salesHistory.forEach(sale => {
      const date = new Date(sale.saleDate).toISOString().split('T')[0]
      if (!dailyAggregates[date]) {
        dailyAggregates[date] = {
          date,
          total: 0,
          dayOfWeek: sale.dayOfWeek
        }
      }
      dailyAggregates[date].total += parseFloat(sale.quantitySold)
    })

    const dailySales = Object.values(dailyAggregates).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )

    if (dailySales.length === 0) {
      return {
        totalSales: 0,
        averageDaily: 0,
        averageWeekly: 0,
        byDayOfWeek: {},
        trend: 'insufficient_data',
        hasData: false
      }
    }

    // Total des ventes
    const totalSales = dailySales.reduce((sum, day) => sum + day.total, 0)

    // Nombre de jours dans l'historique
    const oldestDate = new Date(dailySales[dailySales.length - 1].date)
    const newestDate = new Date(dailySales[0].date)
    const daysInHistory = Math.max(1, Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)) + 1)

    // Moyennes
    const averageDaily = totalSales / dailySales.length // Moyenne des jours avec ventes
    const averageWeekly = averageDaily * 7

    // Ventes par jour de la semaine (0=Dimanche, 6=Samedi)
    const byDayOfWeek = {}
    for (let i = 0; i < 7; i++) {
      byDayOfWeek[i] = { total: 0, count: 0, average: 0 }
    }

    dailySales.forEach(day => {
      const dow = day.dayOfWeek
      byDayOfWeek[dow].total += day.total
      byDayOfWeek[dow].count += 1
    })

    // Calculer les moyennes par jour de semaine
    for (let i = 0; i < 7; i++) {
      byDayOfWeek[i].average = byDayOfWeek[i].count > 0 
        ? byDayOfWeek[i].total / byDayOfWeek[i].count 
        : 0
    }

    // Détection de tendance (comparaison première moitié vs deuxième moitié des jours)
    const trend = this.detectTrend(dailySales)

    return {
      totalSales,
      averageDaily,
      averageWeekly,
      byDayOfWeek,
      trend,
      daysInHistory: dailySales.length,
      hasData: true
    }
  }

  /**
   * Détecte la tendance de croissance/décroissance
   * @param {Array} dailySales - Ventes agrégées par jour triées par date (plus récent d'abord)
   * @returns {Object} Informations sur la tendance
   */
  static detectTrend(dailySales) {
    if (dailySales.length < 7) {
      return { direction: 'insufficient_data', percentage: 0 }
    }

    const midPoint = Math.floor(dailySales.length / 2)
    const recentHalf = dailySales.slice(0, midPoint)
    const olderHalf = dailySales.slice(midPoint)

    const recentAvg = recentHalf.reduce((sum, day) => sum + day.total, 0) / recentHalf.length
    const olderAvg = olderHalf.reduce((sum, day) => sum + day.total, 0) / olderHalf.length

    if (olderAvg === 0) {
      return { direction: 'stable', percentage: 0, recentAvg, olderAvg }
    }

    const percentageChange = ((recentAvg - olderAvg) / olderAvg) * 100

    let direction = 'stable'
    if (percentageChange > 10) {
      direction = 'growing'
    } else if (percentageChange < -10) {
      direction = 'declining'
    }

    return {
      direction,
      percentage: Math.round(percentageChange),
      recentAvg: Math.round(recentAvg * 10) / 10,
      olderAvg: Math.round(olderAvg * 10) / 10
    }
  }

  /**
   * Prédit les ventes futures pour un produit
   * @param {Array} salesHistory - Historique des ventes
   * @param {Object} stats - Statistiques calculées
   * @param {number} daysAhead - Nombre de jours à prédire
   * @returns {Array} Prédictions jour par jour
   */
  static predictFutureSales(salesHistory, stats, daysAhead = 7) {
    if (!stats.hasData) {
      return []
    }

    const predictions = []
    const today = new Date()

    for (let i = 1; i <= daysAhead; i++) {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + i)
      const dayOfWeek = targetDate.getDay()

      // Prédiction basée sur la moyenne du jour de la semaine
      let predictedQuantity = stats.byDayOfWeek[dayOfWeek].average

      // Ajustement selon la tendance
      if (stats.trend.direction === 'growing') {
        predictedQuantity *= (1 + (stats.trend.percentage / 100) / 30) // Ajustement progressif
      } else if (stats.trend.direction === 'declining') {
        predictedQuantity *= (1 + (stats.trend.percentage / 100) / 30)
      }

      predictions.push({
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek,
        dayName: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][dayOfWeek],
        predictedQuantity: Math.round(predictedQuantity * 10) / 10,
        confidence: this.calculateConfidence(stats, dayOfWeek)
      })
    }

    return predictions
  }

  /**
   * Calcule le niveau de confiance d'une prédiction
   * @param {Object} stats - Statistiques
   * @param {number} dayOfWeek - Jour de la semaine
   * @returns {string} Niveau de confiance
   */
  static calculateConfidence(stats, dayOfWeek) {
    const dayData = stats.byDayOfWeek[dayOfWeek]
    
    // Confiance basée sur le nombre d'échantillons et la variance
    if (dayData.count === 0) return 'very_low'
    if (dayData.count < 2) return 'low'
    if (dayData.count < 4) return 'medium'
    return 'high'
  }

  /**
   * Calcule quand un produit va être en rupture
   * @param {number} currentQuantity - Stock actuel
   * @param {Object} stats - Statistiques de ventes
   * @returns {Object} Informations sur la rupture prévue
   */
  static predictStockout(currentQuantity, stats) {
    if (!stats.hasData || stats.averageDaily === 0) {
      return {
        daysUntilStockout: 999,
        predictedDate: null,
        severity: 'low'
      }
    }

    const daysUntilStockout = currentQuantity / stats.averageDaily

    let severity = 'low'
    if (daysUntilStockout < 1) {
      severity = 'critical'
    } else if (daysUntilStockout < 3) {
      severity = 'high'
    } else if (daysUntilStockout < 7) {
      severity = 'medium'
    }

    const predictedDate = new Date()
    predictedDate.setDate(predictedDate.getDate() + Math.floor(daysUntilStockout))

    return {
      daysUntilStockout: Math.ceil(daysUntilStockout),
      predictedDate: predictedDate.toISOString().split('T')[0],
      severity,
      averageDaily: Math.round(stats.averageDaily * 10) / 10
    }
  }

  /**
   * Suggère une quantité optimale à commander
   * @param {Object} stats - Statistiques de ventes
   * @param {number} daysOfStock - Nombre de jours de stock souhaité (défaut: 14)
   * @param {number} currentQuantity - Stock actuel
   * @returns {Object} Suggestion de commande
   */
  static suggestOrderQuantity(stats, daysOfStock = 14, currentQuantity = 0) {
    if (!stats.hasData) {
      return {
        suggestedQuantity: 0,
        reasoning: 'Pas assez de données historiques',
        daysOfStock: 0
      }
    }

    // Quantité nécessaire pour X jours
    const neededForPeriod = stats.averageDaily * daysOfStock

    // Buffer de sécurité (20% supplémentaire)
    const withBuffer = neededForPeriod * 1.2

    // Moins le stock actuel
    const orderQuantity = Math.max(0, withBuffer - currentQuantity)

    return {
      suggestedQuantity: Math.ceil(orderQuantity),
      reasoning: `Basé sur une consommation moyenne de ${stats.averageDaily.toFixed(1)} unités/jour`,
      daysOfStock: Math.ceil(neededForPeriod / stats.averageDaily),
      averageDaily: Math.round(stats.averageDaily * 10) / 10
    }
  }

  /**
   * Analyse l'impact météo sur les ventes (à appeler avec les données météo)
   * @param {Array} salesHistory - Historique des ventes
   * @param {Object} weatherData - Données météo actuelles
   * @returns {Object} Ajustement basé sur la météo
   */
  static analyzeWeatherImpact(salesHistory, weatherData) {
    // Pour l'instant, on retourne un facteur d'ajustement basique
    // Dans une version plus avancée, on pourrait corréler les ventes passées avec la météo
    
    let adjustmentFactor = 1.0
    let reason = 'Conditions normales'

    if (!weatherData) {
      return { adjustmentFactor, reason }
    }

    // Forte chaleur (>30°C) → +15% sur boissons fraîches et produits frais
    if (weatherData.temp > 30) {
      adjustmentFactor = 1.15
      reason = 'Forte chaleur prévue (+15% de ventes estimées)'
    }
    // Froid (<5°C) → +10% sur produits réconfortants
    else if (weatherData.temp < 5) {
      adjustmentFactor = 1.10
      reason = 'Températures froides (+10% de ventes estimées)'
    }
    // Pluie → -5% de ventes générales
    else if (weatherData.condition && weatherData.condition.includes('rain')) {
      adjustmentFactor = 0.95
      reason = 'Pluie prévue (-5% de ventes estimées)'
    }

    return { adjustmentFactor, reason }
  }

  /**
   * Génère un résumé analytique pour un produit
   * @param {Object} product - Produit
   * @param {Array} salesHistory - Historique des ventes
   * @param {Object} weatherData - Données météo (optionnel)
   * @returns {Object} Résumé analytique complet
   */
  static generateProductAnalytics(product, salesHistory, weatherData = null) {
    const stats = this.calculateSalesStats(salesHistory)
    const stockoutPrediction = this.predictStockout(parseFloat(product.currentQuantity), stats)
    const orderSuggestion = this.suggestOrderQuantity(stats, 14, parseFloat(product.currentQuantity))
    const futurePredictions = this.predictFutureSales(salesHistory, stats, 7)
    const weatherImpact = this.analyzeWeatherImpact(salesHistory, weatherData)

    return {
      product: {
        id: product.id,
        name: product.name,
        currentQuantity: parseFloat(product.currentQuantity),
        unit: product.unit
      },
      stats,
      stockoutPrediction,
      orderSuggestion,
      futurePredictions,
      weatherImpact,
      generatedAt: new Date().toISOString()
    }
  }
}

export default AnalyticsService
