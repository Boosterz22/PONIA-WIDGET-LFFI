import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Gift, Check, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { supabase } from '../services/supabase'
import ProductSelectionModal from './ProductSelectionModal'

export default function TrialExpiredBlocker({ onPlanSelected }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { products, userData, fetchUserData, fetchProducts } = useData()
  const [showProductSelection, setShowProductSelection] = useState(false)
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [error, setError] = useState(null)

  const productCount = products?.length || 0
  const needsProductReduction = productCount > 10

  const handleUpgrade = () => {
    navigate('/upgrade')
  }

  const handleDowngradeToBasique = async () => {
    if (needsProductReduction) {
      setShowProductSelection(true)
      return
    }

    await executeDowngrade()
  }

  const executeDowngrade = async (selectedProductIds = null) => {
    setIsDowngrading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Session expirée')
      }

      const response = await fetch('/api/users/downgrade-to-basique', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productsToKeep: selectedProductIds || []
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors du downgrade')
      }

      await fetchUserData(true)
      await fetchProducts(true)
      
      localStorage.setItem('ponia_user_plan', 'basique')
      localStorage.removeItem('ponia_cache_trial')
      
      if (onPlanSelected) {
        onPlanSelected('basique')
      }

      window.location.reload()

    } catch (err) {
      console.error('Downgrade error:', err)
      setError(err.message)
    } finally {
      setIsDowngrading(false)
    }
  }

  const handleProductsSelected = async (selectedIds) => {
    setShowProductSelection(false)
    await executeDowngrade(selectedIds)
  }

  if (showProductSelection) {
    return (
      <ProductSelectionModal
        products={products}
        maxProducts={10}
        onConfirm={handleProductsSelected}
        onCancel={() => setShowProductSelection(false)}
      />
    )
  }

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
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFDF5',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700',
        margin: 'auto 0'
      }}>
        <img 
          src="/ponia-logo-modal.png" 
          alt="PONIA" 
          style={{
            width: '160px',
            height: 'auto',
            marginBottom: '1rem'
          }}
        />

        <div style={{
          background: 'linear-gradient(135deg, #FEE2E2, #FEF2F2)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={24} style={{ color: '#DC2626' }} />
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#DC2626'
          }}>
            Votre essai gratuit de 14 jours est terminé
          </span>
        </div>

        <p style={{
          fontSize: '1rem',
          color: '#4B5563',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          Pour continuer à utiliser PONIA, veuillez choisir une option ci-dessous.
          <strong> Cette fenêtre ne peut pas être fermée</strong> tant que vous n'avez pas fait un choix.
        </p>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#92400E', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Crown size={20} style={{ color: '#FFD700' }} />
            Passez à Standard ou Pro
          </div>
          
          <div style={{
            display: 'grid',
            gap: '0.5rem',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: '#10B981' }} />
              <span><strong>Standard (49€/mois)</strong> : 50 produits, IA illimitée, POS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: '#10B981' }} />
              <span><strong>Pro (69€/mois)</strong> : Produits illimités, commandes vocales</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#000',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)'
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            <Crown size={22} />
            Passer à un plan payant
          </button>
        </div>

        <div style={{
          background: '#F3F4F6',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#6B7280', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Gift size={18} />
            Ou continuer en Basique (Gratuit)
          </div>
          
          <div style={{
            fontSize: '0.85rem',
            color: '#9CA3AF',
            marginBottom: '1rem',
            lineHeight: '1.5'
          }}>
            <div>• Maximum 10 produits</div>
            <div>• 5 messages IA par jour</div>
            <div>• Pas d'intégrations POS</div>
            <div>• Alertes de base uniquement</div>
          </div>

          {needsProductReduction && (
            <div style={{
              background: '#FEF3C7',
              color: '#92400E',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              Vous avez {productCount} produits. Vous devrez en sélectionner 10 à garder.
            </div>
          )}

          <button
            onClick={handleDowngradeToBasique}
            disabled={isDowngrading}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#374151',
              background: '#fff',
              border: '2px solid #D1D5DB',
              borderRadius: '10px',
              cursor: isDowngrading ? 'not-allowed' : 'pointer',
              opacity: isDowngrading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isDowngrading) {
                e.target.style.background = '#F9FAFB'
                e.target.style.borderColor = '#9CA3AF'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff'
              e.target.style.borderColor = '#D1D5DB'
            }}
          >
            {isDowngrading ? 'Traitement en cours...' : 'Continuer en Basique (Gratuit)'}
          </button>
        </div>

        <p style={{
          fontSize: '0.75rem',
          color: '#9CA3AF',
          marginTop: '1.5rem',
          lineHeight: '1.4'
        }}>
          En choisissant une option, vous acceptez nos conditions d'utilisation.
          Vous pouvez changer de plan à tout moment depuis les paramètres.
        </p>
      </div>
    </div>
  )
}
