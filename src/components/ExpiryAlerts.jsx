import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AlertTriangle, Calendar, TrendingDown, Lightbulb, X, Loader } from 'lucide-react'
import { getExpirySuggestions } from '../services/expiryService'
import { getExpiryAISuggestions } from '../services/openaiService'

export default function ExpiryAlerts({ expiryAlerts }) {
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [loadingAI, setLoadingAI] = useState({})
  const loadingRef = useRef({}) // Tracking synchrone des fetches en cours

  // Charger les suggestions IA pour un produit spécifique
  const loadAISuggestions = async (product, force = false) => {
    // Bloquer immédiatement si déjà en cours (vérification synchrone)
    if (loadingRef.current[product.id]) {
      console.log(`Fetch déjà en cours pour ${product.name}`)
      return
    }
    
    // Marquer comme en cours
    loadingRef.current[product.id] = true
    setLoadingAI(prev => ({ ...prev, [product.id]: true }))
    
    try {
      const suggestions = await getExpiryAISuggestions(product)
      setAiSuggestions(prev => ({ ...prev, [product.id]: suggestions || [] }))
    } catch (error) {
      console.error('Erreur chargement suggestions IA:', error)
      setAiSuggestions(prev => ({ ...prev, [product.id]: [] }))
    } finally {
      // Libérer le verrou
      loadingRef.current[product.id] = false
      setLoadingAI(prev => ({ ...prev, [product.id]: false }))
    }
  }

  // Créer une clé stable pour les produits critiques
  const criticalProductsKey = useMemo(() => {
    return expiryAlerts
      .filter(p => p.severity === 'critical' || p.severity === 'expired')
      .slice(0, 2)
      .map(p => `${p.id}-${p.severity}`)
      .sort()
      .join(',')
  }, [expiryAlerts])

  // Auto-load IA désactivé pour sécurité (pas de vérification clés côté frontend)
  // L'utilisateur peut cliquer sur "Obtenir suggestions IA" manuellement // Dépend de la clé memoïsée

  if (!expiryAlerts || expiryAlerts.length === 0) {
    return null
  }

  const severityStyles = {
    expired: {
      border: '#991b1b',
      bg: 'rgba(153, 27, 27, 0.1)',
      color: '#991b1b',
      icon: '🗑️'
    },
    critical: {
      border: 'var(--danger)',
      bg: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--danger)',
      icon: '🔴'
    },
    warning: {
      border: 'var(--warning)',
      bg: 'rgba(251, 146, 60, 0.1)',
      color: 'var(--warning)',
      icon: '🟠'
    },
    info: {
      border: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      icon: '🔵'
    }
  }

  return (
    <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--danger)', borderWidth: '2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Calendar size={24} color="var(--danger)" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          ⚠️ Alertes Péremption ({expiryAlerts.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expiryAlerts.map(product => {
          const style = severityStyles[product.severity]
          const localSuggestions = getExpirySuggestions(product)
          const productAISuggestions = aiSuggestions[product.id] || []
          const allSuggestions = productAISuggestions.length > 0 ? productAISuggestions : localSuggestions
          const isExpanded = expandedProduct === product.id
          const isLoadingAI = loadingAI[product.id]

          return (
            <div
              key={product.id}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${style.border}`,
                background: style.bg
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{style.icon}</span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
                      {product.name}
                    </h3>
                  </div>
                  <p style={{ color: style.color, fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {product.message}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Stock actuel : {product.currentQuantity} {product.unit}
                  </p>
                </div>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {isExpanded ? <X size={20} /> : <Lightbulb size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid rgba(0,0,0,0.1)' 
                }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={18} color={style.color} />
                    Suggestions {productAISuggestions.length > 0 ? 'IA' : ''} :
                  </p>
                  
                  {isLoadingAI && (
                    <div style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        L'IA analyse vos options...
                      </span>
                    </div>
                  )}
                  
                  {!isLoadingAI && allSuggestions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {allSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{suggestion.icon}</span>
                          <span style={{ fontSize: '0.95rem' }}>{suggestion.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!isLoadingAI && productAISuggestions.length === 0 && (
                    <button
                      onClick={() => loadAISuggestions(product, true)}
                      className="btn btn-primary"
                      style={{ 
                        width: '100%', 
                        marginTop: '0.5rem',
                        fontSize: '0.95rem',
                        padding: '0.65rem'
                      }}
                    >
                      <Lightbulb size={16} style={{ marginRight: '0.5rem' }} />
                      {aiSuggestions[product.id] !== undefined ? 'Réessayer suggestions IA' : 'Obtenir des suggestions IA personnalisées'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
