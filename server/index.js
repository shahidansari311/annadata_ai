import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env from project root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

// Import routes
import authRoutes from './routes/auth.js'
import cropRoutes from './routes/crops.js'
import communityRoutes from './routes/community.js'
import mandiRateRoutes from './routes/mandiRates.js'
import transportRoutes from './routes/transport.js'
import aiRoutes from './routes/ai.js'

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'https://annadata-ai-xnords.vercel.app',
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean).map(url => url.replace(/\/$/, ''))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    
    const isAllowed = allowedOrigins.some(allowed => origin === allowed) || 
                     origin.endsWith('.vercel.app')
    
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Rate limit for auth endpoint
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: { error: 'Too many auth requests. Please wait and try again.' },
})
app.use('/api/auth', authLimiter)

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/crops', cropRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/mandi-rates', mandiRateRoutes)
app.use('/api/transport', transportRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

// ── MongoDB Connection ──────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
  }
}

// ── Server Start/Export ────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Annadata AI Server running on port ${PORT}`)
    })
  })
}

// For Vercel serverless functions
export default async (req, res) => {
  await connectDB()
  return app(req, res)
}
