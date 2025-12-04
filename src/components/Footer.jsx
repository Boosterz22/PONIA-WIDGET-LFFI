import React from 'react'
import { Link } from 'react-router-dom'
import poniaLogo from '../assets/ponia-logo.png'

export default function Footer() {
  return (
    <footer style={{
      background: '#F9FAFB',
      borderTop: '1px solid #E5E7EB',
      padding: '1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src={poniaLogo} 
            alt="PONIA" 
            style={{ height: '24px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
            © {new Date().getFullYear()} PONIA
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link 
            to="/mentions-legales" 
            style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}
          >
            Mentions légales
          </Link>
          <Link 
            to="/confidentialite" 
            style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}
          >
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  )
}
