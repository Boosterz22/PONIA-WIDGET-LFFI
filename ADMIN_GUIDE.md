# Guide Admin PONIA AI

## 🎯 Comment accéder aux données des utilisateurs inscrits

### Option 1: Dashboard Admin (Recommandé)
**URL:** `/admin`

Le dashboard admin vous permet de :
- Voir tous les utilisateurs inscrits (email, commerce, type, plan)
- Suivre les statistiques en temps réel:
  - Nombre total d'utilisateurs
  - Nombre d'essais actifs (trial en cours)
  - Nombre de clients payants
  - MRR (Monthly Recurring Revenue)
- Voir le statut d'essai de chaque utilisateur
- Exporter toutes les données en CSV

**Comment y accéder:**
1. Connectez-vous à votre compte PONIA AI
2. Allez sur `/admin` dans votre navigateur
3. Toutes les données sont affichées dans un tableau

**Export CSV:**
- Cliquez sur "Exporter CSV" en haut à droite
- Le fichier contiendra: email, nom commerce, type, plan, statut essai, date fin essai, date inscription, code parrainage, parrainé par

---

### Option 2: Base de données SQL (Technique)

**Requête SQL pour voir tous les utilisateurs:**
```sql
SELECT 
  id,
  email,
  business_name,
  business_type,
  plan,
  trial_ends_at,
  subscription_status,
  created_at,
  referral_code,
  referred_by
FROM users
ORDER BY created_at DESC;
```

**Requête SQL pour voir les statistiques:**
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN plan = 'standard' THEN 1 END) as standard_users,
  COUNT(CASE WHEN plan = 'pro' THEN 1 END) as pro_users,
  COUNT(CASE WHEN trial_ends_at > NOW() AND plan = 'basique' THEN 1 END) as active_trials
FROM users;
```

**Requête SQL pour le parrainage:**
```sql
SELECT 
  u1.email as parrain,
  u1.referral_code,
  COUNT(u2.id) as nb_filleuls,
  COUNT(CASE WHEN u2.plan IN ('standard', 'pro') THEN 1 END) as filleuls_payants,
  COUNT(CASE WHEN u2.plan IN ('standard', 'pro') THEN 1 END) * 10 as gains_euros
FROM users u1
LEFT JOIN users u2 ON u2.referred_by = u1.referral_code
WHERE u1.referral_code IS NOT NULL
GROUP BY u1.email, u1.referral_code
ORDER BY gains_euros DESC;
```

---

## 💳 Système d'Essai Gratuit

### Comment ça marche
1. **Inscription automatique** → Essai de 14 jours activé automatiquement
2. **Bannière d'essai** → Affichée en haut de l'écran avec décompte des jours restants
3. **Blocage après expiration** → Écran de blocage avec invitation à upgrader
4. **Upgrade Stripe** → Redirection vers Stripe Checkout pour paiement sécurisé

### Vérifier le statut d'essai d'un utilisateur

Via SQL:
```sql
SELECT 
  email,
  trial_ends_at,
  CASE 
    WHEN trial_ends_at IS NULL THEN 'Pas d''essai'
    WHEN trial_ends_at > NOW() THEN 'Actif'
    ELSE 'Expiré'
  END as statut_essai,
  EXTRACT(DAY FROM (trial_ends_at - NOW())) as jours_restants
FROM users
WHERE email = 'email@exemple.com';
```

---

## 📊 Stripe & Paiements

### Configuration Stripe
1. Les clés sont stockées dans les secrets Replit:
   - `STRIPE_SECRET_KEY` (clé secrète backend)
   - `VITE_STRIPE_PUBLIC_KEY` (clé publique frontend)

2. **Webhook Stripe** (à configurer dans dashboard Stripe):
   - URL: `https://votre-domaine.replit.app/api/stripe/webhook`
   - Events à écouter:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

### Tarifs actuels
- **Standard:** €49/mois (`price_standard_49eur`)
- **Pro:** €69.99/mois (`price_pro_6999eur`)

⚠️ **Important:** Vous devez créer ces produits dans votre dashboard Stripe et mettre à jour les price IDs dans `server/index.js` ligne 775-778.

---

## 🚀 Lancement avec les 100 commerces

### Étapes recommandées

1. **Configurez Stripe en mode Test d'abord**
   - Testez le flow complet avec des cartes test Stripe
   - Vérifiez que les webhooks fonctionnent

2. **Testez l'essai gratuit**
   - Créez un compte test
   - Vérifiez que l'essai de 14 jours est activé
   - Attendez ou modifiez manuellement la date d'expiration en SQL pour tester le blocage

3. **Passez en mode Live sur Stripe**
   - Mettez à jour les clés dans les secrets Replit
   - Recréez les produits en mode Live
   - Mettez à jour les price IDs dans le code

4. **Invitez vos 100 commerces**
   - Partagez le lien d'inscription
   - Suivez les inscriptions dans `/admin`
   - Exportez les données régulièrement

### Suivi des conversions

Via SQL:
```sql
-- Taux de conversion essai → payant
SELECT 
  COUNT(CASE WHEN trial_ends_at < NOW() AND plan = 'basique' THEN 1 END) as essais_expires,
  COUNT(CASE WHEN plan IN ('standard', 'pro') THEN 1 END) as convertis,
  ROUND(
    COUNT(CASE WHEN plan IN ('standard', 'pro') THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(CASE WHEN trial_ends_at < NOW() THEN 1 END), 0) * 100, 
    2
  ) as taux_conversion_pct
FROM users;
```

---

## 🔒 Sécurité & Admin

### Qui peut accéder au dashboard admin?
Le dashboard admin est **sécurisé** et réservé aux emails autorisés.

**Configuration Admin (OBLIGATOIRE avant le lancement):**
1. Allez dans les Secrets Replit
2. Ajoutez une nouvelle variable: `ADMIN_EMAILS`
3. Valeur: `votre-email@exemple.com` (ou plusieurs emails séparés par des virgules)
4. Exemple: `admin@ponia.fr,contact@ponia.fr,vous@exemple.com`

**Comment ça marche:**
- Seuls les utilisateurs avec emails listés dans `ADMIN_EMAILS` peuvent accéder à `/admin`
- Les autres reçoivent une erreur 403 "Accès refusé - droits admin requis"
- Vérifié côté serveur, impossible à contourner

**Ajoutery votre email admin:**
1. Créez d'abord un compte utilisateur normal sur PONIA AI
2. Ajoutez votre email dans le secret `ADMIN_EMAILS`
3. Redémarrez le workflow
4. Accédez à `/admin` - vous êtes maintenant admin !

---

## 📧 Support & Contact

Pour toute question:
- Email technique: [votre email]
- Dashboard admin: `/admin`
- Documentation code: `replit.md`
