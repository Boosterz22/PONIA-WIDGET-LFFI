import React, { useState, useEffect } from 'react'
import { X, AlertTriangle, TrendingUp, Package, ChefHat, DollarSign, Truck, Shield, Leaf, Clock, ChevronRight } from 'lucide-react'

const DOMAIN_ICONS = {
  stock: Package,
  recipes: ChefHat,
  sales: TrendingUp,
  finance: DollarSign,
  suppliers: Truck,
  compliance: Shield,
  sustainability: Leaf,
  operations: Clock
}

const SEVERITY_COLORS = {
  critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
  high: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  medium: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  low: { bg: '#F3F4F6', border: '#6B7280', text: '#374151' }
}

export default function ToastNotification({ suggestion, onClose, onAction, autoClose = 8000 }) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!suggestion) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / autoClose) * 100)
      setProgress(remaining)
      
      if (remaining === 0) {
        handleClose()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [suggestion, autoClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  if (!suggestion) return null

  const severity = SEVERITY_COLORS[suggestion.severity] || SEVERITY_COLORS.medium
  const DomainIcon = DOMAIN_ICONS[suggestion.domain] || Package

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '360px',
          maxWidth: 'calc(100vw - 2rem)',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${severity.border}`,
          overflow: 'hidden',
          zIndex: 10000,
          animation: isExiting ? 'slideOut 0.3s ease-out forwards' : 'slideIn 0.3s ease-out'
        }}
        onMouseEnter={() => setProgress(100)}
      >
        <div style={{
          height: '3px',
          background: '#E5E7EB',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            background: severity.border,
            transition: 'width 0.05s linear'
          }} />
        </div>

        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: severity.bg,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {suggestion.severity === 'critical' ? (
                <AlertTriangle size={18} color={severity.border} />
              ) : (
                <DomainIcon size={18} color={severity.border} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '0.9375rem', 
                  fontWeight: '600',
                  color: '#111827',
                  lineHeight: 1.3
                }}>
                  {suggestion.title}
                </h4>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    flexShrink: 0
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ 
                margin: '0.375rem 0 0', 
                fontSize: '0.8125rem', 
                color: '#4B5563',
                lineHeight: 1.4
              }}>
                {suggestion.message}
              </p>

              {suggestion.impactValue && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  padding: '0.25rem 0.5rem',
                  background: '#ECFDF5',
                  color: '#059669',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Impact: {suggestion.impactValue}€
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                {suggestion.actionType && (
                  <button
                    onClick={() => onAction?.(suggestion)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {suggestion.actionLabel || 'Voir'}
                    <ChevronRight size={14} />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Ignorer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
