import mongoose from 'mongoose'

export async function initDb(uri) {
  const timeoutMs = process.env.MONGODB_TIMEOUT_MS
    ? parseInt(process.env.MONGODB_TIMEOUT_MS, 10)
    : (process.env.NODE_ENV === 'production' ? 15000 : 5000)

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs,
    })
    console.log('Successfully connected to MongoDB Atlas.')
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err?.message || err)
    try {
      await mongoose.disconnect()
    } catch (_) {}
    throw err
  }
}
