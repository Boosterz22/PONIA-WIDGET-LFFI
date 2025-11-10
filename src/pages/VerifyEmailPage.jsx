import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  
  const email = location.state?.email || localStorage.getItem('pending_verification_email') || ''

  const handleResendEmail = async () => {
    if (!email) {
      alert('Email introuvable. Veuillez vous réinscrire.')
      navigate('/login')
      return
    }

    setResending(true)
    setResendSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (error) {
      alert(error.message || 'Erreur lors du renvoi de l\'email')
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
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
              height: '60px',
              width: 'auto'
            }} 
          />
        </Link>

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Mail size={40} color="#FFD700" />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          Vérifiez votre email
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Un email de confirmation a été envoyé à :<br />
          <strong style={{ color: '#1a1a1a' }}>{email}</strong>
        </p>

        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Étapes suivantes :
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ 
                fontSize: '0.9375rem', 
                color: '#4b5563',
                margin: 0,
                lineHeight: 1.5
              }}>
                <strong>1. Ouvrez votre boîte email</strong> et cherchez un message de PONIA AI
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ 
                fontSize: '0.9375rem', 
                color: '#4b5563',
                margin: 0,
                lineHeight: 1.5
              }}>
                <strong>2. Cliquez sur le lien de confirmation</strong> dans l'email
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ 
                fontSize: '0.9375rem', 
                color: '#4b5563',
                margin: 0,
                lineHeight: 1.5
              }}>
                <strong>3. Vous serez automatiquement redirigé</strong> vers PONIA pour configurer votre commerce
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          textAlign: 'left'
        }}>
          <Clock size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{
            fontSize: '0.875rem',
            color: '#92400e',
            margin: 0,
            lineHeight: 1.5
          }}>
            <strong>Délai normal :</strong> L'email peut prendre jusqu'à 5 minutes pour arriver. Vérifiez aussi vos spams.
          </p>
        </div>

        {resendSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={20} color="#10B981" />
            <p style={{
              fontSize: '0.9375rem',
              color: '#065f46',
              margin: 0,
              fontWeight: 500
            }}>
              Email renvoyé avec succès !
            </p>
          </div>
        )}

        <button
          onClick={handleResendEmail}
          disabled={resending}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1a1a1a',
            background: resending ? '#e5e7eb' : '#FFD700',
            border: 'none',
            borderRadius: '12px',
            cursor: resending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            if (!resending) e.target.style.background = '#FFC700'
          }}
          onMouseLeave={(e) => {
            if (!resending) e.target.style.background = '#FFD700'
          }}
        >
          {resending ? 'Envoi en cours...' : 'Renvoyer l\'email de confirmation'}
        </button>

        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.75rem'
          }}>
            Mauvaise adresse email ?
          </p>
          <Link
            to="/login"
            onClick={() => localStorage.removeItem('pending_verification_email')}
            style={{
              fontSize: '0.9375rem',
              color: '#FFD700',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Retour à l'inscription
          </Link>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', justifyContent: 'center' }}>
            <AlertCircle size={18} color="#6b7280" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{
              fontSize: '0.8125rem',
              color: '#6b7280',
              margin: 0,
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              <strong>Problème technique ?</strong> Contactez-nous à support@ponia.ai et nous vous aiderons à activer votre compte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
