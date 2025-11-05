import React from 'react'
import { X, Sparkles, CheckCircle } from 'lucide-react'

export default function UpgradeModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div className="card" style={{
        maxWidth: '600px',
        width: '100%',
        padding: '2.5rem',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            🚀
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Limite atteinte !
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Vous avez atteint la limite de <strong style={{ color: 'var(--primary)' }}>10 produits</strong> du plan Gratuit
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'rgba(255, 215, 0, 0.05)',
          borderRadius: '15px',
          border: '2px solid var(--primary)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline',
            marginBottom: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Plan Standard
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                €49<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
            </div>
            <div style={{
              background: 'var(--primary)',
              color: 'var(--bg)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              -50% OFFRE LANCEMENT
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span><strong>Produits illimités</strong></span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Alertes avancées + suggestions IA</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Historique 30 jours</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Export PDF commandes</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Support prioritaire</span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(74, 222, 128, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.25rem' }}>
              ROI garanti x12
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              €49/mois pour économiser €600+/mois
            </div>
          </div>

          <button className="btn btn-primary" style={{ 
            width: '100%', 
            padding: '1.125rem',
            fontSize: '1.125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Sparkles size={20} />
            <span>Passer au plan Standard</span>
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            💡 <strong>Astuce :</strong> Invitez un ami et gagnez <strong style={{ color: 'var(--primary)' }}>1 mois gratuit</strong>
          </p>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Rester en plan Gratuit pour le moment
          </button>
        </div>
      </div>
    </div>
  )
}
