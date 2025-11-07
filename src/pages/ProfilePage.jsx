import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Briefcase, Crown, Calendar, Edit2, Save, X } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function ProfilePage({ session }) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [businessName, setBusinessName] = useState(session.user.business_name || 'Mon Commerce')
  const [saving, setSaving] = useState(false)

  const userPlan = localStorage.getItem('ponia_user_plan') || 'basique'
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const referralCode = localStorage.getItem('ponia_referral_code') || 'CODE-00'
  const createdAt = new Date(session.user.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { business_name: businessName }
      })
      if (!error) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const getPlanBadge = () => {
    if (userPlan === 'basique') {
      return { bg: '#4ade80', text: 'Basique', color: 'white' }
    } else if (userPlan === 'standard') {
      return { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', text: 'Standard', color: '#1F2937' }
    } else {
      return { bg: 'linear-gradient(135deg, #a855f7, #7c3aed)', text: 'Pro', color: 'white' }
    }
  }

  const plan = getPlanBadge()

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
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} />
            <span>Retour au Dashboard</span>
          </button>
          <Link to="/">
            <img src="/ponia-icon.png" alt="PONIA AI" style={{ height: '36px' }} />
          </Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Mon Profil
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
          Gérez vos informations personnelles et votre compte
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Informations générales</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit2 size={16} />
                <span>Modifier</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <X size={16} />
                  <span>Annuler</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={16} />
                  <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <Briefcase size={16} />
                <span>Nom du commerce</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              ) : (
                <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px', fontWeight: '500' }}>
                  {businessName}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <Mail size={16} />
                <span>Email</span>
              </label>
              <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px', color: '#6B7280' }}>
                {session.user.email}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <User size={16} />
                <span>Type de commerce</span>
              </label>
              <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
                {businessType === 'bakery' && '🥖 Boulangerie'}
                {businessType === 'restaurant' && '🍽️ Restaurant'}
                {businessType === 'bar' && '🍺 Bar'}
                {businessType === 'wine_cellar' && '🍷 Cave à vin'}
                {businessType === 'grocery' && '🏪 Épicerie'}
                {businessType === 'butcher' && '🥩 Boucherie'}
                {businessType === 'cheese_shop' && '🧀 Fromagerie'}
                {businessType === 'fish_shop' && '🐟 Poissonnerie'}
                {businessType === 'other' && '🏬 Autre'}
                {businessType === 'default' && '🏬 Commerce'}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <Calendar size={16} />
                <span>Membre depuis</span>
              </label>
              <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
                {createdAt}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Abonnement</h2>
          
          <div style={{ 
            background: plan.bg,
            color: plan.color,
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Crown size={24} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{plan.text}</span>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              {userPlan === 'basique' && '€0/mois - 10 produits max'}
              {userPlan === 'standard' && '€49/mois - Produits illimités'}
              {userPlan === 'pro' && '€69/mois - Tout illimité + IA avancée'}
            </div>
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              🎁 Code parrainage
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: '700', color: '#FFD700' }}>
              {referralCode}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
              Partagez ce code et gagnez 1 mois gratuit par parrainage
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
