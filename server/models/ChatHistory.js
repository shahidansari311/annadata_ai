import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  sessionId: {
    type: String,
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

chatHistorySchema.index({ user: 1, createdAt: -1 })
chatHistorySchema.index({ sessionId: 1 })

export default mongoose.model('ChatHistory', chatHistorySchema)
