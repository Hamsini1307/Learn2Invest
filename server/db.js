import mongoose from 'mongoose'

export async function initDb(uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    })
    console.log('Successfully connected to MongoDB Atlas.')
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err?.message || err)
    throw err
  }
}

