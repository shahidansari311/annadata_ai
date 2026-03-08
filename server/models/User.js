import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
  },
  name: {
    type: String,
    default: '',
    maxlength: 100,
  },
  firebaseUid: {
    type: String,
    default: null,
    sparse: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['farmer', 'expert', 'admin'],
    default: 'farmer',
  },
  state: {
    type: String,
    default: '',
  },
  district: {
    type: String,
    default: '',
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en',
  },
}, {
  timestamps: true,
})

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v
  return obj
}

export default mongoose.model('User', userSchema)
