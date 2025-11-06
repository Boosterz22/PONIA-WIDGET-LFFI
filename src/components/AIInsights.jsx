import React, { useState, useEffect } from 'react'
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Loader, Sparkles } from 'lucide-react'
import '../styles/aiInsights.css'

export default function AIInsights({ products, businessType, plan }) {
  const [loading, setLoading] = useState(false)
  
  if (!products || products.length === 0) {
    return (
      <div className="ai-insights-panel">
        <div className="ai-header">
          <div className="ai-title">
            <Brain size={24} color="#F59E0B" />
            <h2>🤖 PONIA AI - Analyse Intelligente</h2>
          </div>
        </div>
        <div className="ai-summary empty">
          📦 Ajoutez des produits pour voir l'analyse IA PONIA
        </div>
      </div>
    )
  }

  const criticalProducts = products.filter(p => p.currentQuantity <= (p.alertThreshold || 10) * 0.5)
  const lowStockProducts = products.filter(p => 
    p.currentQuantity > (p.alertThreshold || 10) * 0.5 && 
    p.currentQuantity <= (p.alertThreshold || 10)
  )
  const healthyProducts = products.filter(p => p.currentQuantity > (p.alertThreshold || 10))
  
  const healthScore = Math.round((healthyProducts.length / products.length) * 100)
  
  let status = 'good'
  let message = '🎉 Parfait ! Votre stock est bien géré.'
  
  if (criticalProducts.length > 0) {
    status = 'critical'
    message = `🔴 URGENT : ${criticalProducts.length} produit${criticalProducts.length > 1 ? 's' : ''} en rupture imminente !`
  } else if (lowStockProducts.length > 0) {
    status = 'warning'
    message = `🟠 Attention : ${lowStockProducts.length} produit${lowStockProducts.length > 1 ? 's' : ''} en stock faible.`
  }
  
  const topActions = []
  
  if (criticalProducts.length > 0) {
    topActions.push({
      priority: 1,
      icon: '🔴',
      title: 'Commande urgente',
      description: `${criticalProducts.map(p => p.name).join(', ')} - Commandez AUJOURD'HUI`
    })
  }
  
  if (lowStockProducts.length > 0 && topActions.length < 3) {
    topActions.push({
      priority: 2,
      icon: '🟠',
      title: 'Planifier commande',
      description: `${lowStockProducts.slice(0, 2).map(p => p.name).join(', ')} - Commandez cette semaine`
    })
  }
  
  if (healthyProducts.length === products.length) {
    topActions.push({
      priority: 4,
      icon: '🎉',
      title: 'Parfait !',
      description: 'Votre gestion de stock est optimale. Continuez comme ça !'
    })
  }

  return (
    <div className="ai-insights-panel">
      <div className="ai-header">
        <div className="ai-title">
          <Brain size={24} color="#F59E0B" />
          <h2>🤖 PONIA AI - Analyse Intelligente</h2>
        </div>
        <div className={`health-score ${status}`}>
          <span className="score-value">{healthScore}%</span>
          <span className="score-label">Santé Stock</span>
        </div>
      </div>
      
      <div className={`ai-summary ${status}`}>
        {message}
      </div>
      
      {topActions.length > 0 && (
        <div className="top-actions">
          <h3>
            <AlertTriangle size={18} />
            Actions Prioritaires
          </h3>
          {topActions.slice(0, 3).map((action, index) => (
            <div key={index} className={`action-card priority-${action.priority}`}>
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="ai-stats">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#EF4444' }}>{criticalProducts.length}</div>
          <div className="stat-label">Rupture imminente</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#F59E0B' }}>{lowStockProducts.length}</div>
          <div className="stat-label">Stock faible</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10B981' }}>{healthyProducts.length}</div>
          <div className="stat-label">Stock OK</div>
        </div>
      </div>
      
      {plan === 'basique' && (
        <div className="upgrade-cta">
          <div className="upgrade-content">
            <strong>🚀 Débloquez l'IA Prédictive Avancée</strong>
            <p>Prédictions rupture 3 jours à l'avance + Suggestions commandes optimisées par GPT-4</p>
          </div>
          <button className="upgrade-btn">Passer à Standard €49</button>
        </div>
      )}
    </div>
  )
}
