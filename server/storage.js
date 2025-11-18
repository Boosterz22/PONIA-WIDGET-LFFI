import { db } from './db.js'
import { users, products, stockHistory, salesHistory, notifications, stores } from '../shared/schema.js'
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
