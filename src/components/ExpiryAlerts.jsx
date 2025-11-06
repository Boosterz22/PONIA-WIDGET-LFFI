import React, { useState } from 'react'
import { Calendar, Lightbulb, Loader } from 'lucide-react'
import { getExpirySuggestions } from '../services/expiryService'

export default function ExpiryAlerts({ expiryAlerts }) {
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [loadingAI, setLoadingAI] = useState({})
  const [aiErrors, setAiErrors] = useState({})
  
  if (!expiryAlerts || expiryAlerts.length === 0) {
    return null
  }
  
  // Import dynamique pour éviter crash au chargement
  const loadAISuggestion = async (product) => {
    if (loadingAI[product.id]) return
    
    setLoadingAI(prev => ({ ...prev, [product.id]: true }))
    setAiErrors(prev => ({ ...prev, [product.id]: null }))
    
    try {
      // Import dynamique de openaiService (chargé uniquement au clic)
      const { getExpiryAISuggestions } = await import('../services/openaiService')
      
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Délai d\'attente dépassé')), 10000)
      )
      
      const aiCall = getExpiryAISuggestions(product)
      const suggestions = await Promise.race([aiCall, timeout])
      
      setAiSuggestions(prev => ({ ...prev, [product.id]: suggestions || 'Aucune suggestion disponible' }))
    } catch (error) {
      console.error('Erreur IA:', error)
      const errorMsg = error.message === 'Délai d\'attente dépassé' 
        ? 'L\'IA met trop de temps à répondre'
        : 'Service IA temporairement indisponible'
      setAiErrors(prev => ({ ...prev, [product.id]: errorMsg }))
    } finally {
      setLoadingAI(prev => ({ ...prev, [product.id]: false }))
    }
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
          const hasAISuggestion = aiSuggestions[product.id]
          const isLoading = loadingAI[product.id]
          const error = aiErrors[product.id]
          
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
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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
                      marginBottom: hasAISuggestion || error ? '0.75rem' : 0,
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
                  
                  {hasAISuggestion && (
                    <div style={{ 
                      background: 'rgba(168, 85, 247, 0.05)', 
                      borderRadius: '8px', 
                      padding: '0.75rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a855f7', marginBottom: '0.5rem' }}>
                        🤖 Suggestion IA personnalisée
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                        {hasAISuggestion}
                      </p>
                    </div>
                  )}
                  
                  {error && (
                    <div style={{ 
                      background: 'rgba(239, 68, 68, 0.05)', 
                      borderRadius: '8px', 
                      padding: '0.75rem',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#ef4444', margin: 0 }}>
                        ⚠️ {error}
                      </p>
                    </div>
                  )}
                </div>
                
                {!hasAISuggestion && (product.severity === 'critical' || product.severity === 'expired') && (
                  <button
                    onClick={() => loadAISuggestion(product)}
                    disabled={isLoading}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={14} className="spin" />
                        <span>Chargement...</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb size={14} />
                        <span>Conseil IA</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
