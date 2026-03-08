import mongoose from 'mongoose'

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  emoji: { type: String, default: '🌱' },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid'],
    required: true,
  },
  soil: { type: String, required: true },
  water: { type: String, required: true },
  temp: { type: String, required: true },
  duration: { type: String, required: true },
  durationHi: { type: String, default: '' },
  pests: [{ type: String }],
  fertilizer: [{ type: String }],
  irrigation: [{ type: String }],
  tags: [{ type: String }],
  tagsHi: [{ type: String }],
}, {
  timestamps: true,
})

// Text index for search
cropSchema.index({ name: 'text', nameHi: 'text', tags: 'text' })

export default mongoose.model('Crop', cropSchema)
