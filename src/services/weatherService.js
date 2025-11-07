export async function getCurrentWeather(city = 'Paris', country = 'FR') {
  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    return data.weather
  } catch (error) {
    console.error('Weather API error:', error)
    return null
  }
}


export function getWeatherImpact(weather) {
  if (!weather) {
    return { level: 'normal', message: 'Données météo non disponibles' }
  }

  const impacts = []

  if (weather.temp > 30) {
    impacts.push({
      level: 'warning',
      message: 'Forte chaleur : surveillez les produits frais et les DLC',
      icon: '☀️'
    })
  }

  if (weather.temp < 5) {
    impacts.push({
      level: 'info',
      message: 'Températures basses : vérifiez le stockage des produits sensibles au froid',
      icon: '❄️'
    })
  }

  if (weather.humidity > 70) {
    impacts.push({
      level: 'warning',
      message: 'Humidité élevée : risque de moisissures sur produits secs',
      icon: '💧'
    })
  }

  if (weather.windSpeed > 50) {
    impacts.push({
      level: 'warning',
      message: 'Vents forts : possibles retards de livraison',
      icon: '💨'
    })
  }

  if (impacts.length === 0) {
    return {
      level: 'normal',
      message: 'Conditions météo normales',
      icon: '✅'
    }
  }

  return impacts[0]
}
