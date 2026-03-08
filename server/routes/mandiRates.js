import express from 'express'
import MandiRate from '../models/MandiRate.js'

const router = express.Router()

// ── GET /api/mandi-rates ───────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { state, district, search } = req.query
    const filter = {}

    if (state) filter.state = state
    if (district) filter.district = district
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameHi: { $regex: search, $options: 'i' } },
      ]
    }

    const rates = await MandiRate.find(filter).sort({ name: 1 })

    // Get unique states and districts for dropdowns
    const states = await MandiRate.distinct('state')
    const districts = state
      ? await MandiRate.distinct('district', { state })
      : await MandiRate.distinct('district')

    res.json({ rates, states, districts })
  } catch (err) {
    console.error('Mandi rates fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch mandi rates.' })
  }
})

// ── GET /api/mandi-rates/:id ───────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const rate = await MandiRate.findById(req.params.id)
    if (!rate) {
      return res.status(404).json({ error: 'Rate not found.' })
    }
    res.json({ rate })
  } catch (err) {
    console.error('Mandi rate fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch rate.' })
  }
})

export default router
