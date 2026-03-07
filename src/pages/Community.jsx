import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, MessageCircle, Clock, Eye, Globe, Plus } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import './Community.css'

const threadsData = [
  {
    id: 1,
    title: 'What is the best organic pesticide for cotton bollworm?',
    titleHi: 'कपास के बॉलवर्म के लिए सबसे अच्छा जैविक कीटनाशक कौन सा है?',
    body: 'I have been facing heavy infestation of bollworm in my cotton field this season. Chemical pesticides are expensive, looking for organic alternatives that actually work.',
    bodyHi: 'इस सीजन में मेरे कपास के खेत में बॉलवर्म का भारी प्रकोप हो रहा है। रासायनिक कीटनाशक महंगे हैं, जैविक विकल्प खोज रहा हूं जो वास्तव में काम करें।',
    author: 'Kishan Patel', time: '2 hours ago', timeHi: '2 घंटे पहले',
    votes: 24, answers: 8, views: 342,
    badges: ['popular'], tags: ['Cotton', 'Pest Control', 'Organic'],
    tagsHi: ['कपास', 'कीट नियंत्रण', 'जैविक'], category: 'pest-control',
  },
  {
    id: 2,
    title: 'Best wheat variety for Madhya Pradesh - HD 3226 vs HD 2967?',
    titleHi: 'मध्य प्रदेश के लिए सबसे अच्छी गेहूं किस्म - HD 3226 या HD 2967?',
    body: 'Planning to sow wheat this rabi season. My farm is in Hoshangabad district with black soil. Which variety should I go for better yields?',
    bodyHi: 'इस रबी सीजन में गेहूं बोने की योजना बना रहा हूं। मेरा खेत होशंगाबाद जिले में काली मिट्टी वाला है। बेहतर उपज के लिए कौन सी किस्म चुनूं?',
    author: 'Dr. Neha Sharma', time: '5 hours ago', timeHi: '5 घंटे पहले',
    votes: 31, answers: 12, views: 567,
    badges: ['expert', 'verified'], tags: ['Wheat', 'Variety Selection', 'MP'],
    tagsHi: ['गेहूं', 'किस्म चयन', 'म.प्र.'], category: 'crop-advisory',
  },
  {
    id: 3,
    title: 'How to set up drip irrigation for sugarcane on a budget?',
    titleHi: 'कम बजट में गन्ने के लिए ड्रिप सिंचाई कैसे लगाएं?',
    body: 'I have 5 acres of sugarcane. Want to shift from flood irrigation to drip. What is the approximate cost and which government subsidy schemes can I apply for?',
    bodyHi: 'मेरे पास 5 एकड़ गन्ने का खेत है। बाढ़ सिंचाई से ड्रिप में बदलना चाहता हूं। अनुमानित लागत और कौन सी सरकारी सब्सिडी योजनाओं के लिए आवेदन कर सकता हूं?',
    author: 'Manoj Singh', time: '1 day ago', timeHi: '1 दिन पहले',
    votes: 45, answers: 15, views: 891,
    badges: ['popular'], tags: ['Sugarcane', 'Drip Irrigation', 'Subsidy'],
    tagsHi: ['गन्ना', 'ड्रिप सिंचाई', 'सब्सिडी'], category: 'irrigation',
  },
  {
    id: 4,
    title: 'Yellow leaves on my rice crop — is it nitrogen deficiency?',
    titleHi: 'मेरी धान की फसल पर पीले पत्ते — क्या यह नाइट्रोजन की कमी है?',
    body: 'My rice paddy is showing yellow leaves from the bottom. The crop is 40 days old. Applied 2 bags of urea already.',
    bodyHi: 'मेरे धान के खेत में नीचे से पत्ते पीले हो रहे हैं। फसल 40 दिन की है। पहले ही 2 बोरी यूरिया डाल चुका हूं।',
    author: 'Priya Kumari', time: '3 hours ago', timeHi: '3 घंटे पहले',
    votes: 18, answers: 6, views: 234,
    badges: [], tags: ['Rice', 'Nutrient Deficiency', 'Diagnosis'],
    tagsHi: ['धान', 'पोषक तत्व की कमी', 'पहचान'], category: 'crop-advisory',
  },
  {
    id: 5,
    title: 'PM Kisan Samman Nidhi — how to check installment status?',
    titleHi: 'PM किसान सम्मान निधि — किस्त की स्थिति कैसे जांचें?',
    body: 'I registered for PM Kisan scheme last year but have not received the last installment. Can someone guide me?',
    bodyHi: 'मैंने पिछले साल PM किसान योजना के लिए रजिस्टर किया था लेकिन आखिरी किस्त नहीं मिली। कोई मार्गदर्शन कर सकता है?',
    author: 'Arun Kumar', time: '6 hours ago', timeHi: '6 घंटे पहले',
    votes: 56, answers: 22, views: 1203,
    badges: ['popular', 'verified'], tags: ['Government Scheme', 'PM Kisan', 'Support'],
    tagsHi: ['सरकारी योजना', 'PM किसान', 'सहायता'], category: 'schemes',
  },
  {
    id: 6,
    title: 'Soil testing labs near Jaipur — recommendations?',
    titleHi: 'जयपुर के पास मिट्टी जांच प्रयोगशालाएं — सिफारिशें?',
    body: 'I want to get my soil tested before the rabi season. Are there any reliable and affordable soil testing labs near Jaipur?',
    bodyHi: 'मैं रबी सीजन से पहले अपनी मिट्टी की जांच करवाना चाहता हूं। जयपुर के पास कोई विश्वसनीय और सस्ती मिट्टी जांच लैब है?',
    author: 'Gopal Sharma', time: '2 days ago', timeHi: '2 दिन पहले',
    votes: 12, answers: 4, views: 156,
    badges: [], tags: ['Soil Testing', 'Rajasthan', 'Rabi Season'],
    tagsHi: ['मिट्टी जांच', 'राजस्थान', 'रबी सीजन'], category: 'soil',
  },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Community() {
  const { t, lang } = useLang()
  const [activeTab, setActiveTab] = useState('all')
  const [threads, setThreads] = useState(threadsData)

  const tabs = [
    { key: 'all', label: t('communityPage.allTopics') },
    { key: 'crop-advisory', label: t('communityPage.cropAdvisory') },
    { key: 'pest-control', label: t('communityPage.pestControl') },
    { key: 'irrigation', label: t('communityPage.irrigation') },
    { key: 'schemes', label: t('communityPage.govtSchemes') },
  ]

  const filteredThreads = activeTab === 'all'
    ? threads
    : threads.filter((th) => th.category === activeTab)

  const handleVote = (id, dir) => {
    setThreads((prev) => prev.map((th) => th.id === id ? { ...th, votes: th.votes + dir } : th))
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
          <button className="ask-question-btn">
            <Plus size={18} /> {t('communityPage.askQuestion')}
          </button>
        </div>

        <div className="community-threads">
          {filteredThreads.map((thread, i) => (
            <ScrollReveal key={thread.id} delay={i * 0.05}>
              <div className="thread-card">
                <div className="thread-votes">
                  <button className="thread-vote-btn" onClick={() => handleVote(thread.id, 1)}>
                    <ChevronUp size={16} />
                  </button>
                  <span className="thread-vote-count">{thread.votes}</span>
                  <button className="thread-vote-btn" onClick={() => handleVote(thread.id, -1)}>
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="thread-content">
                  <h3>{lang === 'hi' ? thread.titleHi : thread.title}</h3>
                  <p>{lang === 'hi' ? thread.bodyHi : thread.body}</p>

                  <div className="thread-meta">
                    <span className="thread-meta-item">
                      <Clock size={13} /> {lang === 'hi' ? thread.timeHi : thread.time}
                    </span>
                    <span className="thread-meta-item">
                      <MessageCircle size={13} /> {thread.answers} {t('communityPage.answers')}
                    </span>
                    <span className="thread-meta-item">
                      <Eye size={13} /> {thread.views} {t('communityPage.views')}
                    </span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                      {thread.author}
                    </span>
                    {thread.badges.map((b) => (
                      <span key={b} className={`thread-badge badge-${b}`}>{b}</span>
                    ))}
                  </div>

                  <div className="thread-tags" style={{ marginTop: 'var(--space-sm)' }}>
                    {(lang === 'hi' ? thread.tagsHi : thread.tags).map((tg) => (
                      <span key={tg}>{tg}</span>
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
