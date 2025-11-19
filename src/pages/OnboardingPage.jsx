import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarcodeScanner from '../components/BarcodeScanner'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import poniaLogo from '../assets/ponia-logo.png'

export default function OnboardingPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [showScanner, setShowScanner] = useState(true)
  const [loading, setLoading] = useState(false)
  const [productsAdded, setProductsAdded] = useState(0)

  const handleSkip = () => {
    navigate('/chat')
  }

  const handleScan = async (barcode) => {
    setLoading(true)
    
    try {
      // Fetch product info from Open Food Facts
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      const data = await response.json()

      if (data.status === 1 && data.product) {
        const product = data.product
        
        // Add product to database
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/login')
          return
        }

        const productData = {
          name: product.product_name || `Produit ${barcode}`,
          category: product.categories_tags?.[0]?.replace('en:', '') || 'Autre',
          quantity: 1,
          minStock: 5,
          maxStock: 20,
          unit: 'unité',
          barcode: barcode
        }

        const addResponse = await fetch('/api/products/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(productData)
        })

        if (addResponse.ok) {
          setProductsAdded(prev => prev + 1)
          setShowScanner(false)
          
          // Show success message briefly then show scanner again
          setTimeout(() => {
            setShowScanner(true)
          }, 1500)
        } else {
          // Server rejected the product
          alert(t('onboarding.scanError'))
          setShowScanner(true)
        }
      } else {
        // Product not found in Open Food Facts
        alert(t('onboarding.productNotFound'))
        setShowScanner(true)
      }
    } catch (error) {
      console.error('Erreur scan:', error)
      alert(t('onboarding.scanError'))
      setShowScanner(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {!showScanner && !loading && (
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <img 
            src={poniaLogo} 
            alt="PONIA" 
            style={{ 
              width: '80px', 
              height: '80px',
              marginBottom: '2rem'
            }} 
          />
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            {t('onboarding.welcome')}
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#6B7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            {t('onboarding.description')}
          </p>

          {productsAdded > 0 && (
            <div style={{
              padding: '1rem',
              background: '#D1FAE5',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <p style={{
                color: '#065F46',
                fontWeight: '600',
                margin: 0
              }}>
                {productsAdded} {t('onboarding.productsAdded')}
              </p>
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <button
              onClick={() => setShowScanner(true)}
              style={{
                padding: '1rem 2rem',
                background: '#000000',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1F2937'}
              onMouseLeave={(e) => e.target.style.background = '#000000'}
            >
              {t('onboarding.scanAnother')}
            </button>
            
            <button
              onClick={handleSkip}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                color: '#6B7280',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#9CA3AF'
                e.target.style.color = '#111827'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#E5E7EB'
                e.target.style.color = '#6B7280'
              }}
            >
              {t('onboarding.continueToApp')}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center'
        }}>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <p style={{ color: '#6B7280' }}>{t('onboarding.processing')}</p>
        </div>
      )}

      {showScanner && !loading && (
        <BarcodeScanner onScan={handleScan} onSkip={handleSkip} />
      )}
    </div>
  )
}
