import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, LogOut, AlertCircle, TrendingDown, TrendingUp, Brain } from 'lucide-react'
import { supabase } from '../services/supabase'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import AIInsights from '../components/AIInsights'

const getTemplateProducts = (businessType) => {
  const templates = {
    boulangerie: [
      { name: 'Farine T55', currentQuantity: 25, unit: 'kg', alertThreshold: 15, supplier: 'Moulins Bio' },
      { name: 'Beurre', currentQuantity: 8, unit: 'kg', alertThreshold: 10, supplier: 'Laiterie Martin' },
      { name: 'Œufs', currentQuantity: 120, unit: 'pièces', alertThreshold: 60, supplier: 'Ferme Dubois' },
      { name: 'Levure', currentQuantity: 2, unit: 'kg', alertThreshold: 3, supplier: 'Moulins Bio' },
      { name: 'Chocolat', currentQuantity: 5, unit: 'kg', alertThreshold: 8, supplier: 'Valrhona' },
    ],
    restaurant: [
      { name: 'Tomates', currentQuantity: 15, unit: 'kg', alertThreshold: 10, supplier: 'Marché Gare' },
      { name: 'Huile d\'olive', currentQuantity: 3, unit: 'L', alertThreshold: 5, supplier: 'Saveurs du Sud' },
      { name: 'Viande de bœuf', currentQuantity: 8, unit: 'kg', alertThreshold: 10, supplier: 'Boucherie Dupont' },
      { name: 'Pâtes', currentQuantity: 12, unit: 'kg', alertThreshold: 8, supplier: 'Metro' },
      { name: 'Parmesan', currentQuantity: 2, unit: 'kg', alertThreshold: 3, supplier: 'Fromagerie Pascal' },
    ],
    cave: [
      { name: 'Bordeaux Rouge 2020', currentQuantity: 24, unit: 'bouteilles', alertThreshold: 12, supplier: 'Château Margaux' },
      { name: 'Champagne Brut', currentQuantity: 8, unit: 'bouteilles', alertThreshold: 15, supplier: 'Moët & Chandon' },
      { name: 'Bourgogne Blanc', currentQuantity: 18, unit: 'bouteilles', alertThreshold: 10, supplier: 'Domaine Leflaive' },
      { name: 'Rosé de Provence', currentQuantity: 30, unit: 'bouteilles', alertThreshold: 20, supplier: 'Minuty' },
    ],
    default: [
      { name: 'Produit 1', currentQuantity: 50, unit: 'pièces', alertThreshold: 20, supplier: 'Fournisseur A' },
      { name: 'Produit 2', currentQuantity: 15, unit: 'kg', alertThreshold: 10, supplier: 'Fournisseur B' },
      { name: 'Produit 3', currentQuantity: 100, unit: 'pièces', alertThreshold: 40, supplier: 'Fournisseur C' },
    ]
  }

  return templates[businessType] || templates.default
}

export default function DashboardPage({ session }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const businessName = session.user.business_name || 'Mon Commerce'
  const businessType = localStorage.getItem('ponia_business_type') || 'default'

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
    const product = {
      id: products.length + 1,
      ...newProduct,
      currentQuantity: parseFloat(newProduct.currentQuantity),
      alertThreshold: parseFloat(newProduct.alertThreshold)
    }
    setProducts([...products, product])
    setShowAddModal(false)
  }

  const handleUpdateQuantity = (id, change) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, currentQuantity: Math.max(0, p.currentQuantity + change) }
        : p
    ))
  }

  const handleDeleteProduct = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const alerts = products.filter(p => p.currentQuantity <= p.alertThreshold)
  const lowStock = products.filter(p => p.currentQuantity <= p.alertThreshold && p.currentQuantity > p.alertThreshold * 0.5)
  const critical = products.filter(p => p.currentQuantity <= p.alertThreshold * 0.5)

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
            <Package size={28} color="#FFD700" />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{businessName}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PONIA AI</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1rem' }}>
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

        <AIInsights products={products} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Mes Produits</h2>
            <p style={{ color: 'var(--text-muted)' }}>{products.length} produit{products.length > 1 ? 's' : ''} en stock</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            <span>Ajouter un produit</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdateQuantity={handleUpdateQuantity}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <Package size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.125rem' }}>Aucun produit en stock</p>
            <p style={{ marginTop: '0.5rem' }}>Commencez par ajouter vos premiers produits</p>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
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
    </div>
  )
}
