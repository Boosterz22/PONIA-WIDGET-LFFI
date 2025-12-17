import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, TrendingUp, Building2, Loader } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function UpgradePage() {
  const navigate = useNavigate()
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      name: 'Standard',
      price: 49,
      priceYearly: 470,
      savings: 118,
      icon: TrendingUp,
      color: '#FFD700',
      description: 'Pour commerces sérieux',
      features: [
        { text: '100 produits maximum', included: true },
        { text: 'Prédictions IA 7 jours', included: true },
        { text: 'Génération commandes auto', included: true },
        { text: 'Alertes expiration produits', included: true },
        { text: 'Commandes vocales', included: true },
        { text: 'Chat IA illimité', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Multi-magasins', included: false }
      ],
      cta: 'Passer à Standard',
      popular: true,
      planKey: 'standard'
    },
    {
      name: 'Pro',
      price: 69,
      priceYearly: 660,
      savings: 168,
      icon: Building2,
      color: '#FFD700',
      description: 'Pour réseaux et chaînes',
      features: [
        { text: 'Produits ILLIMITÉS', included: true },
        { text: 'Prédictions IA 30 jours', included: true },
        { text: 'Multi-magasins illimité', included: true },
        { text: 'Génération commandes avancée', included: true },
        { text: 'Analytics avancées', included: true },
        { text: 'Support prioritaire 24/7', included: true },
        { text: 'Onboarding personnalisé', included: true },
        { text: 'Intégrations POS (Square, etc.)', included: true }
      ],
      cta: 'Passer à Pro',
      popular: false,
      planKey: 'pro'
    }
  ]

  const handleUpgrade = async (planKey) => {
    setLoading(true)
    setSelectedPlan(planKey)
    
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
        body: JSON.stringify({ 
          plan: planKey,
          billingPeriod
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur création session Stripe')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Erreur upgrade:', error)
      alert(`Erreur lors de la création de la session de paiement: ${error.message}. Veuillez réessayer.`)
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{
        background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.08) 50%, rgba(255, 215, 0, 0.04) 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img 
            src="/ponia-logo.png" 
            alt="PONIA" 
            style={{ 
              height: 'clamp(120px, 20vw, 180px)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#FFD700',
              color: '#1a1a1a',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Retour au Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Passez à la vitesse supérieure
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Débloquez toute la puissance de l'IA pour optimiser votre stock. Essai gratuit 14 jours.
          </p>

          <div style={{
            display: 'inline-flex',
            background: 'white',
            borderRadius: '12px',
            padding: '0.4rem',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '0.7rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: billingPeriod === 'monthly' ? '#FFD700' : 'transparent',
                color: billingPeriod === 'monthly' ? '#1a1a1a' : '#666',
                transition: 'all 0.2s'
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '0.7rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: billingPeriod === 'yearly' ? '#FFD700' : 'transparent',
                color: billingPeriod === 'yearly' ? '#1a1a1a' : '#666',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              Annuel
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#FFD700',
                color: 'white',
                fontSize: '0.65rem',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
          maxWidth: '900px',
          margin: '0 auto 3rem auto'
        }}>
          {plans.map((plan, idx) => (
            <PlanCard 
              key={idx} 
              plan={plan} 
              billingPeriod={billingPeriod} 
              onUpgrade={handleUpgrade}
              loading={loading && selectedPlan === plan.planKey}
            />
          ))}
        </div>

        <div style={{
          background: '#f9fafb',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#666', 
            lineHeight: '1.6', 
            margin: 0
          }}>
            🔒 <strong style={{ color: '#1a1a1a' }}>Paiement 100% sécurisé</strong> avec Stripe · Annulation possible à tout moment · Aucun engagement
          </p>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, billingPeriod, onUpgrade, loading }) {
  const Icon = plan.icon
  const displayPrice = billingPeriod === 'yearly' ? plan.priceYearly : plan.price
  const displaySavings = billingPeriod === 'yearly' ? plan.savings : null

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2.5rem',
      boxShadow: plan.popular ? '0 10px 40px rgba(255, 215, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
      border: plan.popular ? `3px solid ${plan.color}` : '1px solid #e5e7eb',
      position: 'relative',
      transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 0.3s'
    }}>
      {plan.popular && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: plan.color,
          color: 'white',
          padding: '0.4rem 1.5rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
        }}>
          ⭐ RECOMMANDÉ
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Icon size={40} color={plan.color} style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          {plan.name}
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>
          {plan.description}
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '3rem', fontWeight: '700', color: plan.color }}>
            {billingPeriod === 'yearly' ? Math.round(displayPrice / 12) : displayPrice}€
          </span>
          <span style={{ fontSize: '1.1rem', color: '#666' }}>/mois</span>
        </div>
        {billingPeriod === 'yearly' && displaySavings && (
          <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600', marginBottom: '0.25rem' }}>
            Économisez {displaySavings}€/an
          </div>
        )}
        {billingPeriod === 'yearly' && displayPrice > 0 && (
          <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem' }}>
            Soit {displayPrice}€ facturés annuellement
          </div>
        )}
      </div>

      <button
        onClick={() => onUpgrade(plan.planKey)}
        disabled={loading}
        style={{
          width: '100%',
          background: plan.popular ? plan.color : 'white',
          color: plan.popular ? 'white' : plan.color,
          border: `2px solid ${plan.color}`,
          padding: '1rem',
          borderRadius: '10px',
          fontSize: '1.05rem',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          opacity: loading ? 0.7 : 1,
          marginBottom: '2rem'
        }}
        onMouseEnter={(e) => {
          if (!loading && !plan.popular) {
            e.target.style.background = `linear-gradient(135deg, ${plan.color} 0%, ${plan.color} 100%)`
            e.target.style.color = '#1a1a1a'
          } else if (!loading && plan.popular) {
            e.target.style.transform = 'scale(1.02)'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !plan.popular) {
            e.target.style.background = 'white'
            e.target.style.color = plan.color
          } else if (!loading && plan.popular) {
            e.target.style.transform = 'scale(1)'
          }
        }}
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin" />
            Redirection Stripe...
          </>
        ) : (
          plan.cta
        )}
      </button>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {plan.features.map((feature, idx) => (
          <li key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.9rem',
            fontSize: '0.95rem',
            color: feature.included ? '#1a1a1a' : '#999'
          }}>
            <Check size={20} color={plan.color} style={{ flexShrink: 0 }} />
            <span>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
