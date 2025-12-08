import PDFDocument from 'pdfkit'
import path from 'path'

export function generateOrderPDF(orderData) {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 40,
    bufferPages: true
  })

  const { 
    storeName, 
    storeAddress, 
    date, 
    urgentProducts = [], 
    weeklyProducts = [], 
    recommendations = [], 
    totalAmount,
    suggestions = [],
    weatherData,
    stockHealth = {},
    expiryAlerts = [],
    timeSaved = {},
    referralCode,
    userPlan
  } = orderData

  const GOLD = '#FFD700'
  const DARK = '#1F2937'
  const GRAY = '#6B7280'
  const LIGHT_GRAY = '#F3F4F6'
  const RED = '#DC2626'
  const ORANGE = '#F59E0B'
  const GREEN = '#10B981'
  const BLUE = '#3B82F6'
  const PURPLE = '#8B5CF6'

  const tableLeft = 40
  const tableWidth = 515

  try {
    const logoPath = path.join(process.cwd(), 'public', 'ponia-logo.png')
    doc.image(logoPath, tableLeft, 30, { fit: [160, 50], align: 'left' })
  } catch (error) {
    doc.fontSize(22).fillColor(GOLD).font('Helvetica-Bold').text('PONIA', tableLeft, 35)
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text('Gestion Intelligente de Stock', tableLeft, 58)
  }

  doc.fontSize(16).fillColor(DARK).font('Helvetica-Bold').text('BON DE COMMANDE INTELLIGENT', tableLeft, 90)
  doc.fontSize(9).fillColor(DARK).font('Helvetica')
     .text(`Commerce : ${storeName}`, tableLeft, 115)
  if (storeAddress) doc.text(`Adresse : ${storeAddress}`, tableLeft, 128)
  const dateY = storeAddress ? 141 : 128
  doc.text(`Date : ${date}`, tableLeft, dateY)

  let yPosition = dateY + 25

  // SECTION 1: Score de Santé Stock + Temps Économisé (côte à côte)
  const boxWidth = (tableWidth - 15) / 2
  
  // Box Score de Santé
  doc.roundedRect(tableLeft, yPosition, boxWidth, 70, 8).fillAndStroke('#F0FDF4', GREEN)
  doc.fontSize(9).fillColor(GREEN).font('Helvetica-Bold').text('SANTE STOCK', tableLeft + 10, yPosition + 8)
  
  const scoreColor = stockHealth.score >= 70 ? GREEN : stockHealth.score >= 40 ? ORANGE : RED
  doc.fontSize(28).fillColor(scoreColor).font('Helvetica-Bold').text(`${stockHealth.score || 0}%`, tableLeft + 10, yPosition + 22)
  doc.fontSize(7).fillColor(DARK).font('Helvetica')
     .text(`${stockHealth.healthy || 0} sains | ${stockHealth.low || 0} bas | ${stockHealth.critical || 0} critiques`, tableLeft + 10, yPosition + 52)

  // Box Temps Économisé
  const timeBoxX = tableLeft + boxWidth + 15
  doc.roundedRect(timeBoxX, yPosition, boxWidth, 70, 8).fillAndStroke('#FEF3C7', GOLD)
  doc.fontSize(9).fillColor('#92400E').font('Helvetica-Bold').text('TEMPS ECONOMISE', timeBoxX + 10, yPosition + 8)
  doc.fontSize(22).fillColor(GOLD).font('Helvetica-Bold').text(`${timeSaved.minutes || 0} min`, timeBoxX + 10, yPosition + 24)
  doc.fontSize(9).fillColor('#92400E').font('Helvetica').text(`= ${timeSaved.value || 0}€ de valeur`, timeBoxX + 10, yPosition + 48)
  doc.fontSize(7).fillColor(GRAY).text('cette semaine avec PONIA', timeBoxX + 10, yPosition + 58)

  yPosition += 85

  // SECTION 2: Prévisions Météo (si disponible)
  if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
    doc.fontSize(10).fillColor(BLUE).font('Helvetica-Bold').text('PREVISIONS METEO & IMPACT VENTES', tableLeft, yPosition)
    yPosition += 15
    
    doc.roundedRect(tableLeft, yPosition, tableWidth, 45, 6).fillAndStroke('#EFF6FF', BLUE)
    
    const forecast = weatherData.forecast.slice(0, 3)
    const forecastWidth = tableWidth / 3
    
    forecast.forEach((day, i) => {
      const x = tableLeft + (i * forecastWidth) + 10
      const emoji = day.icon?.includes('01') || day.icon?.includes('02') ? '☀️' : 
                    day.icon?.includes('09') || day.icon?.includes('10') ? '🌧️' : 
                    day.icon?.includes('13') ? '❄️' : '☁️'
      
      doc.fontSize(8).fillColor(DARK).font('Helvetica-Bold').text(`${emoji} ${day.date || 'J+' + (i+1)}`, x, yPosition + 8)
      doc.fontSize(7).fillColor(GRAY).font('Helvetica')
         .text(`${Math.round(day.temp || 15)}°C`, x, yPosition + 20)
      
      const impact = day.temp > 25 ? '+20% boissons fraîches' : day.temp < 10 ? '+15% plats chauds' : 'Normal'
      doc.fontSize(6).fillColor(BLUE).text(impact, x, yPosition + 30, { width: forecastWidth - 20 })
    })
    
    yPosition += 55
  }

  // SECTION 3: Alertes Péremption
  if (expiryAlerts.length > 0) {
    doc.fontSize(10).fillColor(RED).font('Helvetica-Bold').text('ALERTES PEREMPTION (7 jours)', tableLeft, yPosition)
    yPosition += 15
    
    doc.roundedRect(tableLeft, yPosition, tableWidth, Math.min(expiryAlerts.length * 18 + 10, 60), 6).fillAndStroke('#FEF2F2', RED)
    
    expiryAlerts.slice(0, 3).forEach((alert, i) => {
      const emoji = alert.daysUntil <= 2 ? '🔴' : '🟠'
      doc.fontSize(8).fillColor(DARK).font('Helvetica')
         .text(`${emoji} ${alert.name}: ${alert.quantity} ${alert.unit} - expire dans ${alert.daysUntil}j`, tableLeft + 10, yPosition + 8 + (i * 16))
    })
    
    yPosition += Math.min(expiryAlerts.length * 18 + 15, 70)
  }

  // SECTION 4: Suggestions IA
  if (suggestions.length > 0) {
    doc.fontSize(10).fillColor(PURPLE).font('Helvetica-Bold').text('SUGGESTIONS IA PONIA', tableLeft, yPosition)
    yPosition += 15
    
    const priorityEmoji = { critical: '🔴', important: '🟠', normal: '🟢' }
    const typeEmoji = { 
      peremption: '📅', rupture: '📉', surstock: '📈', 
      meteo: '🌤️', anomalie: '⚠️', plat_jour: '🍽️', 
      rappel_commande: '📦', tendance: '📊' 
    }
    
    suggestions.slice(0, 4).forEach((sug, i) => {
      const emoji = typeEmoji[sug.type] || '💡'
      const prioEmoji = priorityEmoji[sug.priority] || ''
      doc.fontSize(8).fillColor(DARK).font('Helvetica')
         .text(`${prioEmoji} ${emoji} ${sug.message || sug.title}`, tableLeft + 5, yPosition, { width: tableWidth - 10 })
      yPosition += 14
    })
    
    yPosition += 10
  }

  // Vérifier si on doit passer à une nouvelle page
  if (yPosition > 500) {
    doc.addPage()
    yPosition = 50
  }

  // SECTION 5: Tableaux des commandes (existant)
  const colWidths = { product: 190, qty: 65, unit: 55, unitPrice: 100, total: 105 }

  function drawProductsTable(products, title, titleColor, startY) {
    let currentY = startY

    doc.fontSize(10).fillColor(titleColor).font('Helvetica-Bold').text(title, tableLeft, currentY)
    currentY += 20

    if (products.length === 0) {
      doc.fontSize(8).fillColor(GRAY).font('Helvetica').text('Aucun produit dans cette categorie', tableLeft, currentY)
      return currentY + 20
    }

    doc.fillColor('#374151').rect(tableLeft, currentY, tableWidth, 18).fill()
    doc.fontSize(7).fillColor('white').font('Helvetica-Bold')
       .text('PRODUIT', tableLeft + 5, currentY + 5, { width: colWidths.product })
       .text('QTE', tableLeft + colWidths.product + 5, currentY + 5, { width: colWidths.qty })
       .text('UNITE', tableLeft + colWidths.product + colWidths.qty + 5, currentY + 5, { width: colWidths.unit })
       .text('P.U.', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, currentY + 5, { width: colWidths.unitPrice - 5, align: 'right' })
       .text('TOTAL', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, currentY + 5, { width: colWidths.total - 10, align: 'right' })

    currentY += 18
    doc.font('Helvetica')

    products.forEach((product, index) => {
      const rowHeight = 18
      if (index % 2 === 0) {
        doc.fillColor(LIGHT_GRAY).rect(tableLeft, currentY, tableWidth, rowHeight).fill()
      }

      const unitPrice = product.unitPrice || 0
      const total = product.suggestedQuantity * unitPrice

      doc.fillColor(DARK).fontSize(7)
         .text(product.name, tableLeft + 5, currentY + 5, { width: colWidths.product - 10, ellipsis: true })
         .text(product.suggestedQuantity.toString(), tableLeft + colWidths.product + 5, currentY + 5, { width: colWidths.qty - 10 })
         .text(product.unit || 'unite', tableLeft + colWidths.product + colWidths.qty + 5, currentY + 5, { width: colWidths.unit - 10 })
         .text(`${unitPrice.toFixed(2)} EUR`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, currentY + 5, { width: colWidths.unitPrice - 10, align: 'right' })
         .text(`${total.toFixed(2)} EUR`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, currentY + 5, { width: colWidths.total - 15, align: 'right' })

      currentY += rowHeight
    })

    return currentY + 10
  }

  yPosition = drawProductsTable(urgentProducts, 'COMMANDES URGENTES (livraison <48h)', RED, yPosition)
  yPosition += 5
  yPosition = drawProductsTable(weeklyProducts, 'COMMANDES SEMAINE (livraison 3-5j)', ORANGE, yPosition)

  yPosition += 10
  doc.strokeColor(GOLD).lineWidth(2).moveTo(tableLeft, yPosition).lineTo(tableLeft + tableWidth, yPosition).stroke()
  yPosition += 12

  doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
     .text('MONTANT TOTAL INDICATIF :', tableLeft + tableWidth - 240, yPosition, { width: 150, align: 'right' })
     .fontSize(12).fillColor(GOLD)
     .text(`${totalAmount.toFixed(2)} EUR`, tableLeft + tableWidth - 90, yPosition, { width: 90, align: 'right' })

  yPosition += 30

  // SECTION 6: Recommandations IA
  if (recommendations.length > 0) {
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text('RECOMMANDATIONS IA', tableLeft, yPosition)
    yPosition += 15
    recommendations.forEach((rec, index) => {
      doc.fontSize(7).fillColor(DARK).font('Helvetica').text(`${index + 1}. ${rec}`, tableLeft + 5, yPosition, { width: tableWidth - 10 })
      yPosition += 12
    })
    yPosition += 10
  }

  // Nouvelle page pour infos commerciales
  doc.addPage()
  yPosition = 50

  // SECTION 7: Guide Ajout Produits
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('COMMENT UTILISER PONIA ?', tableLeft, yPosition)
  yPosition += 25

  const steps = [
    { num: '1', title: 'Ajoutez vos produits', desc: 'Stock > + Ajouter > Nom, quantite, seuil alerte' },
    { num: '2', title: 'Mettez a jour en 30 sec', desc: 'Cliquez +/- pour ajuster les quantites rapidement' },
    { num: '3', title: 'Recevez des alertes IA', desc: 'PONIA vous previent avant les ruptures et pertes' }
  ]

  steps.forEach((step, i) => {
    doc.roundedRect(tableLeft, yPosition, tableWidth, 35, 6).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.fontSize(18).fillColor(GOLD).font('Helvetica-Bold').text(step.num, tableLeft + 12, yPosition + 8)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(step.title, tableLeft + 45, yPosition + 8)
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(step.desc, tableLeft + 45, yPosition + 22)
    yPosition += 42
  })

  yPosition += 20

  // SECTION 8: Comparatif Plans
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('NOS OFFRES', tableLeft, yPosition)
  yPosition += 20

  const plans = [
    { name: 'BASIQUE', price: 'GRATUIT', features: ['10 produits max', '5 messages IA/jour', 'Alertes stock'], color: GRAY, highlight: false },
    { name: 'STANDARD', price: '49 EUR/mois', features: ['50 produits', 'IA illimitee', 'Integrations POS', 'Support email'], color: BLUE, highlight: true },
    { name: 'PRO', price: '69 EUR/mois', features: ['Produits illimites', 'Commandes vocales', 'Support prioritaire', 'Multi-magasins'], color: GOLD, highlight: false }
  ]

  const planWidth = (tableWidth - 20) / 3

  plans.forEach((plan, i) => {
    const x = tableLeft + (i * (planWidth + 10))
    const bgColor = plan.highlight ? '#EFF6FF' : 'white'
    
    doc.roundedRect(x, yPosition, planWidth, 120, 8).fillAndStroke(bgColor, plan.color)
    
    if (plan.highlight) {
      doc.roundedRect(x + 20, yPosition - 8, planWidth - 40, 16, 4).fill(plan.color)
      doc.fontSize(7).fillColor('white').font('Helvetica-Bold').text('POPULAIRE', x + 20, yPosition - 5, { width: planWidth - 40, align: 'center' })
    }
    
    doc.fontSize(10).fillColor(plan.color).font('Helvetica-Bold').text(plan.name, x + 10, yPosition + 12, { width: planWidth - 20, align: 'center' })
    doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text(plan.price, x + 10, yPosition + 28, { width: planWidth - 20, align: 'center' })
    
    let featY = yPosition + 48
    plan.features.forEach(feat => {
      doc.fontSize(7).fillColor(DARK).font('Helvetica').text(`• ${feat}`, x + 10, featY, { width: planWidth - 20 })
      featY += 12
    })
  })

  yPosition += 135

  // SECTION 9: Programme Parrainage
  doc.roundedRect(tableLeft, yPosition, tableWidth, 80, 10).fillAndStroke('#F5F3FF', PURPLE)
  
  doc.fontSize(12).fillColor(PURPLE).font('Helvetica-Bold').text('PROGRAMME PARRAINAGE - 25% DE COMMISSION', tableLeft + 15, yPosition + 12)
  doc.fontSize(9).fillColor(DARK).font('Helvetica')
     .text('Gagnez 25% de commission recurrente sur chaque client que vous parrainez !', tableLeft + 15, yPosition + 30)
  
  doc.fontSize(11).fillColor(PURPLE).font('Helvetica-Bold').text(`Votre code : ${referralCode}`, tableLeft + 15, yPosition + 50)
  doc.fontSize(8).fillColor(GRAY).font('Helvetica').text('Partagez ce code avec vos contacts commercants', tableLeft + 15, yPosition + 65)

  yPosition += 95

  // SECTION 10: Footer Commercial
  doc.roundedRect(tableLeft, yPosition, tableWidth, 70, 8).fill(DARK)
  
  doc.fontSize(10).fillColor('white').font('Helvetica-Bold').text('DEMARREZ GRATUITEMENT', tableLeft + 15, yPosition + 12)
  doc.fontSize(9).fillColor(GOLD).font('Helvetica').text('www.ponia.io', tableLeft + 15, yPosition + 28)
  doc.fontSize(8).fillColor(LIGHT_GRAY).font('Helvetica')
     .text('Contact Pro : poniapro@proton.me', tableLeft + 15, yPosition + 43)
     .text('Essai gratuit 14 jours - Sans engagement', tableLeft + 15, yPosition + 55)

  doc.fontSize(8).fillColor(GOLD).font('Helvetica-Bold')
     .text('Scannez pour tester', tableLeft + tableWidth - 120, yPosition + 15)
  doc.roundedRect(tableLeft + tableWidth - 120, yPosition + 28, 40, 40, 4).fillAndStroke('white', GOLD)
  doc.fontSize(20).fillColor(DARK).text('QR', tableLeft + tableWidth - 108, yPosition + 38)

  // Pagination
  const pageCount = doc.bufferedPageRange().count
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i)
    doc.fontSize(7).fillColor(GRAY)
       .text(`PONIA - Gestion de Stock IA | Page ${i + 1}/${pageCount}`, tableLeft, doc.page.height - 30, { width: tableWidth, align: 'center' })
  }

  return doc
}
