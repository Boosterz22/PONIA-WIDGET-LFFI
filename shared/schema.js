import { pgTable, serial, varchar, integer, timestamp, decimal, text, boolean } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  businessName: varchar('business_name', { length: 255 }),
  businessType: varchar('business_type', { length: 100 }),
  posSystem: varchar('pos_system', { length: 100 }),
  plan: varchar('plan', { length: 50 }).default('basique'),
  clientNumber: varchar('client_number', { length: 20 }),
  referralCode: varchar('referral_code', { length: 20 }),
  referredBy: varchar('referred_by', { length: 20 }),
  supabaseId: varchar('supabase_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('inactive'),
  trialEndsAt: timestamp('trial_ends_at'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  createdAt: timestamp('created_at').defaultNow()
})

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  country: varchar('country', { length: 50 }).default('FR'),
  isMain: boolean('is_main').default(false),
  createdAt: timestamp('created_at').defaultNow()
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').references(() => stores.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  subcategory: varchar('subcategory', { length: 100 }),
  barcode: varchar('barcode', { length: 100 }),
  currentQuantity: decimal('current_quantity', { precision: 10, scale: 2 }).notNull().default('0'),
  unit: varchar('unit', { length: 50 }).notNull(),
  alertThreshold: decimal('alert_threshold', { precision: 10, scale: 2 }).notNull(),
  supplier: varchar('supplier', { length: 255 }),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const stockHistory = pgTable('stock_history', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  quantityChange: decimal('quantity_change', { precision: 10, scale: 2 }).notNull(),
  quantityAfter: decimal('quantity_after', { precision: 10, scale: 2 }).notNull(),
  changeType: varchar('change_type', { length: 50 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
})

export const salesHistory = pgTable('sales_history', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').references(() => stores.id, { onDelete: 'cascade' }),
  quantitySold: decimal('quantity_sold', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  saleDate: timestamp('sale_date').notNull().defaultNow(),
  dayOfWeek: integer('day_of_week').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  sent: boolean('sent').notNull().default(false),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const chatConversations = pgTable('chat_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).default('Nouvelle conversation'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  conversationId: integer('conversation_id').references(() => chatConversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const posConnections = pgTable('pos_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').references(() => stores.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerName: varchar('provider_name', { length: 100 }).notNull(),
  connectionId: varchar('connection_id', { length: 255 }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  status: varchar('status', { length: 50 }).default('pending'),
  lastSyncAt: timestamp('last_sync_at'),
  syncEnabled: boolean('sync_enabled').default(true),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const posProductMappings = pgTable('pos_product_mappings', {
  id: serial('id').primaryKey(),
  posConnectionId: integer('pos_connection_id').notNull().references(() => posConnections.id, { onDelete: 'cascade' }),
  poniaProductId: integer('ponia_product_id').references(() => products.id, { onDelete: 'cascade' }),
  posProductId: varchar('pos_product_id', { length: 255 }).notNull(),
  posProductName: varchar('pos_product_name', { length: 255 }).notNull(),
  posProductSku: varchar('pos_product_sku', { length: 100 }),
  posProductPrice: decimal('pos_product_price', { precision: 10, scale: 2 }),
  posProductCategory: varchar('pos_product_category', { length: 255 }),
  isMapped: boolean('is_mapped').default(false),
  autoSync: boolean('auto_sync').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const posSales = pgTable('pos_sales', {
  id: serial('id').primaryKey(),
  posConnectionId: integer('pos_connection_id').notNull().references(() => posConnections.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').references(() => stores.id, { onDelete: 'cascade' }),
  posTransactionId: varchar('pos_transaction_id', { length: 255 }).notNull(),
  posProductId: varchar('pos_product_id', { length: 255 }),
  poniaProductId: integer('ponia_product_id').references(() => products.id, { onDelete: 'set null' }),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  saleDate: timestamp('sale_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  processed: boolean('processed').default(false),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const posSyncLogs = pgTable('pos_sync_logs', {
  id: serial('id').primaryKey(),
  posConnectionId: integer('pos_connection_id').notNull().references(() => posConnections.id, { onDelete: 'cascade' }),
  syncType: varchar('sync_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  itemsProcessed: integer('items_processed').default(0),
  itemsFailed: integer('items_failed').default(0),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at')
})

export const alertPreferences = pgTable('alert_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  emailAlertsEnabled: boolean('email_alerts_enabled').default(true),
  lowStockAlerts: boolean('low_stock_alerts').default(true),
  expiryAlerts: boolean('expiry_alerts').default(true),
  expiryDaysThreshold: integer('expiry_days_threshold').default(3),
  alertFrequency: varchar('alert_frequency', { length: 20 }).default('daily'),
  alertTime: varchar('alert_time', { length: 10 }).default('08:00'),
  lastLowStockAlertAt: timestamp('last_low_stock_alert_at'),
  lastExpiryAlertAt: timestamp('last_expiry_alert_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  emailType: varchar('email_type', { length: 50 }).notNull(),
  recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  status: varchar('status', { length: 20 }).default('sent'),
  messageId: varchar('message_id', { length: 255 }),
  errorMessage: text('error_message'),
  productIds: text('product_ids'),
  sentAt: timestamp('sent_at').notNull().defaultNow()
})

export const aiSuggestions = pgTable('ai_suggestions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  priority: varchar('priority', { length: 20 }).notNull().default('info'),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  actionType: varchar('action_type', { length: 50 }),
  actionData: text('action_data'),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  contentHash: varchar('content_hash', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const aiSuggestionEvents = pgTable('ai_suggestion_events', {
  id: serial('id').primaryKey(),
  suggestionId: integer('suggestion_id').notNull().references(() => aiSuggestions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 20 }).notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const userSuggestionPreferences = pgTable('user_suggestion_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  popupFrequencyMinutes: integer('popup_frequency_minutes').notNull().default(120),
  lastPopupAt: timestamp('last_popup_at'),
  engagementScore: integer('engagement_score').notNull().default(0),
  lastEngagementResetAt: timestamp('last_engagement_reset_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  partnerType: varchar('partner_type', { length: 50 }).notNull().default('comptable'),
  commissionRate: integer('commission_rate').notNull().default(50),
  estimatedClients: integer('estimated_clients'),
  referralCode: varchar('referral_code', { length: 20 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  notes: text('notes'),
  totalReferrals: integer('total_referrals').default(0),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0'),
  totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
