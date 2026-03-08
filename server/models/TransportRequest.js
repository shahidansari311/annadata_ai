import mongoose from 'mongoose'

const transportRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cropType: { type: String, required: true },
  weight: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  preferredDate: { type: Date },
  notes: { type: String, default: '', maxlength: 1000 },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  assignedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportProvider',
    default: null,
  },
  trackingSteps: [{
    label: String,
    labelHi: String,
    time: String,
    icon: String,
    status: {
      type: String,
      enum: ['completed', 'active', 'pending'],
      default: 'pending',
    },
  }],
}, {
  timestamps: true,
})

transportRequestSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('TransportRequest', transportRequestSchema)
