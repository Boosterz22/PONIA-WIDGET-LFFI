import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowLeft } from 'lucide-react'
import Navigation from '../components/Navigation'
import WeatherWidget from '../components/WeatherWidget'
import EventsWidget from '../components/EventsWidget'
import ChatAI from '../components/ChatAI'
import { supabase } from '../services/supabase'

export default function InsightsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    checkAuth()
    loadProducts()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }
    setUser(session.user)
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    }
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Navigation />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Brain size={32} style={{ color: '#000000' }} />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Insights IA</h1>
          </div>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
            Analyse intelligente basée sur la météo, les événements locaux et vos données de stock
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <WeatherWidget />
          <EventsWidget />
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
            💬 Posez vos questions à l'IA
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6B7280', fontSize: '0.9rem' }}>
            L'IA analyse votre stock, la météo et les événements locaux pour vous donner des recommandations personnalisées.
          </p>
          
          <div style={{ 
            background: '#F9FAFB', 
            borderRadius: '8px', 
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '0.85rem' }}>
              💡 Exemples de questions :
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6B7280', fontSize: '0.85rem' }}>
              <li>Quels produits commander cette semaine ?</li>
              <li>Impact de la météo sur mes stocks ?</li>
              <li>Comment me préparer pour le prochain événement ?</li>
              <li>Analyse mes risques de rupture</li>
            </ul>
          </div>
        </div>
      </div>

      <ChatAI products={products} />
    </div>
  )
}
