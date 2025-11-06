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

The PONIA AI system is a mobile-first application built with a React 18 frontend using Vite 5. Routing is handled by React Router DOM, and styling employs custom CSS. Icons are provided by Lucide React. Data storage currently uses LocalStorage, with a planned migration to PostgreSQL via Supabase. The core AI functionality leverages a hybrid architecture combining a local rules engine with OpenAI's GPT-4o-mini via Replit AI Integrations.

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
*   **Dashboard:** Provides an overview of stock, a dedicated "Alerts" section, and basic AI insights.
*   **Product Management:** Simple forms for adding products, specifying name, quantity, unit, alert threshold, and supplier. Supports 6 units (kg, L, pieces, bottles, sachets, boxes). Pre-configured product templates are available based on business type.
*   **UI/UX:** Emphasizes simplicity and speed for mobile-first usage. Features dynamic scores, prioritized actions, contextual messages, and visual statistics.
*   **Security & Performance:** Dynamic import of `openaiService`, 10-second timeouts for all AI calls, proper cleanup of Web Speech API, and comprehensive permission management. Local parsing is prioritized for speed and cost efficiency, with AI used only when necessary.

**Technical Implementations:**

*   **Services:** `aiUtils.js` (timeout, dynamic import), `voiceParser.js` (local regex parsing), `openaiService.js` (GPT-4o-mini integrations for expiry suggestions and voice parsing), `expiryService.js` (expiry calculations, local suggestions, waste stats), `rulesEngine.js` (AI rules), `aiService.js` (AI orchestration), `supabase.js` (Auth + DB).
*   **Components:** `ProductCard.jsx`, `AddProductModal.jsx`, `AIInsights.jsx`, `UpgradeModal.jsx`, `ReferralModal.jsx`, `ExpiryAlerts.jsx`, `VoiceInput.jsx`.
*   **File Structure:** Organized logically with `components`, `pages`, `services`, and `styles` directories.
*   **Vite Configuration:** Runs on port 5000 (`npm run dev`).

**Roadmap:**

*   **In Development:** Graphical movement history, Stripe integration, integrated weather predictions (OpenWeatherMap), local events (Google Calendar).
*   **Phase 2:** POS integrations (Square API), PDF export of orders, multi-user support, SMS/email notifications.

## External Dependencies

*   **AI:** OpenAI GPT-4o-mini (via Replit AI Integrations)
*   **Frontend:** React 18, Vite 5, React Router DOM
*   **Icons:** Lucide React
*   **Speech Recognition:** Web Speech API (browser-native)
*   **Database (Planned):** PostgreSQL (via Supabase)
*   **Payments (Planned):** Stripe
*   **Weather Data (Planned):** OpenWeatherMap
*   **Calendar (Planned):** Google Calendar
*   **POS Integrations (Planned):** Square API, Lightspeed