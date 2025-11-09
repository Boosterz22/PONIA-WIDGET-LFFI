# PONIA AI - Gestion de Stock Intelligente avec IA

## Overview

PONIA AI is an AI-powered inventory management system designed for small businesses in France (e.g., bakeries, restaurants, bars, wine cellars). Its primary purpose is to provide a mobile-first application for real-time inventory tracking, low-stock alerts, and AI-optimized order suggestions. The system aims to significantly reduce waste and prevent stockouts, offering a simple, fast, and mobile-centric solution to a common daily challenge for small business owners. The project targets a monthly recurring revenue (MRR) of €4,000-€6,000 by serving 51-76 clients with a tiered pricing model: Basique (€0/month), Standard (€49/month), and Pro (€69/month).

## User Preferences

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation
- Do not make changes to the folder `Z`
- Do not make changes to the file `Y`

## Recent Changes (Nov 09, 2025)

### ✅ Branding PONIA 100% Doré - Audit Complet (Latest)
*   **Palette de couleurs PONIA strictement dorée #FFD700** - Validation architect complète
    → TOUTES les couleurs non-neutres supprimées: vert (#4ade80, #22c55e, #16a34a, #10B981), violet (#667eea, #764ba2, #a855f7, #7c3aed), orange (#FFA500), marron (#92400e), bleu-gris (#94a3b8, #f0f4ff)
    → Couleur de brand EXCLUSIVE: #FFD700 (doré PONIA)
    → Plan Basique: #6B7280 (gris neutre uniquement)
    → Warning système: #F59E0B (conservé pour alertes non-brand)
    → Danger: #EF4444 (rouge pour erreurs)
    → CSS variables globales mises à jour: --primary, --primary-dark, --success = #FFD700
*   **PricingPage, LandingPage, UpgradePage** - Cohérence totale
    → Logo PONIA (clamp 120-180px), navigation, badges, icônes, gradients = doré pur
    → Toggle mensuel/annuel avec badge "-20%" doré
    → Témoignages avec avatars et boxes "APRÈS" dorés
    → Section "AVEC PONIA" avec icônes et borders dorés
    → Boutons CTA avec gradient doré
    → Flèches FAQ dorées
*   **Toggle annuel supprimé de landing** - Simplification UX
    → Section tarifs landing affiche uniquement les prix mensuels
    → Toggle annuel disponible uniquement sur /pricing
*   **Intégrations POS supprimées** - Features réalistes
    → "Intégrations POS (Square, etc.)" supprimé de tous les plans
    → Remplacé par "API développeur"
*   **Redirections /login** - Parcours utilisateur optimisé
    → Tous les boutons CTA tarifs redirigent vers /login

## System Architecture

PONIA AI is a secure full-stack application built with an Express backend (Node.js) and a React 18 frontend (Vite 5), operating on a client-server pattern. The frontend runs on port 5000 and the backend on port 3000. Data is persisted in PostgreSQL using Drizzle ORM, and user authentication is managed by Supabase.

**Key Architectural Decisions and Features:**

*   **Security:** All OpenAI API calls are routed server-side through the Express backend to protect API keys. The frontend proxies `/api/*` requests to the backend. JWT authentication secures all protected endpoints, with server-side validation.
*   **AI Functionality:** A hybrid AI architecture combines a local rules engine for instant predictions (stockout, overstock, health score) with OpenAI's GPT-4o-mini (via Replit AI Integrations) for tiered predictions (7-day for Standard, 30-day for Pro) and advanced features like expiry tracking and order generation.
*   **User Interface (UI/UX):** The application prioritizes a mobile-first, simple, and fast user experience. Key UI elements include:
    *   **Landing Page:** Marketing-focused with problem/solution, ROI, testimonials, and CTAs.
    *   **Dashboard:** Modern layout with KPI grid, AI Insights, and an Active Alerts sidebar.
    *   **Stock Management:** Visual, color-coded product display with quick adjustment buttons and AI-driven predictive insights.
    *   **Chat AI:** A floating conversational AI for natural language queries about inventory.
    *   **Product Management:** Simplified forms for adding products with essential details and supplier information.
    *   **Navigation:** Professional horizontal navigation displaying business type, with a comprehensive dropdown menu for user-specific actions.
    *   **Settings Page:** Centralized management for user profiles, plan upgrades, and business information.
    *   **Referral Page:** Dedicated section for the referral program with statistics and a unique shareable link.
*   **Core Technical Implementations:**
    *   **Authentication & Plans:** Email-based registration with Supabase, supporting a three-tier pricing model and a 14-day free trial enforced server-side. Includes Stripe integration for subscription management.
    *   **AI-Powered Order Generation:** Automated intelligent purchase order generation (.txt format) using GPT-4o-mini, including smart calculations and supplier grouping.
    *   **Expiry Alerts:** Tracks product expiration dates and provides AI-generated suggestions.
    *   **Multi-store Support:** Database schema includes support for multiple stores per user.
    *   **Admin Dashboard:** Provides an interface for user management, real-time statistics (total users, active trials, paid users, MRR), and CSV export, secured via an admin email whitelist.
*   **System Design:**
    *   **Backend (`server/`):** Express server providing REST API endpoints for chat, order generation, products, users, stock history, weather, and health.
    *   **Database (`shared/`):** `schema.js` defines Drizzle ORM schema for users, products, stock history, and notifications, including fields for Stripe integration and multi-store support.
    *   **Frontend Services:** Dedicated services for AI utilities, expiry tracking, rules engine, and integrations.
    *   **Configuration:** Uses `vite.config.js` for frontend proxying, `start.sh` for deployment, and `drizzle.config.js` for database migrations.

## External Dependencies

*   **Backend:** Express, OpenAI SDK (GPT-4o-mini)
*   **Frontend:** React, Vite, React Router DOM, Recharts, Lucide React
*   **Speech Recognition:** Web Speech API (for future considerations, currently removed from primary features)
*   **Database:** PostgreSQL, Drizzle ORM, Supabase client
*   **Weather:** OpenWeatherMap API (configured)
*   **Calendar:** Google Calendar API (integrated)
*   **Payments:** Stripe (integrated for subscription billing)
*   **POS Integrations:** Square API, Lightspeed (planned)