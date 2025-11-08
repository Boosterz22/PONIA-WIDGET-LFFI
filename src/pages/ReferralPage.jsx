import React, { useState } from 'react'
import { Gift, Copy, Check, Users, Award, TrendingUp } from 'lucide-react'
import Navigation from '../components/Navigation'

export default function ReferralPage({ session }) {
  const [copied, setCopied] = useState(false)
  const referralCode = localStorage.getItem('ponia_referral_code') || 'PONIA-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  const referralLink = `https://ponia.ai/register?ref=${referralCode}`
  const referredCount = parseInt(localStorage.getItem('ponia_referrals_count') || '0')
  const earningsTotal = referredCount * 10

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '80px' }}>
      <Navigation />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '16px'
        }}>
          <Gift size={64} style={{ color: '#1F2937', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1F2937' }}>
            Programme de Parrainage
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#374151', maxWidth: '600px', margin: '0 auto' }}>
            Invitez vos amis commerçants et gagnez <strong>€10</strong> par filleul qui s'inscrit !
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Users size={40} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
              {referredCount}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Filleuls inscrits
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Award size={40} style={{ color: '#FFA500', margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
              €{earningsTotal}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Gains totaux
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <TrendingUp size={40} style={{ color: '#a855f7', margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
              €10
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Par parrainage
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
            Votre lien de parrainage
          </h2>

          <div style={{
            background: '#F9FAFB',
            border: '2px dashed #E5E7EB',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                Code de parrainage
              </label>
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                {referralCode}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                Lien complet
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: 'white',
                    color: '#111827'
                  }}
                />
                <button
                  onClick={handleCopy}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Comment ça marche ?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1F2937',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Partagez votre lien
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: '1.6' }}>
                  Envoyez votre lien de parrainage à vos amis commerçants (boulanger, restaurateur, caviste, etc.)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1F2937',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Votre filleul s'inscrit
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: '1.6' }}>
                  Dès que votre filleul crée son compte PONIA AI avec votre lien, il est enregistré
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1F2937',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Vous gagnez €10
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: '1.6' }}>
                  Recevez automatiquement <strong>€10 de crédit</strong> sur votre compte PONIA AI. Utilisez-le pour upgrader ou prolonger votre abonnement !
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
          borderRadius: '12px',
          border: '1px solid #3B82F6'
        }}>
          <p style={{ fontSize: '0.95rem', color: '#1E40AF', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
            <strong>💡 Astuce :</strong> Plus vous parrainez, plus vous gagnez ! Aucune limite au nombre de filleuls.
          </p>
        </div>
      </div>
    </div>
  )
}
