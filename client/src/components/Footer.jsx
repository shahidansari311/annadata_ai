import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { useLang } from '../context/LanguageContext'
import './Footer.css'

function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon">
                <Sprout size={22} />
              </div>
              Annadata<span style={{ color: 'var(--color-accent)' }}>AI</span>
            </Link>
            <p>{t('footer.desc')}</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>{t('footer.platform')}</h4>
            <ul>
              <li><Link to="/crops">{t('nav.cropLibrary')}</Link></li>
              <li><Link to="/community">{t('nav.community')}</Link></li>
              <li><Link to="/mandi-rates">{t('nav.mandiRates')}</Link></li>
              <li><Link to="/transport">{t('nav.transport')}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>{t('footer.resources')}</h4>
            <ul>
              <li><Link to="/ai-assistant">{t('nav.aiAssistant')}</Link></li>
              <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
              <li><a href="#">{t('footer.blog')}</a></li>
              <li><a href="#">{t('footer.helpCenter')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>{t('footer.contact')}</h4>
            <ul>
              <li><a href="mailto:shashanktomar912@gmail.com">shashanktomar912@gmail.com</a></li>
              <li><a href="#">+91 8858369784</a></li>
              <li><a href="#">Ghaziabad, India</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
          <div className="footer-bottom-links">
            <a href="#">{t('footer.privacyPolicy')}</a>
            <a href="#">{t('footer.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
