import React from 'react'
import { Linkedin, Twitter } from 'lucide-react'
import poniaLogo from '../assets/ponia-logo.png'

export default function Footer() {
  return (
    <footer style={{
      background: '#111827',
      color: '#9CA3AF',
      padding: '2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Logo et infos entreprise */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <img 
              src={poniaLogo} 
              alt="PONIA AI" 
              style={{ 
                height: '32px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)'
              }} 
            />
            <div style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}>PONIA AI - Gestion de stock intelligente</p>
              <p style={{ margin: 0 }}>Enock Ligue - Fondateur</p>
              <p style={{ margin: 0, color: '#6B7280' }}>SIRET : 99445226600012</p>
            </div>
          </div>

          {/* Liens et réseaux sociaux */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <a
                href="https://www.linkedin.com/in/enock-ligue-238230396"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: '#1F2937',
                  borderRadius: '8px',
                  color: '#9CA3AF',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0077B5'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1F2937'
                  e.currentTarget.style.color = '#9CA3AF'
                }}
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/ponia_hq"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: '#1F2937',
                  borderRadius: '8px',
                  color: '#9CA3AF',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000000'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1F2937'
                  e.currentTarget.style.color = '#9CA3AF'
                }}
                title="X (Twitter)"
              >
                <Twitter size={18} />
              </a>
            </div>
            <a
              href="mailto:support@myponia.fr"
              style={{
                fontSize: '0.8125rem',
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFD700'}
              onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
            >
              support@myponia.fr
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #374151',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6B7280'
        }}>
          © {new Date().getFullYear()} PONIA AI. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
