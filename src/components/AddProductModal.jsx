import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function AddProductModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    currentQuantity: '',
    unit: 'kg',
    alertThreshold: '',
    supplier: '',
    expiryDate: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
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
    }} onClick={onClose}>
      <div className="card" style={{ 
        maxWidth: '500px', 
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Ajouter un produit</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Nom du produit
            </label>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Ex: Farine T55"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Quantité actuelle
              </label>
              <input
                type="number"
                name="currentQuantity"
                className="input"
                placeholder="Ex: 25"
                value={formData.currentQuantity}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Unité
              </label>
              <select
                name="unit"
                className="input"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="pièces">pièces</option>
                <option value="bouteilles">bouteilles</option>
                <option value="sachets">sachets</option>
                <option value="boîtes">boîtes</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Seuil d'alerte
            </label>
            <input
              type="number"
              name="alertThreshold"
              className="input"
              placeholder="Ex: 10"
              value={formData.alertThreshold}
              onChange={handleChange}
              step="0.01"
              required
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Vous serez alerté quand le stock descend en dessous de ce seuil
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Fournisseur (optionnel)
            </label>
            <input
              type="text"
              name="supplier"
              className="input"
              placeholder="Ex: Moulins Bio"
              value={formData.supplier}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              📅 Date de péremption (DLC/DLUO) (optionnel)
            </label>
            <input
              type="date"
              name="expiryDate"
              className="input"
              value={formData.expiryDate}
              onChange={handleChange}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Pour réduire le gaspillage, PONIA vous alertera avant la péremption
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
