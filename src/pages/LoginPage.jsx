import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
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
    { value: 'boulangerie', emoji: '🥖', label: 'Boulangerie / Pâtisserie' },
    { value: 'restaurant', emoji: '🍕', label: 'Restaurant / Traiteur' },
    { value: 'bar', emoji: '☕', label: 'Bar / Café' },
    { value: 'cave', emoji: '🍷', label: 'Cave à vin' },
    { value: 'tabac', emoji: '🚬', label: 'Tabac / Presse' },
    { value: 'boucherie', emoji: '🥩', label: 'Boucherie / Charcuterie' },
    { value: 'fromagerie', emoji: '🧀', label: 'Fromagerie' },
    { value: 'epicerie', emoji: '🛒', label: 'Épicerie / Superette' },
    { value: 'autre', emoji: '📦', label: 'Autre commerce' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/" style={{ 
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '70px' }} />
          </Link>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Bienvenue ! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Créez votre compte en <strong style={{ color: 'var(--primary)' }}>30 secondes</strong>
          </p>
        </div>

        <form onSubmit={handleLogin} className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              📧 Votre email
            </label>
            <input
              type="email"
              className="input"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              🏪 Nom de votre commerce
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Boulangerie Martin"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              🎯 Type de commerce
            </label>
            <select
              className="input"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              style={{ fontSize: '1rem' }}
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.emoji} {type.label}
                </option>
              ))}
            </select>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              💡 On va pré-configurer vos produits selon votre type
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%',
              fontSize: '1.125rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <span>Créer mon compte</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(74, 222, 128, 0.3)'
          }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', textAlign: 'center', marginBottom: '0.75rem', fontWeight: '600' }}>
              🎁 <strong style={{ color: 'var(--success)' }}>PLAN BASIQUE GRATUIT</strong> jusqu'à 10 produits
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
              ✅ Alertes intelligentes 🟢🟠🔴
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
              ✅ Produits pré-configurés selon votre type
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              ✅ Passage au plan payant quand vous voulez
            </p>
          </div>
        </form>

        <p style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          Déjà un compte ? <Link to="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Se connecter →</Link>
        </p>
      </div>
    </div>
  )
}
