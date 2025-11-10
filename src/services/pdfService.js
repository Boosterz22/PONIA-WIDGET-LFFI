export async function generateOrderPDF(products, businessName, businessType = 'commerce', token) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 45000)
  
  try {
    const response = await fetch('/api/generate-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      
      if (errorData.noProducts) {
        alert(errorData.message || 'Aucun produit à commander pour le moment !')
        return
      }
      
      throw new Error(errorData.error || `Erreur serveur (${response.status})`)
    }

    const contentType = response.headers.get('Content-Type')
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      if (data.noProducts) {
        alert(data.message || 'Aucun produit à commander pour le moment !')
        return
      }
      throw new Error(data.error || 'Erreur inattendue')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bon-de-commande-${businessName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    const productsCount = response.headers.get('X-Products-Count') || '?'
    const criticalCount = parseInt(response.headers.get('X-Critical-Count') || '0')
    const lowCount = parseInt(response.headers.get('X-Low-Count') || '0')

    alert(`✅ Bon de commande PDF généré !\n\n${productsCount} produit(s) à commander\n(${criticalCount} urgent${criticalCount > 1 ? 's' : ''}, ${lowCount} cette semaine)`)
    
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
