import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useTrialCheck() {
  const [trialExpired, setTrialExpired] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkTrialStatus()
  }, [])

  const checkTrialStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const { user } = await response.json()
        
        // Vérifier si l'utilisateur a un essai expiré
        if (!user.trialEndsAt) {
          setTrialExpired(false)
        } else {
          const trialEnd = new Date(user.trialEndsAt)
          const now = new Date()
          setTrialExpired(trialEnd <= now)
        }
      }
    } catch (error) {
      console.error('Erreur vérification essai:', error)
    } finally {
      setLoading(false)
    }
  }

  return { trialExpired, loading }
}
