import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Shield, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Code admin invalide')
        return
      }

      const { error: authError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      })

      if (authError) {
        setError('Erreur de connexion')
        return
      }

      navigate('/admin')
    } catch (err) {
      console.error('Erreur login admin:', err)
      setError('Erreur de connexion. Vérifiez votre code admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}>
          <Shield size={35} color="white" />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: '#1F2937'
        }}>
          Connexion Admin
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6B7280',
          marginBottom: '2rem',
          fontSize: '0.95rem'
        }}>
          Entrez votre code administrateur PONIA
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Code Admin
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ADMIN-XXXXXXXX"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily: 'monospace',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#FEE2E2',
              border: '1px solid #EF4444',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              color: '#991B1B',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading || !code 
                ? '#D1D5DB' 
                : 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: loading || !code ? '#6B7280' : '#1F2937',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading || !code ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading && code) e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {loading ? 'Connexion...' : 'Accéder à l\'admin'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.8125rem',
            color: '#9CA3AF'
          }}>
            Dashboard administrateur PONIA
          </p>
        </div>
      </div>
    </div>
  )
}
