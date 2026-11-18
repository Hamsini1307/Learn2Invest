# 📈 Learn2Invest — AI-Guided Virtual Simulator for Learning Indian Investments

> A full-stack **MERN** gamified financial literacy platform where students and first-time investors practise with **virtual money** across Fixed Deposits, Mutual Funds, Government Schemes, and Banking — with zero real financial risk.

---

## 🌐 Live Demo

> 🚧 Deployment in progress — run locally using the steps below.

---

## 🎮 What is Learn2Invest?

Learn2Invest is a **3D interactive investment education platform** built for Indian students and first-time investors. Users explore a fully animated 3D school campus, watch financial literacy video lessons, take MCQ quizzes, run virtual investment simulations, and practice filling real Indian bank slips — all without risking any real money.

The platform uses **gamification** (XP points, leaderboards, badges, level progression) to make financial education engaging and approachable.

---

## 🗺️ Learning Journey

```
🏫 Login → School Yard → Classroom 101 (5 Video Lessons)
        → Exam Room 103 (10-Question MCQ Quiz)
        → Floor 2 Computer Lab (3 Investment Simulators)
        → School Exit → 🏦 Futuristic City Bank
        → Bank Sections (Deposit Slips, Cyber Safety)
        → 🎉 Journey Complete
```

---

## ✨ Key Features

### 🏫 Level 1 — School World (3D)
- Fully hand-crafted **3D school campus** using React Three Fiber + Three.js (no game engine)
- Animated player characters **Luna** (girl) and **Leo** (boy) with walking, seated, and idle animations
- 8 autonomous **NPC students** patrolling the campus on waypoint routes
- **5 financial literacy video lessons** played on a 3D classroom projector
- Video stall **auto-recovery** — detects freezes and resumes automatically
- **Fullscreen cinema mode** for immersive video viewing
- **10-question MCQ exam** with persistent attempt saving (resume mid-quiz)
- Key Takeaways card shown after each lesson video
- Functional **wall clock**, financial wisdom **poster wall**, and chalkboard diagrams
- Day / Night mode toggle with dynamic lighting

### 💻 Level 2 — Government Investment Lab
- **Computer 1** — 6 Indian Government Scheme Simulators: PPF (7.1%), FD (7.25%), NSC (7.7%), Sukanya Samriddhi Yojana (8.2%), Recurring Deposit (6.5%), Post Office MIS (7.4%)
- **Computer 2** — Savings Mixer Studio with custom allocation sliders across 5 schemes
- **Computer 3** — Portfolio Simulator with Smart Allocation algorithm, Gap Period Analysis, and save-to-vault feature
- Saved simulations manager — view, edit, recalculate, and delete saved portfolios

### 🏦 Level 3 — Futuristic City Bank
- Practice filling **authentic Indian bank slips** for 5 real banks: SBI, PNB, Canara Bank, Karnataka Bank, Post Office Savings Bank
- Slip types: **Cash Deposit Pay-In Slip** (with counterfoil), **Withdrawal Slip**, **Cheque**
- Real-time **Razorpay IFSC API** validation for branch code verification
- **India Post PIN Code API** for branch location lookup
- **Digital Cyber Safety** — interactive scam detection (phishing SMS, fake lottery calls, OTP protection)

### 🤖 AI Chatbot (AIRA)
- Context-aware AI mentor powered by **Google Gemini API**
- Knows the user's current screen, XP, lessons watched, and quiz score
- 3-tier fallback: Gemini → Pollinations AI → Local Knowledge Engine
- **Voice input** (Web Speech API) and **voice output** (Speech Synthesis API)
- Answers financial questions in plain language with ₹ formatting

### 🎮 Gamification
- **XP system** — earn points by watching lessons, passing quizzes, saving simulations
- **Global leaderboard** with community rankings
- **Badges** and achievement tracking
- **Performance Report** — comprehensive scorecard
- **Theme Vault** — unlock custom color themes with XP
- **Character customization** — 5 outfit color themes (Classic, Emerald Mint, Royal Indigo, Sunset Coral, Cyber Gold)
- **Ice cream stall** — buy virtual ice cream, character holds it for 30 seconds 🍦

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **3D Engine** | Three.js, React Three Fiber, @react-three/drei |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **AI** | Google Gemini API (`@google/genai`) |
| **3rd Party APIs** | Razorpay IFSC API, India Post PIN API |
| **Browser APIs** | Web Speech API (voice input + output) |
| **Animations** | GSAP, CSS animations |

---

## 🏗️ Project Structure

```
Learn2Invest/
├── src/                        # React frontend
│   ├── App.jsx                 # Root component & global state
│   ├── three/                  # 3D world components
│   │   ├── Level1SchoolWorld.jsx      # Complete Level 1 (12,000+ lines)
│   │   ├── Level2GovernmentWorld.jsx  # Level 2 environment
│   │   ├── Level3FuturisticWorld.jsx  # Level 3 bank environment
│   │   ├── Level3BankZone3D.jsx       # 3D bank building
│   │   └── Level2ComputerScreens.jsx  # Investment simulator UIs
│   ├── screens/                # Additional screen components
│   ├── components/             # Reusable UI components
│   │   ├── AIRAChatPanel.jsx   # AI chatbot with voice I/O
│   │   └── ...
│   ├── utils/
│   │   └── soundEngine.js      # Ambient music & SFX controller
│   └── data.js                 # Quiz question bank & helpers
│
├── server/                     # Express.js backend
│   ├── server.js               # Main API server (Express + all routes)
│   ├── models.js               # Mongoose schemas (User, UserState)
│   ├── db.js                   # MongoDB Atlas connection
│   ├── localDb.js              # Local JSON fallback (adapter pattern)
│   ├── financialKnowledge.js   # Offline AI knowledge engine
│   └── .env                    # ← NOT committed (see .env.example)
│
├── public/
│   ├── videos/                 # Lesson MP4 files (video1–5.mp4)
│   └── images/                 # Character and UI images
│
├── .env.example                # Template for environment variables
└── package.json                # Root scripts (concurrently runs both servers)
```

---

## 🔌 Backend API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | ❌ | Register new user |
| `POST` | `/api/login` | ❌ | Login and receive JWT |
| `POST` | `/api/state/save` | ✅ JWT | Save user progress (XP, lessons, quiz) |
| `GET` | `/api/state/load` | ✅ JWT | Load saved user progress |
| `GET` | `/api/leaderboard` | ❌ | Fetch top players by XP |
| `POST` | `/api/chat` | ❌ | AI chatbot (Gemini + fallback) |
| `GET` | `/api/admin/users` | ✅ JWT | Admin — list all users |
| `DELETE` | `/api/admin/users/:email` | ✅ JWT | Admin — delete a user |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account (free tier) **OR** run without it (uses local JSON fallback automatically)

### 1. Clone the repository
```bash
git clone https://github.com/Hamsini1307/Learn2Invest.git
cd Learn2Invest
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learn2invest
JWT_SECRET=your_secure_random_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

> **Note:** If `MONGODB_URI` is unavailable, the app automatically falls back to a local `server/local_db.json` file — no data is lost.

### 5. Add lesson videos
Place MP4 files in `public/videos/`:
```
public/videos/video1.mp4
public/videos/video2.mp4
public/videos/video3.mp4
public/videos/video4.mp4
public/videos/video5.mp4
```

### 6. Run the application
```bash
npm run dev
```
This starts both servers concurrently:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000

---

## 🗃️ Database Schema

### User (Authentication)
```js
{
  email: String (unique, required),
  name: String (required),
  passwordHash: String (bcrypt hashed),
  startLevel: String ('beginner' | 'intermediate')
}
```

### UserState (Progress)
```js
{
  email: String,
  xp: Number,
  lessonsWatched: [String],
  completedModules: [String],
  quizScore: Number,
  quizAttempt: Mixed,       // flexible quiz state object
  level1Completed: Boolean,
  level2Completed: Boolean,
  level3Completed: Boolean,
  intermediateUnlocked: Boolean,
  allocations: Map<String, Number>
}
```

---

## 🔐 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10) — never stored in plain text
- **JWT tokens** (7-day expiry) for stateless authentication
- Protected API routes via `authenticateToken` middleware
- `.env` with secrets excluded from version control via `.gitignore`
- MongoDB error handling — graceful fallback prevents server crashes
- AI chatbot system prompt prevents prompt injection and credential exposure

---

## 🤖 AI Chatbot Fallback Chain

```
1. Google Gemini API (primary — tries 5 model variants)
        ↓ (if unavailable)
2. Pollinations AI (secondary — zero API key required)
        ↓ (if unavailable)
3. Local Knowledge Engine (offline — pre-written financial Q&A)
        ↓ (if no match)
4. Default guidance message
```
The chatbot **never fails with a 500 error** — always returns a useful response.

---

## 📸 Screenshots

> _Coming soon — screenshots of the 3D school world, classroom projector, investment simulators, and bank slip practice._

---

## 👩‍💻 Author

**Hamsini** — [GitHub](https://github.com/Hamsini1307)

---

## 📄 License

This project is for educational purposes. All investment amounts and returns shown are **virtual simulation only** — no real money is involved.

> ⚠️ **Disclaimer:** Learn2Invest is a 100% educational platform. All investments, returns, and balances are simulated with virtual money. This is not financial advice.
