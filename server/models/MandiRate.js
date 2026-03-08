import mongoose from 'mongoose'

const mandiRateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  emoji: { type: String, default: '🌾' },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable',
  },
  change: { type: String, default: '0%' },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  modal: { type: Number, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  sparkline: [{ type: Number }],
  unit: { type: String, default: 'qtl' },
}, {
  timestamps: true,
})

mandiRateSchema.index({ state: 1, district: 1 })
mandiRateSchema.index({ name: 1, state: 1, district: 1 })

export default mongoose.model('MandiRate', mandiRateSchema)
