# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system for small businesses in France (bakeries, restaurants, bars, wine cellars, etc.). It provides a mobile-first application for real-time inventory tracking, low-stock alerts, AI-optimized order suggestions, and aims to reduce waste and prevent stockouts. The project targets €4,000-6,000 MRR post-launch by serving 51-76 clients with a three-tier pricing model: Basique (€0/month), Standard (€49/month), and Pro (€69.99/month). The core ambition is to offer a simple, fast, and mobile-first solution to a significant daily problem for small businesses.

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

## Recent Changes (Nov 08, 2025)

### ✅ Major UI/UX Restructure - Mobile-First Navigation (Latest)
*   **Navigation Component** - New horizontal navigation bar with categories: Dashboard | Stocks | Insights IA | Historique | Paramètres
    → Mobile-responsive with CSS media queries (icons-only on ≤640px screens)
    → Sticky navigation at top with active state highlighting
*   **DashboardPage Simplified** - Now KPIs-only view:
    → Displays Total produits, Rupture imminente, Stock faible, Stock optimal metrics
    → AIInsights panel with AI-powered suggestions
    → Active Alerts sidebar for critical/low stock warnings
    → Removed weather/events widgets (moved to InsightsPage)
    → Removed product management UI (moved to StockPage)
*   **StockPage Created** - Dedicated product management page:
    → Complete CRUD operations (add, update quantity, delete products)
    → Visual stock indicators (🔴 Critique, 🟠 Faible, ✅ Optimal)
    → Product quota enforcement (Basique: 10, Standard: 50, Pro: unlimited)
    → Includes ChatAI integration for voice/text inventory updates
*   **InsightsPage Created** - AI analysis hub:
    → WeatherWidget showing temperature/humidity with AI analysis
    → EventsWidget displaying Google Calendar events
    → ChatAI for natural language inventory queries
    → Contextual AI predictions based on weather + events data
*   **Architecture Improvements:**
    → Separation of concerns: DashboardPage (read-only KPIs) vs StockPage (product mutations)
    → No code duplication between pages
    → Proper responsive design without window.innerWidth inline rendering
    → All routes configured in App.jsx (/dashboard, /stock, /insights, /history, /settings)

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