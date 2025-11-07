import { Calendar, Users, TrendingUp } from 'lucide-react'

export default function EventsWidget() {
  const mockEvents = [
    {
      id: 1,
      name: 'Festival de Jazz',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      impact: 'high',
      expectedVisitors: '+40%',
      stockAdvice: 'Augmentez vos stocks de boissons et snacks'
    },
    {
      id: 2,
      name: 'Marathon de Paris',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      impact: 'medium',
      expectedVisitors: '+25%',
      stockAdvice: 'Prévoyez plus de produits énergétiques'
    }
  ]

  const formatDate = (date) => {
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Demain'
    return `Dans ${days}j`
  }

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Calendar size={20} style={{ color: '#F59E0B' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
          Événements à venir
        </h3>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '1rem', padding: '0.5rem', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
        <strong>🔜 Bientôt disponible</strong> - Intégration Google Calendar pour anticipar automatiquement les événements locaux
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mockEvents.map(event => (
          <div
            key={event.id}
            style={{
              padding: '0.75rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              borderLeft: `3px solid ${event.impact === 'high' ? '#EF4444' : '#F59E0B'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>
                {event.name}
              </p>
              <span style={{
                background: event.impact === 'high' ? '#FEE2E2' : '#FEF3C7',
                color: event.impact === 'high' ? '#DC2626' : '#D97706',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                {formatDate(event.date)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Users size={14} style={{ color: '#6B7280' }} />
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {event.expectedVisitors} de fréquentation prévue
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={14} style={{ color: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '500' }}>
                {event.stockAdvice}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
