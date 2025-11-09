# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system for small businesses in France (bakeries, restaurants, bars, wine cellars, etc.). It provides a mobile-first application for real-time inventory tracking, low-stock alerts, AI-optimized order suggestions, and aims to reduce waste and prevent stockouts. The project targets €4,000-6,000 MRR post-launch by serving 51-76 clients with a three-tier pricing model: Basique (€0/month), Standard (€49/month), and Pro (€69/month). The core ambition is to offer a simple, fast, and mobile-first solution to a significant daily problem for small businesses.

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## System Architecture

PONIA AI is a secure full-stack application featuring an Express backend (Node.js) and a React 18 frontend (Vite 5). It uses a client-server pattern with the frontend on port 5000 and the backend on port 3000. Data is stored in PostgreSQL via Drizzle ORM, and Supabase handles authentication.

**Security Architecture:**
- All OpenAI API calls are handled server-side via the Express backend to protect AI integration keys.
- The frontend proxies `/api/*` requests to the backend.
- Deployment is managed via a `start.sh` script.

The core AI functionality uses a hybrid architecture combining a local rules engine with OpenAI's GPT-4o-mini (via Replit AI Integrations) for tiered AI predictions and advanced features.

**Key Features and Implementations:**

*   **Landing Page:** Professional marketing focus with problem/solution, ROI, testimonials, FAQ, CTAs, and sticky navigation.
*   **Authentication & Plans:** Email-based registration for 9 business types, supporting a three-tier pricing model with varying product limits, AI capabilities, and support. Includes a referral code system.
*   **Stock Management:**
    *   **Visual Stock:** Color-coded products (Green, Orange, Red) with quick adjustment buttons.
    *   **AI Predictive Engine:** Hybrid system with a local rules engine for instant predictions (stockout, overstock, health score) and GPT-4o-mini for tiered predictions (7-day for Standard, 30-day for Pro) and advanced suggestions (expiry, voice commands).
    *   **Expiry Alerts:** Tracks product expiration dates with visual urgency and AI-generated suggestions for action.
    *   **Voice Commands:** Hands-free stock adjustments using Web Speech API, with local regex parsing and GPT-4o-mini as a fallback.
*   **Dashboard:** Modern layout inspired by Stripe/Linear, featuring a KPI grid, AI Insights, and an Active Alerts sidebar.
*   **Chat AI:** Floating conversational AI for natural language queries about inventory, providing context-aware responses.
*   **AI-Powered Order Generation:** Automated intelligent purchase order generation (.txt format) via a dedicated backend endpoint (`/api/generate-order`) using GPT-4o-mini, including smart calculations, supplier grouping, and professional formatting.
*   **Product Management:** Simple forms for adding products with name, quantity, unit, alert threshold, and supplier, supporting 6 units and pre-configured templates.
*   **UI/UX:** Emphasizes simplicity, speed, mobile-first design, dynamic scores, and contextual messages.
*   **Security & Performance:** Dynamic imports, timeouts for AI calls, Web Speech API cleanup, and permission management. Prioritizes local parsing for efficiency.

**System Design Choices:**

*   **Backend (server/):** Express server with REST API endpoints for chat, order generation, products, users, stock history, weather, and health. Uses `storage.js` for database operations and `db.js` for Drizzle client.
*   **Database (shared/):** `schema.js` defines Drizzle ORM schema for users, products, stockHistory, and notifications.
*   **Frontend Services:** Dedicated services for AI utilities, voice parsing, expiry tracking, rules engine, AI service integration, PDF generation, weather, and Supabase interaction.
*   **Components/Pages:** Modular component-based architecture for UI elements and distinct pages (e.g., LandingPage, DashboardPage, StockPage).
*   **Configuration:** `vite.config.js` for frontend proxying, `start.sh` for orchestration, and `drizzle.config.js` for database migrations.

## External Dependencies

*   **Backend:** Express, OpenAI SDK (GPT-4o-mini)
*   **Frontend:** React, Vite, React Router DOM, Recharts, Lucide React
*   **Speech Recognition:** Web Speech API
*   **Database:** PostgreSQL, Drizzle ORM, Supabase client
*   **Weather:** OpenWeatherMap API (✅ CONFIGURED - API key in secrets)
*   **Calendar:** Google Calendar API (✅ INTEGRATED - connection:conn_google-calendar_01K9HDYE51T3DR8T6KJKM5YFM0)
*   **Payments (In Progress):** Stripe
*   **Email (Pending):** Resend integration dismissed - can configure later with API key
*   **POS Integrations (Planned):** Square API, Lightspeed

## Recent Changes (Nov 09, 2025)

### ✅ Stripe Integration & Free Trial System (Latest - PRODUCTION READY)
*   **Stripe Payment Integration Complete** - Full subscription billing with Stripe
    → Backend endpoints: `/api/stripe/create-checkout` for subscription upgrades
    → Stripe webhook handler at `/api/stripe/webhook` for subscription events (positioned BEFORE express.json() to preserve raw body)
    → Automatic customer creation and subscription tracking in database with poniaUserId metadata
    → Two subscription tiers: Standard (€49/mois), Pro (€69/mois)
*   **14-Day Free Trial Automated** - Every new user automatically gets 14-day trial
    → `trialEndsAt` field set automatically on signup (users/sync endpoint with JWT verification)
    → TrialBanner component shows days remaining with urgency colors
    → TrialExpiredBlocker component blocks access after trial expiration
    → useTrialCheck custom hook validates trial status across app
    → **Server-side trial enforcement** via `enforceTrialStatus` middleware on ALL premium endpoints
*   **Admin Dashboard** - Complete user management interface at `/admin`
    → View all registered users with email, business type, plan status
    → Real-time stats: total users, active trials, paid users, MRR
    → Trial status tracking (days remaining, expired)
    → Export to CSV functionality for user data
    → Revenue calculation (Standard = €49, Pro = €69)
    → **Secured via requireAdmin middleware** checking ADMIN_EMAILS environment variable
*   **Upgrade Flow** - Seamless payment experience
    → New `/upgrade` page with plan comparison cards
    → Integration with Stripe Checkout (redirect to secure payment)
    → Success/cancel URLs for post-payment handling
    → Webhook updates user plan & subscription status automatically
*   **🔒 CRITICAL SECURITY HARDENING (Architect Validated)**
    → **Stripe webhook** positioned correctly to preserve raw body for signature verification
    → **Trial enforcement** applied server-side to ALL premium endpoints (impossible to bypass)
    → **Data exfiltration endpoints REMOVED** (GET /api/users/email, GET /api/users/supabase, POST /api/users)
    → **Sync endpoint secured** with JWT verification + supabaseId match check
    → **Paywall bypass blocked** - PUT /api/users/plan disabled in production (requires ENABLE_TEST_MODE=true in dev)
    → **Admin access** controlled via ADMIN_EMAILS env variable (comma-separated list)
    → **All endpoints authenticated** via JWT token with `authenticateSupabaseUser` middleware
    → **Production-ready** - Zero security vulnerabilities found by architect review

## Recent Changes (Nov 08, 2025)

### ✅ CRITICAL: Complete Security Overhaul - JWT Authentication (Latest)
*   **Products now persist to PostgreSQL** - Removed localStorage, all data saved to database via API
*   **Server-side JWT verification** - New `authenticateSupabaseUser` middleware validates every request
    → Extracts `req.supabaseUserId` from verified Supabase JWT token
    → No client-supplied user IDs trusted - prevents user impersonation attacks
*   **All endpoints secured** - Every protected endpoint now requires `Authorization: Bearer <token>`
    → GET/POST/PUT/DELETE /api/products (authenticated)
    → GET /api/stock-history (authenticated)
    → GET /api/users/me (authenticated)
    → PUT /api/users/business (authenticated)
*   **Legacy insecure endpoints REMOVED** - Deleted unauthenticated routes that allowed data exfiltration
    → REMOVED: GET /api/products/:userId
    → REMOVED: GET /api/stock-history/:userId
*   **Frontend security** - All pages (StockPage, DashboardPage, AnalyticsPage, SettingsPage) use authenticated API
*   **Business name editable** - Users can now change their commerce name/type in SettingsPage
*   **Referral code tracking** - Added referredBy field during signup in CompleteProfilePage
*   **Architect approved** - Production-ready with zero security vulnerabilities

### ✅ Complete UI/UX Overhaul - Final Version
*   **Navigation professionnelle** - Barre horizontale avec type de commerce à gauche + icône profil à droite
    → Menu dropdown complet : Mon Profil, Parrainage, Paramètres, Contact, Déconnexion
    → Affiche le type de commerce (Boulangerie, Restaurant, etc.) au lieu de "PONIA AI"
    → Mobile-responsive avec CSS media queries (icônes-only sur ≤640px)
*   **Chat AI en barre fixe** - Remplace le bouton flottant
    → Barre fixe en bas de l'écran avec champ de saisie permanent
    → Historique expandable/collapsible avec ChevronUp/ChevronDown
    → Plus d'espace utilisable dans les pages
*   **Page Paramètres complète** - Tout en un seul endroit
    → Plan actuel avec upgrade button (Basique/Standard/Pro)
    → Gestion email (modification avec validation Supabase)
    → Changement mot de passe (validation 6+ caractères)
    → Informations commerce (lecture seule)
    → Zone danger (suppression compte)
*   **Page Parrainage dédiée** - Programme complet
    → Explication step-by-step du système
    → Statistiques : filleuls inscrits, gains totaux, revenu par parrainage
    → Lien de parrainage copyable avec code unique
    → Design engageant avec gradient doré PONIA
*   **DashboardPage nettoyé** - Plus de barre secondaire
    → Supprimé l'ancienne nav avec logo PONIA AI
    → Chat AI intégré en bas de page
    → Focus sur KPIs + Insights uniquement
*   **Routes App.jsx** - Ajout /settings et /referral avec auth gate

### ✅ Intégrations Externes Complétées
*   **Weather API (OpenWeatherMap)** - AI analyzes temperature/humidity for stock predictions
*   **Google Calendar API** - Fetches local events to anticipate demand spikes  
    → Connection ID: `connection:conn_google-calendar_01K9HDYE51T3DR8T6KJKM5YFM0`
*   **AI Context Enrichment** - Chat AI now considers weather + events in predictions
    → Backend endpoint `/api/events` for local events
    → Weather data integrated in `buildStockContext()` function

### ✅ Database Schema Updates
*   **Multi-stores support** - New `stores` table with userId, name, address, city, isMain
*   **Stripe fields prepared** - Added stripeCustomerId, stripeSubscriptionId, subscriptionStatus, trialEndsAt to users table
*   **Products linked to stores** - Added storeId foreign key to products table
*   Database pushed successfully with `npm run db:push --force`

### 🔄 Pending Tasks (On Hold)
*   Email notifications (Resend integration dismissed - can be configured later with API key)
*   Stripe payment integration (User requested to skip for now)
*   Multi-store UI implementation (database ready, UI pending)