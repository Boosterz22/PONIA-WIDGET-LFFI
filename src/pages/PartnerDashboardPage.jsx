import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Users, Euro, TrendingUp, Copy, CheckCircle, ArrowLeft, Download, Calendar, Building } from 'lucide-react'

export default function PartnerDashboardPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [partner, setPartner] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const partnerCode = searchParams.get('code')

  useEffect(() => {
    if (!partnerCode) {
      setError('Code partenaire manquant')
      setLoading(false)
      return
    }
    fetchPartnerData()
  }, [partnerCode])

  const fetchPartnerData = async () => {
    try {
      const res = await fetch(`/api/partners/${partnerCode}`)
      if (!res.ok) throw new Error('Partenaire non trouvé')
      
      const data = await res.json()
      setPartner(data.partner)
      setReferrals(data.referrals || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/login?ref=${partner?.referralCode || ''}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportCSV = () => {
    if (!referrals.length) return
    
    const headers = ['Email', 'Commerce', 'Type', 'Plan', 'Date inscription', 'Revenu mensuel', 'Commission']
    const rows = referrals.map(r => [
      r.email,
      r.businessName || '-',
      r.businessType || '-',
      r.plan,
      new Date(r.createdAt).toLocaleDateString('fr-FR'),
      r.monthlyRevenue || '0',
      r.commission || '0'
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ponia-partenaire-${partner?.referralCode}-${new Date().toISOString().split('T')[0]}.csv`
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
            border: '4px solid #f59e0b',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#666' }}>{t('partner.loading')}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
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
            {t('partner.errorTitle')}
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/partenaires/comptables')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {t('partner.becomePartner')}
          </button>
        </div>
      </div>
    )
  }

  const totalRevenue = referrals.reduce((sum, r) => {
    const planPrices = { basique: 0, standard: 49, pro: 69 }
    return sum + (planPrices[r.plan] || 0)
  }, 0)
  const totalCommission = totalRevenue * (partner?.commissionRate || 50) / 100

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '24px 20px 60px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            <ArrowLeft size={18} />
            {t('partner.backHome')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building size={28} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                {partner?.companyName}
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {partner?.name} - {t('partner.dashboardSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-40px auto 0', padding: '0 20px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
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
                {t('partner.totalClients')}
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
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Euro size={22} color="#d97706" />
              </div>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                {t('partner.monthlyRevenue')}
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a' }}>
              {totalRevenue}€
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={22} color="white" />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500' }}>
                {t('partner.yourCommission')} ({partner?.commissionRate}%)
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>
              {totalCommission.toFixed(2)}€
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
            {t('partner.yourLink')}
          </h2>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '14px 16px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#374151',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {window.location.origin}/login?ref={partner?.referralCode || ''}
            </div>
            <button
              onClick={copyReferralLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: copied ? '#10b981' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? t('partner.copied') : t('partner.copyLink')}
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
              {t('partner.clientsList')}
            </h2>
            {referrals.length > 0 && (
              <button
                onClick={exportCSV}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                {t('partner.exportCSV')}
              </button>
            )}
          </div>

          {referrals.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              color: '#9ca3af'
            }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>{t('partner.noClients')}</p>
              <p style={{ fontSize: '14px' }}>{t('partner.shareLink')}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {[t('partner.thEmail'), t('partner.thBusiness'), t('partner.thPlan'), t('partner.thDate'), t('partner.thRevenue'), t('partner.thCommission')].map((th, i) => (
                      <th key={i} style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderBottom: '2px solid #e5e7eb',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => {
                    const planPrices = { basique: 0, standard: 49, pro: 69 }
                    const revenue = planPrices[r.plan] || 0
                    const commission = revenue * (partner?.commissionRate || 50) / 100
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#1a1a1a' }}>{r.email}</td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>{r.businessName || '-'}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: r.plan === 'pro' ? '#fef3c7' : r.plan === 'standard' ? '#dbeafe' : '#f3f4f6',
                            color: r.plan === 'pro' ? '#92400e' : r.plan === 'standard' ? '#1e40af' : '#6b7280'
                          }}>
                            {r.plan?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                          {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                          {revenue}€/mois
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>
                          {commission.toFixed(2)}€
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
