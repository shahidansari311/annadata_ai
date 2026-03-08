import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { transportAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './Transport.css'

const trackingSteps = [
  { label: 'Order Placed', labelHi: 'ऑर्डर दिया', time: '10:30 AM', icon: '📋', status: 'completed' },
  { label: 'Driver Assigned', labelHi: 'ड्राइवर सौंपा', time: '10:45 AM', icon: '👤', status: 'completed' },
  { label: 'Pickup Done', labelHi: 'पिकअप हो गया', time: '12:15 PM', icon: '📦', status: 'completed' },
  { label: 'In Transit', labelHi: 'रास्ते में', time: 'Now', icon: '🚛', status: 'active' },
  { label: 'Delivered', labelHi: 'डिलीवर हो गया', time: 'Expected 3 PM', timeHi: 'अपेक्षित 3 बजे', icon: '✅', status: 'pending' },
]

const cropOptions = [
  { value: 'wheat', en: 'Wheat (गेहूं)', hi: 'गेहूं (Wheat)' },
  { value: 'rice', en: 'Rice (चावल)', hi: 'चावल (Rice)' },
  { value: 'cotton', en: 'Cotton (कपास)', hi: 'कपास (Cotton)' },
  { value: 'soybean', en: 'Soybean (सोयाबीन)', hi: 'सोयाबीन (Soybean)' },
  { value: 'sugarcane', en: 'Sugarcane (गन्ना)', hi: 'गन्ना (Sugarcane)' },
  { value: 'maize', en: 'Maize (मक्का)', hi: 'मक्का (Maize)' },
  { value: 'other', en: 'Other', hi: 'अन्य' },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Transport() {
  const { t, lang } = useLang()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    cropType: 'wheat',
    weight: 25,
    pickupLocation: '',
    destination: '',
    preferredDate: '',
    notes: '',
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await transportAPI.getProviders()
        setDrivers(data.providers)
      } catch (err) {
        console.error('Failed to fetch providers:', err)
      }
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!formData.pickupLocation || !formData.destination) {
      alert(lang === 'hi' ? 'कृपया पिकअप और डिलीवरी स्थान भरें' : 'Please fill pickup and delivery locations')
      return
    }

    setSubmitting(true)
    try {
      await transportAPI.createRequest(formData)
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (err) {
      alert(err.message)
    }
    setSubmitting(false)
  }

  return (
    <motion.div className="page-wrapper transport-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag={t('transportPage.tag')}
          title={t('transportPage.title')}
          subtitle={t('transportPage.subtitle')}
        />

        <div className="transport-layout">
          <ScrollReveal direction="left">
            <div className="transport-form-card">
              <h3>{t('transportPage.requestPickup')}</h3>
              <p>{t('transportPage.requestPickupDesc')}</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('transportPage.cropType')}</label>
                  <select name="cropType" value={formData.cropType} onChange={handleChange}>
                    {cropOptions.map((c) => (
                      <option key={c.value} value={c.value}>{lang === 'hi' ? c.hi : c.en}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('transportPage.weight')}</label>
                    <input type="number" name="weight" placeholder="e.g., 50" value={formData.weight} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>{t('transportPage.preferredDate')}</label>
                    <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('transportPage.pickupLocation')}</label>
                  <input type="text" name="pickupLocation" placeholder={lang === 'hi' ? 'गांव, तहसील, जिला' : 'Village, Tehsil, District'} value={formData.pickupLocation} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('transportPage.deliveryDest')}</label>
                  <input type="text" name="destination" placeholder={lang === 'hi' ? 'मंडी का नाम या शहर' : 'Mandi name or city'} value={formData.destination} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('transportPage.additionalNotes')}</label>
                  <textarea name="notes" placeholder={lang === 'hi' ? 'पिकअप के लिए कोई विशेष निर्देश...' : 'Any special instructions for pickup...'} value={formData.notes} onChange={handleChange} />
                </div>

                {submitSuccess && (
                  <div style={{ color: 'var(--color-accent)', fontSize: '0.9rem', padding: '8px', textAlign: 'center' }}>
                    ✅ {lang === 'hi' ? 'अनुरोध सफलतापूर्वक जमा!' : 'Request submitted successfully!'}
                  </div>
                )}

                <motion.button className="form-submit" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={submitting}>
                  {submitting
                    ? (lang === 'hi' ? 'भेज रहे हैं...' : 'Submitting...')
                    : t('transportPage.findProviders')}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="drivers-section">
              <h3>{t('transportPage.nearbyProviders')}</h3>
              {loading ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                  {lang === 'hi' ? 'लोड हो रहा है...' : 'Loading providers...'}
                </p>
              ) : (
                <div className="drivers-list">
                  {drivers.map((d, i) => (
                    <motion.div
                      key={d._id || d.name}
                      className="driver-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="driver-avatar">{d.emoji}</div>
                      <div className="driver-info">
                        <h4>{d.name}</h4>
                        <p className="driver-vehicle">{d.vehicle}</p>
                        <div className="driver-meta">
                          <span className="driver-rating"><Star size={12} /> {d.rating}</span>
                          <span>{d.trips} {t('transportPage.trips')}</span>
                          <span><MapPin size={12} /> {lang === 'hi' ? d.distanceHi : d.distance}</span>
                        </div>
                      </div>
                      <button className="driver-contact" style={{ opacity: d.available ? 1 : 0.5, pointerEvents: d.available ? 'auto' : 'none' }}>
                        {d.available ? t('transportPage.contact') : t('transportPage.busy')}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        <div className="tracking-section section">
          <ScrollReveal>
            <h3 style={{ textAlign: 'center' }}>{t('transportPage.deliveryTracking')}</h3>
            <div className="tracking-timeline">
              {trackingSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  className={`tracking-step ${step.status}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="tracking-dot">{step.icon}</div>
                  <div>
                    <h4>{lang === 'hi' ? step.labelHi : step.label}</h4>
                    <p>{lang === 'hi' && step.timeHi ? step.timeHi : step.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </motion.div>
  )
}

export default Transport
