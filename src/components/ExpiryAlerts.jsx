import React from 'react'
import { Calendar, Lightbulb } from 'lucide-react'
import { getExpirySuggestions } from '../services/expiryService'

export default function ExpiryAlerts({ expiryAlerts }) {
  if (!expiryAlerts || expiryAlerts.length === 0) {
    return null
  }

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'expired':
        return { color: '#000', bg: 'rgba(0, 0, 0, 0.1)', icon: '🗑️', text: 'Périmé' }
      case 'critical':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '🔴', text: 'Critique' }
      case 'warning':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🟠', text: 'Attention' }
      case 'info':
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: '🔵', text: 'Info' }
      default:
        return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', icon: '⚪', text: 'Normal' }
    }
  }

  return (
    <div className="card" style={{ marginBottom: '2rem', borderColor: '#f59e0b', borderWidth: '2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Calendar size={32} color="#f59e0b" />
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            📅 Alertes de Péremption
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {expiryAlerts.length} produit{expiryAlerts.length > 1 ? 's' : ''} nécessite votre attention
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expiryAlerts.map((product) => {
          const config = getSeverityConfig(product.severity)
          const localSuggestions = getExpirySuggestions(product)
          
          return (
            <div
              key={product.id}
              style={{
                background: config.bg,
                borderRadius: '12px',
                padding: '1rem',
                border: `1px solid ${config.color}40`
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{product.name}</h4>
                  <span style={{
                    background: config.color,
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {config.text}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {product.message}
                </p>
                
                {localSuggestions && localSuggestions.length > 0 && (
                  <div style={{ 
                    background: 'rgba(59, 130, 246, 0.05)', 
                    borderRadius: '8px', 
                    padding: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Lightbulb size={14} /> Suggestions rapides
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {localSuggestions.map((suggestion, idx) => (
                        <div key={idx} style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                          {suggestion.icon} {suggestion.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
