export function generateOrderPDF(products, businessName) {
  const critical = products.filter(p => p.currentQuantity <= (p.alertThreshold || 10) * 0.5)
  const low = products.filter(p => 
    p.currentQuantity > (p.alertThreshold || 10) * 0.5 && 
    p.currentQuantity <= (p.alertThreshold || 10)
  )
  
  const orderProducts = [...critical, ...low]
  
  if (orderProducts.length === 0) {
    alert('Aucun produit à commander pour le moment !')
    return
  }

  const today = new Date().toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })

  let content = `
═══════════════════════════════════════════════════════
              BON DE COMMANDE
═══════════════════════════════════════════════════════

Commerce : ${businessName}
Date : ${today}
Généré par : PONIA AI

───────────────────────────────────────────────────────
PRODUITS À COMMANDER
───────────────────────────────────────────────────────
`

  critical.forEach(p => {
    const threshold = p.alertThreshold || 10
    const suggestedQty = Math.max(threshold * 2 - p.currentQuantity, 0)
    content += `
🔴 URGENT
   Produit : ${p.name}
   Stock actuel : ${p.currentQuantity} ${p.unit}
   Seuil d'alerte : ${threshold} ${p.unit}
   Quantité suggérée : ${Math.ceil(suggestedQty)} ${p.unit}
   Fournisseur : ${p.supplier || 'Non spécifié'}

───────────────────────────────────────────────────────`
  })

  low.forEach(p => {
    const threshold = p.alertThreshold || 10
    const suggestedQty = Math.max(threshold * 1.5 - p.currentQuantity, 0)
    content += `
🟠 Cette semaine
   Produit : ${p.name}
   Stock actuel : ${p.currentQuantity} ${p.unit}
   Seuil d'alerte : ${threshold} ${p.unit}
   Quantité suggérée : ${Math.ceil(suggestedQty)} ${p.unit}
   Fournisseur : ${p.supplier || 'Non spécifié'}

───────────────────────────────────────────────────────`
  })

  content += `

RÉSUMÉ :
• ${critical.length} produit(s) en rupture imminente
• ${low.length} produit(s) en stock faible
• ${orderProducts.length} produit(s) au total à commander

═══════════════════════════════════════════════════════
           Bon de commande généré par PONIA AI
           Gestion de stock intelligente
═══════════════════════════════════════════════════════
`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bon-de-commande-${businessName.replace(/\s+/g, '-')}-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  alert(`✅ Bon de commande généré !\n\n${orderProducts.length} produit(s) à commander`)
}
