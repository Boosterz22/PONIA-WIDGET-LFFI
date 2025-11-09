import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Crown, Check, Loader, Sparkles } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'

export default function UpgradePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'standard')
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = {
    standard: {
      name: 'Standard',
      priceMonthly: 49,
      priceYearly: 470,
      color: '#FFD700',
      icon: Crown,
      features: [
        '50 produits maximum',
        'IA prédictive 7 jours',
        'Chat AI illimité',
        'Alertes intelligentes',
        'Support prioritaire'
      ]
    },
    pro: {
      name: 'Pro',
      priceMonthly: 69,
      priceYearly: 660,
      color: '#FFD700',
      icon: Sparkles,
      features: [
        'Produits illimités',
        'IA prédictive 30 jours',
        'Multi-magasins',
        'Chat AI premium',
        'Alertes avancées',
        'API développeur',
        'Support VIP 24/7'
      ]
    }
  }

  const getPrice = (plan) => {
    const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly
    return `€${price}`
  }

  const getPeriod = () => {
    return billingPeriod === 'monthly' ? '/mois' : '/an'
  }

  const getSavings = (plan) => {
    const yearlyCost = plan.priceMonthly * 12
    const savings = yearlyCost - plan.priceYearly
    return Math.round((savings / yearlyCost) * 100)
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
        body: JSON.stringify({ 
          plan,
          billingPeriod
        })
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.06) 50%, rgba(255, 255, 255, 0.95) 100%)',
      paddingBottom: '80px' 
    }}>
      <Navigation />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Logo PONIA */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <img 
              src="/ponia-logo.png" 
              alt="PONIA" 
              style={{ 
                height: 'clamp(120px, 20vw, 180px)',
                maxWidth: '100%'
              }} 
            />
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 215, 0, 0.15)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Sparkles size={18} color="#FFD700" />
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFD700' }}>
              Essai gratuit 14 jours · Sans carte bancaire
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: '800', 
            marginBottom: '1rem',
            color: '#FFD700'
          }}>
            Passez à la vitesse supérieure
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#374151', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Débloquez toute la puissance de l'IA pour optimiser votre stock et <strong style={{ color: '#FFD700' }}>économiser des milliers d'euros</strong> par an
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: billingPeriod === 'monthly' ? '2px solid #FFD700' : '2px solid #E5E7EB',
              background: billingPeriod === 'monthly' 
                ? 'rgba(255, 215, 0, 0.15)'
                : 'white',
              color: billingPeriod === 'monthly' ? '#FFD700' : '#6B7280',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            style={{
              position: 'relative',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: billingPeriod === 'yearly' ? '2px solid #FFD700' : '2px solid #E5E7EB',
              background: billingPeriod === 'yearly'
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)'
                : 'white',
              color: billingPeriod === 'yearly' ? '#FFD700' : '#6B7280',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Annuel
            <span style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: '#FFD700',
              color: '#1a1a1a',
              padding: '0.2rem 0.5rem',
              borderRadius: '10px',
              fontSize: '0.65rem',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)'
            }}>
              -20%
            </span>
          </button>
        </div>

        {/* Plans Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
          gap: '2rem',
          marginBottom: '3rem',
          maxWidth: '900px',
          margin: '0 auto 3rem auto'
        }}>
          {Object.entries(plans).map(([key, plan]) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === key
            const isPro = key === 'pro'
            
            return (
              <div 
                key={key}
                onClick={() => setSelectedPlan(key)}
                style={{ 
                  position: 'relative',
                  background: 'rgba(255, 215, 0, 0.08)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  border: isSelected 
                    ? `3px solid ${plan.color}` 
                    : '2px solid rgba(255, 215, 0, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected 
                    ? '0 10px 40px rgba(255, 215, 0, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                {isPro && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFD700 100%)',
                    color: '#1a1a1a',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Sparkles size={12} />
                    POPULAIRE
                  </div>
                )}

                {/* Icon */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255, 215, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={40} color={plan.color} />
                  </div>
                </div>

                {/* Plan Name & Price */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '700', 
                    color: '#1a1a1a',
                    marginBottom: '0.75rem'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    justifyContent: 'center', 
                    gap: '0.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '3.5rem', 
                      fontWeight: '800', 
                      color: plan.color,
                      lineHeight: '1'
                    }}>
                      {getPrice(plan)}
                    </span>
                    <span style={{ fontSize: '1.25rem', color: '#6B7280', fontWeight: '600' }}>
                      {getPeriod()}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '2rem' }}>
                  {plan.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        marginBottom: '1rem',
                        padding: '0.5rem 0'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: plan.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Check size={14} color="white" strokeWidth={3} />
                      </div>
                      <span style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937',
                        fontWeight: '500'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(key)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: isSelected ? '#fff' : '#1a1a1a',
                    background: isSelected 
                      ? `linear-gradient(135deg, ${plan.color} 0%, #FFD700 100%)`
                      : 'white',
                    border: isSelected ? 'none' : `2px solid ${plan.color}`,
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: isSelected 
                      ? '0 8px 24px rgba(255, 215, 0, 0.4)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !isSelected) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${plan.color} 0%, #FFD700 100%)`
                      e.currentTarget.style.color = '#fff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !isSelected) {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#1a1a1a'
                    }
                  }}
                >
                  {loading && selectedPlan === key ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Redirection Stripe...
                    </>
                  ) : (
                    <>
                      <Crown size={20} />
                      {`Choisir ${plan.name}`}
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Security Notice */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#FFD700', 
            lineHeight: '1.6', 
            margin: 0,
            fontWeight: '600'
          }}>
            🔒 <strong>Paiement 100% sécurisé</strong> avec Stripe · Annulation possible à tout moment · Aucun engagement
          </p>
        </div>
      </div>
    </div>
  )
}
