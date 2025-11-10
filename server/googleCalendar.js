export async function getParisPublicEvents(maxResults = 10) {
  try {
    const now = new Date()
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(now.getDate() + 14)

    const minDate = now.toISOString().split('T')[0]
    const maxDate = twoWeeksFromNow.toISOString().split('T')[0]

    const url = `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=date_start:[${minDate} TO ${maxDate}]&rows=${maxResults}&sort=date_start&facet=tags`

    const response = await fetch(url)
    const data = await response.json()

    const events = (data.records || []).map(record => {
      const fields = record.fields
      const startDate = fields.date_start || now.toISOString()
      const endDate = fields.date_end || startDate

      const tagsArray = Array.isArray(fields.tags) ? fields.tags : (fields.tags ? [fields.tags] : [])

      return {
        id: record.recordid,
        name: fields.title || 'Événement Paris',
        description: fields.lead_text || fields.description || '',
        location: fields.address_name || fields.address_street || 'Paris',
        start: startDate,
        end: endDate,
        tags: tagsArray,
        priceType: fields.price_type || 'unknown',
        attendees: estimateAttendees(fields),
        impact: estimateEventImpact({
          summary: fields.title || '',
          tags: tagsArray.join(' '),
          priceType: fields.price_type || ''
        })
      }
    })

    return events
  } catch (error) {
    console.error('Erreur récupération événements Paris OpenData:', error)
    return []
  }
}

function estimateAttendees(fields) {
  const tagsArray = Array.isArray(fields.tags) ? fields.tags : []
  const tagsStr = tagsArray.join(' ').toLowerCase()
  const title = (fields.title || '').toLowerCase()
  
  if (tagsStr.includes('festival') || title.includes('festival')) return 5000
  if (tagsStr.includes('concert') || title.includes('concert')) return 1500
  if (tagsStr.includes('salon') || title.includes('salon')) return 3000
  if (tagsStr.includes('exposition') || title.includes('exposition')) return 800
  if (tagsStr.includes('marché') || title.includes('marché')) return 2000
  
  return 500
}

function estimateEventImpact(event) {
  const name = (event.summary || event.tags || '').toLowerCase()
  const attendees = event.attendees || 0
  
  const highImpactKeywords = ['festival', 'marathon', 'concert', 'match', 'salon', 'exposition', 'défilé', 'grande manifestation']
  const mediumImpactKeywords = ['conférence', 'spectacle', 'théâtre', 'séminaire', 'atelier', 'marché', 'brocante']
  
  if (attendees > 1000 || highImpactKeywords.some(kw => name.includes(kw))) {
    return { 
      level: 'high', 
      expectedVisitors: '+40%',
      stockAdvice: 'Augmentez fortement vos stocks (x1.5)',
      priority: 1
    }
  }
  
  if (attendees > 100 || mediumImpactKeywords.some(kw => name.includes(kw))) {
    return { 
      level: 'medium', 
      expectedVisitors: '+25%',
      stockAdvice: 'Augmentez modérément vos stocks (+30%)',
      priority: 2
    }
  }
  
  return { 
    level: 'low', 
    expectedVisitors: '+10%',
    stockAdvice: 'Légère augmentation conseillée',
    priority: 3
  }
}

export async function getLocalPublicEvents(city = 'Paris', businessType = 'commerce') {
  try {
    const normalizedCity = city.toLowerCase().trim()
    const parisRegionCities = [
      'paris', 'boulogne', 'neuilly', 'levallois', 'clichy', 'saint-denis', 
      'montreuil', 'vincennes', 'ivry', 'charenton', 'malakoff', 'vanves',
      'issy', 'montrouge', 'gentilly', 'kremlin', 'pantin', 'aubervilliers'
    ]
    
    const isParisRegion = parisRegionCities.some(pCity => normalizedCity.includes(pCity))
    
    if (!isParisRegion) {
      console.log(`Événements non disponibles pour ${city} (seulement Paris/Région parisienne pour le moment)`)
      return []
    }
    
    const parisEvents = await getParisPublicEvents(10)
    
    const relevantEvents = filterEventsByBusinessType(parisEvents, businessType)
    
    return relevantEvents
  } catch (error) {
    console.error('Paris OpenData non disponible:', error.message)
    return []
  }
}

function filterEventsByBusinessType(events, businessType) {
  const businessKeywords = {
    'boulangerie': ['marché', 'festival', 'salon', 'gastronomie', 'food', 'cuisine'],
    'restaurant': ['marché', 'festival', 'concert', 'exposition', 'gastronomie', 'food', 'cuisine', 'spectacle'],
    'bar': ['concert', 'festival', 'spectacle', 'match', 'soirée', 'musique'],
    'cave à vin': ['salon', 'exposition', 'dégustation', 'vin', 'wine', 'gastronomie'],
    'épicerie': ['marché', 'salon', 'festival', 'gastronomie', 'food'],
    'traiteur': ['marché', 'salon', 'festival', 'gastronomie', 'food', 'cuisine'],
    'brasserie': ['concert', 'festival', 'spectacle', 'match', 'gastronomie'],
    'café': ['concert', 'festival', 'spectacle', 'exposition', 'marché'],
    'commerce': ['marché', 'festival', 'salon', 'exposition', 'concert']
  }
  
  const keywords = businessKeywords[businessType.toLowerCase()] || businessKeywords['commerce']
  
  const filteredEvents = events.filter(event => {
    const eventText = `${event.name} ${event.description} ${event.tags.join(' ')}`.toLowerCase()
    return keywords.some(keyword => eventText.includes(keyword))
  })
  
  return filteredEvents.length > 0 ? filteredEvents : events.slice(0, 5)
}
