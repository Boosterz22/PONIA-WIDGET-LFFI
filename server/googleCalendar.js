function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function getParisPublicEvents(maxResults = 50, userLat = null, userLon = null, radiusKm = 5) {
  try {
    const now = new Date()
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(now.getDate() + 14)

    const minDate = now.toISOString().split('T')[0]
    const maxDate = twoWeeksFromNow.toISOString().split('T')[0]

    const url = `https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records?limit=${maxResults}&select=title,lat_lon,date_start,date_end,address_name,address_street,address_zipcode,tags,price_type,lead_text,description&where=date_start>="${minDate}" AND date_start<="${maxDate}"&order_by=date_start`

    const response = await fetch(url)
    const data = await response.json()

    const allEvents = (data.records || []).map(record => {
      const fields = record.record?.fields || record.fields || {}
      const startDate = fields.date_start || now.toISOString()
      const endDate = fields.date_end || startDate
      const latLon = fields.lat_lon || {}
      const eventLat = latLon.lat
      const eventLon = latLon.lon

      const tagsArray = Array.isArray(fields.tags) ? fields.tags : (fields.tags ? [fields.tags] : [])

      let distance = null
      if (userLat && userLon && eventLat && eventLon) {
        distance = calculateDistance(userLat, userLon, eventLat, eventLon)
      }

      return {
        id: record.id || record.recordid,
        name: fields.title || 'Événement Paris',
        description: fields.lead_text || fields.description || '',
        location: fields.address_name || fields.address_street || 'Paris',
        start: startDate,
        end: endDate,
        tags: tagsArray,
        priceType: fields.price_type || 'unknown',
        attendees: estimateAttendees(fields),
        latitude: eventLat,
        longitude: eventLon,
        distance: distance,
        impact: estimateEventImpact({
          summary: fields.title || '',
          tags: tagsArray.join(' '),
          priceType: fields.price_type || ''
        })
      }
    })

    if (userLat && userLon) {
      const nearbyEvents = allEvents.filter(event => 
        event.distance !== null && event.distance <= radiusKm
      )
      return nearbyEvents.sort((a, b) => a.distance - b.distance).slice(0, maxResults)
    }

    return allEvents.slice(0, maxResults)
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

function isParisRegionPostalCode(postalCode) {
  if (!postalCode) return false
  const prefix = postalCode.substring(0, 2)
  return ['75', '77', '78', '91', '92', '93', '94', '95'].includes(prefix)
}

export async function getLocalPublicEvents(city = 'Paris', businessType = 'commerce', postalCode = '75001', userLat = null, userLon = null) {
  try {
    if (!isParisRegionPostalCode(postalCode)) {
      console.log(`Événements non disponibles pour le code postal ${postalCode} (seulement Paris/Île-de-France)`)
      return []
    }
    
    const radiusKm = 5
    const parisEvents = await getParisPublicEvents(50, userLat, userLon, radiusKm)
    
    const relevantEvents = filterEventsByBusinessType(parisEvents, businessType)
    
    if (userLat && userLon && relevantEvents.length > 0) {
      console.log(`✅ Filtrage géographique : ${relevantEvents.length} événements dans un rayon de ${radiusKm}km de [${userLat}, ${userLon}]`)
    }
    
    return relevantEvents.slice(0, 10)
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
