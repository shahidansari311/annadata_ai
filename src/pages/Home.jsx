import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Wheat,
  Users,
  BarChart3,
  Truck,
  ArrowRight,
  Mic,
  Play,
  PlayCircle,
} from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import ParticleField from '../components/ParticleField'
import { useLang } from '../context/LanguageContext'
import './Home.css'

const testimonials = [
  {
    text: 'Annadata AI helped me understand which fertilizers to use for my wheat crop. My yield increased by 30% this season!',
    textHi: 'अन्नदाता AI ने मुझे समझने में मदद की कि मेरी गेहूं की फसल के लिए कौन से उर्वरक का उपयोग करना है। इस सीजन में मेरी उपज 30% बढ़ गई!',
    name: 'Ramesh Kumar',
    location: 'Madhya Pradesh',
    initials: 'RK',
  },
  {
    text: 'The mandi rate feature saves me time every day. I can compare prices and sell at the best rate without travelling to multiple markets.',
    textHi: 'मंडी भाव की सुविधा मुझे हर दिन समय बचाती है। मैं कई बाज़ारों में जाए बिना कीमतों की तुलना कर सकता हूं और सबसे अच्छे दाम पर बेच सकता हूं।',
    name: 'Sushila Devi',
    location: 'Rajasthan',
    initials: 'SD',
  },
  {
    text: 'I love the community feature. I got expert advice on pest control for my cotton crop within hours of asking my question.',
    textHi: 'मुझे समुदाय फीचर बहुत पसंद है। मेरे कपास की फसल के कीट नियंत्रण पर मुझे कुछ ही घंटों में विशेषज्ञ सलाह मिल गई।',
    name: 'Prakash Patil',
    location: 'Maharashtra',
    initials: 'PP',
  },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Home() {
  const { t, lang } = useLang()

  const features = [
    {
      icon: <Wheat size={28} />,
      title: t('features.cropIntel'),
      desc: t('features.cropIntelDesc'),
      link: '/crops',
    },
    {
      icon: <Users size={28} />,
      title: t('features.community'),
      desc: t('features.communityDesc'),
      link: '/community',
    },
    {
      icon: <BarChart3 size={28} />,
      title: t('features.mandiRates'),
      desc: t('features.mandiRatesDesc'),
      link: '/mandi-rates',
    },
    {
      icon: <Truck size={28} />,
      title: t('features.transport'),
      desc: t('features.transportDesc'),
      link: '/transport',
    },
  ]

  const steps = [
    { step: 1, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
    { step: 2, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
    { step: 3, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
  ]

  const howToSteps = t('howToUse.steps')

  return (
    <motion.div className="page-wrapper" {...pageTransition}>
      {/* ========= HERO ========= */}
      <section className="hero" id="hero">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-gradient-2" />
        <ParticleField />

        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              {t('hero.badge')}
            </div>

            <h1>
              {t('hero.title1')}{' '}
              <span className="gradient-text">{t('hero.title2')}</span>
            </h1>

            <p className="hero-subtitle">{t('hero.subtitle')}</p>

            <div className="hero-actions">
              <Link to="/crops" className="btn-primary">
                {t('hero.exploreCrops')} <ArrowRight size={18} />
              </Link>
              <Link to="/ai-assistant" className="btn-outline">
                <Mic size={18} /> {t('hero.tryAI')}
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {t('hero.scroll')}
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* ========= FEATURES ========= */}
      <section className="section" id="features">
        <div className="container">
          <SectionHeader
            tag={t('features.tag')}
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />

          <div className="features-grid">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <Link to={f.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    className="feature-card"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="feature-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========= STATS ========= */}
      <section className="section stats-section" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={140} suffix="M+" />
              </div>
              <div className="stat-label">{t('stats.farmers')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={200} suffix="+" />
              </div>
              <div className="stat-label">{t('stats.crops')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="stat-label">{t('stats.mandis')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={28} suffix="" />
              </div>
              <div className="stat-label">{t('stats.states')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= HOW IT WORKS ========= */}
      <section className="section" id="how-it-works">
        <div className="container">
          <SectionHeader
            tag={t('howItWorks.tag')}
            title={t('howItWorks.title')}
            subtitle={t('howItWorks.subtitle')}
          />

          <div className="how-it-works-grid">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.15}>
                <div className="step-card">
                  <motion.div
                    className="step-number"
                    whileHover={{ scale: 1.1, borderColor: '#c8f542' }}
                  >
                    {s.step}
                  </motion.div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========= HOW TO USE VIDEO ========= */}
      <section className="section how-to-use-section" id="how-to-use">
        <div className="container">
          <SectionHeader
            tag={t('howToUse.tag')}
            title={t('howToUse.title')}
            subtitle={t('howToUse.subtitle')}
            tagIcon={<Play size={14} />}
          />

          <div className="how-to-use-layout">
            <ScrollReveal direction="left">
              <div className="video-player-card">
                <div className="video-embed-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title={t('howToUse.videoTitle')}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-info">
                  <div className="video-info-left">
                    <h4>{t('howToUse.videoTitle')}</h4>
                    <span>{t('howToUse.duration')}</span>
                  </div>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline video-full-btn"
                  >
                    <PlayCircle size={16} /> {t('howToUse.watchFull')}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="video-steps">
                {Array.isArray(howToSteps) && howToSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="video-step-item"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="video-step-num">{i + 1}</div>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========= TESTIMONIALS ========= */}
      <section className="section" id="testimonials">
        <div className="container">
          <SectionHeader
            tag={t('testimonials.tag')}
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
          />

          <div className="testimonials-grid">
            {testimonials.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 0.1}>
                <div className="testimonial-card">
                  <span className="testimonial-quote">"</span>
                  <p>{lang === 'hi' ? item.textHi : item.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{item.initials}</div>
                    <div className="testimonial-info">
                      <h4>{item.name}</h4>
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========= CTA ========= */}
      <section className="section cta-section" id="cta">
        <div className="container">
          <ScrollReveal>
            <div className="cta-content">
              <h2>
                {t('cta.title1')} <span className="gradient-text">{t('cta.title2')}</span>?
              </h2>
              <p>{t('cta.subtitle')}</p>
              <div className="cta-actions">
                <Link to="/crops" className="btn-primary">
                  {t('cta.getStarted')} <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-outline">
                  {t('cta.learnMore')}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
