import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('boulangerie')
  const [loading, setLoading] = useState(false)

  const generateReferralCode = (businessName, businessType) => {
    const name = businessName.split(' ')[0].toUpperCase().substring(0, 6)
    const type = businessType.substring(0, 4).toUpperCase()
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${name}-${type}${random}`
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    localStorage.setItem('ponia_business_name', businessName)
    localStorage.setItem('ponia_business_type', businessType)
    localStorage.setItem('ponia_user_email', email)
    localStorage.setItem('ponia_user_plan', 'basique')
    
    const referralCode = generateReferralCode(businessName, businessType)
    localStorage.setItem('ponia_referral_code', referralCode)
    localStorage.setItem('ponia_referrals', JSON.stringify([]))
    localStorage.setItem('ponia_free_months', '0')
    
    setTimeout(() => {
      navigate('/dashboard')
    }, 800)
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
      background: '#fafafa'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Link to="/" style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '3rem',
            textDecoration: 'none',
            color: '#000'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              marginRight: '0.75rem'
            }}>
              ⚡
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>PONIA</span>
          </Link>

          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600,
            marginBottom: '0.5rem',
            letterSpacing: '-0.03em',
            color: '#000'
          }}>
            Créer un compte
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9375rem',
            marginBottom: '2rem',
            lineHeight: 1.5
          }}>
            Commencez gratuitement. Aucune carte bancaire requise.
          </p>

          <form onSubmit={handleLogin} style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Email professionnel
              </label>
              <input
                type="email"
                placeholder="vous@votrecommerce.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fff',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fff',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                Nom du commerce
              </label>
              <input
                type="text"
                placeholder="Boulangerie Martin"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fff',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fff',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {businessTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '0.875rem 1rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#000',
                background: loading ? '#e5e7eb' : '#FFD700',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
                letterSpacing: '-0.01em'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#FFC700'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#FFD700'
              }}
            >
              {loading ? 'Création du compte...' : 'Continuer'}
            </button>
          </form>

          <div style={{
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

          <p style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Déjà un compte ?{' '}
            <Link 
              to="/dashboard" 
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                fontWeight: 600 
              }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="hide-mobile">
        <div style={{
          maxWidth: '500px',
          color: '#000',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.1
          }}>
            Zéro rupture.
            <br />
            Zéro gaspillage.
          </div>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            opacity: 0.9,
            marginBottom: '2rem'
          }}>
            Rejoignez 50+ commerces qui économisent €9,200/an avec des alertes IA prédictives.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>✓</div>
              <span style={{ fontSize: '0.9375rem' }}>Configuration en 2 minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>✓</div>
              <span style={{ fontSize: '0.9375rem' }}>Alertes intelligentes en temps réel</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>✓</div>
              <span style={{ fontSize: '0.9375rem' }}>Commandes vocales sans les mains</span>
            </div>
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(100px)'
        }} />
      </div>
    </div>
  )
}
