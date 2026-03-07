import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import './Footer.css'

function Footer() {
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
            <p>Empowering Indian farmers with AI-driven crop intelligence, real-time market data, and community support.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/crops">Crop Library</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/mandi-rates">Mandi Rates</Link></li>
              <li><Link to="/transport">Transport</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/ai-assistant">AI Assistant</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@annadata.ai">hello@annadata.ai</a></li>
              <li><a href="#">+91 98765 43210</a></li>
              <li><a href="#">New Delhi, India</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Annadata AI. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
