import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, MapPin } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import './WeatherWidget.css'

function WeatherWidget() {
  const { lang } = useLang()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locationName, setLocationName] = useState('')

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        // Fetch weather from Open-Meteo (Free, No Key Required)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
        const data = await res.json()
        
        // Try to get location name using a free reverse geocoding API
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          const geoData = await geoRes.json()
          setLocationName(geoData.address?.city || geoData.address?.town || geoData.address?.district || 'Local Area')
        } catch (e) {
          setLocationName(lang === 'hi' ? 'आपका क्षेत्र' : 'Your Area')
        }

        setWeather(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch weather:", err)
        setError(lang === 'hi' ? 'मौसम का डेटा लोड नहीं हो सका' : 'Could not load weather data')
        setLoading(false)
      }
    }

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude)
          },
          (error) => {
            console.error("Geolocation error:", error)
            // Default to New Delhi if user denies location
            fetchWeather(28.6139, 77.2090)
            setLocationName('New Delhi (Default)')
          }
        )
      } else {
        // Fallback to New Delhi
        fetchWeather(28.6139, 77.2090)
        setLocationName('New Delhi')
      }
    }

    getLocation()
  }, [lang])

  if (loading) return <div className="weather-widget loading-skeleton"></div>
  if (error) return null

  // Open-Meteo WMO Weather codes mapping
  const getWeatherInfo = (code) => {
    if (code === 0) return { icon: <Sun size={32} color="#FFD700" />, desc: lang === 'hi' ? 'साफ़' : 'Clear' }
    if (code >= 1 && code <= 3) return { icon: <Cloud size={32} color="#A0AEC0" />, desc: lang === 'hi' ? 'आंशिक बादल' : 'Partly Cloudy' }
    if (code >= 51 && code <= 67) return { icon: <CloudRain size={32} color="#4FD1C5" />, desc: lang === 'hi' ? 'वर्षा' : 'Rain' }
    return { icon: <Cloud size={32} color="#718096" />, desc: lang === 'hi' ? 'बादल' : 'Cloudy' }
  }

  const currentInfo = getWeatherInfo(weather.current.weather_code)

  return (
    <motion.div 
      className="weather-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="weather-header">
        <MapPin size={16} />
        <span>{locationName}</span>
      </div>
      
      <div className="weather-main">
        <div className="weather-icon-temp">
          {currentInfo.icon}
          <h2>{Math.round(weather.current.temperature_2m)}°C</h2>
        </div>
        <div className="weather-desc">
          <p>{currentInfo.desc}</p>
          <div className="weather-details">
            <span>💧 {weather.current.relative_humidity_2m}%</span>
            <span><Wind size={14} /> {weather.current.wind_speed_10m} km/h</span>
          </div>
        </div>
      </div>

      <div className="weather-forecast">
        {weather.daily.time.slice(1, 4).map((date, i) => {
          const dayInfo = getWeatherInfo(weather.daily.weather_code[i+1])
          const dateObj = new Date(date)
          const dayName = dateObj.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' })
          
          return (
            <div key={date} className="forecast-day">
              <span>{dayName}</span>
              <div className="forecast-icon">{dayInfo.icon}</div>
              <span>{Math.round(weather.daily.temperature_2m_max[i+1])}°</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default WeatherWidget
