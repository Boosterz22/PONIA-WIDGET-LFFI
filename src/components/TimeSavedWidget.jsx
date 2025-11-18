import React from 'react'
import { Clock, TrendingUp, CheckCircle, Recycle, Euro } from 'lucide-react'

export default function TimeSavedWidget({ timeSavedMinutes = 0, moneyValue = 0, stats = {} }) {
  const hours = Math.floor(timeSavedMinutes / 60)
  const minutes = timeSavedMinutes % 60

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes} min`
  }

  return (
    <div className="card" style={{
      padding: 0,
      background: 'linear-gradient(135deg, #1F2937, #374151)',
      color: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative background */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(255, 215, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <Clock size={24} color="#FFD700" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, marginBottom: '0.25rem' }}>
              ⚡ CETTE SEMAINE, PONIA VOUS A FAIT GAGNER :
            </h3>
          </div>
        </div>

        {/* Main Stats */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#FFD700',
            lineHeight: 1,
            marginBottom: '0.5rem'
          }}>
            {formatTime()}
          </div>
          <div style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Euro size={20} />
            <span>≈ {moneyValue}€ de temps récupéré</span>
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <TrendingUp size={16} color="#10B981" />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>CA optimisé</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
              +{stats.caOptimized || 0}%
            </div>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <CheckCircle size={16} color="#10B981" />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Ruptures évitées</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
              {stats.rupturesAvoided || 0}
            </div>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <Recycle size={16} color="#10B981" />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Économisé</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
              {stats.wasteSaved || 0}€
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.875rem',
          opacity: 0.9
        }}>
          <span style={{ opacity: 0.7 }}>Ce mois : </span>
          <strong>{Math.floor(timeSavedMinutes * 4 / 60)}h{Math.floor((timeSavedMinutes * 4) % 60)}min = {moneyValue * 4}€</strong>
          <span style={{ marginLeft: '0.5rem' }}>💰</span>
        </div>
      </div>
    </div>
  )
}
