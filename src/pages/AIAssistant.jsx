import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sprout, Sparkles, MessageSquare } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import './AIAssistant.css'

const initialMessages = [
  {
    id: 1,
    type: 'bot',
    text: 'Namaste! 🙏 I am your AI farming assistant. I can help you with crop recommendations, pest management, fertilizer schedules, weather-based advice, and much more. Ask me anything in Hindi or English!',
    time: '10:30 AM',
  },
]

const sampleQueries = [
  { text: 'Best crop for sandy soil?', icon: '🌱' },
  { text: 'How to control aphids in wheat?', icon: '🐛' },
  { text: 'When to sow mustard in Rajasthan?', icon: '🌼' },
  { text: 'गेहूं में कौन सी खाद डालें?', icon: '🌾' },
  { text: 'Suggest organic farming practices', icon: '🌿' },
  { text: 'Best mandi for cotton in Gujarat', icon: '📊' },
]

const botResponses = {
  'Best crop for sandy soil?': `Great question! For **sandy soil**, here are top crop recommendations:\n\n• **Groundnut** — Thrives in sandy loam, good returns\n• **Pearl Millet (Bajra)** — Drought-tolerant, ideal for sandy regions\n• **Mustard** — Performs well in light sandy soils\n• **Watermelon** — Excellent for summer cultivation\n• **Moong Dal** — Good nitrogen fixer for sandy soils\n\nWould you like specific sowing schedules or fertilizer recommendations for any of these?`,
  'How to control aphids in wheat?': `Here are effective methods to **control aphids in wheat**:\n\n**Organic Methods:**\n• Spray **neem oil** (5ml/litre) early morning\n• Release **ladybird beetles** (natural predators)\n• Use **yellow sticky traps** in the field\n\n**Chemical Methods:**\n• Spray **Imidacloprid** 17.8 SL (0.5ml/litre)\n• Apply **Dimethoate** 30 EC (1.5ml/litre)\n\n**Prevention:**\n• Avoid excess nitrogen fertilizer\n• Maintain proper plant spacing\n• Monitor regularly from jointing stage\n\n⚠️ Always follow recommended doses and safety precautions.`,
  'When to sow mustard in Rajasthan?': `For **mustard sowing in Rajasthan**:\n\n🗓️ **Optimal time:** October 10–25\n\n**Recommended varieties:**\n• RH-749 (early maturing)\n• Bio-902 (high yielding)\n• Pusa Bold (for irrigated conditions)\n\n**Key tips:**\n• Seed rate: 3-4 kg/ha\n• Row spacing: 30-45 cm\n• Apply SSP before sowing\n• First irrigation at 25-30 days\n\nBased on current weather patterns, I recommend sowing by **October 20** for best results this season.`,
}

const defaultResponse = `Thank you for your question! Based on my agricultural knowledge base, here are some insights:\n\n• I recommend consulting with your local **Krishi Vigyan Kendra (KVK)** for region-specific advice\n• You can also check our **Crop Library** for detailed crop information\n• The **Community section** has expert farmers who might have practical experience\n\nWould you like me to help with anything else? 🌾`

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages)
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
      id: Date.now(),
      type: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseText = botResponses[msg] || defaultResponse
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  const toggleMic = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000)
    }
  }

  const formatBotText = (text) => {
    return text.split('\n').map((line, i) => {
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/⚠️/g, '⚠️')

      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <motion.div className="page-wrapper ai-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag="AI Assistant"
          title="Your Smart Farming Advisor"
          subtitle="Ask questions about crops, pests, fertilizers, weather, and more — in Hindi or English. Our AI understands farming."
          tagIcon={<Sparkles size={14} />}
        />

        <div className="ai-layout">
          <div className="ai-chat-container">
            <div className="ai-chat-header">
              <div className="ai-chat-avatar">
                <Sprout size={24} />
              </div>
              <div className="ai-chat-header-info">
                <h4>Annadata AI</h4>
                <span>
                  <span className="online-dot" />
                  Online — Ready to help
                </span>
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
                <motion.div
                  className="chat-message bot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="voice-wave">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="voice-wave-bar" />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat-input-area">
              <button
                className={`ai-mic-btn ${isListening ? 'active' : ''}`}
                onClick={toggleMic}
                aria-label="Voice input"
              >
                <Mic size={20} />
              </button>
              <input
                className="ai-chat-input"
                type="text"
                placeholder="Ask about crops, fertilizers, pest control..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="ai-send-btn" onClick={() => handleSend()} aria-label="Send message">
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="ai-suggestions">
            {sampleQueries.map((q) => (
              <motion.button
                key={q.text}
                className="ai-suggestion-chip"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSend(q.text)}
              >
                <span>{q.icon}</span> {q.text}
              </motion.button>
            ))}
          </div>

          {/* Language support */}
          <div className="ai-language-info">
            <div className="ai-language-flags">
              🇮🇳
            </div>
            Supports Hindi, English, and regional languages
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AIAssistant
