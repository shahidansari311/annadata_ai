import { motion } from 'framer-motion'
import { Target, Eye, Heart, Zap } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import './About.css'

const visionCards = [
  {
    icon: '🌾',
    title: 'Farmer Empowerment',
    desc: 'Providing easy access to modern agricultural knowledge, AI-based recommendations, and real-time market insights so farmers can make informed decisions.',
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    desc: 'Building a collaborative ecosystem where farmers, experts, and agricultural institutions share knowledge and support each other.',
  },
  {
    icon: '🚀',
    title: 'Technology for All',
    desc: 'Making cutting-edge AI and data tools accessible to every farmer through voice-first, multi-language interfaces designed for ease of use.',
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
  { icon: '🔒', name: 'Auth & Security' },
]

const team = [
  { name: 'Shahid Ansari', role: 'Full Stack Developer', initials: 'SA', desc: 'React, Node.js, AI integration' },
  { name: 'Priya Sharma', role: 'AI/ML Engineer', initials: 'PS', desc: 'LLM, NLP, voice processing' },
  { name: 'Arjun Patel', role: 'Backend Developer', initials: 'AP', desc: 'APIs, Database, Cloud infra' },
  { name: 'Neha Gupta', role: 'UI/UX Designer', initials: 'NG', desc: 'Farmer-centric design, research' },
]

const timeline = [
  { year: '2024', title: 'Idea & Research', desc: 'Identified the need for technology-driven solutions for Indian farmers.' },
  { year: '2025', title: 'Platform Development', desc: 'Built the core platform with crop intelligence, community, and market features.' },
  { year: '2026', title: 'AI Integration', desc: 'Added voice AI assistant, LLM-powered recommendations, and real-time analytics.' },
  { year: 'Future', title: 'Scale Nationwide', desc: 'Expand to all states, add IoT sensors, satellite monitoring, and government scheme integration.' },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function About() {
  return (
    <motion.div className="page-wrapper about-page" {...pageTransition}>
      <div className="container">
        {/* Mission */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="mission-grid">
            <ScrollReveal direction="left">
              <div className="mission-text">
                <h2>
                  Our <span className="gradient-text">Mission</span>
                </h2>
                <p>
                  India has over 140 million farmers, many of whom still lack
                  access to digital agricultural tools, real-time market data,
                  and expert farming guidance. This creates a massive opportunity
                  for technology-driven agricultural platforms.
                </p>
                <p>
                  <strong style={{ color: 'var(--color-accent)' }}>Annadata AI</strong> aims
                  to become a scalable digital ecosystem connecting farmers,
                  experts, markets, and logistics services across India —
                  empowering better decisions for higher income.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="mission-visual">
                <div className="mission-stat-card">
                  <div className="stat-emoji">🌾</div>
                  <h3><AnimatedCounter end={140} suffix="M+" /></h3>
                  <p>Indian Farmers</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">📈</div>
                  <h3><AnimatedCounter end={200} suffix="+" /></h3>
                  <p>Crop Varieties</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">🗣️</div>
                  <h3><AnimatedCounter end={12} suffix="" /></h3>
                  <p>Languages</p>
                </div>
                <div className="mission-stat-card">
                  <div className="stat-emoji">📱</div>
                  <h3><AnimatedCounter end={28} suffix="" /></h3>
                  <p>States Covered</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Vision */}
        <section className="section">
          <SectionHeader
            tag="Our Vision"
            title="Empowered Farmers → Better Decisions → Higher Income"
          />
          <div className="vision-grid">
            {visionCards.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <motion.div
                  className="vision-card"
                  whileHover={{ y: -4 }}
                >
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
          <SectionHeader
            tag="Technology"
            title="Built with Modern Tech"
            subtitle="Our platform combines AI, cloud infrastructure, and real-time APIs to deliver smart, scalable agricultural solutions."
          />
          <div className="tech-grid">
            {techStack.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.05}>
                <motion.div
                  className="tech-item"
                  whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)' }}
                >
                  <div className="tech-icon">{t.icon}</div>
                  <p>{t.name}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="section">
          <SectionHeader
            tag="Our Team"
            title="The People Behind Annadata"
            subtitle="A passionate team of developers, designers, and agricultural enthusiasts."
          />
          <div className="team-grid">
            {team.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 0.1}>
                <motion.div
                  className="team-card"
                  whileHover={{ y: -4 }}
                >
                  <div className="team-avatar">{m.initials}</div>
                  <h4>{m.name}</h4>
                  <p className="team-role">{m.role}</p>
                  <p>{m.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="section">
          <SectionHeader
            tag="Our Journey"
            title="Building the Future of Farming"
          />
          <div className="about-timeline">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 0.1}>
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <h4>{item.year}</h4>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default About
