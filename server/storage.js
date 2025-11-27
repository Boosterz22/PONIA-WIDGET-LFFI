import { db } from './db.js'
import { users, products, stockHistory, salesHistory, notifications, stores, chatMessages, posConnections, posProductMappings, posSales, posSyncLogs } from '../shared/schema.js'
import { eq, and, desc, gte, sql } from 'drizzle-orm'

export async function getUserByEmail(email) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user[0] || null
}

export async function getUserBySupabaseId(supabaseId) {
  const user = await db.select().from(users).where(eq(users.supabaseId, supabaseId)).limit(1)
  return user[0] || null
}

export async function createUser(userData) {
  const result = await db.insert(users).values({
    email: userData.email,
    businessName: userData.businessName,
    businessType: userData.businessType,
    posSystem: userData.posSystem || null,
    plan: userData.plan || 'basique',
    referralCode: userData.referralCode,
    referredBy: userData.referredBy,
    supabaseId: userData.supabaseId
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

export async function createChatMessage(messageData) {
  const result = await db.insert(chatMessages).values({
    userId: messageData.userId,
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
