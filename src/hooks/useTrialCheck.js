import { useData } from '../contexts/DataContext'

export function useTrialCheck() {
  const { trialExpired, trialEndsAt, isInitialized } = useData()
  
  return { 
    trialExpired, 
    trialEndsAt,
    loading: false
  }
}
