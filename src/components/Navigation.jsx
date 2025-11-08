import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Brain, History, Settings } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/stock', icon: Package, label: 'Stocks' },
    { path: '/insights', icon: Brain, label: 'Insights IA' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/settings', icon: Settings, label: 'Paramètres' }
  ]

  const isActive = (path) => location.pathname === path

  return (
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
        gap: '0.5rem',
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
              padding: '1rem 1.25rem',
              textDecoration: 'none',
              color: isActive(path) ? '#000000' : '#6B7280',
              fontWeight: isActive(path) ? '600' : '500',
              fontSize: '0.9rem',
              borderBottom: isActive(path) ? '2px solid #000000' : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <Icon size={18} />
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
