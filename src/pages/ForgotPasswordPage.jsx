import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setSent(true)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        padding: '2rem 1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <Link to="/" style={{ 
            display: 'inline-block',
            marginBottom: '3rem'
          }}>
            <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '50px' }} />
          </Link>

          <div style={{
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: '#166534'
            }}>
              Email envoyé ✓
            </h2>
            <p style={{ color: '#166534', fontSize: '0.9375rem', margin: 0 }}>
              Vérifiez votre boîte mail <strong>{email}</strong> pour réinitialiser votre mot de passe.
            </p>
          </div>

          <Link 
            to="/login"
            style={{
              display: 'inline-block',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.9375rem'
            }}
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    )
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
          Mot de passe oublié ?
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.9375rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '1.5rem' }}>
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
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: '100%',
              marginBottom: '1.5rem'
            }}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9375rem'
              }}
            >
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
