import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Calculator, Users, Euro, TrendingUp, CheckCircle, ArrowRight, Phone, Mail, Building, User } from 'lucide-react'

export default function PartnerComptablePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    estimatedClients: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          partnerType: 'comptable',
          estimatedClients: parseInt(formData.estimatedClients) || 0
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
            {t('partner.successTitle')}
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '32px' }}>
            {t('partner.successMessage')}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {t('partner.backHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 100%)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245,158,11,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '24px'
          }}>
            <Calculator size={18} color="#f59e0b" />
            <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '14px' }}>
              {t('partner.badge')}
            </span>
          </div>
          
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: '1.2' }}>
            {t('partner.heroTitle')}
          </h1>
          
          <p style={{ fontSize: '20px', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            {t('partner.heroSubtitle')}
          </p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '16px 32px',
            borderRadius: '16px'
          }}>
            <Euro size={32} color="white" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>50%</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{t('partner.commissionLabel')}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px' }}>
              {t('partner.whyTitle')}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: Euro, title: t('partner.benefit1Title'), desc: t('partner.benefit1Desc') },
                { icon: Users, title: t('partner.benefit2Title'), desc: t('partner.benefit2Desc') },
                { icon: TrendingUp, title: t('partner.benefit3Title'), desc: t('partner.benefit3Desc') },
                { icon: CheckCircle, title: t('partner.benefit4Title'), desc: t('partner.benefit4Desc') }
              ].map((benefit, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <benefit.icon size={24} color="#d97706" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                      {benefit.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '16px',
              border: '2px solid #f59e0b'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#92400e', marginBottom: '12px' }}>
                {t('partner.exampleTitle')}
              </h3>
              <p style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
                {t('partner.exampleText')}
              </p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
              {t('partner.formTitle')}
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              {t('partner.formSubtitle')}
            </p>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  <User size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {t('partner.nameLabel')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={t('partner.namePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  <Building size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {t('partner.companyLabel')}
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder={t('partner.companyPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  <Mail size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {t('partner.emailLabel')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder={t('partner.emailPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  <Phone size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {t('partner.phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('partner.phonePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  <Users size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {t('partner.clientsLabel')}
                </label>
                <input
                  type="number"
                  value={formData.estimatedClients}
                  onChange={(e) => setFormData({ ...formData, estimatedClients: e.target.value })}
                  placeholder={t('partner.clientsPlaceholder')}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? t('partner.submitting') : t('partner.submitButton')}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{
        background: '#1a1a1a',
        padding: '32px 20px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          PONIA AI - support@myponia.fr - myponia.fr
        </p>
      </div>
    </div>
  )
}
