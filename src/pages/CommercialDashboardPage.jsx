import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Users, Euro, TrendingUp, Copy, CheckCircle, Download, Target, Award } from 'lucide-react'

export default function CommercialDashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [commercial, setCommercial] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [codeInput, setCodeInput] = useState('')

  const commercialCode = searchParams.get('code')

  useEffect(() => {
    if (commercialCode) {
      fetchCommercialData()
    } else {
      setLoading(false)
    }
  }, [commercialCode])

  const fetchCommercialData = async () => {
    try {
      const res = await fetch(`/api/commercials/${commercialCode}`)
      if (!res.ok) throw new Error('Code commercial non trouvé')
      
      const data = await res.json()
      setCommercial(data.commercial)
      setReferrals(data.referrals || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (codeInput.trim()) {
      navigate(`/commercial?code=${codeInput.trim().toUpperCase()}`)
    }
  }

  const copyReferralLink = () => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/login?ref=${commercial?.referralCode || ''}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadKit = async () => {
    window.open('/api/commercial-kit-pdf', '_blank')
  }

  const exportCSV = () => {
    if (!referrals.length) return
    
    const headers = ['Email', 'Commerce', 'Type', 'Plan', 'Date inscription', 'Payant', 'Commission']
    const rows = referrals.map(r => [
      r.email,
      r.businessName || '-',
      r.businessType || '-',
      r.plan,
      new Date(r.createdAt).toLocaleDateString('fr-FR'),
      r.isPaying ? 'Oui' : 'Non',
      r.commission || '0'
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ponia-commercial-${commercial?.referralCode}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFFDF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #FFD700',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#666' }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  if (!commercialCode) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span style={{ fontSize: '40px' }}>📊</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Dashboard Commercial
          </h1>
          <p style={{ color: '#666', marginBottom: '32px' }}>
            Entrez votre code commercial pour accéder à vos statistiques
          </p>
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="COM-XXXXXX"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                textAlign: 'center',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Accéder au Dashboard
            </button>
          </form>

          <button
            onClick={downloadKit}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '24px auto 0'
            }}
          >
            <Download size={16} />
            Télécharger le Kit Commercial (PDF)
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFFDF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626', marginBottom: '16px' }}>
            Code non trouvé
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/commercial')}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
              color: '#1a1a1a',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const payingClients = referrals.filter(r => r.isPaying)
  const totalCommission = payingClients.reduce((sum, r) => {
    const planPrices = { basique: 0, standard: 49, pro: 69 }
    return sum + (planPrices[r.plan] || 0) * 0.35
  }, 0)
  const bonusProgress = payingClients.length
  const bonusReached = bonusProgress >= 7

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '24px 20px 60px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                📊
              </div>
              <div>
                <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                  {commercial?.name || 'Commercial'}
                </h1>
                <p style={{ color: '#FFD700', fontSize: '14px', margin: 0, fontWeight: '600' }}>
                  {commercial?.referralCode}
                </p>
              </div>
            </div>
            <button
              onClick={downloadKit}
              style={{
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} />
              Kit PDF
            </button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '0 0 4px' }}>
                Votre lien de parrainage
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: 0, wordBreak: 'break-all' }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}/login?ref={commercial?.referralCode}
              </p>
            </div>
            <button
              onClick={copyReferralLink}
              style={{
                padding: '10px 20px',
                background: copied ? '#10B981' : '#FFD700',
                color: copied ? 'white' : '#1a1a1a',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-40px auto 0', padding: '0 20px 40px' }}>
        <style>{`
          @media (min-width: 768px) {
            .commercial-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
        `}</style>
        <div className="commercial-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={22} color="#2563eb" />
              </div>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Inscrits
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a' }}>
              {referrals.length}
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={22} color="#16a34a" />
              </div>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Clients Payants
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#16a34a' }}>
              {payingClients.length}
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Euro size={22} color="#d97706" />
              </div>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Commission (35%)
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#d97706' }}>
              {totalCommission.toFixed(2)}€
            </div>
          </div>

          <div style={{
            background: bonusReached ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: bonusReached ? '0 4px 20px rgba(16,185,129,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: bonusReached ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={22} color={bonusReached ? 'white' : '#db2777'} />
              </div>
              <span style={{ color: bonusReached ? 'rgba(255,255,255,0.9)' : '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Prime Bonus
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: bonusReached ? 'white' : '#1a1a1a' }}>
              {bonusReached ? '+100€' : `${bonusProgress}/7`}
            </div>
            {!bonusReached && (
              <div style={{ marginTop: '8px' }}>
                <div style={{
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(bonusProgress / 7) * 100}%`,
                    background: 'linear-gradient(90deg, #FFD700, #FFC000)',
                    borderRadius: '3px',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  Encore {7 - bonusProgress} client{7 - bonusProgress > 1 ? 's' : ''} payant{7 - bonusProgress > 1 ? 's' : ''} pour la prime
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
              Mes clients ({referrals.length})
            </h2>
            {referrals.length > 0 && (
              <button
                onClick={exportCSV}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>

          {referrals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ margin: 0 }}>Aucun client inscrit pour le moment</p>
              <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
                Partagez votre lien de parrainage pour commencer !
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: '600' }}>Commerce</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: '600' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: '600' }}>Plan</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: '600' }}>Statut</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', color: '#6b7280', fontWeight: '600' }}>Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, idx) => {
                    const planPrices = { basique: 0, standard: 49, pro: 69 }
                    const commission = r.isPaying ? (planPrices[r.plan] || 0) * 0.35 : 0
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ fontWeight: '600' }}>{r.businessName || r.email}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td style={{ padding: '16px 8px', color: '#6b7280' }}>
                          {r.businessType || '-'}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: r.plan === 'pro' ? '#1a1a1a' : r.plan === 'standard' ? '#fef3c7' : '#f3f4f6',
                            color: r.plan === 'pro' ? '#FFD700' : r.plan === 'standard' ? '#92400e' : '#6b7280'
                          }}>
                            {r.plan?.toUpperCase() || 'BASIQUE'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: r.isPaying ? '#dcfce7' : '#fef3c7',
                            color: r.isPaying ? '#16a34a' : '#92400e'
                          }}>
                            {r.isPaying ? 'Payant' : 'Essai'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: '700', color: commission > 0 ? '#16a34a' : '#9ca3af' }}>
                          {commission > 0 ? `+${commission.toFixed(2)}€` : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
