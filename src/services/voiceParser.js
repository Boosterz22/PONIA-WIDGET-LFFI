export function parseVoiceCommandLocal(transcript) {
  if (!transcript || typeof transcript !== 'string') {
    return null
  }

  const text = transcript.toLowerCase().trim()
  
  const addPatterns = [
    /(?:plus|ajouter|rajouter|mettre)\s+(\d+(?:[.,]\d+)?)/i,
    /(\d+(?:[.,]\d+)?)\s+(?:en\s+)?plus/i,
    /(\d+(?:[.,]\d+)?)\s+(?:de\s+)?(?:plus|en\s+plus)/i
  ]
  
  const removePatterns = [
    /(?:moins|retirer|enlever|supprimer)\s+(\d+(?:[.,]\d+)?)/i,
    /(\d+(?:[.,]\d+)?)\s+(?:en\s+)?moins/i,
    /(\d+(?:[.,]\d+)?)\s+(?:de\s+)?(?:moins|en\s+moins)/i
  ]
  
  for (const pattern of addPatterns) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'))
      if (!isNaN(amount) && amount > 0) {
        return {
          delta: amount,
          action: 'add',
          confidence: 'high',
          reason: `Commande détectée : +${amount}`
        }
      }
    }
  }
  
  for (const pattern of removePatterns) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'))
      if (!isNaN(amount) && amount > 0) {
        return {
          delta: -amount,
          action: 'remove',
          confidence: 'high',
          reason: `Commande détectée : -${amount}`
        }
      }
    }
  }
  
  return null
}
