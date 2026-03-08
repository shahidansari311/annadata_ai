import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sprout, User } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { t, toggleLang, lang } = useLang()
  const { isAuthenticated, user } = useAuth()

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/crops', label: t('nav.cropLibrary') },
    { path: '/community', label: t('nav.community') },
    { path: '/mandi-rates', label: t('nav.mandiRates') },
    { path: '/transport', label: t('nav.transport') },
    { path: '/about', label: t('nav.about') },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="container">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <Sprout size={22} />
          </div>
          Annadata<span>AI</span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}

          <button className="nav-lang-toggle" onClick={toggleLang} aria-label="Switch language">
            <span className="nav-lang-flag">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
            {t('nav.langSwitch')}
          </button>

          <Link to="/ai-assistant" className="nav-cta">
            {t('nav.aiAssistant')}
          </Link>

          <Link to="/login" className="nav-login-btn">
            {isAuthenticated ? (
              <span className="nav-avatar">{user?.name ? user.name[0].toUpperCase() : <User size={16} />}</span>
            ) : (
              <><User size={16} /> {lang === 'hi' ? 'लॉगिन' : 'Login'}</>
            )}
          </Link>
        </div>

        <div className="nav-mobile-right">
          <button className="nav-lang-toggle mobile" onClick={toggleLang} aria-label="Switch language">
            <span className="nav-lang-flag">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
          </button>
          <button
            className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`nav-mobile-overlay ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/ai-assistant" className="nav-cta">
            {t('nav.aiAssistant')}
          </Link>
          <Link to="/login" className="nav-link">
            {isAuthenticated ? (lang === 'hi' ? '👤 प्रोफ़ाइल' : '👤 Profile') : (lang === 'hi' ? '🔐 लॉगिन' : '🔐 Login')}
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
