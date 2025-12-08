import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

const GOLD = '#FFD700'
const DARK = '#1F2937'
const GRAY = '#6B7280'
const LIGHT_GRAY = '#F3F4F6'
const WHITE = '#FFFFFF'
const BLUE = '#3B82F6'
const GREEN = '#10B981'
const PURPLE = '#8B5CF6'
const RED = '#DC2626'
const ORANGE = '#F59E0B'

export function generateGuidePDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    autoFirstPage: true
  })

  const pageWidth = 595
  const pageHeight = 842
  const margin = 50
  const contentWidth = pageWidth - (margin * 2)

  function drawHeader(title, subtitle = null) {
    doc.fontSize(24).fillColor(GOLD).font('Helvetica-Bold').text(title, margin, 50)
    if (subtitle) {
      doc.fontSize(11).fillColor(GRAY).font('Helvetica').text(subtitle, margin, 80)
    }
    doc.strokeColor(GOLD).lineWidth(2).moveTo(margin, subtitle ? 100 : 85).lineTo(pageWidth - margin, subtitle ? 100 : 85).stroke()
    return subtitle ? 120 : 105
  }

  function drawSectionTitle(title, y, icon = '') {
    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text(`${icon} ${title}`, margin, y)
    return y + 25
  }

  function drawParagraph(text, y, indent = 0) {
    doc.fontSize(10).fillColor(DARK).font('Helvetica').text(text, margin + indent, y, { width: contentWidth - indent, lineGap: 4 })
    return y + doc.heightOfString(text, { width: contentWidth - indent }) + 15
  }

  function drawBulletPoint(text, y, bulletColor = GOLD) {
    doc.fontSize(10).fillColor(bulletColor).font('Helvetica-Bold').text('•', margin + 10, y)
    doc.fontSize(10).fillColor(DARK).font('Helvetica').text(text, margin + 25, y, { width: contentWidth - 25 })
    return y + doc.heightOfString(text, { width: contentWidth - 25 }) + 8
  }

  function drawFeatureBox(title, description, y, color = BLUE) {
    const boxHeight = 55
    doc.roundedRect(margin, y, contentWidth, boxHeight, 8).fillAndStroke(WHITE, color)
    doc.roundedRect(margin, y, 6, boxHeight, 3).fill(color)
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(title, margin + 20, y + 12, { width: contentWidth - 30 })
    doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(description, margin + 20, y + 30, { width: contentWidth - 30 })
    return y + boxHeight + 12
  }

  function drawIconFeature(icon, title, desc, x, y, width) {
    doc.roundedRect(x, y, width, 75, 8).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.fontSize(24).fillColor(GOLD).text(icon, x + 10, y + 10)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(title, x + 10, y + 40, { width: width - 20 })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(desc, x + 10, y + 55, { width: width - 20 })
    return y + 85
  }

  // =====================
  // PAGE 1 - COUVERTURE
  // =====================
  doc.rect(0, 0, pageWidth, pageHeight).fill(DARK)
  
  try {
    const logoPath = path.join(process.cwd(), 'public', 'ponia-logo-full.png')
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, (pageWidth - 280) / 2, 200, { fit: [280, 100], align: 'center' })
    }
  } catch (e) {
    doc.fontSize(48).fillColor(GOLD).font('Helvetica-Bold').text('PONIA', 0, 220, { width: pageWidth, align: 'center' })
  }
  
  doc.fontSize(32).fillColor(WHITE).font('Helvetica-Bold').text('GUIDE COMPLET', 0, 340, { width: pageWidth, align: 'center' })
  doc.fontSize(18).fillColor(GOLD).font('Helvetica').text('A - Z', 0, 380, { width: pageWidth, align: 'center' })
  
  doc.roundedRect((pageWidth - 400) / 2, 440, 400, 3, 1).fill(GOLD)
  
  doc.fontSize(14).fillColor(LIGHT_GRAY).font('Helvetica').text('Gestion de Stock Intelligente avec IA', 0, 480, { width: pageWidth, align: 'center' })
  doc.fontSize(11).fillColor(GRAY).text('Pour boulangeries, restaurants, bars, caves a vin et fromageries', 0, 510, { width: pageWidth, align: 'center' })
  
  doc.fontSize(10).fillColor(GOLD).text('www.ponia.io', 0, pageHeight - 80, { width: pageWidth, align: 'center' })
  doc.fontSize(8).fillColor(GRAY).text('Version 2024', 0, pageHeight - 60, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 2 - QU'EST-CE QUE PONIA ?
  // =====================
  doc.addPage()
  let y = drawHeader("QU'EST-CE QUE PONIA ?", "Votre assistant intelligent pour la gestion de stock")
  
  y = drawParagraph("PONIA est une solution SaaS de gestion de stock propulsee par l'Intelligence Artificielle, concue specialement pour les commerces alimentaires francais : boulangeries, patisseries, restaurants, bars, caves a vin et fromageries.", y)
  
  y += 10
  y = drawSectionTitle("Le Probleme", y, "⚠️")
  y = drawBulletPoint("Vous passez des heures chaque semaine a gerer vos stocks manuellement", y, RED)
  y = drawBulletPoint("Vous subissez des ruptures de stock qui frustrent vos clients", y, RED)
  y = drawBulletPoint("Vous jetez des produits perimes, ce qui represente une perte financiere", y, RED)
  y = drawBulletPoint("Vous commandez trop ou pas assez, sans visibilite claire", y, RED)
  
  y += 15
  y = drawSectionTitle("La Solution PONIA", y, "✨")
  y = drawBulletPoint("Economisez 7 heures par semaine grace a l'automatisation", y, GREEN)
  y = drawBulletPoint("Recevez des alertes AVANT les ruptures de stock", y, GREEN)
  y = drawBulletPoint("Reduisez le gaspillage avec les alertes de peremption", y, GREEN)
  y = drawBulletPoint("Generez des bons de commande intelligents en 1 clic", y, GREEN)
  
  y += 20
  doc.roundedRect(margin, y, contentWidth, 80, 10).fill('#FEF3C7')
  doc.fontSize(16).fillColor('#92400E').font('Helvetica-Bold').text('"Temps = Argent"', margin + 20, y + 15)
  doc.fontSize(11).fillColor(DARK).font('Helvetica').text("PONIA vous fait gagner du temps pour vous concentrer sur ce qui compte vraiment : vos clients et votre metier.", margin + 20, y + 42, { width: contentWidth - 40 })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 2', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 3 - FONCTIONNALITES PRINCIPALES
  // =====================
  doc.addPage()
  y = drawHeader("FONCTIONNALITES PRINCIPALES", "Les outils essentiels pour gerer votre stock au quotidien")
  
  y = drawFeatureBox(
    "Dashboard IA Central",
    "Votre tableau de bord intelligent affiche en temps reel l'etat de vos stocks, les alertes prioritaires et les suggestions de l'IA. Tout est visible en un coup d'oeil des l'ouverture de l'application.",
    y, BLUE
  )
  
  y = drawFeatureBox(
    "Chat IA Conversationnel",
    "Posez vos questions en langage naturel : 'Quels produits commander cette semaine ?' ou 'Quels articles arrivent a peremption ?'. L'IA repond instantanement avec des recommandations personnalisees.",
    y, PURPLE
  )
  
  y = drawFeatureBox(
    "Gestion des Stocks en Temps Reel",
    "Ajoutez, modifiez et suivez vos produits facilement. Interface tactile optimisee pour smartphone : ajustez les quantites en 2 secondes avec les boutons +/-.",
    y, GREEN
  )
  
  y = drawFeatureBox(
    "Score de Sante Stock",
    "Un indicateur visuel (0-100%) vous montre instantanement la sante globale de votre inventaire. Vert = tout va bien, Orange = attention requise, Rouge = action urgente.",
    y, ORANGE
  )
  
  y = drawFeatureBox(
    "Widget Temps Economise",
    "Visualisez le temps et l'argent economises chaque semaine grace a PONIA. Motivant et concret pour mesurer votre retour sur investissement.",
    y, GOLD
  )
  
  y += 10
  y = drawSectionTitle("Interface Mobile-First", y, "📱")
  y = drawParagraph("PONIA est concu pour etre utilise sur smartphone pendant l'inventaire. Grands boutons, navigation intuitive, mise a jour en 30 secondes. Pas besoin d'etre expert en technologie !", y)
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 3', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 4 - INTELLIGENCE ARTIFICIELLE
  // =====================
  doc.addPage()
  y = drawHeader("INTELLIGENCE ARTIFICIELLE", "8 types de suggestions pour anticiper tous vos besoins")
  
  const aiFeatures = [
    { icon: "📅", title: "Alertes Peremption", desc: "Notification 7 jours avant expiration pour eviter le gaspillage", color: RED },
    { icon: "📉", title: "Predictions Rupture", desc: "L'IA detecte les risques de rupture selon vos tendances de vente", color: ORANGE },
    { icon: "📈", title: "Alertes Surstock", desc: "Evitez d'immobiliser votre tresorerie dans du stock excessif", color: BLUE },
    { icon: "🌤️", title: "Impact Meteo", desc: "Previsions adaptees : +20% boissons si canicule, +15% soupes si froid", color: PURPLE },
    { icon: "⚠️", title: "Detection Anomalies", desc: "L'IA repere les variations inhabituelles dans vos consommations", color: RED },
    { icon: "🍽️", title: "Idees Plat du Jour", desc: "Suggestions creatives basees sur vos stocks disponibles", color: GREEN },
    { icon: "📦", title: "Rappels Commande", desc: "Rappels automatiques pour vos fournisseurs habituels", color: ORANGE },
    { icon: "📊", title: "Tendances Ventes", desc: "Analyse des patterns de vente pour optimiser vos achats", color: BLUE }
  ]
  
  const colWidth = (contentWidth - 15) / 2
  aiFeatures.forEach((feat, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = margin + (col * (colWidth + 15))
    const boxY = y + (row * 75)
    
    doc.roundedRect(x, boxY, colWidth, 65, 6).fillAndStroke(WHITE, feat.color)
    doc.roundedRect(x, boxY, 5, 65, 2).fill(feat.color)
    doc.fontSize(20).text(feat.icon, x + 15, boxY + 8)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(feat.title, x + 45, boxY + 10, { width: colWidth - 55 })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(feat.desc, x + 45, boxY + 28, { width: colWidth - 55, lineGap: 2 })
  })
  
  y += (Math.ceil(aiFeatures.length / 2) * 75) + 20
  
  doc.roundedRect(margin, y, contentWidth, 60, 8).fill('#F3E8FF')
  doc.fontSize(12).fillColor(PURPLE).font('Helvetica-Bold').text('Technologie GPT-4o-mini', margin + 15, y + 12)
  doc.fontSize(9).fillColor(DARK).font('Helvetica').text("PONIA utilise les derniers modeles d'IA d'OpenAI pour des predictions precises et des recommandations pertinentes, adaptees a votre type de commerce et vos habitudes.", margin + 15, y + 32, { width: contentWidth - 30 })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 4', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 5 - COMMANDES INTELLIGENTES
  // =====================
  doc.addPage()
  y = drawHeader("COMMANDES INTELLIGENTES", "Generez vos bons de commande en 1 clic")
  
  y = drawParagraph("PONIA analyse vos stocks, vos tendances de vente et les previsions meteo pour generer automatiquement des bons de commande optimises. Plus besoin de calculer manuellement !", y)
  
  y += 5
  y = drawSectionTitle("Ce que contient votre bon de commande", y, "📄")
  
  const orderFeatures = [
    "Liste des produits a commander avec quantites suggerees",
    "Separation commandes urgentes (<48h) et commandes semaine",
    "Prix unitaires et total estimatif",
    "Score de sante de votre stock actuel",
    "Previsions meteo et impact sur les ventes",
    "Alertes de peremption a venir",
    "Recommandations personnalisees de l'IA"
  ]
  
  orderFeatures.forEach(feat => {
    y = drawBulletPoint(feat, y, GOLD)
  })
  
  y += 15
  y = drawSectionTitle("Options d'export", y, "📤")
  
  const exportWidth = (contentWidth - 20) / 3
  const exports = [
    { icon: "📄", title: "PDF", desc: "Telecharger" },
    { icon: "💬", title: "WhatsApp", desc: "Copier le texte" },
    { icon: "📧", title: "Email", desc: "Envoyer direct" }
  ]
  
  exports.forEach((exp, i) => {
    const x = margin + (i * (exportWidth + 10))
    doc.roundedRect(x, y, exportWidth, 60, 6).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.fontSize(22).text(exp.icon, x + (exportWidth - 30) / 2, y + 8)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(exp.title, x, y + 35, { width: exportWidth, align: 'center' })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(exp.desc, x, y + 48, { width: exportWidth, align: 'center' })
  })
  
  y += 80
  
  y = drawSectionTitle("Processus simplifie", y, "🔄")
  
  const steps = ["Ouvrez PONIA", "Cliquez 'Generer commande'", "Verifiez les suggestions", "Exportez et envoyez"]
  const stepWidth = (contentWidth - 30) / 4
  
  steps.forEach((step, i) => {
    const x = margin + (i * (stepWidth + 10))
    doc.circle(x + stepWidth / 2, y + 20, 18).fillAndStroke(GOLD, DARK)
    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text((i + 1).toString(), x + stepWidth / 2 - 5, y + 13)
    doc.fontSize(8).fillColor(DARK).font('Helvetica').text(step, x, y + 45, { width: stepWidth, align: 'center' })
  })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 5', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 6 - INTEGRATIONS & MULTI-LANGUES
  // =====================
  doc.addPage()
  y = drawHeader("INTEGRATIONS & LANGUES", "Connectez vos outils et travaillez dans votre langue")
  
  y = drawSectionTitle("Integrations Caisses (POS)", y, "🔌")
  y = drawParagraph("Connectez PONIA a votre systeme de caisse pour synchroniser automatiquement vos ventes et ajuster vos stocks en temps reel. Configuration simple, sans intervention technique.", y)
  
  const posIntegrations = [
    { name: "Square", desc: "Sync automatique" },
    { name: "SumUp", desc: "Compatible" },
    { name: "Zettle", desc: "PayPal" },
    { name: "Hiboutik", desc: "API directe" },
    { name: "Lightspeed", desc: "X & K Series" },
    { name: "Tiller", desc: "Restaurants" }
  ]
  
  const posWidth = (contentWidth - 25) / 3
  posIntegrations.forEach((pos, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = margin + (col * (posWidth + 12))
    const boxY = y + (row * 50)
    
    doc.roundedRect(x, boxY, posWidth, 42, 6).fillAndStroke(WHITE, BLUE)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(pos.name, x + 10, boxY + 10, { width: posWidth - 20 })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(pos.desc, x + 10, boxY + 25, { width: posWidth - 20 })
  })
  
  y += (Math.ceil(posIntegrations.length / 3) * 50) + 25
  
  y = drawSectionTitle("Support Multi-Langues", y, "🌍")
  y = drawParagraph("PONIA s'adapte a votre langue pour une experience naturelle et intuitive.", y)
  
  const languages = [
    { flag: "🇫🇷", name: "Francais" },
    { flag: "🇬🇧", name: "English" },
    { flag: "🇪🇸", name: "Espanol" },
    { flag: "🇩🇪", name: "Deutsch" },
    { flag: "🇸🇦", name: "العربية" },
    { flag: "🇨🇳", name: "中文" }
  ]
  
  const langWidth = (contentWidth - 50) / 6
  languages.forEach((lang, i) => {
    const x = margin + (i * (langWidth + 10))
    doc.roundedRect(x, y, langWidth, 55, 6).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.fontSize(22).text(lang.flag, x + (langWidth - 25) / 2, y + 8)
    doc.fontSize(8).fillColor(DARK).font('Helvetica').text(lang.name, x, y + 38, { width: langWidth, align: 'center' })
  })
  
  y += 75
  
  y = drawSectionTitle("Autres Fonctionnalites", y, "⚙️")
  
  const otherFeatures = [
    "Calendrier Google integre pour planifier vos commandes",
    "Alertes email automatiques personnalisables",
    "Export des donnees en CSV",
    "Mode hors-ligne pour les zones sans connexion",
    "Support multi-magasins (Plan Pro)"
  ]
  
  otherFeatures.forEach(feat => {
    y = drawBulletPoint(feat, y, GOLD)
  })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 6', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 7 - TARIFS
  // =====================
  doc.addPage()
  y = drawHeader("NOS OFFRES", "Un plan adapte a chaque commerce")
  
  y = drawParagraph("PONIA propose trois formules pour repondre aux besoins de tous les commerces, du petit artisan au multi-magasins.", y)
  
  y += 10
  
  const plans = [
    {
      name: "BASIQUE",
      price: "GRATUIT",
      period: "pour toujours",
      color: GRAY,
      features: [
        "10 produits maximum",
        "5 messages IA par jour",
        "Alertes de stock basiques",
        "Dashboard simplifie",
        "Acces mobile"
      ],
      highlight: false
    },
    {
      name: "STANDARD",
      price: "49€",
      period: "par mois",
      color: BLUE,
      features: [
        "50 produits",
        "IA illimitee",
        "Predictions 7 jours",
        "Integrations POS",
        "Export PDF/WhatsApp",
        "Support email"
      ],
      highlight: true
    },
    {
      name: "PRO",
      price: "69€",
      period: "par mois",
      color: GOLD,
      features: [
        "Produits illimites",
        "Predictions 30 jours",
        "Commandes vocales",
        "Multi-magasins",
        "API personnalisee",
        "Support prioritaire"
      ],
      highlight: false
    }
  ]
  
  const planWidth = (contentWidth - 20) / 3
  const planHeight = 280
  
  plans.forEach((plan, i) => {
    const x = margin + (i * (planWidth + 10))
    const bgColor = plan.highlight ? '#EFF6FF' : WHITE
    
    doc.roundedRect(x, y, planWidth, planHeight, 10).fillAndStroke(bgColor, plan.color)
    doc.lineWidth(plan.highlight ? 3 : 1)
    
    if (plan.highlight) {
      doc.roundedRect(x + 20, y - 10, planWidth - 40, 20, 5).fill(plan.color)
      doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold').text('RECOMMANDE', x + 20, y - 6, { width: planWidth - 40, align: 'center' })
    }
    
    doc.fontSize(14).fillColor(plan.color).font('Helvetica-Bold').text(plan.name, x, y + 25, { width: planWidth, align: 'center' })
    doc.fontSize(28).fillColor(DARK).font('Helvetica-Bold').text(plan.price, x, y + 50, { width: planWidth, align: 'center' })
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(plan.period, x, y + 85, { width: planWidth, align: 'center' })
    
    doc.strokeColor(LIGHT_GRAY).lineWidth(1).moveTo(x + 15, y + 105).lineTo(x + planWidth - 15, y + 105).stroke()
    
    let featY = y + 120
    plan.features.forEach(feat => {
      doc.fontSize(9).fillColor(GREEN).font('Helvetica').text('✓', x + 12, featY)
      doc.fontSize(9).fillColor(DARK).font('Helvetica').text(feat, x + 28, featY, { width: planWidth - 40 })
      featY += 22
    })
  })
  
  y += planHeight + 25
  
  doc.roundedRect(margin, y, contentWidth, 50, 8).fill('#F0FDF4')
  doc.fontSize(12).fillColor(GREEN).font('Helvetica-Bold').text('Essai Gratuit 14 Jours', margin + 15, y + 12)
  doc.fontSize(10).fillColor(DARK).font('Helvetica').text('Testez toutes les fonctionnalites Standard sans engagement. Aucune carte bancaire requise.', margin + 15, y + 30, { width: contentWidth - 30 })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 7', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  // =====================
  // PAGE 8 - DEMARRER & CONTACT
  // =====================
  doc.addPage()
  y = drawHeader("DEMARREZ AVEC PONIA", "En 3 etapes simples")
  
  const startSteps = [
    { num: "1", title: "Creez votre compte", desc: "Inscrivez-vous gratuitement sur www.ponia.io avec votre email. Aucune carte bancaire requise pour l'essai." },
    { num: "2", title: "Ajoutez vos produits", desc: "Saisissez vos articles avec nom, quantite actuelle et seuil d'alerte. L'IA commence a analyser immediatement." },
    { num: "3", title: "Laissez l'IA travailler", desc: "Recevez des alertes, suggestions et commandes optimisees. Mettez a jour vos stocks en 30 secondes par jour." }
  ]
  
  startSteps.forEach((step, i) => {
    doc.roundedRect(margin, y, contentWidth, 65, 8).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.circle(margin + 35, y + 32, 22).fill(GOLD)
    doc.fontSize(20).fillColor(DARK).font('Helvetica-Bold').text(step.num, margin + 28, y + 22)
    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold').text(step.title, margin + 70, y + 12, { width: contentWidth - 90 })
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(step.desc, margin + 70, y + 32, { width: contentWidth - 90, lineGap: 2 })
    y += 75
  })
  
  y += 15
  y = drawSectionTitle("Besoin d'aide ?", y, "💬")
  
  doc.roundedRect(margin, y, contentWidth, 90, 10).fill(DARK)
  doc.fontSize(14).fillColor(WHITE).font('Helvetica-Bold').text('Support & Contact', margin + 20, y + 15)
  doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica')
     .text('Email : poniapro@proton.me', margin + 20, y + 38)
     .text('Site web : www.ponia.io', margin + 20, y + 55)
     .text('Reponse sous 24h pour les clients Standard et Pro', margin + 20, y + 72)
  
  y += 110
  
  doc.roundedRect(margin, y, contentWidth, 70, 10).fillAndStroke('#FEF3C7', GOLD)
  doc.fontSize(14).fillColor('#92400E').font('Helvetica-Bold').text('Pret a economiser 7 heures par semaine ?', margin + 20, y + 15)
  doc.fontSize(11).fillColor(DARK).font('Helvetica').text('Rejoignez les commercants qui ont deja choisi PONIA pour simplifier leur gestion de stock et augmenter leur rentabilite.', margin + 20, y + 38, { width: contentWidth - 40 })
  
  y += 90
  
  try {
    const iconPath = path.join(process.cwd(), 'public', 'ponia-icon.png')
    if (fs.existsSync(iconPath)) {
      doc.image(iconPath, (pageWidth - 60) / 2, y, { fit: [60, 60], align: 'center' })
    }
  } catch (e) {}
  
  doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold').text('www.ponia.io', 0, y + 70, { width: pageWidth, align: 'center' })
  
  doc.fontSize(8).fillColor(GRAY).text('PONIA - Guide A-Z | Page 8', 0, pageHeight - 40, { width: pageWidth, align: 'center' })

  return doc
}

export async function saveGuidePDF() {
  const doc = generateGuidePDF()
  const outputPath = path.join(process.cwd(), 'public', 'Guide-PONIA-A-Z.pdf')
  
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath)
    doc.pipe(writeStream)
    doc.end()
    
    writeStream.on('finish', () => {
      console.log('Guide PDF saved to:', outputPath)
      resolve(outputPath)
    })
    writeStream.on('error', reject)
  })
}
