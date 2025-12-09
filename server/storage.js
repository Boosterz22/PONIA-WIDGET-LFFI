import { db } from './db.js'
import { users, products, stockHistory, salesHistory, notifications, stores, chatMessages, chatConversations, posConnections, posProductMappings, posSales, posSyncLogs, alertPreferences, emailLogs } from '../shared/schema.js'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'

export async function getUserByEmail(email) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user[0] || null
}

export async function getUserBySupabaseId(supabaseId) {
  const user = await db.select().from(users).where(eq(users.supabaseId, supabaseId)).limit(1)
  return user[0] || null
}

export async function createUser(userData) {
  const countResult = await db.select({ count: sql`COUNT(*)` }).from(users)
  const userCount = parseInt(countResult[0]?.count || 0) + 1
  const clientNumber = `PONIA-${String(userCount).padStart(4, '0')}`
  
  const result = await db.insert(users).values({
    email: userData.email,
    businessName: userData.businessName,
    businessType: userData.businessType,
    posSystem: userData.posSystem || null,
    plan: userData.plan || 'basique',
    clientNumber: clientNumber,
    referralCode: userData.referralCode,
    referredBy: userData.referredBy,
    supabaseId: userData.supabaseId,
    trialEndsAt: userData.trialEndsAt || null
  }).returning()
  return result[0]
}

export async function updateUser(userId, updates) {
  const updateData = { ...updates }
  delete updateData.id
  delete updateData.createdAt
  
  const result = await db.update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning()
  return result[0]
}

export async function createStore(storeData) {
  const result = await db.insert(stores).values({
    userId: storeData.userId,
    name: storeData.name,
    address: storeData.address || null,
    city: storeData.city || null,
    postalCode: storeData.postalCode || null,
    latitude: storeData.latitude || null,
    longitude: storeData.longitude || null,
    country: storeData.country || 'FR',
    isMain: storeData.isMain !== undefined ? storeData.isMain : true
  }).returning()
  return result[0]
}

export async function getMainStore(userId) {
  const store = await db.select()
    .from(stores)
    .where(and(
      eq(stores.userId, userId),
      eq(stores.isMain, true)
    ))
    .limit(1)
  return store[0] || null
}

export async function getProductsByUserId(userId) {
  return await db.select().from(products).where(eq(products.userId, userId))
}

export async function getProductById(productId) {
  const product = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  return product[0] || null
}

export async function createProduct(productData) {
  const result = await db.insert(products).values({
    userId: productData.userId,
    name: productData.name,
    category: productData.category || null,
    subcategory: productData.subcategory || null,
    barcode: productData.barcode || null,
    currentQuantity: productData.currentQuantity.toString(),
    unit: productData.unit,
    alertThreshold: productData.alertThreshold.toString(),
    supplier: productData.supplier || null,
    expiryDate: productData.expiryDate || null
  }).returning()
  return result[0]
}

export async function updateProduct(productId, updates) {
  const updateData = { ...updates }
  
  if (updateData.currentQuantity !== undefined) {
    updateData.currentQuantity = updateData.currentQuantity.toString()
  }
  if (updateData.alertThreshold !== undefined) {
    updateData.alertThreshold = updateData.alertThreshold.toString()
  }
  
  const result = await db.update(products)
    .set(updateData)
    .where(eq(products.id, productId))
    .returning()
  return result[0]
}

export async function deleteProduct(productId) {
  await db.delete(products).where(eq(products.id, productId))
}

export async function addStockMovement(productId, quantityChange, quantityAfter, changeType, notes = null) {
  const result = await db.insert(stockHistory).values({
    productId,
    quantityChange: quantityChange.toString(),
    quantityAfter: quantityAfter.toString(),
    changeType,
    notes
  }).returning()
  return result[0]
}

export async function getStockHistory(productId, limit = 100) {
  return await db.select()
    .from(stockHistory)
    .where(eq(stockHistory.productId, productId))
    .orderBy(desc(stockHistory.createdAt))
    .limit(limit)
}

export async function getAllStockHistory(userId, limit = 100) {
  const userProducts = await db.select({ id: products.id })
    .from(products)
    .where(eq(products.userId, userId))
  
  const productIds = userProducts.map(p => p.id)
  
  if (productIds.length === 0) {
    return []
  }
  
  return await db.select({
    id: stockHistory.id,
    productId: stockHistory.productId,
    productName: products.name,
    quantityChange: stockHistory.quantityChange,
    quantityAfter: stockHistory.quantityAfter,
    changeType: stockHistory.changeType,
    notes: stockHistory.notes,
    createdAt: stockHistory.createdAt
  })
    .from(stockHistory)
    .leftJoin(products, eq(stockHistory.productId, products.id))
    .where(eq(products.userId, userId))
    .orderBy(desc(stockHistory.createdAt))
    .limit(limit)
}

export async function createNotification(notificationData) {
  const result = await db.insert(notifications).values({
    userId: notificationData.userId,
    type: notificationData.type,
    productId: notificationData.productId || null,
    message: notificationData.message,
    sent: notificationData.sent || false,
    sentAt: notificationData.sentAt || null
  }).returning()
  return result[0]
}

export async function getPendingNotifications(userId) {
  return await db.select()
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.sent, false)
    ))
    .orderBy(desc(notifications.createdAt))
}

export async function markNotificationAsSent(notificationId) {
  const result = await db.update(notifications)
    .set({ sent: true, sentAt: new Date() })
    .where(eq(notifications.id, notificationId))
    .returning()
  return result[0]
}

export async function addSaleRecord(productId, userId, storeId, quantitySold, salePrice = null) {
  const saleDate = new Date()
  const dayOfWeek = saleDate.getDay()
  
  const result = await db.insert(salesHistory).values({
    productId,
    userId,
    storeId,
    quantitySold: Math.abs(quantitySold).toString(),
    salePrice: salePrice ? salePrice.toString() : null,
    saleDate,
    dayOfWeek
  }).returning()
  return result[0]
}

export async function getSalesHistory(productId, limit = 100) {
  return await db.select()
    .from(salesHistory)
    .where(eq(salesHistory.productId, productId))
    .orderBy(desc(salesHistory.saleDate))
    .limit(limit)
}

export async function getSalesByPeriod(userId, daysBack = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  
  return await db.select({
    id: salesHistory.id,
    productId: salesHistory.productId,
    productName: products.name,
    quantitySold: salesHistory.quantitySold,
    salePrice: salesHistory.salePrice,
    saleDate: salesHistory.saleDate,
    dayOfWeek: salesHistory.dayOfWeek
  })
    .from(salesHistory)
    .leftJoin(products, eq(salesHistory.productId, products.id))
    .where(and(
      eq(salesHistory.userId, userId),
      gte(salesHistory.saleDate, startDate)
    ))
    .orderBy(desc(salesHistory.saleDate))
}

export async function getSalesForProduct(productId, daysBack = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  
  return await db.select()
    .from(salesHistory)
    .where(and(
      eq(salesHistory.productId, productId),
      gte(salesHistory.saleDate, startDate)
    ))
    .orderBy(desc(salesHistory.saleDate))
}

export async function createConversation(userId, title = 'Nouvelle conversation') {
  const result = await db.insert(chatConversations).values({
    userId,
    title
  }).returning()
  return result[0]
}

export async function getConversations(userId, limit = 50) {
  return await db.select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, userId))
    .orderBy(desc(chatConversations.updatedAt))
    .limit(limit)
}

export async function getConversationById(conversationId) {
  const result = await db.select()
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1)
  return result[0] || null
}

export async function updateConversation(conversationId, updates) {
  const result = await db.update(chatConversations)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(chatConversations.id, conversationId))
    .returning()
  return result[0]
}

export async function deleteConversation(conversationId) {
  await db.delete(chatMessages).where(eq(chatMessages.conversationId, conversationId))
  await db.delete(chatConversations).where(eq(chatConversations.id, conversationId))
}

export async function createChatMessage(messageData) {
  const result = await db.insert(chatMessages).values({
    userId: messageData.userId,
    conversationId: messageData.conversationId || null,
    role: messageData.role,
    content: messageData.content
  }).returning()
  return result[0]
}

export async function getChatMessages(userId, limit = 100) {
  return await db.select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit)
}

export async function getMessagesByConversation(conversationId, limit = 100) {
  return await db.select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(chatMessages.createdAt)
    .limit(limit)
}

export async function deleteMessagesByConversation(conversationId) {
  await db.delete(chatMessages).where(eq(chatMessages.conversationId, conversationId))
}

export async function createPosConnection(connectionData) {
  const result = await db.insert(posConnections).values({
    userId: connectionData.userId,
    storeId: connectionData.storeId || null,
    provider: connectionData.provider,
    providerName: connectionData.providerName,
    connectionId: connectionData.connectionId || null,
    accessToken: connectionData.accessToken || null,
    refreshToken: connectionData.refreshToken || null,
    tokenExpiresAt: connectionData.tokenExpiresAt || null,
    status: connectionData.status || 'pending',
    syncEnabled: connectionData.syncEnabled !== false,
    metadata: connectionData.metadata ? JSON.stringify(connectionData.metadata) : null
  }).returning()
  return result[0]
}

export async function getPosConnectionsByUser(userId) {
  return await db.select()
    .from(posConnections)
    .where(eq(posConnections.userId, userId))
    .orderBy(desc(posConnections.createdAt))
}

export async function getPosConnectionById(connectionId) {
  const connection = await db.select()
    .from(posConnections)
    .where(eq(posConnections.id, connectionId))
    .limit(1)
  return connection[0] || null
}

export async function getPosConnectionByProvider(userId, provider) {
  const connection = await db.select()
    .from(posConnections)
    .where(and(
      eq(posConnections.userId, userId),
      eq(posConnections.provider, provider)
    ))
    .limit(1)
  return connection[0] || null
}

export async function updatePosConnection(connectionId, updates) {
  const updateData = { ...updates, updatedAt: new Date() }
  if (updateData.metadata && typeof updateData.metadata === 'object') {
    updateData.metadata = JSON.stringify(updateData.metadata)
  }
  
  const result = await db.update(posConnections)
    .set(updateData)
    .where(eq(posConnections.id, connectionId))
    .returning()
  return result[0]
}

export async function deletePosConnection(connectionId) {
  await db.delete(posConnections).where(eq(posConnections.id, connectionId))
}

export async function createPosProductMapping(mappingData) {
  const result = await db.insert(posProductMappings).values({
    posConnectionId: mappingData.posConnectionId,
    poniaProductId: mappingData.poniaProductId || null,
    posProductId: mappingData.posProductId,
    posProductName: mappingData.posProductName,
    posProductSku: mappingData.posProductSku || null,
    posProductPrice: mappingData.posProductPrice ? mappingData.posProductPrice.toString() : null,
    posProductCategory: mappingData.posProductCategory || null,
    isMapped: mappingData.isMapped || false,
    autoSync: mappingData.autoSync !== false
  }).returning()
  return result[0]
}

export async function getPosProductMappings(connectionId) {
  return await db.select()
    .from(posProductMappings)
    .where(eq(posProductMappings.posConnectionId, connectionId))
    .orderBy(posProductMappings.posProductName)
}

export async function updatePosProductMapping(mappingId, updates) {
  const updateData = { ...updates, updatedAt: new Date() }
  
  const result = await db.update(posProductMappings)
    .set(updateData)
    .where(eq(posProductMappings.id, mappingId))
    .returning()
  return result[0]
}

export async function createPosSale(saleData) {
  const result = await db.insert(posSales).values({
    posConnectionId: saleData.posConnectionId,
    userId: saleData.userId,
    storeId: saleData.storeId || null,
    posTransactionId: saleData.posTransactionId,
    posProductId: saleData.posProductId || null,
    poniaProductId: saleData.poniaProductId || null,
    quantity: saleData.quantity.toString(),
    unitPrice: saleData.unitPrice ? saleData.unitPrice.toString() : null,
    totalPrice: saleData.totalPrice ? saleData.totalPrice.toString() : null,
    saleDate: saleData.saleDate || new Date(),
    paymentMethod: saleData.paymentMethod || null,
    processed: saleData.processed || false
  }).returning()
  return result[0]
}

export async function getUnprocessedPosSales(connectionId) {
  return await db.select()
    .from(posSales)
    .where(and(
      eq(posSales.posConnectionId, connectionId),
      eq(posSales.processed, false)
    ))
    .orderBy(posSales.saleDate)
}

export async function markPosSaleProcessed(saleId) {
  const result = await db.update(posSales)
    .set({ processed: true, processedAt: new Date() })
    .where(eq(posSales.id, saleId))
    .returning()
  return result[0]
}

export async function createPosSyncLog(logData) {
  const result = await db.insert(posSyncLogs).values({
    posConnectionId: logData.posConnectionId,
    syncType: logData.syncType,
    status: logData.status,
    itemsProcessed: logData.itemsProcessed || 0,
    itemsFailed: logData.itemsFailed || 0,
    errorMessage: logData.errorMessage || null
  }).returning()
  return result[0]
}

export async function updatePosSyncLog(logId, updates) {
  const result = await db.update(posSyncLogs)
    .set(updates)
    .where(eq(posSyncLogs.id, logId))
    .returning()
  return result[0]
}

export async function getPosSyncLogs(connectionId, limit = 20) {
  return await db.select()
    .from(posSyncLogs)
    .where(eq(posSyncLogs.posConnectionId, connectionId))
    .orderBy(desc(posSyncLogs.startedAt))
    .limit(limit)
}

export async function getAlertPreferences(userId) {
  const prefs = await db.select()
    .from(alertPreferences)
    .where(eq(alertPreferences.userId, userId))
    .limit(1)
  return prefs[0] || null
}

export async function createAlertPreferences(userId) {
  const result = await db.insert(alertPreferences).values({
    userId: userId
  }).returning()
  return result[0]
}

export async function updateAlertPreferences(userId, updates) {
  const existing = await getAlertPreferences(userId)
  
  if (!existing) {
    const result = await db.insert(alertPreferences).values({
      userId: userId,
      ...updates,
      updatedAt: new Date()
    }).returning()
    return result[0]
  }
  
  const result = await db.update(alertPreferences)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(alertPreferences.userId, userId))
    .returning()
  return result[0]
}

export async function getUsersForAlerts() {
  const allUsers = await db.select({
    user: users,
    prefs: alertPreferences
  })
    .from(users)
    .leftJoin(alertPreferences, eq(users.id, alertPreferences.userId))
  
  return allUsers.filter(u => {
    if (!u.prefs) return true
    return u.prefs.emailAlertsEnabled !== false
  })
}

export async function getLowStockProducts(userId) {
  const allProducts = await db.select()
    .from(products)
    .where(eq(products.userId, userId))
  
  return allProducts.filter(p => {
    const current = parseFloat(p.currentQuantity) || 0
    const threshold = parseFloat(p.alertThreshold) || 10
    return current <= threshold
  })
}

export async function getExpiringProducts(userId, daysThreshold = 3) {
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + daysThreshold)
  
  const allProducts = await db.select()
    .from(products)
    .where(eq(products.userId, userId))
  
  return allProducts.filter(p => {
    if (!p.expiryDate) return false
    const expiryDate = new Date(p.expiryDate)
    return expiryDate <= futureDate && expiryDate >= today
  })
}

export async function createEmailLog(logData) {
  const result = await db.insert(emailLogs).values({
    userId: logData.userId,
    emailType: logData.emailType,
    recipientEmail: logData.recipientEmail,
    subject: logData.subject,
    status: logData.status || 'sent',
    messageId: logData.messageId,
    errorMessage: logData.errorMessage,
    productIds: logData.productIds ? JSON.stringify(logData.productIds) : null
  }).returning()
  return result[0]
}

export async function getEmailLogs(userId, limit = 50) {
  return await db.select()
    .from(emailLogs)
    .where(eq(emailLogs.userId, userId))
    .orderBy(desc(emailLogs.sentAt))
    .limit(limit)
}

export async function getAllUsers() {
  return await db.select().from(users)
}
