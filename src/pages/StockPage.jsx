import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, Search, X } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'
import TrialBanner from '../components/TrialBanner'
import TrialExpiredBlocker from '../components/TrialExpiredBlocker'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import CompositeProductEditor from '../components/CompositeProductEditor'
import ChatAI from '../components/ChatAI'
import { useTrialCheck } from '../hooks/useTrialCheck'
import { useData } from '../contexts/DataContext'

export default function StockPage({ session }) {
  const navigate = useNavigate()
  const { products, fetchProducts, updateProduct, addProduct: addProductToCache, removeProduct } = useData()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingComposition, setEditingComposition] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'
  const { trialExpired } = useTrialCheck()

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (newProduct) => {
    if (userPlan === 'basique' && products.length >= 10) {
      alert('Limite atteinte : le plan Basique permet max 10 produits. Passez à Standard ou Pro.')
      setShowAddModal(false)
      return
    }
    
    if (userPlan === 'standard' && products.length >= 100) {
      alert('Limite atteinte : le plan Standard permet max 100 produits. Passez à Pro pour illimité.')
      setShowAddModal(false)
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          currentQuantity: parseFloat(newProduct.currentQuantity),
          unit: newProduct.unit,
          alertThreshold: parseFloat(newProduct.alertThreshold),
          supplier: newProduct.supplier || null,
          expiryDate: newProduct.expiryDate || null,
          purchasePrice: newProduct.purchasePrice ? parseFloat(newProduct.purchasePrice) : null,
          salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : null,
          isComposite: newProduct.isComposite || false
        })
      })

      if (response.ok) {
        const { product } = await response.json()
        
        setShowAddModal(false)
        
        addProductToCache(product)
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.message || 'Impossible d\'ajouter le produit'}`)
      }
    } catch (error) {
      console.error('Erreur ajout produit:', error)
      alert('Erreur lors de l\'ajout du produit')
    }
  }

  const handleUpdateQuantity = async (id, change) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    const previousQuantity = parseFloat(product.currentQuantity)
    const newQuantity = Math.max(0, previousQuantity + change)

    updateProduct(id, { currentQuantity: newQuantity.toString() })

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await fetchProducts(true)
        return
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          currentQuantity: newQuantity,
          previousQuantity: previousQuantity,
          notes: `Ajustement manuel: ${change > 0 ? '+' : ''}${change}`
        })
      })

      if (!response.ok) {
        await fetchProducts(true)
        console.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      await fetchProducts(true)
      console.error('Erreur update quantité:', error)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    const deletedProduct = products.find(p => p.id === id)
    if (!deletedProduct) return

    removeProduct(id)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await fetchProducts(true)
        return
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        await fetchProducts(true)
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      await fetchProducts(true)
      console.error('Erreur suppression produit:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Filtrage par recherche
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      p.name?.toLowerCase().includes(query) ||
      p.supplier?.toLowerCase().includes(query) ||
      p.unit?.toLowerCase().includes(query)
    )
  })

  const critical = filteredProducts.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty <= threshold * 0.5
  })

  const lowStock = filteredProducts.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty <= threshold && qty > threshold * 0.5
  })

  const healthyProducts = filteredProducts.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty > threshold
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '8rem' }}>
      {trialExpired && <TrialExpiredBlocker />}
      <TrialBanner />
      <Navigation />
      
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Package size={32} style={{ color: '#000000' }} />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Mes Stocks</h1>
          </div>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
            Gérez vos {products.length} produit{products.length > 1 ? 's' : ''} en temps réel
          </p>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .stock-summary-grid { grid-template-columns: repeat(4, 1fr) !important; }
            .stock-products-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; }
          }
          @media (max-width: 767px) {
            .stock-summary-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .stock-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
        <div className="stock-summary-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Total</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{products.length}</div>
          </div>

          <div className="card" style={{ 
            padding: '1.25rem', 
            textAlign: 'center',
            background: critical.length > 0 ? '#FEE2E2' : 'white'
          }}>
            <div style={{ fontSize: '0.875rem', color: critical.length > 0 ? '#991B1B' : '#6B7280', marginBottom: '0.5rem' }}>
              🔴 Critique
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: critical.length > 0 ? '#EF4444' : '#111827' }}>
              {critical.length}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.25rem', 
            textAlign: 'center',
            background: lowStock.length > 0 ? '#FEF3C7' : 'white'
          }}>
            <div style={{ fontSize: '0.875rem', color: lowStock.length > 0 ? '#92400E' : '#6B7280', marginBottom: '0.5rem' }}>
              🟠 Faible
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: lowStock.length > 0 ? '#F59E0B' : '#111827' }}>
              {lowStock.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>✅ Optimal</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981' }}>{healthyProducts.length}</div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            position: 'relative', 
            flex: '1 1 300px',
            minWidth: '250px'
          }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="text"
              placeholder="Rechercher un produit, fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD700'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>

        {products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Package size={64} style={{ color: '#D1D5DB', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Aucun produit en stock
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Commencez par ajouter vos premiers produits
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={20} />
              Ajouter mon premier produit
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Search size={48} style={{ color: '#D1D5DB', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Aucun produit trouvé
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
              Aucun produit ne correspond à "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn"
              style={{ background: '#F3F4F6', color: '#374151', border: 'none' }}
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="stock-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  currentQuantity: parseFloat(product.currentQuantity),
                  alertThreshold: parseFloat(product.alertThreshold)
                }}
                userPlan={userPlan}
                onUpdateQuantity={handleUpdateQuantity}
                onDelete={handleDeleteProduct}
                onEditComposition={product.isComposite ? setEditingComposition : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}

      <ChatAI products={products.map(p => ({
        ...p,
        currentQuantity: parseFloat(p.currentQuantity),
        alertThreshold: parseFloat(p.alertThreshold)
      }))} />

      {editingComposition && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '1.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                Recette: {editingComposition.name}
              </h2>
              <button
                onClick={() => setEditingComposition(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} />
              </button>
            </div>
            <CompositeProductEditor
              productId={editingComposition.id}
              products={products}
              onUpdate={() => {
                fetchProducts(true)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
