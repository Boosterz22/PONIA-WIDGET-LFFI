import React from 'react'
import { TrendingUp, AlertTriangle, CheckCircle, Crown, FileText, Loader2 } from 'lucide-react'

export default function AIInsights({ products, businessType, plan, onGenerateOrder, isGeneratingPDF }) {
  if (!products || products.length === 0) {
    return null
  }

  const criticalProducts = products.filter(p => p.currentQuantity <= (p.alertThreshold || 10) * 0.5)
  const lowStockProducts = products.filter(p => 
    p.currentQuantity > (p.alertThreshold || 10) * 0.5 && 
    p.currentQuantity <= (p.alertThreshold || 10)
  )
  const healthyProducts = products.filter(p => p.currentQuantity > (p.alertThreshold || 10))
  
  const healthScore = Math.round((healthyProducts.length / products.length) * 100)
  
  let status = 'good'
  let message = 'Votre stock est optimal'
  let statusColor = '#10B981'
  
  if (criticalProducts.length > 0) {
    status = 'critical'
    message = `${criticalProducts.length} produit${criticalProducts.length > 1 ? 's' : ''} nécessite${criticalProducts.length > 1 ? 'nt' : ''} une action urgente`
    statusColor = '#EF4444'
  } else if (lowStockProducts.length > 0) {
    status = 'warning'
    message = `${lowStockProducts.length} produit${lowStockProducts.length > 1 ? 's' : ''} en stock faible`
    statusColor = '#F59E0B'
  }
  
  const topActions = []
  
  if (criticalProducts.length > 0) {
    topActions.push({
      priority: 'urgent',
      title: 'Commander immédiatement',
      products: criticalProducts.map(p => p.name).join(', '),
      color: '#EF4444',
      icon: AlertTriangle
    })
  }
  
  if (lowStockProducts.length > 0 && topActions.length < 3) {
    topActions.push({
      priority: 'moderate',
      title: 'Planifier une commande cette semaine',
      products: lowStockProducts.slice(0, 2).map(p => p.name).join(', '),
      color: '#F59E0B',
      icon: TrendingUp
    })
  }
  
  if (healthyProducts.length === products.length) {
    topActions.push({
      priority: 'success',
      title: 'Gestion optimale',
      products: 'Tous vos stocks sont au niveau idéal',
      color: '#10B981',
      icon: CheckCircle
    })
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Analyse intelligente
          </h3>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.875rem',
            margin: 0
          }}>
            {message}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: '#F9FAFB',
          borderRadius: '10px',
          minWidth: '120px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: statusColor,
            lineHeight: '1'
          }}>
            {healthScore}%
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginTop: '0.25rem'
          }}>
            Santé Stock
          </div>
        </div>
      </div>

      {topActions.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '1rem'
          }}>
            Actions recommandées
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topActions.slice(0, 3).map((action, index) => {
              const Icon = action.icon
              return (
                <div key={index} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${action.color}`,
                  alignItems: 'flex-start'
                }}>
                  <Icon size={20} color={action.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      fontSize: '0.9rem',
                      marginBottom: '0.25rem'
                    }}>
                      {action.title}
                    </div>
                    <div style={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      {action.products}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {(criticalProducts.length > 0 || lowStockProducts.length > 0) && (
            <button
              onClick={onGenerateOrder}
              disabled={isGeneratingPDF}
              style={{
                marginTop: '1rem',
                padding: '0.875rem 1.25rem',
                background: isGeneratingPDF ? '#D1D5DB' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '8px',
                color: '#1F2937',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                transition: 'all 0.2s',
                opacity: isGeneratingPDF ? 0.7 : 1
              }}
              onMouseEnter={(e) => !isGeneratingPDF && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Générer bon de commande
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #F3F4F6'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#EF4444',
            lineHeight: '1'
          }}>
            {criticalProducts.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginTop: '0.25rem',
            textAlign: 'center'
          }}>
            Rupture imminente
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#F59E0B',
            lineHeight: '1'
          }}>
            {lowStockProducts.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginTop: '0.25rem',
            textAlign: 'center'
          }}>
            Stock faible
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#10B981',
            lineHeight: '1'
          }}>
            {healthyProducts.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginTop: '0.25rem',
            textAlign: 'center'
          }}>
            Stock optimal
          </div>
        </div>
      </div>

      {plan === 'basique' && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '0.25rem',
              fontSize: '0.95rem'
            }}>
              Débloquez les prédictions avancées
            </div>
            <div style={{
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Prédictions 7 jours + Suggestions optimisées par IA
            </div>
          </div>
          <button style={{
            background: '#1F2937',
            color: 'white',
            border: 'none',
            padding: '0.625rem 1.25rem',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Crown size={16} />
            Passer à Standard
          </button>
        </div>
      )}
    </div>
  )
}
