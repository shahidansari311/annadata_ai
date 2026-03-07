import { motion } from 'framer-motion'
import { Star, MapPin, Phone, Clock, Package, Truck as TruckIcon, CheckCircle, Navigation } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ScrollReveal from '../components/ScrollReveal'
import './Transport.css'

const drivers = [
  {
    name: 'Vijay Transport',
    vehicle: 'Tata Ace — 1.5 Ton',
    rating: 4.8,
    trips: 234,
    distance: '12 km away',
    emoji: '🚛',
    available: true,
  },
  {
    name: 'Raju Logistics',
    vehicle: 'Mahindra Bolero Pickup — 2 Ton',
    rating: 4.6,
    trips: 189,
    distance: '18 km away',
    emoji: '🚚',
    available: true,
  },
  {
    name: 'Singh Transport Co.',
    vehicle: 'Ashok Leyland Ecomet — 5 Ton',
    rating: 4.9,
    trips: 412,
    distance: '25 km away',
    emoji: '🚛',
    available: true,
  },
  {
    name: 'Krishna Carriers',
    vehicle: 'Tata 407 — 3.5 Ton',
    rating: 4.5,
    trips: 156,
    distance: '8 km away',
    emoji: '🚚',
    available: false,
  },
]

const trackingSteps = [
  { label: 'Order Placed', time: '10:30 AM', icon: '📋', status: 'completed' },
  { label: 'Driver Assigned', time: '10:45 AM', icon: '👤', status: 'completed' },
  { label: 'Pickup Done', time: '12:15 PM', icon: '📦', status: 'completed' },
  { label: 'In Transit', time: 'Now', icon: '🚛', status: 'active' },
  { label: 'Delivered', time: 'Expected 3 PM', icon: '✅', status: 'pending' },
]

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function Transport() {
  return (
    <motion.div className="page-wrapper transport-page" {...pageTransition}>
      <div className="container">
        <SectionHeader
          tag="Logistics"
          title="Farm to Mandi Transport"
          subtitle="Request crop pickup, connect with verified transport providers, and track your deliveries in real time."
        />

        <div className="transport-layout">
          {/* Request Form */}
          <ScrollReveal direction="left">
            <div className="transport-form-card">
              <h3>Request Pickup</h3>
              <p>Fill in your details and we'll connect you with nearby transport providers.</p>

              <div className="form-group">
                <label>Crop Type</label>
                <select defaultValue="wheat">
                  <option value="wheat">Wheat (गेहूं)</option>
                  <option value="rice">Rice (चावल)</option>
                  <option value="cotton">Cotton (कपास)</option>
                  <option value="soybean">Soybean (सोयाबीन)</option>
                  <option value="sugarcane">Sugarcane (गन्ना)</option>
                  <option value="maize">Maize (मक्का)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight (Quintals)</label>
                  <input type="number" placeholder="e.g., 50" defaultValue="25" />
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" />
                </div>
              </div>

              <div className="form-group">
                <label>Pickup Location</label>
                <input type="text" placeholder="Village, Tehsil, District" defaultValue="Hoshangabad, MP" />
              </div>

              <div className="form-group">
                <label>Delivery Destination (Mandi)</label>
                <input type="text" placeholder="Mandi name or city" defaultValue="Bhopal Mandi" />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea placeholder="Any special instructions for pickup..." />
              </div>

              <motion.button
                className="form-submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Find Transport Providers
              </motion.button>
            </div>
          </ScrollReveal>

          {/* Drivers */}
          <ScrollReveal direction="right">
            <div className="drivers-section">
              <h3>Nearby Providers</h3>
              <div className="drivers-list">
                {drivers.map((d, i) => (
                  <motion.div
                    key={d.name}
                    className="driver-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="driver-avatar">{d.emoji}</div>
                    <div className="driver-info">
                      <h4>{d.name}</h4>
                      <p className="driver-vehicle">{d.vehicle}</p>
                      <div className="driver-meta">
                        <span className="driver-rating">
                          <Star size={12} /> {d.rating}
                        </span>
                        <span>{d.trips} trips</span>
                        <span>
                          <MapPin size={12} /> {d.distance}
                        </span>
                      </div>
                    </div>
                    <button className="driver-contact" style={{
                      opacity: d.available ? 1 : 0.5,
                      pointerEvents: d.available ? 'auto' : 'none',
                    }}>
                      {d.available ? 'Contact' : 'Busy'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Tracking Timeline */}
        <div className="tracking-section section">
          <ScrollReveal>
            <h3 style={{ textAlign: 'center' }}>Delivery Tracking</h3>
            <div className="tracking-timeline">
              {trackingSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  className={`tracking-step ${step.status}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="tracking-dot">{step.icon}</div>
                  <div>
                    <h4>{step.label}</h4>
                    <p>{step.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </motion.div>
  )
}

export default Transport
