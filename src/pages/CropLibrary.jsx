import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Droplets, Bug, Beaker } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import { cropsAPI } from '../services/api'
import './CropLibrary.css'

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
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)

  const seasons = [
    { key: 'all', label: t('cropLibrary.all') },
    { key: 'kharif', label: 'Kharif' },
    { key: 'rabi', label: 'Rabi' },
    { key: 'zaid', label: 'Zaid' },
  ]

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const params = {}
        if (activeSeason !== 'all') params.season = activeSeason
        if (search) params.search = search
        const data = await cropsAPI.getAll(params)
        setCrops(data.crops)
      } catch (err) {
        console.error('Failed to fetch crops:', err)
      }
      setLoading(false)
    }

    const debounce = setTimeout(fetchCrops, 300)
    return () => clearTimeout(debounce)
  }, [activeSeason, search])

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading crops...'}</p>
          </div>
        ) : (
          <div className="crops-grid">
            {crops.map((crop, i) => (
              <ScrollReveal key={crop._id || i} delay={i * 0.05}>
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
        )}

        {!loading && crops.length === 0 && (
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
