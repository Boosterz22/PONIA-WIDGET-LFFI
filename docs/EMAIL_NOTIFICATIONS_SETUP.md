# Configuration des Notifications Email - PONIA AI

## 📧 Intégrations Disponibles

PONIA AI supporte les services d'email suivants via Replit Integrations :

### 1. **Resend** (Recommandé)
- **ID Integration:** `connector:ccfg_resend_01K69QKYK789WN202XSE3QS17V`
- **Avantages:** Simple, moderne, API claire
- **Tarification:** 100 emails/jour gratuits, puis $20/mois pour 50k emails
- **Documentation:** https://resend.com/docs

### 2. **SendGrid**
- **ID Integration:** `connector:ccfg_sendgrid_01K69QKAPBPJ4SWD8GQHGY03D5`
- **Avantages:** Robuste, analytics avancées
- **Tarification:** 100 emails/jour gratuits, puis à partir de $15/mois
- **Documentation:** https://docs.sendgrid.com

### 3. **Replit Mail** (Blueprint)
- **ID Integration:** `blueprint:replitmail`
- **Avantages:** Intégré nativement, zéro configuration
- **Limitations:** Volume limité, fonctionnalités basiques

## 🚀 Activation (À faire plus tard)

### Étape 1 : Choisir le service email

```bash
# Option 1 : Resend (recommandé)
use_integration(integration_id="connector:ccfg_resend_01K69QKYK789WN202XSE3QS17V", operation="propose_setting_up")

# Option 2 : SendGrid
use_integration(integration_id="connector:ccfg_sendgrid_01K69QKAPBPJ4SWD8GQHGY03D5", operation="propose_setting_up")

# Option 3 : Replit Mail (basique)
use_integration(integration_id="blueprint:replitmail", operation="add")
```

### Étape 2 : Configurer les templates d'email

Créer `server/emailTemplates.js` :

```javascript
export const EMAIL_TEMPLATES = {
  stockAlert: (productName, quantity, unit) => ({
    subject: `⚠️ Alerte stock : ${productName}`,
    html: `
      <h2>Stock faible détecté</h2>
      <p><strong>${productName}</strong> est en stock critique :</p>
      <ul>
        <li>Quantité actuelle : ${quantity} ${unit}</li>
        <li>Action requise : Commander rapidement</li>
      </ul>
      <p>Connectez-vous à PONIA AI pour plus de détails.</p>
    `
  }),
  
  expiryAlert: (productName, daysUntilExpiry) => ({
    subject: `⏰ Produit en DLC courte : ${productName}`,
    html: `
      <h2>Date limite proche</h2>
      <p><strong>${productName}</strong> expire dans ${daysUntilExpiry} jours.</p>
      <p>Actions recommandées : promotion, mise en avant, don</p>
    `
  }),
  
  dailyReport: (stats) => ({
    subject: `📊 Rapport quotidien PONIA AI`,
    html: `
      <h2>Votre stock du jour</h2>
      <ul>
        <li>Produits critiques : ${stats.critical}</li>
        <li>Produits en stock faible : ${stats.low}</li>
        <li>Stock optimal : ${stats.healthy}</li>
      </ul>
    `
  })
}
```

### Étape 3 : Créer le service d'envoi

Créer `server/emailService.js` :

```javascript
// Exemple avec Resend
import { Resend } from 'resend'
import { EMAIL_TEMPLATES } from './emailTemplates.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendStockAlert(userEmail, productName, quantity, unit) {
  const template = EMAIL_TEMPLATES.stockAlert(productName, quantity, unit)
  
  try {
    await resend.emails.send({
      from: 'PONIA AI <alerts@poniaai.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html
    })
    console.log(`✅ Email envoyé à ${userEmail}`)
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
  }
}
```

### Étape 4 : Intégrer aux notifications

Modifier `server/index.js` pour déclencher les emails :

```javascript
import { sendStockAlert } from './emailService.js'
import { getPendingNotifications, markNotificationAsSent } from './storage.js'

// Endpoint pour traiter les notifications en attente
app.post('/api/notifications/process', async (req, res) => {
  try {
    const { userId } = req.body
    const pending = await getPendingNotifications(userId)
    
    for (const notification of pending) {
      if (notification.type === 'stock_alert') {
        await sendStockAlert(
          notification.userEmail,
          notification.productName,
          notification.quantity,
          notification.unit
        )
        await markNotificationAsSent(notification.id)
      }
    }
    
    res.json({ processed: pending.length })
  } catch (error) {
    res.status(500).json({ error: 'Erreur traitement notifications' })
  }
})
```

## 📝 Types de Notifications Planifiées

1. **Alertes Stock Critique** (immédiat)
   - Déclenché quand quantité ≤ 50% du seuil
   - Email envoyé instantanément

2. **Alertes DLC/DLUO** (quotidien)
   - Produits expirant sous 3 jours
   - Email à 9h chaque matin

3. **Rapport Quotidien** (quotidien)
   - Résumé du stock : critiques, faibles, optimal
   - Email à 18h

4. **Suggestions IA** (hebdomadaire)
   - Recommandations personnalisées
   - Email lundi 10h

## 🔐 Sécurité

- ✅ Clés API stockées côté serveur (jamais exposées au frontend)
- ✅ Rate limiting pour éviter spam
- ✅ Validation des adresses email
- ✅ Opt-out disponible dans Settings

## ⚙️ Configuration Utilisateur

Les utilisateurs peuvent contrôler leurs notifications dans **Settings > Notifications** :

```javascript
// Structure dans users table (déjà préparée)
{
  emailNotifications: boolean,
  stockAlerts: boolean,
  expiryAlerts: boolean,
  dailyReports: boolean
}
```

## 📊 Monitoring

Suivre les métriques email :
- Taux d'ouverture
- Taux de clics
- Taux de désabonnement
- Erreurs d'envoi

Les services comme SendGrid et Resend fournissent des dashboards analytics intégrés.

---

**Status Actuel :** 🟡 Prêt à activer - Intégrations disponibles mais non configurées  
**Activation Recommandée :** Après ajout Stripe (pour éviter coûts sur plan gratuit)
