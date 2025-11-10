import PDFDocument from 'pdfkit'

export function generateOrderPDF(orderData) {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50,
    bufferPages: true
  })

  const { storeName, storeAddress, date, urgentProducts = [], weeklyProducts = [], recommendations = [], totalAmount } = orderData

  const GOLD = '#FFD700'
  const DARK = '#1F2937'
  const GRAY = '#6B7280'
  const LIGHT_GRAY = '#F3F4F6'
  const RED = '#DC2626'
  const ORANGE = '#F59E0B'

  doc.fontSize(24)
     .fillColor(GOLD)
     .text('PONIA AI', 50, 45)
  
  doc.fontSize(9)
     .fillColor(GRAY)
     .text('Gestion Intelligente de Stock', 50, 72)

  doc.fontSize(18)
     .fillColor(DARK)
     .text('BON DE COMMANDE', 50, 105)

  doc.fontSize(9)
     .fillColor(DARK)
     .text(`Commerce : ${storeName}`, 50, 135)
  
  if (storeAddress) {
    doc.text(`Adresse : ${storeAddress}`, 50, 148)
  }

  const dateY = storeAddress ? 161 : 148
  doc.text(`Date : ${date}`, 50, dateY)
  doc.text(`Généré par : PONIA AI`, 50, dateY + 13)

  let yPosition = dateY + 40

  const tableLeft = 50
  const tableWidth = 495
  
  const colWidths = {
    product: 200,
    qty: 70,
    unit: 60,
    unitPrice: 82.5,
    total: 82.5
  }

  function drawProductsTable(products, title, titleColor, startY) {
    let currentY = startY

    doc.fontSize(11)
       .fillColor(titleColor)
       .font('Helvetica-Bold')
       .text(title, tableLeft, currentY)
    
    currentY += 25

    if (products.length === 0) {
      doc.fontSize(9)
         .fillColor(GRAY)
         .font('Helvetica')
         .text('Aucun produit dans cette catégorie', tableLeft, currentY)
      return currentY + 25
    }

    doc.fillColor('#374151')
       .rect(tableLeft, currentY, tableWidth, 20)
       .fill()

    doc.fontSize(8)
       .fillColor('white')
       .font('Helvetica-Bold')
       .text('PRODUIT', tableLeft + 5, currentY + 6, { width: colWidths.product })
       .text('QTÉ', tableLeft + colWidths.product + 5, currentY + 6, { width: colWidths.qty })
       .text('UNITÉ', tableLeft + colWidths.product + colWidths.qty + 5, currentY + 6, { width: colWidths.unit })
       .text('P.U.', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, currentY + 6, { width: colWidths.unitPrice - 5, align: 'right' })
       .text('TOTAL', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, currentY + 6, { width: colWidths.total - 10, align: 'right' })

    currentY += 20
    doc.font('Helvetica')

    products.forEach((product, index) => {
      const rowHeight = 20
      
      if (index % 2 === 0) {
        doc.fillColor(LIGHT_GRAY)
           .rect(tableLeft, currentY, tableWidth, rowHeight)
           .fill()
      }

      const unitPrice = product.unitPrice || 0
      const total = product.suggestedQuantity * unitPrice

      doc.fillColor(DARK)
         .fontSize(8)
         .text(product.name, tableLeft + 5, currentY + 5, { width: colWidths.product - 10, ellipsis: true })
         .text(product.suggestedQuantity.toString(), tableLeft + colWidths.product + 5, currentY + 5, { width: colWidths.qty - 10 })
         .text(product.unit || 'unité', tableLeft + colWidths.product + colWidths.qty + 5, currentY + 5, { width: colWidths.unit - 10 })
         .text(`${unitPrice.toFixed(2)} €`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, currentY + 5, { width: colWidths.unitPrice - 10, align: 'right' })
         .text(`${total.toFixed(2)} €`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, currentY + 5, { width: colWidths.total - 15, align: 'right' })

      currentY += rowHeight
    })

    currentY += 10
    return currentY
  }

  yPosition = drawProductsTable(urgentProducts, '🔴 COMMANDES URGENTES (livraison <48h)', RED, yPosition)
  yPosition += 10
  yPosition = drawProductsTable(weeklyProducts, '🟠 COMMANDES SEMAINE (livraison 3-5j)', ORANGE, yPosition)

  yPosition += 20

  doc.strokeColor(GOLD)
     .lineWidth(2)
     .moveTo(tableLeft, yPosition)
     .lineTo(tableLeft + tableWidth, yPosition)
     .stroke()

  yPosition += 15

  doc.fontSize(11)
     .fillColor(DARK)
     .font('Helvetica-Bold')
     .text('MONTANT TOTAL INDICATIF :', tableLeft + tableWidth - 250, yPosition, { width: 160, align: 'right' })
     .fontSize(13)
     .fillColor(GOLD)
     .text(`${totalAmount.toFixed(2)} €`, tableLeft + tableWidth - 90, yPosition, { width: 90, align: 'right' })

  yPosition += 35

  if (recommendations && recommendations.length > 0) {
    doc.fontSize(11)
       .fillColor(DARK)
       .font('Helvetica-Bold')
       .text('💡 RECOMMANDATIONS', tableLeft, yPosition)
    
    yPosition += 20

    recommendations.forEach((rec, index) => {
      doc.fontSize(8)
         .fillColor(DARK)
         .font('Helvetica')
         .text(`${index + 1}. ${rec}`, tableLeft + 10, yPosition, { width: tableWidth - 10 })
      yPosition += 15
    })

    yPosition += 10
  }

  doc.fontSize(7)
     .fillColor(GRAY)
     .font('Helvetica')
     .text('Ce bon de commande a été généré automatiquement par PONIA AI avec estimations de prix marché français.', 50, yPosition, { align: 'center', width: tableWidth })
  
  yPosition += 10
  doc.text('Veuillez vérifier les quantités et confirmer les prix avec vos fournisseurs avant de valider votre commande.', 50, yPosition, { align: 'center', width: tableWidth })

  const pageCount = doc.bufferedPageRange().count
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i)
    doc.fontSize(7)
       .fillColor(GRAY)
       .text(`Page ${i + 1} / ${pageCount}`, 50, doc.page.height - 40, { align: 'center', width: tableWidth })
  }

  return doc
}
