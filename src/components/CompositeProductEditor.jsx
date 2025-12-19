import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Package, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function CompositeProductEditor({ productId, products, onUpdate }) {
  const [compositions, setCompositions] = useState([])
  const [cost, setCost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIngredient, setNewIngredient] = useState({ ingredientId: '', quantity: '', unit: 'g' })

  const availableIngredients = products.filter(p => p.id !== productId && !p.isComposite)

  useEffect(() => {
    if (productId) {
      loadCompositions()
    }
  }, [productId])

  const loadCompositions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/products/${productId}/compositions`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCompositions(data.compositions || [])
        setCost(data.cost)
      }
    } catch (error) {
      console.error('Erreur chargement compositions:', error)
    }
  }

  const addIngredient = async () => {
    if (!newIngredient.ingredientId || !newIngredient.quantity) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/products/${productId}/compositions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ingredientId: parseInt(newIngredient.ingredientId),
          quantity: parseFloat(newIngredient.quantity),
          unit: newIngredient.unit
        })
      })

      if (response.ok) {
        await loadCompositions()
        setNewIngredient({ ingredientId: '', quantity: '', unit: 'g' })
        setShowAddForm(false)
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Erreur ajout ingrédient:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeIngredient = async (compositionId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/compositions/${compositionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        await loadCompositions()
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Erreur suppression ingrédient:', error)
    }
  }

  return (
    <div style={{
      background: '#F8FAFC',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} color="#6366F1" />
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>
            Composition / Recette
          </h4>
        </div>
        {cost !== null && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ECFDF5',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px'
          }}>
            <Calculator size={16} color="#059669" />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
              Coût: {cost.toFixed(2)}€
            </span>
          </div>
        )}
      </div>

      {compositions.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {compositions.map((comp) => (
            <div 
              key={comp.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                background: 'white',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ 
                  background: '#EEF2FF', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#4F46E5'
                }}>
                  {comp.quantity} {comp.unit}
                </span>
                <span style={{ fontWeight: '500' }}>{comp.ingredientName}</span>
                {comp.ingredientPurchasePrice && (
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    ({(parseFloat(comp.ingredientPurchasePrice) * parseFloat(comp.quantity)).toFixed(2)}€)
                  </span>
                )}
              </div>
              <button
                onClick={() => removeIngredient(comp.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: '0.25rem'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <div style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem' }}>
              Ingrédient
            </label>
            <select
              value={newIngredient.ingredientId}
              onChange={(e) => setNewIngredient({ ...newIngredient, ingredientId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            >
              <option value="">Sélectionner un ingrédient...</option>
              {availableIngredients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.currentQuantity} {p.unit} en stock)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                Quantité
              </label>
              <input
                type="number"
                step="0.001"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                placeholder="Ex: 250"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                Unité
              </label>
              <select
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="pièces">pièces</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                flex: 1,
                padding: '0.6rem',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Annuler
            </button>
            <button
              onClick={addIngredient}
              disabled={loading || !newIngredient.ingredientId || !newIngredient.quantity}
              style={{
                flex: 1,
                padding: '0.6rem',
                background: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'white',
            border: '2px dashed #D1D5DB',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#6B7280',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={18} />
          Ajouter un ingrédient
        </button>
      )}

      {compositions.length === 0 && !showAddForm && (
        <p style={{ 
          textAlign: 'center', 
          color: '#9CA3AF', 
          fontSize: '0.8rem',
          marginTop: '0.5rem'
        }}>
          Définissez les ingrédients qui composent ce produit
        </p>
      )}
    </div>
  )
}
