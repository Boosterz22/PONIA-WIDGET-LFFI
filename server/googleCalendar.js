import { google } from 'googleapis'

let connectionSettings

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl')
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0])

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Calendar not connected')
  }
  return accessToken
}

export async function getGoogleCalendarClient() {
  const accessToken = await getAccessToken()

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({
    access_token: accessToken
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function getUpcomingEvents(city = 'Paris', maxResults = 10) {
  try {
    const calendar = await getGoogleCalendarClient()
    
    const now = new Date()
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(now.getDate() + 14)

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: twoWeeksFromNow.toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime',
      q: city
    })

    const events = response.data.items || []
    
    return events.map(event => ({
      id: event.id,
      name: event.summary || 'Événement sans titre',
      description: event.description || '',
      location: event.location || city,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      attendees: event.attendees?.length || 0,
      impact: estimateEventImpact(event)
    }))
  } catch (error) {
    console.error('Erreur récupération événements Google Calendar:', error)
    return []
  }
}

function estimateEventImpact(event) {
  const name = (event.summary || '').toLowerCase()
  const attendees = event.attendees?.length || 0
  
  const highImpactKeywords = ['festival', 'marathon', 'concert', 'match', 'salon', 'exposition']
  const mediumImpactKeywords = ['conférence', 'réunion', 'séminaire', 'atelier', 'marché']
  
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

export async function getLocalPublicEvents(city = 'Paris') {
  const mockEvents = [
    {
      id: 'local-1',
      name: 'Festival de Jazz',
      description: 'Festival annuel de jazz dans le quartier',
      location: city,
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      attendees: 2000,
      impact: {
        level: 'high',
        expectedVisitors: '+40%',
        stockAdvice: 'Augmentez vos stocks de boissons et snacks',
        priority: 1
      }
    },
    {
      id: 'local-2',
      name: 'Marathon de Paris',
      description: 'Course annuelle traversant la ville',
      location: city,
      start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      attendees: 500,
      impact: {
        level: 'medium',
        expectedVisitors: '+25%',
        stockAdvice: 'Prévoyez plus de produits énergétiques',
        priority: 2
      }
    }
  ]

  try {
    const calendarEvents = await getUpcomingEvents(city, 5)
    return calendarEvents.length > 0 ? calendarEvents : mockEvents
  } catch (error) {
    console.log('Utilisation des événements mock (Google Calendar non disponible)')
    return mockEvents
  }
}
