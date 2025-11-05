import React, { useState, useEffect } from 'react'
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Loader, Sparkles } from 'lucide-react'
import { aiService } from '../services/aiService'
import { openaiService } from '../services/openaiService'
import '../styles/aiInsights.css'

export default function AIInsights({ products, businessType, plan }) {
  const [insights, setInsights] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [gptLoading, setGptLoading] = useState(false)
  
  useEffect(() => {
    analyzeInventory()
  }, [products])
  
  async function analyzeInventory() {
    setLoading(true)
    
    try {
      const ruleInsights = aiService.analyzeInventory(products, businessType)
      setInsights(ruleInsights)
      setLoading(false)
      
      if ((plan === 'standard' || plan === 'pro') && products.length > 0) {
        setGptLoading(true)
        try {
          const gptSuggestions = await openaiService.generateSmartSuggestions(
            products,
            businessType,
            ruleInsights,
            plan
          )
          setAiSuggestions(gptSuggestions || [])
        } catch (error) {
          console.error('GPT suggestions failed:', error)
        } finally {
          setGptLoading(false)
        }
      }
    } catch (error) {
      console.error('Analyse IA échouée:', error)
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="ai-insights-panel">
        <div className="ai-loading">
          <Loader className="spin" size={32} />
          <p>🤖 Analyse IA en cours...</p>
        </div>
      </div>
    )
  }
  
  if (!insights) return null
  
  const topActions = aiService.getTopActions(insights)
  const stats = aiService.getStats(insights)
  
  return (
    <div className="ai-insights-panel">
      <div className="ai-header">
        <div className="ai-title">
          <Brain size={24} color="#F59E0B" />
          <h2>🤖 PONIA AI - Analyse Intelligente</h2>
        </div>
        <div className={`health-score ${insights.summary.status}`}>
          <span className="score-value">{insights.summary.healthScore}%</span>
          <span className="score-label">Santé Stock</span>
        </div>
      </div>
      
      <div className={`ai-summary ${insights.summary.status}`}>
        {insights.summary.message}
      </div>
      
      {topActions.length > 0 && (
        <div className="top-actions">
          <h3>
            <AlertTriangle size={18} />
            Actions Prioritaires
          </h3>
          {topActions.map((action, idx) => (
            <div key={idx} className={`action-card priority-${action.priority}`}>
              <span className="action-icon">{action.icon}</span>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
                {action.action && action.action.quantity && (
                  <div className="action-details">
                    <span className="detail-badge">
                      Quantité suggérée : {action.action.quantity}{action.action.unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {(plan === 'standard' || plan === 'pro') && (
        <div className="gpt-suggestions">
          <h3>
            <Lightbulb size={18} />
            Conseils IA Personnalisés
            {plan === 'standard' && <span className="plan-badge">1/semaine</span>}
            {plan === 'pro' && <span className="plan-badge pro">Illimité</span>}
          </h3>
          
          {gptLoading ? (
            <div className="gpt-loading">
              <Loader className="spin" size={20} />
              <span>L'IA génère vos conseils personnalisés...</span>
            </div>
          ) : aiSuggestions.length > 0 ? (
            <div className="suggestions-list">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.id} className={`suggestion-card ${suggestion.type}`}>
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <p>{suggestion.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
      
      {plan === 'gratuit' && (
        <div className="upgrade-cta">
          <Sparkles size={20} />
          <div className="upgrade-content">
            <strong>Débloquez les Conseils IA Personnalisés</strong>
            <p>Plan Standard : 1 conseil IA/semaine · Plan Pro : Conseils illimités + prédictions météo</p>
          </div>
          <button className="upgrade-btn" onClick={() => window.location.href = '/#pricing'}>
            Découvrir →
          </button>
        </div>
      )}
      
      <div className="ai-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.stockoutRisks}</span>
          <span className="stat-label">Risques rupture</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.orderSuggestions}</span>
          <span className="stat-label">Commandes suggérées</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.wasteAlerts}</span>
          <span className="stat-label">Alertes gaspillage</span>
        </div>
      </div>
    </div>
  )
}
