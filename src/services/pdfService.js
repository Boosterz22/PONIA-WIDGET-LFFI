export async function generateOrderPDF(products, businessName, businessType = 'commerce') {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)
  
  try {
    const response = await fetch('/api/generate-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products,
        businessName,
        businessType
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erreur serveur (${response.status})`)
    }

    const data = await response.json()
    
    if (!data.content || typeof data.content !== 'string') {
      alert(data.message || 'Aucun produit à commander pour le moment !')
      return
    }

    const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bon-de-commande-${businessName.replace(/\s+/g, '-')}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert(`✅ Bon de commande intelligent généré !\n\n${data.productsCount} produit(s) à commander\n(${data.criticalCount} urgent${data.criticalCount > 1 ? 's' : ''}, ${data.lowCount} cette semaine)`)
    
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Erreur génération bon de commande:', error)
    
    if (error.name === 'AbortError') {
      alert('⏱️ La génération prend trop de temps. Vérifiez votre connexion et réessayez.')
    } else {
      alert(`❌ ${error.message || 'Erreur lors de la génération du bon de commande.'}\n\nRéessayez dans quelques instants.`)
    }
  }
}
