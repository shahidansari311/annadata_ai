import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, MessageCircle, Clock, Eye, Globe, Plus } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import './Community.css'

const threadsData = [
  {
    id: 1,
    title: 'What is the best organic pesticide for cotton bollworm?',
    body: 'I have been facing heavy infestation of bollworm in my cotton field this season. Chemical pesticides are expensive, looking for organic alternatives that actually work.',
    author: 'Kishan Patel',
    time: '2 hours ago',
    votes: 24,
    answers: 8,
    views: 342,
    badges: ['popular'],
    tags: ['Cotton', 'Pest Control', 'Organic'],
    category: 'pest-control',
  },
  {
    id: 2,
    title: 'Best wheat variety for Madhya Pradesh - HD 3226 vs HD 2967?',
    body: 'Planning to sow wheat this rabi season. My farm is in Hoshangabad district with black soil. Which variety should I go for better yields? My neighbor suggests HD 3226.',
    author: 'Dr. Neha Sharma',
    time: '5 hours ago',
    votes: 31,
    answers: 12,
    views: 567,
    badges: ['expert', 'verified'],
    tags: ['Wheat', 'Variety Selection', 'MP'],
    category: 'crop-advisory',
  },
  {
    id: 3,
    title: 'How to set up drip irrigation for sugarcane on a budget?',
    body: 'I have 5 acres of sugarcane. Want to shift from flood irrigation to drip. What is the approximate cost and which government subsidy schemes can I apply for?',
    author: 'Manoj Singh',
    time: '1 day ago',
    votes: 45,
    answers: 15,
    views: 891,
    badges: ['popular'],
    tags: ['Sugarcane', 'Drip Irrigation', 'Subsidy'],
    category: 'irrigation',
  },
  {
    id: 4,
    title: 'Yellow leaves on my rice crop — is it nitrogen deficiency?',
    body: 'My rice paddy is showing yellow leaves from the bottom. The crop is 40 days old. Applied 2 bags of urea already. Should I apply more or is it something else?',
    author: 'Priya Kumari',
    time: '3 hours ago',
    votes: 18,
    answers: 6,
    views: 234,
    badges: [],
    tags: ['Rice', 'Nutrient Deficiency', 'Diagnosis'],
    category: 'crop-advisory',
  },
  {
    id: 5,
    title: 'PM Kisan Samman Nidhi — how to check installment status?',
    body: 'I registered for PM Kisan scheme last year but have not received the last installment. Can someone guide me on how to check status and who to contact?',
    author: 'Arun Kumar',
    time: '6 hours ago',
    votes: 56,
    answers: 22,
    views: 1203,
    badges: ['popular', 'verified'],
    tags: ['Government Scheme', 'PM Kisan', 'Support'],
    category: 'schemes',
  },
  {
    id: 6,
    title: 'Soil testing labs near Jaipur — recommendations?',
    body: 'I want to get my soil tested before the rabi season. Are there any reliable and affordable soil testing labs near Jaipur? What parameters should I get tested?',
    author: 'Gopal Sharma',
    time: '2 days ago',
    votes: 12,
    answers: 4,
    views: 156,
    badges: [],
    tags: ['Soil Testing', 'Rajasthan', 'Rabi Season'],
    category: 'soil',
  },
]

const tabs = [
  { key: 'all', label: 'All Topics' },
  { key: 'crop-advisory', label: 'Crop Advisory' },
  { key: 'pest-control', label: 'Pest Control' },
  { key: 'irrigation', label: 'Irrigation' },
  { key: 'schemes', label: 'Govt Schemes' },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Community() {
  const [activeTab, setActiveTab] = useState('all')
  const [threads, setThreads] = useState(threadsData)

  const filteredThreads = activeTab === 'all'
    ? threads
    : threads.filter((t) => t.category === activeTab)

  const handleVote = (id, dir) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, votes: t.votes + dir } : t
      )
    )
  }

  return (
    <motion.div className="page-wrapper community-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag="Community"
          title="Farmer Community Q&A"
          subtitle="Ask questions, share knowledge, and connect with agricultural experts and fellow farmers across India."
        />

        <div className="language-hint">
          <Globe size={18} />
          <span>
            <strong>Multi-language support:</strong> Post your questions in Hindi, English, or your regional language. Our community experts respond in your preferred language.
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
          <button className="ask-question-btn">
            <Plus size={18} /> Ask a Question
          </button>
        </div>

        <div className="community-threads">
          {filteredThreads.map((thread, i) => (
            <ScrollReveal key={thread.id} delay={i * 0.05}>
              <div className="thread-card">
                <div className="thread-votes">
                  <button
                    className="thread-vote-btn"
                    onClick={() => handleVote(thread.id, 1)}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <span className="thread-vote-count">{thread.votes}</span>
                  <button
                    className="thread-vote-btn"
                    onClick={() => handleVote(thread.id, -1)}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="thread-content">
                  <h3>{thread.title}</h3>
                  <p>{thread.body}</p>

                  <div className="thread-meta">
                    <span className="thread-meta-item">
                      <Clock size={13} /> {thread.time}
                    </span>
                    <span className="thread-meta-item">
                      <MessageCircle size={13} /> {thread.answers} answers
                    </span>
                    <span className="thread-meta-item">
                      <Eye size={13} /> {thread.views} views
                    </span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                      {thread.author}
                    </span>
                    {thread.badges.map((b) => (
                      <span key={b} className={`thread-badge badge-${b}`}>
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="thread-tags" style={{ marginTop: 'var(--space-sm)' }}>
                    {thread.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Community
