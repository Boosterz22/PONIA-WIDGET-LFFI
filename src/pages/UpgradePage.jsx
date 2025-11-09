import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Crown, Check, Loader } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'

export default function UpgradePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'standard')

  const plans = {
    standard: {
      name: 'Standard',
      price: '€49',
      period: '/mois',
      color: '#FFA500',
      features: [
        '50 produits maximum',
        'IA prédictive 7 jours',
        'Chat AI illimité',
        'Alertes intelligentes',
        'Commandes vocales',
        'Support prioritaire'
      ]
    },
    pro: {
      name: 'Pro',
      price: '€69',
      period: '/mois',
      color: '#a855f7',
      features: [
        'Produits illimités',
        'IA prédictive 30 jours',
        'Multi-magasins',
        'Chat AI premium',
        'Alertes avancées',
        'Intégrations POS',
        'Support VIP 24/7'
      ]
    }
  }

  const handleUpgrade = async (plan) => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ plan })
      })

      if (!response.ok) {
        throw new Error('Erreur création session Stripe')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Erreur upgrade:', error)
      alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '80px' }}>
      <Navigation />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Crown size={64} style={{ color: '#FFD700', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Passez à la vitesse supérieure
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
            Débloquez toute la puissance de l'IA pour optimiser votre stock et économiser des milliers d'euros par an
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              className="card"
              style={{ 
                padding: '2rem',
                border: selectedPlan === key ? `3px solid ${plan.color}` : '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selectedPlan === key ? 'scale(1.02)' : 'scale(1)'
              }}
              onClick={() => setSelectedPlan(key)}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: plan.color,
                  marginBottom: '0.5rem'
                }}>
                  {plan.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '700', color: '#111827' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <Check size={20} style={{ color: plan.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', color: '#374151' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(key)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: selectedPlan === key ? '#fff' : '#111827',
                  background: selectedPlan === key ? plan.color : '#F3F4F6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading && selectedPlan === key ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Redirection...
                  </>
                ) : (
                  `Choisir ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
          border: '1px solid #3B82F6',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.95rem', color: '#1E40AF', lineHeight: '1.6', margin: 0 }}>
            <strong>🔒 Paiement 100% sécurisé</strong> avec Stripe · Annulation possible à tout moment · Aucun engagement
          </p>
        </div>
      </div>
    </div>
  )
}
