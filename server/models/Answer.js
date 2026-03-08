import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  body: { type: String, required: true, maxlength: 5000 },
  bodyHi: { type: String, default: '' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  authorName: { type: String, default: 'Anonymous' },
  votes: { type: Number, default: 0 },
}, {
  timestamps: true,
})

answerSchema.index({ thread: 1, createdAt: -1 })

export default mongoose.model('Answer', answerSchema)
