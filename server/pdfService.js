import PDFDocument from 'pdfkit'
import path from 'path'

export function generateOrderPDF(orderData) {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 40,
    autoFirstPage: true
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

  // PAGE 1 - Bon de commande
  try {
    const logoPath = path.join(process.cwd(), 'public', 'ponia-logo.png')
    doc.image(logoPath, tableLeft, 30, { fit: [160, 50], align: 'left' })
  } catch (error) {
    doc.fontSize(22).fillColor(GOLD).font('Helvetica-Bold').text('PONIA', tableLeft, 35)
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text('Gestion Intelligente de Stock', tableLeft, 58)
  }

  doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text('BON DE COMMANDE INTELLIGENT', tableLeft, 85)
  doc.fontSize(8).fillColor(DARK).font('Helvetica')
     .text(`Commerce : ${storeName}`, tableLeft, 105)
  if (storeAddress) doc.text(`Adresse : ${storeAddress}`, tableLeft, 116)
  const dateY = storeAddress ? 127 : 116
  doc.text(`Date : ${date}`, tableLeft, dateY)

  let yPosition = dateY + 20

  // Score de Santé Stock + Temps Économisé (côte à côte)
  const boxWidth = (tableWidth - 10) / 2
  
  doc.roundedRect(tableLeft, yPosition, boxWidth, 55, 6).fillAndStroke('#F0FDF4', GREEN)
  doc.fontSize(8).fillColor(GREEN).font('Helvetica-Bold').text('SANTE STOCK', tableLeft + 8, yPosition + 6)
  const scoreColor = stockHealth.score >= 70 ? GREEN : stockHealth.score >= 40 ? ORANGE : RED
  doc.fontSize(22).fillColor(scoreColor).font('Helvetica-Bold').text(`${stockHealth.score || 0}%`, tableLeft + 8, yPosition + 18)
  doc.fontSize(6).fillColor(DARK).font('Helvetica')
     .text(`${stockHealth.healthy || 0} sains | ${stockHealth.low || 0} bas | ${stockHealth.critical || 0} critiques`, tableLeft + 8, yPosition + 42)

  const timeBoxX = tableLeft + boxWidth + 10
  doc.roundedRect(timeBoxX, yPosition, boxWidth, 55, 6).fillAndStroke('#FEF3C7', GOLD)
  doc.fontSize(8).fillColor('#92400E').font('Helvetica-Bold').text('TEMPS ECONOMISE', timeBoxX + 8, yPosition + 6)
  doc.fontSize(18).fillColor(GOLD).font('Helvetica-Bold').text(`${timeSaved.minutes || 0} min`, timeBoxX + 8, yPosition + 20)
  doc.fontSize(8).fillColor('#92400E').font('Helvetica').text(`= ${timeSaved.value || 0} EUR`, timeBoxX + 8, yPosition + 40)

  yPosition += 65

  // Météo (compact)
  if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
    doc.fontSize(9).fillColor(BLUE).font('Helvetica-Bold').text('METEO & IMPACT', tableLeft, yPosition)
    yPosition += 12
    doc.roundedRect(tableLeft, yPosition, tableWidth, 32, 4).fillAndStroke('#EFF6FF', BLUE)
    const forecast = weatherData.forecast.slice(0, 3)
    const fWidth = tableWidth / 3
    forecast.forEach((day, i) => {
      const x = tableLeft + (i * fWidth) + 8
      const temp = Math.round(day.temp || 15)
      const impact = temp > 25 ? '+20% boissons' : temp < 10 ? '+15% plats chauds' : 'Normal'
      doc.fontSize(7).fillColor(DARK).font('Helvetica-Bold').text(`${day.date || 'J+' + (i+1)}: ${temp}C`, x, yPosition + 8)
      doc.fontSize(6).fillColor(BLUE).font('Helvetica').text(impact, x, yPosition + 18)
    })
    yPosition += 40
  }

  // Alertes Péremption (compact)
  if (expiryAlerts.length > 0) {
    doc.fontSize(9).fillColor(RED).font('Helvetica-Bold').text('ALERTES PEREMPTION', tableLeft, yPosition)
    yPosition += 12
    expiryAlerts.slice(0, 2).forEach((alert) => {
      doc.fontSize(7).fillColor(DARK).font('Helvetica')
         .text(`- ${alert.name}: expire dans ${alert.daysUntil}j (${alert.quantity} ${alert.unit})`, tableLeft + 5, yPosition)
      yPosition += 10
    })
    yPosition += 5
  }

  // Suggestions IA (compact)
  if (suggestions.length > 0) {
    doc.fontSize(9).fillColor(PURPLE).font('Helvetica-Bold').text('SUGGESTIONS IA', tableLeft, yPosition)
    yPosition += 12
    suggestions.slice(0, 3).forEach((sug) => {
      doc.fontSize(7).fillColor(DARK).font('Helvetica')
         .text(`- ${sug.message || sug.title}`, tableLeft + 5, yPosition, { width: tableWidth - 10 })
      yPosition += 10
    })
    yPosition += 5
  }

  // Tableaux des commandes
  const colWidths = { product: 200, qty: 60, unit: 50, unitPrice: 100, total: 105 }

  function drawProductsTable(products, title, titleColor, startY) {
    let currentY = startY
    doc.fontSize(9).fillColor(titleColor).font('Helvetica-Bold').text(title, tableLeft, currentY)
    currentY += 14

    if (products.length === 0) {
      doc.fontSize(7).fillColor(GRAY).font('Helvetica').text('Aucun produit', tableLeft, currentY)
      return currentY + 12
    }

    doc.fillColor('#374151').rect(tableLeft, currentY, tableWidth, 14).fill()
    doc.fontSize(6).fillColor('white').font('Helvetica-Bold')
       .text('PRODUIT', tableLeft + 4, currentY + 4, { width: colWidths.product })
       .text('QTE', tableLeft + colWidths.product + 4, currentY + 4)
       .text('UNITE', tableLeft + colWidths.product + colWidths.qty + 4, currentY + 4)
       .text('P.U.', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 4, currentY + 4, { width: colWidths.unitPrice - 5, align: 'right' })
       .text('TOTAL', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 4, currentY + 4, { width: colWidths.total - 8, align: 'right' })

    currentY += 14
    doc.font('Helvetica')

    products.slice(0, 8).forEach((product, index) => {
      if (index % 2 === 0) {
        doc.fillColor(LIGHT_GRAY).rect(tableLeft, currentY, tableWidth, 14).fill()
      }
      const unitPrice = product.unitPrice || 0
      const total = product.suggestedQuantity * unitPrice
      doc.fillColor(DARK).fontSize(6)
         .text(product.name, tableLeft + 4, currentY + 4, { width: colWidths.product - 8, ellipsis: true })
         .text(product.suggestedQuantity.toString(), tableLeft + colWidths.product + 4, currentY + 4)
         .text(product.unit || 'unite', tableLeft + colWidths.product + colWidths.qty + 4, currentY + 4)
         .text(`${unitPrice.toFixed(2)}`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 4, currentY + 4, { width: colWidths.unitPrice - 8, align: 'right' })
         .text(`${total.toFixed(2)}`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 4, currentY + 4, { width: colWidths.total - 12, align: 'right' })
      currentY += 14
    })
    return currentY + 5
  }

  yPosition = drawProductsTable(urgentProducts, 'COMMANDES URGENTES (<48h)', RED, yPosition)
  yPosition = drawProductsTable(weeklyProducts, 'COMMANDES SEMAINE (3-5j)', ORANGE, yPosition)

  doc.strokeColor(GOLD).lineWidth(1.5).moveTo(tableLeft, yPosition).lineTo(tableLeft + tableWidth, yPosition).stroke()
  yPosition += 8
  doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text('TOTAL INDICATIF:', tableLeft + tableWidth - 180, yPosition, { continued: true })
  doc.fillColor(GOLD).text(` ${totalAmount.toFixed(2)} EUR`, { align: 'right' })

  yPosition += 20

  // Recommandations
  if (recommendations.length > 0) {
    doc.fontSize(8).fillColor(DARK).font('Helvetica-Bold').text('RECOMMANDATIONS:', tableLeft, yPosition)
    yPosition += 10
    recommendations.slice(0, 2).forEach((rec, i) => {
      doc.fontSize(6).fillColor(GRAY).font('Helvetica').text(`${i + 1}. ${rec}`, tableLeft + 5, yPosition, { width: tableWidth - 10 })
      yPosition += 10
    })
  }

  // Footer page 1
  doc.fontSize(6).fillColor(GRAY).text('PONIA - Gestion de Stock IA | Page 1/2', tableLeft, 800, { width: tableWidth, align: 'center' })

  // PAGE 2 - Infos commerciales
  doc.addPage()
  yPosition = 40

  // Guide utilisation
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('COMMENT UTILISER PONIA ?', tableLeft, yPosition)
  yPosition += 20

  const steps = [
    { num: '1', title: 'Ajoutez vos produits', desc: 'Stock > + Ajouter > Nom, quantite, seuil' },
    { num: '2', title: 'Mettez a jour en 30 sec', desc: 'Cliquez +/- pour ajuster rapidement' },
    { num: '3', title: 'Recevez des alertes IA', desc: 'PONIA previent ruptures et pertes' }
  ]

  steps.forEach((step) => {
    doc.roundedRect(tableLeft, yPosition, tableWidth, 28, 4).fillAndStroke(LIGHT_GRAY, GRAY)
    doc.fontSize(14).fillColor(GOLD).font('Helvetica-Bold').text(step.num, tableLeft + 10, yPosition + 7)
    doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text(step.title, tableLeft + 35, yPosition + 6)
    doc.fontSize(7).fillColor(GRAY).font('Helvetica').text(step.desc, tableLeft + 35, yPosition + 17)
    yPosition += 32
  })

  yPosition += 15

  // Comparatif Plans
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('NOS OFFRES', tableLeft, yPosition)
  yPosition += 18

  const plans = [
    { name: 'BASIQUE', price: 'GRATUIT', features: ['10 produits', '5 msg IA/jour', 'Alertes stock'], color: GRAY },
    { name: 'STANDARD', price: '49 EUR/mois', features: ['50 produits', 'IA illimitee', 'Integrations POS'], color: BLUE, highlight: true },
    { name: 'PRO', price: '69 EUR/mois', features: ['Illimite', 'Vocal', 'Support prioritaire'], color: GOLD }
  ]

  const planWidth = (tableWidth - 16) / 3

  plans.forEach((plan, i) => {
    const x = tableLeft + (i * (planWidth + 8))
    const bgColor = plan.highlight ? '#EFF6FF' : 'white'
    
    doc.roundedRect(x, yPosition, planWidth, 95, 6).fillAndStroke(bgColor, plan.color)
    
    if (plan.highlight) {
      doc.roundedRect(x + 15, yPosition - 6, planWidth - 30, 12, 3).fill(plan.color)
      doc.fontSize(5).fillColor('white').font('Helvetica-Bold').text('POPULAIRE', x + 15, yPosition - 4, { width: planWidth - 30, align: 'center' })
    }
    
    doc.fontSize(8).fillColor(plan.color).font('Helvetica-Bold').text(plan.name, x + 5, yPosition + 10, { width: planWidth - 10, align: 'center' })
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(plan.price, x + 5, yPosition + 24, { width: planWidth - 10, align: 'center' })
    
    let featY = yPosition + 42
    plan.features.forEach(feat => {
      doc.fontSize(6).fillColor(DARK).font('Helvetica').text(`• ${feat}`, x + 8, featY, { width: planWidth - 16 })
      featY += 10
    })
  })

  yPosition += 110

  // Programme Parrainage
  doc.roundedRect(tableLeft, yPosition, tableWidth, 65, 8).fillAndStroke('#F5F3FF', PURPLE)
  doc.fontSize(10).fillColor(PURPLE).font('Helvetica-Bold').text('PROGRAMME PARRAINAGE - 25% COMMISSION', tableLeft + 12, yPosition + 10)
  doc.fontSize(8).fillColor(DARK).font('Helvetica').text('Gagnez 25% de commission recurrente sur chaque client parraine !', tableLeft + 12, yPosition + 26)
  doc.fontSize(10).fillColor(PURPLE).font('Helvetica-Bold').text(`Votre code : ${referralCode}`, tableLeft + 12, yPosition + 42)

  yPosition += 80

  // Footer Commercial
  doc.roundedRect(tableLeft, yPosition, tableWidth, 55, 6).fill(DARK)
  doc.fontSize(9).fillColor('white').font('Helvetica-Bold').text('DEMARREZ GRATUITEMENT', tableLeft + 12, yPosition + 10)
  doc.fontSize(8).fillColor(GOLD).font('Helvetica').text('www.ponia.io', tableLeft + 12, yPosition + 24)
  doc.fontSize(7).fillColor(LIGHT_GRAY).font('Helvetica')
     .text('Contact Pro : poniapro@proton.me | Essai 14 jours gratuit', tableLeft + 12, yPosition + 38)

  // Footer page 2
  doc.fontSize(6).fillColor(GRAY).text('PONIA - Gestion de Stock IA | Page 2/2', tableLeft, 800, { width: tableWidth, align: 'center' })

  return doc
}
