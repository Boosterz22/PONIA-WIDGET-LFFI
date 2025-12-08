import { db } from './db.js'
import { aiSuggestions, aiSuggestionEvents, userSuggestionPreferences, products, salesHistory, users } from '../shared/schema.js'
import { eq, and, gte, lte, lt, desc, sql, isNull, or } from 'drizzle-orm'
import crypto from 'crypto'

const SUGGESTION_TYPES = {
  EXPIRY: 'expiry',
  RUPTURE: 'rupture',
  SURSTOCK: 'surstock',
  METEO: 'meteo',
  ANOMALY: 'anomaly',
  PLAT_JOUR: 'plat_jour',
  RAPPEL_COMMANDE: 'rappel_commande',
  TENDANCE: 'tendance'
}

const PRIORITIES = {
  CRITICAL: 'critical',
  IMPORTANT: 'important',
  INFO: 'info'
}

function generateContentHash(type, productId, message) {
  const content = `${type}-${productId || 'general'}-${message.substring(0, 50)}`
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 32)
}

async function getOrCreatePreferences(userId) {
  const existing = await db.select()
    .from(userSuggestionPreferences)
    .where(eq(userSuggestionPreferences.userId, userId))
    .limit(1)
  
  if (existing.length > 0) {
    const prefs = existing[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (!prefs.lastEngagementResetAt || new Date(prefs.lastEngagementResetAt) < weekAgo) {
      await db.update(userSuggestionPreferences)
        .set({ 
          engagementScore: 0, 
          lastEngagementResetAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(userSuggestionPreferences.id, prefs.id))
      prefs.engagementScore = 0
    }
    return prefs
  }
  
  const [newPrefs] = await db.insert(userSuggestionPreferences)
    .values({ userId, popupFrequencyMinutes: 120, engagementScore: 0 })
    .returning()
  
  return newPrefs
}

async function checkDuplicateSuggestion(userId, contentHash) {
  const existing = await db.select()
    .from(aiSuggestions)
    .where(and(
      eq(aiSuggestions.userId, userId),
      eq(aiSuggestions.contentHash, contentHash),
      or(
        eq(aiSuggestions.status, 'pending'),
        eq(aiSuggestions.status, 'viewed')
      )
    ))
    .limit(1)
  
  return existing.length > 0
}

async function createSuggestion(userId, suggestion) {
  const contentHash = generateContentHash(suggestion.type, suggestion.productId, suggestion.message)
  
  const isDuplicate = await checkDuplicateSuggestion(userId, contentHash)
  if (isDuplicate) {
    return null
  }
  
  const expiresAt = suggestion.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000)
  
  const [created] = await db.insert(aiSuggestions)
    .values({
      userId,
      type: suggestion.type,
      priority: suggestion.priority,
      title: suggestion.title,
      message: suggestion.message,
      actionType: suggestion.actionType || null,
      actionData: suggestion.actionData ? JSON.stringify(suggestion.actionData) : null,
      productId: suggestion.productId || null,
      expiresAt,
      status: 'pending',
      contentHash
    })
    .returning()
  
  return created
}

async function generateExpirySuggestions(userId, userProducts) {
  const suggestions = []
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    if (!product.expiryDate) continue
    
    const expiryDate = new Date(product.expiryDate)
    if (expiryDate <= now) continue
    
    const quantity = parseFloat(product.currentQuantity) || 0
    if (quantity <= 0) continue
    
    if (expiryDate <= oneDayFromNow) {
      suggestions.push({
        type: SUGGESTION_TYPES.EXPIRY,
        priority: PRIORITIES.CRITICAL,
        title: `${product.name} expire demain !`,
        message: `${quantity} ${product.unit} de ${product.name} expirent demain. Action urgente requise : promotion flash ou plat du jour.`,
        actionType: 'view_product',
        actionData: { productId: product.id },
        productId: product.id,
        expiresAt: expiryDate
      })
    } else if (expiryDate <= threeDaysFromNow) {
      suggestions.push({
        type: SUGGESTION_TYPES.EXPIRY,
        priority: PRIORITIES.IMPORTANT,
        title: `${product.name} expire bientôt`,
        message: `${quantity} ${product.unit} de ${product.name} expirent dans ${Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000))} jours. Pensez à l'écouler.`,
        actionType: 'view_product',
        actionData: { productId: product.id },
        productId: product.id,
        expiresAt: expiryDate
      })
    }
  }
  
  return suggestions
}

async function generateRuptureSuggestions(userId, userProducts) {
  const suggestions = []
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    const quantity = parseFloat(product.currentQuantity) || 0
    const threshold = parseFloat(product.alertThreshold) || 0
    
    if (quantity > threshold) continue
    
    const sales = await db.select({
      totalSold: sql`COALESCE(SUM(${salesHistory.quantitySold}), 0)`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, sevenDaysAgo)
    ))
    
    const weeklyAvg = parseFloat(sales[0]?.totalSold || 0) / 7
    const daysUntilRupture = weeklyAvg > 0 ? Math.floor(quantity / weeklyAvg) : 999
    
    if (daysUntilRupture <= 1) {
      suggestions.push({
        type: SUGGESTION_TYPES.RUPTURE,
        priority: PRIORITIES.CRITICAL,
        title: `Rupture ${product.name} imminente !`,
        message: `Stock ${product.name} : ${quantity} ${product.unit}. À ce rythme, rupture estimée aujourd'hui ou demain. Commandez maintenant.`,
        actionType: 'order',
        actionData: { productId: product.id, suggestedQuantity: Math.ceil(weeklyAvg * 7) },
        productId: product.id
      })
    } else if (daysUntilRupture <= 3) {
      suggestions.push({
        type: SUGGESTION_TYPES.RUPTURE,
        priority: PRIORITIES.IMPORTANT,
        title: `Stock ${product.name} bas`,
        message: `${quantity} ${product.unit} restants (seuil: ${threshold}). Rupture estimée dans ${daysUntilRupture} jours.`,
        actionType: 'order',
        actionData: { productId: product.id, suggestedQuantity: Math.ceil(weeklyAvg * 7) },
        productId: product.id
      })
    }
  }
  
  return suggestions
}

async function generateSurstockSuggestions(userId, userProducts) {
  const suggestions = []
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    const quantity = parseFloat(product.currentQuantity) || 0
    if (quantity < 10) continue
    
    const sales = await db.select({
      totalSold: sql`COALESCE(SUM(${salesHistory.quantitySold}), 0)`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, thirtyDaysAgo)
    ))
    
    const monthlyAvg = parseFloat(sales[0]?.totalSold || 0)
    const weeklyAvg = monthlyAvg / 4
    
    if (weeklyAvg > 0 && quantity > weeklyAvg * 3) {
      const weeksOfStock = Math.floor(quantity / weeklyAvg)
      suggestions.push({
        type: SUGGESTION_TYPES.SURSTOCK,
        priority: PRIORITIES.INFO,
        title: `Surstock ${product.name}`,
        message: `${quantity} ${product.unit} en stock soit ${weeksOfStock} semaines de ventes. Envisagez une promotion pour écouler.`,
        actionType: 'create_promo',
        actionData: { productId: product.id },
        productId: product.id
      })
    }
  }
  
  return suggestions
}

async function generateAnomalySuggestions(userId, userProducts) {
  const suggestions = []
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    const [recentSales] = await db.select({
      totalSold: sql`COALESCE(SUM(${salesHistory.quantitySold}), 0)`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, sevenDaysAgo)
    ))
    
    const [previousSales] = await db.select({
      totalSold: sql`COALESCE(SUM(${salesHistory.quantitySold}), 0)`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, fourteenDaysAgo),
      lt(salesHistory.saleDate, sevenDaysAgo)
    ))
    
    const recent = parseFloat(recentSales?.totalSold || 0)
    const previous = parseFloat(previousSales?.totalSold || 0)
    
    if (previous > 5) {
      const changePercent = ((recent - previous) / previous) * 100
      
      if (changePercent <= -30) {
        suggestions.push({
          type: SUGGESTION_TYPES.ANOMALY,
          priority: PRIORITIES.IMPORTANT,
          title: `Chute ventes ${product.name}`,
          message: `Ventes ${product.name} : ${Math.abs(Math.round(changePercent))}% cette semaine vs semaine précédente. Problème qualité ? Nouveau concurrent ?`,
          actionType: 'view_history',
          actionData: { productId: product.id },
          productId: product.id
        })
      } else if (changePercent >= 50) {
        suggestions.push({
          type: SUGGESTION_TYPES.ANOMALY,
          priority: PRIORITIES.INFO,
          title: `${product.name} cartonne !`,
          message: `+${Math.round(changePercent)}% de ventes cette semaine. Augmentez la production pour capitaliser sur cette tendance.`,
          actionType: 'view_history',
          actionData: { productId: product.id },
          productId: product.id
        })
      }
    }
  }
  
  return suggestions
}

async function generateTendanceSuggestions(userId, userProducts) {
  const suggestions = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    const salesByDay = await db.select({
      dayOfWeek: salesHistory.dayOfWeek,
      totalSold: sql`SUM(${salesHistory.quantitySold})`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, thirtyDaysAgo)
    ))
    .groupBy(salesHistory.dayOfWeek)
    
    if (salesByDay.length < 3) continue
    
    const avgPerDay = salesByDay.reduce((sum, d) => sum + parseFloat(d.totalSold || 0), 0) / salesByDay.length
    
    for (const daySales of salesByDay) {
      const sold = parseFloat(daySales.totalSold || 0)
      if (sold > avgPerDay * 1.3 && daySales.dayOfWeek === dayOfWeek) {
        suggestions.push({
          type: SUGGESTION_TYPES.TENDANCE,
          priority: PRIORITIES.INFO,
          title: `${product.name} populaire le ${dayNames[dayOfWeek]}`,
          message: `Historiquement, ${product.name} se vend +${Math.round((sold / avgPerDay - 1) * 100)}% le ${dayNames[dayOfWeek]}. Prévoyez plus de stock.`,
          actionType: 'view_product',
          actionData: { productId: product.id },
          productId: product.id
        })
        break
      }
    }
  }
  
  return suggestions.slice(0, 2)
}

async function generateRappelCommandeSuggestions(userId, userProducts) {
  const suggestions = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  
  const supplierProducts = {}
  for (const product of userProducts) {
    if (!product.supplier) continue
    if (!supplierProducts[product.supplier]) {
      supplierProducts[product.supplier] = []
    }
    supplierProducts[product.supplier].push(product)
  }
  
  const commandDays = {
    'Metro': [1, 4],
    'Promocash': [2, 5],
    'Transgourmet': [1, 3, 5]
  }
  
  for (const [supplier, prods] of Object.entries(supplierProducts)) {
    const days = commandDays[supplier] || [1, 4]
    if (days.includes(dayOfWeek)) {
      const lowStockProducts = prods.filter(p => 
        parseFloat(p.currentQuantity) <= parseFloat(p.alertThreshold) * 1.5
      )
      
      if (lowStockProducts.length > 0) {
        suggestions.push({
          type: SUGGESTION_TYPES.RAPPEL_COMMANDE,
          priority: PRIORITIES.IMPORTANT,
          title: `Commande ${supplier} à passer`,
          message: `C'est le jour de commande ${supplier}. ${lowStockProducts.length} produit(s) en stock bas : ${lowStockProducts.slice(0, 3).map(p => p.name).join(', ')}${lowStockProducts.length > 3 ? '...' : ''}.`,
          actionType: 'generate_order',
          actionData: { supplier, productIds: lowStockProducts.map(p => p.id) }
        })
      }
    }
  }
  
  return suggestions
}

export async function generateAllSuggestions(userId) {
  try {
    const userProducts = await db.select()
      .from(products)
      .where(eq(products.userId, userId))
    
    if (userProducts.length === 0) {
      return { generated: 0, suggestions: [] }
    }
    
    const allSuggestionPromises = [
      generateExpirySuggestions(userId, userProducts),
      generateRuptureSuggestions(userId, userProducts),
      generateSurstockSuggestions(userId, userProducts),
      generateAnomalySuggestions(userId, userProducts),
      generateTendanceSuggestions(userId, userProducts),
      generateRappelCommandeSuggestions(userId, userProducts)
    ]
    
    const results = await Promise.all(allSuggestionPromises)
    const allSuggestions = results.flat()
    
    const createdSuggestions = []
    for (const suggestion of allSuggestions) {
      const created = await createSuggestion(userId, suggestion)
      if (created) {
        createdSuggestions.push(created)
      }
    }
    
    return { generated: createdSuggestions.length, suggestions: createdSuggestions }
  } catch (error) {
    console.error('Erreur génération suggestions:', error)
    return { generated: 0, suggestions: [], error: error.message }
  }
}

export async function getUserSuggestions(userId, options = {}) {
  const { limit = 20, includeViewed = true, priorityFilter = null } = options
  
  const now = new Date()
  
  let query = db.select()
    .from(aiSuggestions)
    .where(and(
      eq(aiSuggestions.userId, userId),
      or(
        isNull(aiSuggestions.expiresAt),
        gte(aiSuggestions.expiresAt, now)
      ),
      includeViewed 
        ? or(eq(aiSuggestions.status, 'pending'), eq(aiSuggestions.status, 'viewed'))
        : eq(aiSuggestions.status, 'pending')
    ))
    .orderBy(
      sql`CASE ${aiSuggestions.priority} WHEN 'critical' THEN 1 WHEN 'important' THEN 2 ELSE 3 END`,
      desc(aiSuggestions.createdAt)
    )
    .limit(limit)
  
  const suggestions = await query
  
  return suggestions
}

export async function getUnreadCount(userId) {
  const [result] = await db.select({
    count: sql`COUNT(*)`,
    hasCritical: sql`MAX(CASE WHEN ${aiSuggestions.priority} = 'critical' THEN 1 ELSE 0 END)`
  })
  .from(aiSuggestions)
  .where(and(
    eq(aiSuggestions.userId, userId),
    eq(aiSuggestions.status, 'pending'),
    or(
      isNull(aiSuggestions.expiresAt),
      gte(aiSuggestions.expiresAt, new Date())
    )
  ))
  
  return {
    count: parseInt(result?.count || 0),
    hasCritical: parseInt(result?.hasCritical || 0) === 1
  }
}

export async function markSuggestionViewed(suggestionId, userId) {
  await db.update(aiSuggestions)
    .set({ status: 'viewed' })
    .where(and(
      eq(aiSuggestions.id, suggestionId),
      eq(aiSuggestions.userId, userId)
    ))
  
  await db.insert(aiSuggestionEvents)
    .values({
      suggestionId,
      userId,
      eventType: 'viewed'
    })
  
  await updateEngagementScore(userId, 0)
}

export async function dismissSuggestion(suggestionId, userId) {
  await db.update(aiSuggestions)
    .set({ status: 'dismissed' })
    .where(and(
      eq(aiSuggestions.id, suggestionId),
      eq(aiSuggestions.userId, userId)
    ))
  
  await db.insert(aiSuggestionEvents)
    .values({
      suggestionId,
      userId,
      eventType: 'dismissed'
    })
  
  await updateEngagementScore(userId, -1)
}

export async function actOnSuggestion(suggestionId, userId, actionTaken) {
  await db.update(aiSuggestions)
    .set({ status: 'acted' })
    .where(and(
      eq(aiSuggestions.id, suggestionId),
      eq(aiSuggestions.userId, userId)
    ))
  
  await db.insert(aiSuggestionEvents)
    .values({
      suggestionId,
      userId,
      eventType: 'acted',
      metadata: JSON.stringify({ action: actionTaken })
    })
  
  await updateEngagementScore(userId, 1)
}

async function updateEngagementScore(userId, delta) {
  const prefs = await getOrCreatePreferences(userId)
  
  const newScore = Math.max(-5, Math.min(10, prefs.engagementScore + delta))
  
  let newFrequency = 120
  if (newScore >= 5) {
    newFrequency = 120
  } else if (newScore >= 0) {
    newFrequency = 180
  } else {
    newFrequency = 240
  }
  
  await db.update(userSuggestionPreferences)
    .set({ 
      engagementScore: newScore,
      popupFrequencyMinutes: newFrequency,
      updatedAt: new Date()
    })
    .where(eq(userSuggestionPreferences.id, prefs.id))
}

export async function shouldShowPopup(userId) {
  const prefs = await getOrCreatePreferences(userId)
  const unread = await getUnreadCount(userId)
  
  if (unread.count === 0) {
    return { show: false, reason: 'no_suggestions' }
  }
  
  if (unread.hasCritical) {
    await db.update(userSuggestionPreferences)
      .set({ lastPopupAt: new Date(), updatedAt: new Date() })
      .where(eq(userSuggestionPreferences.id, prefs.id))
    return { show: true, reason: 'critical', count: unread.count }
  }
  
  if (!prefs.lastPopupAt) {
    await db.update(userSuggestionPreferences)
      .set({ lastPopupAt: new Date(), updatedAt: new Date() })
      .where(eq(userSuggestionPreferences.id, prefs.id))
    return { show: true, reason: 'first_time', count: unread.count }
  }
  
  const lastPopup = new Date(prefs.lastPopupAt)
  const minutesSinceLastPopup = (Date.now() - lastPopup.getTime()) / (1000 * 60)
  
  if (minutesSinceLastPopup >= prefs.popupFrequencyMinutes) {
    await db.update(userSuggestionPreferences)
      .set({ lastPopupAt: new Date(), updatedAt: new Date() })
      .where(eq(userSuggestionPreferences.id, prefs.id))
    return { show: true, reason: 'throttle_passed', count: unread.count }
  }
  
  return { 
    show: false, 
    reason: 'throttled', 
    nextPopupIn: Math.ceil(prefs.popupFrequencyMinutes - minutesSinceLastPopup),
    count: unread.count
  }
}

export async function cleanupExpiredSuggestions() {
  const result = await db.delete(aiSuggestions)
    .where(and(
      lt(aiSuggestions.expiresAt, new Date()),
      or(
        eq(aiSuggestions.status, 'pending'),
        eq(aiSuggestions.status, 'viewed')
      )
    ))
  
  return result
}
