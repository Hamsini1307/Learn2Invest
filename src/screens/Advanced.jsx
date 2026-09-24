import { useState } from 'react'

function fmt(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcFV(monthly, rate, years) {
  const r = rate / 100 / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

// Available Investment Options for Portfolio Construction
export const INVESTMENT_OPTIONS = [
  { id: 'PPF', name: 'Public Provident Fund', shortName: 'PPF', emoji: '🏰', defaultRate: 7.1, defaultYears: 15, defaultMonthly: 5000, desc: '15-Year sovereign backed EEE tax-free growth' },
  { id: 'FD', name: 'Fixed Deposit', shortName: 'FD', emoji: '🔒', defaultRate: 7.2, defaultYears: 5, defaultMonthly: 5000, desc: 'Guaranteed fixed returns with flexible tenure' },
  { id: 'NSC', name: 'National Savings Certificate', shortName: 'NSC', emoji: '📜', defaultRate: 7.7, defaultYears: 5, defaultMonthly: 4000, desc: '5-Year post office compounding certificate' },
  { id: 'SSY', name: 'Sukanya Samriddhi Yojana', shortName: 'SSY', emoji: '👧', defaultRate: 8.2, defaultYears: 21, defaultMonthly: 3000, desc: 'High-yield tax-exempt scheme for the girl child' },
  { id: 'RD', name: 'Recurring Deposit', shortName: 'RD', emoji: '📅', defaultRate: 6.8, defaultYears: 3, defaultMonthly: 3000, desc: 'Disciplined monthly installment bank deposits' },
  { id: 'MIS', name: 'Monthly Income Scheme', shortName: 'MIS', emoji: '💵', defaultRate: 7.4, defaultYears: 5, defaultMonthly: 5000, desc: 'Post office monthly payout safe instrument' },
  { id: 'MF_EQUITY', name: 'Mutual Fund (Equity SIP)', shortName: 'Equity SIP', emoji: '📈', defaultRate: 12.0, defaultYears: 10, defaultMonthly: 5000, desc: 'Diversified index/equity fund for high long-term returns' },
  { id: 'SGB', name: 'Sovereign Gold Bond', shortName: 'Gold Bond', emoji: '🪙', defaultRate: 9.5, defaultYears: 8, defaultMonthly: 4000, desc: 'RBI backed gold appreciation + 2.5% fixed interest' },
]

export default function Advanced({
  go,
  goBack,
  state,
  savedPortfolioSimulations = [],
  onSavePortfolio,
  onUpdateSavedPortfolio,
  onDeleteSavedPortfolio,
}) {
  const [activeTab, setActiveTab] = useState('portfolio') // 'portfolio' | 'saved'
  const [allocationMode, setAllocationMode] = useState('manual') // 'manual' | 'smart'
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(25000)

  // Portfolio items in the simulation
  const [portfolioItems, setPortfolioItems] = useState([
    {
      uid: 'item_1',
      optionId: 'PPF',
      name: 'PPF',
      emoji: '🏰',
      monthly: 5000,
      rate: 7.1,
      years: 15,
    },
    {
      uid: 'item_2',
      optionId: 'FD',
      name: 'FD',
      emoji: '🔒',
      monthly: 5000,
      rate: 7.2,
      years: 5,
    },
  ])

  // Portfolio Custom Name
  const [portfolioName, setPortfolioName] = useState(
    `Portfolio Simulation ${(savedPortfolioSimulations?.length || 0) + 1}`
  )

  // Has simulation been calculated/run?
  const [simRun, setSimRun] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')
  const [saveError, setSaveError] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)

  // In-Screen Saved Details & Edit States
  const [selectedSavedPortfolio, setSelectedSavedPortfolio] = useState(null)
  const [isEditingSaved, setIsEditingSaved] = useState(false)
  const [editPortfolioName, setEditPortfolioName] = useState('')
  const [editItems, setEditItems] = useState([])
  const [editError, setEditError] = useState('')
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  // Helper to generate default names according to count (e.g. FD 1, FD 2 or just RD)
  const recomputeDefaultNames = (items) => {
    const counts = {}
    items.forEach((it) => {
      counts[it.optionId] = (counts[it.optionId] || 0) + 1
    })

    const tracker = {}
    return items.map((it) => {
      tracker[it.optionId] = (tracker[it.optionId] || 0) + 1
      const totalOfThisType = counts[it.optionId]
      // If user hasn't explicitly customized, or updating defaults
      const autoName = totalOfThisType > 1 ? `${it.optionId} ${tracker[it.optionId]}` : it.optionId
      return {
        ...it,
        name: it.customName ? it.name : autoName,
      }
    })
  }

  // Add investment option on clicking '+'
  const handleAddOption = (opt) => {
    const newUid = `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    const rawItems = [
      ...portfolioItems,
      {
        uid: newUid,
        optionId: opt.id,
        name: opt.shortName,
        emoji: opt.emoji,
        monthly: opt.defaultMonthly,
        rate: opt.defaultRate,
        years: opt.defaultYears,
        customName: false,
      },
    ]
    setPortfolioItems(recomputeDefaultNames(rawItems))
    setSimRun(false)
  }

  // Remove investment row
  const handleRemoveItem = (uid) => {
    if (portfolioItems.length <= 1) {
      alert('A portfolio requires at least 2 investment options.')
      return
    }
    const filtered = portfolioItems.filter((it) => it.uid !== uid)
    setPortfolioItems(recomputeDefaultNames(filtered))
    setSimRun(false)
  }

  // Update item field
  const handleUpdateItem = (uid, field, val) => {
    setPortfolioItems((prev) =>
      prev.map((it) => {
        if (it.uid === uid) {
          const isCustomName = field === 'name' ? true : it.customName
          return { ...it, [field]: val, customName: isCustomName }
        }
        return it
      })
    )
    setSimRun(false)
  }

  // Smart Allocation Algorithm: Optimize monthly allocations to maximize profit
  const applySmartAllocation = () => {
    if (portfolioItems.length < 2) return
    const totalBudget = Number(totalMonthlyBudget) || 20000

    // Compute profit multiplier per rupee for each instrument
    const multipliers = portfolioItems.map((it) => {
      const r = Number(it.rate) || 1
      const y = Number(it.years) || 1
      const rMonth = r / 100 / 12
      const nMonths = y * 12
      const fvPerRe = rMonth > 0 ? ((Math.pow(1 + rMonth, nMonths) - 1) / rMonth) * (1 + rMonth) : nMonths
      const profitPerRe = Math.max(0, fvPerRe - nMonths)
      return { uid: it.uid, profitPerRe, years: y, rate: r }
    })

    // Baseline minimum allocation (10% of budget divided evenly, min ₹500)
    const baseShare = Math.max(500, Math.floor((totalBudget * 0.15) / portfolioItems.length))
    let remainingBudget = Math.max(0, totalBudget - baseShare * portfolioItems.length)

    // Sum of profit multipliers for remaining distribution
    const totalMultiplier = multipliers.reduce((sum, m) => sum + m.profitPerRe, 0)

    const updated = portfolioItems.map((it) => {
      const mult = multipliers.find((m) => m.uid === it.uid)
      const propShare = totalMultiplier > 0 ? (mult.profitPerRe / totalMultiplier) * remainingBudget : 0
      const allocated = Math.round((baseShare + propShare) / 100) * 100
      return {
        ...it,
        monthly: allocated,
      }
    })

    setPortfolioItems(updated)
    setAllocationMode('smart')
    setSimRun(true)
  }

  // Run / Calculate Portfolio Simulation
  const handleRunSimulation = () => {
    if (portfolioItems.length < 2) {
      alert('Please select at least 2 investment options to run a portfolio simulation.')
      return
    }
    if (allocationMode === 'smart') {
      applySmartAllocation()
    } else {
      setSimRun(true)
    }
  }

  // Calculate Combined Portfolio Results
  let totalInvested = 0
  let totalReturns = 0
  let maxHorizon = 0

  const computedItems = portfolioItems.map((it) => {
    const m = Number(it.monthly) || 0
    const r = Number(it.rate) || 0
    const y = Number(it.years) || 1
    if (y > maxHorizon) maxHorizon = y
    const inv = m * y * 12
    const ret = calcFV(m, r, y)
    const prof = Math.max(0, ret - inv)
    totalInvested += inv
    totalReturns += ret
    return {
      ...it,
      invested: inv,
      returns: Math.round(ret),
      profit: Math.round(prof),
    }
  })

  const totalProfit = Math.max(0, totalReturns - totalInvested)
  const profitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0'

  // Invested vs. Returns Breakdown Bar Percentages (Total Returns = 100%)
  const investedPct = totalReturns > 0 ? Math.min(100, Math.max(0, (totalInvested / totalReturns) * 100)) : 100
  const returnsPct = Math.max(0, 100 - investedPct)

  // Gap Periods Analysis: compare each investment horizon against maxHorizon
  const gapAnalysisList = computedItems
    .map((it) => {
      const gapYears = maxHorizon - it.years
      return {
        name: it.name,
        emoji: it.emoji,
        years: it.years,
        gapYears,
        maturedCorpus: it.returns,
      }
    })
    .filter((g) => g.gapYears > 0)

  // Save Portfolio Simulation
  const handleOpenSaveModal = () => {
    setSaveError('')
    setShowSaveModal(true)
  }

  const handleConfirmSavePortfolio = () => {
    setSaveError('')
    const nameToSave = portfolioName.trim() || 'Portfolio Simulation'

    // Duplicate check: all items, names, monthly, rates, and years identical
    const isDuplicate = savedPortfolioSimulations.some((s) => {
      if (s.items?.length !== computedItems.length) return false
      return s.items.every((it, idx) => {
        const c = computedItems[idx]
        return (
          c &&
          it.optionId === c.optionId &&
          Number(it.monthly) === Number(c.monthly) &&
          Number(it.rate) === Number(c.rate) &&
          Number(it.years) === Number(c.years)
        )
      })
    })

    if (isDuplicate) {
      setSaveError('This portfolio simulation already exists with these exact investments and values.')
      return
    }

    const newPortfolio = {
      id: `port_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: nameToSave,
      allocationMode,
      items: computedItems.map((c) => ({
        optionId: c.optionId,
        name: c.name,
        emoji: c.emoji,
        monthly: c.monthly,
        rate: c.rate,
        years: c.years,
        invested: c.invested,
        returns: c.returns,
        profit: c.profit,
      })),
      results: {
        totalInvested,
        totalReturns: Math.round(totalReturns),
        totalProfit: Math.round(totalProfit),
        profitPct,
        maxHorizon,
      },
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }

    if (onSavePortfolio) {
      onSavePortfolio(newPortfolio)
    }
    setShowSaveModal(false)
    setSaveSuccessMsg(`✅ Portfolio "${nameToSave}" successfully saved! (0 XP awarded)`)
    setTimeout(() => setSaveSuccessMsg(''), 4500)
  }

  // Open Saved Simulation in Read-Only Mode
  const handleOpenSavedPortfolio = (sim) => {
    setSelectedSavedPortfolio(sim)
    setIsEditingSaved(false)
    setEditError('')
    setEditPortfolioName(sim.name)
    setEditItems(JSON.parse(JSON.stringify(sim.items || [])))
  }

  // Save changes to saved portfolio simulation
  const handleSaveEditChanges = () => {
    setEditError('')
    if (!selectedSavedPortfolio) return

    let totInv = 0
    let totRet = 0
    let maxH = 0

    const recalculated = editItems.map((it) => {
      const m = Number(it.monthly) || 0
      const r = Number(it.rate) || 0
      const y = Number(it.years) || 1
      if (y > maxH) maxH = y
      const inv = m * y * 12
      const ret = calcFV(m, r, y)
      const prof = Math.max(0, ret - inv)
      totInv += inv
      totRet += ret
      return {
        ...it,
        monthly: m,
        rate: r,
        years: y,
        invested: inv,
        returns: Math.round(ret),
        profit: Math.round(prof),
      }
    })

    const totProf = Math.max(0, totRet - totInv)
    const profPct = totInv > 0 ? ((totProf / totInv) * 100).toFixed(1) : '0.0'

    const updated = {
      ...selectedSavedPortfolio,
      name: editPortfolioName.trim() || selectedSavedPortfolio.name,
      items: recalculated,
      results: {
        totalInvested: totInv,
        totalReturns: Math.round(totRet),
        totalProfit: Math.round(totProf),
        profitPct,
        maxHorizon: maxH,
      },
    }

    if (onUpdateSavedPortfolio) {
      onUpdateSavedPortfolio(updated)
    }
    setSelectedSavedPortfolio(updated)
    setIsEditingSaved(false)
  }

  // Confirm delete of saved portfolio
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return
    if (onDeleteSavedPortfolio) {
      onDeleteSavedPortfolio(deleteConfirmTarget.id)
    }
    if (selectedSavedPortfolio?.id === deleteConfirmTarget.id) {
      setSelectedSavedPortfolio(null)
    }
    setDeleteConfirmTarget(null)
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Breadcrumb & Tab Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn-outline" onClick={goBack || (() => go('landing'))}>
          ⬅ Back to Previous Page
        </button>

        {/* View Switcher: Portfolio Simulator vs. Saved Simulations */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-main, #080705)', padding: 4, borderRadius: 999, border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))' }}>
          <button
            onClick={() => { setActiveTab('portfolio'); setSelectedSavedPortfolio(null) }}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'portfolio' ? 'linear-gradient(135deg, #10b981, #0284c7)' : 'transparent',
              color: activeTab === 'portfolio' ? '#ffffff' : 'var(--heading-color, #ffffff)',
              border: 'none',
            }}
          >
            🏢 Portfolio Tower
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'saved' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: activeTab === 'saved' ? '#080705' : 'var(--heading-color, #ffffff)',
              border: 'none',
            }}
          >
            📂 Saved Portfolios ({savedPortfolioSimulations.length})
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', color: '#6ee7b7', padding: '12px 18px', borderRadius: 14, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
          {saveSuccessMsg}
        </div>
      )}

      {/* ─── TAB 1: PORTFOLIO SIMULATION STUDIO ─── */}
      {activeTab === 'portfolio' && (
        <div>
          {/* Studio Banner */}
          <div className="glass-card-deep anim-scale" style={{ padding: '28px', borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217,119,6,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom: 6 }}>
                  LEVEL 3 • WEALTH ENGINE
                </div>
                <h1 className="font-display" style={{ fontSize: 32, color: 'var(--heading-color, #ffffff)', margin: '0 0 4px 0' }}>
                  MULTI-ASSET PORTFOLIO SIMULATOR
                </h1>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, margin: 0 }}>
                  Select 2 or more investment instruments, simulate combined wealth outcomes, and analyze reinvestment gap periods.
                </p>
              </div>

              {/* Save Portfolio Button */}
              {simRun && (
                <button
                  onClick={handleOpenSaveModal}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #0284c7)',
                    border: '1.5px solid #6ee7b7',
                    color: '#ffffff',
                    borderRadius: 999,
                    padding: '10px 22px',
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                  }}
                >
                  <span>💾</span>
                  <span>SAVE PORTFOLIO</span>
                </button>
              )}
            </div>
          </div>

          {/* 1. HORIZONTAL INVESTMENT OPTIONS SELECTOR (WITH + SYMBOL) */}
          <div className="glass-card-deep" style={{ padding: '20px', borderRadius: 20, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid var(--border-light, rgba(217,119,6,0.3))' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.5px' }}>
              ➕ CLICK "+" TO ADD INVESTMENT OPTIONS TO YOUR PORTFOLIO:
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollbarWidth: 'thin',
              }}
            >
              {INVESTMENT_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  style={{
                    flexShrink: 0,
                    background: 'var(--bg-main, #080705)',
                    border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))',
                    borderRadius: 14,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    minWidth: 190,
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--heading-color, #ffffff)' }}>
                        {opt.shortName}
                      </div>
                      <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>
                        {opt.defaultRate}% • {opt.defaultYears} Yrs
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddOption(opt)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                    }}
                    title={`Add ${opt.name} to portfolio`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ALLOCATION MODE SWITCHER: MANUAL VS. SMART ALLOCATION */}
          <div className="glass-card-deep" style={{ padding: '20px 24px', borderRadius: 20, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid var(--border-light, rgba(217,119,6,0.3))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)', textTransform: 'uppercase' }}>
                  ⚙️ PORTFOLIO ALLOCATION STRATEGY
                </span>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--heading-color, #ffffff)', marginTop: 2 }}>
                  Choose how monthly funds are allocated across your selected investments
                </div>
              </div>

              {/* Mode Toggles */}
              <div style={{ display: 'flex', gap: 8, background: 'var(--bg-main, #080705)', padding: 4, borderRadius: 999, border: '1px solid var(--border-light, rgba(217,119,6,0.3))' }}>
                <button
                  onClick={() => setAllocationMode('manual')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                    background: allocationMode === 'manual' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                    color: allocationMode === 'manual' ? '#080705' : 'var(--heading-color, #ffffff)',
                    border: 'none',
                  }}
                >
                  ✍️ Manual Allocation
                </button>
                <button
                  onClick={() => setAllocationMode('smart')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                    background: allocationMode === 'smart' ? 'linear-gradient(135deg, #10b981, #0284c7)' : 'transparent',
                    color: allocationMode === 'smart' ? '#ffffff' : 'var(--heading-color, #ffffff)',
                    border: 'none',
                  }}
                >
                  ⚡ Smart Allocation
                </button>
              </div>
            </div>

            {/* Smart Allocation Controls if Active */}
            {allocationMode === 'smart' && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#10b981', display: 'block', marginBottom: 4 }}>
                    TOTAL MONTHLY INVESTMENT BUDGET (₹):
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="2000"
                    className="input-light"
                    value={totalMonthlyBudget}
                    onChange={(e) => setTotalMonthlyBudget(Number(e.target.value))}
                    style={{ fontSize: 16, fontWeight: 900, width: '100%', maxWidth: 300 }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                    The system will automatically divide this total monthly budget across selected schemes to maximize total profit.
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={applySmartAllocation}
                  style={{ padding: '12px 24px', fontSize: 13, fontWeight: 900 }}
                >
                  ⚡ CALCULATE OPTIMAL DISTRIBUTION
                </button>
              </div>
            )}
          </div>

          {/* 3. SELECTED INVESTMENT ROWS */}
          <div className="glass-card-deep" style={{ padding: '24px', borderRadius: 20, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid var(--border-light, rgba(217,119,6,0.3))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                  SELECTED PORTFOLIO INVESTMENTS ({portfolioItems.length})
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginTop: 2 }}>
                  Configure individual monthly amounts, return expectations, and tenure. You can rename any option.
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>
                {portfolioItems.length >= 2 ? '✓ Ready for Simulation' : '⚠️ Need at least 2 investments'}
              </div>
            </div>

            {/* List of Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {portfolioItems.map((item, idx) => (
                <div
                  key={item.uid}
                  style={{
                    background: 'var(--bg-main, #080705)',
                    border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                    borderRadius: 16,
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr 40px',
                    gap: 14,
                    alignItems: 'center',
                  }}
                >
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                      SCHEME NAME
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span>
                      <input
                        type="text"
                        className="input-light"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.uid, 'name', e.target.value)}
                        style={{ padding: '6px 10px', fontSize: 13, fontWeight: 800 }}
                      />
                    </div>
                  </div>

                  {/* Monthly Investment */}
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                      MONTHLY (₹)
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      className="input-light"
                      value={item.monthly}
                      disabled={allocationMode === 'smart'}
                      onChange={(e) => handleUpdateItem(item.uid, 'monthly', Number(e.target.value))}
                      style={{ padding: '6px 10px', fontSize: 13, fontWeight: 800, opacity: allocationMode === 'smart' ? 0.75 : 1 }}
                    />
                  </div>

                  {/* Return Rate */}
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                      RATE (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="30"
                      className="input-light"
                      value={item.rate}
                      onChange={(e) => handleUpdateItem(item.uid, 'rate', Number(e.target.value))}
                      style={{ padding: '6px 10px', fontSize: 13, fontWeight: 800 }}
                    />
                  </div>

                  {/* Tenure in Years */}
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                      TENURE (YRS)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      className="input-light"
                      value={item.years}
                      onChange={(e) => handleUpdateItem(item.uid, 'years', Number(e.target.value))}
                      style={{ padding: '6px 10px', fontSize: 13, fontWeight: 800 }}
                    />
                  </div>

                  {/* Delete Row Button */}
                  <div style={{ textAlign: 'center', paddingTop: 14 }}>
                    <button
                      onClick={() => handleRemoveItem(item.uid)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #ef4444',
                        color: '#f87171',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 900,
                      }}
                      title="Remove this investment"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Button */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={handleRunSimulation}
                style={{ padding: '14px 32px', fontSize: 14, fontWeight: 900 }}
              >
                🚀 RUN PORTFOLIO SIMULATION
              </button>

              {/* Smart Allocation shortcut after running manual */}
              {allocationMode === 'manual' && simRun && (
                <button
                  className="btn-outline"
                  onClick={() => {
                    const currentSum = computedItems.reduce((acc, c) => acc + Number(c.monthly), 0)
                    setTotalMonthlyBudget(currentSum)
                    setAllocationMode('smart')
                    applySmartAllocation()
                  }}
                  style={{ padding: '14px 24px', fontSize: 13, color: '#10b981', borderColor: '#10b981' }}
                >
                  ⚡ Try Smart Allocation Optimization
                </button>
              )}
            </div>
          </div>

          {/* 4. COMBINED PORTFOLIO RESULTS & ANALYTICS */}
          {simRun && (
            <div className="anim-scale glass-card-deep" style={{ padding: '28px', borderRadius: 20, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid var(--gold-primary, #f59e0b)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="sticker-badge sticker-yellow" style={{ marginBottom: 4 }}>
                    OVERALL PORTFOLIO REPORT
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                    COMBINED WEALTH METRICS
                  </h2>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
                  Longest Investment Horizon: <strong style={{ color: '#fbbf24' }}>{maxHorizon} Years</strong>
                </div>
              </div>

              {/* 4 Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL INVESTMENT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>{fmt(totalInvested)}</div>
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL RETURNS</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginTop: 4 }}>{fmt(totalReturns)}</div>
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL PROFIT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{fmt(totalProfit)}</div>
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>PROFIT PERCENTAGE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{profitPct}%</div>
                </div>
              </div>

              {/* Combined Invested vs Returns Breakdown Bar */}
              <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))', marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                  <span style={{ color: 'var(--heading-color, #ffffff)' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                  <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Portfolio Value: {fmt(totalReturns)} (100%)</span>
                </div>
                <div style={{ height: 28, borderRadius: 10, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div
                    style={{
                      width: `${investedPct}%`,
                      background: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 900,
                      transition: 'width 0.5s ease',
                      minWidth: investedPct > 0 ? '4px' : '0',
                    }}
                  >
                    {investedPct >= 18 && `${investedPct.toFixed(1)}%`}
                  </div>
                  <div
                    style={{
                      width: `${returnsPct}%`,
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 900,
                      transition: 'width 0.5s ease',
                      minWidth: returnsPct > 0 ? '4px' : '0',
                    }}
                  >
                    {returnsPct >= 18 && `${returnsPct.toFixed(1)}%`}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: '#0284c7' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>
                      TOTAL INVESTED: <strong style={{ color: '#0284c7' }}>{investedPct.toFixed(1)}%</strong> ({fmt(totalInvested)})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>
                      TOTAL RETURNS (PROFIT): <strong style={{ color: '#10b981' }}>{returnsPct.toFixed(1)}%</strong> ({fmt(totalProfit)})
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. GAP PERIODS ANALYSIS & REINVESTMENT TIMELINE */}
              <div style={{ background: 'var(--bg-main, #080705)', padding: 20, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>⏳</span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                      GAP PERIODS & REINVESTMENT ANALYSIS
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0' }}>
                      Understand when earlier investments mature and how to put the matured corpus to work during the remaining gap years.
                    </p>
                  </div>
                </div>

                {gapAnalysisList.length === 0 ? (
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: 13, color: 'var(--text-sub, #d1d5db)' }}>
                    All selected investments share the exact same maturity tenure ({maxHorizon} Years). There are no interim maturity gaps.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {gapAnalysisList.map((gap, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1.5px solid rgba(245, 158, 11, 0.25)',
                          borderRadius: 14,
                          padding: 16,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                          <div style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 14 }}>
                            {gap.emoji} {gap.name} matures at Year {gap.years}
                          </div>
                          <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                            {gap.gapYears} YEARS GAP AVAILABLE
                          </span>
                        </div>

                        <div style={{ fontSize: 13, color: 'var(--text-sub, #e2e8f0)', lineHeight: 1.5 }}>
                          At <strong>Year {gap.years}</strong>, {gap.name} will fully mature with an estimated payout corpus of{' '}
                          <strong style={{ color: '#10b981' }}>{fmt(gap.maturedCorpus)}</strong>. Because your overall portfolio horizon runs for {maxHorizon} years, you have a{' '}
                          <strong style={{ color: '#fbbf24' }}>{gap.gapYears}-year gap period</strong> before longer-term investments conclude.
                        </div>

                        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted, #94a3b8)' }}>
                          💡 <strong>Smart Utilization Tip:</strong> You can redeploy this matured {fmt(gap.maturedCorpus)} into short-term liquid funds, higher-yield corporate FDs, or utilize it for targeted mid-term life goals!
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: IN-SCREEN SAVED PORTFOLIOS LIST / DETAIL ─── */}
      {activeTab === 'saved' && (
        <div>
          {selectedSavedPortfolio ? (
            <div className="glass-card-deep anim-scale" style={{ padding: '28px', borderRadius: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, background: isEditingSaved ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.15)', color: isEditingSaved ? '#fde047' : '#6ee7b7', border: `1px solid ${isEditingSaved ? '#eab308' : '#10b981'}`, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>
                    {isEditingSaved ? '✏️ EDITING PORTFOLIO' : '🔒 READ-ONLY SAVED PORTFOLIO'}
                  </span>
                  {isEditingSaved ? (
                    <div style={{ marginTop: 8 }}>
                      <input
                        type="text"
                        className="input-light"
                        value={editPortfolioName}
                        onChange={(e) => setEditPortfolioName(e.target.value)}
                        style={{ fontSize: 18, fontWeight: 900, padding: '6px 14px' }}
                      />
                    </div>
                  ) : (
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: '6px 0 2px' }}>
                      {selectedSavedPortfolio.name}
                    </h2>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)' }}>
                    Saved on {selectedSavedPortfolio.createdAt || 'Recent'} • {selectedSavedPortfolio.items?.length || 0} Schemes Combined
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-outline" onClick={() => setSelectedSavedPortfolio(null)} style={{ padding: '6px 14px', fontSize: 12 }}>
                    ← Back to List
                  </button>
                  {!isEditingSaved && (
                    <button className="btn-primary" onClick={() => setIsEditingSaved(true)} style={{ padding: '6px 16px', fontSize: 12, fontWeight: 800 }}>
                      ✏️ Edit
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirmTarget(selectedSavedPortfolio)}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {editError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 12, fontWeight: 700 }}>
                  ⚠️ {editError}
                </div>
              )}

              {/* Items List in Saved Portfolio */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold-amber, #fbbf24)', display: 'block', marginBottom: 10 }}>
                  INVESTMENT SCHEMES IN THIS PORTFOLIO:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(isEditingSaved ? editItems : selectedSavedPortfolio.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-main, #080705)',
                        border: '1px solid var(--border-light, rgba(217,119,6,0.2))',
                        borderRadius: 12,
                        padding: 12,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: 10,
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>NAME</div>
                        {isEditingSaved ? (
                          <input
                            type="text"
                            className="input-light"
                            value={it.name}
                            onChange={(e) => {
                              const copy = [...editItems]
                              copy[idx].name = e.target.value
                              setEditItems(copy)
                            }}
                            style={{ padding: '4px 8px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 13 }}>
                            {it.emoji} {it.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>MONTHLY (₹)</div>
                        {isEditingSaved ? (
                          <input
                            type="number"
                            className="input-light"
                            value={it.monthly}
                            onChange={(e) => {
                              const copy = [...editItems]
                              copy[idx].monthly = Number(e.target.value)
                              setEditItems(copy)
                            }}
                            style={{ padding: '4px 8px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: '#0284c7', fontSize: 13 }}>
                            ₹{Number(it.monthly).toLocaleString('en-IN')}/mo
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RATE</div>
                        {isEditingSaved ? (
                          <input
                            type="number"
                            step="0.1"
                            className="input-light"
                            value={it.rate}
                            onChange={(e) => {
                              const copy = [...editItems]
                              copy[idx].rate = Number(e.target.value)
                              setEditItems(copy)
                            }}
                            style={{ padding: '4px 8px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 13 }}>{it.rate}%</div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TENURE</div>
                        {isEditingSaved ? (
                          <input
                            type="number"
                            className="input-light"
                            value={it.years}
                            onChange={(e) => {
                              const copy = [...editItems]
                              copy[idx].years = Number(e.target.value)
                              setEditItems(copy)
                            }}
                            style={{ padding: '4px 8px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 13 }}>{it.years} Yrs</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INVESTED</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0284c7' }}>{fmt(selectedSavedPortfolio.results?.totalInvested || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RETURNS</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>{fmt(selectedSavedPortfolio.results?.totalReturns || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>PROFIT</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>+{fmt(selectedSavedPortfolio.results?.totalProfit || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>PROFIT %</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>+{selectedSavedPortfolio.results?.profitPct || 0}%</div>
                </div>
              </div>

              {isEditingSaved && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-primary" onClick={handleSaveEditChanges} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 900 }}>
                    💾 Edit changes
                  </button>
                  <button className="btn-outline" onClick={() => setIsEditingSaved(false)} style={{ padding: '10px 18px', fontSize: 12 }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : savedPortfolioSimulations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🏢</div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
                No Saved Portfolio Simulations Yet
              </h3>
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, marginBottom: 16 }}>
                Add 2 or more investment options, run a portfolio simulation, and click "SAVE PORTFOLIO" to keep models here.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('portfolio')} style={{ padding: '10px 22px', fontSize: 12 }}>
                Open Portfolio Studio
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {savedPortfolioSimulations.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => handleOpenSavedPortfolio(sim)}
                  className="glass-card-deep anim-scale"
                  style={{
                    padding: 18,
                    borderRadius: 16,
                    background: 'var(--bg-card-deep, #12100c)',
                    border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#10b981' }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-light, rgba(217,119,6,0.25))' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 900, color: 'var(--heading-color, #ffffff)', fontSize: 14 }}>🏢 {sim.name}</div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)' }}>{sim.createdAt}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginBottom: 8 }}>
                    {sim.items?.length || 0} Schemes Combined ({sim.allocationMode === 'smart' ? '⚡ Smart Allocation' : '✍️ Manual'})
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 800 }}>
                    <span style={{ color: 'var(--heading-color, #ffffff)' }}>Returns: {fmt(sim.results?.totalReturns || 0)}</span>
                    <span style={{ color: '#10b981' }}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Portfolio Modal */}
      {showSaveModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 7, 5, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            className="glass-card-deep anim-scale"
            style={{
              maxWidth: 460,
              width: '100%',
              borderRadius: 20,
              padding: 24,
              background: 'var(--bg-card-deep, #12100c)',
              border: '2px solid #10b981',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                  SAVE PORTFOLIO SIMULATION
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0' }}>
                  Name this overall portfolio model (Saving is optional • 0 XP)
                </p>
              </div>
            </div>

            {saveError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: 12, marginBottom: 14, fontSize: 12, fontWeight: 700 }}>
                ⚠️ {saveError}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 6 }}>
                PORTFOLIO SIMULATION NAME
              </label>
              <input
                type="text"
                className="input-light"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g. My Balanced Growth Portfolio"
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700 }}
                autoFocus
              />
            </div>

            <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 11, color: 'var(--text-sub, #d1d5db)' }}>
              <div>• <strong>Investments:</strong> {computedItems.map((c) => c.name).join(', ')}</div>
              <div>• <strong>Total Investment:</strong> {fmt(totalInvested)}</div>
              <div>• <strong>Total Returns:</strong> {fmt(totalReturns)} (+{profitPct}% Profit)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-outline" onClick={() => setShowSaveModal(false)} style={{ padding: '8px 18px', fontSize: 12 }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleConfirmSavePortfolio} style={{ padding: '8px 22px', fontSize: 12, fontWeight: 900 }}>
                Save Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Verification Dialog Box */}
      {deleteConfirmTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 7, 5, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div
            className="glass-card-deep anim-scale"
            style={{
              maxWidth: 420,
              width: '100%',
              borderRadius: 20,
              padding: 24,
              background: 'var(--bg-card-deep, #12100c)',
              border: '2px solid #ef4444',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
              CONFIRM PORTFOLIO DELETION
            </h3>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
              Are you sure you want to delete <strong style={{ color: '#f87171' }}>"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button className="btn-outline" onClick={() => setDeleteConfirmTarget(null)} style={{ padding: '8px 18px', fontSize: 12 }}>
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '8px 20px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
