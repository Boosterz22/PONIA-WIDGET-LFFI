import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Package, AlertTriangle, DollarSign, Activity, Calendar } from 'lucide-react'
import Navigation from '../components/Navigation'
import ChatAI from '../components/ChatAI'
import { supabase } from '../services/supabase'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [stockHistory, setStockHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, timeRange])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }
    setUser(session.user)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const token = session.access_token

      const [productsRes, historyRes] = await Promise.all([
        fetch('/api/products', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetch('/api/stock-history', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        })
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data.products || [])
      }

      if (historyRes.ok) {
        const data = await historyRes.json()
        setStockHistory(data.history || [])
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockTrendData = () => {
    const days = timeRange === '7d' ? 7 : 30
    const now = new Date()
    const dateMap = {}

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split('T')[0]
      dateMap[key] = { date: key, total: 0, count: 0 }
    }

    stockHistory.forEach(entry => {
      const key = entry.date?.split('T')[0]
      if (dateMap[key]) {
        dateMap[key].total += entry.newQuantity || 0
        dateMap[key].count += 1
      }
    })

    return Object.values(dateMap).map(item => ({
      date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      moyenne: item.count > 0 ? Math.round(item.total / item.count) : 0
    }))
  }

  const getTopCriticalProducts = () => {
    return products
      .filter(p => p.quantity <= p.alertThreshold)
      .sort((a, b) => (a.quantity / a.alertThreshold) - (b.quantity / b.alertThreshold))
      .slice(0, 5)
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        stock: p.quantity,
        seuil: p.alertThreshold,
        ratio: Math.round((p.quantity / p.alertThreshold) * 100)
      }))
  }

  const getStockDistribution = () => {
    const green = products.filter(p => p.quantity > p.alertThreshold * 1.5).length
    const orange = products.filter(p => p.quantity > p.alertThreshold && p.quantity <= p.alertThreshold * 1.5).length
    const red = products.filter(p => p.quantity <= p.alertThreshold).length

    return [
      { name: 'Stock sain', value: green, color: '#10B981' },
      { name: 'Attention', value: orange, color: '#F59E0B' },
      { name: 'Critique', value: red, color: '#EF4444' }
    ]
  }

  const calculateMetrics = () => {
    const totalProducts = products.length
    const criticalProducts = products.filter(p => p.quantity <= p.alertThreshold).length
    const totalStockValue = products.reduce((sum, p) => sum + p.quantity, 0)
    const avgRotation = stockHistory.length > 0 ? Math.round(stockHistory.length / totalProducts) : 0

    return {
      totalProducts,
      criticalProducts,
      totalStockValue,
      avgRotation,
      healthScore: totalProducts > 0 ? Math.round(((totalProducts - criticalProducts) / totalProducts) * 100) : 100
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
        <Navigation />
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  const metrics = calculateMetrics()
  const trendData = getStockTrendData()
  const topCritical = getTopCriticalProducts()
  const distribution = getStockDistribution()

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '8rem' }}>
      <Navigation />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={32} />
              Analytics Avancées
            </h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
              Vue d'ensemble de vos performances et tendances
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setTimeRange('7d')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                background: timeRange === '7d' ? '#FFD700' : '#fff',
                color: timeRange === '7d' ? '#000' : '#6B7280',
                border: '1px solid #e5e7eb',
                fontWeight: timeRange === '7d' ? '600' : '400'
              }}
            >
              7 jours
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                background: timeRange === '30d' ? '#FFD700' : '#fff',
                color: timeRange === '30d' ? '#000' : '#6B7280',
                border: '1px solid #e5e7eb',
                fontWeight: timeRange === '30d' ? '600' : '400'
              }}
            >
              30 jours
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Package size={20} style={{ color: '#6B7280' }} />
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>
                {metrics.healthScore}% sain
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {metrics.totalProducts}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Produits totaux
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} style={{ color: '#EF4444' }} />
              <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: '600' }}>
                Alerte
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {metrics.criticalProducts}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Produits critiques
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <DollarSign size={20} style={{ color: '#6B7280' }} />
              <TrendingUp size={16} style={{ color: '#10B981' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {metrics.totalStockValue}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Unités en stock
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Calendar size={20} style={{ color: '#6B7280' }} />
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>
                Moyenne
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {metrics.avgRotation}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Ajustements / produit
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              📈 Tendance du stock moyen
            </h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" style={{ fontSize: '0.75rem' }} stroke="#6B7280" />
                  <YAxis style={{ fontSize: '0.75rem' }} stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moyenne" 
                    stroke="#FFD700" 
                    strokeWidth={3}
                    dot={{ fill: '#FFD700', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                Pas assez de données d'historique
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              🎯 Top 5 produits critiques
            </h2>
            {topCritical.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topCritical} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" style={{ fontSize: '0.75rem' }} stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '0.75rem' }} stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }} 
                  />
                  <Bar dataKey="stock" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="seuil" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#10B981' }}>
                ✓ Aucun produit en alerte !
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              🎨 Distribution des stocks
            </h2>
            {distribution.some(d => d.value > 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {distribution.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{item.value}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>produits</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                Aucun produit enregistré
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              💡 Recommandations IA
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.criticalProducts > 0 && (
                <div style={{ padding: '0.75rem', background: '#FEF2F2', borderRadius: '6px', borderLeft: '3px solid #EF4444' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    ⚠️ Produits en alerte
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    {metrics.criticalProducts} produit{metrics.criticalProducts > 1 ? 's' : ''} nécessite{metrics.criticalProducts > 1 ? 'nt' : ''} un réapprovisionnement urgent
                  </div>
                </div>
              )}
              
              {metrics.healthScore >= 80 && (
                <div style={{ padding: '0.75rem', background: '#ECFDF5', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    ✓ Stock en bonne santé
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    {metrics.healthScore}% de vos produits sont au-dessus du seuil d'alerte
                  </div>
                </div>
              )}

              {stockHistory.length < 5 && (
                <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    📊 Collecte de données
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Continuez à mettre à jour vos stocks pour des prédictions plus précises
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatAI products={products} />
    </div>
  )
}
