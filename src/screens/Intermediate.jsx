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

export default function Intermediate({ go, goBack, canGoBack, state, update, addXP, aiGuideAvatar = 'female', aiGuideName, openAvatarModal }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const modulesDone = state.completedModules || []
  const [activeTab, setActiveTab] = useState('simulators')

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
            border: '1.5px solid rgba(217, 119, 6, 0.4)',
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
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('simulators')}
          className={activeTab === 'simulators' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 180px', fontSize: 13, padding: '12px 18px' }}
        >
          📚 SIMULATOR MODULES
        </button>
        <button
          onClick={() => setActiveTab('mixer')}
          className={activeTab === 'mixer' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 180px', fontSize: 13, padding: '12px 18px' }}
        >
          💼 SAVINGS MIXER 🌟
        </button>
        <button
          onClick={() => setActiveTab('digital')}
          className={activeTab === 'digital' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 180px', fontSize: 13, padding: '12px 18px' }}
        >
          🌐 DIGITAL BANKING & SAFETY 🛡️
        </button>
      </div>

      {activeTab === 'simulators' && (
        <div className="anim-fade">
          {/* Header Card */}
          <div className="glass-card anim-fade" style={{ padding:'26px 30px', marginBottom:24, border:'1.5px solid rgba(217,119,6,0.3)', background: 'var(--bg-card-deep, #12100c)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
              <div style={{
                width:50,height:50,borderRadius:14,
                background:'linear-gradient(135deg, #d97706, #f59e0b)', color:'#080705',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:24,boxShadow:'0 0 20px rgba(245,158,11,0.3)',
                border:'1.5px solid #fbbf24', fontWeight: 900
              }}>🧪</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <div className="sticker-badge sticker-yellow">
                    LEVEL 2 LOCATION · GUIDE: {guideName.toUpperCase()} {activeAvatar.icon}
                  </div>
                  {openAvatarModal && (
                    <button
                      onClick={openAvatarModal}
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid #f59e0b',
                        color: '#fbbf24',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ⚙️ SWITCH GUIDE
                    </button>
                  )}
                </div>
                <h1 className="font-display" style={{ fontSize:32,color:'#ffffff',marginBottom:2 }}>
                  INVESTMENT LAB
                </h1>
                <p style={{ fontSize:13,color:'#d1d5db',fontWeight:600 }}>
                  Explore all investment simulators & build real financial models!
                </p>
              </div>
            </div>

            <div>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <span style={{ fontWeight:900,color:'#ffffff',fontSize:13 }}>
                  MODULES: {completedCount}/8 COMPLETED
                </span>
                <span style={{ fontWeight:900,color:'#fbbf24',fontSize:13 }}>
                  {progressPct}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{
                  width:`${progressPct}%`,
                }}/>
              </div>
              <div style={{ display:'flex',gap:6,marginTop:10 }}>
                {[...modules.map(m => m.id), 'mixer', 'cyber_game'].map((id, i) => (
                  <div key={i} style={{
                    flex:1,height:8,borderRadius:999,
                    background: modulesDone.includes(id)
                      ? '#f59e0b'
                      : 'rgba(255,255,255,0.1)',
                    transition:'all 0.4s',
                  }}/>
                ))}
              </div>
            </div>
          </div>

          {/* Modules Grid */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:18,marginBottom:24 }}>
            {modules.map((mod, i) => {
              const done = modulesDone.includes(mod.id)
              return (
                <div
                  key={mod.id}
                  className={`glass-card-sm anim-fade delay-${i+1}`}
                  onClick={() => handleModule(mod)}
                  style={{
                    padding:22, cursor:'pointer',
                    background: 'var(--bg-card-deep, #12100c)',
                    border: done
                      ? '2px solid #f59e0b'
                      : '1.5px solid rgba(217, 119, 6, 0.25)',
                    transition:'all 0.3s',
                    position:'relative',overflow:'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 240,
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(245,158,11,0.2)' }}
                  onMouseOut={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='' }}
                >
                  <div style={{
                    position:'absolute',top:0,left:0,right:0,height:4,
                    background: done ? '#f59e0b' : '#d97706',
                  }}/>

                  <div className="sticker-badge sticker-yellow" style={{
                    position:'absolute',top:14,right:14,fontSize:9,padding:'2px 8px',
                  }}>
                    {done ? '✓ DONE' : '▶ OPEN'}
                  </div>

                  <div>
                    <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12,marginTop:8 }}>
                      <div style={{
                        width:48,height:48,borderRadius:16,
                        background:`var(--gold-bg, rgba(245, 158, 11, 0.12))`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:24,border:`1.5px solid #d97706`,
                      }}>
                        {mod.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight:900,color:'var(--heading-color, #ffffff)',fontSize:15 }}>{mod.name}</div>
                        <div style={{ fontSize:11,color:'#fbbf24',fontWeight:800 }}>{mod.rate}</div>
                      </div>
                    </div>

                    <p style={{ fontSize:12,color:'var(--text-sub, #d1d5db)',fontWeight:600,marginBottom:16,lineHeight:1.5 }}>
                      {mod.desc}
                    </p>
                  </div>

                  <button className={done ? 'btn-outline' : 'btn-primary'} style={{
                    width:'100%',padding:10,fontSize:13,marginTop:'auto',
                  }}>
                    {done ? '🔁 REVISIT' : '▶ OPEN SIMULATOR'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Complete Checklist */}
          {modulesDone.length > 0 && (
            <div className="glass-card anim-fade" style={{
              padding:'28px 32px',textAlign:'center',marginBottom:20,
              background: 'var(--bg-card-deep, #12100c)',
              border: allDone ? '2px solid #f59e0b' : '1.5px solid rgba(217,119,6,0.3)',
            }}>
              {allDone ? (
                <>
                  <div style={{ fontSize:44,marginBottom:12 }}>🎉</div>
                  <h3 className="font-display" style={{ fontSize:30,color:'var(--heading-color, #ffffff)',marginBottom:8 }}>
                    ALL MODULES COMPLETE!
                  </h3>
                  <p style={{ color:'var(--text-sub, #d1d5db)',fontSize:14,fontWeight:600,marginBottom:20 }}>
                    You've mastered all intermediate simulations. Ready to unlock Advanced tier!
                  </p>

                  {/* Automatically displayed result banner */}
                  <div style={{
                    background: 'var(--gold-bg, rgba(245, 158, 11, 0.12))',
                    border: '2px solid #f59e0b',
                    borderRadius: 18, padding: '20px', marginBottom: 20,
                    maxWidth: 500, margin: '0 auto 20px',
                    animation: 'fadeUp 0.5s ease both'
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>🔓</div>
                    <div className="font-display" style={{ color: '#fbbf24', fontSize: 24 }}>PORTFOLIO TOWER UNLOCKED! 🏢</div>
                    <div style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                      +200 XP Awarded! Premium portfolio strategies & advanced tactics await!
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={() => go('advanced')}
                      style={{ fontSize: 15, padding: '14px 28px' }}>
                      🏢 ENTER PORTFOLIO TOWER →
                    </button>
                    <button className="btn-outline" onClick={() => go('level-map')}
                      style={{ fontSize: 15, padding: '14px 28px' }}>
                      🗺️ LEVEL MAP
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'left', maxWidth: 460, margin: '0 auto' }}>
                  <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>⚡</div>
                  <h4 className="font-display" style={{ fontSize: 24, color: 'var(--heading-color, #ffffff)', marginBottom: 16, textAlign: 'center' }}>
                    ADVANCED UNLOCK CHECKLIST:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                      <span style={{ fontSize: 18 }}>{simulationsDone ? '🟢' : '⚪'}</span>
                      <span>Complete 6 Investment Simulators ({modules.filter(m => modulesDone.includes(m.id)).length}/6 done)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                      <span style={{ fontSize: 18 }}>{mixerDone ? '🟢' : '⚪'}</span>
                      <span>Interact with Savings Portfolio Mixer</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                      <span style={{ fontSize: 18 }}>{cyberDone ? '🟢' : '⚪'}</span>
                      <span>Complete Cyber-Safety Training Game</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mixer' && (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217,119,6,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
              💼 PORTFOLIO MIXER
            </div>
            <h2 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              SAVINGS PORTFOLIO MIXER 🌟
            </h2>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
              Mix and match safe government savings assets to build your optimal Indian portfolio!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {/* Left Column: Sliders & Presets */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#fbbf24', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚙️ ADJUST ASSET ALLOCATIONS
              </h3>
              
              {/* Presets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
                <button onClick={() => applyPreset('safe')} className="btn-outline" style={{ padding: '10px', fontSize: 11 }}>
                  🏰 SAFE FORTRESS
                </button>
                <button onClick={() => applyPreset('growth')} className="btn-outline" style={{ padding: '10px', fontSize: 11 }}>
                  🚀 GROWTH FOCUS
                </button>
                <button onClick={() => applyPreset('cash')} className="btn-outline" style={{ padding: '10px', fontSize: 11 }}>
                  💧 EASY CASH FLOW
                </button>
                <button onClick={() => applyPreset('balanced')} className="btn-outline" style={{ padding: '10px', fontSize: 11 }}>
                  🍭 BALANCED PORTFOLIO
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
                      background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '12px 16px',
                      border: '1.5px solid rgba(217, 119, 6, 0.25)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }}/>
                          <div>
                            <span style={{ fontWeight: 900, fontSize: 14, color: '#ffffff' }} title={SCHEME_NAMES[key]}>{key}</span>
                            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{SCHEME_NAMES[key]}</div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 8 }}>
                            <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 800 }}>RATE:</span>
                            <input
                              type="number"
                              min="0" max="25" step="0.05"
                              value={rate}
                              onChange={(e) => setCustomRates({ ...customRates, [key]: parseFloat(e.target.value) || 0 })}
                              style={{
                                width: 50, padding: '2px 4px', fontSize: 11, fontWeight: 900,
                                background: '#1a1610', border: `1.5px solid ${color}`,
                                borderRadius: 6, textAlign: 'center', color: '#fef3c7', outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 800 }}>%</span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 900, color: color, fontSize: 14 }}>{val}%</span>
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
                background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                border: '1.5px solid rgba(217, 119, 6, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16
              }}>
                <div style={{ position: 'relative', width: 130, height: 130 }}>
                  <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
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
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{yieldRate}%</span>
                    <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 800, marginTop: 2 }}>EST. YIELD</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.keys(alloc).map((key) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
                      fontWeight: 800, color: alloc[key] > 0 ? '#ffffff' : '#71717a',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[key] }}/>
                      <span>{key}: {alloc[key]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compound Growth Projector */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                border: '1.5px solid rgba(217, 119, 6, 0.25)',
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: '#fbbf24', marginBottom: 16 }}>
                  🔮 GROWTH PROJECTOR
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                      <span>MONTHLY SAVINGS</span>
                      <span style={{ color: '#fbbf24' }}>₹{monthlySavings.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range" min="1000" max="50000" step="1000" value={monthlySavings}
                      onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                      <span>TIME HORIZON</span>
                      <span style={{ color: '#fbbf24' }}>{years} YEARS</span>
                    </div>
                    <input
                      type="range" min="1" max="15" step="1" value={years}
                      onChange={(e) => setYears(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 10, textAlign: 'center', background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>TOTAL INVESTED</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#0284c7', marginTop: 3 }}>₹{totalInvested.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>TOTAL RETURNS</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#10b981', marginTop: 3 }}>₹{projectedValue.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>PROFIT AMOUNT</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24', marginTop: 3 }}>+₹{interestEarned.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted, #9ca3af)', fontWeight: 800 }}>PROFIT %</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#e11d48', marginTop: 3 }}>
                      +{totalInvested > 0 ? ((interestEarned / totalInvested) * 100).toFixed(1) : '0.0'}%
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: 12, background: 'rgba(245, 158, 11, 0.12)',
                  border: '1.5px solid #d97706', borderRadius: 16, padding: '10px 14px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11
                }}>
                  <span style={{ color: '#d1d5db', fontWeight: 800 }}>
                    📉 Simple Yield: <strong>₹{(totalInvested + simpleInterestEarned).toLocaleString('en-IN')}</strong>
                  </span>
                  <span style={{ color: '#fbbf24', fontWeight: 900 }}>
                    ✨ Bonus: <strong>+₹{compoundingBonus.toLocaleString('en-IN')}! 🚀</strong>
                  </span>
                </div>
              </div>

              {/* Multi-Goal Savings Planner */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24,
                border: '2px solid rgba(217, 119, 6, 0.3)',
                display: 'flex', flexDirection: 'column', gap: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: '#fbbf24', margin: 0 }}>
                    🎯 SAVINGS GOAL PLANNER
                  </h3>
                  
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    background: inflationActive ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                    padding: '6px 12px', borderRadius: 12,
                    border: `1.5px solid ${inflationActive ? '#f59e0b' : 'rgba(255,255,255,0.15)'}`,
                    userSelect: 'none'
                  }}>
                    <input
                      type="checkbox"
                      checked={inflationActive}
                      onChange={(e) => setInflationActive(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#f59e0b' }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 800, color: inflationActive ? '#fbbf24' : '#9ca3af' }}>
                      👾 INFLATION TIME MACHINE {inflationActive ? 'ON (6% 🇮🇳)' : 'OFF'}
                    </span>
                  </label>
                </div>

                <div style={{
                  background: '#080705', borderRadius: 16, padding: 14,
                  border: '1.5px solid rgba(217,119,6,0.2)',
                  display: 'flex', flexDirection: 'column', gap: 10
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>
                    ➕ ADD TARGET GOAL
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: 10 }}>
                    <div>
                      <input
                        type="text" className="input-light" placeholder="e.g. Laptop"
                        value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: 12 }}
                      />
                    </div>
                    <div>
                      <input
                        type="number" className="input-light" placeholder="Target ₹"
                        value={newGoalAmount} onChange={(e) => setNewGoalAmount(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: 12 }}
                      />
                    </div>
                    <div>
                      <input
                        type="number" className="input-light" placeholder="Years"
                        value={newGoalYears} onChange={(e) => setNewGoalYears(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: 12 }}
                      />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleAddGoal} style={{ padding: '10px', fontSize: 12 }}>
                    ➕ ADD GOAL TO PLAN
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
                          background: 'rgba(255,255,255,0.04)', padding: '12px 14px', borderRadius: 14,
                          border: '1px solid rgba(217,119,6,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 900, color: '#ffffff', fontSize: 13 }}>{g.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>
                              Target: ₹{effectiveTarget.toLocaleString('en-IN')} in {g.years} yrs
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 900, color: '#fbbf24', fontSize: 13 }}>₹{reqMonthly.toLocaleString('en-IN')}/mo</div>
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
      )}

      {activeTab === 'digital' && (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217,119,6,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
              🌐 CYBER SAFETY ARENA
            </div>
            <h2 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              DIGITAL BANKING & SAFETY 🛡️
            </h2>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
              Defend your bank account against real-world phishing traps and cyber scams!
            </p>
          </div>

          {!cyberGameCompleted ? (
            <div className="glass-card" style={{ padding: 24, border: '2px solid #f59e0b', background: 'var(--bg-card-deep, #12100c)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>
                  SCENARIO {digitalScenarioIdx + 1} OF {CYBER_SCENARIOS.length}
                </span>
                <div className="sticker-badge sticker-yellow">
                  🛡️ SHIELD HEALTH: {shieldScore}%
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.12)', borderRadius: 16, padding: 20,
                border: '1.5px solid #d97706', marginBottom: 20
              }}>
                <h3 style={{ fontWeight: 900, fontSize: 16, color: '#ffffff', marginBottom: 8 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].title}
                </h3>
                <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].scenario}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {CYBER_SCENARIOS[digitalScenarioIdx].opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCyberAnswer(i)}
                    className={selectedOpt === i ? (opt.correct ? 'btn-primary' : 'btn-pink') : 'btn-outline'}
                    style={{ textAlign: 'left', fontSize: 13, padding: '14px 18px', width: '100%' }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {digitalFeedback && (
                <div className="anim-fade" style={{
                  background: 'rgba(245,158,11,0.12)', border: '1.5px solid #f59e0b',
                  borderRadius: 14, padding: 16, marginBottom: 20, color: '#fef3c7', fontSize: 13, lineHeight: 1.5
                }}>
                  💡 {digitalFeedback}
                </div>
              )}

              {selectedOpt !== null && (
                <button className="btn-primary" onClick={handleNextScenario} style={{ width: '100%', fontSize: 14 }}>
                  {digitalScenarioIdx < CYBER_SCENARIOS.length - 1 ? 'NEXT SCENARIO →' : '🏆 FINISH CHALLENGE (+50 XP)'}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, background: 'var(--bg-card-deep, #12100c)' }} className="glass-card">
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛡️</div>
              <h3 className="font-display" style={{ fontSize: 32, color: '#fbbf24', marginBottom: 8 }}>
                CHALLENGE PASSED!
              </h3>
              <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                Shield Health: {shieldScore}% • You earned +50 XP and mastered digital bank safety!
              </p>
              <button className="btn-primary" onClick={() => setCyberGameCompleted(false)}>
                🔄 REPLAY SAFETY ARENA
              </button>
            </div>
          )}

          {/* Phone SMS & Phishing Message Analyzer */}
          <MessageScamAnalyzer />

          {/* Video Tutorials Section */}
          <div style={{ marginTop: 32 }}>
            <h3 className="font-display" style={{ fontSize: 24, color: '#ffffff', marginBottom: 16 }}>
              🎬 DIGITAL BANKING TUTORIALS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              {Object.keys(VIDEOS_DB).map(vKey => (
                <button
                  key={vKey}
                  onClick={() => setSelectedVideo(vKey)}
                  className={selectedVideo === vKey ? 'btn-primary' : 'btn-outline'}
                  style={{ fontSize: 12, padding: '12px' }}
                >
                  {VIDEOS_DB[vKey].title}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16, border: '2px solid rgba(217,119,6,0.3)' }}>
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
