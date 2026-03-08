import express from 'express'
import Crop from '../models/Crop.js'
import { generateCropDetails } from '../services/aiService.js'

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

    let crops = await Crop.find(filter).sort({ name: 1 })

    // If search yields no results, dynamically generate from AI and save
    if (search && crops.length === 0) {
      const generatedData = await generateCropDetails(search)
      if (generatedData) {
        // Enforce enum validation
        if (!['kharif', 'rabi', 'zaid'].includes(generatedData.season)) {
          generatedData.season = 'kharif'
        }
        
        try {
          // Save to DB so subsequent searches are fast
          const newCrop = new Crop(generatedData)
          await newCrop.save()
          crops = [newCrop]
        } catch (dbErr) {
          // If save fails (e.g. duplicate key), just return the generated data
          console.error('Failed to save generated crop:', dbErr.message)
          crops = [generatedData]
        }
      }
    }

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
