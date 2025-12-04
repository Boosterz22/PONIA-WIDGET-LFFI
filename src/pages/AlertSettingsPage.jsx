import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Bell, Mail, Clock, Calendar, Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function AlertSettingsPage({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [sendingAlerts, setSendingAlerts] = useState(false)
  const [message, setMessage] = useState(null)
  
  const [preferences, setPreferences] = useState({
    emailAlertsEnabled: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    expiryDaysThreshold: 3,
    alertFrequency: 'daily',
    alertTime: '08:00'
  })

  const [logs, setLogs] = useState([])

  useEffect(() => {
    loadPreferences()
    loadLogs()
  }, [])

  const loadPreferences = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/alerts/preferences', {
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPreferences(prev => ({ ...prev, ...data.preferences }))
      }
    } catch (error) {
      console.error('Erreur chargement préférences:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/alerts/logs', {
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Erreur chargement logs:', error)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/alerts/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Préférences enregistrées avec succès' })
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setSaving(false)
    }
  }

  const sendTestEmail = async () => {
    setSendingTest(true)
    setMessage(null)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      })
      
      const data = await response.json()
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Email de test envoyé ! Vérifiez votre boîte mail.' })
        loadLogs()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      console.error('Erreur envoi test:', error)
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setSendingTest(false)
    }
  }

  const sendAlertsNow = async () => {
    setSendingAlerts(true)
    setMessage(null)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/alerts/send-now', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      })
      
      const data = await response.json()
      if (response.ok && data.success) {
        const results = data.results
        let text = 'Alertes envoyées : '
        if (results.lowStock?.sent) text += `${results.lowStock.productCount} produits en stock bas, `
        if (results.expiry?.sent) text += `${results.expiry.productCount} produits proches de péremption`
        if (!results.lowStock?.sent && !results.expiry?.sent) text = 'Aucune alerte à envoyer (tous vos stocks sont OK)'
        setMessage({ type: 'success', text })
        loadLogs()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      console.error('Erreur envoi alertes:', error)
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setSendingAlerts(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
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
            onClick={() => navigate('/settings')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
          <Link to="/">
            <img src="/ponia-icon.png" alt="PONIA" style={{ height: '36px' }} />
          </Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              Alertes Email
            </h1>
            <p style={{ color: '#6B7280' }}>
              Configurez vos notifications automatiques
            </p>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            color: message.type === 'success' ? '#166534' : '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {message.text}
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={20} />
            Préférences d'alertes
          </h2>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Activer les alertes email</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Recevoir des notifications par email</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailAlertsEnabled}
                onChange={(e) => setPreferences(prev => ({ ...prev, emailAlertsEnabled: e.target.checked }))}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>Alertes stock bas</div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Quand un produit passe sous le seuil d'alerte</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.lowStockAlerts}
                  onChange={(e) => setPreferences(prev => ({ ...prev, lowStockAlerts: e.target.checked }))}
                  disabled={!preferences.emailAlertsEnabled}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>Alertes date de péremption</div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Quand un produit approche de sa DLC</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.expiryAlerts}
                  onChange={(e) => setPreferences(prev => ({ ...prev, expiryAlerts: e.target.checked }))}
                  disabled={!preferences.emailAlertsEnabled}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Seuil d'alerte DLC</div>
                <select
                  value={preferences.expiryDaysThreshold}
                  onChange={(e) => setPreferences(prev => ({ ...prev, expiryDaysThreshold: parseInt(e.target.value) }))}
                  disabled={!preferences.emailAlertsEnabled || !preferences.expiryAlerts}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value={1}>1 jour avant</option>
                  <option value={2}>2 jours avant</option>
                  <option value={3}>3 jours avant</option>
                  <option value={5}>5 jours avant</option>
                  <option value={7}>7 jours avant</option>
                </select>
              </label>

              <label style={{ display: 'block' }}>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Fréquence d'envoi</div>
                <select
                  value={preferences.alertFrequency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, alertFrequency: e.target.value }))}
                  disabled={!preferences.emailAlertsEnabled}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </label>
            </div>
          </div>

          <button
            onClick={savePreferences}
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={20} />
            Actions
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={sendTestEmail}
              disabled={sendingTest}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {sendingTest ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
              {sendingTest ? 'Envoi en cours...' : 'Envoyer un email de test'}
            </button>

            <button
              onClick={sendAlertsNow}
              disabled={sendingAlerts}
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1F2937',
                fontWeight: '600'
              }}
            >
              {sendingAlerts ? <Loader2 className="animate-spin" size={18} /> : <Bell size={18} />}
              {sendingAlerts ? 'Envoi en cours...' : 'Envoyer mes alertes maintenant'}
            </button>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} />
              Historique des emails
            </h2>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {logs.slice(0, 10).map(log => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                      {log.emailType === 'low_stock' && 'Alerte stock bas'}
                      {log.emailType === 'expiry' && 'Alerte DLC'}
                      {log.emailType === 'test' && 'Email de test'}
                      {log.emailType === 'welcome' && 'Email de bienvenue'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {new Date(log.sentAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    background: log.status === 'sent' ? '#DCFCE7' : '#FEE2E2',
                    color: log.status === 'sent' ? '#166534' : '#991B1B'
                  }}>
                    {log.status === 'sent' ? 'Envoyé' : 'Erreur'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
