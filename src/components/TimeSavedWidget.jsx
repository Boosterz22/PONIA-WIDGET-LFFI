import React from 'react'
import { Clock, TrendingUp, CheckCircle, Recycle, Euro } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function TimeSavedWidget({ timeSavedMinutes = 0, moneyValue = 0, stats = {} }) {
  const { t } = useLanguage()
  const hours = Math.floor(timeSavedMinutes / 60)
  const minutes = timeSavedMinutes % 60

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes} min`
  }

  const monthlyHours = Math.floor(timeSavedMinutes * 4 / 60)
  const monthlyMinutes = Math.floor((timeSavedMinutes * 4) % 60)

  return (
    <div className="card" style={{
      padding: 0,
      background: 'linear-gradient(135deg, #1F2937, #374151)',
      color: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative'
    }}>
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
              {t('timeSaved.title')}
            </h3>
          </div>
        </div>

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
            <span>≈ {moneyValue}€ {t('timeSaved.recovered')}</span>
          </div>
        </div>

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
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('timeSaved.caOptimized')}</span>
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
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('timeSaved.rupturesAvoided')}</span>
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
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('timeSaved.wasteSaved')}</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
              {stats.wasteSaved || 0}€
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.875rem',
          opacity: 0.9
        }}>
          <span style={{ opacity: 0.7 }}>{t('timeSaved.thisMonth')} : </span>
          <strong>{monthlyHours}h{monthlyMinutes}min = {moneyValue * 4}€</strong>
        </div>
      </div>
    </div>
  )
}
