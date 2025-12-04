import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import VerifyCodePage from './pages/VerifyCodePage'
import CompleteProfilePage from './pages/CompleteProfilePage'
import OnboardingPage from './pages/OnboardingPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import StockPage from './pages/StockPage'
import InsightsPage from './pages/InsightsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AlertSettingsPage from './pages/AlertSettingsPage'
import ReferralPage from './pages/ReferralPage'
import UpgradePage from './pages/UpgradePage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import PricingPage from './pages/PricingPage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'
import ConfidentialitePage from './pages/ConfidentialitePage'
import IntegrationsPage from './pages/IntegrationsPage'
import ProductMappingPage from './pages/ProductMappingPage'
import { supabase } from './services/supabase'
import { LanguageProvider } from './contexts/LanguageContext'

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
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
        <Route 
          path="/" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <Navigate to="/chat" />) : <LandingPage />} 
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
        <Route 
          path="/login" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <Navigate to="/chat" />) : <LoginPage />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route 
          path="/complete-profile" 
          element={session && needsProfile ? <CompleteProfilePage session={session} /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/onboarding" 
          element={session ? <OnboardingPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={session ? (needsProfile ? <Navigate to="/complete-profile" /> : <ChatPage session={session} />) : <Navigate to="/login" />} 
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
          path="/settings/alerts" 
          element={session ? <AlertSettingsPage session={session} /> : <Navigate to="/login" />} 
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
          path="/integrations" 
          element={session ? <IntegrationsPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/integrations/mapping/:connectionId" 
          element={session ? <ProductMappingPage session={session} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin-login" 
          element={<AdminLoginPage />} 
        />
        <Route 
          path="/admin" 
          element={session ? <AdminPage /> : <Navigate to="/admin-login" />} 
        />
      </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
