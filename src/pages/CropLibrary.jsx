import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Droplets, Bug, Beaker } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import './CropLibrary.css'

const cropsData = [
  {
    id: 1, name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾', season: 'rabi',
    soil: 'Loamy, Clay Loam', water: 'Moderate (450-650mm)', temp: '10-25°C',
    duration: '120-150 days', durationHi: '120-150 दिन',
    pests: ['Aphids', 'Rust', 'Karnal Bunt', 'Termites'],
    fertilizer: ['Nitrogen: 120-150 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 40 kg/ha', 'Zinc Sulphate: 25 kg/ha'],
    irrigation: ['First: 21 days (Crown root)', 'Second: 45 days (Tillering)', 'Third: 65 days (Late jointing)', 'Fourth: 85 days (Flowering)', 'Fifth: 105 days (Milking)'],
    tags: ['Staple', 'High Demand', 'North India'],
    tagsHi: ['मुख्य अनाज', 'उच्च मांग', 'उत्तर भारत'],
  },
  {
    id: 2, name: 'Rice', nameHi: 'चावल', emoji: '🍚', season: 'kharif',
    soil: 'Clay, Silty Clay', water: 'High (1200-1400mm)', temp: '20-37°C',
    duration: '100-150 days', durationHi: '100-150 दिन',
    pests: ['Brown Plant Hopper', 'Stem Borer', 'Blast', 'Leaf Folder'],
    fertilizer: ['Nitrogen: 100-120 kg/ha', 'Phosphorus: 50-60 kg/ha', 'Potassium: 50 kg/ha'],
    irrigation: ['Maintain 5cm standing water', 'Drain before harvest (15 days)', 'Critical: Tillering & Flowering'],
    tags: ['Staple', 'Monsoon', 'Pan India'],
    tagsHi: ['मुख्य अनाज', 'मानसून', 'पूरे भारत'],
  },
  {
    id: 3, name: 'Cotton', nameHi: 'कपास', emoji: '🏵️', season: 'kharif',
    soil: 'Black Cotton Soil, Deep Loamy', water: 'Moderate (700-1200mm)', temp: '21-30°C',
    duration: '150-180 days', durationHi: '150-180 दिन',
    pests: ['Bollworm', 'Whitefly', 'Jassids', 'Pink Bollworm'],
    fertilizer: ['Nitrogen: 60-80 kg/ha (split)', 'Phosphorus: 30-40 kg/ha', 'Potassium: 30 kg/ha'],
    irrigation: ['First: 30 days after sowing', 'Flowering stage critical', 'Boll formation: regular irrigation'],
    tags: ['Cash Crop', 'Maharashtra', 'Gujarat'],
    tagsHi: ['नकदी फसल', 'महाराष्ट्र', 'गुजरात'],
  },
  {
    id: 4, name: 'Sugarcane', nameHi: 'गन्ना', emoji: '🎋', season: 'kharif',
    soil: 'Deep Loamy, Well-drained', water: 'High (1500-2500mm)', temp: '20-35°C',
    duration: '10-12 months', durationHi: '10-12 महीने',
    pests: ['Early Shoot Borer', 'Top Borer', 'Pyrilla', 'Red Rot'],
    fertilizer: ['Nitrogen: 150-300 kg/ha', 'Phosphorus: 80 kg/ha', 'Potassium: 60 kg/ha', 'FYM: 25 tonnes/ha'],
    irrigation: ['Every 7-10 days (summer)', 'Every 15-20 days (winter)', 'Critical: Tillering & Grand growth'],
    tags: ['Cash Crop', 'UP', 'Karnataka'],
    tagsHi: ['नकदी फसल', 'उत्तर प्रदेश', 'कर्नाटक'],
  },
  {
    id: 5, name: 'Maize', nameHi: 'मक्का', emoji: '🌽', season: 'kharif',
    soil: 'Sandy Loam, Well-drained', water: 'Moderate (500-800mm)', temp: '21-30°C',
    duration: '80-110 days', durationHi: '80-110 दिन',
    pests: ['Fall Army Worm', 'Stem Borer', 'Shoot Fly'],
    fertilizer: ['Nitrogen: 120 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 40 kg/ha'],
    irrigation: ['Tasseling stage critical', 'Grain filling: regular moisture', 'Avoid waterlogging'],
    tags: ['Versatile', 'Animal Feed', 'Bihar'],
    tagsHi: ['बहुमुखी', 'पशु आहार', 'बिहार'],
  },
  {
    id: 6, name: 'Mustard', nameHi: 'सरसों', emoji: '🌼', season: 'rabi',
    soil: 'Sandy Loam to Loam', water: 'Low (250-400mm)', temp: '10-25°C',
    duration: '110-140 days', durationHi: '110-140 दिन',
    pests: ['Aphids', 'Painted Bug', 'Saw Fly', 'White Rust'],
    fertilizer: ['Nitrogen: 60-80 kg/ha', 'Phosphorus: 40 kg/ha', 'Sulphur: 20 kg/ha'],
    irrigation: ['First: 25-30 days (Pre-flowering)', 'Second: 55-60 days (Pod formation)', 'Max 2-3 irrigations'],
    tags: ['Oil Seed', 'Rajasthan', 'Drought Tolerant'],
    tagsHi: ['तिलहन', 'राजस्थान', 'सूखा सहनशील'],
  },
  {
    id: 7, name: 'Potato', nameHi: 'आलू', emoji: '🥔', season: 'rabi',
    soil: 'Sandy Loam, Rich Organic', water: 'Moderate (500-700mm)', temp: '15-22°C',
    duration: '80-120 days', durationHi: '80-120 दिन',
    pests: ['Late Blight', 'Early Blight', 'Aphids', 'Tuber Moth'],
    fertilizer: ['Nitrogen: 120-150 kg/ha', 'Phosphorus: 80 kg/ha', 'Potassium: 100 kg/ha', 'FYM: 20 tonnes/ha'],
    irrigation: ['Every 7-10 days', 'Critical: Tuber initiation', 'Stop 10 days before harvest'],
    tags: ['Vegetable', 'UP', 'High Yield'],
    tagsHi: ['सब्जी', 'उत्तर प्रदेश', 'उच्च उपज'],
  },
  {
    id: 8, name: 'Watermelon', nameHi: 'तरबूज', emoji: '🍉', season: 'zaid',
    soil: 'Sandy Loam, Well-drained', water: 'Moderate (400-600mm)', temp: '25-35°C',
    duration: '80-110 days', durationHi: '80-110 दिन',
    pests: ['Fruit Fly', 'Aphids', 'Red Pumpkin Beetle', 'Powdery Mildew'],
    fertilizer: ['Nitrogen: 80 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 60 kg/ha'],
    irrigation: ['Regular moisture needed', 'Reduce at ripening', 'Drip irrigation preferred'],
    tags: ['Summer', 'Fruit', 'High Profit'],
    tagsHi: ['गर्मी', 'फल', 'अधिक लाभ'],
  },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function CropLibrary() {
  const { t, lang } = useLang()
  const [search, setSearch] = useState('')
  const [activeSeason, setActiveSeason] = useState('all')
  const [selectedCrop, setSelectedCrop] = useState(null)

  const seasons = [
    { key: 'all', label: t('cropLibrary.all') },
    { key: 'kharif', label: 'Kharif' },
    { key: 'rabi', label: 'Rabi' },
    { key: 'zaid', label: 'Zaid' },
  ]

  const filtered = cropsData.filter((c) => {
    const name = lang === 'hi' ? c.nameHi : c.name
    const tags = lang === 'hi' ? c.tagsHi : c.tags
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameHi.includes(search) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      tags.some(tg => tg.toLowerCase().includes(search.toLowerCase()))
    const matchesSeason = activeSeason === 'all' || c.season === activeSeason
    return matchesSearch && matchesSeason
  })

  return (
    <motion.div className="page-wrapper crop-library-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag={t('cropLibrary.tag')}
          title={t('cropLibrary.title')}
          subtitle={t('cropLibrary.subtitle')}
        />

        <div className="crop-search-bar">
          <div className="crop-search-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="crop-search-input"
              placeholder={t('cropLibrary.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {seasons.map((s) => (
            <button
              key={s.key}
              className={`crop-filter-btn ${activeSeason === s.key ? 'active' : ''}`}
              onClick={() => setActiveSeason(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="crops-grid">
          {filtered.map((crop, i) => (
            <ScrollReveal key={crop.id} delay={i * 0.05}>
              <motion.div
                className="crop-card"
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCrop(crop)}
              >
                <div className="crop-card-image">
                  {crop.emoji}
                  <span className={`crop-card-season ${crop.season}`}>
                    {crop.season}
                  </span>
                </div>
                <div className="crop-card-body">
                  <h3>{lang === 'hi' ? crop.nameHi : crop.name}</h3>
                  <p className="crop-name-hindi">{lang === 'hi' ? crop.name : crop.nameHi}</p>
                  <div className="crop-card-tags">
                    {(lang === 'hi' ? crop.tagsHi : crop.tags).map((tg) => (
                      <span key={tg}>{tg}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{t('cropLibrary.noCrops')}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            className="crop-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCrop(null)}
          >
            <motion.div
              className="crop-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crop-modal-header">
                <div>
                  <h2>{selectedCrop.emoji} {lang === 'hi' ? selectedCrop.nameHi : selectedCrop.name}</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {lang === 'hi' ? selectedCrop.name : selectedCrop.nameHi}
                  </p>
                </div>
                <button className="crop-modal-close" onClick={() => setSelectedCrop(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="crop-detail-grid">
                <div className="crop-detail-item">
                  <label>{t('cropLibrary.season')}</label>
                  <p style={{ textTransform: 'capitalize' }}>{selectedCrop.season}</p>
                </div>
                <div className="crop-detail-item">
                  <label>{t('cropLibrary.duration')}</label>
                  <p>{lang === 'hi' ? selectedCrop.durationHi : selectedCrop.duration}</p>
                </div>
                <div className="crop-detail-item">
                  <label>{t('cropLibrary.soilType')}</label>
                  <p>{selectedCrop.soil}</p>
                </div>
                <div className="crop-detail-item">
                  <label>{t('cropLibrary.waterNeeds')}</label>
                  <p>{selectedCrop.water}</p>
                </div>
                <div className="crop-detail-item">
                  <label>{t('cropLibrary.temperature')}</label>
                  <p>{selectedCrop.temp}</p>
                </div>
              </div>

              <div className="crop-detail-section">
                <h4><Droplets size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> {t('cropLibrary.irrigationSchedule')}</h4>
                <ul>
                  {selectedCrop.irrigation.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="crop-detail-section">
                <h4><Bug size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> {t('cropLibrary.commonPests')}</h4>
                <ul>
                  {selectedCrop.pests.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="crop-detail-section">
                <h4><Beaker size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> {t('cropLibrary.fertilizerGuide')}</h4>
                <ul>
                  {selectedCrop.fertilizer.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CropLibrary
