# Configuration Code OTP Supabase pour PONIA AI

## ✅ Avantages du code OTP (vs lien de confirmation)

- ✨ **Plus simple** : L'utilisateur copie-colle un code à 6 chiffres
- 🎯 **Plus moderne** : Ressemble à Google, Instagram, etc.
- 🔒 **Plus sécurisé** : Le code expire en 1 heure
- 📱 **Mobile-friendly** : Pas de problème de redirection entre apps
- 🎨 **Branding PONIA** : Vous contrôlez totalement l'email (plus de "Supabase")

## 🔧 Configuration Supabase (3 étapes)

### Étape 1 : Activer les codes OTP

1. **Allez sur https://supabase.com/dashboard**
2. **Sélectionnez votre projet PONIA AI**
3. **Authentication → Providers → Email** (cliquez sur "Email")
4. **Configurez les paramètres suivants** :

| Paramètre | Valeur recommandée | Description |
|-----------|-------------------|-------------|
| **Enable Email provider** | ✅ Activé | Active l'authentification par email |
| **Confirm email** | ❌ Désactivé | On utilise le code OTP à la place |
| **Secure email change** | ✅ Activé | Sécurise les changements d'email |
| **Email OTP Length** | `6` | Code à 6 chiffres (plus facile à retenir) |
| **Email OTP Expiration** | `3600` | 1 heure (par défaut, c'est bon) |

5. **Cliquez sur "Save"**

### Étape 2 : Personnaliser l'email OTP

1. **Allez dans Authentication → Email Templates**
2. **Sélectionnez "Confirm signup"** (c'est le template utilisé pour l'OTP)
3. **Personnalisez le template** pour votre marque PONIA :

```html
<h2>Bienvenue sur PONIA AI ⚡</h2>

<p>Bonjour,</p>

<p>Votre code de vérification PONIA AI est :</p>

<h1 style="font-size: 32px; letter-spacing: 8px; color: #FFD700; font-family: monospace;">
  {{ .Token }}
</h1>

<p><strong>Ce code est valable pendant 1 heure.</strong></p>

<p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>

<hr>

<p style="color: #666; font-size: 12px;">
  L'équipe PONIA AI<br>
  Questions ? Contactez-nous à support@myponia.fr
</p>
```

4. **Cliquez sur "Save"**

### Étape 3 : Personnaliser l'expéditeur (optionnel mais recommandé)

1. **Authentication → Email Templates → Settings**
2. **Sender name** : `PONIA AI`
3. **Sender email** : Utilisez votre propre domaine si possible
   - Par défaut : `noreply@mail.app.supabase.io`
   - Recommandé : `noreply@myponia.fr` (nécessite configuration DNS)

## 🎯 Comment ça fonctionne côté utilisateur

### Nouveau parcours d'inscription

1. **Utilisateur entre email + mot de passe** sur `/login`
2. **Clic sur "Continuer"**
3. ✉️ **Email envoyé automatiquement** avec un code à 6 chiffres
4. **Redirection vers `/verify-code`**
5. **Utilisateur entre le code** reçu par email
6. ✅ **Code vérifié** → Redirection vers `/complete-profile`
7. **Configuration du profil** (nom commerce, type)
8. 🚀 **Accès au Dashboard**

### Interface de vérification

La page `/verify-code` offre :
- ✅ Champ de saisie optimisé pour mobile (clavier numérique)
- ✅ Validation en temps réel (6 chiffres requis)
- ✅ Bouton "Renvoyer le code" si besoin
- ✅ Messages d'erreur clairs (code expiré, incorrect, etc.)
- ✅ Timer de 1 heure visible
- ✅ Support PONIA visible

## 🧪 Tester le système

1. **Créez un compte test** sur votre app PONIA
2. **Vérifiez votre boîte mail** (peut prendre 1-2 minutes)
3. **Copiez le code à 6 chiffres**
4. **Entrez-le sur la page de vérification**
5. ✅ **Vous devriez être redirigé vers Complete Profile**

### Carte test pour tester un compte complet

Si vous voulez tester tout le parcours jusqu'au paiement :
- Email : `test+XXXXX@votredomaine.com` (changez XXXXX à chaque fois)
- Code : Récupéré dans l'email
- Carte Stripe test : `4242 4242 4242 4242`

## ❌ Problèmes fréquents

### "Je ne reçois pas le code"

1. **Vérifiez vos spams** : Cherchez "PONIA" ou "Supabase"
2. **Attendez 2-3 minutes** : L'email peut prendre du temps
3. **Vérifiez l'adresse email** : Pas de typo ?
4. **Vérifiez les logs Supabase** : Dashboard → Auth → Logs
5. **Quota email dépassé ?** : Supabase a des limites en mode gratuit

### "Code expiré"

- Le code est valable **1 heure**
- Cliquez sur "Renvoyer le code" pour en recevoir un nouveau

### "Code incorrect"

- Vérifiez que vous avez bien copié les **6 chiffres**
- Attention aux caractères ressemblants : `0` vs `O`, `1` vs `I`
- Le code est **sensible à la casse** (mais normalement que des chiffres)

### "Rien ne se passe après validation"

1. **Ouvrez la console développeur** (F12)
2. **Regardez les erreurs** dans l'onglet Console
3. **Vérifiez que Supabase est bien configuré** (clés API correctes)

## 🚀 Prochaines étapes

Une fois que le code OTP fonctionne :

1. ✅ Personnalisez davantage l'email template avec votre logo
2. ✅ Configurez votre propre domaine d'envoi (pour éviter les spams)
3. ✅ Testez sur mobile (l'UX doit être parfaite)
4. ✅ Activez le webhook Stripe pour finaliser les paiements
5. ✅ Passez en mode Production quand vous êtes prêt

---

**Questions ?** Consultez la doc Supabase : https://supabase.com/docs/guides/auth/auth-email
