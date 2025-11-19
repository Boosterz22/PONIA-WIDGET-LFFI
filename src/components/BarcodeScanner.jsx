import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function BarcodeScanner({ onScan, onSkip }) {
  const { t } = useLanguage()
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scannerRef.current) return

    const scanner = new Html5QrcodeScanner(
      'barcode-reader',
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [0, 1] // Barcode formats including EAN-13
      },
      false
    )

    scanner.render(
      (decodedText) => {
        if (decodedText && decodedText.length >= 8) {
          scanner.clear()
          onScan(decodedText)
        }
      },
      (error) => {
        // Silent error handling - normal when no barcode in view
      }
    )

    setScanning(true)

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {})
      }
    }
  }, [onScan])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: '600',
          margin: 0
        }}>
          {t('onboarding.scanTitle')}
        </h2>
        <button
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Scanner */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div id="barcode-reader" ref={scannerRef}></div>
      </div>

      {/* Instructions */}
      <p style={{
        color: '#D1D5DB',
        fontSize: '0.875rem',
        textAlign: 'center',
        maxWidth: '400px',
        marginBottom: '1.5rem'
      }}>
        {t('onboarding.scanInstructions')}
      </p>

      {/* Skip button */}
      <button
        onClick={onSkip}
        style={{
          padding: '0.875rem 2rem',
          background: 'transparent',
          border: '2px solid white',
          borderRadius: '8px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'white'
          e.target.style.color = 'black'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent'
          e.target.style.color = 'white'
        }}
      >
        {t('onboarding.skipStep')}
      </button>
    </div>
  )
}
