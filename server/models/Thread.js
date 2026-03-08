import mongoose from 'mongoose'

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 300 },
  titleHi: { type: String, default: '' },
  body: { type: String, required: true, maxlength: 5000 },
  bodyHi: { type: String, default: '' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  authorName: { type: String, default: 'Anonymous' },
  votes: { type: Number, default: 0 },
  answerCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  tagsHi: [{ type: String }],
  badges: [{ type: String }],
  category: {
    type: String,
    enum: ['crop-advisory', 'pest-control', 'irrigation', 'schemes', 'soil', 'general'],
    default: 'general',
  },
}, {
  timestamps: true,
})

threadSchema.index({ category: 1, createdAt: -1 })
threadSchema.index({ title: 'text', body: 'text' })

export default mongoose.model('Thread', threadSchema)
