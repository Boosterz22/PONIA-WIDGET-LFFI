import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function VerifyCodePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    const emailFromState = location.state?.email
    const emailFromStorage = localStorage.getItem('pending_verification_email')
    
    if (emailFromState) {
      setEmail(emailFromState)
      localStorage.setItem('pending_verification_email', emailFromState)
    } else if (emailFromStorage) {
      setEmail(emailFromStorage)
    } else {
      navigate('/login')
    }
  }, [location, navigate])

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres')
      setLoading(false)
      return
    }

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      })

      if (verifyError) {
        throw verifyError
      }

      if (data.session) {
        localStorage.removeItem('pending_verification_email')
        navigate('/complete-profile', { replace: true })
      } else {
        throw new Error('Aucune session créée après vérification')
      }
    } catch (err) {
      console.error('Erreur vérification code:', err)
      if (err.message?.includes('expired')) {
        setError('Code expiré. Demandez un nouveau code.')
      } else if (err.message?.includes('invalid')) {
        setError('Code incorrect. Vérifiez et réessayez.')
      } else {
        setError(err.message || 'Erreur lors de la vérification. Veuillez réessayer.')
      }
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendSuccess(false)
    setError('')

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email
      })

      if (resendError) throw resendError

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (err) {
      console.error('Erreur renvoi code:', err)
      setError('Erreur lors du renvoi du code. Veuillez réessayer.')
    }
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <Link to="/" style={{ 
          display: 'inline-block',
          marginBottom: '2rem'
        }}>
          <img 
            src="/ponia-logo.png" 
            alt="PONIA" 
            style={{ 
              height: '210px',
              width: 'auto'
            }} 
          />
        </Link>

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}>
          <Mail size={40} color="#FFD700" />
        </div>

        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: '#1a1a1a'
        }}>
          Vérifiez votre email
        </h1>

        <p style={{ 
          color: '#6b7280', 
          fontSize: '1rem',
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Nous avons envoyé un code à 6 chiffres à :<br />
          <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>{email}</strong>
        </p>

        <form onSubmit={handleVerifyCode}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              textAlign: 'left'
            }}>
              Code de vérification
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={code}
              onChange={handleCodeChange}
              placeholder="123456"
              required
              maxLength={6}
              autoComplete="one-time-code"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.5rem',
                fontWeight: 600,
                textAlign: 'center',
                letterSpacing: '0.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '0.5rem',
              textAlign: 'left'
            }}>
              Entrez le code à 6 chiffres reçu par email
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} color="#dc2626" />
              <span style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'left' }}>
                {error}
              </span>
            </div>
          )}

          {resendSuccess && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={18} color="#16a34a" />
              <span style={{ fontSize: '0.875rem', color: '#16a34a', textAlign: 'left' }}>
                Code renvoyé avec succès ! Vérifiez votre boîte mail.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'white',
              background: code.length === 6 
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                : '#d1d5db',
              border: 'none',
              borderRadius: '12px',
              cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: code.length === 6 ? '0 4px 12px rgba(255, 215, 0, 0.3)' : 'none'
            }}
          >
            {loading ? 'Vérification...' : 'Vérifier le code'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f9fafb',
          borderRadius: '12px',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem',
            lineHeight: 1.6
          }}>
            💡 <strong>Vous n'avez pas reçu le code ?</strong>
          </p>
          <ul style={{
            fontSize: '0.8125rem',
            color: '#6b7280',
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
            lineHeight: 1.8
          }}>
            <li>Vérifiez vos spams / courrier indésirable</li>
            <li>Le code peut prendre jusqu'à 2 minutes pour arriver</li>
            <li>Le code est valable pendant 1 heure</li>
          </ul>
          <button
            onClick={handleResendCode}
            style={{
              background: 'transparent',
              color: '#FFD700',
              border: '2px solid #FFD700',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 215, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
            }}
          >
            Renvoyer le code
          </button>
        </div>

        <div style={{ 
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Mauvaise adresse email ?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#FFD700', 
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Retour à l'inscription
            </Link>
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '1rem' }}>
            Besoin d'aide ? <a href="mailto:support@myponia.fr" style={{ color: '#FFD700', textDecoration: 'none' }}>support@myponia.fr</a>
          </p>
        </div>
      </div>
    </div>
  )
}
