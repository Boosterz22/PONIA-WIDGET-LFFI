import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Calculator, Users, TrendingUp, CheckCircle, ArrowRight, Phone, Mail, Building, User, Clock, Gift, Shield, HelpCircle, ChevronDown, ChevronUp, Percent } from 'lucide-react'

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
  const [openFaq, setOpenFaq] = useState(null)

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

  const faqs = [
    { q: t('partner.faq1Q'), a: t('partner.faq1A') },
    { q: t('partner.faq2Q'), a: t('partner.faq2A') },
    { q: t('partner.faq3Q'), a: t('partner.faq3A') },
    { q: t('partner.faq4Q'), a: t('partner.faq4A') }
  ]

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
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
              color: '#1a1a1a',
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
        padding: '40px 20px 60px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'block', margin: '0 auto 32px' }}>
            <img 
              src="/logo-ponia-full.png" 
              alt="PONIA" 
              style={{ height: '120px', display: 'block', margin: '0 auto', cursor: 'pointer' }}
            />
          </Link>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,215,0,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '24px'
          }}>
            <Calculator size={18} color="#FFD700" />
            <span style={{ color: '#FFD700', fontWeight: '600', fontSize: '14px' }}>
              {t('partner.badge')}
            </span>
          </div>
          
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: '1.2' }}>
            {t('partner.heroTitle')}
          </h1>
          
          <p style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            {t('partner.heroSubtitle')}
          </p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '20px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
            padding: '24px 48px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(255,215,0,0.3)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: '800', color: '#1a1a1a' }}>50%</div>
              <div style={{ fontSize: '14px', color: 'rgba(26,26,26,0.8)', fontWeight: '600' }}>
                {t('partner.commissionLabel')}
              </div>
            </div>
            <div style={{
              background: 'rgba(26,26,26,0.1)',
              padding: '12px 18px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>6 {t('partner.months')}</div>
              <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.7)' }}>{t('partner.recurring')}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '40px 20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '40px' }}>
            {t('partner.howItWorksTitle')}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { step: '1', icon: User, title: t('partner.step1Title'), desc: t('partner.step1Desc') },
              { step: '2', icon: Gift, title: t('partner.step2Title'), desc: t('partner.step2Desc') },
              { step: '3', icon: Users, title: t('partner.step3Title'), desc: t('partner.step3Desc') },
              { step: '4', icon: Percent, title: t('partner.step4Title'), desc: t('partner.step4Desc') }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  position: 'relative'
                }}>
                  <item.icon size={28} color="#1a1a1a" />
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.step}
                  </div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                  {item.desc}
                </p>
              </div>
            ))}
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
                { icon: Percent, title: t('partner.benefit1Title'), desc: t('partner.benefit1Desc') },
                { icon: Clock, title: t('partner.benefit2Title'), desc: t('partner.benefit2Desc') },
                { icon: TrendingUp, title: t('partner.benefit3Title'), desc: t('partner.benefit3Desc') },
                { icon: Shield, title: t('partner.benefit4Title'), desc: t('partner.benefit4Desc') }
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
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <benefit.icon size={24} color="#1a1a1a" />
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
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
              borderRadius: '16px',
              border: '2px solid #B8860B'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
                {t('partner.exampleTitle')}
              </h3>
              <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                {t('partner.exampleText')}
              </p>
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.8)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>1 470€</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{t('partner.earnings6Months')}</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.8)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>10 {t('partner.clientsWord')}</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{t('partner.referredClients')}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link to="/"><img src="/logo-ponia-icon.png" alt="PONIA" style={{ width: '32px', height: '32px', cursor: 'pointer' }} /></Link>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                {t('partner.formTitle')}
              </h2>
            </div>
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
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
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
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
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
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
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
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
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
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                  color: '#1a1a1a',
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

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '32px' }}>
            <HelpCircle size={24} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} />
            {t('partner.faqTitle')}
          </h2>
          
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                    {faq.q}
                  </span>
                  {openFaq === i ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 20px 18px',
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ 
        padding: '3rem 0 2rem', 
        background: '#1a1a1a', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Link to="/"><img src="/logo-ponia-icon-yellow.png" alt="PONIA" style={{ height: '50px', cursor: 'pointer' }} /></Link>
          </div>
          
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Gestion de stock par IA pour commerces français
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <a 
              href="https://x.com/ponia_hq" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ fill: 'currentColor' }}>
                <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/enock-ligue-238230396" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'currentColor' }}>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            flexWrap: 'wrap',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Link to="/tarifs" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Tarifs</Link>
            <Link to="/confidentialite" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Confidentialité</Link>
            <Link to="/cgv" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>CGV</Link>
            <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</Link>
          </div>
          
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            © 2025 PONIA - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  )
}
