import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import { mandiAPI } from '../services/api'
import './MandiRates.css'

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={14} />
  if (trend === 'down') return <TrendingDown size={14} />
  return <Minus size={14} />
}

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function MandiRates() {
  const { t, lang } = useLang()
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Initial fetch — get states
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await mandiAPI.getRates({})
        setStates(data.states || [])
        setDistricts(data.districts || [])
        setRates(data.rates || [])
        if (data.states?.length > 0) {
          setSelectedState(data.states[0])
        }
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Failed to fetch mandi rates:', err)
      }
      setLoading(false)
    }
    fetchInitial()
  }, [])

  // When state changes, fetch districts and rates
  useEffect(() => {
    if (!selectedState) return
    const fetchByState = async () => {
      try {
        const data = await mandiAPI.getRates({ state: selectedState })
        setDistricts(data.districts || [])
        if (data.districts?.length > 0 && !data.districts.includes(selectedDistrict)) {
          setSelectedDistrict(data.districts[0])
        }
      } catch (err) {
        console.error('Failed to fetch districts:', err)
      }
    }
    fetchByState()
  }, [selectedState])

  // When district changes, fetch rates
  useEffect(() => {
    if (!selectedState || !selectedDistrict) return
    const fetchRates = async () => {
      setLoading(true)
      try {
        const data = await mandiAPI.getRates({ state: selectedState, district: selectedDistrict })
        setRates(data.rates || [])
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Failed to fetch rates:', err)
      }
      setLoading(false)
    }
    fetchRates()
  }, [selectedState, selectedDistrict])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedState) params.state = selectedState
      if (selectedDistrict) params.district = selectedDistrict
      const data = await mandiAPI.getRates(params)
      setRates(data.rates || [])
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Refresh failed:', err)
    }
    setLoading(false)
  }

  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedDistrict('')
  }

  return (
    <motion.div className="page-wrapper mandi-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag={t('mandiPage.tag')}
          title={t('mandiPage.title')}
          subtitle={t('mandiPage.subtitle')}
        />

        <div className="mandi-controls">
          <select className="mandi-select" value={selectedState} onChange={handleStateChange}>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="mandi-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="mandi-last-update">
          <span className="dot" />
          <span>
            {lastUpdate
              ? `${lang === 'hi' ? 'अंतिम अपडेट:' : 'Last updated:'} ${lastUpdate.toLocaleTimeString()}`
              : t('mandiPage.lastUpdate')}
          </span>
          <RefreshCw size={14} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={handleRefresh} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading rates...'}</p>
          </div>
        ) : (
          <div className="mandi-grid">
            {rates.map((item, i) => (
              <ScrollReveal key={item._id || item.name + i} delay={i * 0.05}>
                <motion.div className="mandi-card" whileHover={{ y: -3 }}>
                  <div className="mandi-card-header">
                    <h3><span className="emoji">{item.emoji}</span> {lang === 'hi' ? item.nameHi : item.name}</h3>
                    <div className={`mandi-trend ${item.trend}`}>
                      <TrendIcon trend={item.trend} /> {item.change}
                    </div>
                  </div>
                  <div className="mandi-price-row">
                    <span className="mandi-price-label">{t('mandiPage.modalPrice')}</span>
                    <span className="mandi-price-value highlight">₹{item.modal?.toLocaleString()}/qtl</span>
                  </div>
                  <div className="mandi-price-row">
                    <span className="mandi-price-label">{t('mandiPage.minPrice')}</span>
                    <span className="mandi-price-value">₹{item.min?.toLocaleString()}</span>
                  </div>
                  <div className="mandi-price-row">
                    <span className="mandi-price-label">{t('mandiPage.maxPrice')}</span>
                    <span className="mandi-price-value">₹{item.max?.toLocaleString()}</span>
                  </div>
                  <div className="mandi-sparkline">
                    {item.sparkline?.map((val, idx) => (
                      <div key={idx} className="mandi-spark-bar" style={{ height: `${val}%` }} />
                    ))}
                  </div>
                  <div className="mandi-spark-label">
                    <span>{t('mandiPage.daysAgo')}</span>
                    <span>{t('mandiPage.today')}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && rates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{lang === 'hi' ? 'कोई भाव नहीं मिला' : 'No rates found for this selection'}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MandiRates
