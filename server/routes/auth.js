import express from 'express'
import admin from 'firebase-admin'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Lazy-init Firebase Admin SDK (deferred so dotenv.config() has run)
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  }
  return admin
}

// ── POST /api/auth/firebase-login ──────────────────────────
// Frontend sends Firebase ID token after phone auth, backend verifies and issues JWT
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ error: 'Firebase ID token is required.' })
    }

    // Verify the Firebase ID token
    const firebaseAdmin = getFirebaseAdmin()
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)
    const phone = decodedToken.phone_number

    if (!phone) {
      return res.status(400).json({ error: 'Phone number not found in token.' })
    }

    // Remove country code (+91) for storage, keep last 10 digits
    const phoneClean = phone.replace(/^\+91/, '').replace(/\D/g, '').slice(-10)

    // Find or create user
    let user = await User.findOne({ phone: phoneClean })
    let isNewUser = false

    if (!user) {
      user = await User.create({
        phone: phoneClean,
        isVerified: true,
        firebaseUid: decodedToken.uid,
      })
      isNewUser = true
    } else {
      // Update Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = decodedToken.uid
        await user.save()
      }
      user.isVerified = true
      await user.save()
    }

    // Generate JWT for our backend
    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified,
      },
      isNewUser,
      message: isNewUser ? 'Account created successfully!' : 'Login successful!',
    })
  } catch (err) {
    console.error('Firebase auth error:', err)

    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please try again.' })
    }
    if (err.code === 'auth/argument-error' || err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Invalid token. Please try again.' })
    }

    res.status(500).json({ error: 'Authentication failed. Please try again.' })
  }
})

// ── GET /api/auth/me ───────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      phone: req.user.phone,
      name: req.user.name,
      state: req.user.state,
      district: req.user.district,
      role: req.user.role,
      isVerified: req.user.isVerified,
    },
  })
})

// ── PUT /api/auth/profile ──────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, state, district, preferredLanguage } = req.body
    const user = await User.findById(req.user._id)

    if (name !== undefined) user.name = name
    if (state !== undefined) user.state = state
    if (district !== undefined) user.district = district
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage

    await user.save()

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified,
      },
      message: 'Profile updated successfully!',
    })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ error: 'Failed to update profile.' })
  }
})

export default router
