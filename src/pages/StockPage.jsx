import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import ChatAI from '../components/ChatAI'

export default function StockPage({ session }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Erreur chargement produits:', response.statusText)
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (newProduct) => {
    if (userPlan === 'basique' && products.length >= 10) {
      alert('Limite atteinte : le plan Basique permet max 10 produits. Passez à Standard ou Pro.')
      setShowAddModal(false)
      return
    }
    
    if (userPlan === 'standard' && products.length >= 50) {
      alert('Limite atteinte : le plan Standard permet max 50 produits. Passez à Pro pour illimité.')
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
          expiryDate: newProduct.expiryDate || null
        })
      })

      if (response.ok) {
        await loadProducts()
        setShowAddModal(false)
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

    const newQuantity = Math.max(0, parseFloat(product.currentQuantity) + change)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          currentQuantity: newQuantity,
          previousQuantity: parseFloat(product.currentQuantity),
          notes: `Ajustement manuel: ${change > 0 ? '+' : ''}${change}`
        })
      })

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === id ? { ...p, currentQuantity: newQuantity.toString() } : p
        ))
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur update quantité:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression produit:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
        <Navigation />
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>Chargement de vos produits...</p>
        </div>
      </div>
    )
  }

  const critical = products.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty <= threshold * 0.5
  })

  const lowStock = products.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty <= threshold && qty > threshold * 0.5
  })

  const healthyProducts = products.filter(p => {
    const threshold = parseFloat(p.alertThreshold) || 10
    const qty = parseFloat(p.currentQuantity) || 0
    return qty > threshold
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '8rem' }}>
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
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
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
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
    </div>
  )
}
