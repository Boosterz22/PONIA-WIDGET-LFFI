export const AI_TIMEOUT_MS = 10000

export async function callAIWithTimeout(aiFunction, timeoutMs = AI_TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Délai d\'attente dépassé')), timeoutMs)
  )
  
  try {
    const result = await Promise.race([aiFunction, timeout])
    return { success: true, data: result }
  } catch (error) {
    console.error('Erreur IA:', error)
    const errorMsg = error.message === 'Délai d\'attente dépassé'
      ? 'L\'IA met trop de temps à répondre'
      : 'Service IA temporairement indisponible'
    return { success: false, error: errorMsg }
  }
}

export async function loadOpenAIService() {
  try {
    const service = await import('./openaiService')
    return { success: true, service }
  } catch (error) {
    console.error('Erreur chargement openaiService:', error)
    return { 
      success: false, 
      error: 'Impossible de charger le service IA' 
    }
  }
}
