import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find(l => l.code === language) || languages[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.2s'
        }}
      >
        <Globe size={18} />
        <span>{currentLang.flag}</span>
        <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
          {currentLang.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            minWidth: '200px',
            zIndex: 999,
            overflow: 'hidden'
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: language === lang.code ? '#FEF3C7' : 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: language === lang.code ? '#92400E' : '#374151',
                  fontWeight: language === lang.code ? '600' : '400',
                  transition: 'background 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (language !== lang.code) {
                    e.target.style.background = '#F9FAFB'
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== lang.code) {
                    e.target.style.background = 'white'
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
