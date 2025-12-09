import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Crown, Mail, Lock, Trash2, Briefcase, Bell, ChevronRight } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'
import { useLanguage } from '../contexts/LanguageContext'

export default function SettingsPage({ session }) {
  const { t } = useLanguage()
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

  const getPlanInfo = () => ({
    basique: { name: t('plans.basic'), color: '#22c55e', price: `€0${t('common.perMonth')}`, features: t('plans.basicFeatures') },
    standard: { name: t('plans.standard'), color: '#FFA500', price: `€49${t('common.perMonth')}`, features: t('plans.standardFeatures') },
    pro: { name: t('plans.pro'), color: '#a855f7', price: `€69${t('common.perMonth')}`, features: t('plans.proFeatures') }
  })
  const planInfo = getPlanInfo()

  const handleUpdateEmail = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw error
      setMessage(`✅ ${t('settings.emailUpdated')}`)
    } catch (error) {
      setMessage(`❌ ${t('common.error')}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage(`❌ ${t('settings.passwordMismatch')}`)
      return
    }
    if (newPassword.length < 6) {
      setMessage(`❌ ${t('settings.passwordTooShort')}`)
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage(`✅ ${t('settings.passwordUpdated')}`)
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage(`❌ ${t('common.error')}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBusinessInfo = async () => {
    if (!businessName.trim()) {
      setMessage(`❌ ${t('settings.businessNameRequired')}`)
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
        setMessage(`✅ ${t('settings.infoUpdated')}`)
        localStorage.setItem('ponia_business_type', businessType)
        await loadUserData()
      } else {
        const error = await response.json()
        setMessage(`❌ ${t('common.error')}: ${error.message}`)
      }
    } catch (error) {
      setMessage(`❌ ${t('common.error')}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePlan = async (newPlan) => {
    setLoading(true)
    setMessage('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/users/plan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ plan: newPlan })
      })

      if (response.ok) {
        localStorage.setItem('ponia_user_plan', newPlan)
        setMessage(`✅ ${t('settings.planChanged')} ${planInfo[newPlan].name}!`)
        setTimeout(() => window.location.reload(), 800)
      } else {
        const error = await response.json()
        setMessage(`❌ ${t('common.error')}: ${error.message}`)
      }
    } catch (error) {
      setMessage(`❌ ${t('common.error')}: ${error.message}`)
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
            {t('settings.title')}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            {t('settings.subtitle')}
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
              {t('settings.currentPlan')}
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
              {userPlan === 'basique' && (
                <button
                  onClick={() => navigate('/upgrade')}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Crown size={16} />
                  {t('settings.upgradeNow')}
                </button>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.5rem' }}>
                {t('settings.featuresIncluded')}
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
              {t('settings.businessInfo')}
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              {t('settings.businessName')}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t('settings.businessNamePlaceholder')}
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
              {t('settings.businessType')}
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
              <option value="">{t('settings.selectType')}</option>
              <option value="boulangerie">{t('settings.bakery')}</option>
              <option value="patisserie">{t('settings.pastry')}</option>
              <option value="restaurant">{t('settings.restaurant')}</option>
              <option value="bar">{t('settings.bar')}</option>
              <option value="cave">{t('settings.wineShop')}</option>
              <option value="epicerie">{t('settings.grocery')}</option>
              <option value="traiteur">{t('settings.caterer')}</option>
              <option value="fromagerie">{t('settings.cheeseShop')}</option>
              <option value="boucherie">{t('settings.butcher')}</option>
            </select>
          </div>

          <button
            onClick={handleUpdateBusinessInfo}
            disabled={loading || !businessName.trim()}
            className="btn btn-primary"
            style={{ opacity: !businessName.trim() ? 0.5 : 1 }}
          >
            {loading ? t('settings.updating') : t('settings.update')}
          </button>
        </div>

        <Link to="/settings/alerts" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            padding: '1.5rem', 
            marginBottom: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '2px solid transparent'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#FFD700'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bell size={24} color="#1F2937" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                    {t('settings.emailAlerts')}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                    {t('settings.emailAlertsDesc')}
                  </p>
                </div>
              </div>
              <ChevronRight size={24} color="#9CA3AF" />
            </div>
          </div>
        </Link>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Mail size={24} color="#111827" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              {t('settings.email')}
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              {t('settings.emailAddress')}
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
            {loading ? t('settings.updating') : t('settings.updateEmail')}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Lock size={24} color="#111827" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              {t('settings.password')}
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              {t('settings.newPassword')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('settings.minChars')}
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
              {t('settings.confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('settings.retypePassword')}
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
            {loading ? t('settings.updating') : t('settings.changePassword')}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderColor: '#EF4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Trash2 size={24} color="#EF4444" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#EF4444' }}>
              {t('settings.dangerZone')}
            </h2>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
            {t('settings.deleteWarning')}
          </p>

          <button
            onClick={() => {
              if (confirm(t('settings.deleteConfirm'))) {
                alert(t('settings.deleteFeature'))
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
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  )
}
