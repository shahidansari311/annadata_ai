import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import './MandiRates.css'

const states = ['Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Punjab', 'Karnataka']
const districts = {
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Hoshangabad', 'Jabalpur'],
  'Uttar Pradesh': ['Lucknow', 'Agra', 'Kanpur', 'Varanasi'],
  'Maharashtra': ['Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum'],
}

const commoditiesData = [
  { name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾', trend: 'up', change: '+2.3%', min: 2180, max: 2350, modal: 2280, sparkline: [60, 65, 62, 70, 68, 75, 80] },
  { name: 'Rice (Basmati)', nameHi: 'चावल (बासमती)', emoji: '🍚', trend: 'up', change: '+1.8%', min: 3400, max: 3850, modal: 3650, sparkline: [50, 55, 58, 52, 60, 65, 70] },
  { name: 'Soybean', nameHi: 'सोयाबीन', emoji: '🫘', trend: 'down', change: '-1.2%', min: 4200, max: 4600, modal: 4380, sparkline: [80, 75, 78, 72, 68, 65, 60] },
  { name: 'Cotton', nameHi: 'कपास', emoji: '🏵️', trend: 'up', change: '+3.1%', min: 6200, max: 6800, modal: 6550, sparkline: [40, 50, 55, 60, 58, 70, 78] },
  { name: 'Onion', nameHi: 'प्याज', emoji: '🧅', trend: 'down', change: '-4.5%', min: 800, max: 1400, modal: 1100, sparkline: [90, 85, 80, 70, 65, 55, 50] },
  { name: 'Tomato', nameHi: 'टमाटर', emoji: '🍅', trend: 'stable', change: '+0.2%', min: 1200, max: 1800, modal: 1500, sparkline: [60, 62, 58, 65, 60, 63, 62] },
  { name: 'Potato', nameHi: 'आलू', emoji: '🥔', trend: 'up', change: '+1.5%', min: 600, max: 950, modal: 780, sparkline: [45, 50, 55, 52, 60, 65, 68] },
  { name: 'Maize', nameHi: 'मक्का', emoji: '🌽', trend: 'stable', change: '-0.3%', min: 1800, max: 2100, modal: 1950, sparkline: [55, 58, 56, 60, 58, 55, 57] },
  { name: 'Mustard', nameHi: 'सरसों', emoji: '🌼', trend: 'up', change: '+2.8%', min: 4800, max: 5200, modal: 5050, sparkline: [50, 55, 60, 58, 65, 72, 78] },
]

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
  const [selectedState, setSelectedState] = useState(states[0])
  const [selectedDistrict, setSelectedDistrict] = useState(districts[states[0]][0])

  const handleStateChange = (e) => {
    const state = e.target.value
    setSelectedState(state)
    setSelectedDistrict(districts[state][0])
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
            {(districts[selectedState] || []).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="mandi-last-update">
          <span className="dot" />
          <span>{t('mandiPage.lastUpdate')}</span>
          <RefreshCw size={14} style={{ cursor: 'pointer', marginLeft: '4px' }} />
        </div>

        <div className="mandi-grid">
          {commoditiesData.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 0.05}>
              <motion.div className="mandi-card" whileHover={{ y: -3 }}>
                <div className="mandi-card-header">
                  <h3><span className="emoji">{item.emoji}</span> {lang === 'hi' ? item.nameHi : item.name}</h3>
                  <div className={`mandi-trend ${item.trend}`}>
                    <TrendIcon trend={item.trend} /> {item.change}
                  </div>
                </div>
                <div className="mandi-price-row">
                  <span className="mandi-price-label">{t('mandiPage.modalPrice')}</span>
                  <span className="mandi-price-value highlight">₹{item.modal.toLocaleString()}/qtl</span>
                </div>
                <div className="mandi-price-row">
                  <span className="mandi-price-label">{t('mandiPage.minPrice')}</span>
                  <span className="mandi-price-value">₹{item.min.toLocaleString()}</span>
                </div>
                <div className="mandi-price-row">
                  <span className="mandi-price-label">{t('mandiPage.maxPrice')}</span>
                  <span className="mandi-price-value">₹{item.max.toLocaleString()}</span>
                </div>
                <div className="mandi-sparkline">
                  {item.sparkline.map((val, idx) => (
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
      </div>
    </motion.div>
  )
}

export default MandiRates
