import React from 'react'
import { Brain, TrendingDown, TrendingUp, Package, AlertCircle } from 'lucide-react'

export default function AIInsights({ products }) {
  const totalValue = products.reduce((sum, p) => sum + (p.currentQuantity * (p.price || 0)), 0)
  const criticalProducts = products.filter(p => p.currentQuantity <= p.alertThreshold * 0.5).length
  const lowProducts = products.filter(p => p.currentQuantity <= p.alertThreshold && p.currentQuantity > p.alertThreshold * 0.5).length

  const insights = []

  if (criticalProducts > 0) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      color: 'var(--danger)',
      title: `${criticalProducts} produit${criticalProducts > 1 ? 's' : ''} en rupture imminente`,
      message: `Commandez rapidement pour éviter une rupture de stock`
    })
  }

  if (lowProducts > 0) {
    insights.push({
      type: 'info',
      icon: TrendingDown,
      color: 'var(--warning)',
      title: `${lowProducts} produit${lowProducts > 1 ? 's' : ''} en stock faible`,
      message: `Prévoyez une commande dans les prochains jours`
    })
  }

  const highStockProducts = products.filter(p => p.currentQuantity > p.alertThreshold * 3)
  if (highStockProducts.length > 0) {
    insights.push({
      type: 'success',
      icon: Package,
      color: 'var(--success)',
      title: `${highStockProducts.length} produit${highStockProducts.length > 1 ? 's' : ''} en sur-stock`,
      message: `Réduisez vos prochaines commandes pour optimiser`
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      icon: Brain,
      color: 'var(--success)',
      title: 'Stocks optimisés',
      message: 'Tous vos produits sont à un niveau optimal'
    })
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Brain size={24} color="#FFD700" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Insights IA</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <div key={i} className="card" style={{ 
              borderColor: insight.color,
              background: `linear-gradient(135deg, ${insight.color}10 0%, ${insight.color}05 100%)`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Icon size={24} color={insight.color} style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{insight.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{insight.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
