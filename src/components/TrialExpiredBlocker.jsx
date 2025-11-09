import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Lock } from 'lucide-react'

export default function TrialExpiredBlocker() {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '3rem 2rem',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FEE2E2, #FEF2F2)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Lock size={40} style={{ color: '#DC2626' }} />
        </div>

        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          color: '#111827'
        }}>
          Essai gratuit terminé
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#6B7280',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Votre période d'essai de 14 jours est terminée. Passez à un plan payant pour continuer à profiter de PONIA AI et optimiser votre gestion de stock.
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
          border: '2px solid #FFD700',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#9A3412', marginBottom: '0.75rem', fontWeight: '600' }}>
            Débloquez toute la puissance de PONIA AI :
          </div>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '0.875rem',
            color: '#6B7280'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ Prédictions IA avancées</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Chat AI illimité</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Alertes intelligentes en temps réel</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Génération de commandes automatique</li>
            <li>✅ ROI prouvé : €9,200/an économisés</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/upgrade')}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <Crown size={20} />
          Passer à un plan payant
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6B7280',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
