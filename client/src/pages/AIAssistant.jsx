import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sprout, Sparkles, ImagePlus, X } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import { useLang } from '../context/LanguageContext'
import { aiAPI } from '../services/api'
import './AIAssistant.css'

const sampleQueries = [
  { text: 'Best crop for sandy soil?', textHi: 'रेतीली मिट्टी के लिए सबसे अच्छी फसल?', icon: '🌱' },
  { text: 'How to control aphids in wheat?', textHi: 'गेहूं में माहू कैसे नियंत्रित करें?', icon: '🐛' },
  { text: 'When to sow mustard in Rajasthan?', textHi: 'राजस्थान में सरसों कब बोएं?', icon: '🌼' },
  { text: 'गेहूं में कौन सी खाद डालें?', textHi: 'गेहूं में कौन सी खाद डालें?', icon: '🌾' },
  { text: 'Suggest organic farming practices', textHi: 'जैविक खेती के तरीके सुझाएं', icon: '🌿' },
  { text: 'Best mandi for cotton in Gujarat', textHi: 'गुजरात में कपास के लिए सबसे अच्छी मंडी', icon: '📊' },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function AIAssistant() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([
    {
      id: 1, type: 'bot',
      text: t('aiPage.welcomeMsg'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, selectedImage])

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'hi' ? "कृपया 5MB से छोटी छवि चुनें।" : "Please select an image smaller than 5MB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setSelectedImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async (text) => {
    const msg = text || input.trim()
    const imgToSend = selectedImage
    
    if ((!msg && !imgToSend) || isTyping) return

    const userMsg = {
      id: Date.now(), type: 'user', 
      text: msg || (lang === 'hi' ? 'छवि का विश्लेषण करें' : 'Analyze this image'),
      image: imgToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSelectedImage(null)
    setIsTyping(true)

    try {
      const data = await aiAPI.chat(msg, sessionId, imgToSend)
      const botMsg = {
        id: Date.now() + 1, type: 'bot', text: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1, type: 'bot',
        text: lang === 'hi'
          ? 'क्षमा करें, कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें। 🙏'
          : 'Sorry, something went wrong. Please try again. 🙏',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    }
    setIsTyping(false)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend() }

  const toggleMic = () => {
    setIsListening(!isListening)
    if (!isListening) setTimeout(() => setIsListening(false), 3000)
  }

  const formatBotText = (text) => {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <motion.div className="page-wrapper ai-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag={t('aiPage.tag')}
          title={t('aiPage.title')}
          subtitle={t('aiPage.subtitle')}
          tagIcon={<Sparkles size={14} />}
        />

        <div className="ai-layout">
          <div className="ai-chat-container">
            <div className="ai-chat-header">
              <div className="ai-chat-avatar"><Sprout size={24} /></div>
              <div className="ai-chat-header-info">
                <h4>Annadata AI</h4>
                <span><span className="online-dot" /> {t('aiPage.online')}</span>
              </div>
            </div>

            <div className="ai-chat-messages">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`chat-message ${msg.type}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {msg.image && (
                      <div className="chat-message-image">
                        <img src={msg.image} alt="Uploaded crop" />
                      </div>
                    )}
                    {msg.type === 'bot' ? (
                      <p>{formatBotText(msg.text)}</p>
                    ) : (
                      <p style={{ color: 'inherit' }}>{msg.text}</p>
                    )}
                    <div className="chat-time">{msg.time}</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div className="chat-message bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="voice-wave">
                    {[...Array(5)].map((_, i) => <div key={i} className="voice-wave-bar" />)}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat-input-wrapper">
              <AnimatePresence>
                {selectedImage && (
                  <motion.div 
                    className="ai-image-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <img src={selectedImage} alt="Preview" />
                    <button className="ai-image-preview-close" onClick={() => setSelectedImage(null)}>
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="ai-chat-input-area">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/jpg" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImageFile}
                />
                <button 
                  className="ai-action-btn" 
                  onClick={() => fileInputRef.current?.click()} 
                  aria-label="Upload image"
                  disabled={isTyping}
                >
                  <ImagePlus size={20} />
                </button>
                <button 
                  className={`ai-action-btn mic-btn ${isListening ? 'active' : ''}`} 
                  onClick={toggleMic} 
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
                
                <input
                  className="ai-chat-input" type="text"
                  placeholder={lang === 'hi' ? (selectedImage ? 'छवि के बारे में पूछें...' : 'खेती से जुड़े सवाल पूछें (या फोटो डालें)...') : (selectedImage ? 'Ask about this image...' : 'Ask your farming questions (or upload a photo)...')}
                  value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                />
                
                <button className="ai-send-btn" onClick={() => handleSend()} aria-label="Send message" disabled={isTyping}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="ai-suggestions">
            {sampleQueries.map((q) => (
              <motion.button
                key={q.text}
                className="ai-suggestion-chip"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleSend(lang === 'hi' ? q.textHi : q.text)}
              >
                <span>{q.icon}</span> {lang === 'hi' ? q.textHi : q.text}
              </motion.button>
            ))}
          </div>

          <div className="ai-language-info">
            <div className="ai-language-flags">🇮🇳</div>
            {t('aiPage.langSupport')}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AIAssistant

