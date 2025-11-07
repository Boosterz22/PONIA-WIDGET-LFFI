import { useState, useEffect } from 'react'
import { Cloud, AlertTriangle, Info } from 'lucide-react'
import { getCurrentWeather, getWeatherImpact } from '../services/weatherService'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWeather()
  }, [])

  const loadWeather = async () => {
    const data = await getCurrentWeather()
    setWeather(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <p style={{ color: 'white', margin: 0 }}>Chargement météo...</p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="card" style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cloud size={24} style={{ color: 'white' }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Météo non disponible
            </p>
            <p style={{ color: 'white', margin: 0, fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
              Configurez votre clé API OpenWeatherMap
            </p>
          </div>
        </div>
      </div>
    )
  }

  const impact = getWeatherImpact(weather)
  const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div className="card" style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src={getIconUrl(weather.icon)} 
            alt={weather.description} 
            style={{ width: '40px', height: '40px', marginTop: '-8px', marginBottom: '-8px' }}
          />
          <div>
            <p style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              {weather.temp}°C
            </p>
            <p style={{ color: 'white', margin: 0, fontSize: '0.75rem', opacity: 0.8, textTransform: 'capitalize' }}>
              {weather.description}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'white', margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
            {weather.city}
          </p>
          <p style={{ color: 'white', margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>
            Ressenti {weather.feelsLike}°C
          </p>
        </div>
      </div>

      {impact.level !== 'normal' && (
        <div style={{
          background: impact.level === 'warning' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
          border: `1px solid ${impact.level === 'warning' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
          borderRadius: '6px',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem'
        }}>
          {impact.level === 'warning' ? (
            <AlertTriangle size={16} style={{ color: 'white' }} />
          ) : (
            <Info size={16} style={{ color: 'white' }} />
          )}
          <p style={{ color: 'white', margin: 0, fontSize: '0.75rem', lineHeight: '1.4' }}>
            <span>{impact.icon}</span> {impact.message}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.7rem' }}>Humidité</p>
          <p style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{weather.humidity}%</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.7rem' }}>Vent</p>
          <p style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  )
}
