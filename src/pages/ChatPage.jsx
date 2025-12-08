import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import TrialBanner from '../components/TrialBanner'
import TrialExpiredBlocker from '../components/TrialExpiredBlocker'
import ChatAICentral from '../components/ChatAICentral'
import { useTrialCheck } from '../hooks/useTrialCheck'
import { useData } from '../contexts/DataContext'

export default function ChatPage({ session }) {
  const navigate = useNavigate()
  const { products, userData, fetchProducts } = useData()
  const { trialExpired, loading: trialLoading } = useTrialCheck()
  
  const businessName = userData?.businessName || 'Mon Commerce'

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {trialExpired && <TrialExpiredBlocker />}
      <TrialBanner />
      <Navigation />
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatAICentral products={products} userName={businessName} />
      </div>
    </div>
  )
}
