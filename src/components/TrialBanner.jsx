import React, { useState, useEffect } from 'react'
import { Clock, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function TrialBanner() {
  const navigate = useNavigate()
  const [trialInfo, setTrialInfo] = useState(null)

  useEffect(() => {
    loadTrialInfo()
  }, [])

  const loadTrialInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const { user } = await response.json()
        
        if (user.plan !== 'basique' || !user.trialEndsAt) {
          setTrialInfo(null)
          return
        }

        const trialEnd = new Date(user.trialEndsAt)
        const now = new Date()
        const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))

        if (daysLeft <= 0) {
          setTrialInfo({ expired: true, daysLeft: 0 })
        } else {
          setTrialInfo({ expired: false, daysLeft })
        }
      }
    } catch (error) {
      console.error('Erreur chargement info essai:', error)
    }
  }

  if (!trialInfo) return null

  const { expired, daysLeft } = trialInfo

  return (
    <div style={{
      background: expired 
        ? 'linear-gradient(135deg, #FEE2E2, #FEF2F2)' 
        : daysLeft <= 3
        ? 'linear-gradient(135deg, #FED7AA, #FFEDD5)'
        : 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
      borderBottom: expired 
        ? '2px solid #EF4444' 
        : daysLeft <= 3
        ? '2px solid #F97316'
        : '2px solid #3B82F6',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        {expired ? (
          <>
            <Clock size={20} style={{ color: '#DC2626' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#991B1B' }}>
              ⚠️ Votre essai gratuit est terminé
            </div>
          </>
        ) : (
          <>
            <Crown size={20} style={{ color: daysLeft <= 3 ? '#EA580C' : '#2563EB' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: daysLeft <= 3 ? '#9A3412' : '#1E40AF' }}>
              {daysLeft === 1 
                ? `🎯 Dernier jour d'essai gratuit !` 
                : `✨ ${daysLeft} jours d'essai gratuit restants`}
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => navigate('/upgrade')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#fff',
          background: expired ? '#EF4444' : daysLeft <= 3 ? '#F97316' : '#3B82F6',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {expired ? 'Passer à un plan payant' : 'Upgrader maintenant'}
      </button>
    </div>
  )
}
