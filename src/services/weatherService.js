const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export async function getCurrentWeather(city = 'Paris', country = 'FR') {
  if (!WEATHER_API_KEY) {
    console.warn('OpenWeatherMap API key not configured')
    return null
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: Math.round(data.wind.speed * 3.6),
      city: data.name
    }
  } catch (error) {
    console.error('Weather API error:', error)
    return null
  }
}

export async function getWeatherForecast(city = 'Paris', country = 'FR') {
  if (!WEATHER_API_KEY) {
    return null
  }

  try {
    const response = await fetch(
      `${FORECAST_API_URL}?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric&lang=fr&cnt=8`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data')
    }

    const data = await response.json()
    
    return data.list.map(item => ({
      time: new Date(item.dt * 1000),
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }))
  } catch (error) {
    console.error('Forecast API error:', error)
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
