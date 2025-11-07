import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Bell, Shield, Trash2, Download, Lock, AlertTriangle } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function SettingsPage({ session }) {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [stockAlerts, setStockAlerts] = useState(true)
  const [expiryAlerts, setExpiryAlerts] = useState(true)

  const handleExportData = () => {
    const products = JSON.parse(localStorage.getItem('ponia_products') || '[]')
    const data = {
      exportDate: new Date().toISOString(),
      userEmail: session.user.email,
      businessName: session.user.business_name,
      products: products
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ponia-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = async () => {
    try {
      localStorage.clear()
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

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
          Paramètres
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
          Configurez votre expérience PONIA AI
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} />
            <span>Notifications</span>
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Notifications par email</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Recevez les alertes importantes par email
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: emailNotifications ? '#4ade80' : '#E5E7EB',
                  borderRadius: '28px',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    left: emailNotifications ? '26px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all 0.3s',
                  }} />
                </span>
              </label>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Alertes de stock</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Notifications pour les produits en stock faible
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={stockAlerts}
                  onChange={(e) => setStockAlerts(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: stockAlerts ? '#4ade80' : '#E5E7EB',
                  borderRadius: '28px',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    left: stockAlerts ? '26px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all 0.3s',
                  }} />
                </span>
              </label>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Alertes de péremption</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Notifications pour les produits proche de la péremption
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={expiryAlerts}
                  onChange={(e) => setExpiryAlerts(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: expiryAlerts ? '#4ade80' : '#E5E7EB',
                  borderRadius: '28px',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    left: expiryAlerts ? '26px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all 0.3s',
                  }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} />
            <span>Données & Sécurité</span>
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={handleExportData}
              className="btn btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '1rem'
              }}
            >
              <Download size={20} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600' }}>Exporter mes données</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Télécharger tous vos produits au format JSON
                </div>
              </div>
            </button>

            <button
              onClick={() => alert('Changement de mot de passe - Fonctionnalité à venir')}
              className="btn btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '1rem'
              }}
            >
              <Lock size={20} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600' }}>Changer le mot de passe</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Modifier votre mot de passe de connexion
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', border: '2px solid #EF4444' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
            <AlertTriangle size={20} />
            <span>Zone de danger</span>
          </h2>

          <div style={{ 
            padding: '1rem',
            background: '#FEF2F2',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#991B1B' }}>
              Supprimer mon compte
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn"
              style={{ 
                background: '#EF4444',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Trash2 size={18} />
              <span>Supprimer définitivement mon compte</span>
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
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
        }} onClick={() => setShowDeleteModal(false)}>
          <div className="card" style={{ 
            maxWidth: '500px', 
            width: '100%',
            textAlign: 'center',
            padding: '2rem'
          }} onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={64} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#EF4444' }}>
              Supprimer le compte ?
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Cette action est <strong>irréversible</strong>. Toutes vos données (produits, historique, paramètres) seront définitivement supprimées.
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="btn"
                style={{ 
                  flex: 1,
                  background: '#EF4444',
                  color: 'white'
                }}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
