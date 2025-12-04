import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'support@myponia.fr'

export async function sendLowStockAlert(userEmail, businessName, products) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] RESEND_API_KEY non configurée - email non envoyé')
    return { success: false, error: 'API key not configured' }
  }

  const productsList = products.map(p => 
    `• ${p.name}: ${p.currentQuantity} ${p.unit} restant(s) (seuil: ${p.alertThreshold})`
  ).join('\n')

  const productsHtml = products.map(p => 
    `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">${p.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #EF4444; font-weight: 600;">${p.currentQuantity} ${p.unit}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${p.alertThreshold}</td>
    </tr>`
  ).join('')

  try {
    const { data, error } = await resend.emails.send({
      from: `PONIA <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `⚠️ Alerte Stock Bas - ${products.length} produit(s) à commander`,
      text: `Bonjour ${businessName},

${products.length} produit(s) nécessitent votre attention :

${productsList}

Connectez-vous à PONIA pour générer un bon de commande automatique.

--
L'équipe PONIA
https://myponia.fr`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: #1F2937; margin: 0; font-size: 24px; }
    .content { background: #FFFFFF; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px; }
    .alert-badge { background: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #F9FAFB; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #E5E7EB; }
    .btn { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #1F2937; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 PONIA</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${businessName}</strong>,</p>
      
      <div class="alert-badge">⚠️ ${products.length} produit(s) en stock bas</div>
      
      <p>Les produits suivants nécessitent votre attention :</p>
      
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th style="text-align: center;">Stock actuel</th>
            <th style="text-align: center;">Seuil d'alerte</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>
      
      <p>Connectez-vous à PONIA pour générer automatiquement un bon de commande optimisé par l'IA.</p>
      
      <center>
        <a href="https://myponia.fr/dashboard" class="btn">Voir mes stocks →</a>
      </center>
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement par PONIA.<br>
      <a href="https://myponia.fr/settings">Gérer mes préférences d'alertes</a></p>
    </div>
  </div>
</body>
</html>`
    })

    if (error) {
      console.error('[EMAIL] Erreur envoi alerte stock:', error)
      return { success: false, error }
    }

    console.log(`[EMAIL] ✅ Alerte stock envoyée à ${userEmail} (${products.length} produits)`)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[EMAIL] Exception envoi email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendExpiryAlert(userEmail, businessName, products) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] RESEND_API_KEY non configurée - email non envoyé')
    return { success: false, error: 'API key not configured' }
  }

  const today = new Date()
  
  const productsList = products.map(p => {
    const expiryDate = new Date(p.expiryDate)
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    const urgency = daysLeft <= 1 ? '🔴' : daysLeft <= 3 ? '🟠' : '🟡'
    return `${urgency} ${p.name}: expire le ${expiryDate.toLocaleDateString('fr-FR')} (${daysLeft <= 0 ? 'EXPIRÉ' : `${daysLeft} jour(s)`})`
  }).join('\n')

  const productsHtml = products.map(p => {
    const expiryDate = new Date(p.expiryDate)
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    const urgencyColor = daysLeft <= 1 ? '#EF4444' : daysLeft <= 3 ? '#F97316' : '#EAB308'
    const urgencyText = daysLeft <= 0 ? 'EXPIRÉ' : `${daysLeft} jour(s)`
    return `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">${p.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${expiryDate.toLocaleDateString('fr-FR')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: ${urgencyColor}; font-weight: 600;">${urgencyText}</td>
    </tr>`
  }).join('')

  try {
    const { data, error } = await resend.emails.send({
      from: `PONIA <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `📅 Alerte DLC - ${products.length} produit(s) à surveiller`,
      text: `Bonjour ${businessName},

${products.length} produit(s) approchent de leur date limite de consommation :

${productsList}

Pensez à les mettre en avant ou à ajuster vos commandes.

--
L'équipe PONIA
https://myponia.fr`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #F97316, #EAB308); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: #1F2937; margin: 0; font-size: 24px; }
    .content { background: #FFFFFF; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px; }
    .alert-badge { background: #FEF3C7; color: #92400E; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #F9FAFB; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #E5E7EB; }
    .btn { display: inline-block; background: linear-gradient(135deg, #F97316, #EAB308); color: #1F2937; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
    .tip { background: #F0FDF4; border-left: 4px solid #22C55E; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 PONIA</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${businessName}</strong>,</p>
      
      <div class="alert-badge">📅 ${products.length} produit(s) à surveiller</div>
      
      <p>Les produits suivants approchent de leur date limite de consommation :</p>
      
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th style="text-align: center;">Date d'expiration</th>
            <th style="text-align: center;">Temps restant</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>
      
      <div class="tip">
        <strong>💡 Conseil PONIA :</strong> Mettez ces produits en avant (promotion, plat du jour) pour éviter le gaspillage et optimiser votre marge.
      </div>
      
      <center>
        <a href="https://myponia.fr/dashboard" class="btn">Gérer mes stocks →</a>
      </center>
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement par PONIA.<br>
      <a href="https://myponia.fr/settings">Gérer mes préférences d'alertes</a></p>
    </div>
  </div>
</body>
</html>`
    })

    if (error) {
      console.error('[EMAIL] Erreur envoi alerte DLC:', error)
      return { success: false, error }
    }

    console.log(`[EMAIL] ✅ Alerte DLC envoyée à ${userEmail} (${products.length} produits)`)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[EMAIL] Exception envoi email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendWelcomeEmail(userEmail, businessName) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] RESEND_API_KEY non configurée - email non envoyé')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `PONIA <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `🎉 Bienvenue sur PONIA, ${businessName} !`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 40px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: #1F2937; margin: 0; font-size: 28px; }
    .content { background: #FFFFFF; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px; }
    .feature { display: flex; align-items: flex-start; margin: 15px 0; }
    .feature-icon { font-size: 24px; margin-right: 15px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #1F2937; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; font-size: 16px; }
    .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
    .trial-badge { background: #DCFCE7; color: #166534; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bienvenue sur PONIA !</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${businessName}</strong>,</p>
      
      <p>Merci de faire confiance à PONIA pour gérer vos stocks intelligemment !</p>
      
      <center>
        <div class="trial-badge">✨ Votre essai gratuit de 14 jours commence maintenant</div>
      </center>
      
      <h3>Voici ce que PONIA peut faire pour vous :</h3>
      
      <div class="feature">
        <span class="feature-icon">🤖</span>
        <div>
          <strong>Assistant IA conversationnel</strong><br>
          Posez vos questions en langage naturel : "Quels produits dois-je commander ?"
        </div>
      </div>
      
      <div class="feature">
        <span class="feature-icon">⚡</span>
        <div>
          <strong>Alertes intelligentes</strong><br>
          Soyez prévenu avant les ruptures de stock et les dates d'expiration
        </div>
      </div>
      
      <div class="feature">
        <span class="feature-icon">📋</span>
        <div>
          <strong>Commandes automatiques</strong><br>
          Générez des bons de commande optimisés en un clic
        </div>
      </div>
      
      <div class="feature">
        <span class="feature-icon">⏱️</span>
        <div>
          <strong>Gagnez du temps</strong><br>
          Nos clients économisent en moyenne 7h par semaine
        </div>
      </div>
      
      <center>
        <a href="https://myponia.fr/dashboard" class="btn">Commencer maintenant →</a>
      </center>
      
      <p style="margin-top: 30px; color: #6B7280;">Une question ? Répondez directement à cet email, nous vous répondrons rapidement.</p>
    </div>
    <div class="footer">
      <p>PONIA - L'IA qui gère vos stocks<br>
      <a href="https://myponia.fr">myponia.fr</a></p>
    </div>
  </div>
</body>
</html>`
    })

    if (error) {
      console.error('[EMAIL] Erreur envoi email bienvenue:', error)
      return { success: false, error }
    }

    console.log(`[EMAIL] ✅ Email de bienvenue envoyé à ${userEmail}`)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[EMAIL] Exception envoi email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendTestEmail(userEmail) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY non configurée' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `PONIA <${FROM_EMAIL}>`,
      to: userEmail,
      subject: '✅ Test alertes PONIA',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; text-align: center;">
    <h1 style="color: #1F2937;">✅ Configuration réussie !</h1>
    <p style="color: #6B7280;">Vos alertes email PONIA sont correctement configurées.</p>
    <p style="color: #6B7280;">Vous recevrez désormais des notifications pour :</p>
    <ul style="text-align: left; color: #374151;">
      <li>Les stocks bas</li>
      <li>Les dates de péremption proches</li>
    </ul>
    <p style="margin-top: 30px;">
      <a href="https://myponia.fr/settings" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Gérer mes alertes</a>
    </p>
  </div>
</body>
</html>`
    })

    if (error) {
      console.error('[EMAIL] Erreur envoi test:', error)
      return { success: false, error }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[EMAIL] Exception test email:', error)
    return { success: false, error: error.message }
  }
}
