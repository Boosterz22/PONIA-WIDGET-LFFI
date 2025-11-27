import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Link2, Check, X, Search, RefreshCw, Plus, AlertCircle } from 'lucide-react'
import Navigation from '../components/Navigation'
import { supabase } from '../services/supabase'

export default function ProductMappingPage({ session }) {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  const [connection, setConnection] = useState(null)
  const [mappings, setMappings] = useState([])
  const [poniaProducts, setPoniaProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadData()
  }, [connectionId])

  const loadData = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      const response = await fetch(`/api/integrations/mappings/${connectionId}`, {
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setMappings(data.mappings || [])
        setPoniaProducts(data.poniaProducts || [])
      }

      const connResponse = await fetch('/api/integrations/connections', {
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      if (connResponse.ok) {
        const connData = await connResponse.json()
        const conn = connData.connections.find(c => c.id === parseInt(connectionId))
        setConnection(conn)
      }
    } catch (err) {
      console.error('Error loading mappings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      await fetch(`/api/integrations/sync/${connectionId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      })

      await loadData()
    } catch (err) {
      console.error('Error syncing:', err)
    } finally {
      setSyncing(false)
    }
  }

  const handleMapProduct = async (mappingId, poniaProductId) => {
    setSaving(mappingId)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return

      await fetch(`/api/integrations/mappings/${mappingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ poniaProductId })
      })

      setMappings(prev => prev.map(m => 
        m.id === mappingId 
          ? { ...m, poniaProductId, isMapped: !!poniaProductId }
          : m
      ))
    } catch (err) {
      console.error('Error mapping product:', err)
    } finally {
      setSaving(null)
    }
  }

  const filteredMappings = mappings.filter(m => {
    const matchesSearch = m.posProductName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'mapped' && m.isMapped) || 
      (filter === 'unmapped' && !m.isMapped)
    return matchesSearch && matchesFilter
  })

  const mappedCount = mappings.filter(m => m.isMapped).length
  const unmappedCount = mappings.filter(m => !m.isMapped).length

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
        <Navigation />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <RefreshCw size={24} className="spinning" style={{ color: '#6B7280' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Navigation />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <button
          onClick={() => navigate('/integrations')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            color: '#374151',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={16} />
          Retour aux intégrations
        </button>

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
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                Mapping Produits - {connection?.providerName}
              </h1>
              <p style={{ opacity: 0.8, margin: 0, marginTop: '0.25rem' }}>
                Associez les produits de votre caisse à vos produits PONIA
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
              <Check size={20} color="#10B981" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{mappedCount}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Produits mappés</div>
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
              <AlertCircle size={20} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{unmappedCount}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Non mappés</div>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={18} className={syncing ? 'spinning' : ''} />
              {syncing ? 'Synchronisation...' : 'Synchroniser'}
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              flex: 1, 
              minWidth: '200px',
              position: 'relative'
            }}>
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { value: 'all', label: `Tous (${mappings.length})` },
                { value: 'mapped', label: `Mappés (${mappedCount})` },
                { value: 'unmapped', label: `Non mappés (${unmappedCount})` }
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: filter === f.value ? '#111827' : 'white',
                    color: filter === f.value ? 'white' : '#6B7280',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMappings.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid #E5E7EB'
          }}>
            <AlertCircle size={48} style={{ color: '#9CA3AF', marginBottom: '1rem' }} />
            <h3 style={{ margin: 0, color: '#374151' }}>Aucun produit trouvé</h3>
            <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
              {searchTerm ? 'Essayez une autre recherche' : 'Cliquez sur "Synchroniser" pour importer les produits de votre caisse'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredMappings.map(mapping => (
              <div key={mapping.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                border: mapping.isMapped ? '2px solid #10B981' : '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    {mapping.isMapped ? (
                      <Check size={16} color="#10B981" />
                    ) : (
                      <AlertCircle size={16} color="#F59E0B" />
                    )}
                    <span style={{ fontWeight: '600', color: '#111827' }}>
                      {mapping.posProductName}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6B7280',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    {mapping.posProductSku && <span>SKU: {mapping.posProductSku}</span>}
                    {mapping.posProductPrice && <span>{parseFloat(mapping.posProductPrice).toFixed(2)} €</span>}
                    {mapping.posProductCategory && <span>{mapping.posProductCategory}</span>}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: '250px'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>→</span>
                  <select
                    value={mapping.poniaProductId || ''}
                    onChange={(e) => handleMapProduct(mapping.id, e.target.value ? parseInt(e.target.value) : null)}
                    disabled={saving === mapping.id}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      background: 'white',
                      cursor: saving === mapping.id ? 'wait' : 'pointer'
                    }}
                  >
                    <option value="">-- Sélectionner un produit PONIA --</option>
                    {poniaProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({parseFloat(product.currentQuantity).toFixed(1)} {product.unit})
                      </option>
                    ))}
                  </select>

                  {saving === mapping.id && (
                    <RefreshCw size={16} className="spinning" style={{ color: '#6B7280' }} />
                  )}

                  {mapping.poniaProductId && (
                    <button
                      onClick={() => handleMapProduct(mapping.id, null)}
                      style={{
                        padding: '0.5rem',
                        background: '#FEE2E2',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Supprimer le mapping"
                    >
                      <X size={14} color="#DC2626" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {poniaProducts.length === 0 && mappings.length > 0 && (
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} color="#D97706" />
            <div>
              <strong style={{ color: '#92400E' }}>Aucun produit PONIA</strong>
              <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem', color: '#B45309' }}>
                Créez d'abord des produits dans PONIA pour pouvoir les mapper avec ceux de votre caisse.
              </p>
            </div>
            <button
              onClick={() => navigate('/stock')}
              style={{
                marginLeft: 'auto',
                padding: '0.5rem 1rem',
                background: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={16} />
              Créer des produits
            </button>
          </div>
        )}
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
