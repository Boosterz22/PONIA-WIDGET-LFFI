export async function generateOrderPDF(products, businessName, businessType = 'commerce', token) {
  // Affichage immédiat du loading
  const loadingMsg = document.createElement('div')
  loadingMsg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 10000;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
  `
  loadingMsg.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
    <div style="font-size: 1.1rem; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
      Génération du PDF en cours...
    </div>
    <div style="font-size: 0.9rem; color: #6B7280;">
      Cela peut prendre quelques secondes
    </div>
    <div class="spinner" style="margin: 1.5rem auto 0; width: 40px; height: 40px;"></div>
  `
  document.body.appendChild(loadingMsg)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)
  
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
      document.body.removeChild(loadingMsg)
      
      if (errorData.noProducts) {
        alert(errorData.message || 'Aucun produit à commander pour le moment !')
        return
      }
      
      throw new Error(errorData.error || `Erreur serveur (${response.status})`)
    }

    const contentType = response.headers.get('Content-Type')
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      document.body.removeChild(loadingMsg)
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
    
    // Fermer le loading AVANT le succès pour meilleure UX
    document.body.removeChild(loadingMsg)

    const productsCount = response.headers.get('X-Products-Count') || '?'
    const criticalCount = parseInt(response.headers.get('X-Critical-Count') || '0')
    const lowCount = parseInt(response.headers.get('X-Low-Count') || '0')

    alert(`✅ Bon de commande PDF généré !\n\n${productsCount} produit(s) à commander\n(${criticalCount} urgent${criticalCount > 1 ? 's' : ''}, ${lowCount} cette semaine)`)
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Fermer le loading en cas d'erreur
    if (document.body.contains(loadingMsg)) {
      document.body.removeChild(loadingMsg)
    }
    
    console.error('Erreur génération bon de commande:', error)
    
    if (error.name === 'AbortError') {
      alert('⏱️ La génération prend trop de temps. Vérifiez votre connexion et réessayez.')
    } else {
      alert(`❌ ${error.message || 'Erreur lors de la génération du bon de commande.'}\n\nRéessayez dans quelques instants.`)
    }
  }
}
