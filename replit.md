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

## Recent Changes (November 18, 2025)

### Phase 1: AI Omnipresence & Time Savings Implementation

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
*   **POS Integrations:** Square API, Lightspeed (planned)
*   **Address API:** API Adresse (Base Adresse Nationale - BAN, gouvernement français)