import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      alert('Mot de passe modifié avec succès !')
      navigate('/login')
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
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
          Nouveau mot de passe
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.9375rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              placeholder="Retapez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            style={{ width: '100%' }}
          >
            {loading ? 'Modification...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
