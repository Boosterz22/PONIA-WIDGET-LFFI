// Service pour gérer les alertes de péremption (DLC/DLUO)

export function checkExpiryAlerts(products) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiryAlerts = []
  
  products.forEach(product => {
    if (!product.expiryDate) return
    
    const expiryDate = new Date(product.expiryDate)
    expiryDate.setHours(0, 0, 0, 0)
    
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24))
    
    let severity = null
    let message = ''
    
    if (daysUntilExpiry < 0) {
      severity = 'expired'
      message = `Périmé depuis ${Math.abs(daysUntilExpiry)} jour(s)`
    } else if (daysUntilExpiry === 0) {
      severity = 'critical'
      message = 'Périme aujourd\'hui !'
    } else if (daysUntilExpiry <= 2) {
      severity = 'critical'
      message = `Périme dans ${daysUntilExpiry} jour(s)`
    } else if (daysUntilExpiry <= 5) {
      severity = 'warning'
      message = `Périme dans ${daysUntilExpiry} jours`
    } else if (daysUntilExpiry <= 10) {
      severity = 'info'
      message = `Périme dans ${daysUntilExpiry} jours`
    }
    
    if (severity) {
      expiryAlerts.push({
        ...product,
        daysUntilExpiry,
        severity,
        message
      })
    }
  })
  
  // Trier par urgence (périmés d'abord, puis critiques, puis warnings)
  expiryAlerts.sort((a, b) => {
    const severityOrder = { expired: 0, critical: 1, warning: 2, info: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
  
  return expiryAlerts
}

export function getExpirySuggestions(product) {
  const { daysUntilExpiry, currentQuantity, unit, name } = product
  
  const suggestions = []
  
  if (daysUntilExpiry <= 0) {
    suggestions.push({
      icon: '🗑️',
      text: 'Retirer immédiatement du stock',
      action: 'remove'
    })
  } else if (daysUntilExpiry <= 2) {
    suggestions.push({
      icon: '💰',
      text: 'Promo -30% à -50% aujourd\'hui',
      action: 'promo'
    })
    suggestions.push({
      icon: '👨‍🍳',
      text: 'Utiliser dans recette du jour',
      action: 'use_today'
    })
    suggestions.push({
      icon: '📦',
      text: 'Vendre en lot groupé',
      action: 'bundle'
    })
  } else if (daysUntilExpiry <= 5) {
    suggestions.push({
      icon: '💡',
      text: 'Mettre en avant vitrine',
      action: 'highlight'
    })
    suggestions.push({
      icon: '💰',
      text: 'Promo -20%',
      action: 'promo'
    })
  }
  
  return suggestions
}

export function calculateWasteStats(products) {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  let expiredQuantity = 0
  let savedQuantity = 0
  
  products.forEach(product => {
    if (!product.expiryDate) return
    
    const expiryDate = new Date(product.expiryDate)
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0 && expiryDate >= startOfMonth) {
      expiredQuantity += product.currentQuantity
    }
    
    // Produits sauvés = ceux qui avaient une alerte mais ont été utilisés à temps
    if (daysUntilExpiry > 0 && daysUntilExpiry <= 5 && product.currentQuantity < product.alertThreshold) {
      savedQuantity += product.alertThreshold - product.currentQuantity
    }
  })
  
  return {
    expiredQuantity: expiredQuantity.toFixed(1),
    savedQuantity: savedQuantity.toFixed(1)
  }
}
