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
*   **Weather:** OpenWeatherMap API
*   **Payments (Planned):** Stripe
*   **Calendar (Planned):** Google Calendar API
*   **Email (Documented):** SendGrid / Resend / Replit Mail
*   **POS Integrations (Planned):** Square API, Lightspeed