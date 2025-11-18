import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import TrialBanner from '../components/TrialBanner'
import TrialExpiredBlocker from '../components/TrialExpiredBlocker'
import ChatAICentral from '../components/ChatAICentral'
import { useTrialCheck } from '../hooks/useTrialCheck'
import { supabase } from '../services/supabase'

export default function ChatPage({ session }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [businessName, setBusinessName] = useState('')
  const { trialExpired, loading: trialLoading } = useTrialCheck()

  useEffect(() => {
    loadProducts()
    loadUserData()
  }, [])

  const loadProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    } finally {
      setLoading(false)
    }
  }

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
        setBusinessName(data.user.businessName || 'Mon Commerce')
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    }
  }

  if (trialLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {trialExpired && <TrialExpiredBlocker />}
      <TrialBanner />
      <Navigation />
      
      <div className="container" style={{ 
        padding: '2rem 1rem', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingBottom: '100px' 
      }}>
        <ChatAICentral products={products} userName={businessName} />
      </div>
    </div>
  )
}
