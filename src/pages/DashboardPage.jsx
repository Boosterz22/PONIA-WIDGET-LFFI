import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, AlertCircle } from 'lucide-react'
import Navigation from '../components/Navigation'
import AIInsights from '../components/AIInsights'
import ChatAI from '../components/ChatAI'
import { checkExpiryAlerts } from '../services/expiryService'

export default function DashboardPage({ session }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const businessName = session.user.business_name || 'Mon Commerce'
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'

  useEffect(() => {
    const savedProducts = localStorage.getItem('ponia_products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const handleGenerateOrder = async () => {
    const { generateOrderPDF } = await import('../services/pdfService')
    await generateOrderPDF(products, businessName, businessType)
  }

  const critical = products.filter(p => p.currentQuantity <= (p.alertThreshold || 10) * 0.5)
  const lowStock = products.filter(p => {
    const threshold = p.alertThreshold || 10
    return p.currentQuantity <= threshold && p.currentQuantity > threshold * 0.5
  })
  const expiryAlerts = checkExpiryAlerts(products)
  const healthyProducts = products.filter(p => p.currentQuantity > (p.alertThreshold || 10))

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Navigation />
      
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '100px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Tableau de bord
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Vue d'ensemble de votre activité
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Package size={20} color="#6B7280" />
              <span style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>Total produits</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{products.length}</div>
          </div>

          <div className="card" style={{
            padding: '1.25rem',
            background: critical.length > 0 ? '#FEE2E2' : 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color={critical.length > 0 ? '#EF4444' : '#6B7280'} />
              <span style={{ fontSize: '0.875rem', color: critical.length > 0 ? '#991B1B' : '#6B7280', fontWeight: '500' }}>
                Rupture imminente
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: critical.length > 0 ? '#EF4444' : '#111827' }}>
              {critical.length}
            </div>
          </div>

          <div className="card" style={{
            padding: '1.25rem',
            background: lowStock.length > 0 ? '#FEF3C7' : 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color={lowStock.length > 0 ? '#F59E0B' : '#6B7280'} />
              <span style={{ fontSize: '0.875rem', color: lowStock.length > 0 ? '#92400E' : '#6B7280', fontWeight: '500' }}>
                Stock faible
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: lowStock.length > 0 ? '#F59E0B' : '#111827' }}>
              {lowStock.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color="#10B981" />
              <span style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>Stock optimal</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981' }}>{healthyProducts.length}</div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: (critical.length > 0 || lowStock.length > 0 || expiryAlerts.length > 0) ? '2fr 1fr' : '1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <AIInsights 
            products={products} 
            businessType={businessType} 
            plan={userPlan}
            onGenerateOrder={handleGenerateOrder}
          />

          {(critical.length > 0 || lowStock.length > 0 || expiryAlerts.length > 0) && (
            <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Alertes actives
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {critical.map(p => (
                  <div key={`stock-${p.id}`} style={{
                    padding: '0.75rem',
                    background: '#FEE2E2',
                    borderRadius: '6px',
                    borderLeft: '3px solid #EF4444'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#991B1B' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Stock critique : {p.currentQuantity} {p.unit}
                    </div>
                  </div>
                ))}
                
                {expiryAlerts.filter(a => a.urgency === 'expired' || a.urgency === 'critical').slice(0, 3).map((alert, idx) => (
                  <div key={`expiry-${idx}`} style={{
                    padding: '0.75rem',
                    background: alert.urgency === 'expired' ? '#FEE2E2' : '#FEF3C7',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${alert.urgency === 'expired' ? '#EF4444' : '#F59E0B'}`
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', color: alert.urgency === 'expired' ? '#991B1B' : '#92400E' }}>
                      {alert.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      {alert.urgency === 'expired' ? 'Expiré' : alert.message}
                    </div>
                  </div>
                ))}
                
                {lowStock.slice(0, 3).map(p => (
                  <div key={`low-${p.id}`} style={{
                    padding: '0.75rem',
                    background: '#FEF3C7',
                    borderRadius: '6px',
                    borderLeft: '3px solid #F59E0B'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#92400E' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Stock faible : {p.currentQuantity} {p.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem'
        }}>
          <Package size={48} style={{ color: '#9CA3AF', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Gérez vos produits
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Accédez à la page Stocks pour gérer vos {products.length} produit{products.length > 1 ? 's' : ''}
          </p>
          <button
            onClick={() => navigate('/stock')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Package size={18} />
            Voir tous mes produits
          </button>
        </div>
      </div>

      <ChatAI products={products} userPlan={userPlan} />
    </div>
  )
}
