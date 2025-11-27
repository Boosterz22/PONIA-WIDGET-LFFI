# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system designed for small businesses in France, such as bakeries, restaurants, bars, and wine cellars. Its primary purpose is to provide a mobile-first application for real-time inventory tracking, intelligent low-stock alerts, and AI-optimized order suggestions. The system aims to significantly reduce waste and prevent stockouts, thereby increasing efficiency and profitability for its users. The project targets an ambitious monthly recurring revenue (MRR) of €4,000-€6,000 by serving 51-76 clients across tiered pricing plans (Basique, Standard, Pro).

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- **AI Omnipresence:** AI must be visible and sophisticated immediately at dashboard opening (strategic differentiation vs competitors like SumUp)
- **Time Savings Focus:** Core value proposition is "Time = money" - PONIA must prove it saves merchants 7+ hours/week
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## Recent Changes (November 27, 2025)

### Phase 2B: Direct POS Integrations (Self-Service)

**STRATEGIC PIVOT**: Abandoned Chift unified API (required commercial meetings/partnerships incompatible with bootstrapped MVP launch) in favor of direct self-service POS integrations.

1. **Modular Adapter Architecture** (`server/pos-adapters/`)
   - `base.js` - Abstract base class defining interface: authenticate, getProducts, getSales, setupWebhook, getDemoProducts
   - `index.js` - Factory pattern with getAdapter(), isDemoMode(), getSupportedProviders(), isProviderSupported()
   - Each adapter implements OAuth or API key authentication with demo mode fallback

2. **6 Operational POS Adapters** (covering ~80% French TPE market)
   - `square.js` - Square (OAuth, catalog, orders, webhooks) - All business types
   - `zettle.js` - Zettle/PayPal (OAuth, products, inventory) - Mobile/PopUp
   - `hiboutik.js` - Hiboutik (API Key auth, products, sales) - French retail specialty
   - `sumup.js` - SumUp/Tiller (OAuth, POS Pro V3 API) - Restaurants/Bars
   - `lightspeed-x.js` - Lightspeed X-Series (OAuth/Vend API) - Retail
   - `lightspeed-k.js` - Lightspeed K-Series (OAuth) - Restaurants

3. **Updated IntegrationsPage** (`src/pages/IntegrationsPage.jsx`)
   - Premium UI displaying only 6 operational POS systems
   - No category filter (all 6 systems visible)
   - Setup instructions with links to developer consoles
   - Demo mode with realistic products per POS type

4. **API Endpoints** (`server/index.js`)
   - `GET /api/integrations/providers` - List supported POS systems
   - `GET /api/integrations/connections` - User's POS connections
   - `POST /api/integrations/connect` - Initiate OAuth or API key auth
   - `GET /api/pos/callback/:provider` - Provider-specific OAuth callback
   - `DELETE /api/integrations/connections/:id` - Disconnect POS
   - `POST /api/integrations/sync/:id` - Sync products (demo or real)

5. **Key Design Decisions**
   - All 6 POS systems have self-service developer signup (no sales meetings required)
   - Demo mode auto-activates when env vars not configured
   - Each adapter generates realistic demo products for its business type
   - Modular pattern allows easy addition of new POS systems

### Previous: Phase 2A (Deprecated)

*Chift unified API integration was abandoned due to requirement for commercial partnerships.*

### Phase 1: AI Omnipresence & Time Savings Implementation (November 18, 2025)

1. **ChatAICentral Component** (`src/components/ChatAICentral.jsx`)
   - Primary dashboard interface replacing traditional KPI-first layout
   - Suggested questions for immediate engagement
   - Premium UI with gradient header and conversational design
   - Voice assistant button (placeholder for future feature)

2. **TimeSavedWidget Component** (`src/components/TimeSavedWidget.jsx`)
   - Displays weekly/monthly time savings in hours and €
   - Shows CA optimized, stockouts avoided, and waste saved metrics
   - Dark theme with gold accents for visual prominence
   - Reinforces ROI and "time = money" value proposition

3. **OrderOptionsModal Component** (`src/components/OrderOptionsModal.jsx`)
   - Enhanced order generation with three delivery options:
     - PDF download
     - WhatsApp copy (formatted message)
     - Email send (planned)
   - Emphasizes 50+ minute time savings in UI
   - Modern modal design with action feedback

4. **Multi-language System**
   - `LanguageContext` (`src/contexts/LanguageContext.jsx`): Context provider for app-wide translations
   - `translations.js` (`src/i18n/translations.js`): Translation keys for 6 languages
   - `LanguageSelector` (`src/components/LanguageSelector.jsx`): Dropdown selector in navigation
   - Supports: French, English, Spanish, Arabic, German, Chinese
   - Automatic persistence in localStorage

5. **DashboardPage Restructure** (`src/pages/DashboardPage.jsx`)
   - ChatAICentral now appears first (AI-first interface)
   - TimeSavedWidget prominently displayed second
   - Traditional KPIs moved below to reinforce AI priority

6. **Bug Fixes**
   - Fixed port conflict in `start.sh` by adding process cleanup
   - Fixed JSX closing tag in Navigation component

## System Architecture

PONIA AI is a secure full-stack application utilizing a client-server architecture. The backend is built with Express.js (Node.js), and the frontend is developed using React 18 with Vite 5. Data persistence is handled by PostgreSQL, managed through Drizzle ORM. User authentication is powered by Supabase.

**Key Architectural Decisions and Features:**

*   **Security:** OpenAI API calls are proxied server-side via the Express backend to protect API keys. JWT authentication secures all protected API endpoints.
*   **AI Functionality:** A hybrid AI approach combines a local rules engine for immediate predictions (stockout, overstock, health score) with OpenAI's GPT-4o-mini (accessed via Replit AI Integrations) for advanced predictions (7-day for Standard, 30-day for Pro), expiry tracking, and intelligent order generation.
*   **User Interface (UI/UX):** The design prioritizes a mobile-first, simple, and fast user experience, tailored for non-tech-savvy merchants.
    *   **Dashboard:** Features a modern layout with AI-first interface, showcasing Chat AI Central as the primary interaction point, Time Saved widget highlighting merchant value, and KPI grids with active alerts.
    *   **Chat AI Central:** NEW - Main dashboard interface featuring conversational AI with suggested questions, making AI omnipresent and immediately visible upon login.
    *   **Time Saved Widget:** NEW - Displays weekly/monthly time savings and monetary value (€) to prove ROI and reinforce the "time = money" value proposition.
    *   **Multi-language Support:** NEW - Complete i18n system supporting 6 languages (French, English, Spanish, Arabic, German, Chinese) with LanguageContext and LanguageSelector component.
    *   **Smart Order Generation:** NEW - Enhanced order modal (OrderOptionsModal) with PDF download, WhatsApp copy, and email options, emphasizing 50+ minute time savings.
    *   **Stock Management:** Offers a visual, color-coded product display with quick adjustment capabilities and integrated AI insights.
    *   **Chat AI:** Provides both a floating conversational AI and central dashboard interface for inventory-related queries.
    *   **Product & Supplier Management:** Simplified forms for efficient data entry.
    *   **Navigation:** Professional horizontal navigation with language selector and comprehensive dropdown menu.
*   **Core Technical Implementations:**
    *   **Authentication & Subscription Management:** Email-based registration with Supabase, supporting a three-tier pricing model and a 14-day free trial. Integrates Stripe for secure subscription handling.
    *   **AI-Powered Order Generation:** Automated generation of intelligent purchase orders in PDF format using GPT-4o-mini.
    *   **Expiry Alerts:** AI-driven tracking of product expiration dates with proactive suggestions.
    *   **Multi-store Support:** The database schema is designed to support multiple store locations per user.
    *   **Admin Dashboard:** Provides tools for user management, real-time statistics, and CSV export, secured by an admin email whitelist.
    *   **Geolocation & Address Autocomplete:** Integration with API Adresse (Base Adresse Nationale - BAN) for intelligent address autocomplete, including automatic capture of GPS coordinates for stores. Event filtering based on geographical proximity (5km radius).
    *   **Optimistic UI Updates:** Stock management interface uses optimistic updates for instant responsiveness.

## External Dependencies

*   **Backend:** Express, OpenAI SDK (GPT-4o-mini)
*   **Frontend:** React, Vite, React Router DOM, Recharts, Lucide React
*   **Database:** PostgreSQL, Drizzle ORM, Supabase client
*   **Weather:** OpenWeatherMap API
*   **Calendar:** Google Calendar API
*   **Payments:** Stripe
*   **POS Integrations:** Direct adapters for 6 self-service POS systems (Square, Zettle, Hiboutik, SumUp, Lightspeed X-Series, Lightspeed K-Series)
*   **Address API:** API Adresse (Base Adresse Nationale - BAN, gouvernement français)

## POS Integration Architecture

PONIA uses a modular adapter pattern with direct self-service POS integrations (no commercial partnerships required):

**Supported POS Systems (6 operational - covering ~80% French TPE market):**
- **Square** - All business types (OAuth, catalog API, orders API, webhooks)
- **Zettle (PayPal)** - Mobile/PopUp (OAuth, products, inventory)
- **Hiboutik** - French retail specialty (API Key auth, products, sales)
- **SumUp/Tiller** - Restaurants/Bars (OAuth, POS Pro V3 API)
- **Lightspeed X-Series** - Retail (OAuth via Vend API)
- **Lightspeed K-Series** - Restaurants (OAuth)

**Adapter Architecture:**
- Base abstract class (`server/pos-adapters/base.js`) defines interface
- Each POS has dedicated adapter with OAuth/API key auth
- Factory pattern (`getAdapter()`) returns correct adapter by provider name
- Demo mode auto-activates when env vars not configured

**Integration Flow:**
1. User selects their POS from the Integrations page (only 6 shown)
2. OAuth 2.0 or API key authentication directly with POS provider
3. Products are synced from POS to PONIA via adapter
4. User maps POS products to PONIA products
5. Real-time webhook updates stock when sales occur

**Demo Mode:**
When provider-specific env vars are not configured, each adapter returns realistic demo products matching that POS type (bakery, restaurant, retail, bar products).