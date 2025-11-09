import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      
      setTimeout(() => {
        navigate('/complete-profile')
      }, 800)
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user && data.session) {
        const userRes = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })
        
        if (userRes.ok) {
          const { user } = await userRes.json()
          
          if (user) {
            localStorage.setItem('ponia_business_type', user.businessType || 'default')
            localStorage.setItem('ponia_user_plan', user.plan || 'basique')
            localStorage.setItem('ponia_referral_code', user.referralCode || '')
          }
        }
      }
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

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
        padding: '1.5rem 1rem'
      }}>
        <Link to="/" style={{ 
          display: 'inline-block',
          marginBottom: '0.5rem',
          alignSelf: 'flex-start'
        }}>
          <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '200px' }} />
        </Link>

        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600,
            marginBottom: '0.5rem',
            letterSpacing: '-0.03em',
            color: '#000'
          }}>
            {isSignup ? 'Créer un compte' : 'Se connecter'}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9375rem',
            marginBottom: '1.25rem',
            lineHeight: 1.5
          }}>
            {isSignup ? 'Commencez gratuitement. Aucune carte bancaire requise.' : 'Accédez à votre compte PONIA.'}
          </p>

          <form onSubmit={isSignup ? handleSignup : handleLogin} style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
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
                placeholder=""
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

            <div style={{ marginBottom: '1rem' }}>
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
                placeholder=""
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
              {loading ? (isSignup ? 'Création du compte...' : 'Connexion...') : (isSignup ? 'Continuer' : 'Se connecter')}
            </button>

            {!isSignup && (
              <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
                <Link 
                  to="/forgot-password"
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    textDecoration: 'none'
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}
          </form>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: 0, 
              right: 0, 
              height: '1px', 
              background: '#e5e7eb' 
            }} />
            <div style={{ 
              position: 'relative', 
              textAlign: 'center' 
            }}>
              <span style={{ 
                background: '#fafafa', 
                padding: '0 1rem', 
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                ou
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#374151',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f9fafb'
              e.target.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff'
              e.target.style.borderColor = '#e5e7eb'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          {isSignup && (
            <div style={{
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '2rem'
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
          )}

          <p style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <span 
              onClick={() => setIsSignup(!isSignup)}
              style={{ 
                color: '#FFD700', 
                textDecoration: 'none', 
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSignup ? 'Se connecter' : 'Créer un compte'}
            </span>
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
            Économisez 35h/mois et €9,200/an. Sans effort, sans formation.
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
              <span style={{ fontSize: '0.9375rem' }}>Installation en 2 minutes chrono</span>
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
              <span style={{ fontSize: '0.9375rem' }}>ROI positif dès le 1er mois garanti</span>
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
