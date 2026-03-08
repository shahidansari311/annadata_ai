import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import Crop from './models/Crop.js'
import Thread from './models/Thread.js'
import MandiRate from './models/MandiRate.js'
import TransportProvider from './models/TransportProvider.js'

import { cropsData } from './data/crops.js'
import { threadsData, commoditiesData, states, districts, providersData } from './data/seedData.js'

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Crop.deleteMany({})
    await Thread.deleteMany({})
    await MandiRate.deleteMany({})
    await TransportProvider.deleteMany({})

    // Seed crops
    await Crop.insertMany(cropsData)
    console.log(`🌾 Seeded ${cropsData.length} crops`)

    // Seed community threads
    await Thread.insertMany(threadsData)
    console.log(`💬 Seeded ${threadsData.length} community threads`)

    // Seed mandi rates — create rates for each state with each district
    const mandiRates = []
    for (const state of states) {
      const stateDistricts = districts[state]
      if (!stateDistricts) continue
      for (const district of stateDistricts) {
        for (const commodity of commoditiesData) {
          // Add slight price variation per district to simulate real market differences
          const variation = Math.random() * 0.08 - 0.04 // ±4%
          mandiRates.push({
            ...commodity,
            state,
            district,
            min: Math.round(commodity.min * (1 + variation)),
            max: Math.round(commodity.max * (1 + variation)),
            modal: Math.round(commodity.modal * (1 + variation)),
          })
        }
      }
    }
    await MandiRate.insertMany(mandiRates)
    console.log(`📊 Seeded ${mandiRates.length} mandi rates across ${states.length} states`)

    // Seed transport providers
    await TransportProvider.insertMany(providersData)
    console.log(`🚛 Seeded ${providersData.length} transport providers`)

    console.log('\n✅ Seed complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()
