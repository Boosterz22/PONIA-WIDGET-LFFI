import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function CompleteProfilePage({ session }) {
  const navigate = useNavigate()
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('boulangerie')
  const [referredByCode, setReferredByCode] = useState('')
  const [loading, setLoading] = useState(false)

  const generateReferralCode = (businessName, businessType) => {
    const name = businessName.split(' ')[0].toUpperCase().substring(0, 6)
    const type = businessType.substring(0, 4).toUpperCase()
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${name}-${type}${random}`
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const referralCode = generateReferralCode(businessName, businessType)

      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: session.user.id,
          email: session.user.email,
          businessName,
          businessType,
          referralCode,
          referredBy: referredByCode.trim() || null
        })
      })

      localStorage.setItem('ponia_business_type', businessType)
      localStorage.setItem('ponia_user_plan', 'basique')
      localStorage.setItem('ponia_referral_code', referralCode)
      localStorage.setItem('ponia_referrals', JSON.stringify([]))
      localStorage.setItem('ponia_free_months', '0')

      window.location.href = '/dashboard'
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  const businessTypes = [
    { value: 'boulangerie', label: 'Boulangerie / Pâtisserie' },
    { value: 'restaurant', label: 'Restaurant / Traiteur' },
    { value: 'bar', label: 'Bar / Café' },
    { value: 'cave', label: 'Cave à vin' },
    { value: 'tabac', label: 'Tabac / Presse' },
    { value: 'boucherie', label: 'Boucherie / Charcuterie' },
    { value: 'fromagerie', label: 'Fromagerie' },
    { value: 'epicerie', label: 'Épicerie / Superette' },
    { value: 'autre', label: 'Autre commerce' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link to="/" style={{ 
          display: 'inline-block',
          marginBottom: '3rem'
        }}>
          <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '50px' }} />
        </Link>

        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 600,
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
          color: '#000'
        }}>
          Complétez votre profil
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.9375rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Dernière étape : parlez-nous de votre commerce pour personnaliser votre expérience PONIA.
        </p>

        <form onSubmit={handleComplete}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Nom du commerce
            </label>
            <input
              type="text"
              placeholder="Ex: Boulangerie Dupont"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Type de commerce
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem',
                cursor: 'pointer'
              }}
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Code de parrainage (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex: BOULANG-BOUL12"
              value={referredByCode}
              onChange={(e) => setReferredByCode(e.target.value.toUpperCase())}
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              lineHeight: 1.5
            }}>
              Si un commerçant vous a recommandé PONIA, entrez son code de parrainage
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Configuration...' : 'Commencer à utiliser PONIA'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '0.8125rem',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: 0
          }}>
            Plan <strong style={{ color: '#000' }}>Basique gratuit</strong> jusqu'à 10 produits. 
            Passez à Standard (49€/mois) ou Pro (69€/mois) quand vous voulez.
          </p>
        </div>
      </div>
    </div>
  )
}
