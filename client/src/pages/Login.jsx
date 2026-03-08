import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, Shield, LogOut, User, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const states = [
  'Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Punjab',
  'Karnataka', 'Gujarat', 'Andhra Pradesh', 'Bihar', 'Haryana',
  'Tamil Nadu', 'Telangana', 'West Bengal', 'Chhattisgarh', 'Odisha',
]

function Login() {
  const { lang } = useLang()
  const { user, isAuthenticated, sendOtp, verifyOtp, updateProfile, logout } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('phone') // phone, otp, profile
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)

  // Profile fields
  const [name, setName] = useState('')
  const [state, setState] = useState('')

  useEffect(() => {
    if (isAuthenticated && user) {
      setStep('profile')
      setName(user.name || '')
      setState(user.state || '')
    }
  }, [isAuthenticated, user])

  // OTP timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(lang === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const data = await sendOtp(phone)
      setSuccess(data.message)
      setStep('otp')
      setTimer(120)
    } catch (err) {
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
      const msg = err?.code === 'auth/too-many-requests'
        ? (lang === 'hi' ? 'बहुत अधिक प्रयास। कृपया बाद में कोशिश करें।' : 'Too many attempts. Please try later.')
        : (lang === 'hi' ? 'OTP भेजने में विफल। कृपया पुन: प्रयास करें।' : 'Failed to send OTP. Please try again.')
      setError(msg)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (otp.length !== 6) {
      setError(lang === 'hi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const data = await verifyOtp(otp)
      setSuccess(data.message)
      if (!data.user.name || data.isNewUser) {
        setStep('profile')
      } else {
        navigate('/')
      }
    } catch (err) {
      const msg = err?.code === 'auth/invalid-verification-code'
        ? (lang === 'hi' ? 'गलत OTP। कृपया सही OTP दर्ज करें।' : 'Invalid OTP. Please enter the correct code.')
        : (lang === 'hi' ? 'सत्यापन विफल। कृपया पुन: प्रयास करें।' : 'Verification failed. Please try again.')
      setError(msg)
    }
    setLoading(false)
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name')
      return
    }

    setLoading(true)
    try {
      await updateProfile({ name: name.trim(), state })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    setStep('phone')
    setPhone('')
    setOtp('')
    setName('')
    setState('')
    setError('')
    setSuccess('')
  }

  const handleResendOtp = async () => {
    if (timer > 0) return
    // Reset recaptcha for resend
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
    setError('')
    setLoading(true)
    try {
      const data = await sendOtp(phone)
      setSuccess(data.message)
      setTimer(120)
    } catch (err) {
      setError(lang === 'hi' ? 'OTP पुन: भेजने में विफल।' : 'Failed to resend OTP.')
    }
    setLoading(false)
  }

  return (
    <motion.div className="page-wrapper login-page" {...pageTransition}>
      {/* Invisible reCAPTCHA container — required by Firebase */}
      <div id="recaptcha-container" />

      <div className="login-card">
        <div className="login-icon">🌾</div>

        {/* ── Phone Step ────────────────────────────── */}
        {step === 'phone' && (
          <>
            <h2>{lang === 'hi' ? 'अन्नदाता में लॉगिन' : 'Login to Annadata'}</h2>
            <p className="login-subtitle">
              {lang === 'hi'
                ? 'अपना मोबाइल नंबर दर्ज करें, हम आपको OTP भेजेंगे'
                : 'Enter your mobile number, we\'ll send you an OTP'}
            </p>
            <form className="login-form" onSubmit={handleSendOtp}>
              <div className="login-input-group">
                <label><Phone size={14} style={{ verticalAlign: '-2px' }} /> {lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <motion.button
                className="login-btn"
                type="submit"
                disabled={loading || phone.length !== 10}
                whileTap={{ scale: 0.98 }}
              >
                {loading
                  ? (lang === 'hi' ? 'भेज रहे हैं...' : 'Sending...')
                  : (lang === 'hi' ? 'OTP भेजें' : 'Send OTP')}
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </>
        )}

        {/* ── OTP Step ─────────────────────────────── */}
        {step === 'otp' && (
          <>
            <h2><Shield size={24} style={{ verticalAlign: '-4px' }} /> {lang === 'hi' ? 'OTP सत्यापन' : 'Verify OTP'}</h2>
            <p className="login-subtitle">
              {lang === 'hi'
                ? `+91 ${phone} पर भेजा गया 6 अंकों का OTP दर्ज करें`
                : `Enter the 6-digit OTP sent to +91 ${phone}`}
            </p>
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="login-input-group">
                <label>{lang === 'hi' ? 'OTP कोड' : 'OTP Code'}</label>
                <input
                  type="text"
                  className="otp-input"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              {success && <div className="login-success">{success}</div>}
              <motion.button
                className="login-btn"
                type="submit"
                disabled={loading || otp.length !== 6}
                whileTap={{ scale: 0.98 }}
              >
                {loading
                  ? (lang === 'hi' ? 'सत्यापित कर रहे हैं...' : 'Verifying...')
                  : (lang === 'hi' ? 'सत्यापित करें' : 'Verify & Login')}
              </motion.button>
              <div className="otp-timer">
                {timer > 0
                  ? `${lang === 'hi' ? 'पुन: भेजें' : 'Resend in'} ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
                  : <button type="button" className="login-back-btn" onClick={handleResendOtp} disabled={loading}>
                      {lang === 'hi' ? 'OTP पुन: भेजें' : 'Resend OTP'}
                    </button>
                }
              </div>
              <button type="button" className="login-back-btn" onClick={() => { setStep('phone'); setOtp(''); setError(''); setSuccess('') }}>
                {lang === 'hi' ? '← नंबर बदलें' : '← Change Number'}
              </button>
            </form>
          </>
        )}

        {/* ── Profile Step (logged in) ─────────────── */}
        {step === 'profile' && isAuthenticated && (
          <>
            <h2><User size={24} style={{ verticalAlign: '-4px' }} /> {lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}</h2>
            <p className="login-subtitle">
              {user?.name
                ? (lang === 'hi' ? `नमस्ते, ${user.name}! 🙏` : `Hello, ${user.name}! 🙏`)
                : (lang === 'hi' ? 'हमें अपने बारे में बताएं' : 'Tell us about yourself')}
            </p>
            <form className="login-form" onSubmit={handleProfileSave}>
              <div className="profile-section">
                <div className="profile-field">
                  <label><User size={14} style={{ verticalAlign: '-2px' }} /> {lang === 'hi' ? 'नाम' : 'Name'}</label>
                  <input type="text" placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="profile-field">
                  <label><MapPin size={14} style={{ verticalAlign: '-2px' }} /> {lang === 'hi' ? 'राज्य' : 'State'}</label>
                  <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">{lang === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="profile-field">
                  <label><Phone size={14} style={{ verticalAlign: '-2px' }} /> {lang === 'hi' ? 'फोन' : 'Phone'}</label>
                  <input type="text" value={`+91 ${user?.phone || ''}`} disabled style={{ opacity: 0.6 }} />
                </div>
              </div>
              {error && <div className="login-error">{error}</div>}
              <motion.button className="login-btn" type="submit" disabled={loading} whileTap={{ scale: 0.98 }}>
                {loading ? (lang === 'hi' ? 'सहेज रहे हैं...' : 'Saving...') : (lang === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile')}
              </motion.button>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                <LogOut size={14} style={{ verticalAlign: '-2px' }} /> {lang === 'hi' ? 'लॉग आउट' : 'Log Out'}
              </button>
            </form>
          </>
        )}

        <p className="login-info">
          🔒 {lang === 'hi' ? 'आपकी जानकारी पूरी तरह सुरक्षित है' : 'Your information is completely secure'}
        </p>
      </div>
    </motion.div>
  )
}

export default Login
