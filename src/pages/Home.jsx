import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Wheat,
  Users,
  BarChart3,
  Truck,
  ArrowRight,
  Mic,
  ChevronDown,
} from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import ParticleField from '../components/ParticleField'
import './Home.css'

const features = [
  {
    icon: <Wheat size={28} />,
    title: 'Crop Intelligence',
    desc: 'Get detailed insights on 200+ crops including soil requirements, irrigation schedules, pest management, and fertilizer recommendations tailored to your region.',
    link: '/crops',
  },
  {
    icon: <Users size={28} />,
    title: 'Expert Community',
    desc: 'Connect with agricultural experts, ask questions in your local language, and share knowledge with fellow farmers across India.',
    link: '/community',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Live Mandi Rates',
    desc: 'Track real-time commodity prices from mandis across districts. Compare rates, view trends, and make informed selling decisions.',
    link: '/mandi-rates',
  },
  {
    icon: <Truck size={28} />,
    title: 'Transport & Logistics',
    desc: 'Request crop pickup, connect with nearby transport providers, and track your deliveries from farm to mandi seamlessly.',
    link: '/transport',
  },
]

const testimonials = [
  {
    text: 'Annadata AI helped me understand which fertilizers to use for my wheat crop. My yield increased by 30% this season!',
    name: 'Ramesh Kumar',
    location: 'Madhya Pradesh',
    initials: 'RK',
  },
  {
    text: 'The mandi rate feature saves me time every day. I can compare prices and sell at the best rate without travelling to multiple markets.',
    name: 'Sushila Devi',
    location: 'Rajasthan',
    initials: 'SD',
  },
  {
    text: 'I love the community feature. I got expert advice on pest control for my cotton crop within hours of asking my question.',
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
              Empowering 140M+ Indian Farmers
            </div>

            <h1>
              Smart Farming{' '}
              <span className="gradient-text">Starts Here</span>
            </h1>

            <p className="hero-subtitle">
              AI-powered crop intelligence, real-time market data, community
              expertise, and logistics — everything a modern farmer needs, in
              one platform.
            </p>

            <div className="hero-actions">
              <Link to="/crops" className="btn-primary">
                Explore Crops <ArrowRight size={18} />
              </Link>
              <Link to="/ai-assistant" className="btn-outline">
                <Mic size={18} /> Try AI Assistant
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
          Scroll
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* ========= FEATURES ========= */}
      <section className="section" id="features">
        <div className="container">
          <SectionHeader
            tag="Platform Features"
            title="Everything Your Farm Needs"
            subtitle="From crop selection to market sale — Annadata AI supports every step of your agricultural journey with intelligent tools."
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
              <div className="stat-label">Indian Farmers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={200} suffix="+" />
              </div>
              <div className="stat-label">Crop Varieties</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="stat-label">Mandis Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={28} suffix="" />
              </div>
              <div className="stat-label">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= HOW IT WORKS ========= */}
      <section className="section" id="how-it-works">
        <div className="container">
          <SectionHeader
            tag="How It Works"
            title="Three Simple Steps"
            subtitle="Get started with Annadata AI in minutes — no complex setup required."
          />

          <div className="how-it-works-grid">
            {[
              {
                step: 1,
                title: 'Choose Your Crop',
                desc: 'Select your crop from our library or ask our AI assistant for recommendations based on your soil and climate.',
              },
              {
                step: 2,
                title: 'Get Smart Insights',
                desc: 'Receive AI-powered guidance on irrigation, fertilizers, pest control, and the best time to harvest.',
              },
              {
                step: 3,
                title: 'Sell at Best Price',
                desc: 'Check live mandi rates, compare prices across markets, and arrange transport directly from the platform.',
              },
            ].map((s, i) => (
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

      {/* ========= TESTIMONIALS ========= */}
      <section className="section" id="testimonials">
        <div className="container">
          <SectionHeader
            tag="Testimonials"
            title="Trusted by Farmers"
            subtitle="Hear from real farmers who are transforming their agricultural practices with Annadata AI."
          />

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="testimonial-card">
                  <span className="testimonial-quote">"</span>
                  <p>{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div className="testimonial-info">
                      <h4>{t.name}</h4>
                      <span>{t.location}</span>
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
                Ready to <span className="gradient-text">Grow Smarter</span>?
              </h2>
              <p>
                Join thousands of farmers already using Annadata AI to increase
                yields, reduce costs, and access better markets.
              </p>
              <div className="cta-actions">
                <Link to="/crops" className="btn-primary">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-outline">
                  Learn More
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
