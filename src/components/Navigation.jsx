import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Brain, Activity, History, Settings, User, LogOut, Gift, Mail } from 'lucide-react'
import { supabase } from '../services/supabase'

const businessTypeLabels = {
  'bakery': 'Boulangerie / Pâtisserie',
  'restaurant': 'Restaurant',
  'bar': 'Bar / Café',
  'wine': 'Cave à vin',
  'grocery': 'Épicerie',
  'butcher': 'Boucherie',
  'fish': 'Poissonnerie',
  'cheese': 'Fromagerie',
  'hotel': 'Hôtel / Restauration',
  'default': 'Mon Commerce'
}

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const businessName = businessTypeLabels[businessType] || businessTypeLabels.default
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/stock', icon: Package, label: 'Stocks' },
    { path: '/insights', icon: Brain, label: 'Insights IA' },
    { path: '/analytics', icon: Activity, label: 'Analytics' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/settings', icon: Settings, label: 'Paramètres' }
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .business-name { display: none; }
        }
      `}</style>
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 1rem',
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
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              padding: '0.75rem 0',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: '#111827',
              whiteSpace: 'nowrap'
            }}>
              <span className="business-name">{businessName}</span>
              <span style={{ display: 'none' }} className="business-icon">📦</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 0.75rem',
                    textDecoration: 'none',
                    color: isActive(path) ? '#000000' : '#6B7280',
                    fontWeight: isActive(path) ? '600' : '500',
                    fontSize: '0.875rem',
                    borderBottom: isActive(path) ? '2px solid #000000' : '2px solid transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={18} />
                  <span className="nav-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>

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
                  <span>Mon Profil</span>
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
                  <span>Parrainage</span>
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
                  <span>Paramètres</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    window.location.href = 'mailto:contact@ponia.ai'
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
                  <span>Contact</span>
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
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
