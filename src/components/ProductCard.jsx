import React, { useState } from 'react'
import { Minus, Plus, Trash2, AlertTriangle, CheckCircle, Mic, Lock } from 'lucide-react'
import VoiceInput from './VoiceInput'
import { canUseVoiceCommand, getVoiceCommandsUsed, getUserQuotas } from '../services/quotaService'

export default function ProductCard({ product, onUpdateQuantity, onDelete, userPlan = 'basique' }) {
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const stockStatus = product.currentQuantity <= product.alertThreshold * 0.5 
    ? 'critical' 
    : product.currentQuantity <= product.alertThreshold 
    ? 'low' 
    : 'good'

  const statusColors = {
    critical: { border: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' },
    low: { border: 'var(--warning)', bg: 'rgba(251, 146, 60, 0.1)', color: 'var(--warning)' },
    good: { border: 'var(--success)', bg: 'rgba(74, 222, 128, 0.05)', color: 'var(--success)' }
  }

  const status = statusColors[stockStatus]

  return (
    <div className="card" style={{ borderColor: status.border, borderWidth: '2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{product.supplier}</p>
        </div>
        <button 
          onClick={() => onDelete(product.id)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ 
        background: status.bg, 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '1rem',
        border: `1px solid ${status.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {stockStatus === 'good' ? (
            <CheckCircle size={20} color={status.color} />
          ) : (
            <AlertTriangle size={20} color={status.color} />
          )}
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: status.color }}>
            {product.currentQuantity}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{product.unit}</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Seuil d'alerte : {product.alertThreshold} {product.unit}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button 
          onClick={() => onUpdateQuantity(product.id, -10)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
        >
          -10
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, -1)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem' }}
        >
          <Minus size={18} />
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem' }}
        >
          <Plus size={18} />
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, 10)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
        >
          +10
        </button>
      </div>

      <button 
        onClick={() => {
          if (canUseVoiceCommand(userPlan)) {
            setShowVoiceInput(true)
          } else {
            setShowQuotaModal(true)
          }
        }}
        className="btn btn-primary"
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.5rem' 
        }}
      >
        <Mic size={18} />
        <span>Commande vocale</span>
        {userPlan === 'basique' && (
          <span style={{ 
            fontSize: '0.75rem', 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.125rem 0.375rem', 
            borderRadius: '4px' 
          }}>
            {getVoiceCommandsUsed()}/{getUserQuotas(userPlan).voiceCommands}
          </span>
        )}
      </button>

      {showVoiceInput && (
        <VoiceInput
          productName={product.name}
          userPlan={userPlan}
          onConfirm={(delta) => {
            onUpdateQuantity(product.id, delta)
            setShowVoiceInput(false)
          }}
          onCancel={() => setShowVoiceInput(false)}
        />
      )}

      {showQuotaModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }} onClick={() => setShowQuotaModal(false)}>
          <div className="card" style={{ 
            maxWidth: '400px', 
            width: '100%',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <Lock size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Limite quotidienne atteinte
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Vous avez utilisé vos <strong>5 commandes vocales</strong> du plan Basique aujourd'hui.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Passez à <strong>Standard (€49/mois)</strong> pour des commandes vocales illimitées + historique 30j + prédictions + bien plus.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowQuotaModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Fermer
              </button>
              <button 
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  window.location.href = '/#tarifs'
                }}
              >
                Voir les plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
