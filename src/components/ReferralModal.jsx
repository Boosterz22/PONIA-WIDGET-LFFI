import React, { useState } from 'react'
import { X, Copy, CheckCircle, Share2, Users } from 'lucide-react'

export default function ReferralModal({ referralCode, onClose }) {
  const [copied, setCopied] = useState(false)

  const referralLink = `${window.location.origin}/login?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `👋 Hey ! Je te recommande PONIA AI pour gérer ton stock. C'est GRATUIT jusqu'à 10 produits et ça m'a fait économiser €400/mois.\n\nInscris-toi avec mon code : ${referralCode}\n${referralLink}\n\n🎁 Tu bénéficieras de -50% le 1er mois si tu upgrades !`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Découvre PONIA AI - Gestion de stock intelligente')
    const body = encodeURIComponent(
      `Salut,\n\nJe voulais te parler de PONIA AI, une app qui m'aide à gérer mon stock en 2 minutes par jour.\n\nC'est GRATUIT jusqu'à 10 produits, et personnellement ça m'a fait économiser €400/mois en réduisant le gaspillage.\n\nInscris-toi avec mon code parrainage : ${referralCode}\n${referralLink}\n\n🎁 Tu bénéficieras de -50% le 1er mois si tu passes au plan payant !\n\nÀ bientôt,`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

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
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            🎁
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Invitez vos collègues
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Gagnez <strong style={{ color: 'var(--success)' }}>1 mois gratuit</strong> pour chaque filleul qui s'inscrit
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Votre code parrainage
              </div>
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold', 
                color: 'var(--primary)',
                fontFamily: 'monospace',
                letterSpacing: '0.05em'
              }}>
                {referralCode}
              </div>
            </div>
            <Users size={48} color="#4ade80" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Lien de parrainage :
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={referralLink}
                readOnly
                className="input"
                style={{ 
                  flex: 1,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem'
          }}>
            <button
              onClick={handleShareWhatsApp}
              className="btn btn-primary"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>💬</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleShareEmail}
              className="btn btn-secondary"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>📧</span>
              <span>Email</span>
            </button>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="#FFD700" />
            Comment ça marche ?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ 
                background: 'var(--primary)', 
                color: 'var(--bg)', 
                width: '24px', 
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                flexShrink: 0
              }}>1</span>
              <span>Partagez votre code avec vos collègues commerçants</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ 
                background: 'var(--primary)', 
                color: 'var(--bg)', 
                width: '24px', 
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                flexShrink: 0
              }}>2</span>
              <span>Ils s'inscrivent avec -50% le 1er mois</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ 
                background: 'var(--success)', 
                color: 'var(--bg)', 
                width: '24px', 
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                flexShrink: 0
              }}>3</span>
              <span><strong style={{ color: 'var(--success)' }}>Vous gagnez 1 mois gratuit</strong> automatiquement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
