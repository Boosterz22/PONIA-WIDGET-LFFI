import { useState, useEffect } from 'react'
import { Link2, Check, X, RefreshCw, ExternalLink, Zap, Store, AlertCircle, ChevronRight, Clock, Settings, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const POS_PROVIDERS = [
  { id: 'tiller', name: 'Tiller (SumUp)', logo: '💳', country: '🇫🇷🇪🇸', popular: true, category: 'all' },
  { id: 'zettle', name: 'Zettle (PayPal)', logo: '💰', country: '🌍', popular: true, category: 'all' },
  { id: 'square', name: 'Square', logo: '⬛', country: '🌍', popular: true, category: 'all' },
  { id: 'zelty', name: 'Zelty', logo: '🍽️', country: '🇫🇷', popular: true, category: 'restaurant' },
  { id: 'laddition', name: "L'Addition", logo: '📝', country: '🇫🇷', popular: true, category: 'restaurant' },
  { id: 'lightspeed', name: 'Lightspeed', logo: '⚡', country: '🇫🇷', popular: true, category: 'all' },
  { id: 'innovorder', name: 'Innovorder', logo: '🍔', country: '🇫🇷', popular: false, category: 'restaurant' },
  { id: 'hiboutik', name: 'Hiboutik', logo: '🦉', country: '🇫🇷', popular: false, category: 'retail' },
  { id: 'cashmag', name: 'Cashmag', logo: '🧲', country: '🇫🇷', popular: false, category: 'bakery' },
  { id: 'cashpad', name: 'Cashpad', logo: '📱', country: '🇫🇷', popular: false, category: 'restaurant' },
  { id: 'clyo', name: 'Clyo Systems', logo: '🔷', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'synapsy', name: 'Synapsy', logo: '🥖', country: '🇫🇷', popular: false, category: 'bakery' },
  { id: 'popina', name: 'Popina', logo: '🍕', country: '🇫🇷', popular: false, category: 'restaurant' },
  { id: 'jalia', name: 'Jalia JDC', logo: '🏪', country: '🇫🇷', popular: false, category: 'retail' },
  { id: 'apitic', name: 'Apitic', logo: '📊', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'trivec', name: 'Trivec', logo: '🇪🇺', country: '🇪🇺', popular: false, category: 'restaurant' },
  { id: 'odoo', name: 'Odoo POS', logo: '🟣', country: '🇫🇷🇧🇪', popular: false, category: 'all' },
  { id: 'restomax', name: 'Restomax', logo: '🍴', country: '🇫🇷🇧🇪', popular: false, category: 'restaurant' },
  { id: 'hellocash', name: 'HelloCash', logo: '👋', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'connectill', name: 'Connectill', logo: '🔗', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'fulleapps', name: 'Fülleapps', logo: '📲', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'addictill', name: 'Addictill', logo: '➕', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'abill', name: 'Abill', logo: '🧾', country: '🇫🇷', popular: false, category: 'all' },
  { id: 'planity', name: 'Planity', logo: '💇', country: '🇫🇷', popular: false, category: 'beauty' },
  { id: 'lastapp', name: 'LastApp', logo: '🇪🇸', country: '🇪🇸', popular: false, category: 'restaurant' },
]

export default function IntegrationsPage({ session }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(null)
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(null)
  const [error, setError] = useState(null)
  const [showAllProviders, setShowAllProviders] = useState(false)

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/integrations/connections', {
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
      }
    } catch (err) {
      console.error('Error loading connections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (provider) => {
    setConnecting(provider.id)
    setError(null)
    
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          provider: provider.id,
          providerName: provider.name
        })
      })

      const data = await response.json()

      if (response.ok && data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=700')
      } else if (response.ok && data.connection) {
        await loadConnections()
      } else {
        setError(data.error || 'Erreur de connexion')
      }
    } catch (err) {
      setError('Erreur de connexion à la caisse')
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (connectionId) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch(`/api/integrations/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      if (response.ok) {
        await loadConnections()
      }
    } catch (err) {
      console.error('Error disconnecting:', err)
    }
  }

  const handleSync = async (connectionId) => {
    setSyncing(connectionId)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch(`/api/integrations/sync/${connectionId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      if (response.ok) {
        await loadConnections()
      }
    } catch (err) {
      console.error('Error syncing:', err)
    } finally {
      setSyncing(null)
    }
  }

  const getConnectionStatus = (providerId) => {
    return connections.find(c => c.provider === providerId)
  }

  const filteredProviders = POS_PROVIDERS.filter(p => {
    if (filter === 'all') return true
    if (filter === 'popular') return p.popular
    return p.category === filter
  })

  const displayProviders = showAllProviders ? filteredProviders : filteredProviders.slice(0, 8)

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Navigation />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Link2 size={28} color="#1a1a2e" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>
                Intégrations Caisse
              </h1>
              <p style={{ opacity: 0.8, margin: 0, marginTop: '0.25rem' }}>
                Connectez votre caisse pour synchroniser automatiquement vos ventes et stocks
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1rem 1.5rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Zap size={20} color="#FFD700" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>27</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Caisses disponibles</div>
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1rem 1.5rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Check size={20} color="#10B981" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                  {connections.filter(c => c.status === 'active').length}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Connectées</div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1rem 1.5rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Clock size={20} color="#60A5FA" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Auto</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Sync temps réel</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#DC2626'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} color="#DC2626" />
            </button>
          </div>
        )}

        {connections.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Vos connexions actives
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {connections.map(connection => {
                const provider = POS_PROVIDERS.find(p => p.id === connection.provider)
                return (
                  <div key={connection.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '2px solid #10B981',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '2rem' }}>{provider?.logo || '📦'}</span>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{connection.providerName}</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#10B981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Check size={12} /> Connecté
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        background: '#D1FAE5', 
                        color: '#059669',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Actif
                      </div>
                    </div>

                    {connection.lastSyncAt && (
                      <div style={{ 
                        marginTop: '1rem', 
                        fontSize: '0.75rem', 
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Clock size={12} />
                        Dernière sync: {new Date(connection.lastSyncAt).toLocaleString('fr-FR')}
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #E5E7EB'
                    }}>
                      <button
                        onClick={() => handleSync(connection.id)}
                        disabled={syncing === connection.id}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#F3F4F6',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: '500'
                        }}
                      >
                        <RefreshCw size={16} className={syncing === connection.id ? 'spinning' : ''} />
                        {syncing === connection.id ? 'Sync...' : 'Sync'}
                      </button>
                      <button
                        onClick={() => navigate(`/integrations/mapping/${connection.id}`)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: 'white',
                          fontWeight: '500'
                        }}
                      >
                        Mapper
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => handleDisconnect(connection.id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#DC2626'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            Connecter une caisse
          </h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'popular', 'restaurant', 'bakery', 'retail'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  background: filter === f ? '#111827' : 'white',
                  color: filter === f ? 'white' : '#6B7280',
                  border: '1px solid #E5E7EB',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'all' && 'Toutes'}
                {f === 'popular' && '⭐ Populaires'}
                {f === 'restaurant' && '🍽️ Restaurants'}
                {f === 'bakery' && '🥖 Boulangeries'}
                {f === 'retail' && '🏪 Commerce'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {displayProviders.map(provider => {
            const connection = getConnectionStatus(provider.id)
            const isConnected = connection?.status === 'active'
            const isConnecting = connecting === provider.id

            return (
              <div key={provider.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                border: isConnected ? '2px solid #10B981' : '1px solid #E5E7EB',
                transition: 'all 0.2s',
                opacity: isConnected ? 0.6 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{provider.logo}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{provider.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {provider.country}
                        {provider.popular && <span style={{ marginLeft: '0.5rem', color: '#F59E0B' }}>⭐ Populaire</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => !isConnected && handleConnect(provider)}
                  disabled={isConnected || isConnecting}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: isConnected ? '#D1FAE5' : isConnecting ? '#F3F4F6' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    color: isConnected ? '#059669' : isConnecting ? '#6B7280' : 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isConnected ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  {isConnected ? (
                    <>
                      <Check size={18} />
                      Connecté
                    </>
                  ) : isConnecting ? (
                    <>
                      <RefreshCw size={18} className="spinning" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Link2 size={18} />
                      Connecter
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {filteredProviders.length > 8 && !showAllProviders && (
          <button
            onClick={() => setShowAllProviders(true)}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#6B7280',
              fontWeight: '500',
              marginBottom: '2rem'
            }}
          >
            Voir les {filteredProviders.length - 8} autres caisses
            <ChevronRight size={18} />
          </button>
        )}

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Comment ça marche ?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#EEF2FF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontWeight: '700', color: '#4F46E5' }}>1</span>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>Connectez</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Cliquez sur votre caisse et autorisez PONIA</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#EEF2FF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontWeight: '700', color: '#4F46E5' }}>2</span>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>Mappez</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Associez les produits de votre caisse</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#EEF2FF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontWeight: '700', color: '#4F46E5' }}>3</span>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>Automatique</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Vos stocks se mettent à jour tout seuls !</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
