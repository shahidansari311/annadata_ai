import express from 'express'
import TransportProvider from '../models/TransportProvider.js'
import TransportRequest from '../models/TransportRequest.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── GET /api/transport/providers ────────────────────────────
router.get('/providers', async (req, res) => {
  try {
    const providers = await TransportProvider.find().sort({ rating: -1 })
    res.json({ providers })
  } catch (err) {
    console.error('Providers fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch providers.' })
  }
})

// ── POST /api/transport/requests ───────────────────────────
router.post('/requests', protect, async (req, res) => {
  try {
    const { cropType, weight, pickupLocation, destination, preferredDate, notes } = req.body

    if (!cropType || !weight || !pickupLocation || !destination) {
      return res.status(400).json({ error: 'Crop type, weight, pickup location, and destination are required.' })
    }

    const request = await TransportRequest.create({
      user: req.user._id,
      cropType,
      weight,
      pickupLocation,
      destination,
      preferredDate: preferredDate || null,
      notes: notes || '',
      trackingSteps: [
        { label: 'Order Placed', labelHi: 'ऑर्डर दिया', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), icon: '📋', status: 'completed' },
        { label: 'Driver Assigned', labelHi: 'ड्राइवर सौंपा', time: 'Pending', icon: '👤', status: 'pending' },
        { label: 'Pickup Done', labelHi: 'पिकअप हो गया', time: 'Pending', icon: '📦', status: 'pending' },
        { label: 'In Transit', labelHi: 'रास्ते में', time: 'Pending', icon: '🚛', status: 'pending' },
        { label: 'Delivered', labelHi: 'डिलीवर हो गया', time: 'Pending', icon: '✅', status: 'pending' },
      ],
    })

    res.status(201).json({ success: true, request })
  } catch (err) {
    console.error('Transport request error:', err)
    res.status(500).json({ error: 'Failed to create transport request.' })
  }
})

// ── GET /api/transport/requests ────────────────────────────
router.get('/requests', protect, async (req, res) => {
  try {
    const requests = await TransportRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedProvider')

    res.json({ requests })
  } catch (err) {
    console.error('Transport requests fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch requests.' })
  }
})

// ── GET /api/transport/requests/:id ────────────────────────
router.get('/requests/:id', protect, async (req, res) => {
  try {
    const request = await TransportRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('assignedProvider')

    if (!request) {
      return res.status(404).json({ error: 'Request not found.' })
    }

    res.json({ request })
  } catch (err) {
    console.error('Transport request fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch request.' })
  }
})

export default router
