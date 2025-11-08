import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Mail, Lock, Trash2, Briefcase } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'

export default function SettingsPage({ session }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState(session.user.email)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [userData, setUserData] = useState(null)
  
  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setBusinessName(data.user.businessName || '')
        setBusinessType(data.user.businessType || '')
      }
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error)
    }
  }

  const planInfo = {
    basique: { name: 'Basique', color: '#22c55e', price: '€0/mois', features: ['10 produits max', 'Alertes basiques', 'Support email'] },
    standard: { name: 'Standard', color: '#FFA500', price: '€49/mois', features: ['50 produits max', 'IA prédictive 7 jours', 'Chat AI', 'Support prioritaire'] },
    pro: { name: 'Pro', color: '#a855f7', price: '€69/mois', features: ['Produits illimités', 'IA prédictive 30 jours', 'Multi-magasins', 'Support VIP 24/7'] }
  }

  const handleUpdateEmail = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw error
      setMessage('✅ Email mis à jour ! Vérifiez votre nouvelle adresse.')
    } catch (error) {
      setMessage('❌ Erreur : ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('❌ Les mots de passe ne correspondent pas')
      return
    }
    if (newPassword.length < 6) {
      setMessage('❌ Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage('✅ Mot de passe mis à jour avec succès !')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage('❌ Erreur : ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBusinessInfo = async () => {
    if (!businessName.trim()) {
      setMessage('❌ Le nom du commerce est requis')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/users/business', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          businessName,
          businessType
        })
      })

      if (response.ok) {
        setMessage('✅ Informations mises à jour avec succès !')
        localStorage.setItem('ponia_business_type', businessType)
        await loadUserData()
      } else {
        const error = await response.json()
        setMessage(`❌ Erreur: ${error.message || 'Impossible de mettre à jour'}`)
      }
    } catch (error) {
      setMessage('❌ Erreur : ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '80px' }}>
      <Navigation />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Paramètres
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Gérez votre compte et vos préférences
          </p>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('✅') ? '#D1FAE5' : '#FEE2E2',
            border: `1px solid ${message.includes('✅') ? '#10B981' : '#EF4444'}`,
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Crown size={24} color={planInfo[userPlan].color} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Plan actuel
            </h2>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${planInfo[userPlan].color}15, ${planInfo[userPlan].color}05)`,
            border: `2px solid ${planInfo[userPlan].color}`,
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: planInfo[userPlan].color, margin: '0 0 0.25rem 0' }}>
                  {planInfo[userPlan].name}
                </h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {planInfo[userPlan].price}
                </p>
              </div>
              {userPlan !== 'pro' && (
                <button
                  onClick={() => {
                    localStorage.setItem('ponia_user_plan', 'pro')
                    window.location.reload()
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Crown size={16} />
                  Upgrader vers Pro
                </button>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.5rem' }}>
                Fonctionnalités incluses :
              </p>
              {planInfo[userPlan].features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: planInfo[userPlan].color }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Briefcase size={24} color="#111827" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Informations du commerce
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Nom du commerce
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ex: Boulangerie Martin"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Type de commerce
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            >
              <option value="">Sélectionnez un type</option>
              <option value="boulangerie">Boulangerie</option>
              <option value="patisserie">Pâtisserie</option>
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar/Café</option>
              <option value="cave">Cave à vin</option>
              <option value="epicerie">Épicerie</option>
              <option value="traiteur">Traiteur</option>
              <option value="fromagerie">Fromagerie</option>
              <option value="boucherie">Boucherie</option>
            </select>
          </div>

          <button
            onClick={handleUpdateBusinessInfo}
            disabled={loading || !businessName.trim()}
            className="btn btn-primary"
            style={{ opacity: !businessName.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Mail size={24} color="#111827" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Email
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button
            onClick={handleUpdateEmail}
            disabled={loading || email === session.user.email}
            className="btn btn-primary"
            style={{ opacity: email === session.user.email ? 0.5 : 1 }}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour l\'email'}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Lock size={24} color="#111827" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Mot de passe
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-tapez le mot de passe"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={loading || !newPassword || !confirmPassword}
            className="btn btn-primary"
            style={{ opacity: !newPassword || !confirmPassword ? 0.5 : 1 }}
          >
            {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderColor: '#EF4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Trash2 size={24} color="#EF4444" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#EF4444' }}>
              Zone de danger
            </h2>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
            La suppression de votre compte est définitive et irréversible. Toutes vos données seront perdues.
          </p>

          <button
            onClick={() => {
              if (confirm('Êtes-vous ABSOLUMENT sûr de vouloir supprimer votre compte ? Cette action est IRRÉVERSIBLE.')) {
                alert('Fonctionnalité de suppression de compte à venir. Contactez le support pour le moment.')
              }
            }}
            style={{
              background: '#FEE2E2',
              color: '#EF4444',
              border: '1px solid #EF4444',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  )
}
