import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import CompleteProfilePage from './pages/CompleteProfilePage'
import DashboardPage from './pages/DashboardPage'
import StockPage from './pages/StockPage'
import InsightsPage from './pages/InsightsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ReferralPage from './pages/ReferralPage'
import UpgradePage from './pages/UpgradePage'
import AdminPage from './pages/AdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import PricingPage from './pages/PricingPage'
import { supabase } from './services/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      
      if (session) {
        try {
          const userRes = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })
          if (!userRes.ok) throw new Error('Failed to fetch user')
          
          const { user } = await userRes.json()
          
          if (!user || !user.businessName) {
            setNeedsProfile(true)
          } else {
            setNeedsProfile(false)
            localStorage.setItem('ponia_business_type', user.businessType || 'default')
            localStorage.setItem('ponia_user_plan', user.plan || 'basique')
            localStorage.setItem('ponia_referral_code', user.referralCode || '')
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          setNeedsProfile(true)
        }
      }
      
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      
      if (session) {
        try {
          const userRes = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })
          if (!userRes.ok) throw new Error('Failed to fetch user')
          
          const { user } = await userRes.json()
          
          if (!user || !user.businessName) {
            setNeedsProfile(true)
          } else {
            setNeedsProfile(false)
            localStorage.setItem('ponia_business_type', user.businessType || 'default')
            localStorage.setItem('ponia_user_plan', user.plan || 'basique')
            localStorage.setItem('ponia_referral_code', user.referralCode || '')
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          setNeedsProfile(true)
        }
      } else {
        setNeedsProfile(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <Navigate to="/dashboard" />) : <LandingPage />} 
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route 
          path="/login" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <Navigate to="/dashboard" />) : <LoginPage />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route 
          path="/complete-profile" 
          element={session && needsProfile ? <CompleteProfilePage session={session} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <DashboardPage session={session} />) : <Navigate to="/login" />} 
        />
        <Route 
          path="/stock" 
          element={session ? <StockPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/insights" 
          element={session ? <InsightsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={session ? <AnalyticsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/history" 
          element={session ? <HistoryPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={session ? <ProfilePage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={session ? <SettingsPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/referral" 
          element={session ? <ReferralPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/upgrade" 
          element={session ? <UpgradePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={session ? <AdminPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
