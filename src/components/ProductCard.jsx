import React from 'react'
import { Minus, Plus, Trash2, AlertTriangle, CheckCircle, ChefHat, TrendingUp } from 'lucide-react'

export default function ProductCard({ product, onUpdateQuantity, onDelete, onEditComposition, userPlan = 'basique' }) {
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
    <div className="card" style={{ borderColor: status.border, borderWidth: '2px', padding: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.supplier}</p>
        </div>
        <button 
          onClick={() => onDelete(product.id)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'color 0.2s',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div style={{ 
        background: status.bg, 
        padding: '0.6rem', 
        borderRadius: '6px', 
        marginBottom: '0.5rem',
        border: `1px solid ${status.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
          {stockStatus === 'good' ? (
            <CheckCircle size={16} color={status.color} />
          ) : (
            <AlertTriangle size={16} color={status.color} />
          )}
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: status.color }}>
            {product.currentQuantity}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.unit}</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Seuil : {product.alertThreshold} {product.unit}
        </p>
      </div>

      {product.isComposite && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#F0FDF4',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          border: '1px solid #BBF7D0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChefHat size={14} color="#16A34A" />
            <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: '500' }}>
              Recette
            </span>
          </div>
          {product.productionCost != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Coût: </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#15803D' }}>
                  {parseFloat(product.productionCost).toFixed(2)}€
                </span>
              </div>
              {product.salePrice && parseFloat(product.salePrice) > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <TrendingUp size={12} color="#16A34A" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#16A34A' }}>
                    +{(parseFloat(product.salePrice) - parseFloat(product.productionCost)).toFixed(2)}€
                  </span>
                </div>
              )}
            </div>
          )}
          {onEditComposition && (
            <button
              onClick={() => onEditComposition(product)}
              style={{
                background: '#16A34A',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Modifier
            </button>
          )}
        </div>
      )}

      {(product.purchasePrice || product.salePrice) && !product.isComposite && (
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem',
          padding: '0.4rem 0.5rem',
          background: '#F9FAFB',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          fontSize: '0.75rem'
        }}>
          {product.purchasePrice && (
            <div>
              <span style={{ color: '#6B7280' }}>Achat: </span>
              <span style={{ fontWeight: '500' }}>{parseFloat(product.purchasePrice).toFixed(2)}€</span>
            </div>
          )}
          {product.salePrice && (
            <div>
              <span style={{ color: '#6B7280' }}>Vente: </span>
              <span style={{ fontWeight: '500' }}>{parseFloat(product.salePrice).toFixed(2)}€</span>
            </div>
          )}
          {product.purchasePrice && product.salePrice && (
            <div style={{ marginLeft: 'auto', color: '#16A34A', fontWeight: '500' }}>
              +{(parseFloat(product.salePrice) - parseFloat(product.purchasePrice)).toFixed(2)}€
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.25rem' }}>
        <button 
          onClick={() => onUpdateQuantity(product.id, -10)}
          className="btn btn-secondary"
          style={{ padding: '0.4rem', fontSize: '0.75rem' }}
        >
          -10
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, -1)}
          className="btn btn-secondary"
          style={{ padding: '0.4rem' }}
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="btn btn-secondary"
          style={{ padding: '0.4rem' }}
        >
          <Plus size={14} />
        </button>
        <button 
          onClick={() => onUpdateQuantity(product.id, 10)}
          className="btn btn-secondary"
          style={{ padding: '0.4rem', fontSize: '0.75rem' }}
        >
          +10
        </button>
      </div>
    </div>
  )
}
