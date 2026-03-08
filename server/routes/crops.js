import express from 'express'
import Crop from '../models/Crop.js'

const router = express.Router()

// ── GET /api/crops ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { season, search } = req.query
    const filter = {}

    if (season && season !== 'all') {
      filter.season = season
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameHi: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
        { tagsHi: { $elemMatch: { $regex: search, $options: 'i' } } },
      ]
    }

    const crops = await Crop.find(filter).sort({ name: 1 })
    res.json({ crops })
  } catch (err) {
    console.error('Crops fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch crops.' })
  }
})

// ── GET /api/crops/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found.' })
    }
    res.json({ crop })
  } catch (err) {
    console.error('Crop fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch crop.' })
  }
})

export default router
