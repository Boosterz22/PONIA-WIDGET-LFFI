# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system for small French businesses (bakeries, restaurants, bars, wine cellars). It provides a mobile-first application for real-time inventory tracking, intelligent low-stock alerts, and AI-optimized order suggestions to reduce waste and prevent stockouts, increasing efficiency and profitability. The project aims for an MRR of €4,000-€6,000 from 51-76 clients across tiered pricing plans.

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- **AI Omnipresence:** AI must be visible and sophisticated immediately at dashboard opening (strategic differentiation vs competitors like SumUp)
- **Time Savings Focus:** Core value proposition is "Time = money" - PONIA must prove it saves merchants 7+ hours/week
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## System Architecture

PONIA AI is a secure full-stack application using a client-server architecture with an Express.js (Node.js) backend and React 18 (Vite 5) frontend. Data is persisted in PostgreSQL via Drizzle ORM, and user authentication is handled by Supabase.

**Key Architectural Decisions and Features:**

*   **Security:** OpenAI API calls are proxied server-side, and JWT authentication secures all protected API endpoints.
*   **AI Functionality:** A hybrid AI approach combines a local rules engine for immediate predictions (stockout, overstock, health score) with OpenAI's GPT-4o-mini (via Replit AI Integrations) for advanced predictions (7-day for Standard, 30-day for Pro), expiry tracking, and intelligent order generation. AI is omnipresent and immediately visible.
    *   **Proactive AI Suggestions System:** Real-time intelligent suggestions engine with 8 types: expiry alerts, stockout predictions, overstock warnings, weather-based predictions (hot/cold/rain), anomaly detection, dish-of-day ideas (GPT-4o-mini creative), order reminders, and sales trends. Adaptive popup frequency based on user engagement (2h-4h+). Bell icon with badge in navbar, drawer grouped by priority, and contextual actions per suggestion type.
*   **UI/UX:** Mobile-first, simple, and fast design for non-tech-savvy merchants.
    *   **Dashboard:** AI-first interface with Chat AI Central as the primary interaction point, Time Saved widget highlighting value, and KPI grids.
    *   **Chat AI Central:** Main dashboard interface with conversational AI and suggested questions.
    *   **Time Saved Widget:** Displays weekly/monthly time savings and monetary value to reinforce ROI.
    *   **Multi-language Support:** Complete i18n system for 6 languages (French, English, Spanish, Arabic, German, Chinese) with context and selector component.
    *   **Smart Order Generation:** Enhanced order modal with PDF download, WhatsApp copy, and email options, emphasizing time savings.
    *   **Stock Management:** Visual, color-coded product display with quick adjustments and integrated AI insights.
*   **Core Technical Implementations:**
    *   **Authentication & Subscription:** Email-based registration via Supabase, supporting a three-tier pricing model (14-day free trial) and Stripe for subscriptions.
    *   **Email Alerts:** Automatic low-stock and expiry date email alerts (via Resend API) with customizable preferences and professional HTML templates.
    *   **AI-Powered Order Generation:** Automated generation of intelligent purchase orders in PDF format using GPT-4o-mini.
    *   **Multi-store Support:** Database schema supports multiple store locations per user.
    *   **Admin Dashboard:** Tools for user management, real-time statistics, CSV export, secured by an admin email whitelist. Includes commercial tracking dashboard for referrer performance.
    *   **Geolocation & Address Autocomplete:** Integration with API Adresse (Base Adresse Nationale - BAN) for address autocomplete and GPS coordinates.
    *   **Optimistic UI Updates:** Stock management interface uses optimistic updates.
    *   **Global Data Caching (DataContext):** Centralized caching system with localStorage persistence (5-min cache) for instant page transitions. Products, userData, timeSavedStats, and trialExpired are cached globally and refreshed in background. useTrialCheck hook uses cached state to eliminate blocking API calls.
    *   **POS Integration Architecture:** Modular adapter pattern for direct, self-service POS integrations.

## External Dependencies

*   **Backend:** Express, OpenAI SDK (GPT-4o-mini), Resend API
*   **Frontend:** React, Vite, React Router DOM, Recharts, Lucide React
*   **Database:** PostgreSQL, Drizzle ORM
*   **Authentication & Database Services:** Supabase
*   **Payments:** Stripe
*   **POS Integrations:** Direct adapters for Square, Zettle (PayPal), Hiboutik, SumUp/Tiller, Lightspeed X-Series, Lightspeed K-Series.
*   **Address API:** API Adresse (Base Adresse Nationale - BAN, gouvernement français)
*   **Weather:** OpenWeatherMap API
*   **Calendar:** Google Calendar API