import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  startLevel: { type: String, required: true }
})

const UserStateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  xp: { type: Number, default: 0 },
  lessonsWatched: { type: [String], default: [] },
  completedModules: { type: [String], default: [] },
  correctCount: { type: Number, default: 0 },
  quizScore: { type: Number, default: 0 },
  intermediateUnlocked: { type: Boolean, default: false },
  advancedUnlocked: { type: Boolean, default: false },
  allocations: { type: Map, of: Number, default: {} },
  startingLevel: { type: String, default: 'beginner' }
})

export const User = mongoose.model('User', UserSchema)
export const UserState = mongoose.model('UserState', UserStateSchema)
