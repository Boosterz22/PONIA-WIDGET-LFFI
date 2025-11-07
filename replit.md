# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system designed for small businesses in France (bakeries, restaurants, bars, wine cellars, etc.). The project aims to provide a mobile-first application that helps merchants track inventory in real-time, receive low-stock alerts, get AI-optimized order suggestions, and reduce waste while preventing stockouts. The business vision is to achieve €4,000-6,000 MRR within 2-3 months post-launch by serving 51-76 clients with a three-tier pricing strategy: Basique (€0/month), Standard (€49/month), and Pro (€69.99/month). The market validation revealed that inventory management is a significant daily problem for small businesses, and PONIA AI offers a simple, fast, and mobile-first solution at an accessible price point compared to complex existing ERP systems.

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## System Architecture

The PONIA AI system is a **secure full-stack application** with an Express backend (Node.js) and React 18 frontend (Vite 5). The architecture follows a client-server pattern where the frontend runs on port 5000 and proxies API calls to the backend on port 3000. Routing is handled by React Router DOM, and styling employs custom CSS. Icons are provided by Lucide React. Data storage currently uses LocalStorage, with a planned migration to PostgreSQL via Supabase. 

**Security Architecture:**
- **Backend (Express, port 3000):** Securely handles all OpenAI API calls server-side, protecting AI integration keys that are never exposed to the browser
- **Frontend (Vite, port 5000):** Proxies `/api/*` requests to backend via Vite proxy configuration
- **AI Integration:** OpenAI GPT-4o-mini credentials (`AI_INTEGRATIONS_OPENAI_*`) remain server-side only
- **Deployment:** Managed via `start.sh` script that launches backend and frontend simultaneously

The core AI functionality leverages a hybrid architecture combining a local rules engine with OpenAI's GPT-4o-mini via Replit AI Integrations (server-side).

**Key Features and Implementations:**

*   **Landing Page:** Features a professional marketing approach with a clear problem-solution narrative, ROI statistics, before/after comparisons, customer testimonials, a comprehensive FAQ, and contextual CTAs, including an authentic urgency offer for early adopters. Smart sticky navigation with scroll listener that hides the CTA button when users reach the pricing section for better UX. All signup links open in new tabs (target="_blank") for smooth navigation.
*   **Authentication & Plans:** Simplified email-based registration supporting 9 business types. Implements a three-tier pricing model:
    *   **Basique (€0/month):** 10 products max, basic AI (health score only), 20 actions/day, 5 voice commands/day, email support
    *   **Standard (€49/month):** 100 products, 7-day AI predictions, unlimited actions, 50 voice commands/day, priority support
    *   **Pro (€69.99/month):** Unlimited products, 30-day AI predictions + weather/events integration, unlimited everything, priority support, advanced features
    A unique referral code system rewards both referrer and referee.
*   **Stock Management:**
    *   **Visual Stock:** Products are color-coded (Green: OK, Orange: low, Red: critical) with quick adjustment buttons (+/-1, +/-10).
    *   **AI Predictive Engine:** A hybrid architecture.
        *   **Rules Engine (local):** Provides instant predictions for stockout, overstock detection, optimal order suggestions, waste detection, and a global stock "health score" (0-100%).
        *   **GPT-4o-mini (Tiered AI):** Offers basic predictions for Basique users, 7-day predictions for Standard, and 30-day predictions + advanced integrations for Pro users. It also powers advanced suggestions for expiry alerts and voice command parsing.
    *   **Expiry Alerts:** Tracks product expiration dates (DLC/DLUO) with color-coded urgency (Expired, Critical, Warning, Info) and offers local and AI-generated suggestions for action (promo, display, disposal). Calculates waste statistics.
    *   **Voice Commands:** Integrates Web Speech API (fr-FR) for hands-free stock adjustments. Uses local regex parsing primarily, with GPT-4o-mini as a fallback for complex commands. Supports adding/removing quantities with numerical and decimal inputs.
*   **Dashboard:** Completely redesigned with a modern, compact layout inspired by Stripe/Linear. Features a KPI grid (4 cards showing Total products, Critical stock, Low stock, Optimal stock), a slim single-line Basique plan banner, and a 2-column layout with AI Insights (left) and Active Alerts sidebar (right). Expiry alerts are integrated into the alerts panel alongside stock warnings. The design maximizes horizontal space usage and minimizes vertical scrolling for better UX.
*   **Chat AI:** Floating chat button (bottom-right) with gold gradient styling opens a conversational AI drawer. Merchants can ask natural questions like "Combien j'ai de farine?", "Qu'est-ce que je dois commander?", and receive intelligent, context-aware responses based on their current inventory. Features clean, modern UI with smooth animations and mobile-responsive design.
*   **PDF Order Generation:** "Générer bon de commande" button integrated into AI Insights panel automatically generates professional order documents (.txt format) when critical or low stock is detected. Includes product details, current stock levels, suggested quantities, urgency indicators (🔴 URGENT / 🟠 Cette semaine), and supplier information. Uses consistent threshold fallbacks to prevent calculation errors.
*   **Product Management:** Simple forms for adding products, specifying name, quantity, unit, alert threshold, and supplier. Supports 6 units (kg, L, pieces, bottles, sachets, boxes). Pre-configured product templates are available based on business type.
*   **UI/UX:** Emphasizes simplicity and speed for mobile-first usage. Features dynamic scores, prioritized actions, contextual messages, and visual statistics.
*   **Security & Performance:** Dynamic import of `openaiService`, 10-second timeouts for all AI calls, proper cleanup of Web Speech API, and comprehensive permission management. Local parsing is prioritized for speed and cost efficiency, with AI used only when necessary.

**Technical Implementations:**

*   **Backend (server/):** `index.js` (Express server with `/api/chat` endpoint for secure OpenAI calls, `/api/health` health check)
*   **Frontend Services:** `aiUtils.js` (timeout, dynamic import), `voiceParser.js` (local regex parsing), `expiryService.js` (expiry calculations, local suggestions, waste stats), `rulesEngine.js` (AI rules), `aiService.js` (AI orchestration), `pdfService.js` (order document generation), `supabase.js` (Auth + DB)
*   **Components:** `ProductCard.jsx`, `AddProductModal.jsx`, `AIInsights.jsx`, `UpgradeModal.jsx`, `ReferralModal.jsx`, `ExpiryAlerts.jsx`, `VoiceInput.jsx`, `ChatAI.jsx`
*   **File Structure:** `server/` (backend), `src/components`, `src/pages`, `src/services`, `src/styles`
*   **Configuration:** 
    - `vite.config.js`: Port 5000, proxy `/api` → `localhost:3000`
    - `start.sh`: Orchestrates backend + frontend startup
    - `package.json`: Scripts for `dev` (frontend), `backend` (server)

**Recent Changes (November 2025):**

*   ✅ **ChatAI Component:** Floating conversational AI interface for natural inventory queries (FIXED - conversation history now passed correctly)
*   ✅ **PDF Order Generation:** Automatic order document creation with smart quantity suggestions
*   ✅ **Enhanced AI Insights:** Integrated "Générer bon de commande" button in dashboard
*   ✅ **User Menu & Navigation:** Professional dropdown menu with Profile, Settings, About, Contact, Logout
*   ✅ **Profile Page:** Complete user profile with editable business name, email, plan display, referral code
*   ✅ **Settings Page:** Notifications toggles, data export (JSON), password change, account deletion
*   ✅ **Landing Page Updates (Nov 7):** Unified hero/header gradient (removed visual line), Twitter→X icon in footer, green Basique badge, removed promotional pricing, updated ROI to €767/month (€9,200/year), aligned Basique button, added CGV/Mentions Légales
*   ✅ **Authentication Flow (Nov 7):** Supabase integration with login/signup toggle on same page, conditional form fields (business details only for signup), async logout handling
*   ✅ **Dashboard UX (Nov 7):** Streamlined user menu to show profile icon only (no email text)
*   ✅ **ChatAI Expert Transformation (Nov 7):** 
    - **CRITICAL SECURITY FIX:** Migrated to secure backend architecture - OpenAI keys never exposed to browser
    - Created Express backend (`server/index.js`) with `/api/chat` endpoint
    - Frontend now calls backend API instead of OpenAI directly
    - Vite proxy configuration routes `/api/*` to backend (port 3000)
    - Transformed AI into sophisticated supply-chain expert
    - Advanced expertise: FEFO/FIFO, EOQ, coverage days, rupture/overstock costs
    - Structured methodology: Analysis → Immediate Actions → Projection → Process Recommendations
    - Enriched context: health score, coverage days, suppliers, expiry dates
    - Temperature reduced to 0.4 for rigor, max_tokens 500 for complete responses
    - Enhanced error handling with generic client messages (no sensitive data leakage)

**Roadmap:**

*   **In Development:** Graphical movement history, Stripe/Revolut integration, integrated weather predictions (OpenWeatherMap), local events (Google Calendar).
*   **Phase 2:** POS integrations (Square API), multi-user support, SMS/email notifications, enhanced PDF formats.

## External Dependencies

*   **Backend:** Express 5, OpenAI SDK 6.8.1 (GPT-4o-mini via Replit AI Integrations, server-side only)
*   **Frontend:** React 18, Vite 5, React Router DOM
*   **Icons:** Lucide React
*   **Speech Recognition:** Web Speech API (browser-native)
*   **Database:** PostgreSQL (Replit integrated), Supabase client (@supabase/supabase-js)
*   **Payments (Planned):** Stripe
*   **Weather Data (Planned):** OpenWeatherMap
*   **Calendar (Planned):** Google Calendar
*   **POS Integrations (Planned):** Square API, Lightspeed