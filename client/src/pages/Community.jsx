import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, MessageCircle, Clock, Eye, Globe, Plus } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { communityAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './Community.css'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Community() {
  const { t, lang } = useLang()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = [
    { key: 'all', label: t('communityPage.allTopics') },
    { key: 'crop-advisory', label: t('communityPage.cropAdvisory') },
    { key: 'pest-control', label: t('communityPage.pestControl') },
    { key: 'irrigation', label: t('communityPage.irrigation') },
    { key: 'schemes', label: t('communityPage.govtSchemes') },
  ]

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true)
      try {
        const params = {}
        if (activeTab !== 'all') params.category = activeTab
        const data = await communityAPI.getThreads(params)
        setThreads(data.threads)
      } catch (err) {
        console.error('Failed to fetch threads:', err)
      }
      setLoading(false)
    }
    fetchThreads()
  }, [activeTab])

  const handleVote = async (id, dir) => {
    try {
      const data = await communityAPI.voteThread(id, dir)
      setThreads((prev) => prev.map((th) =>
        (th._id === id) ? { ...th, votes: data.votes } : th
      ))
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  const handleAskQuestion = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // TODO: Open question modal
    alert(lang === 'hi' ? 'प्रश्न पूछने की सुविधा जल्द आ रही है!' : 'Ask question feature coming soon!')
  }

  const formatTime = (thread) => {
    if (thread.createdAt) {
      const date = new Date(thread.createdAt)
      const now = new Date()
      const diffMs = now - date
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffHours < 1) return lang === 'hi' ? 'अभी' : 'Just now'
      if (diffHours < 24) return lang === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours} hours ago`
      return lang === 'hi' ? `${diffDays} दिन पहले` : `${diffDays} days ago`
    }
    return ''
  }

  return (
    <motion.div className="page-wrapper community-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag={t('communityPage.tag')}
          title={t('communityPage.title')}
          subtitle={t('communityPage.subtitle')}
        />

        <div className="language-hint">
          <Globe size={18} />
          <span>
            <strong>{t('communityPage.langHintLabel')}</strong> {t('communityPage.langHint')}
          </span>
        </div>

        <div className="community-top-bar">
          <div className="community-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`community-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="ask-question-btn" onClick={handleAskQuestion}>
            <Plus size={18} /> {t('communityPage.askQuestion')}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading threads...'}</p>
          </div>
        ) : (
          <div className="community-threads">
            {threads.map((thread, i) => (
              <ScrollReveal key={thread._id || i} delay={i * 0.05}>
                <div className="thread-card">
                  <div className="thread-votes">
                    <button className="thread-vote-btn" onClick={() => handleVote(thread._id, 1)}>
                      <ChevronUp size={16} />
                    </button>
                    <span className="thread-vote-count">{thread.votes}</span>
                    <button className="thread-vote-btn" onClick={() => handleVote(thread._id, -1)}>
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="thread-content">
                    <h3>{lang === 'hi' ? (thread.titleHi || thread.title) : thread.title}</h3>
                    <p>{lang === 'hi' ? (thread.bodyHi || thread.body) : thread.body}</p>

                    <div className="thread-meta">
                      <span className="thread-meta-item">
                        <Clock size={13} /> {formatTime(thread)}
                      </span>
                      <span className="thread-meta-item">
                        <MessageCircle size={13} /> {thread.answerCount} {t('communityPage.answers')}
                      </span>
                      <span className="thread-meta-item">
                        <Eye size={13} /> {thread.views} {t('communityPage.views')}
                      </span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                        {thread.authorName || (thread.author?.name) || 'Anonymous'}
                      </span>
                      {thread.badges?.map((b) => (
                        <span key={b} className={`thread-badge badge-${b}`}>{b}</span>
                      ))}
                    </div>

                    <div className="thread-tags" style={{ marginTop: 'var(--space-sm)' }}>
                      {(lang === 'hi' ? (thread.tagsHi || thread.tags) : thread.tags)?.map((tg) => (
                        <span key={tg}>{tg}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && threads.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p>{lang === 'hi' ? 'कोई थ्रेड नहीं मिला' : 'No threads found'}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Community
