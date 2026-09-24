import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { initDb } from './db.js'
import { User, UserState } from './models.js'
import { localUser, localUserState } from './localDb.js'

let dbUser = localUser
let dbUserState = localUserState

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

const JWT_SECRET = process.env.JWT_SECRET || 'learn2invest_jwt_secret_key_13579'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learn2invest'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const PORT = process.env.PORT || 5000

// Authenticate token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Access token missing' })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' })
    req.user = decoded
    next()
  })
}

// 1. Auth: Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, startLevel } = req.body
  
  if (!name || !email || !password || !startLevel) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const formattedEmail = email.toLowerCase().trim()
    const existingUser = await dbUser.findOne({ email: formattedEmail })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create documents
    await dbUser.create({
      email: formattedEmail,
      name: name.trim(),
      passwordHash,
      startLevel
    })

    const intUnlocked = startLevel === 'intermediate'
    await dbUserState.create({
      email: formattedEmail,
      startingLevel: startLevel,
      intermediateUnlocked: intUnlocked
    })

    res.status(201).json({ message: 'Registration successful' })
  } catch (err) {
    console.error('Registration error:', err)
    if (err.message && (err.message.includes('already exists') || err.message.includes('duplicate'))) {
      return res.status(400).json({ error: 'This email is already registered. Please click "SIGN IN" to log in.' })
    }
    res.status(500).json({ error: err.message || 'Internal server error during registration' })
  }
})

// 2. Auth: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const formattedEmail = email.toLowerCase().trim()
    const user = await dbUser.findOne({ email: formattedEmail })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error during login' })
  }
})

// 3. State: Save progress
app.post('/api/state/save', authenticateToken, async (req, res) => {
  const {
    xp,
    lessonsWatched,
    completedModules,
    correctCount,
    quizScore,
    intermediateUnlocked,
    advancedUnlocked,
    allocations,
    startingLevel,
  } = req.body

  try {
    const formattedEmail = req.user.email.toLowerCase().trim()
    
    await dbUserState.findOneAndUpdate(
      { email: formattedEmail },
      {
        xp: xp || 0,
        lessonsWatched: lessonsWatched || [],
        completedModules: completedModules || [],
        correctCount: correctCount || 0,
        quizScore: quizScore || 0,
        intermediateUnlocked: !!intermediateUnlocked,
        advancedUnlocked: !!advancedUnlocked,
        allocations: allocations || {},
        startingLevel: startingLevel || 'beginner',
      },
      { upsert: true }
    )
    
    res.json({ message: 'Progress saved successfully' })
  } catch (err) {
    console.error('Save state error:', err)
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

// 4. State: Load progress
app.get('/api/state/load', authenticateToken, async (req, res) => {
  try {
    const formattedEmail = req.user.email.toLowerCase().trim()
    const user = await dbUser.findOne({ email: formattedEmail }, 'name email')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    let state = await dbUserState.findOne({ email: formattedEmail })
    if (!state) {
      // Fallback fallback if state row somehow missing
      state = await dbUserState.create({ email: formattedEmail })
    }
    
    // Convert Mongoose Map to plain object
    const allocationsObj = Object.fromEntries(state.allocations || new Map())

    const formattedState = {
      xp: state.xp,
      lessonsWatched: state.lessonsWatched || [],
      completedModules: state.completedModules || [],
      correctCount: state.correctCount,
      quizScore: state.quizScore,
      intermediateUnlocked: state.intermediateUnlocked,
      advancedUnlocked: state.advancedUnlocked,
      allocations: allocationsObj,
      startingLevel: state.startingLevel,
    }

    res.json({ user, state: formattedState })
  } catch (err) {
    console.error('Load state error:', err)
    res.status(500).json({ error: 'Failed to load progress' })
  }
})

// 5. Secure Gemini API Proxy
app.post('/api/chat', async (req, res) => {
  const { contents, systemInstruction, apiKey } = req.body
  const activeKey = apiKey || process.env.GEMINI_API_KEY

  if (!activeKey) {
    return res.status(400).json({ error: 'Gemini API key is not configured. Provide an API key in .env or via Chatbot settings.' })
  }

  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-pro']
  let lastError = null

  for (const model of models) {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`
    try {
      const bodyPayload = {
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 450 }
      }

      if (systemInstruction) {
        bodyPayload.systemInstruction = typeof systemInstruction === 'string'
          ? { parts: [{ text: systemInstruction }] }
          : systemInstruction
      }

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      })

      if (response.ok) {
        const data = await response.json()
        return res.json(data)
      }

      const errText = await response.text()
      lastError = { status: response.status, body: errText }
      console.warn(`Gemini API model ${model} failed with status ${response.status}. Trying next model...`)
    } catch (err) {
      lastError = err
      console.warn(`Gemini API request for model ${model} threw error:`, err)
    }
  }

  console.error('All Gemini API models failed:', lastError)
  res.status(lastError?.status || 500).json({
    error: 'Gemini service error',
    details: typeof lastError?.body === 'string' ? lastError.body : lastError?.message || 'All models failed'
  })
})

// 6. Admin: Get all users with stats
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  const email = req.user.email.toLowerCase()
  const isAdmin = email.includes('admin') || email === 'hamsini@example.com'
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access denied' })
  }

  try {
    const users = await dbUser.find({})
    const states = await dbUserState.find({})

    const formattedList = users.map(u => {
      const s = states.find(x => x.email.toLowerCase() === u.email.toLowerCase()) || {}
      return {
        name: u.name,
        email: u.email,
        startLevel: u.startLevel,
        xp: s.xp || 0,
        lessonsWatched: s.lessonsWatched || [],
        completedModules: s.completedModules || [],
        quizScore: s.quizScore || 0
      }
    })

    res.json(formattedList)
  } catch (err) {
    console.error('Fetch users admin error:', err)
    res.status(500).json({ error: 'Failed to fetch users list' })
  }
})

// 7. Admin: Delete user
app.delete('/api/admin/users/:email', authenticateToken, async (req, res) => {
  const callerEmail = req.user.email.toLowerCase()
  const isAdmin = callerEmail.includes('admin') || callerEmail === 'hamsini@example.com'
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access denied' })
  }

  const targetEmail = req.params.email.toLowerCase().trim()
  if (callerEmail === targetEmail) {
    return res.status(400).json({ error: 'You cannot delete yourself' })
  }

  try {
    // Delete both User and UserState records
    await dbUser.deleteOne({ email: targetEmail })
    await dbUserState.deleteOne({ email: targetEmail })
    res.json({ message: `User ${targetEmail} has been deleted` })
  } catch (err) {
    console.error('Delete user admin error:', err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Start listening immediately to avoid blocking client requests during DB connection timeouts
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})

// Initialize DB connection asynchronously in the background
initDb(MONGODB_URI).then(() => {
  console.log('Database connection initialized successfully with MongoDB.')
  dbUser = User
  dbUserState = UserState
}).catch(err => {
  console.warn('⚠️ MongoDB Atlas connection failed or offline.')
  console.warn('⚡ Using instant local JSON database (local_db.json) for ultra-fast performance!')
  dbUser = localUser
  dbUserState = localUserState
})

