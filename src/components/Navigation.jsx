import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Brain, Activity, History, Settings, User, LogOut, Gift, Mail, MessageSquare, Link2, Bell } from 'lucide-react'
import { supabase } from '../services/supabase'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../contexts/LanguageContext'
import SuggestionsDrawer from './SuggestionsDrawer'
import SuggestionsPopup from './SuggestionsPopup'
import { useSuggestions } from '../hooks/useSuggestions'


export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false)
  const menuRef = useRef(null)
  
  const {
    suggestions,
    unreadCount,
    hasCritical,
    loading: suggestionsLoading,
    showPopup,
    popupSuggestions,
    markViewed,
    dismiss,
    act,
    closePopup,
    postponePopup
  } = useSuggestions()
  
  const navItems = [
    { path: '/chat', icon: MessageSquare, label: t('nav.poniaAI') },
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/stock', icon: Package, label: t('nav.stock') },
    { path: '/insights', icon: Brain, label: t('nav.insights') },
    { path: '/analytics', icon: Activity, label: t('nav.analytics') },
    { path: '/history', icon: History, label: t('nav.history') }
  ]

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    loadUserBusinessName()
  }, [])

  const loadUserBusinessName = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBusinessName(data.user.businessName || '')
      }
    } catch (error) {
      console.error('Error loading business name:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-label { display: none; }
          .business-name { display: none; }
          .nav-right-items { gap: 0.5rem !important; }
          .nav-right-items > * { flex-shrink: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .nav-scrollable {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1;
          min-width: 0;
        }
        .nav-scrollable::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '0.75rem 0',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: '#111827',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              <span className="business-name">{businessName}</span>
              <span style={{ display: 'none' }} className="business-icon">📦</span>
            </div>
            
            <div className="nav-scrollable">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 0.6rem',
                    textDecoration: 'none',
                    color: isActive(path) ? '#000000' : '#6B7280',
                    fontWeight: isActive(path) ? '600' : '500',
                    fontSize: '0.875rem',
                    borderBottom: isActive(path) ? '2px solid #000000' : '2px solid transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <Icon size={18} />
                  <span className="nav-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-right-items" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <button
              onClick={() => setShowSuggestionsDrawer(true)}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label={t('nav.suggestionsAI')}
            >
              <Bell size={20} color={hasCritical ? '#dc2626' : '#6B7280'} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: hasCritical ? '#dc2626' : '#E5A835',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  animation: hasCritical ? 'pulse 1.5s infinite' : 'none'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <LanguageSelector />
            
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                  background: showUserMenu ? '#F3F4F6' : 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <User size={20} color="#111827" />
              </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '220px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/profile')
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <User size={16} />
                  <span>{t('nav.myProfile')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/integrations')
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Link2 size={16} />
                  <span>{t('nav.posIntegrations')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/referral')
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Gift size={16} />
                  <span>{t('nav.referral')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    window.location.href = 'mailto:support@myponia.fr'
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Mail size={16} />
                  <span>{t('nav.contact')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/settings')
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Settings size={16} />
                  <span>{t('nav.settings')}</span>
                </button>

                <div style={{ height: '1px', background: '#E5E7EB', margin: '0.5rem 0' }} />

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    handleLogout()
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#EF4444',
                    fontWeight: '500',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#FEE2E2'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <LogOut size={16} />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </nav>
      
      <SuggestionsDrawer
        isOpen={showSuggestionsDrawer}
        onClose={() => setShowSuggestionsDrawer(false)}
        suggestions={suggestions}
        onDismiss={dismiss}
        onAct={act}
        onView={markViewed}
        loading={suggestionsLoading}
      />
      
      {showPopup && popupSuggestions.length > 0 && (
        <SuggestionsPopup
          suggestions={popupSuggestions}
          onClose={closePopup}
          onPostpone={postponePopup}
          onDismiss={dismiss}
          onAct={act}
          onView={markViewed}
        />
      )}
    </>
  )
}
