import { useState, useEffect } from 'react'
import { modules } from '../data.js'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'
import MessageScamAnalyzer from '../components/MessageScamAnalyzer.jsx'

const CYBER_SCENARIOS = [
  {
    id: 1,
    title: "📱 The Phishing SMS Trap",
    scenario: "You receive an SMS from a number claiming to be your bank: 'Dear user, your bank account will be blocked. Click here to verify now: block-sbi.org'",
    opts: [
      { text: "Click the link immediately to verify and avoid getting blocked.", correct: false },
      { text: "Ignore the SMS. Banks never send warning links from random phone numbers.", correct: true }
    ],
    explain: "Banks never send SMS containing verification web links. Entering your password on unknown links leaks your credentials."
  },
  {
    id: 2,
    title: "📞 The Fake Customer Support Call",
    scenario: "A person claiming to be a bank manager calls asking for the 6-digit OTP sent to your phone to 'upgrade your KYC status' and prevent card suspension.",
    opts: [
      { text: "Share the OTP since it is from a customer support manager.", correct: false },
      { text: "Never share the OTP. Bank officials will never ask for PINs or OTPs.", correct: true }
    ],
    explain: "An OTP is a secret one-time password. Sharing it allows attackers to bypass security and transfer your funds."
  },
  {
    id: 3,
    title: "💸 The UPI Payment Trap",
    scenario: "Someone wants to buy your old bicycle online and sends a UPI 'Collect Request' asking for your UPI PIN to transfer the cash to you.",
    opts: [
      { text: "Enter your PIN to receive the payment.", correct: false },
      { text: "Decline the request. A UPI PIN is only needed to SEND money, never to receive it.", correct: true }
    ],
    explain: "This is a common UPI scam. PINs are only entered when debited. Receiving money requires no PIN."
  },
  {
    id: 4,
    title: "📶 Public Wi-Fi Danger",
    scenario: "You are at a coffee shop and want to check your bank balance. The shop has a free public Wi-Fi network.",
    opts: [
      { text: "Connect to the public Wi-Fi and complete the net banking transfer.", correct: false },
      { text: "Use cellular data (4G/5G) or a secure VPN, as public Wi-Fi can leak bank credentials.", correct: true }
    ],
    explain: "Public Wi-Fi networks can be sniffed or spoofed by hackers to capture passwords. Always use private networks for banking."
  }
]

const VIDEOS_DB = {
  upi_working: {
    title: "🏦 Part 1: Digital Banking Overview",
    url: "https://www.youtube.com/embed/zvPyqN-FEPQ?rel=0",
    desc: "An overview of digital banking and mobile channels."
  },
  safety_phishing: {
    title: "🛡️ Spam & Phishing Safety",
    url: "https://www.youtube.com/embed/NI37JI7KnSc?rel=0",
    desc: "An animated guide explaining email spam and password protection."
  },
  card_basics: {
    title: "💳 Debit & Credit Cards Guide",
    url: "https://www.youtube.com/embed/mllbYh0DFMc?rel=0",
    desc: "A breakdown of Credit vs Debit cards and interest calculation."
  }
}

const SCHEME_NAMES = {
  PPF: 'Public Provident Fund (15-Yr Tax-Free)',
  FD: 'Fixed Deposit (Guaranteed Bank Yield)',
  NSC: 'National Savings Certificate (5-Yr Govt)',
  SSY: 'Sukanya Samriddhi (Girl Child 8.2%)',
  RD: 'Recurring Deposit (Monthly Systematic)',
  MIS: 'Post Office Monthly Income Scheme'
}

const PORTFOLIO_CATALOG = [
  { key: 'PPF', name: 'PPF', rate: 7.1, tenure: 15, sub: '7.1% • 15 Yrs', icon: '🏰' },
  { key: 'FD', name: 'FD', rate: 7.2, tenure: 5, sub: '7.2% • 5 Yrs', icon: '🔒' },
  { key: 'NSC', name: 'NSC', rate: 7.7, tenure: 5, sub: '7.7% • 5 Yrs', icon: '📜' },
  { key: 'SSY', name: 'SSY', rate: 8.2, tenure: 21, sub: '8.2% • 21 Yrs', icon: '👧' },
  { key: 'RD', name: 'RD', rate: 6.8, tenure: 3, sub: '6.8% • 3 Yrs', icon: '🗓️' },
  { key: 'MIS', name: 'MIS', rate: 7.4, tenure: 5, sub: '7.4% • 5 Yrs', icon: '💵' },
]

export default function Intermediate({ go, goBack, canGoBack, state, update, addXP, aiGuideAvatar = 'female', aiGuideName, openAvatarModal, themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const modulesDone = state.completedModules || []
  const [activeTab, setActiveTab] = useState('simulators')

  // Multi-Asset Portfolio Simulator State
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, key: 'PPF', name: 'PPF', monthly: 5000, rate: 7.1, tenure: 15, icon: '🏰' },
    { id: 2, key: 'FD', name: 'FD', monthly: 5000, rate: 7.2, tenure: 5, icon: '🔒' }
  ])
  const [allocStrategy, setAllocStrategy] = useState('manual') // 'manual' | 'smart'
  const [hasSimulatedPortfolio, setHasSimulatedPortfolio] = useState(false)

  // Mixer State Variables
  const [alloc, setAlloc] = useState({
    PPF: 25, FD: 25, NSC: 20, SSY: 10, RD: 10, MIS: 10
  })
  const [customRates, setCustomRates] = useState({
    PPF: 7.1, FD: 7.25, NSC: 7.7, SSY: 8.2, RD: 6.5, MIS: 7.4
  })
  const [monthlySavings, setMonthlySavings] = useState(5000)
  const [years, setYears] = useState(5)

  // Goal Planner State Variables
  const [goals, setGoals] = useState([])
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [newGoalYears, setNewGoalYears] = useState(5)
  const [inflationActive, setInflationActive] = useState(false)

  // Digital Banking & Security Game state variables
  const [digitalScenarioIdx, setDigitalScenarioIdx] = useState(0)
  const [shieldScore, setShieldScore] = useState(100)
  const [digitalFeedback, setDigitalFeedback] = useState('')
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [cyberGameCompleted, setCyberGameCompleted] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('upi_working')

  const handleAddPortfolioItem = (cat) => {
    trackMixerInteraction()
    const newItem = {
      id: Date.now() + Math.random(),
      key: cat.key,
      name: cat.name,
      monthly: 5000,
      rate: cat.rate,
      tenure: cat.tenure,
      icon: cat.icon
    }
    setPortfolioItems(prev => [...prev, newItem])
  }

  const handleRemovePortfolioItem = (id) => {
    trackMixerInteraction()
    setPortfolioItems(prev => prev.filter(item => item.id !== id))
  }

  const handleUpdatePortfolioItem = (id, field, val) => {
    trackMixerInteraction()
    setPortfolioItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item))
  }

  const handleRunPortfolioSimulation = () => {
    trackMixerInteraction()
    if (portfolioItems.length < 2) {
      alert('A portfolio requires at least 2 investment options.')
      return
    }
    setHasSimulatedPortfolio(true)
  }

  const handleSmartAllocationOpt = () => {
    trackMixerInteraction()
    setAllocStrategy('smart')
    if (portfolioItems.length === 0) return
    const totalMonthly = portfolioItems.reduce((sum, item) => sum + (Number(item.monthly) || 5000), 0)
    const totalRates = portfolioItems.reduce((sum, item) => sum + (Number(item.rate) || 1), 0)
    setPortfolioItems(prev => prev.map(item => {
      const weight = (Number(item.rate) || 1) / totalRates
      const smartM = Math.round((totalMonthly * weight) / 500) * 500 || 1000
      return { ...item, monthly: smartM }
    }))
  }

  const fmtLakhs = (val) => {
    if (!val || isNaN(val)) return '₹0'
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`
    } else {
      return `₹${Math.round(val).toLocaleString('en-IN')}`
    }
  }

  // Portfolio calculations
  let portTotalInvested = 0
  let portTotalReturns = 0
  let portLongestTenure = 0

  const portItemDetails = portfolioItems.map(item => {
    const m = Number(item.monthly) || 0
    const r = Number(item.rate) || 0
    const t = Number(item.tenure) || 1
    if (t > portLongestTenure) portLongestTenure = t

    const months = t * 12
    const i = (r / 100) / 12
    const invested = m * months
    let returns = invested
    if (i > 0) {
      returns = Math.round(m * ((Math.pow(1 + i, months) - 1) / i) * (1 + i))
    }
    const profit = Math.max(0, returns - invested)

    portTotalInvested += invested
    portTotalReturns += returns

    return {
      ...item,
      months,
      invested,
      returns,
      profit
    }
  })

  const portTotalProfit = Math.max(0, portTotalReturns - portTotalInvested)
  const portProfitPct = portTotalInvested > 0 ? ((portTotalProfit / portTotalInvested) * 100).toFixed(1) : '0.0'
  const portInvestedBarPct = portTotalReturns > 0 ? ((portTotalInvested / portTotalReturns) * 100).toFixed(1) : '0.0'
  const portProfitBarPct = portTotalReturns > 0 ? ((portTotalProfit / portTotalReturns) * 100).toFixed(1) : '0.0'

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalAmount) return
    trackMixerInteraction()
    setGoals([...goals, {
      id: Date.now(),
      name: newGoalName.trim(),
      amount: parseInt(newGoalAmount) || 1000,
      years: parseInt(newGoalYears) || 5
    }])
    setNewGoalName('')
    setNewGoalAmount('')
    setNewGoalYears(5)
  }

  const handleModule = (mod) => {
    update({ currentModule: mod })
    go('simulation')
  }

  const simulationsDone = modules.every(m => modulesDone.includes(m.id))
  const mixerDone = modulesDone.includes('mixer')
  const cyberDone = modulesDone.includes('cyber_game')
  const allDone = simulationsDone && mixerDone && cyberDone

  useEffect(() => {
    if (allDone && !state.advancedUnlocked) {
      addXP(200)
      update({ advancedUnlocked: true })
    }
  }, [allDone, state.advancedUnlocked])
  
  const completedCount = modules.filter(m => modulesDone.includes(m.id)).length + (mixerDone ? 1 : 0) + (cyberDone ? 1 : 0)
  const progressPct = Math.min(100, Math.round((completedCount / 8) * 100))

  const colors = {
    PPF: '#f59e0b', FD: '#d97706', NSC: '#fbbf24',
    SSY: '#eab308', RD: '#10b981', MIS: '#0284c7'
  }

  const yieldRate = parseFloat(
    ((alloc.PPF * customRates.PPF +
      alloc.FD * customRates.FD +
      alloc.NSC * customRates.NSC +
      alloc.SSY * customRates.SSY +
      alloc.RD * customRates.RD +
      alloc.MIS * customRates.MIS) / 100).toFixed(2)
  )

  const monthlyRate = (yieldRate / 100) / 12
  const totalMonths = years * 12
  const totalInvested = monthlySavings * totalMonths
  const projectedValue = monthlyRate > 0 
    ? Math.round(monthlySavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
    : totalInvested
  const interestEarned = Math.max(0, projectedValue - totalInvested)

  const simpleInterestEarned = Math.round((totalInvested / 2) * (yieldRate / 100) * years)
  const compoundingBonus = Math.max(0, interestEarned - simpleInterestEarned)

  const trackMixerInteraction = () => {
    if (!modulesDone.includes('mixer')) {
      update({ completedModules: [...modulesDone, 'mixer'] })
    }
  }

  const handleSliderChange = (key, newVal) => {
    trackMixerInteraction()
    const currentVal = alloc[key]
    const diff = newVal - currentVal
    const otherKeys = Object.keys(alloc).filter(k => k !== key)
    const otherSum = otherKeys.reduce((sum, k) => sum + alloc[k], 0)

    let newAlloc = { ...alloc, [key]: newVal }
    if (otherSum > 0) {
      otherKeys.forEach(k => {
        const proportionalShare = alloc[k] / otherSum
        newAlloc[k] = Math.max(0, Math.round(alloc[k] - diff * proportionalShare))
      })
    } else {
      otherKeys.forEach(k => {
        newAlloc[k] = Math.max(0, Math.round(-diff / otherKeys.length))
      })
    }

    const finalSum = Object.values(newAlloc).reduce((sum, v) => sum + v, 0)
    if (finalSum !== 100) {
      newAlloc[key] += (100 - finalSum)
      if (newAlloc[key] < 0) newAlloc[key] = 0
    }
    setAlloc(newAlloc)
  }

  const applyPreset = (presetType) => {
    trackMixerInteraction()
    if (presetType === 'safe') {
      setAlloc({ PPF: 40, FD: 40, RD: 20, NSC: 0, SSY: 0, MIS: 0 })
    } else if (presetType === 'growth') {
      setAlloc({ NSC: 60, PPF: 40, FD: 0, SSY: 0, RD: 0, MIS: 0 })
    } else if (presetType === 'cash') {
      setAlloc({ MIS: 50, FD: 30, NSC: 20, PPF: 0, RD: 0, SSY: 0 })
    } else if (presetType === 'balanced') {
      setAlloc({ PPF: 25, FD: 25, NSC: 20, SSY: 0, RD: 15, MIS: 15 })
    }
  }

  const radius = 50
  const circ = 2 * Math.PI * radius
  let currentOffset = 0

  const handleCyberAnswer = (optIndex) => {
    setSelectedOpt(optIndex)
    const currentScen = CYBER_SCENARIOS[digitalScenarioIdx]
    const isCorrect = currentScen.opts[optIndex].correct

    if (!isCorrect) {
      setShieldScore(prev => Math.max(0, prev - 25))
    }

    setDigitalFeedback(currentScen.explain)
  }

  const handleNextScenario = () => {
    setSelectedOpt(null)
    setDigitalFeedback('')
    if (digitalScenarioIdx < CYBER_SCENARIOS.length - 1) {
      setDigitalScenarioIdx(prev => prev + 1)
    } else {
      setCyberGameCompleted(true)
      if (!modulesDone.includes('cyber_game')) {
        update({ completedModules: [...modulesDone, 'cyber_game'] })
        addXP(50)
      }
    }
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fef3c7' }}>
      {/* Top Back Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={goBack || (() => go('landing'))}
          style={{
            background: 'var(--bg-card, rgba(18, 16, 12, 0.9))',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            color: 'var(--gold-amber, #fbbf24)',
            borderRadius: 999,
            padding: '8px 18px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          <span>⬅</span>
          <span>Back to Main Page</span>
        </button>
      </div>

      {/* High Energy Tab Switcher Bar */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('simulators')}
          style={{
            flex: '1 1 200px',
            fontSize: 14,
            fontWeight: 900,
            padding: '14px 20px',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'simulators'
              ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
              : (isLight ? '#ffedd5' : '#1e1b18'),
            color: activeTab === 'simulators' ? '#ffffff' : (isLight ? '#9a3412' : '#fbbf24'),
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            boxShadow: activeTab === 'simulators'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          💼 SAVINGS MIXER PLAYGROUND 🌟
        </button>
        
        <button
          onClick={() => setActiveTab('mixer')}
          style={{
            flex: '1 1 200px',
            fontSize: 14,
            fontWeight: 900,
            padding: '14px 20px',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'mixer'
              ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
              : (isLight ? '#ffedd5' : '#1e1b18'),
            color: activeTab === 'mixer' ? '#ffffff' : (isLight ? '#9a3412' : '#fbbf24'),
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            boxShadow: activeTab === 'mixer'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          🏢 PORTFOLIO SIMULATOR 🌟
        </button>
      </div>

      {activeTab === 'simulators' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header Card */}
          <div className="glass-card anim-fade" style={{ padding:'26px 30px', border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
              <div style={{
                width:50,height:50,borderRadius:14,
                background:'linear-gradient(135deg, #d97706, #f59e0b)', color:'#080705',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:24,boxShadow:'0 0 20px rgba(245,158,11,0.3)',
                border: isLight ? '2px solid #000000' : '2px solid #ffffff', fontWeight: 900
              }}>🧪</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <div className="sticker-badge sticker-yellow">
                    INVESTMENT LAB · GUIDE: {guideName.toUpperCase()} {activeAvatar.icon}
                  </div>
                  {openAvatarModal && (
                    <button
                      onClick={openAvatarModal}
                      style={{
                        background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)',
                        border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        color: isLight ? '#7c2d12' : '#fbbf24',
                        borderRadius: '999px',
                        padding: '2px 10px',
                        fontSize: '10px',
                        fontWeight: 900,
                        cursor: 'pointer'
                      }}
                    >
                      ⚙️ SWITCH GUIDE
                    </button>
                  )}
                </div>
                <h1 className="font-display" style={{ fontSize:32, color: isLight ? '#0f172a' : '#ffffff', marginBottom:2 }}>
                  SAVINGS PORTFOLIO MIXER PLAYGROUND
                </h1>
                <p style={{ fontSize:13, color: isLight ? '#475569' : '#d1d5db', fontWeight:600 }}>
                  Mix safe government savings assets to build your optimal portfolio and calculate compound returns!
                </p>
              </div>
            </div>


          </div>

          {/* Savings Portfolio Mixer Playground (Images 3 & 4) */}
          <div className="glass-card-deep" style={{ padding: '32px', borderRadius: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff', color: isLight ? '#0f172a' : '#fef3c7' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10, display: 'inline-block' }}>
                💼 SAVINGS PORTFOLIO MIXER PLAYGROUND 🌟
              </div>
              <h2 className="font-display" style={{ fontSize: 32, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 4 }}>
                Savings Portfolio Mixer Playground 🌟
              </h2>
              <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 13, fontWeight: 600, margin: 0 }}>
                Mix and match safe government-backed savings assets to build your ultimate Indian portfolio!
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {/* Left Column: Sliders & Presets */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚙️ Adjust Asset Allocations
                </h3>
                
                {/* Presets Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
                  <button onClick={() => applyPreset('safe')} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 900, borderRadius: 12, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.15)', color: isLight ? '#7c2d12' : '#fbbf24', cursor: 'pointer' }}>
                    🏰 Safe Fortress
                  </button>
                  <button onClick={() => applyPreset('growth')} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 900, borderRadius: 12, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.15)', color: isLight ? '#7c2d12' : '#fbbf24', cursor: 'pointer' }}>
                    🚀 Growth Focus
                  </button>
                  <button onClick={() => applyPreset('cash')} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 900, borderRadius: 12, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.15)', color: isLight ? '#7c2d12' : '#fbbf24', cursor: 'pointer' }}>
                    💧 Easy Cash Flow
                  </button>
                  <button onClick={() => applyPreset('balanced')} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 900, borderRadius: 12, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.15)', color: isLight ? '#7c2d12' : '#fbbf24', cursor: 'pointer' }}>
                    🍭 Balanced Kid
                  </button>
                </div>

                {/* Sliders Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.keys(alloc).map((key) => {
                    const val = alloc[key]
                    const rate = customRates[key]
                    const color = colors[key]
                    return (
                      <div key={key} style={{
                        background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '12px 16px',
                        border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }}/>
                            <div>
                              <span style={{ fontWeight: 900, fontSize: 14, color: isLight ? '#0f172a' : '#ffffff' }} title={SCHEME_NAMES[key]}>{key}</span>
                              <div style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 700 }}>{SCHEME_NAMES[key]}</div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 8 }}>
                              <span style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 800 }}>Rate:</span>
                              <input
                                type="number"
                                min="0" max="25" step="0.05"
                                value={rate}
                                onChange={(e) => setCustomRates({ ...customRates, [key]: parseFloat(e.target.value) || 0 })}
                                style={{
                                  width: 55, padding: '3px 6px', fontSize: 11, fontWeight: 900,
                                  background: isLight ? '#ffffff' : '#1a1610', border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                                  borderRadius: 6, textAlign: 'center', color: isLight ? '#0f172a' : '#fef3c7', outline: 'none'
                                }}
                              />
                              <span style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 800 }}>%</span>
                            </div>
                          </div>
                          <span style={{ fontWeight: 900, color: isLight ? '#ea580c' : color, fontSize: 14 }}>{val}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" value={val}
                          onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                          style={{
                            width: '100%', height: 6, borderRadius: 3,
                            accentColor: color, outline: 'none', cursor: 'pointer'
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Donut & Growth Projector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Donut Chart */}
                <div style={{
                  background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16
                }}>
                  <div style={{ position: 'relative', width: 130, height: 130 }}>
                    <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r={radius} fill="transparent" stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} strokeWidth="14" />
                      {Object.keys(alloc).map((key) => {
                        const val = alloc[key]
                        const color = colors[key]
                        if (val === 0) return null
                        const strokeDashOffset = circ - (val / 100) * circ
                        const currentRotationOffset = currentOffset
                        currentOffset += (val / 100) * circ
                        return (
                          <circle
                            key={key} cx="60" cy="60" r={radius} fill="transparent"
                            stroke={color} strokeWidth="14"
                            strokeDasharray={circ} strokeDashoffset={strokeDashOffset}
                            style={{
                              transformOrigin: '60px 60px',
                              transform: `rotate(${(currentRotationOffset / circ) * 360}deg)`,
                              transition: 'stroke-dashoffset 0.3s'
                            }}
                          />
                        )
                      })}
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', lineHeight: 1 }}>{yieldRate}%</span>
                      <span style={{ fontSize: 9, color: isLight ? '#475569' : '#9ca3af', fontWeight: 800, marginTop: 2 }}>EST. YIELD</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Object.keys(alloc).map((key) => (
                      <div key={key} style={{
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
                        fontWeight: 800, color: alloc[key] > 0 ? (isLight ? '#0f172a' : '#ffffff') : (isLight ? '#94a3b8' : '#71717a'),
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[key] }}/>
                        <span>{key}: {alloc[key]}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compound Growth Projector */}
                <div style={{
                  background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 16 }}>
                    🔮 Growth Projector
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                        <span>Monthly Savings</span>
                        <span style={{ color: isLight ? '#ea580c' : '#fbbf24' }}>₹{monthlySavings.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range" min="1000" max="50000" step="1000" value={monthlySavings}
                        onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#f59e0b' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                        <span>Time Horizon</span>
                        <span style={{ color: isLight ? '#ea580c' : '#fbbf24' }}>{years} Years</span>
                      </div>
                      <input
                        type="range" min="1" max="15" step="1" value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#f59e0b' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 10, textAlign: 'center', background: isLight ? '#ffffff' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 16, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <div>
                      <div style={{ fontSize: 9, color: isLight ? '#475569' : 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>INVESTED</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0284c7', marginTop: 3 }}>₹{totalInvested.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: isLight ? '#475569' : 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>EST. INTEREST</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#10b981', marginTop: 3 }}>₹{interestEarned.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: isLight ? '#475569' : 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>TOTAL VALUE</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginTop: 3 }}>₹{projectedValue.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 12, background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.12)',
                    border: isLight ? '2px solid #000000' : '2px solid #ffffff', borderRadius: 16, padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11
                  }}>
                    <span style={{ color: isLight ? '#7c2d12' : '#d1d5db', fontWeight: 800 }}>
                      📉 Simple Interest yield: <strong>₹{(totalInvested + simpleInterestEarned).toLocaleString('en-IN')}</strong>
                    </span>
                    <span style={{ color: isLight ? '#c2410c' : '#fbbf24', fontWeight: 900 }}>
                      ✨ Compounding Bonus: <strong>+₹{compoundingBonus.toLocaleString('en-IN')}! 🚀</strong>
                    </span>
                  </div>
                </div>

                {/* Multi-Goal Savings Planner */}
                <div style={{
                  background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                  display: 'flex', flexDirection: 'column', gap: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', margin: 0 }}>
                      🎯 Multi-Goal Savings Planner
                    </h3>
                    
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      background: inflationActive ? (isLight ? '#ffedd5' : 'rgba(245,158,11,0.2)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.06)'),
                      padding: '6px 12px', borderRadius: 12,
                      border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                      userSelect: 'none'
                    }}>
                      <input
                        type="checkbox"
                        checked={inflationActive}
                        onChange={(e) => setInflationActive(e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: '#f59e0b' }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 800, color: inflationActive ? (isLight ? '#c2410c' : '#fbbf24') : (isLight ? '#475569' : '#9ca3af') }}>
                        👾 Inflation Time Machine ON (6% 🇮🇳)
                      </span>
                    </label>
                  </div>

                  <div style={{
                    background: isLight ? '#ffffff' : '#080705', borderRadius: 16, padding: 14,
                    border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                    display: 'flex', flexDirection: 'column', gap: 10
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#ea580c' : '#9ca3af', textTransform: 'uppercase' }}>
                      + ADD TARGET SAVINGS GOAL
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: 10 }}>
                      <div>
                        <input
                          type="text" placeholder="e.g. Laptop"
                          value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)}
                          style={{ padding: '8px 12px', fontSize: 12, borderRadius: 8, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#f8fafc' : '#1a1610', color: isLight ? '#0f172a' : '#fef3c7', outline: 'none', width: '100%', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <input
                          type="number" placeholder="Price Target (₹)"
                          value={newGoalAmount} onChange={(e) => setNewGoalAmount(e.target.value)}
                          style={{ padding: '8px 12px', fontSize: 12, borderRadius: 8, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#f8fafc' : '#1a1610', color: isLight ? '#0f172a' : '#fef3c7', outline: 'none', width: '100%', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <input
                          type="number" placeholder="Timeline (Yrs)"
                          value={newGoalYears} onChange={(e) => setNewGoalYears(e.target.value)}
                          style={{ padding: '8px 12px', fontSize: 12, borderRadius: 8, border: isLight ? '2px solid #000000' : '2px solid #ffffff', background: isLight ? '#f8fafc' : '#1a1610', color: isLight ? '#0f172a' : '#fef3c7', outline: 'none', width: '100%', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                    <button className="btn-primary" onClick={handleAddGoal} style={{ padding: '10px', fontSize: 12, fontWeight: 900, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                      Add Goal to List 🌟
                    </button>
                  </div>

                  {/* Goals List */}
                  {goals.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {goals.map((g) => {
                        const effectiveTarget = inflationActive ? Math.round(g.amount * Math.pow(1.06, g.years)) : g.amount
                        const reqMonthly = Math.round(effectiveTarget / (g.years * 12))
                        return (
                          <div key={g.id} style={{
                            background: isLight ? '#ffffff' : 'rgba(255,255,255,0.04)', padding: '12px 14px', borderRadius: 14,
                            border: isLight ? '2px solid #000000' : '2px solid #ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 13 }}>{g.name}</div>
                              <div style={{ fontSize: 11, color: isLight ? '#475569' : '#9ca3af', fontWeight: 600 }}>
                                Target: ₹{effectiveTarget.toLocaleString('en-IN')} in {g.years} yrs
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', fontSize: 13 }}>₹{reqMonthly.toLocaleString('en-IN')}/mo</div>
                              <button onClick={() => setGoals(goals.filter(item => item.id !== g.id))} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: 11, fontWeight: 800 }}>✕ Remove</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


        </div>
      )}

      {activeTab === 'mixer' && (
        <div className="anim-scale" style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
          {/* Header Banner */}
          <div style={{
            background: isLight ? '#ffffff' : '#090d16',
            borderRadius: 20,
            padding: '24px 28px',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10, display: 'inline-block' }}>
              LEVEL 3 • WEALTH ENGINE
            </div>
            <h2 className="font-display" style={{ fontSize: 32, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 6px 0', letterSpacing: 0.5 }}>
              MULTI-ASSET PORTFOLIO SIMULATOR
            </h2>
            <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: 13, fontWeight: 600, margin: 0 }}>
              Select 2 or more investment instruments, simulate combined wealth outcomes, and analyze reinvestment gap periods.
            </p>
          </div>

          {/* Available Options Bar */}
          <div style={{
            background: isLight ? '#ffffff' : '#090d16',
            borderRadius: 20,
            padding: '20px 24px',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', marginBottom: 14, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>+</span>
              <span>CLICK "+" TO ADD INVESTMENT OPTIONS TO YOUR PORTFOLIO:</span>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
              {PORTFOLIO_CATALOG.map((cat) => (
                <div key={cat.key} style={{
                  minWidth: 160,
                  flex: '0 0 auto',
                  background: isLight ? '#f8fafc' : '#030712',
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 14, color: isLight ? '#0f172a' : '#ffffff' }}>{cat.name}</div>
                      <div style={{ fontSize: 10, color: isLight ? '#64748b' : '#94a3b8', fontWeight: 700 }}>{cat.sub}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddPortfolioItem(cat)}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: '#10b981', border: isLight ? '2px solid #000000' : '2px solid #ffffff', color: '#ffffff',
                      fontSize: 18, fontWeight: 900, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(16,185,129,0.3)', transition: 'transform 0.15s'
                    }}
                    title={`Add ${cat.name} to portfolio`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Strategy Selector */}
          <div style={{
            background: isLight ? '#ffffff' : '#090d16',
            borderRadius: 20,
            padding: '18px 24px',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span>⚙️</span>
                <span>PORTFOLIO ALLOCATION STRATEGY</span>
              </div>
              <div style={{ fontSize: 12, color: isLight ? '#475569' : '#94a3b8', fontWeight: 600 }}>
                Choose how monthly funds are allocated across your selected investments
              </div>
            </div>

            <div style={{ display: 'flex', background: isLight ? '#f1f5f9' : '#030712', padding: 4, borderRadius: 14, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
              <button
                onClick={() => setAllocStrategy('manual')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                  cursor: 'pointer',
                  background: allocStrategy === 'manual' ? '#f59e0b' : 'transparent',
                  color: allocStrategy === 'manual' ? '#000000' : (isLight ? '#475569' : '#94a3b8'),
                  transition: 'all 0.2s'
                }}
              >
                ⚡ Manual Allocation
              </button>
              <button
                onClick={handleSmartAllocationOpt}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                  cursor: 'pointer',
                  background: allocStrategy === 'smart' ? '#10b981' : 'transparent',
                  color: allocStrategy === 'smart' ? '#ffffff' : (isLight ? '#475569' : '#94a3b8'),
                  transition: 'all 0.2s'
                }}
              >
                ⚡ Smart Allocation
              </button>
            </div>
          </div>

          {/* Selected Portfolio Investments Table */}
          <div style={{
            background: isLight ? '#ffffff' : '#090d16',
            borderRadius: 20,
            padding: '24px',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                  SELECTED PORTFOLIO INVESTMENTS ({portfolioItems.length})
                </h3>
                <div style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600, marginTop: 2 }}>
                  Configure individual monthly amounts, return expectations, and tenure. You can rename any option.
                </div>
              </div>

              {portfolioItems.length >= 2 ? (
                <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>✓</span> Ready for Simulation
                </div>
              ) : (
                <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⚠️</span> Need at least 2 investments
                </div>
              )}
            </div>

            {portfolioItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: isLight ? '#64748b' : '#94a3b8', fontSize: 13, fontWeight: 700 }}>
                No investments selected. Click "+" on any investment option above to add it to your portfolio!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {portfolioItems.map((item) => (
                  <div key={item.id} style={{
                    background: isLight ? '#f8fafc' : '#040914',
                    border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                    borderRadius: 14,
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr 40px',
                    gap: 12,
                    alignItems: 'center'
                  }}>
                    {/* Scheme Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: 9, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                        SCHEME NAME
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: isLight ? '#ffffff' : '#0b1329', padding: '6px 10px', borderRadius: 8, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdatePortfolioItem(item.id, 'name', e.target.value)}
                          style={{
                            background: 'transparent', border: 'none', color: isLight ? '#0f172a' : '#ffffff',
                            fontWeight: 800, fontSize: 13, outline: 'none', width: '100%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Monthly */}
                    <div>
                      <label style={{ display: 'block', fontSize: 9, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                        MONTHLY (₹)
                      </label>
                      <input
                        type="number"
                        min="500" step="500"
                        value={item.monthly}
                        onChange={(e) => handleUpdatePortfolioItem(item.id, 'monthly', Number(e.target.value))}
                        style={{
                          background: isLight ? '#ffffff' : '#0b1329', border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                          color: isLight ? '#0f172a' : '#ffffff', fontWeight: 800, fontSize: 13, padding: '8px 10px',
                          borderRadius: 8, outline: 'none', width: '100%'
                        }}
                      />
                    </div>

                    {/* Rate */}
                    <div>
                      <label style={{ display: 'block', fontSize: 9, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                        RATE (% p.a.)
                      </label>
                      <input
                        type="number"
                        min="1" max="25" step="0.1"
                        value={item.rate}
                        onChange={(e) => handleUpdatePortfolioItem(item.id, 'rate', Number(e.target.value))}
                        style={{
                          background: isLight ? '#ffffff' : '#0b1329', border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                          color: isLight ? '#0f172a' : '#ffffff', fontWeight: 800, fontSize: 13, padding: '8px 10px',
                          borderRadius: 8, outline: 'none', width: '100%'
                        }}
                      />
                    </div>

                    {/* Tenure */}
                    <div>
                      <label style={{ display: 'block', fontSize: 9, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                        TENURE (YRS)
                      </label>
                      <input
                        type="number"
                        min="1" max="30" step="1"
                        value={item.tenure}
                        onChange={(e) => handleUpdatePortfolioItem(item.id, 'tenure', Number(e.target.value))}
                        style={{
                          background: isLight ? '#ffffff' : '#0b1329', border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                          color: isLight ? '#0f172a' : '#ffffff', fontWeight: 800, fontSize: 13, padding: '8px 10px',
                          borderRadius: 8, outline: 'none', width: '100%'
                        }}
                      />
                    </div>

                    {/* Delete button */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 16 }}>
                      <button
                        onClick={() => handleRemovePortfolioItem(item.id)}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444',
                          color: '#ef4444', fontSize: 14, fontWeight: 900, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Remove option"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Simulation Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleRunPortfolioSimulation}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#ffffff',
                  border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                  letterSpacing: 0.5
                }}
              >
                <span>🚀</span>
                <span>RUN PORTFOLIO SIMULATION</span>
              </button>

              <button
                onClick={handleSmartAllocationOpt}
                style={{
                  background: 'transparent',
                  color: '#10b981',
                  border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  letterSpacing: 0.5
                }}
              >
                <span>⚡</span>
                <span>TRY SMART ALLOCATION OPTIMIZATION</span>
              </button>
            </div>
          </div>

          {/* COMBINED WEALTH METRICS REPORT & GAP ANALYSIS */}
          {portfolioItems.length >= 2 && (
            <>
              {/* Overall Portfolio Report */}
              <div style={{
                background: isLight ? '#ffffff' : '#090d16',
                borderRadius: 20,
                padding: '24px',
                border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#0284c7', background: 'rgba(2,132,199,0.15)', padding: '4px 10px', borderRadius: 999, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    OVERALL PORTFOLIO REPORT
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: isLight ? '#475569' : '#94a3b8' }}>
                    Longest Investment Horizon: <strong style={{ color: '#f59e0b' }}>{portLongestTenure} Years</strong>
                  </div>
                </div>

                <h3 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 20px 0' }}>
                  COMBINED WEALTH METRICS
                </h3>

                {/* 4 Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <div style={{ background: isLight ? '#f8fafc' : '#030712', borderRadius: 14, padding: '16px 20px', border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>TOTAL INVESTMENT</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>{fmtLakhs(portTotalInvested)}</div>
                  </div>

                  <div style={{ background: isLight ? '#f8fafc' : '#030712', borderRadius: 14, padding: '16px 20px', border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>TOTAL RETURNS</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginTop: 4 }}>{fmtLakhs(portTotalReturns)}</div>
                  </div>

                  <div style={{ background: isLight ? '#f8fafc' : '#030712', borderRadius: 14, padding: '16px 20px', border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>TOTAL PROFIT</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{fmtLakhs(portTotalProfit)}</div>
                  </div>

                  <div style={{ background: isLight ? '#f8fafc' : '#030712', borderRadius: 14, padding: '16px 20px', border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>PROFIT PERCENTAGE</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{portProfitPct}%</div>
                  </div>
                </div>

                {/* Progress Bar Breakdown */}
                <div style={{ background: isLight ? '#f8fafc' : '#030712', borderRadius: 14, padding: '16px 20px', border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, marginBottom: 10 }}>
                    <span style={{ color: isLight ? '#0f172a' : '#ffffff', textTransform: 'uppercase' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                    <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>Portfolio Value: {fmtLakhs(portTotalReturns)} (100%)</span>
                  </div>
                  <div style={{ height: 24, borderRadius: 12, overflow: 'hidden', display: 'flex', background: '#1e293b' }}>
                    <div style={{ width: `${portInvestedBarPct}%`, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#ffffff' }}>
                      {portInvestedBarPct}%
                    </div>
                    <div style={{ width: `${portProfitBarPct}%`, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#ffffff' }}>
                      {portProfitBarPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* GAP PERIODS & REINVESTMENT ANALYSIS */}
              <div style={{
                background: isLight ? '#ffffff' : '#090d16',
                borderRadius: 20,
                padding: '24px',
                border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'
              }}>
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>⏳</span>
                    <span>GAP PERIODS & REINVESTMENT ANALYSIS</span>
                  </h3>
                  <div style={{ fontSize: 12, color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
                    Understand when earlier investments mature and how to put the matured corpus to work during the remaining gap years.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {portItemDetails.map((item) => {
                    const gapYears = portLongestTenure - item.tenure
                    return (
                      <div key={item.id} style={{
                        background: isLight ? '#f8fafc' : '#030712',
                        border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        borderRadius: 14,
                        padding: '16px 20px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                          <div style={{ fontWeight: 900, fontSize: 15, color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{item.icon}</span>
                            <span>{item.name} matures at Year {item.tenure}</span>
                          </div>

                          {gapYears > 0 ? (
                            <div style={{
                              fontSize: 10, fontWeight: 900, color: '#f59e0b',
                              border: '1.5px solid #f59e0b', padding: '3px 10px',
                              borderRadius: 999, background: 'rgba(245, 158, 11, 0.1)', textTransform: 'uppercase'
                            }}>
                              {gapYears} YEARS GAP AVAILABLE
                            </div>
                          ) : (
                            <div style={{
                              fontSize: 10, fontWeight: 900, color: '#10b981',
                              border: '1.5px solid #10b981', padding: '3px 10px',
                              borderRadius: 999, background: 'rgba(16, 185, 129, 0.1)', textTransform: 'uppercase'
                            }}>
                              LONGEST HORIZON ANCHOR
                            </div>
                          )}
                        </div>

                        <div style={{ fontSize: 13, color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.6, fontWeight: 600, marginBottom: 8 }}>
                          At <strong>Year {item.tenure}</strong>, {item.name} will fully mature with an estimated payout corpus of <strong style={{ color: '#10b981' }}>{fmtLakhs(item.returns)}</strong>. {gapYears > 0 ? `Because your overall portfolio horizon runs for ${portLongestTenure} years, you have a ${gapYears}-year gap period before longer-term investments conclude.` : `This serves as your primary long-term anchor horizon.`}
                        </div>

                        {gapYears > 0 && (
                          <div style={{ fontSize: 12, color: isLight ? '#d97706' : '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <span>💡</span>
                            <span><strong>Smart Utilization Tip:</strong> You can redeploy this matured {fmtLakhs(item.returns)} into short-term liquid funds, higher-yield corporate FDs, or utilize it for targeted mid-term life goals!</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'digital' && (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', marginBottom: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #ea580c', color: isLight ? '#0f172a' : '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
              🌐 CYBER SAFETY ARENA
            </div>
            <h2 className="font-display" style={{ fontSize: 36, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              DIGITAL BANKING & SAFETY 🛡️
            </h2>
            <p style={{ color: isLight ? '#475569' : 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
              Defend your bank account against real-world phishing traps and cyber scams!
            </p>
          </div>

          {!cyberGameCompleted ? (
            <div className="glass-card" style={{ padding: 24, border: '2px solid #f59e0b', background: isLight ? '#fff7ed' : 'var(--bg-card-deep, #12100c)', color: isLight ? '#0f172a' : '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                  SCENARIO {digitalScenarioIdx + 1} OF {CYBER_SCENARIOS.length}
                </span>
                <div className="sticker-badge sticker-yellow">
                  🛡️ SHIELD HEALTH: {shieldScore}%
                </div>
              </div>

              <div style={{
                background: isLight ? '#ffffff' : 'rgba(245, 158, 11, 0.12)', borderRadius: 16, padding: 20,
                border: '2px solid #ea580c', marginBottom: 20, boxShadow: isLight ? '0 4px 12px rgba(234,88,12,0.1)' : 'none'
              }}>
                <h3 style={{ fontWeight: 900, fontSize: 16, color: isLight ? '#9a3412' : '#ffffff', marginBottom: 8 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].title}
                </h3>
                <p style={{ fontSize: 14, color: isLight ? '#0f172a' : '#e2e8f0', lineHeight: 1.6, fontWeight: 800 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].scenario}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {CYBER_SCENARIOS[digitalScenarioIdx].opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCyberAnswer(i)}
                    className={selectedOpt === i ? (opt.correct ? 'btn-primary' : 'btn-pink') : 'btn-outline'}
                    style={{
                      textAlign: 'left', fontSize: 13, padding: '14px 18px', width: '100%',
                      fontWeight: 800,
                      color: selectedOpt === i ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
                      borderColor: isLight ? '#ea580c' : undefined,
                      background: selectedOpt === i ? undefined : (isLight ? '#ffffff' : undefined)
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {digitalFeedback && (
                <div className="anim-fade" style={{
                  background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.12)', border: '1.5px solid #f59e0b',
                  borderRadius: 14, padding: 16, marginBottom: 20, color: isLight ? '#7c2d12' : '#fef3c7', fontSize: 13, lineHeight: 1.5, fontWeight: 700
                }}>
                  💡 {digitalFeedback}
                </div>
              )}

              {selectedOpt !== null && (
                <button className="btn-primary" onClick={handleNextScenario} style={{ width: '100%', fontSize: 14, fontWeight: 900 }}>
                  {digitalScenarioIdx < CYBER_SCENARIOS.length - 1 ? 'NEXT SCENARIO →' : '🏆 FINISH CHALLENGE (+50 XP)'}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #ea580c', borderRadius: 20 }} className="glass-card">
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛡️</div>
              <h3 className="font-display" style={{ fontSize: 32, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 8 }}>
                CHALLENGE PASSED!
              </h3>
              <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                Shield Health: {shieldScore}% • You earned +50 XP and mastered digital bank safety!
              </p>
              <button className="btn-primary" onClick={() => setCyberGameCompleted(false)}>
                🔄 REPLAY SAFETY ARENA
              </button>
            </div>
          )}

          {/* Phone SMS & Phishing Message Analyzer */}
          <MessageScamAnalyzer themeMode={themeMode} />

          {/* Video Tutorials Section */}
          <div style={{ marginTop: 32 }}>
            <h3 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 16 }}>
              🎬 DIGITAL BANKING TUTORIALS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              {Object.keys(VIDEOS_DB).map(vKey => (
                <button
                  key={vKey}
                  onClick={() => setSelectedVideo(vKey)}
                  className={selectedVideo === vKey ? 'btn-primary' : 'btn-outline'}
                  style={{
                    fontSize: 12, padding: '12px', fontWeight: 800,
                    color: selectedVideo === vKey ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
                    borderColor: isLight ? '#ea580c' : undefined
                  }}
                >
                  {VIDEOS_DB[vKey].title}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16, border: '2px solid #ea580c' }}>
              <iframe
                src={VIDEOS_DB[selectedVideo].url}
                title={VIDEOS_DB[selectedVideo].title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
