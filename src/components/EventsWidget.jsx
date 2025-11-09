import { useState, useEffect } from 'react'
import { Calendar, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function EventsWidget() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Erreur chargement événements:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Demain'
    return `Dans ${days}j`
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.25rem' }}>
        <p style={{ margin: 0, color: '#6B7280' }}>Chargement événements...</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '1rem' : '0',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} style={{ color: '#F59E0B' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
            Événements à venir {events.length > 0 && `(${events.length})`}
          </h3>
        </div>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s'
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <>
          {events.length === 0 && (
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '1rem', padding: '0.5rem', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
              <strong>✅ Google Calendar connecté</strong> - Aucun événement prévu dans les 14 prochains jours
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.map(event => (
          <div
            key={event.id}
            style={{
              padding: '0.75rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              borderLeft: `3px solid ${event.impact.level === 'high' ? '#EF4444' : event.impact.level === 'medium' ? '#F59E0B' : '#10B981'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>
                {event.name}
              </p>
              <span style={{
                background: event.impact.level === 'high' ? '#FEE2E2' : event.impact.level === 'medium' ? '#FEF3C7' : '#D1FAE5',
                color: event.impact.level === 'high' ? '#DC2626' : event.impact.level === 'medium' ? '#D97706' : '#059669',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                {formatDate(event.start)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Users size={14} style={{ color: '#6B7280' }} />
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {event.impact.expectedVisitors} de fréquentation prévue
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={14} style={{ color: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '500' }}>
                {event.impact.stockAdvice}
              </span>
            </div>
          </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
