import { db } from './db.js'
import { aiSuggestions, aiSuggestionEvents, userSuggestionPreferences, products, salesHistory, users, stores, productCompositions } from '../shared/schema.js'
import { eq, and, gte, lte, lt, desc, sql, isNull, or } from 'drizzle-orm'
import crypto from 'crypto'
import OpenAI from 'openai'
import { weatherService } from './weatherService.js'

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
})

const SUGGESTION_TYPES = {
  // Stock
  EXPIRY: 'expiry',
  RUPTURE: 'rupture',
  SURSTOCK: 'surstock',
  STOCK_DORMANT: 'stock_dormant',
  ROTATION_LENTE: 'rotation_lente',
  SAISONNALITE: 'saisonnalite',
  STOCK_OPTIMAL: 'stock_optimal',
  REAPPRO_AUTO: 'reappro_auto',
  // Recettes
  EROSION_MARGE: 'erosion_marge',
  IMPACT_RUPTURE_RECETTE: 'impact_rupture_recette',
  CAPACITE_PRODUCTION: 'capacite_production',
  RENTABILITE_RECETTE: 'rentabilite_recette',
  OPTIMISATION_RECETTE: 'optimisation_recette',
  COUT_PRODUCTION: 'cout_production',
  // Ventes
  TENDANCE: 'tendance',
  ANOMALY: 'anomaly',
  METEO: 'meteo',
  PRODUIT_STAR: 'produit_star',
  PRODUIT_DECLIN: 'produit_declin',
  EFFET_JOUR: 'effet_jour',
  PANIER_MOYEN: 'panier_moyen',
  // Finance
  CASH_FLOW: 'cash_flow',
  MARGE_CATEGORIE: 'marge_categorie',
  COUT_CACHE: 'cout_cache',
  ECONOMIE_POTENTIELLE: 'economie_potentielle',
  ROI_PRODUIT: 'roi_produit',
  // Fournisseurs
  MEILLEUR_PRIX: 'meilleur_prix',
  DELAI_OPTIMAL: 'delai_optimal',
  QUALITE_PRIX: 'qualite_prix',
  NEGOCIATION: 'negociation',
  DIVERSIFICATION: 'diversification',
  // Conformité
  DLC_REGLEMENTAIRE: 'dlc_reglementaire',
  TRACABILITE: 'tracabilite',
  HYGIENE: 'hygiene',
  OBLIGATION_LEGALE: 'obligation_legale',
  // Durabilité
  GASPILLAGE: 'gaspillage',
  INVENDUS: 'invendus',
  CIRCUIT_COURT: 'circuit_court',
  EMPREINTE_CARBONE: 'empreinte_carbone',
  // Opérations
  TEMPS_GAGNE: 'temps_gagne',
  EFFICACITE: 'efficacite',
  PLANIFICATION: 'planification',
  PLAT_JOUR: 'plat_jour',
  RAPPEL_COMMANDE: 'rappel_commande'
}

const DOMAINS = {
  STOCK: 'stock',
  RECIPES: 'recipes',
  SALES: 'sales',
  FINANCE: 'finance',
  SUPPLIERS: 'suppliers',
  COMPLIANCE: 'compliance',
  SUSTAINABILITY: 'sustainability',
  OPERATIONS: 'operations'
}

const PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

const SEVERITY_SCORES = {
  CRITICAL: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25
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
  
  const severityScore = suggestion.severityScore || 
    (suggestion.priority === PRIORITIES.CRITICAL ? SEVERITY_SCORES.CRITICAL :
     suggestion.priority === PRIORITIES.HIGH ? SEVERITY_SCORES.HIGH :
     suggestion.priority === PRIORITIES.MEDIUM ? SEVERITY_SCORES.MEDIUM : SEVERITY_SCORES.LOW)
  
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
      contentHash,
      domain: suggestion.domain || DOMAINS.STOCK,
      isRead: false,
      impactValue: suggestion.impactValue ? String(suggestion.impactValue) : null,
      severityScore
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
        priority: PRIORITIES.HIGH,
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
        priority: PRIORITIES.HIGH,
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
        priority: PRIORITIES.MEDIUM,
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
          priority: PRIORITIES.HIGH,
          title: `Chute ventes ${product.name}`,
          message: `Ventes ${product.name} : ${Math.abs(Math.round(changePercent))}% cette semaine vs semaine précédente. Problème qualité ? Nouveau concurrent ?`,
          actionType: 'view_history',
          actionData: { productId: product.id },
          productId: product.id
        })
      } else if (changePercent >= 50) {
        suggestions.push({
          type: SUGGESTION_TYPES.ANOMALY,
          priority: PRIORITIES.MEDIUM,
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
          priority: PRIORITIES.MEDIUM,
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
          priority: PRIORITIES.HIGH,
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

async function getStoreInfo(userId) {
  try {
    const [store] = await db.select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .limit(1)
    return store || { type: 'restaurant', city: 'Paris' }
  } catch {
    return { type: 'restaurant', city: 'Paris' }
  }
}

async function getStoreType(userId) {
  const store = await getStoreInfo(userId)
  return store?.type || 'restaurant'
}

async function generateMeteoSuggestions(userId, userProducts) {
  const suggestions = []
  
  try {
    const store = await getStoreInfo(userId)
    const city = store?.city || 'Paris'
    
    const forecast = await weatherService.getForecast(city, 'FR', 3)
    if (!forecast?.forecasts?.length) return suggestions
    
    const tomorrow = forecast.forecasts[1] || forecast.forecasts[0]
    if (!tomorrow) return suggestions
    
    const storeType = store?.type || 'restaurant'
    
    const weatherImpacts = {
      hot: { threshold: 28, products: ['glaces', 'boissons fraîches', 'eau', 'bière', 'rosé', 'smoothie'], message: 'Canicule prévue' },
      cold: { threshold: 5, products: ['soupes', 'café', 'chocolat', 'vin rouge', 'plats chauds'], message: 'Vague de froid' },
      rain: { conditions: ['rain', 'drizzle', 'thunderstorm'], effect: 'moins de passage', message: 'Pluie annoncée' },
      sun: { conditions: ['clear', 'sunny'], effect: 'plus de passage terrasse', message: 'Grand soleil prévu' }
    }
    
    if (tomorrow.tempMax >= weatherImpacts.hot.threshold) {
      const hotProducts = userProducts.filter(p => 
        weatherImpacts.hot.products.some(kw => 
          p.name.toLowerCase().includes(kw) || 
          (p.category && p.category.toLowerCase().includes(kw))
        )
      )
      
      if (hotProducts.length > 0) {
        const lowStockHot = hotProducts.filter(p => 
          parseFloat(p.currentQuantity) <= parseFloat(p.alertThreshold) * 2
        )
        
        if (lowStockHot.length > 0) {
          suggestions.push({
            type: SUGGESTION_TYPES.METEO,
            priority: PRIORITIES.HIGH,
            title: `☀️ ${weatherImpacts.hot.message} demain (${tomorrow.tempMax}°C)`,
            message: `Prévoyez plus de stock pour : ${lowStockHot.slice(0, 3).map(p => p.name).join(', ')}. La demande sera forte !`,
            actionType: 'view_products',
            actionData: { productIds: lowStockHot.map(p => p.id), reason: 'canicule' }
          })
        }
      }
    }
    
    if (tomorrow.tempMin <= weatherImpacts.cold.threshold) {
      const coldProducts = userProducts.filter(p => 
        weatherImpacts.cold.products.some(kw => 
          p.name.toLowerCase().includes(kw) || 
          (p.category && p.category.toLowerCase().includes(kw))
        )
      )
      
      if (coldProducts.length > 0) {
        const lowStockCold = coldProducts.filter(p => 
          parseFloat(p.currentQuantity) <= parseFloat(p.alertThreshold) * 2
        )
        
        if (lowStockCold.length > 0) {
          suggestions.push({
            type: SUGGESTION_TYPES.METEO,
            priority: PRIORITIES.MEDIUM,
            title: `❄️ ${weatherImpacts.cold.message} demain (${tomorrow.tempMin}°C)`,
            message: `Les clients voudront du chaud ! Vérifiez vos stocks de : ${lowStockCold.slice(0, 3).map(p => p.name).join(', ')}.`,
            actionType: 'view_products',
            actionData: { productIds: lowStockCold.map(p => p.id), reason: 'froid' }
          })
        }
      }
    }
    
    if (weatherImpacts.rain.conditions.includes(tomorrow.condition)) {
      if (storeType === 'restaurant' || storeType === 'bar') {
        suggestions.push({
          type: SUGGESTION_TYPES.METEO,
          priority: PRIORITIES.MEDIUM,
          title: `🌧️ Pluie prévue demain`,
          message: `Attendez-vous à 15-25% moins de passage. Bon jour pour les livraisons ou événements privés !`,
          actionType: 'info'
        })
      }
    }
    
  } catch (error) {
    console.error('Erreur suggestions météo:', error.message)
  }
  
  return suggestions
}

async function generateAIPlatJourSuggestions(userId, userProducts) {
  const suggestions = []
  
  try {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    
    const productsToUse = userProducts.filter(p => {
      if (p.expiryDate) {
        const expiry = new Date(p.expiryDate)
        return expiry <= threeDaysFromNow && expiry >= now
      }
      if (parseFloat(p.currentQuantity) > parseFloat(p.alertThreshold) * 3) {
        return true
      }
      return false
    })
    
    if (productsToUse.length === 0) return suggestions
    
    const storeType = await getStoreType(userId)
    
    const storePrompts = {
      bakery: "boulangerie-pâtisserie",
      restaurant: "restaurant",
      bar: "bar à cocktails",
      wine_cellar: "cave à vins",
      cheese_shop: "fromagerie"
    }
    
    const productList = productsToUse.slice(0, 5).map(p => {
      let info = `${p.name} (stock: ${p.currentQuantity}${p.unit ? ' ' + p.unit : ''})`
      if (p.expiryDate) {
        const days = Math.ceil((new Date(p.expiryDate) - now) / (24 * 60 * 60 * 1000))
        info += ` [expire dans ${days} jour${days > 1 ? 's' : ''}]`
      }
      return info
    }).join(', ')
    
    const prompt = `Tu es un chef créatif pour une ${storePrompts[storeType] || 'commerce alimentaire'} française. 
    
Produits à écouler rapidement: ${productList}

Propose UNE SEULE idée créative et concrète pour utiliser/vendre ces produits:
- Pour un bar: un cocktail du jour
- Pour un restaurant: un plat du jour ou menu spécial
- Pour une boulangerie: une viennoiserie ou formule spéciale  
- Pour une cave: un accord mets-vins ou offre découverte
- Pour une fromagerie: un plateau ou suggestion d'affinage

Format ta réponse en JSON:
{
  "titre": "Nom accrocheur de l'offre (max 30 caractères)",
  "description": "Description courte et vendeuse (max 100 caractères)",
  "produits_utilises": ["produit1", "produit2"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu réponds uniquement en JSON valide, sans markdown ni explication.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8
    })
    
    const responseText = completion.choices[0]?.message?.content?.trim() || ''
    
    let parsed
    try {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsed = JSON.parse(cleanJson)
    } catch {
      console.log('Réponse IA non-JSON:', responseText)
      return suggestions
    }
    
    if (parsed.titre && parsed.description) {
      suggestions.push({
        type: SUGGESTION_TYPES.PLAT_JOUR,
        priority: PRIORITIES.MEDIUM,
        title: `💡 ${parsed.titre}`,
        message: `${parsed.description}. Produits : ${parsed.produits_utilises?.join(', ') || productList}`,
        actionType: 'create_special',
        actionData: { 
          suggestion: parsed,
          products: productsToUse.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
        },
        expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000)
      })
    }
  } catch (error) {
    console.error('Erreur IA plat du jour:', error.message)
  }
  
  return suggestions
}

// ============================================
// NOUVELLES FONCTIONS - Produits Composés (Recettes)
// ============================================

async function generateCompositeProductSuggestions(userId, userProducts) {
  const suggestions = []
  
  const compositeProducts = userProducts.filter(p => p.isComposite)
  
  for (const recipe of compositeProducts) {
    const compositions = await db.select()
      .from(productCompositions)
      .where(eq(productCompositions.productId, recipe.id))
    
    if (compositions.length === 0) continue
    
    let totalIngredientCost = 0
    let hasRuptureRisk = false
    let ruptureIngredients = []
    let maxProductionUnits = Infinity
    
    for (const comp of compositions) {
      const ingredient = userProducts.find(p => p.id === comp.ingredientId)
      if (!ingredient) continue
      
      const ingredientPrice = parseFloat(ingredient.purchasePrice) || 0
      const requiredQty = parseFloat(comp.quantity) || 0
      totalIngredientCost += ingredientPrice * requiredQty
      
      const currentStock = parseFloat(ingredient.currentQuantity) || 0
      const threshold = parseFloat(ingredient.alertThreshold) || 0
      
      if (currentStock <= threshold) {
        hasRuptureRisk = true
        ruptureIngredients.push(ingredient.name)
      }
      
      if (requiredQty > 0) {
        const possibleUnits = Math.floor(currentStock / requiredQty)
        maxProductionUnits = Math.min(maxProductionUnits, possibleUnits)
      }
    }
    
    const salePrice = parseFloat(recipe.salePrice) || 0
    const currentMargin = salePrice - totalIngredientCost
    const marginPercent = salePrice > 0 ? (currentMargin / salePrice) * 100 : 0
    
    if (marginPercent < 30 && salePrice > 0) {
      suggestions.push({
        type: SUGGESTION_TYPES.EROSION_MARGE,
        priority: PRIORITIES.HIGH,
        domain: DOMAINS.RECIPES,
        title: `Marge faible sur ${recipe.name}`,
        message: `Marge de seulement ${marginPercent.toFixed(1)}% (${currentMargin.toFixed(2)}€). Coût ingrédients: ${totalIngredientCost.toFixed(2)}€, Prix vente: ${salePrice.toFixed(2)}€. Optimisez la recette ou augmentez le prix.`,
        actionType: 'view_recipe',
        actionData: { productId: recipe.id },
        productId: recipe.id,
        impactValue: Math.abs(currentMargin),
        severityScore: marginPercent < 15 ? 90 : 70
      })
    }
    
    if (hasRuptureRisk) {
      suggestions.push({
        type: SUGGESTION_TYPES.IMPACT_RUPTURE_RECETTE,
        priority: PRIORITIES.CRITICAL,
        domain: DOMAINS.RECIPES,
        title: `${recipe.name} en danger !`,
        message: `Rupture imminente des ingrédients: ${ruptureIngredients.join(', ')}. Vous ne pourrez plus produire ${recipe.name}.`,
        actionType: 'order_ingredients',
        actionData: { productId: recipe.id, ingredients: ruptureIngredients },
        productId: recipe.id,
        impactValue: salePrice * 10,
        severityScore: 95
      })
    }
    
    if (maxProductionUnits < 10 && maxProductionUnits > 0) {
      suggestions.push({
        type: SUGGESTION_TYPES.CAPACITE_PRODUCTION,
        priority: PRIORITIES.HIGH,
        domain: DOMAINS.RECIPES,
        title: `Stock limité pour ${recipe.name}`,
        message: `Vous pouvez produire seulement ${maxProductionUnits} unités de ${recipe.name} avec le stock actuel. Réapprovisionnez les ingrédients.`,
        actionType: 'view_recipe',
        actionData: { productId: recipe.id, maxUnits: maxProductionUnits },
        productId: recipe.id,
        impactValue: salePrice * maxProductionUnits,
        severityScore: maxProductionUnits < 5 ? 80 : 60
      })
    }
    
    if (marginPercent > 50 && salePrice > 0) {
      suggestions.push({
        type: SUGGESTION_TYPES.RENTABILITE_RECETTE,
        priority: PRIORITIES.MEDIUM,
        domain: DOMAINS.RECIPES,
        title: `${recipe.name} très rentable`,
        message: `Excellente marge de ${marginPercent.toFixed(1)}%! Mettez ce produit en avant dans votre offre.`,
        actionType: 'promote',
        actionData: { productId: recipe.id },
        productId: recipe.id,
        impactValue: currentMargin * 5,
        severityScore: 40
      })
    }
  }
  
  return suggestions
}

// ============================================
// NOUVELLES FONCTIONS - Finance
// ============================================

async function generateFinanceSuggestions(userId, userProducts) {
  const suggestions = []
  
  let totalStockValue = 0
  let expiringSoonValue = 0
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  for (const product of userProducts) {
    const qty = parseFloat(product.currentQuantity) || 0
    const price = parseFloat(product.purchasePrice) || 0
    const value = qty * price
    totalStockValue += value
    
    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate)
      if (expiryDate <= sevenDaysFromNow && expiryDate > now) {
        expiringSoonValue += value
      }
    }
  }
  
  if (expiringSoonValue > 50) {
    suggestions.push({
      type: SUGGESTION_TYPES.CASH_FLOW,
      priority: PRIORITIES.HIGH,
      domain: DOMAINS.FINANCE,
      title: `${expiringSoonValue.toFixed(0)}€ en stock périssable`,
      message: `Valeur de stock qui expire dans 7 jours. Agissez vite pour récupérer cette valeur via promotions ou plat du jour.`,
      actionType: 'view_expiring',
      actionData: { value: expiringSoonValue },
      impactValue: expiringSoonValue,
      severityScore: 75
    })
  }
  
  const categories = {}
  for (const product of userProducts) {
    const cat = product.category || 'Autre'
    if (!categories[cat]) {
      categories[cat] = { cost: 0, value: 0, count: 0 }
    }
    const qty = parseFloat(product.currentQuantity) || 0
    const purchasePrice = parseFloat(product.purchasePrice) || 0
    const salePrice = parseFloat(product.salePrice) || 0
    categories[cat].cost += qty * purchasePrice
    categories[cat].value += qty * salePrice
    categories[cat].count++
  }
  
  for (const [catName, data] of Object.entries(categories)) {
    if (data.cost > 0 && data.value > 0) {
      const marginPercent = ((data.value - data.cost) / data.value) * 100
      if (marginPercent < 25) {
        suggestions.push({
          type: SUGGESTION_TYPES.MARGE_CATEGORIE,
          priority: PRIORITIES.HIGH,
          domain: DOMAINS.FINANCE,
          title: `Marge faible: ${catName}`,
          message: `La catégorie "${catName}" a une marge de seulement ${marginPercent.toFixed(1)}%. Revoyez vos prix ou fournisseurs.`,
          actionType: 'view_category',
          actionData: { category: catName },
          impactValue: data.cost * 0.1,
          severityScore: 70
        })
      }
    }
  }
  
  return suggestions
}

// ============================================
// NOUVELLES FONCTIONS - Durabilité
// ============================================

async function generateSustainabilitySuggestions(userId, userProducts) {
  const suggestions = []
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  const expiredProducts = userProducts.filter(p => {
    if (!p.expiryDate) return false
    const expiryDate = new Date(p.expiryDate)
    return expiryDate < now && parseFloat(p.currentQuantity) > 0
  })
  
  if (expiredProducts.length > 0) {
    const totalWasteValue = expiredProducts.reduce((sum, p) => {
      return sum + (parseFloat(p.currentQuantity) || 0) * (parseFloat(p.purchasePrice) || 0)
    }, 0)
    
    suggestions.push({
      type: SUGGESTION_TYPES.GASPILLAGE,
      priority: PRIORITIES.HIGH,
      domain: DOMAINS.SUSTAINABILITY,
      title: `${expiredProducts.length} produits périmés`,
      message: `${totalWasteValue.toFixed(2)}€ de gaspillage. Envisagez Too Good To Go ou don à une association pour les prochaines fois.`,
      actionType: 'view_expired',
      actionData: { products: expiredProducts.map(p => p.id) },
      impactValue: totalWasteValue,
      severityScore: 80
    })
  }
  
  const expiringTomorrow = userProducts.filter(p => {
    if (!p.expiryDate) return false
    const expiryDate = new Date(p.expiryDate)
    return expiryDate <= tomorrow && expiryDate > now && parseFloat(p.currentQuantity) > 0
  })
  
  if (expiringTomorrow.length >= 3) {
    const totalValue = expiringTomorrow.reduce((sum, p) => {
      return sum + (parseFloat(p.currentQuantity) || 0) * (parseFloat(p.purchasePrice) || 0)
    }, 0)
    
    suggestions.push({
      type: SUGGESTION_TYPES.INVENDUS,
      priority: PRIORITIES.HIGH,
      domain: DOMAINS.SUSTAINABILITY,
      title: `Panier anti-gaspi possible`,
      message: `${expiringTomorrow.length} produits expirent demain (${totalValue.toFixed(0)}€). Créez un panier promotionnel ou proposez sur Too Good To Go.`,
      actionType: 'create_bundle',
      actionData: { products: expiringTomorrow.map(p => p.id) },
      impactValue: totalValue * 0.5,
      severityScore: 65
    })
  }
  
  return suggestions
}

// ============================================
// NOUVELLES FONCTIONS - Opérations
// ============================================

async function generateOperationsSuggestions(userId, userProducts) {
  const suggestions = []
  
  const lowStockCount = userProducts.filter(p => {
    const qty = parseFloat(p.currentQuantity) || 0
    const threshold = parseFloat(p.alertThreshold) || 0
    return qty <= threshold
  }).length
  
  if (lowStockCount >= 5) {
    suggestions.push({
      type: SUGGESTION_TYPES.RAPPEL_COMMANDE,
      priority: PRIORITIES.HIGH,
      domain: DOMAINS.OPERATIONS,
      title: `${lowStockCount} produits à commander`,
      message: `Gagnez du temps en passant une commande groupée. PONIA a identifié ${lowStockCount} produits en stock bas.`,
      actionType: 'generate_order',
      actionData: { count: lowStockCount },
      impactValue: lowStockCount * 2,
      severityScore: 60
    })
  }
  
  const productsWithoutThreshold = userProducts.filter(p => {
    return !p.alertThreshold || parseFloat(p.alertThreshold) === 0
  }).length
  
  if (productsWithoutThreshold > 5) {
    suggestions.push({
      type: SUGGESTION_TYPES.EFFICACITE,
      priority: PRIORITIES.MEDIUM,
      domain: DOMAINS.OPERATIONS,
      title: `${productsWithoutThreshold} produits sans seuil d'alerte`,
      message: `Configurez les seuils d'alerte pour recevoir des notifications automatiques et ne jamais être en rupture.`,
      actionType: 'configure_alerts',
      actionData: { count: productsWithoutThreshold },
      impactValue: productsWithoutThreshold,
      severityScore: 40
    })
  }
  
  return suggestions
}

// ============================================
// NOUVELLES FONCTIONS - Ventes avancées
// ============================================

async function generateAdvancedSalesSuggestions(userId, userProducts) {
  const suggestions = []
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const productSales = []
  for (const product of userProducts) {
    const [sales] = await db.select({
      totalSold: sql`COALESCE(SUM(${salesHistory.quantitySold}), 0)`,
      totalRevenue: sql`COALESCE(SUM(${salesHistory.quantitySold} * ${salesHistory.unitPrice}), 0)`
    })
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, product.id),
      gte(salesHistory.saleDate, thirtyDaysAgo)
    ))
    
    productSales.push({
      product,
      sold: parseFloat(sales?.totalSold || 0),
      revenue: parseFloat(sales?.totalRevenue || 0)
    })
  }
  
  const sortedByRevenue = [...productSales].sort((a, b) => b.revenue - a.revenue)
  const topProducts = sortedByRevenue.slice(0, 3).filter(p => p.revenue > 0)
  
  if (topProducts.length > 0 && topProducts[0].revenue > 50) {
    const topProduct = topProducts[0]
    suggestions.push({
      type: SUGGESTION_TYPES.PRODUIT_STAR,
      priority: PRIORITIES.MEDIUM,
      domain: DOMAINS.SALES,
      title: `${topProduct.product.name} est votre star`,
      message: `${topProduct.revenue.toFixed(0)}€ de CA ce mois. Assurez-vous de toujours avoir ce produit en stock et mettez-le en avant.`,
      actionType: 'promote',
      actionData: { productId: topProduct.product.id },
      productId: topProduct.product.id,
      impactValue: topProduct.revenue,
      severityScore: 35
    })
  }
  
  const bottomProducts = sortedByRevenue.filter(p => p.sold === 0 && parseFloat(p.product.currentQuantity) > 0)
  if (bottomProducts.length >= 3) {
    suggestions.push({
      type: SUGGESTION_TYPES.PRODUIT_DECLIN,
      priority: PRIORITIES.MEDIUM,
      domain: DOMAINS.SALES,
      title: `${bottomProducts.length} produits sans ventes`,
      message: `Ces produits n'ont eu aucune vente ce mois. Envisagez une promotion ou arrêtez de les stocker.`,
      actionType: 'view_products',
      actionData: { products: bottomProducts.slice(0, 5).map(p => p.product.id) },
      impactValue: bottomProducts.reduce((sum, p) => sum + (parseFloat(p.product.currentQuantity) || 0) * (parseFloat(p.product.purchasePrice) || 0), 0),
      severityScore: 45
    })
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
    
    const [rulesResults, advancedResults, aiResults, meteoResults] = await Promise.all([
      Promise.all([
        generateExpirySuggestions(userId, userProducts),
        generateRuptureSuggestions(userId, userProducts),
        generateSurstockSuggestions(userId, userProducts),
        generateAnomalySuggestions(userId, userProducts),
        generateTendanceSuggestions(userId, userProducts),
        generateRappelCommandeSuggestions(userId, userProducts)
      ]),
      Promise.all([
        generateCompositeProductSuggestions(userId, userProducts),
        generateFinanceSuggestions(userId, userProducts),
        generateSustainabilitySuggestions(userId, userProducts),
        generateOperationsSuggestions(userId, userProducts),
        generateAdvancedSalesSuggestions(userId, userProducts)
      ]).catch(err => {
        console.error('Erreur suggestions avancées:', err.message)
        return []
      }),
      generateAIPlatJourSuggestions(userId, userProducts).catch(err => {
        console.error('Erreur suggestions IA:', err.message)
        return []
      }),
      generateMeteoSuggestions(userId, userProducts).catch(err => {
        console.error('Erreur suggestions météo:', err.message)
        return []
      })
    ])
    
    const allSuggestions = [
      ...rulesResults.flat(), 
      ...(Array.isArray(advancedResults) ? advancedResults.flat() : []),
      ...aiResults, 
      ...meteoResults
    ]
    
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
