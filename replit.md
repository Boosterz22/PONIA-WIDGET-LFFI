# PONIA AI - Gestion de Stock Intelligente avec IA

## Vue d'ensemble

PONIA AI est un système de gestion d'inventaire alimenté par l'IA pour les petits commerces en France (boulangeries, restaurants, bars, caves à vin, etc.). 

**Problème validé :** Visites terrain auprès de 9 commerces parisiens - 6/9 ont mentionné la gestion de stock comme leur plus gros problème quotidien.

**Objectif :** €4,000-6,000 MRR (51-76 clients à €49-79/mois) dans les 2-3 mois après lancement.

## Solution

Application mobile-first qui permet aux commerçants de :
- Suivre leur stock en temps réel (2 minutes/jour)
- Recevoir des alertes avant les ruptures
- Obtenir des suggestions de commandes optimisées par l'IA
- Réduire le gaspillage et éviter les ruptures

## Fonctionnalités actuelles (MVP)

### ✅ Landing Page Marketing Optimisée
**Refonte complète avec approche marketing professionnelle :**
- **Header avec navigation** : Sections cliquables (Accueil, Fonctionnalités, Témoignages, Tarifs, FAQ) + CTA sticky
- **Hero repensé** : Approche "problème → solution" (encadré rouge problème, puis bénéfices)
- **Stats ROI annuelles** : €7,200 économisés/an, 420h gagnées/an, -84% gaspillage
- **Section Avant/Après** : Comparaison visuelle détaillée (6 points avant ❌ vs 6 points après ✅)
- **Témoignages format Avant/Après** : 3 témoignages avec chiffres précis (Marie boulangère, Thomas pizzeria, Sophie caviste)
- **FAQ complète** : 5 questions répondant aux objections ("pas le temps", "pas tech-savvy", "ça marche pour moi ?")
- **CTAs contextuels variés** : CTA différent selon la section (urgence, ROI, social proof)
- **Urgence authentique** : Offre lancement 100 premiers clients → 3 mois à -50% (73/100 inscrits)

### ✅ Authentification simplifiée
- Inscription rapide : email + nom du commerce + type
- 9 types de commerces supportés (boulangerie, restaurant, bar, cave, tabac, boucherie, fromagerie, épicerie, autre)
- Pas de mot de passe compliqué - focus sur simplicité
- **Système de plans** : Gratuit / Standard / Pro
- **Code de parrainage unique** généré automatiquement (ex: MARIE-BOUL13)

### ✅ Plan Freemium (GRATUIT À VIE)
- **Limite : 10 produits maximum**
- Alertes intelligentes 🟢🟠🔴
- Produits pré-configurés selon type de commerce
- Interface mobile rapide
- **Badge visible** dans le dashboard
- **Modal d'upgrade** quand limite atteinte
- **Conversion naturelle** : utilisateurs atteignent la limite après 2-3 semaines

### ✅ Programme de parrainage
- **Code unique** généré à l'inscription (format: NOM-TYPE##)
- **Récompenses** :
  - Parrain : 1 mois gratuit
  - Filleul : -50% le 1er mois
- **Section dédiée** dans le dashboard gratuit
- **Modal de partage** avec boutons WhatsApp/Email
- **Tracking automatique** dans LocalStorage
- **Lien personnalisé** : `/login?ref=CODE`

### ✅ Templates automatiques
- Produits pré-configurés selon le type de commerce
- **Boulangerie :** Farine, beurre, œufs, levure, chocolat
- **Restaurant :** Tomates, huile d'olive, viande, pâtes, parmesan
- **Cave à vin :** Bordeaux, Champagne, Bourgogne, Rosé

### ✅ Gestion de stock visuelle
- Codes couleur : 🟢 Vert (OK) / 🟠 Orange (faible) / 🔴 Rouge (critique)
- Boutons rapides : +1, +10, -1, -10 pour ajuster les quantités
- Alertes automatiques quand le stock passe sous le seuil

### ✅ Dashboard intelligent
- Vue d'ensemble des stocks
- Section "Alertes" dédiée pour les produits urgents
- AI Insights basiques (détection sur-stock, stock critique)

### ✅ Ajout de produits
- Formulaire simple : nom, quantité, unité, seuil d'alerte, fournisseur
- 6 unités supportées : kg, L, pièces, bouteilles, sachets, boîtes

## Fonctionnalités à venir

### 🔄 En cours de développement
- Vraie IA prédictive avec OpenAI (prédiction jours avant rupture)
- Historique graphique des mouvements
- Intégration Stripe pour abonnements (€49 Standard / €79 Pro)
- Essai gratuit 30 jours

### 📋 Roadmap Phase 2
- Intégration caisses (Square API)
- Export PDF des commandes
- Multi-utilisateurs pour équipes
- Notifications SMS/email

## Structure technique

### Stack
- **Frontend :** React 18 + Vite 5
- **Routing :** React Router DOM
- **Styling :** CSS custom (mobile-first)
- **Icons :** Lucide React
- **Stockage :** LocalStorage (temporaire) → PostgreSQL + Supabase (à venir)
- **IA :** OpenAI API (à intégrer)
- **Paiements :** Stripe (à intégrer)

### Architecture fichiers

```
/
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx        # Carte produit avec alertes visuelles
│   │   ├── AddProductModal.jsx    # Modal ajout produit
│   │   ├── AIInsights.jsx         # Suggestions IA
│   │   ├── UpgradeModal.jsx       # Modal upgrade plan (limite atteinte)
│   │   └── ReferralModal.jsx      # Modal parrainage (partage code)
│   ├── pages/
│   │   ├── LandingPage.jsx        # Page d'accueil marketing + 3 plans
│   │   ├── LoginPage.jsx          # Connexion/inscription + freemium
│   │   └── DashboardPage.jsx      # Dashboard + badge plan + parrainage
│   ├── services/
│   │   └── supabase.js            # Auth + DB (à configurer)
│   ├── styles/
│   │   └── global.css             # Styles globaux
│   ├── App.jsx                     # Router principal
│   └── main.jsx                    # Entry point
├── public/
│   └── ponia-icon.png             # Logo
├── index.html
├── package.json
└── vite.config.js                 # Config Vite (port 5000)
```

### Configuration

- **Port :** 5000 (Webview mode)
- **Workflow :** `npm run dev`
- **Build :** `npm run build`

### Stockage LocalStorage

**Données utilisateur :**
- `ponia_user_email` : Email utilisateur
- `ponia_business_name` : Nom du commerce
- `ponia_business_type` : Type de commerce
- `ponia_user_plan` : Plan actif (gratuit/standard/pro)
- `ponia_referral_code` : Code unique de parrainage
- `ponia_referrals` : Liste des filleuls (JSON)
- `ponia_free_months` : Mois gratuits gagnés
- `ponia_products` : Liste produits (JSON)

## Validation marché

### Terrain (9 visites Paris 13e)
- **Boulangeries (4) :** Stock mentionné comme problème principal
- **Restaurants/Bars (3) :** Gaspillage + ruptures fréquentes
- **Autres (2) :** Intérêt confirmé

### Concurrence
- Solutions existantes = trop complexes (ERP lourds) ou trop chères
- PONIA AI = simple, rapide, mobile-first, prix accessible

### Pricing validé
- **Gratuit :** €0/mois à vie (jusqu'à 10 produits)
- **Standard :** €49/mois (produits illimités + historique 7j + export PDF)
- **Pro :** €79/mois (IA prédictive + historique 30j + intégrations POS)
- **Offre lancement :** -50% pendant 3 mois pour les 100 premiers

## Prochaines étapes

1. **Intégrer OpenAI :** Vraie prédiction de ruptures (jours restants)
2. **Historique graphique :** Voir évolution 7/30 jours
3. **Stripe :** Abonnements + essai gratuit
4. **Tests utilisateurs :** Contact avec le commerce qui a donné son email
5. **Landing page SEO :** Contenu pour "gestion stock boulangerie Paris"

## Notes de développement

- **Simplicité absolue :** Les commerçants ne sont PAS tech-savvy
- **Mobile-first :** Ils utilisent leur téléphone pendant l'inventaire
- **Rapidité :** 2 minutes/jour maximum pour updater les stocks
- **Valeur immédiate :** Alertes dès le 1er jour d'utilisation

## Business model

- **Target :** 500,000+ petits commerces en France
- **Pénétration :** 0.032% pour €10K MRR
- **CAC :** Terrain direct + SEO local + bouche-à-oreille
- **Churn target :** <5% (outil indispensable quotidien)

---

**Dernière mise à jour :** 5 novembre 2025
