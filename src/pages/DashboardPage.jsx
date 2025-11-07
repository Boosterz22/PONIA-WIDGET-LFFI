import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, LogOut, AlertCircle, Package, Crown, Gift } from 'lucide-react'
import { supabase } from '../services/supabase'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import AIInsights from '../components/AIInsights'
import UpgradeModal from '../components/UpgradeModal'
import ReferralModal from '../components/ReferralModal'
import { getTemplatesForBusinessType } from '../data/productTemplates'
import { checkExpiryAlerts, calculateWasteStats } from '../services/expiryService'
import { incrementDailyActions, canPerformAction, getQuotaStatus } from '../services/quotaService'

const getTemplateProducts = (businessType) => {
  const templates = getTemplatesForBusinessType(businessType)
  
  return templates.map(template => ({
    name: template.name,
    currentQuantity: template.quantity,
    unit: template.unit,
    alertThreshold: template.threshold,
    supplier: template.supplier
  }))
}

export default function DashboardPage({ session }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showActionLimitModal, setShowActionLimitModal] = useState(false)
  const businessName = session.user.business_name || 'Mon Commerce'
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'
  const referralCode = localStorage.getItem('ponia_referral_code') || 'CODE-00'
  const [quotaStatus, setQuotaStatus] = useState(getQuotaStatus(userPlan))

  useEffect(() => {
    const savedProducts = localStorage.getItem('ponia_products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const templateProducts = getTemplateProducts(businessType)
      setProducts(templateProducts.map((p, i) => ({ id: i + 1, ...p })))
    }
  }, [businessType])

  useEffect(() => {
    localStorage.setItem('ponia_products', JSON.stringify(products))
  }, [products])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleAddProduct = (newProduct) => {
    if (userPlan === 'basique' && products.length >= 10) {
      setShowAddModal(false)
      setShowUpgradeModal(true)
      return
    }
    
    if (!canPerformAction(userPlan)) {
      setShowAddModal(false)
      setShowActionLimitModal(true)
      return
    }
    
    const product = {
      id: products.length + 1,
      ...newProduct,
      currentQuantity: parseFloat(newProduct.currentQuantity),
      alertThreshold: parseFloat(newProduct.alertThreshold)
    }
    setProducts([...products, product])
    incrementDailyActions()
    setQuotaStatus(getQuotaStatus(userPlan))
    setShowAddModal(false)
  }

  const handleAddProductClick = () => {
    if (userPlan === 'basique' && products.length >= 10) {
      setShowUpgradeModal(true)
    } else {
      setShowAddModal(true)
    }
  }

  const handleUpdateQuantity = (id, change) => {
    if (!canPerformAction(userPlan)) {
      setShowActionLimitModal(true)
      return
    }
    
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, currentQuantity: Math.max(0, p.currentQuantity + change) }
        : p
    ))
    incrementDailyActions()
    setQuotaStatus(getQuotaStatus(userPlan))
  }

  const handleDeleteProduct = (id) => {
    if (!canPerformAction(userPlan)) {
      setShowActionLimitModal(true)
      return
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id))
      incrementDailyActions()
      setQuotaStatus(getQuotaStatus(userPlan))
    }
  }

  const handleChangePlan = (newPlan) => {
    localStorage.setItem('ponia_user_plan', newPlan)
    window.location.reload()
  }

  const alerts = products.filter(p => p.currentQuantity <= p.alertThreshold)
  const lowStock = products.filter(p => p.currentQuantity <= p.alertThreshold && p.currentQuantity > p.alertThreshold * 0.5)
  const critical = products.filter(p => p.currentQuantity <= p.alertThreshold * 0.5)
  
  const expiryAlerts = checkExpiryAlerts(products)
  const wasteStats = calculateWasteStats(products)
  const healthyProducts = products.filter(p => p.currentQuantity > p.alertThreshold)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <nav style={{
        borderBottom: '1px solid #E5E7EB',
        padding: '1rem 0',
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/ponia-icon.png" alt="PONIA AI" style={{ height: '36px', cursor: 'pointer' }} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{businessName}</span>
                {userPlan === 'basique' && (
                  <span style={{
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Basique
                  </span>
                )}
                {userPlan === 'standard' && (
                  <span style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1F2937',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Standard
                  </span>
                )}
                {userPlan === 'pro' && (
                  <span style={{
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Crown size={12} />
                    Pro
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>PONIA AI</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(255, 215, 0, 0.1)', 
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                🧪 MODE TEST
              </div>
              <select 
                value={userPlan} 
                onChange={(e) => handleChangePlan(e.target.value)}
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.85rem',
                  color: '#111827',
                  cursor: 'pointer'
                }}
              >
                <option value="basique">Plan Basique (€0)</option>
                <option value="standard">Plan Standard (€49)</option>
                <option value="pro">Plan Pro (€69)</option>
              </select>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {userPlan === 'basique' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
            border: '1px solid #4ade80',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Plan Basique : <strong style={{ color: '#22c55e' }}>{products.length}/10 produits</strong>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>•</span>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Code parrainage : <strong style={{ color: '#FFD700', fontFamily: 'monospace' }}>{referralCode}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowReferralModal(true)}
                className="btn btn-secondary" 
                style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Gift size={16} />
                Inviter
              </button>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="btn btn-primary" 
                style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Crown size={16} />
                Passer à Standard
              </button>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Package size={20} color="#6B7280" />
              <span style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>Total produits</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{products.length}</div>
          </div>

          <div style={{
            background: critical.length > 0 ? '#FEE2E2' : 'white',
            padding: '1.25rem',
            borderRadius: '10px',
            border: critical.length > 0 ? '1px solid #EF4444' : '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color={critical.length > 0 ? '#EF4444' : '#6B7280'} />
              <span style={{ fontSize: '0.875rem', color: critical.length > 0 ? '#991B1B' : '#6B7280', fontWeight: '500' }}>Rupture imminente</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: critical.length > 0 ? '#EF4444' : '#111827' }}>{critical.length}</div>
          </div>

          <div style={{
            background: lowStock.length > 0 ? '#FEF3C7' : 'white',
            padding: '1.25rem',
            borderRadius: '10px',
            border: lowStock.length > 0 ? '1px solid #F59E0B' : '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color={lowStock.length > 0 ? '#F59E0B' : '#6B7280'} />
              <span style={{ fontSize: '0.875rem', color: lowStock.length > 0 ? '#92400E' : '#6B7280', fontWeight: '500' }}>Stock faible</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: lowStock.length > 0 ? '#F59E0B' : '#111827' }}>{lowStock.length}</div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color="#10B981" />
              <span style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>Stock optimal</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981' }}>{healthyProducts.length}</div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: critical.length > 0 || lowStock.length > 0 || expiryAlerts.length > 0 ? '2fr 1fr' : '1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <AIInsights products={products} businessType={businessType} plan={userPlan} />

          {(critical.length > 0 || lowStock.length > 0 || expiryAlerts.length > 0) && (
            <div style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1.5rem',
              height: 'fit-content'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', fontWeight: '600' }}>Mes Produits</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              {products.length} produit{products.length > 1 ? 's' : ''} en stock
            </p>
          </div>
          <button onClick={handleAddProductClick} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            <span>Ajouter un produit</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              userPlan={userPlan}
              onUpdateQuantity={handleUpdateQuantity}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6B7280' }}>
            <img src="/ponia-icon.png" alt="PONIA" style={{ height: '64px', opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.125rem' }}>Aucun produit en stock</p>
            <p style={{ marginTop: '0.5rem' }}>Commencez par ajouter vos premiers produits</p>
            <button onClick={handleAddProductClick} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Ajouter un produit
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}

      {showReferralModal && (
        <ReferralModal 
          referralCode={referralCode}
          onClose={() => setShowReferralModal(false)} 
        />
      )}

      {showActionLimitModal && (
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
        }} onClick={() => setShowActionLimitModal(false)}>
          <div className="card" style={{ 
            maxWidth: '500px', 
            width: '100%',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={64} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Limite quotidienne atteinte
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
              Vous avez utilisé vos <strong>20 actions</strong> du plan Basique aujourd'hui.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
              Actions : ajouts, modifications ou suppressions de produits.
            </p>
            
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#FFD700' }}>
                Passez à Standard (€49/mois)
              </h4>
              <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: '300px', lineHeight: 1.8 }}>
                <li>✅ Actions illimitées</li>
                <li>✅ Commandes vocales illimitées</li>
                <li>✅ Historique 30 jours</li>
                <li>✅ Prédictions 7 jours</li>
                <li>✅ Export PDF sans watermark</li>
                <li>✅ Notifications automatiques</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowActionLimitModal(false)}
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
