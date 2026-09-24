# Python script to update Intermediate.jsx and Advanced.jsx

intermediate_code = """import { useState, useEffect } from 'react'
import { modules } from '../data.js'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'

const SCHEME_NAMES = {
  PPF: 'Public Provident Fund (15-Yr Tax-Free)',
  FD: 'Fixed Deposit (Guaranteed Bank Yield)',
  NSC: 'National Savings Certificate (5-Yr Govt)',
  SSY: 'Sukanya Samriddhi (Girl Child 8.2%)',
  RD: 'Recurring Deposit (Monthly Systematic)',
  MIS: 'Post Office Monthly Income Scheme'
}

const PORTFOLIO_OPTIONS = [
  { id: 'PPF', name: 'PPF', rate: 7.1, years: 15, emoji: '🏰', defaultMonthly: 5000 },
  { id: 'FD', name: 'FD', rate: 7.2, years: 5, emoji: '🔒', defaultMonthly: 5000 },
  { id: 'NSC', name: 'NSC', rate: 7.7, years: 5, emoji: '📜', defaultMonthly: 3000 },
  { id: 'SSY', name: 'SSY', rate: 8.2, years: 21, emoji: '👧', defaultMonthly: 3000 },
  { id: 'RD', name: 'RD', rate: 6.8, years: 3, emoji: '🗓️', defaultMonthly: 3000 },
  { id: 'MIS', name: 'MIS', rate: 7.4, years: 5, emoji: '💵', defaultMonthly: 3000 },
]

function fmt(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function recomputeDefaultNames(items) {
  const counts = {}
  items.forEach(it => {
    counts[it.baseId] = (counts[it.baseId] || 0) + 1
  })
  const seen = {}
  return items.map(it => {
    if (counts[it.baseId] > 1) {
      seen[it.baseId] = (seen[it.baseId] || 0) + 1
      return { ...it, name: `${it.baseId} ${seen[it.baseId]}` }
    }
    return { ...it, name: it.baseId }
  })
}

export default function Intermediate({ go, goBack, canGoBack, state, update, addXP, aiGuideAvatar = 'female', aiGuideName, openAvatarModal, savedPortfolioSimulations = [], onSavePortfolio }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const modulesDone = state.completedModules || []
  const [activeTab, setActiveTab] = useState('simulators') // 'simulators' | 'mixer' | 'portfolio'

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

  // Multi-Asset Portfolio Simulator State Variables
  const [allocationMode, setAllocationMode] = useState('manual') // 'manual' | 'smart'
  const [portfolioItems, setPortfolioItems] = useState([
    { uid: '1', baseId: 'PPF', name: 'PPF', rate: 7.1, years: 15, monthly: 5000, emoji: '🏰' },
    { uid: '2', baseId: 'FD', name: 'FD', rate: 7.2, years: 5, monthly: 5000, emoji: '🔒' },
  ])
  const [portfolioResults, setPortfolioResults] = useState(null)
  const [hasRunSim, setHasRunSim] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [portfolioName, setPortfolioName] = useState('My Investment Portfolio')
  const [saveError, setSaveError] = useState('')
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalAmount) return
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

  const handleAddPortfolioOption = (opt) => {
    const newItem = {
      uid: String(Date.now() + Math.random()),
      baseId: opt.id,
      name: opt.name,
      rate: opt.rate,
      years: opt.years,
      monthly: opt.defaultMonthly,
      emoji: opt.emoji
    }
    const updated = recomputeDefaultNames([...portfolioItems, newItem])
    setPortfolioItems(updated)
    setHasRunSim(false)
  }

  const handleRemovePortfolioOption = (uid) => {
    if (portfolioItems.length <= 1) {
      alert('A portfolio requires at least 2 investment options.')
      return
    }
    const filtered = portfolioItems.filter(it => it.uid !== uid)
    setPortfolioItems(recomputeDefaultNames(filtered))
    setHasRunSim(false)
  }

  const handleUpdatePortfolioItem = (uid, field, val) => {
    setPortfolioItems(prev => prev.map(it => {
      if (it.uid === uid) {
        return { ...it, [field]: val }
      }
      return it
    }))
    setHasRunSim(false)
  }

  const handleSmartAllocation = () => {
    if (portfolioItems.length < 2) return
    setAllocationMode('smart')
    const totalBudget = portfolioItems.reduce((acc, it) => acc + (Number(it.monthly) || 0), 0) || 10000
    const rates = portfolioItems.map(it => Number(it.rate) || 1)
    const maxRate = Math.max(...rates)
    const minRate = Math.min(...rates)
    const rateRange = maxRate - minRate || 1

    const baseShare = Math.max(500, Math.floor((totalBudget * 0.2) / portfolioItems.length))
    let remaining = Math.max(0, totalBudget - baseShare * portfolioItems.length)

    const updated = portfolioItems.map(it => {
      const weight = ((Number(it.rate) || 1) - minRate) / rateRange + 0.5
      return { ...it, weight }
    })
    const totalWeight = updated.reduce((acc, it) => acc + it.weight, 0)
    const finalItems = updated.map(it => {
      const addShare = Math.round((it.weight / totalWeight) * remaining)
      return { ...it, monthly: Math.round((baseShare + addShare) / 100) * 100 }
    })
    setPortfolioItems(finalItems)
    setHasRunSim(false)
  }

  const runPortfolioSimulation = () => {
    if (portfolioItems.length < 2) {
      alert('A portfolio requires at least 2 investment options.')
      return
    }

    let totInv = 0
    let totRet = 0
    let maxYears = 0

    const computed = portfolioItems.map(it => {
      const m = Number(it.monthly) || 0
      const r = Number(it.rate) || 0
      const y = Number(it.years) || 1
      const rm = r / 100 / 12
      const N = y * 12
      const inv = m * N
      const fv = rm > 0 ? m * ((Math.pow(1 + rm, N) - 1) / rm) * (1 + rm) : inv
      const profit = Math.max(0, fv - inv)

      totInv += inv
      totRet += fv
      if (y > maxYears) maxYears = y

      return {
        ...it,
        invested: Math.round(inv),
        finalValue: Math.round(fv),
        profit: Math.round(profit),
        years: y,
        monthly: m,
        rate: r
      }
    })

    const totProf = Math.max(0, totRet - totInv)
    const profPct = totInv > 0 ? ((totProf / totInv) * 100).toFixed(1) : '0.0'

    const gaps = computed
      .filter(it => it.years < maxYears)
      .map(it => ({
        name: it.name,
        maturesAt: it.years,
        maturedCorpus: Math.round(it.finalValue),
        gapYears: maxYears - it.years
      }))

    setPortfolioResults({
      computedItems: computed,
      totalInvested: Math.round(totInv),
      totalReturns: Math.round(totRet),
      totalProfit: Math.round(totProf),
      profitPct: profPct,
      maxHorizon: maxYears,
      gapPeriods: gaps
    })

    setHasRunSim(true)

    if (!modulesDone.includes('portfolio_sim')) {
      update({ completedModules: [...modulesDone, 'portfolio_sim'] })
      addXP(100)
    }
  }

  const handleConfirmSavePortfolio = () => {
    const nameToSave = portfolioName.trim() || 'My Portfolio'
    if (onSavePortfolio && portfolioResults) {
      onSavePortfolio({
        id: Date.now(),
        name: nameToSave,
        createdAt: new Date().toLocaleDateString(),
        allocationMode,
        items: portfolioItems,
        results: portfolioResults
      })
      setSaveSuccessMsg(`✅ Portfolio "${nameToSave}" successfully saved!`)
      setTimeout(() => setSaveSuccessMsg(''), 4000)
    }
    setShowSaveModal(false)
  }

  const handleModule = (mod) => {
    update({ currentModule: mod })
    go('simulation')
  }

  const simulationsDone = modules.every(m => modulesDone.includes(m.id))
  const mixerDone = modulesDone.includes('mixer')
  const portfolioDone = modulesDone.includes('portfolio_sim')
  const allDone = simulationsDone && mixerDone && portfolioDone

  useEffect(() => {
    if (allDone && !state.advancedUnlocked) {
      addXP(200)
      update({ advancedUnlocked: true })
    }
  }, [allDone, state.advancedUnlocked])

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
          onClick={() => setActiveTab('portfolio')}
          className={activeTab === 'portfolio' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 180px', fontSize: 13, padding: '12px 18px' }}
        >
          📊 COMBINED WEALTH METRICS 📈
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="anim-fade" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #10b981', color: '#6ee7b7', padding: '12px 20px', borderRadius: 16, marginBottom: 20, fontWeight: 800, fontSize: 13, textAlign: 'center' }}>
          {saveSuccessMsg}
        </div>
      )}

      {activeTab === 'simulators' && (
        <div className="anim-fade">
          <div className="glass-card anim-fade" style={{ padding:'26px 30px', marginBottom:24, border:'1.5px solid rgba(217,119,6,0.3)', background: 'var(--bg-card-deep, #12100c)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
              <span style={{ fontSize:38 }}>🔬</span>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom:4 }}>LEVEL 2 • INVESTMENT LAB</div>
                <h2 className="font-display" style={{ fontSize:28, color:'var(--heading-color, #ffffff)', margin:0 }}>INDIAN INVESTMENT CALCULATOR LAB</h2>
              </div>
            </div>
            <p style={{ color:'var(--text-sub, #d1d5db)', fontSize:14, lineHeight:1.6, margin:0 }}>
              Test real Indian schemes (PPF, FD, NSC, SSY, RD, MIS), compound interest models, inflation impact, and custom tenure goals!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {modules.map((mod, idx) => {
              const isDone = modulesDone.includes(mod.id)
              return (
                <div
                  key={mod.id}
                  className="glass-card anim-scale"
                  style={{
                    padding: 24,
                    background: 'var(--bg-card-deep, #12100c)',
                    border: `2px solid ${isDone ? '#10b981' : '#f59e0b'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 36 }}>{mod.icon}</span>
                      {isDone ? (
                        <span className="sticker-badge sticker-lime">✅ COMPLETED</span>
                      ) : (
                        <span className="sticker-badge sticker-yellow">READY TO SIMULATE</span>
                      )}
                    </div>
                    <h3 className="font-display" style={{ fontSize: 20, color: '#ffffff', marginBottom: 6 }}>
                      {mod.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16 }}>
                      {mod.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleModule(mod.id)}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: 13 }}
                  >
                    {isDone ? '🔄 RE-SIMULATE MODULE →' : '🚀 START CALCULATOR →'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'mixer' && (
        <div className="anim-fade">
          <div className="glass-card-deep" style={{ padding: '28px', marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217,119,6,0.4)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8 }}>
                💼 INTERACTIVE PORTFOLIO ALLOCATION
              </div>
              <h2 className="font-display" style={{ fontSize: 32, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
                SAVINGS & SCHEME MIXER 🌟
              </h2>
              <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
                Adjust your monthly savings across 6 government & bank schemes to see your projected wealth growth!
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 6 }}>
                    MONTHLY SAVINGS AMOUNT (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={e => setMonthlySavings(Math.max(500, parseInt(e.target.value) || 0))}
                    className="input-light"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16, fontWeight: 900 }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 6 }}>
                    INVESTMENT TENURE ({years} YEARS)
                  </label>
                  <input
                    type="range" min="1" max="25" value={years}
                    onChange={e => setYears(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#f59e0b' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn-outline" onClick={() => setAlloc({ PPF: 40, FD: 40, RD: 20, NSC: 0, SSY: 0, MIS: 0 })} style={{ fontSize: 11, padding: '6px 12px' }}>🛡️ Safe Haven</button>
                  <button className="btn-outline" onClick={() => setAlloc({ NSC: 60, PPF: 40, FD: 0, SSY: 0, RD: 0, MIS: 0 })} style={{ fontSize: 11, padding: '6px 12px' }}>🚀 High Yield</button>
                  <button className="btn-outline" onClick={() => setAlloc({ PPF: 25, FD: 25, NSC: 20, SSY: 10, RD: 10, MIS: 10 })} style={{ fontSize: 11, padding: '6px 12px' }}>⚖️ Balanced</button>
                </div>
              </div>

              <div style={{ background: 'rgba(18, 16, 12, 0.95)', padding: 24, borderRadius: 20, border: '1.5px solid #f59e0b' }}>
                <h4 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginBottom: 16, textAlign: 'center' }}>
                  ALLOCATION BREAKDOWN
                </h4>
                {Object.keys(alloc).map(sch => (
                  <div key={sch} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                      <span>{SCHEME_NAMES[sch]}</span>
                      <span style={{ color: '#fbbf24' }}>{alloc[sch]}% (₹{Math.round((monthlySavings * alloc[sch]) / 100)}/mo)</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={alloc[sch]}
                      onChange={e => setAlloc({ ...alloc, [sch]: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', accentColor: '#10b981' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: COMBINED WEALTH METRICS & MULTI-ASSET PORTFOLIO SIMULATOR ─── */}
      {activeTab === 'portfolio' && (
        <div className="anim-fade">
          {/* Top Title Banner */}
          <div className="glass-card-deep" style={{ padding: '24px', borderRadius: 24, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <span style={{ fontSize: 36 }}>📊</span>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom: 4 }}>
                  LEVEL 2 • MULTI-ASSET PORTFOLIO SIMULATOR
                </div>
                <h2 className="font-display" style={{ fontSize: 26, color: '#ffffff', margin: 0 }}>
                  MULTI-ASSET PORTFOLIO SIMULATOR
                </h2>
              </div>
            </div>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, margin: '6px 0 0', fontWeight: 600 }}>
              Select 2 or more investment instruments, simulate combined wealth outcomes, and analyze reinvestment gap periods.
            </p>
          </div>

          {/* Instrument Add Bar */}
          <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 12 }}>
              ➕ CLICK "+" TO ADD INVESTMENT OPTIONS TO YOUR PORTFOLIO:
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PORTFOLIO_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 14,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  <span>{opt.emoji} {opt.name}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{opt.rate}% • {opt.years} Yrs</span>
                  <button
                    onClick={() => handleAddPortfolioOption(opt)}
                    style={{
                      background: '#10b981', color: '#ffffff', border: 'none',
                      borderRadius: '50%', width: 24, height: 24, cursor: 'pointer',
                      fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title={`Add ${opt.name} to portfolio`}
                  >+</button>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Strategy Switcher */}
          <div className="glass-card-deep" style={{ padding: 18, borderRadius: 20, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase' }}>
                ⚙️ PORTFOLIO ALLOCATION STRATEGY
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                Choose how monthly funds are allocated across your selected investments
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setAllocationMode('manual')}
                className={allocationMode === 'manual' ? 'btn-primary' : 'btn-outline'}
                style={{ fontSize: 12, padding: '8px 18px' }}
              >
                🔥 Manual Allocation
              </button>
              <button
                onClick={handleSmartAllocation}
                className={allocationMode === 'smart' ? 'btn-primary' : 'btn-outline'}
                style={{ fontSize: 12, padding: '8px 18px' }}
              >
                ⚡ Smart Allocation
              </button>
            </div>
          </div>

          {/* Selected Portfolio Investments Table Box */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 18, color: '#ffffff', margin: 0 }}>
                  SELECTED PORTFOLIO INVESTMENTS ({portfolioItems.length})
                </h3>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', fontWeight: 600 }}>
                  Configure individual monthly amounts, return expectations, and tenure. You can rename any option.
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: portfolioItems.length >= 2 ? '#10b981' : '#f59e0b' }}>
                {portfolioItems.length >= 2 ? '✓ Ready for Simulation' : '⚠️ Need at least 2 investments'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {portfolioItems.map((item) => (
                <div
                  key={item.uid}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1.5px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: 16,
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr)) auto',
                    gap: 12,
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>SCHEME NAME</label>
                    <input
                      type="text"
                      className="input-light"
                      value={item.name}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'name', e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>MONTHLY (₹)</label>
                    <input
                      type="number"
                      className="input-light"
                      value={item.monthly}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'monthly', Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>RATE (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-light"
                      value={item.rate}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>TENURE (YRS)</label>
                    <input
                      type="number"
                      className="input-light"
                      value={item.years}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'years', Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <button
                    onClick={() => handleRemovePortfolioOption(item.uid)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1.5px solid #ef4444',
                      color: '#fca5a5',
                      borderRadius: '50%',
                      width: 28, height: 28,
                      cursor: 'pointer',
                      fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Remove investment option"
                  >✕</button>
                </div>
              ))}
            </div>

            <button
              onClick={runPortfolioSimulation}
              className="btn-primary"
              style={{ width: '100%', fontSize: 15, padding: '14px 24px', fontWeight: 900 }}
            >
              🚀 RUN PORTFOLIO SIMULATION
            </button>
          </div>

          {/* COMBINED WEALTH METRICS REPORT BOX */}
          {hasRunSim && portfolioResults && (
            <div className="glass-card-deep anim-scale" style={{ padding: 28, borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="sticker-badge sticker-lime" style={{ marginBottom: 4 }}>
                    OVERALL PORTFOLIO REPORT
                  </div>
                  <h2 className="font-display" style={{ fontSize: 26, color: '#ffffff', margin: 0 }}>
                    COMBINED WEALTH METRICS
                  </h2>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '6px 14px', borderRadius: 999, border: '1px solid #f59e0b' }}>
                  Longest Investment Horizon: {portfolioResults.maxHorizon} Years
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid #38bdf8', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL INVESTMENT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>{fmt(portfolioResults.totalInvested)}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1.5px solid rgba(255, 255, 255, 0.2)', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#d1d5db', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL RETURNS</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff' }}>{fmt(portfolioResults.totalReturns)}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL PROFIT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>+{fmt(portfolioResults.totalProfit)}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>PROFIT PERCENTAGE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>+{portfolioResults.profitPct}%</div>
                </div>
              </div>

              {/* Combined Invested vs Returns Breakdown Bar */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1.5px solid rgba(255, 255, 255, 0.1)', padding: 18, borderRadius: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                  <span style={{ color: '#ffffff' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                  <span style={{ color: '#94a3b8' }}>Portfolio Value: {fmt(portfolioResults.totalReturns)} (100%)</span>
                </div>
                <div style={{ height: 16, background: '#10b981', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
                  <div style={{ width: `${(portfolioResults.totalInvested / portfolioResults.totalReturns) * 100}%`, background: '#0284c7', height: '100%' }} />
                  <div style={{ width: `${(portfolioResults.totalProfit / portfolioResults.totalReturns) * 100}%`, background: '#10b981', height: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 11, fontWeight: 800 }}>
                  <span style={{ color: '#38bdf8' }}>🟦 TOTAL INVESTED: {((portfolioResults.totalInvested / portfolioResults.totalReturns) * 100).toFixed(1)}% ({fmt(portfolioResults.totalInvested)})</span>
                  <span style={{ color: '#6ee7b7' }}>🟩 TOTAL RETURNS (PROFIT): {((portfolioResults.totalProfit / portfolioResults.totalReturns) * 100).toFixed(1)}% ({fmt(portfolioResults.totalProfit)})</span>
                </div>
              </div>

              {/* Gap Periods & Reinvestment Analysis */}
              {portfolioResults.gapPeriods && portfolioResults.gapPeriods.length > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1.5px solid rgba(245, 158, 11, 0.3)', padding: 20, borderRadius: 18, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>⌛</span>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                        GAP PERIODS & REINVESTMENT ANALYSIS
                      </h4>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>
                        Understand when earlier investments mature and how to put the matured corpus to work during the remaining gap years.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {portfolioResults.gapPeriods.map((gap, gIdx) => (
                      <div key={gIdx} style={{ background: 'rgba(18, 16, 12, 0.9)', border: '1.5px solid #f59e0b', padding: 16, borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 13 }}>
                            🔒 {gap.name} matures at Year {gap.maturesAt}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: 999, border: '1px solid #f59e0b' }}>
                            {gap.gapYears} YEARS GAP AVAILABLE
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                          At Year {gap.maturesAt}, {gap.name} will fully mature with an estimated payout corpus of <strong style={{ color: '#10b981' }}>{fmt(gap.maturedCorpus)}</strong>. Because your overall portfolio horizon runs for {portfolioResults.maxHorizon} years, you have a <strong>{gap.gapYears}-year gap period</strong> before longer-term investments conclude.
                        </p>
                        <div style={{ marginTop: 8, fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>
                          💡 Smart Utilization Tip: You can redeploy this matured {fmt(gap.maturedCorpus)} into short-term liquid funds, higher-yield corporate FDs, or utilize it for targeted mid-term life goals!
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => setShowSaveModal(true)}
                style={{ width: '100%', fontSize: 14, padding: '12px 20px', fontWeight: 900 }}
              >
                💾 SAVE PORTFOLIO SIMULATION
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Portfolio Modal */}
      {showSaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 7, 5, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-card-deep anim-scale" style={{ maxWidth: 460, width: '100%', borderRadius: 20, padding: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0 }}>SAVE PORTFOLIO SIMULATION</h3>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Name this overall portfolio model</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 6 }}>PORTFOLIO SIMULATION NAME</label>
              <input
                type="text"
                className="input-light"
                value={portfolioName}
                onChange={e => setPortfolioName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-outline" onClick={() => setShowSaveModal(false)} style={{ padding: '8px 18px', fontSize: 12 }}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmSavePortfolio} style={{ padding: '8px 22px', fontSize: 12, fontWeight: 900 }}>Save Portfolio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"""

with open("c:/Users/kavya/Downloads/Telegram Desktop/learn2invest_project/Learn2Invest/src/screens/Intermediate.jsx", "w", encoding="utf-8") as f:
    f.write(intermediate_code)

print("Updated Intermediate.jsx successfully!")
