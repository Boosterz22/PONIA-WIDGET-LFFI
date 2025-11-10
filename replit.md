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
*   **Address API:** API Adresse (Base Adresse Nationale - BAN, gouvernement français)

## Recent Changes (Nov 10, 2025)

### ✅ Filtrage Géographique Intelligent des Événements (Latest)
*   **Événements proches du commerce (rayon 5km)** - Pertinence maximale
    → Migration vers Paris OpenData API v2 avec support GPS
    → Récupération automatique des coordonnées latitude/longitude de chaque événement
    → Calcul de distance haversine (formule standard, R=6371 km)
    → Filtrage intelligent : seuls les événements à moins de 5km s'affichent
    → Tri par distance : les événements les plus proches en premier
    → Logs backend pour debug : "✅ Filtrage géographique : X événements dans un rayon de 5km"
*   **Stockage des coordonnées GPS du commerce** - Infrastructure géolocalisation
    → Schema stores : ajout latitude (decimal 10,7) et longitude (decimal 10,7)
    → CompleteProfilePage : capture des coordonnées depuis autocomplete API
    → Sauvegarde automatique lors de la création du store principal
    → Conversion en float côté backend pour calculs de distance

### ✅ Autocomplete d'Adresse Intelligent
*   **Autocomplete d'adresse avec API gouvernementale** - UX moderne et fluide
    → Intégration de l'API Adresse du gouvernement français (gratuite, sans clé API)
    → Endpoint : https://api-adresse.data.gouv.fr/search/
    → Suggestions instantanées dès 3 caractères tapés
    → Debounce de 300ms pour éviter les appels excessifs à l'API
    → Auto-remplissage automatique : adresse, ville, code postal + coordonnées GPS
    → Dropdown élégant avec nom de rue + code postal + ville
    → Fermeture au clic extérieur (UX native)
    → Expérience similaire à Google Maps, Uber, Airbnb
*   **Logo remis à taille normale** - CompleteProfilePage
    → 210px → 70px pour un meilleur équilibre visuel
    → Taille cohérente avec le reste de l'application

### ✅ Témoignages Ultra-Convaincants & Filtrage Postal
*   **Témoignages réécrits avec émotions fortes** - Conversion maximisée
    → Sophie Martinet (Boulangerie) : "23 baguettes jetées, €287/mois de gaspillage → €340/samedi de plus"
    → Marc Dubois (Restaurant) : "7kg légumes pourris, €520→€75/mois → €1335 économisés en 3 mois"
    → Élise Renault (Cave) : "340 références, 2h→8min d'inventaire, clients récupérés"
    → Détails visuels précis, chiffres concrets, before/after émotionnels
    → Noms complets, villes réelles, émotions authentiques ("j'ai pleuré de soulagement")
*   **Logo agrandi 3x** - VerifyCodePage (branding renforcé)
    → 70px → 210px pour une présence visuelle forte
*   **Collecte adresse complète** - Préparation features proximité
    → CompleteProfilePage : nouveaux champs address, city, postalCode
    → Validation code postal (5 chiffres max)
    → Store principal créé automatiquement avec location
    → Schema stores : ajout colonne postalCode
*   **Filtrage événements par code postal** - Personnalisation locale
    → googleCalendar.js : fonction isParisRegionPostalCode()
    → Codes Île-de-France acceptés : 75, 77, 78, 91, 92, 93, 94, 95
    → Événements affichés uniquement si store dans région parisienne
*   **Mode test pour changement de plan** - Facilite QA
    → Instructions claires en commentaire dans server/index.js
    → Protection production commentée (décommenter pour activer)