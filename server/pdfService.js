import PDFDocument from 'pdfkit'

export function generateOrderPDF(orderData) {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50,
    bufferPages: true
  })

  const { storeName, storeAddress, date, products, totalAmount } = orderData

  const GOLD = '#FFD700'
  const DARK = '#1F2937'
  const GRAY = '#6B7280'
  const LIGHT_GRAY = '#F3F4F6'

  doc.fontSize(28)
     .fillColor(GOLD)
     .text('PONIA AI', 50, 50)
  
  doc.fontSize(10)
     .fillColor(GRAY)
     .text('Gestion Intelligente de Stock', 50, 82)

  doc.fontSize(20)
     .fillColor(DARK)
     .text('BON DE COMMANDE', 50, 120)

  doc.fontSize(10)
     .fillColor(DARK)
     .text(`Commerce : ${storeName}`, 50, 155)
  
  if (storeAddress) {
    doc.text(`Adresse : ${storeAddress}`, 50, 170)
  }

  doc.text(`Date : ${date}`, 50, storeAddress ? 185 : 170)
  doc.text(`Généré par : PONIA AI`, 50, storeAddress ? 200 : 185)

  const tableTop = storeAddress ? 240 : 225
  const tableLeft = 50
  const tableWidth = 495
  
  const colWidths = {
    product: 200,
    qty: 80,
    unit: 80,
    unitPrice: 67.5,
    total: 67.5
  }

  doc.fillColor(GOLD)
     .rect(tableLeft, tableTop, tableWidth, 25)
     .fill()

  doc.fontSize(9)
     .fillColor(DARK)
     .font('Helvetica-Bold')
     .text('PRODUIT', tableLeft + 5, tableTop + 8, { width: colWidths.product })
     .text('QUANTITÉ', tableLeft + colWidths.product + 5, tableTop + 8, { width: colWidths.qty })
     .text('UNITÉ', tableLeft + colWidths.product + colWidths.qty + 5, tableTop + 8, { width: colWidths.unit })
     .text('P.U.', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, tableTop + 8, { width: colWidths.unitPrice, align: 'right' })
     .text('TOTAL', tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, tableTop + 8, { width: colWidths.total - 10, align: 'right' })

  let yPosition = tableTop + 25
  doc.font('Helvetica')

  products.forEach((product, index) => {
    const rowHeight = 22
    
    if (index % 2 === 0) {
      doc.fillColor(LIGHT_GRAY)
         .rect(tableLeft, yPosition, tableWidth, rowHeight)
         .fill()
    }

    const unitPrice = product.unitPrice || 0
    const total = product.suggestedQuantity * unitPrice

    doc.fillColor(DARK)
       .fontSize(9)
       .text(product.name, tableLeft + 5, yPosition + 6, { width: colWidths.product - 10 })
       .text(product.suggestedQuantity.toString(), tableLeft + colWidths.product + 5, yPosition + 6, { width: colWidths.qty - 10 })
       .text(product.unit || 'unité', tableLeft + colWidths.product + colWidths.qty + 5, yPosition + 6, { width: colWidths.unit - 10 })
       .text(`${unitPrice.toFixed(2)} €`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + 5, yPosition + 6, { width: colWidths.unitPrice - 10, align: 'right' })
       .text(`${total.toFixed(2)} €`, tableLeft + colWidths.product + colWidths.qty + colWidths.unit + colWidths.unitPrice + 5, yPosition + 6, { width: colWidths.total - 15, align: 'right' })

    yPosition += rowHeight
  })

  doc.strokeColor(GOLD)
     .lineWidth(2)
     .moveTo(tableLeft, yPosition)
     .lineTo(tableLeft + tableWidth, yPosition)
     .stroke()

  yPosition += 15

  doc.fontSize(12)
     .fillColor(DARK)
     .font('Helvetica-Bold')
     .text('MONTANT TOTAL :', tableLeft + tableWidth - 200, yPosition, { width: 130, align: 'right' })
     .fontSize(14)
     .fillColor(GOLD)
     .text(`${totalAmount.toFixed(2)} €`, tableLeft + tableWidth - 70, yPosition, { width: 70, align: 'right' })

  yPosition += 50

  doc.fontSize(8)
     .fillColor(GRAY)
     .font('Helvetica')
     .text('Ce bon de commande a été généré automatiquement par PONIA AI', 50, yPosition, { align: 'center', width: tableWidth })
  
  yPosition += 12
  doc.text('Veuillez vérifier les quantités avant de valider votre commande auprès de vos fournisseurs.', 50, yPosition, { align: 'center', width: tableWidth })

  const pageCount = doc.bufferedPageRange().count
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i)
    doc.fontSize(8)
       .fillColor(GRAY)
       .text(`Page ${i + 1} / ${pageCount}`, 50, doc.page.height - 50, { align: 'center', width: tableWidth })
  }

  doc.end()
  return doc
}
