import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '../services/supabase'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [userId, setUserId] = useState(null)
  const [history, setHistory] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
      } else {
        setSession(session)
        fetchUserData(session.user.id)
      }
    })
  }, [navigate])

  const fetchUserData = async (supabaseId) => {
    try {
      const userRes = await fetch(`/api/users/supabase/${supabaseId}`)
      const userData = await userRes.json()
      
      if (userData && userData.id) {
        setUserId(userData.id)
        await fetchHistory(userData.id)
        await fetchProducts(userData.id)
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async (uid) => {
    try {
      const response = await fetch(`/api/stock-history/${uid}`)
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    }
  }

  const fetchProducts = async (uid) => {
    try {
      const response = await fetch(`/api/products/${uid}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    }
  }

  const filteredHistory = selectedProduct === 'all'
    ? history
    : history.filter(h => h.productId === parseInt(selectedProduct))

  const chartData = filteredHistory
    .slice(0, 30)
    .reverse()
    .map(h => ({
      date: new Date(h.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      quantité: parseFloat(h.quantityAfter),
      changement: parseFloat(h.quantityChange),
      produit: h.productName || 'Produit'
    }))

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement...</p>
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
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
          <Link to="/">
            <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '36px' }} />
          </Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={32} style={{ color: '#F59E0B' }} />
              Historique des mouvements
            </h1>
            <p style={{ color: '#6B7280' }}>
              Suivez l'évolution de vos stocks au fil du temps
            </p>
          </div>
          
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tous les produits</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Calendar size={48} style={{ color: '#D1D5DB', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Aucun mouvement enregistré
            </h3>
            <p style={{ color: '#6B7280' }}>
              Les changements de stock apparaîtront ici
            </p>
          </div>
        ) : (
          <>
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Évolution des quantités
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      padding: '0.75rem'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="quantité" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Mouvements récents
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredHistory.slice(0, 20).map((item) => {
                  const change = parseFloat(item.quantityChange)
                  const isIncrease = change > 0
                  
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${isIncrease ? '#10B981' : '#EF4444'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: isIncrease ? '#D1FAE5' : '#FEE2E2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isIncrease ? (
                            <TrendingUp size={20} style={{ color: '#10B981' }} />
                          ) : (
                            <TrendingDown size={20} style={{ color: '#EF4444' }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            {item.productName || 'Produit'}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {new Date(item.createdAt).toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: isIncrease ? '#10B981' : '#EF4444',
                          marginBottom: '0.25rem'
                        }}>
                          {isIncrease ? '+' : ''}{change}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                          → {item.quantityAfter}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
