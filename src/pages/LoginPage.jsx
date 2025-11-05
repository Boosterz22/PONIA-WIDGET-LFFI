import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('boulangerie')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signIn(email, businessName, businessType)
    
    if (!error) {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            <Package size={32} color="#FFD700" />
            <span>PONIA AI</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Commencez votre essai gratuit de 30 jours</p>
        </div>

        <form onSubmit={handleLogin} className="card">
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              className="input"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Nom de votre commerce
            </label>
            <input
              type="text"
              className="input"
              placeholder="Boulangerie Martin"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Type de commerce
            </label>
            <select
              className="input"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
            >
              <option value="boulangerie">🥖 Boulangerie</option>
              <option value="restaurant">🍕 Restaurant</option>
              <option value="bar">☕ Bar / Café</option>
              <option value="cave">🍷 Cave à vin</option>
              <option value="tabac">🚬 Tabac / Presse</option>
              <option value="boucherie">🥩 Boucherie</option>
              <option value="fromagerie">🧀 Fromagerie</option>
              <option value="epicerie">🛒 Épicerie</option>
              <option value="autre">📦 Autre commerce</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Connexion...' : 'Démarrer l\'essai gratuit'}
          </button>

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Sans engagement • Annulez quand vous voulez
          </p>
        </form>
      </div>
    </div>
  )
}
