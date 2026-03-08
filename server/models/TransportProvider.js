import mongoose from 'mongoose'

const transportProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicle: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  trips: { type: Number, default: 0 },
  distance: { type: String, default: '' },
  distanceHi: { type: String, default: '' },
  emoji: { type: String, default: '🚛' },
  available: { type: Boolean, default: true },
  phone: { type: String, default: '' },
  state: { type: String, default: '' },
  district: { type: String, default: '' },
}, {
  timestamps: true,
})

export default mongoose.model('TransportProvider', transportProviderSchema)
