import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import { useLang } from '../context/LanguageContext'
import './About.css'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function About() {
  const { t, lang } = useLang()

  const visionCards = [
    {
      icon: '🌾',
      title: lang === 'hi' ? 'किसान सशक्तिकरण' : 'Farmer Empowerment',
      desc: lang === 'hi'
        ? 'आधुनिक कृषि ज्ञान, AI-आधारित सिफारिशों और रीयल-टाइम बाज़ार अंतर्दृष्टि तक आसान पहुंच प्रदान करना ताकि किसान सूचित निर्णय ले सकें।'
        : 'Providing easy access to modern agricultural knowledge, AI-based recommendations, and real-time market insights so farmers can make informed decisions.',
    },
    {
      icon: '🤝',
      title: lang === 'hi' ? 'समुदाय संचालित' : 'Community Driven',
      desc: lang === 'hi'
        ? 'एक सहयोगी पारिस्थितिकी तंत्र बनाना जहां किसान, विशेषज्ञ और कृषि संस्थान ज्ञान साझा करें और एक-दूसरे का समर्थन करें।'
        : 'Building a collaborative ecosystem where farmers, experts, and agricultural institutions share knowledge and support each other.',
    },
    {
      icon: '🚀',
      title: lang === 'hi' ? 'सबके लिए तकनीक' : 'Technology for All',
      desc: lang === 'hi'
        ? 'वॉयस-फर्स्ट, बहु-भाषा इंटरफेस के माध्यम से हर किसान के लिए अत्याधुनिक AI और डेटा टूल्स को सुलभ बनाना।'
        : 'Making cutting-edge AI and data tools accessible to every farmer through voice-first, multi-language interfaces designed for ease of use.',
    },
  ]

  const techStack = [
    { icon: '⚛️', name: 'React.js' },
    { icon: '🟢', name: 'Node.js' },
    { icon: '🍃', name: 'MongoDB' },
    { icon: '🧠', name: 'LLM / AI' },
    { icon: '🗣️', name: 'Voice AI' },
    { icon: '📡', name: 'REST APIs' },
    { icon: '☁️', name: 'Cloud Deploy' },
    { icon: '🔒', name: lang === 'hi' ? 'सुरक्षा' : 'Auth & Security' },
  ]

  const teamRoles = [
    { icon: '💻', role: lang === 'hi' ? 'फुल स्टैक डेवलपर' : 'Full Stack Developer', desc: 'React, Node.js, AI integration' },
    { icon: '🧠', role: lang === 'hi' ? 'AI/ML इंजीनियर' : 'AI/ML Engineer', desc: 'LLM, NLP, voice processing' },
    { icon: '⚙️', role: lang === 'hi' ? 'बैकएंड डेवलपर' : 'Backend Developer', desc: 'APIs, Database, Cloud infra' },
    { icon: '🎨', role: lang === 'hi' ? 'UI/UX डिज़ाइनर' : 'UI/UX Designer', desc: lang === 'hi' ? 'किसान-केंद्रित डिज़ाइन' : 'Farmer-centric design, research' },
  ]



  return (
    <motion.div className="page-wrapper about-page" {...pageTransition}>
      <div className="container">
        {/* Mission */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="mission-grid">
            <ScrollReveal direction="left">
              <div className="mission-text">
                <h2>
                  {t('aboutPage.missionTitle1')} <span className="gradient-text">{t('aboutPage.missionTitle2')}</span>
                </h2>
                <p>{t('aboutPage.missionP1')}</p>
                <p>
                  <strong style={{ color: 'var(--color-accent)' }}>Annadata AI</strong> {t('aboutPage.missionP2')}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="mission-visual">
                <div className="mission-stat-card">
                  <div className="stat-emoji">🌾</div>
                  <h3><AnimatedCounter end={140} suffix="M+" /></h3>
                  <p>{lang === 'hi' ? 'भारतीय किसान' : 'Indian Farmers'}</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">📈</div>
                  <h3><AnimatedCounter end={200} suffix="+" /></h3>
                  <p>{lang === 'hi' ? 'फसल किस्में' : 'Crop Varieties'}</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">🗣️</div>
                  <h3><AnimatedCounter end={12} suffix="" /></h3>
                  <p>{lang === 'hi' ? 'भाषाएं' : 'Languages'}</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">📱</div>
                  <h3><AnimatedCounter end={28} suffix="" /></h3>
                  <p>{lang === 'hi' ? 'राज्य कवर' : 'States Covered'}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Vision */}
        <section className="section">
          <SectionHeader tag={t('aboutPage.visionTag')} title={t('aboutPage.visionTitle')} />
          <div className="vision-grid">
            {visionCards.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <motion.div className="vision-card" whileHover={{ y: -4 }}>
                  <div className="vision-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="section">
          <SectionHeader tag={t('aboutPage.techTag')} title={t('aboutPage.techTitle')} subtitle={t('aboutPage.techSubtitle')} />
          <div className="tech-grid">
            {techStack.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 0.05}>
                <motion.div className="tech-item" whileHover={{ scale: 1.05 }}>
                  <div className="tech-icon">{item.icon}</div>
                  <p>{item.name}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="section">
          <SectionHeader tag={t('aboutPage.teamTag')} title={t('aboutPage.teamTitle')} subtitle={t('aboutPage.teamSubtitle')} />
          <div className="team-grid">
            {teamRoles.map((m, i) => (
              <ScrollReveal key={m.role} delay={i * 0.1}>
                <motion.div className="team-card" whileHover={{ y: -4 }}>
                  <div className="team-avatar" style={{ fontSize: '2rem', background: 'var(--color-bg-elevated)', border: '2px solid var(--color-border)' }}>{m.icon}</div>
                  <h4>{m.role}</h4>
                  <p>{m.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>


      </div>
    </motion.div>
  )
}

export default About
