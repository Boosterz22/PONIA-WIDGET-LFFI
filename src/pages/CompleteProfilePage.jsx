import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function CompleteProfilePage({ session }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('boulangerie')
  const [posSystem, setPosSystem] = useState('non')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [referredByCode, setReferredByCode] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const refCode = searchParams.get('ref') || localStorage.getItem('ponia_referral_code_pending')
    if (refCode) {
      setReferredByCode(refCode.toUpperCase())
      localStorage.setItem('ponia_referral_code_pending', refCode.toUpperCase())
    }
  }, [searchParams])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchAddress = async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        setSuggestions(data.features)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erreur autocomplete adresse:', error)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleAddressChange = (value) => {
    setAddress(value)
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchAddress(value)
    }, 300)
  }

  const selectSuggestion = (suggestion) => {
    const props = suggestion.properties
    const coords = suggestion.geometry?.coordinates || []
    setAddress(props.name || props.label)
    setCity(props.city || '')
    setPostalCode(props.postcode || '')
    setLongitude(coords[0] || null)
    setLatitude(coords[1] || null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const generateReferralCode = (businessName, businessType) => {
    const name = businessName.split(' ')[0].toUpperCase().substring(0, 6)
    const type = businessType.substring(0, 4).toUpperCase()
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${name}-${type}${random}`
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const referralCode = generateReferralCode(businessName, businessType)

      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          supabaseId: session.user.id,
          email: session.user.email,
          businessName,
          businessType,
          posSystem,
          address: address.trim() || null,
          city: city.trim() || null,
          postalCode: postalCode.trim() || null,
          latitude: latitude,
          longitude: longitude,
          referralCode,
          referredBy: referredByCode.trim() || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du profil')
      }

      localStorage.setItem('ponia_business_type', businessType)
      localStorage.setItem('ponia_user_plan', 'basique')
      localStorage.setItem('ponia_referral_code', referralCode)
      localStorage.setItem('ponia_referrals', JSON.stringify([]))
      localStorage.setItem('ponia_free_months', '0')
      localStorage.removeItem('ponia_referral_code_pending')

      window.location.href = '/onboarding'
    } catch (error) {
      console.error('Erreur configuration profil:', error)
      alert(error.message || 'Erreur lors de la configuration du profil. Veuillez réessayer.')
      setLoading(false)
    }
  }

  const businessTypes = [
    { value: 'boulangerie', label: 'Boulangerie / Pâtisserie' },
    { value: 'restaurant', label: 'Restaurant / Traiteur' },
    { value: 'bar', label: 'Bar / Café' },
    { value: 'cave', label: 'Cave à vin' },
    { value: 'tabac', label: 'Tabac / Presse' },
    { value: 'boucherie', label: 'Boucherie / Charcuterie' },
    { value: 'fromagerie', label: 'Fromagerie' },
    { value: 'epicerie', label: 'Épicerie / Superette' },
    { value: 'autre', label: 'Autre commerce' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link to="/" style={{ 
          display: 'inline-block',
          marginBottom: '3rem'
        }}>
          <img src="/ponia-icon-black.png" alt="PONIA" style={{ height: '70px', width: 'auto' }} />
        </Link>

        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 600,
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
          color: '#000'
        }}>
          Complétez votre profil
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.9375rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Dernière étape : parlez-nous de votre commerce pour personnaliser votre expérience PONIA.
        </p>

        <form onSubmit={handleComplete}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Nom du commerce
            </label>
            <input
              type="text"
              placeholder="Ex: Boulangerie Dupont"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Type de commerce
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem',
                cursor: 'pointer'
              }}
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Système de caisse (optionnel)
            </label>
            <select
              value={posSystem}
              onChange={(e) => setPosSystem(e.target.value)}
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem',
                cursor: 'pointer'
              }}
            >
              <option value="non">Je n'utilise pas de caisse digitale</option>
              <option value="zelty">Zelty</option>
              <option value="tiller">Tiller</option>
              <option value="cashpad">Cashpad</option>
              <option value="lightspeed">Lightspeed</option>
              <option value="square">Square</option>
              <option value="innovorder">Innovorder</option>
              <option value="sunday">Sunday</option>
              <option value="sumup">SumUp</option>
              <option value="autre">Autre système</option>
            </select>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              lineHeight: 1.5
            }}>
              Cette information nous aide à prioriser les futures intégrations
            </p>
          </div>

          <div style={{ marginBottom: '1.25rem', position: 'relative' }} ref={suggestionsRef}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Adresse du commerce
            </label>
            <input
              type="text"
              placeholder="Ex: 12 Rue de la Paix, Paris"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              required
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#111827' }}>
                      {suggestion.properties.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
                      {suggestion.properties.postcode} {suggestion.properties.city}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Ville
              </label>
              <input
                type="text"
                placeholder="Ex: Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="input"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Code postal
              </label>
              <input
                type="text"
                placeholder="75001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                required
                maxLength={5}
                className="input"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Code de parrainage (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex: BOULANG-BOUL12"
              value={referredByCode}
              onChange={(e) => setReferredByCode(e.target.value.toUpperCase())}
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              lineHeight: 1.5
            }}>
              Si un commerçant vous a recommandé PONIA, entrez son code de parrainage
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Configuration...' : 'Commencer à utiliser PONIA'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '0.8125rem',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: 0
          }}>
            Plan <strong style={{ color: '#000' }}>Basique gratuit</strong> jusqu'à 10 produits. 
            Passez à Standard (49€/mois) ou Pro (69€/mois) quand vous voulez.
          </p>
        </div>
      </div>
    </div>
  )
}
