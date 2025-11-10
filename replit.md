# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system for small businesses in France (e.g., bakeries, restaurants, bars, wine cellars). It provides a mobile-first application for real-time inventory tracking, low-stock alerts, and AI-optimized order suggestions to reduce waste and prevent stockouts. The project aims for a monthly recurring revenue (MRR) of €4,000-€6,000 by serving 51-76 clients with tiered pricing (Basique, Standard, Pro).

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## System Architecture

PONIA AI is a secure full-stack application with an Express backend (Node.js) and a React 18 frontend (Vite 5), running on a client-server pattern. Data is persisted in PostgreSQL using Drizzle ORM, and user authentication is managed by Supabase.

**Key Architectural Decisions and Features:**

*   **Security:** OpenAI API calls are routed server-side through the Express backend to protect API keys. JWT authentication secures protected endpoints.
*   **AI Functionality:** A hybrid AI architecture combines a local rules engine for instant predictions (stockout, overstock, health score) with OpenAI's GPT-4o-mini (via Replit AI Integrations) for tiered predictions (7-day for Standard, 30-day for Pro) and advanced features like expiry tracking and order generation.
*   **User Interface (UI/UX):** Prioritizes a mobile-first, simple, and fast user experience with a focus on ease of use for non-tech-savvy merchants. Key UI elements include:
    *   **Landing Page:** Marketing-focused with testimonials and CTAs.
    *   **Dashboard:** Modern layout with KPI grid, AI Insights, and Active Alerts.
    *   **Stock Management:** Visual, color-coded product display with quick adjustment and AI insights.
    *   **Chat AI:** Floating conversational AI for inventory queries.
    *   **Product Management:** Simplified forms for adding products and supplier info.
    *   **Navigation:** Professional horizontal navigation and comprehensive dropdown menu.
    *   **Settings Page:** Centralized management for user profiles, plan upgrades, and business info.
    *   **Referral Page:** Dedicated section for the referral program.
*   **Core Technical Implementations:**
    *   **Authentication & Plans:** Email-based registration with Supabase, supporting a three-tier pricing model and a 14-day free trial enforced server-side. Includes Stripe integration for subscription management.
    *   **AI-Powered Order Generation:** Automated intelligent purchase order generation (.txt format) using GPT-4o-mini.
    *   **Expiry Alerts:** Tracks product expiration dates and provides AI-generated suggestions.
    *   **Multi-store Support:** Database schema includes support for multiple stores per user.
    *   **Admin Dashboard:** Interface for user management, real-time statistics, and CSV export, secured via an admin email whitelist.
*   **System Design:**
    *   **Backend (`server/`):** Express server providing REST API endpoints.
    *   **Database (`shared/`):** `schema.js` defines Drizzle ORM schema for users, products, stock history, and notifications, including Stripe integration and multi-store support.
    *   **Frontend Services:** Dedicated services for AI utilities, expiry tracking, rules engine, and integrations.

## External Dependencies

*   **Backend:** Express, OpenAI SDK (GPT-4o-mini)
*   **Frontend:** React, Vite, React Router DOM, Recharts, Lucide React
*   **Database:** PostgreSQL, Drizzle ORM, Supabase client
*   **Weather:** OpenWeatherMap API
*   **Calendar:** Google Calendar API
*   **Payments:** Stripe
*   **POS Integrations:** Square API, Lightspeed (planned)