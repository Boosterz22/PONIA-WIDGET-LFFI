# Configuration Stripe pour PONIA AI

## 🚨 IMPORTANT : Configuration obligatoire pour activer les paiements

Les paiements ne fonctionneront PAS tant que vous n'aurez pas configuré les Price IDs Stripe dans vos secrets Replit.

## Étape 1 : Créer les produits et prix dans Stripe Dashboard

1. **Allez sur https://dashboard.stripe.com/test/products**
2. **Cliquez sur "+ Créer un produit"**

### Plan Standard

**Produit Standard :**
- Nom du produit : `PONIA AI - Standard`
- Description : `Plan Standard - 50 produits, IA 7 jours`

**Prix mensuel :**
- Prix : `49 EUR`
- Type de facturation : `Récurrent`
- Période : `Mensuel`
- **Copiez le Price ID** (commence par `price_...`)

**Prix annuel :**
- Cliquez sur "+ Ajouter un autre prix" sur le même produit
- Prix : `470 EUR`
- Type de facturation : `Récurrent`
- Période : `Annuel`
- **Copiez le Price ID** (commence par `price_...`)

### Plan Pro

**Produit Pro :**
- Nom du produit : `PONIA AI - Pro`
- Description : `Plan Pro - Produits illimités, IA 30 jours, multi-magasins`

**Prix mensuel :**
- Prix : `69 EUR`
- Type de facturation : `Récurrent`
- Période : `Mensuel`
- **Copiez le Price ID** (commence par `price_...`)

**Prix annuel :**
- Cliquez sur "+ Ajouter un autre prix" sur le même produit
- Prix : `660 EUR`
- Type de facturation : `Récurrent`
- Période : `Annuel`
- **Copiez le Price ID** (commence par `price_...`)

## Étape 2 : Configurer les Price IDs dans Replit Secrets

1. **Dans votre Repl, allez dans l'onglet "Secrets" (icône 🔒)**
2. **Ajoutez les 4 Price IDs** :

| Secret Name | Valeur |
|-------------|--------|
| `STRIPE_PRICE_STANDARD_MONTHLY` | `price_xxxxxxxxxxxxx` (votre Price ID Standard mensuel) |
| `STRIPE_PRICE_STANDARD_YEARLY` | `price_xxxxxxxxxxxxx` (votre Price ID Standard annuel) |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_xxxxxxxxxxxxx` (votre Price ID Pro mensuel) |
| `STRIPE_PRICE_PRO_YEARLY` | `price_xxxxxxxxxxxxx` (votre Price ID Pro annuel) |

## Étape 3 : Configurer le Webhook Stripe (pour finaliser les paiements)

1. **Allez sur https://dashboard.stripe.com/test/webhooks**
2. **Cliquez sur "+ Ajouter un endpoint"**
3. **URL de l'endpoint** : `https://votre-repl-url.replit.dev/api/stripe/webhook`
   - Remplacez par votre vraie URL Replit
4. **Événements à écouter** :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Copiez le "Signing secret"** (commence par `whsec_...`)
6. **Ajoutez-le dans les Secrets Replit** :
   - Nom : `STRIPE_WEBHOOK_SECRET`
   - Valeur : `whsec_xxxxxxxxxxxxx`

## ✅ Vérification

Une fois configuré :
1. Redémarrez votre application
2. Connectez-vous à PONIA AI
3. Allez sur `/upgrade`
4. Cliquez sur "Passer à Standard" ou "Passer à Pro"
5. Vous devriez être redirigé vers une vraie page de paiement Stripe

## 🧪 Tester avec une carte test

Utilisez ces numéros de carte test Stripe :
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0027 6000 3184`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel 3 chiffres
- Code postal : n'importe quel code

## 🚀 Passer en production

Quand vous serez prêt à accepter de vrais paiements :
1. Créez les mêmes produits/prix en mode **Live** (pas Test)
2. Mettez à jour les Price IDs dans les Secrets avec les IDs **Live**
3. Utilisez votre clé API Stripe **Live** dans `STRIPE_SECRET_KEY`
4. Configurez le webhook avec l'URL **Live**

---

**Questions ?** Consultez la documentation Stripe : https://stripe.com/docs/billing/subscriptions/build-subscriptions
