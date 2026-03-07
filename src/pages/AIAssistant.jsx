import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sprout, Sparkles } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import { useLang } from '../context/LanguageContext'
import './AIAssistant.css'

const sampleQueries = [
  { text: 'Best crop for sandy soil?', textHi: 'रेतीली मिट्टी के लिए सबसे अच्छी फसल?', icon: '🌱' },
  { text: 'How to control aphids in wheat?', textHi: 'गेहूं में माहू कैसे नियंत्रित करें?', icon: '🐛' },
  { text: 'When to sow mustard in Rajasthan?', textHi: 'राजस्थान में सरसों कब बोएं?', icon: '🌼' },
  { text: 'गेहूं में कौन सी खाद डालें?', textHi: 'गेहूं में कौन सी खाद डालें?', icon: '🌾' },
  { text: 'Suggest organic farming practices', textHi: 'जैविक खेती के तरीके सुझाएं', icon: '🌿' },
  { text: 'Best mandi for cotton in Gujarat', textHi: 'गुजरात में कपास के लिए सबसे अच्छी मंडी', icon: '📊' },
]

const botResponses = {
  'Best crop for sandy soil?': `Great question! For **sandy soil**, here are top crop recommendations:\n\n• **Groundnut** — Thrives in sandy loam, good returns\n• **Pearl Millet (Bajra)** — Drought-tolerant, ideal for sandy regions\n• **Mustard** — Performs well in light sandy soils\n• **Watermelon** — Excellent for summer cultivation\n• **Moong Dal** — Good nitrogen fixer for sandy soils\n\nWould you like specific sowing schedules or fertilizer recommendations for any of these?`,
  'रेतीली मिट्टी के लिए सबसे अच्छी फसल?': `बढ़िया सवाल! **रेतीली मिट्टी** के लिए सबसे अच्छी फसलें:\n\n• **मूंगफली** — रेतीली दोमट में अच्छी उपज\n• **बाजरा** — सूखा सहनशील, रेतीले क्षेत्रों के लिए आदर्श\n• **सरसों** — हल्की रेतीली मिट्टी में अच्छा प्रदर्शन\n• **तरबूज** — गर्मी की खेती के लिए बेहतरीन\n• **मूंग दाल** — नाइट्रोजन फिक्सर\n\nक्या आप इनमें से किसी के लिए बुवाई अनुसूची या उर्वरक सिफारिशें चाहेंगे?`,
  'How to control aphids in wheat?': `Here are effective methods to **control aphids in wheat**:\n\n**Organic Methods:**\n• Spray **neem oil** (5ml/litre) early morning\n• Release **ladybird beetles** (natural predators)\n• Use **yellow sticky traps** in the field\n\n**Chemical Methods:**\n• Spray **Imidacloprid** 17.8 SL (0.5ml/litre)\n• Apply **Dimethoate** 30 EC (1.5ml/litre)\n\n⚠️ Always follow recommended doses and safety precautions.`,
  'गेहूं में माहू कैसे नियंत्रित करें?': `**गेहूं में माहू** नियंत्रित करने के प्रभावी तरीके:\n\n**जैविक तरीके:**\n• **नीम का तेल** (5ml/लीटर) सुबह छिड़काव करें\n• **लेडीबर्ड बीटल** (प्राकृतिक शत्रु) छोड़ें\n• खेत में **पीले चिपचिपे जाल** लगाएं\n\n**रासायनिक तरीके:**\n• **इमिडाक्लोप्रिड** 17.8 SL (0.5ml/लीटर) का छिड़काव\n• **डाइमेथोएट** 30 EC (1.5ml/लीटर) का प्रयोग\n\n⚠️ हमेशा अनुशंसित खुराक और सुरक्षा सावधानियों का पालन करें।`,
  'When to sow mustard in Rajasthan?': `For **mustard sowing in Rajasthan**:\n\n🗓️ **Optimal time:** October 10–25\n\n**Recommended varieties:**\n• RH-749 (early maturing)\n• Bio-902 (high yielding)\n• Pusa Bold (for irrigated conditions)\n\n**Key tips:**\n• Seed rate: 3-4 kg/ha\n• Row spacing: 30-45 cm\n• Apply SSP before sowing\n• First irrigation at 25-30 days`,
  'राजस्थान में सरसों कब बोएं?': `**राजस्थान में सरसों** की बुवाई:\n\n🗓️ **सर्वोत्तम समय:** 10-25 अक्टूबर\n\n**अनुशंसित किस्में:**\n• RH-749 (जल्दी पकने वाली)\n• Bio-902 (अधिक उपज)\n• पूसा बोल्ड (सिंचित स्थितियों के लिए)\n\n**मुख्य टिप्स:**\n• बीज दर: 3-4 kg/ha\n• पंक्ति दूरी: 30-45 cm\n• बुवाई से पहले SSP डालें\n• पहली सिंचाई 25-30 दिन पर`,
}

const defaultResponse = `Thank you for your question! Based on my agricultural knowledge base, here are some insights:\n\n• I recommend consulting with your local **Krishi Vigyan Kendra (KVK)** for region-specific advice\n• You can also check our **Crop Library** for detailed crop information\n• The **Community section** has expert farmers who might have practical experience\n\nWould you like me to help with anything else? 🌾`

const defaultResponseHi = `आपके प्रश्न के लिए धन्यवाद! मेरे कृषि ज्ञान के आधार पर कुछ सुझाव:\n\n• क्षेत्र-विशिष्ट सलाह के लिए अपने स्थानीय **कृषि विज्ञान केंद्र (KVK)** से परामर्श लें\n• विस्तृत फसल जानकारी के लिए हमारी **फसल पुस्तकालय** देखें\n• **समुदाय** में अनुभवी किसानों से व्यावहारिक सलाह मिल सकती है\n\nक्या मैं किसी और चीज़ में मदद कर सकता हूं? 🌾`

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
      time: '10:30 AM',
    },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg) return

    const userMsg = {
      id: Date.now(), type: 'user', text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responseText = botResponses[msg] || (lang === 'hi' ? defaultResponseHi : defaultResponse)
      const botMsg = {
        id: Date.now() + 1, type: 'bot', text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1500)
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

            <div className="ai-chat-input-area">
              <button className={`ai-mic-btn ${isListening ? 'active' : ''}`} onClick={toggleMic} aria-label="Voice input">
                <Mic size={20} />
              </button>
              <input
                className="ai-chat-input" type="text"
                placeholder={t('aiPage.placeholder')}
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              />
              <button className="ai-send-btn" onClick={() => handleSend()} aria-label="Send message">
                <Send size={18} />
              </button>
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
