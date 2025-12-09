import React, { useState, useMemo } from 'react'
import { Check, AlertTriangle, Package, Trash2 } from 'lucide-react'

export default function ProductSelectionModal({ products, maxProducts = 10, onConfirm, onCancel }) {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [isConfirming, setIsConfirming] = useState(false)

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aName = a.name || ''
      const bName = b.name || ''
      return aName.localeCompare(bName)
    })
  }, [products])

  const toggleProduct = (productId) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      if (newSelected.size < maxProducts) {
        newSelected.add(productId)
      }
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    const newSelected = new Set()
    sortedProducts.slice(0, maxProducts).forEach(p => newSelected.add(p.id))
    setSelectedIds(newSelected)
  }

  const clearAll = () => {
    setSelectedIds(new Set())
  }

  const handleConfirm = async () => {
    if (selectedIds.size !== maxProducts) return
    
    setIsConfirming(true)
    try {
      await onConfirm(Array.from(selectedIds))
    } finally {
      setIsConfirming(false)
    }
  }

  const remainingToSelect = maxProducts - selectedIds.size
  const productsToDelete = products.length - selectedIds.size

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFDF5',
        borderRadius: '20px',
        padding: '1.5rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img 
            src="/ponia-logo-modal.png" 
            alt="PONIA" 
            style={{
              width: '140px',
              height: 'auto',
              marginBottom: '1rem'
            }}
          />
          
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Sélectionnez vos 10 produits à garder
          </h2>
          
          <p style={{
            fontSize: '0.9rem',
            color: '#6B7280',
            marginBottom: '0.5rem'
          }}>
            Le plan Basique est limité à 10 produits. 
            Les autres produits seront supprimés définitivement.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '0.75rem',
            background: selectedIds.size === maxProducts ? '#D1FAE5' : '#FEF3C7',
            borderRadius: '10px',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: selectedIds.size === maxProducts ? '#065F46' : '#92400E'
            }}>
              {selectedIds.size} / {maxProducts} sélectionnés
            </span>
            {remainingToSelect > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#92400E' }}>
                ({remainingToSelect} restant{remainingToSelect > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <button
            onClick={selectAll}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#4B5563',
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sélectionner les 10 premiers
          </button>
          <button
            onClick={clearAll}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#4B5563',
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Tout désélectionner
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          marginBottom: '1rem'
        }}>
          {sortedProducts.map((product, index) => {
            const isSelected = selectedIds.has(product.id)
            const isDisabled = !isSelected && selectedIds.size >= maxProducts

            return (
              <div
                key={product.id}
                onClick={() => !isDisabled && toggleProduct(product.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: isSelected ? '#FEF3C7' : (isDisabled ? '#F9FAFB' : '#fff'),
                  borderBottom: index < sortedProducts.length - 1 ? '1px solid #E5E7EB' : 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid #F59E0B' : '2px solid #D1D5DB',
                  background: isSelected ? '#F59E0B' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isSelected && <Check size={16} style={{ color: '#fff' }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {product.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6B7280'
                  }}>
                    Stock: {product.currentStock || 0} {product.unit || 'unités'}
                  </div>
                </div>

                {!isSelected && (
                  <Trash2 size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>

        {productsToDelete > 0 && selectedIds.size === maxProducts && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: '#991B1B' }}>
              <strong>{productsToDelete} produit{productsToDelete > 1 ? 's' : ''}</strong> ser{productsToDelete > 1 ? 'ont' : 'a'} supprimé{productsToDelete > 1 ? 's' : ''} définitivement.
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            disabled={isConfirming}
            style={{
              flex: 1,
              padding: '0.875rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#4B5563',
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              cursor: isConfirming ? 'not-allowed' : 'pointer'
            }}
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.size !== maxProducts || isConfirming}
            style={{
              flex: 2,
              padding: '0.875rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: selectedIds.size === maxProducts ? '#000' : '#9CA3AF',
              background: selectedIds.size === maxProducts 
                ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                : '#E5E7EB',
              border: 'none',
              borderRadius: '10px',
              cursor: selectedIds.size !== maxProducts || isConfirming ? 'not-allowed' : 'pointer',
              opacity: isConfirming ? 0.7 : 1
            }}
          >
            {isConfirming ? 'Traitement...' : 'Confirmer et continuer'}
          </button>
        </div>
      </div>
    </div>
  )
}
