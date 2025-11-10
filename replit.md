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

## Recent Changes (Nov 10, 2025)

### ✅ Parcours d'Inscription Professionnel (Latest)
*   **Validation du mot de passe améliorée** - Expérience utilisateur professionnelle
    → Champ "Confirmez votre mot de passe" ajouté sur le formulaire d'inscription
    → Validation côté client : les mots de passe doivent correspondre
    → Message d'erreur clair en rouge si les mots de passe ne correspondent pas
    → Minimum 8 caractères requis et vérifié
*   **Page de vérification d'email dédiée** - Communication claire avec l'utilisateur
    → Nouvelle page `/verify-email` avec design professionnel et rassurant
    → Logo PONIA, icônes lucide-react, couleurs dorées cohérentes
    → Instructions étape par étape : 1. Ouvrir email, 2. Cliquer lien, 3. Auto-redirection
    → Bouton "Renvoyer l'email de confirmation" avec feedback utilisateur
    → Avertissement sur le délai (jusqu'à 5 minutes) et vérification des spams
    → Contact support visible (support@ponia.ai)
    → Lien "Retour à l'inscription" si mauvaise adresse email
*   **Flow d'inscription optimisé** - Expérience fluide et professionnelle
    → Signup : validation → redirection vers /verify-email avec email en state
    → Email stocké dans localStorage pour récupération si fermeture navigateur
    → Après confirmation email : Supabase authentifie → session créée
    → App.jsx détecte session → redirige vers /complete-profile (si needsProfile)
    → Configuration du profil (nom commerce, type business) → Dashboard
    → Nettoyage automatique de pending_verification_email après login réussi

## Recent Changes (Nov 09, 2025)

### ✅ Plan Pro RECOMMANDÉ - Corrections Finales
*   **Couleur PONIA #FFD700 restaurée** - Correction branding
    → #FFD700 (doré PONIA) remis partout après correction temporaire erronée
    → CSS variables: --primary: #FFD700, --primary-dark: #FFA500
    → Toutes les pages (PricingPage, LandingPage, UpgradePage) corrigées
*   **Plan Pro en vedette** - Stratégie commerciale
    → popular: true pour Pro (au lieu de Standard)
    → Badge "⭐ RECOMMANDÉ" sur plan Pro
    → Plan Basique: gris neutre (#6B7280)
    → Plans Standard et Pro: doré PONIA (#FFD700)
*   **Intégrations POS restaurées** - Features réalistes
    → "Intégrations POS (Square, etc.)" remis dans plan Pro
    → Texte erroné "API développeur" supprimé
*   **Toggle annuel fonctionnel** - Pricing UX
    → Toggle Mensuel/Annuel sur /pricing
    → Badge "-20%" sur bouton Annuel
    → Prix annuels: Standard €470, Pro €660
    → Économies affichées: Standard -€118, Pro -€168

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

## Configuration Requise - Supabase

**IMPORTANT:** Pour que l'inscription fonctionne immédiatement (sans confirmation email), vous devez configurer Supabase :

1. **Allez sur votre dashboard Supabase :** https://supabase.com/dashboard
2. **Sélectionnez votre projet PONIA AI**
3. **Allez dans Authentication → Providers**
4. **Cliquez sur "Email"**
5. **Désactivez l'option "Confirm email"**
6. **Sauvegardez**

**Pourquoi ?** Par défaut, Supabase exige que les utilisateurs confirment leur email. Cela crée une friction pour vos commerçants qui veulent tester immédiatement. En désactivant cette option, les utilisateurs peuvent s'inscrire et être redirigés directement vers la page de configuration de profil.

**Note de sécurité :** Pour un environnement de production, vous pouvez réactiver la confirmation d'email. Pour les tests et le MVP, la désactiver permet un onboarding plus rapide.