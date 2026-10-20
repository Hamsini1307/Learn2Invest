import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI } from '@google/genai'
import { initDb } from './db.js'
import { User, UserState } from './models.js'
import { localUser, localUserState } from './localDb.js'

let dbUser = localUser
let dbUserState = localUserState

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

process.on('uncaughtException', (err) => {
  if (err?.name === 'MongooseServerSelectionError' || err?.message?.includes('MongoDB') || err?.name === 'MongoNetworkError') {
    console.warn('⚠️ Mongoose background error handled gracefully:', err.message || err)
    return
  }
  console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason) => {
  if (reason?.name === 'MongooseServerSelectionError' || reason?.message?.includes('MongoDB')) {
    console.warn('⚠️ Mongoose unhandled rejection handled gracefully:', reason.message || reason)
    return
  }
  console.error('Unhandled Rejection:', reason)
})

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

    await dbUserState.create({
      email: formattedEmail,
      startingLevel: startLevel,
      intermediateUnlocked: false,
      advancedUnlocked: false,
      level1Completed: false,
      level2Completed: false,
      level3Completed: false,
      lessonsWatched: []
    })

    const token = jwt.sign({ email: formattedEmail }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { name: name.trim(), email: formattedEmail, startLevel }
    })
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
    res.json({ token, user: { name: user.name, email: user.email, startLevel: user.startLevel } })
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
    level1Completed,
    level2Completed,
    level3Completed,
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
        level1Completed: !!level1Completed,
        level2Completed: !!level2Completed,
        level3Completed: !!level3Completed,
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
    const user = await dbUser.findOne({ email: formattedEmail }, 'name email startLevel')
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
      intermediateUnlocked: !!state.intermediateUnlocked,
      advancedUnlocked: !!state.advancedUnlocked,
      level1Completed: !!state.level1Completed,
      level2Completed: !!state.level2Completed,
      level3Completed: !!state.level3Completed,
      allocations: allocationsObj,
      startingLevel: state.startingLevel || user.startLevel || 'beginner',
    }

    res.json({ user, state: formattedState })
  } catch (err) {
    console.error('Load state error:', err)
    res.status(500).json({ error: 'Failed to load progress' })
  }
})

// 6. Live Leaderboard: Fetch actual registered users from database sorted by XP
app.get('/api/leaderboard', async (req, res) => {
  try {
    const allUsers = await dbUser.find({}, 'name email')
    const allStates = await dbUserState.find({})

    const userMap = new Map()
    allUsers.forEach(u => userMap.set(u.email, u.name))

    const leaderboard = allStates.map(st => {
      const userName = userMap.get(st.email) || 'Learner'
      const levelLabel = st.advancedUnlocked ? 'Portfolio Tower (L3)' : st.intermediateUnlocked ? 'Investment Lab (L2)' : 'School (L1)'
      const badgeLabel = st.advancedUnlocked ? '🏆 Legend' : st.intermediateUnlocked ? '🚀 SIP Wizard' : '🌱 Early Saver'
      return {
        email: st.email,
        name: userName,
        xp: st.xp || 0,
        level: levelLabel,
        badge: badgeLabel,
        avatar: st.advancedUnlocked ? '👩‍💼' : st.intermediateUnlocked ? '👨‍🎓' : '👦'
      }
    })

    leaderboard.sort((a, b) => b.xp - a.xp)
    res.json({ leaderboard })
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// 5. Independent AI Chatbot Endpoint (Zero Predefined Rules — Pure Live AI Inference)
app.post('/api/chat', async (req, res) => {
  const {
    message,
    contents,
    systemInstruction,
    userContext = {},
    previousInteractionId,
  } = req.body

  const latestUserMessage =
    message ||
    (Array.isArray(contents) && contents.length > 0
      ? contents[contents.length - 1]?.parts?.[0]?.text || ''
      : '')

  const completedLevels = Array.isArray(userContext?.completedLevels)
    ? userContext.completedLevels.map(Number)
    : []

  const baseSystemPrompt = `You are Luna, the intelligent, friendly, and project-aware AI assistant and financial mentor inside Learn2Invest.

LEARN2INVEST PROJECT CONTEXT & ARCHITECTURE:
Learn2Invest is an interactive 3D gamified Indian financial literacy learning platform using virtual money for educational simulations.
1. LEVEL 1 - SCHOOL ENVIRONMENT (Classroom):
   - 5 Financial Literacy Video Lessons (Saving basics, compounding, banking fundamentals).
   - 10-Question Examination Quiz (+100 XP upon passing).
2. LEVEL 2 - GOVERNMENT DISTRICT (Investment Lab):
   - Computer 1 (6 Scheme Simulators): Public Provident Fund (PPF @ 7.1%), Fixed Deposit (FD @ 6.5%), National Savings Certificate (NSC @ 7.7%), Sukanya Samriddhi Yojana (SSY @ 8.2%), Recurring Deposit (RD @ 6.7%), Post Office Monthly Income Scheme (MIS @ 7.4%). Math calculation: Monthly * (((1 + r/12)^(years*12) - 1) / (r/12)) * (1 + r/12).
   - Computer 2 (Savings Mixer Studio): User mixes allocations across PPF (30%), FD (25%), NSC (20%), SSY (15%), RD (10%) totaling 100% to calculate blended interest returns.
   - Computer 3 (Portfolio Simulation & Smart Allocation): Asset diversification across Fixed Income (FD/PPF), Nifty 50 Index Funds, Equity Mutual Funds, Gold ETFs. Rule: No fixed required number of investments, but allocating across 2-4 asset classes balances safety and growth. Smart Allocation provides an educational algorithmic suggestion based on risk profile, not guaranteed financial advice.
3. LEVEL 3 - FUTURISTIC CITY (Portfolio Tower & Banking Hub):
   - Banking Hub: Practice with 5 Indian Institutions — Canara Bank (IFSC: CNRB0001001), Karnataka Bank Ltd. (KARB0000501), Post Office Savings Bank (IPOS0000001), Punjab National Bank (PUNB0034200), State Bank of India (SBIN0000840).
   - Bank Slip Operations: 3 Form categories per institution (Cash Deposit Pay-In Slip with Left Counterfoil & Right Bank Copy, Cash Withdrawal Slip, Cheque Slip). Fields: Account Number (left counterfoil & right main boxes), Date (DD/MM/YYYY top right), Amount in Words (designated rupees line), Amount in Figures (₹ box), Depositor Signature (above signature line), IFSC Code (11-character bank branch identifier).
4. DIGITAL SAFETY:
   - OTP Protection (Never share 6-digit OTPs or PINs with anyone).
   - Phishing & Scam Detection (Spotting suspicious link shorteners, fake emergency calls, promises of guaranteed double returns).
5. VIRTUAL SIMULATION DISCLAIMER:
   - All investments, balances, and profits in Learn2Invest use educational virtual money for learning.

CHATBOT BEHAVIOR RULES:
- Semantic Intent & Typo Handling: Understand misspelled or informal queries ("portfoliyo sim", "savings mix", "smart alocation", "banking hub explain", "what we doing here") seamlessly.
- Current Screen Context: If user is on a specific screen (e.g. Portfolio Simulation or Banking Hub) and asks "why did this change?" or "where do I put account number?", answer in context of that active screen/feature.
- Character Level Summaries: Only provide a completed-level summary if the user has actually completed that level (check completedLevels). If a level is NOT completed, explicitly say: "Level X hasn't been completed yet by your character, so I don't have a completed Level X summary for you yet. Complete Level X to unlock its summary!"
- Response Length: Adapt length appropriately. Simple questions (e.g. "What is SIP?") get short, clear answers (2-3 sentences). Complex queries get thorough structured breakdowns.
- Tone: Natural, encouraging, expert financial mentor speaking with ${userContext?.userName || 'a learner'}.

LIVE USER PROGRESS SNAPSHOT:
- User Name: ${userContext?.userName || 'Learner'}
- Active Screen: ${userContext?.currentScreen || 'Campus'}
- Current Level: Level ${userContext?.currentLevel || 1}
- Completed Levels: ${completedLevels.length > 0 ? completedLevels.map((l) => `Level ${l}`).join(', ') : 'None yet'}
- Wallet XP: ${userContext?.xp ?? 0} XP
- Lessons Watched: ${userContext?.lessonsWatchedCount ?? 0}/5
- Quiz Score: ${userContext?.quizScore ?? 0}/10
- Current Allocations: ${JSON.stringify(userContext?.allocations || {})}`

  const effectiveSystemInstruction =
    typeof systemInstruction === 'string' && systemInstruction.trim()
      ? `${baseSystemPrompt}\n\n${systemInstruction}`
      : baseSystemPrompt

  // Build standard OpenAI-compatible multi-turn messages array
  const openAiMessages = [
    { role: 'system', content: effectiveSystemInstruction },
    ...(Array.isArray(contents) && contents.length > 0
      ? contents.slice(-10).map((c) => ({
          role: c.role === 'user' ? 'user' : 'assistant',
          content: c?.parts?.[0]?.text || '',
        }))
      : [{ role: 'user', content: latestUserMessage }]),
  ]

  // 1. Primary Independent Live LLM Inference (Pollinations OpenAI endpoint — fast, accurate, never 403-blocked)
  try {
    const llmRes = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: openAiMessages,
        temperature: 0.6,
      }),
    })
    if (llmRes.ok) {
      const llmData = await llmRes.json()
      const replyText = llmData?.choices?.[0]?.message?.content
      if (replyText && replyText.trim()) {
        return res.json({
          reply: replyText.trim(),
          model: 'openai-independent',
          candidates: [
            {
              content: {
                parts: [{ text: replyText.trim() }],
              },
            },
          ],
        })
      }
    }
  } catch (err) {
    console.warn('Primary independent LLM fetch warning:', err?.message || err)
  }

  // 2. Secondary Fallback: Google GenAI SDK if a valid GEMINI_API_KEY is configured
  const activeKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (activeKey) {
    const conversationText = Array.isArray(contents) && contents.length > 0
      ? contents
          .slice(-8)
          .map((c) => `${c.role === 'user' ? 'User' : 'Luna'}: ${c?.parts?.[0]?.text || ''}`)
          .join('\n')
      : latestUserMessage

    const ai = new GoogleGenAI({ apiKey: activeKey })
    const preferredModels = ['gemini-2.5-flash', 'gemini-flash-latest']
    for (const model of preferredModels) {
      try {
        const interactionParams = {
          model,
          input: conversationText || latestUserMessage,
          system_instruction: effectiveSystemInstruction,
        }
        if (previousInteractionId) {
          interactionParams.previous_interaction_id = previousInteractionId
        }
        const interaction = await ai.interactions.create(interactionParams)
        const replyText = interaction?.output_text
        if (replyText && replyText.trim()) {
          return res.json({
            reply: replyText.trim(),
            interactionId: interaction.id,
            model,
            candidates: [
              {
                content: {
                  parts: [{ text: replyText.trim() }],
                },
              },
            ],
          })
        }
      } catch (err) {
        console.warn(`@google/genai (${model}) failed:`, err?.message || err)
      }
    }
  }

  res.status(500).json({
    error: 'AI service temporarily unavailable',
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
app.listen(PORT, '0.0.0.0', () => {
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

