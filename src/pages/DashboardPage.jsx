import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, LogOut, AlertCircle, TrendingDown, TrendingUp, Brain, Gift, Crown } from 'lucide-react'
import { supabase } from '../services/supabase'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import AIInsights from '../components/AIInsights'
import UpgradeModal from '../components/UpgradeModal'
import ReferralModal from '../components/ReferralModal'
import ExpiryAlerts from '../components/ExpiryAlerts'
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
  
  // Alertes de péremption
  const expiryAlerts = checkExpiryAlerts(products)
  const wasteStats = calculateWasteStats(products)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        background: 'var(--bg-light)',
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
                    color: 'var(--bg)',
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
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PONIA AI</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(255, 215, 0, 0.1)', 
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                🧪 MODE TEST
              </div>
              <select 
                value={userPlan} 
                onChange={(e) => handleChangePlan(e.target.value)}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                <option value="basique">Plan Basique (€0)</option>
                <option value="standard">Plan Standard (€49)</option>
                <option value="pro">Plan Pro (€69.99)</option>
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
          <div className="card" style={{ 
            marginBottom: '2rem', 
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)', 
            borderColor: 'var(--success)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎁 Plan Basique
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Vous utilisez <strong style={{ color: 'var(--success)' }}>{products.length}/10 produits</strong> du plan Basique
                </p>
                {products.length >= 8 && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    ⚠️ Plus que {10 - products.length} produit{10 - products.length > 1 ? 's' : ''} avant d'atteindre la limite
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setShowReferralModal(true)}
                  className="btn btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Gift size={18} />
                  <span>Inviter un ami</span>
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Crown size={18} />
                  <span>Passer à Standard</span>
                </button>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              flexWrap: 'wrap',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '10px'
            }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Votre code parrainage
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: 'var(--primary)',
                  fontFamily: 'monospace'
                }}>
                  {referralCode}
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Récompense parrainage
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  1 mois gratuit par filleul
                </div>
              </div>
            </div>
          </div>
        )}

        {expiryAlerts && expiryAlerts.length > 0 && (
          <ExpiryAlerts expiryAlerts={expiryAlerts} />
        )}

        {alerts.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)', borderColor: 'var(--danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <AlertCircle size={32} color="#ef4444" />
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Alertes Stock</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {critical.length} produit{critical.length > 1 ? 's' : ''} en stock critique, {lowStock.length} en stock faible
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {alerts.map(p => (
                <div key={p.id} style={{ 
                  padding: '0.75rem', 
                  background: p.currentQuantity <= p.alertThreshold * 0.5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 146, 60, 0.1)', 
                  borderRadius: '8px',
                  border: `1px solid ${p.currentQuantity <= p.alertThreshold * 0.5 ? 'var(--danger)' : 'var(--warning)'}`
                }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {p.currentQuantity} {p.unit} restant{p.currentQuantity > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertes de péremption (DLC/DLUO) - TEMPORAIREMENT DÉSACTIVÉ POUR DEBUG */}
        {/* <ExpiryAlerts expiryAlerts={expiryAlerts} /> */}

        {/* Statistiques de gaspillage - TEMPORAIREMENT DÉSACTIVÉ */}
        {/* {expiryAlerts.length > 0 && (...)} */}

        {/* TEMPORAIRE: AIInsights désactivé pour debug */}
        {/* <AIInsights products={products} businessType={businessType} plan={userPlan} /> */}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Mes Produits</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {products.length} produit{products.length > 1 ? 's' : ''} en stock
              {userPlan === 'basique' && (
                <span style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}>
                  (max 10 en plan Basique)
                </span>
              )}
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
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
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
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
              Vous avez utilisé vos <strong>20 actions</strong> du plan Basique aujourd'hui.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Actions : ajouts, modifications ou suppressions de produits.
            </p>
            
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ✨ Passez à Standard (€49/mois)
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
