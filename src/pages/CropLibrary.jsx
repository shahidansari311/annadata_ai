import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Droplets, Sun, Bug, Beaker } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import './CropLibrary.css'

const cropsData = [
  {
    id: 1, name: 'Wheat', hindi: 'गेहूं', emoji: '🌾', season: 'rabi',
    soil: 'Loamy, Clay Loam', water: 'Moderate (450-650mm)', temp: '10-25°C',
    duration: '120-150 days',
    pests: ['Aphids', 'Rust', 'Karnal Bunt', 'Termites'],
    fertilizer: ['Nitrogen: 120-150 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 40 kg/ha', 'Zinc Sulphate: 25 kg/ha'],
    irrigation: ['First: 21 days (Crown root)', 'Second: 45 days (Tillering)', 'Third: 65 days (Late jointing)', 'Fourth: 85 days (Flowering)', 'Fifth: 105 days (Milking)'],
    tags: ['Staple', 'High Demand', 'North India'],
  },
  {
    id: 2, name: 'Rice', hindi: 'चावल', emoji: '🍚', season: 'kharif',
    soil: 'Clay, Silty Clay', water: 'High (1200-1400mm)', temp: '20-37°C',
    duration: '100-150 days',
    pests: ['Brown Plant Hopper', 'Stem Borer', 'Blast', 'Leaf Folder'],
    fertilizer: ['Nitrogen: 100-120 kg/ha', 'Phosphorus: 50-60 kg/ha', 'Potassium: 50 kg/ha'],
    irrigation: ['Maintain 5cm standing water', 'Drain before harvest (15 days)', 'Critical: Tillering & Flowering'],
    tags: ['Staple', 'Monsoon', 'Pan India'],
  },
  {
    id: 3, name: 'Cotton', hindi: 'कपास', emoji: '🏵️', season: 'kharif',
    soil: 'Black Cotton Soil, Deep Loamy', water: 'Moderate (700-1200mm)', temp: '21-30°C',
    duration: '150-180 days',
    pests: ['Bollworm', 'Whitefly', 'Jassids', 'Pink Bollworm'],
    fertilizer: ['Nitrogen: 60-80 kg/ha (split)', 'Phosphorus: 30-40 kg/ha', 'Potassium: 30 kg/ha'],
    irrigation: ['First: 30 days after sowing', 'Flowering stage critical', 'Boll formation: regular irrigation'],
    tags: ['Cash Crop', 'Maharashtra', 'Gujarat'],
  },
  {
    id: 4, name: 'Sugarcane', hindi: 'गन्ना', emoji: '🎋', season: 'kharif',
    soil: 'Deep Loamy, Well-drained', water: 'High (1500-2500mm)', temp: '20-35°C',
    duration: '10-12 months',
    pests: ['Early Shoot Borer', 'Top Borer', 'Pyrilla', 'Red Rot'],
    fertilizer: ['Nitrogen: 150-300 kg/ha', 'Phosphorus: 80 kg/ha', 'Potassium: 60 kg/ha', 'FYM: 25 tonnes/ha'],
    irrigation: ['Every 7-10 days (summer)', 'Every 15-20 days (winter)', 'Critical: Tillering & Grand growth'],
    tags: ['Cash Crop', 'UP', 'Karnataka'],
  },
  {
    id: 5, name: 'Maize', hindi: 'मक्का', emoji: '🌽', season: 'kharif',
    soil: 'Sandy Loam, Well-drained', water: 'Moderate (500-800mm)', temp: '21-30°C',
    duration: '80-110 days',
    pests: ['Fall Army Worm', 'Stem Borer', 'Shoot Fly'],
    fertilizer: ['Nitrogen: 120 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 40 kg/ha'],
    irrigation: ['Tasseling stage critical', 'Grain filling: regular moisture', 'Avoid waterlogging'],
    tags: ['Versatile', 'Animal Feed', 'Bihar'],
  },
  {
    id: 6, name: 'Mustard', hindi: 'सरसों', emoji: '🌼', season: 'rabi',
    soil: 'Sandy Loam to Loam', water: 'Low (250-400mm)', temp: '10-25°C',
    duration: '110-140 days',
    pests: ['Aphids', 'Painted Bug', 'Saw Fly', 'White Rust'],
    fertilizer: ['Nitrogen: 60-80 kg/ha', 'Phosphorus: 40 kg/ha', 'Sulphur: 20 kg/ha'],
    irrigation: ['First: 25-30 days (Pre-flowering)', 'Second: 55-60 days (Pod formation)', 'Max 2-3 irrigations'],
    tags: ['Oil Seed', 'Rajasthan', 'Drought Tolerant'],
  },
  {
    id: 7, name: 'Potato', hindi: 'आलू', emoji: '🥔', season: 'rabi',
    soil: 'Sandy Loam, Rich Organic', water: 'Moderate (500-700mm)', temp: '15-22°C',
    duration: '80-120 days',
    pests: ['Late Blight', 'Early Blight', 'Aphids', 'Tuber Moth'],
    fertilizer: ['Nitrogen: 120-150 kg/ha', 'Phosphorus: 80 kg/ha', 'Potassium: 100 kg/ha', 'FYM: 20 tonnes/ha'],
    irrigation: ['Every 7-10 days', 'Critical: Tuber initiation', 'Stop 10 days before harvest'],
    tags: ['Vegetable', 'UP', 'High Yield'],
  },
  {
    id: 8, name: 'Watermelon', hindi: 'तरबूज', emoji: '🍉', season: 'zaid',
    soil: 'Sandy Loam, Well-drained', water: 'Moderate (400-600mm)', temp: '25-35°C',
    duration: '80-110 days',
    pests: ['Fruit Fly', 'Aphids', 'Red Pumpkin Beetle', 'Powdery Mildew'],
    fertilizer: ['Nitrogen: 80 kg/ha', 'Phosphorus: 60 kg/ha', 'Potassium: 60 kg/ha'],
    irrigation: ['Regular moisture needed', 'Reduce at ripening', 'Drip irrigation preferred'],
    tags: ['Summer', 'Fruit', 'High Profit'],
  },
]

const seasons = ['All', 'Kharif', 'Rabi', 'Zaid']

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function CropLibrary() {
  const [search, setSearch] = useState('')
  const [activeSeason, setActiveSeason] = useState('All')
  const [selectedCrop, setSelectedCrop] = useState(null)

  const filtered = cropsData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hindi.includes(search) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesSeason = activeSeason === 'All' || c.season === activeSeason.toLowerCase()
    return matchesSearch && matchesSeason
  })

  return (
    <motion.div className="page-wrapper crop-library-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag="Crop Library"
          title="Know Your Crops"
          subtitle="Explore detailed information on 200+ crops — seasonality, soil requirements, irrigation, pest management, and fertilizer schedules."
        />

        <div className="crop-search-bar">
          <div className="crop-search-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="crop-search-input"
              placeholder="Search crops by name, region, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {seasons.map((s) => (
            <button
              key={s}
              className={`crop-filter-btn ${activeSeason === s ? 'active' : ''}`}
              onClick={() => setActiveSeason(s)}
            >
              {s}
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
                  <h3>{crop.name}</h3>
                  <p className="crop-name-hindi">{crop.hindi}</p>
                  <div className="crop-card-tags">
                    {crop.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>No crops found. Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Crop Detail Modal */}
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
                  <h2>{selectedCrop.emoji} {selectedCrop.name}</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{selectedCrop.hindi}</p>
                </div>
                <button className="crop-modal-close" onClick={() => setSelectedCrop(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="crop-detail-grid">
                <div className="crop-detail-item">
                  <label>Season</label>
                  <p style={{ textTransform: 'capitalize' }}>{selectedCrop.season}</p>
                </div>
                <div className="crop-detail-item">
                  <label>Duration</label>
                  <p>{selectedCrop.duration}</p>
                </div>
                <div className="crop-detail-item">
                  <label>Soil Type</label>
                  <p>{selectedCrop.soil}</p>
                </div>
                <div className="crop-detail-item">
                  <label>Water Needs</label>
                  <p>{selectedCrop.water}</p>
                </div>
                <div className="crop-detail-item">
                  <label>Temperature</label>
                  <p>{selectedCrop.temp}</p>
                </div>
              </div>

              <div className="crop-detail-section">
                <h4><Droplets size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> Irrigation Schedule</h4>
                <ul>
                  {selectedCrop.irrigation.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="crop-detail-section">
                <h4><Bug size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> Common Pests</h4>
                <ul>
                  {selectedCrop.pests.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="crop-detail-section">
                <h4><Beaker size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> Fertilizer Guide</h4>
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
