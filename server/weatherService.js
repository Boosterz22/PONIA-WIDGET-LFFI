import fetch from 'node-fetch'

export class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY
    this.baseUrl = 'https://api.openweathermap.org/data/2.5'
  }

  async getCurrentWeather(city = 'Paris', country = 'FR') {
    if (!this.apiKey) {
      console.warn('OPENWEATHER_API_KEY not configured')
      return null
    }

    try {
      const url = `${this.baseUrl}/weather?q=${city},${country}&appid=${this.apiKey}&units=metric&lang=fr`
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('OpenWeather API error:', response.status)
        return null
      }

      const data = await response.json()
      
      return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        condition: data.weather[0].main.toLowerCase(),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        city: data.name,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Error fetching weather:', error.message)
      return null
    }
  }

  async getForecast(city = 'Paris', country = 'FR', days = 7) {
    if (!this.apiKey) {
      console.warn('OPENWEATHER_API_KEY not configured')
      return null
    }

    try {
      const url = `${this.baseUrl}/forecast?q=${city},${country}&appid=${this.apiKey}&units=metric&lang=fr`
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('OpenWeather API forecast error:', response.status)
        return null
      }

      const data = await response.json()
      
      const dailyForecasts = this._processForecastData(data.list, days)
      
      return {
        city: data.city.name,
        forecasts: dailyForecasts,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Error fetching forecast:', error.message)
      return null
    }
  }

  _processForecastData(forecastList, days) {
    const dailyData = {}
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: []
        }
      }
      
      dailyData[date].temps.push(item.main.temp)
      dailyData[date].conditions.push(item.weather[0].main.toLowerCase())
      dailyData[date].humidity.push(item.main.humidity)
      dailyData[date].windSpeed.push(item.wind.speed)
    })
    
    const processedForecasts = Object.values(dailyData)
      .slice(0, days)
      .map(day => ({
        date: day.date,
        tempMin: Math.round(Math.min(...day.temps)),
        tempMax: Math.round(Math.max(...day.temps)),
        tempAvg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
        condition: this._getMostFrequent(day.conditions),
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length * 10) / 10
      }))
    
    return processedForecasts
  }

  _getMostFrequent(arr) {
    const frequency = {}
    let maxFreq = 0
    let mostFrequent = arr[0]
    
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item]
        mostFrequent = item
      }
    })
    
    return mostFrequent
  }

  analyzeWeatherImpact(weather, productCategory = 'general') {
    if (!weather) {
      return {
        adjustmentFactor: 1.0,
        reason: 'Données météo non disponibles',
        severity: 'none'
      }
    }

    let adjustmentFactor = 1.0
    let reason = 'Conditions normales'
    let severity = 'none'

    const temp = weather.temp || weather.tempAvg

    if (temp > 30) {
      if (productCategory === 'boissons' || productCategory === 'glaces') {
        adjustmentFactor = 1.25
        reason = `Forte chaleur (${temp}°C) : augmentation attendue de 25% sur ${productCategory}`
        severity = 'high'
      } else if (productCategory === 'salades' || productCategory === 'produits_frais') {
        adjustmentFactor = 1.15
        reason = `Forte chaleur (${temp}°C) : augmentation attendue de 15% sur produits frais`
        severity = 'medium'
      } else {
        adjustmentFactor = 1.05
        reason = `Forte chaleur (${temp}°C) : légère augmentation attendue`
        severity = 'low'
      }
    } else if (temp > 25) {
      if (productCategory === 'boissons' || productCategory === 'glaces') {
        adjustmentFactor = 1.15
        reason = `Temps chaud (${temp}°C) : augmentation attendue de 15% sur ${productCategory}`
        severity = 'medium'
      } else {
        adjustmentFactor = 1.05
        reason = `Temps chaud (${temp}°C) : légère augmentation`
        severity = 'low'
      }
    } else if (temp < 5) {
      if (productCategory === 'soupes' || productCategory === 'plats_chauds') {
        adjustmentFactor = 1.20
        reason = `Temps froid (${temp}°C) : augmentation attendue de 20% sur plats chauds`
        severity = 'high'
      } else if (productCategory === 'boissons_chaudes') {
        adjustmentFactor = 1.15
        reason = `Temps froid (${temp}°C) : augmentation attendue de 15% sur boissons chaudes`
        severity = 'medium'
      } else {
        adjustmentFactor = 0.95
        reason = `Temps froid (${temp}°C) : légère baisse attendue`
        severity = 'low'
      }
    }

    if (weather.condition && weather.condition.includes('rain')) {
      adjustmentFactor *= 0.90
      reason += ' + Pluie prévue (-10% fréquentation)'
      severity = severity === 'none' ? 'low' : severity
    }

    return {
      adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
      reason,
      severity,
      temp,
      condition: weather.condition || 'inconnu'
    }
  }
}

export const weatherService = new WeatherService()
