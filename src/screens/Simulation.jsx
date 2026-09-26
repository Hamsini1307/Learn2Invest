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

export default function Simulation({
  go,
  goBack,
  state,
  update,
  addXP,
  savedSimulations = [],
  onSaveSimulation,
  onUpdateSavedSimulation,
  onDeleteSavedSimulation,
}) {
  const mod = state.currentModule
  if (!mod) {
    go('intermediate')
    return null
  }

  const [activeTab, setActiveTab] = useState('calc') // 'calc' | 'saved'
  const [monthly, setMonthly] = useState(mod.defMonthly)
  const [rate, setRate] = useState(mod.defRate)
  const [years, setYears] = useState(mod.defYears)
  const [done, setDone] = useState(false)
  const isAlreadyCompleted = (state?.completedModules || []).includes(mod?.id)

  // Save Modal States
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [simNameInput, setSimNameInput] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  // Saved Inspection / Edit / Delete States
  const [selectedSavedSim, setSelectedSavedSim] = useState(null)
  const [isEditingSaved, setIsEditingSaved] = useState(false)
  const [editMonthly, setEditMonthly] = useState(0)
  const [editRate, setEditRate] = useState(0)
  const [editYears, setEditYears] = useState(0)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  const mySavedSims = (savedSimulations || []).filter((s) => s.type === mod.id)

  const invested = monthly * years * 12
  const fv = calcFV(monthly, rate, years)
  const gain = Math.max(0, fv - invested)
  const gainPct = invested > 0 ? ((gain / invested) * 100).toFixed(1) : '0.0'

  // Breakdown percentages where Total Returns (fv) represents 100%
  const investedPct = fv > 0 ? Math.min(100, Math.max(0, (invested / fv) * 100)) : 100
  const returnsPct = Math.max(0, 100 - investedPct)

  const handleDone = () => {
    addXP(50)
    setDone(true)
    const currentCompleted = state.completedModules || []
    if (!currentCompleted.includes(mod.id)) {
      update({ completedModules: [...currentCompleted, mod.id] })
    }
    setTimeout(() => go('intermediate'), 1500)
  }

  // Open Save Modal
  const handleOpenSaveModal = () => {
    setSaveError('')
    setSaveSuccessMsg('')
    const defaultName = `${mod.name} Plan #${mySavedSims.length + 1}`
    setSimNameInput(defaultName)
    setShowSaveModal(true)
  }

  // Save Simulation Logic
  const handleConfirmSave = () => {
    setSaveError('')
    const nameToSave = simNameInput.trim() || `${mod.name} Plan`

    // Duplicate check: Same type with exact same inputs
    const existingMatch = mySavedSims.find(
      (s) =>
        Number(s.inputs?.monthly) === Number(monthly) &&
        Number(s.inputs?.rate) === Number(rate) &&
        Number(s.inputs?.years) === Number(years)
    )

    if (existingMatch) {
      setSaveError(`This simulation already exists with these exact values (saved as "${existingMatch.name}").`)
      return
    }

    const newSim = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: nameToSave,
      type: mod.id,
      typeName: mod.name,
      emoji: mod.emoji,
      inputs: {
        monthly: Number(monthly),
        rate: Number(rate),
        years: Number(years),
      },
      results: {
        invested,
        totalReturns: Math.round(fv),
        profit: Math.round(gain),
        profitPct: gainPct,
      },
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }

    if (onSaveSimulation) {
      onSaveSimulation(newSim)
    }
    setShowSaveModal(false)
    setSaveSuccessMsg(`✅ Simulation "${nameToSave}" successfully saved! (0 XP awarded)`)
    setTimeout(() => setSaveSuccessMsg(''), 4000)
  }

  // Saved Inspection Open
  const handleOpenSavedSim = (sim) => {
    setSelectedSavedSim(sim)
    setIsEditingSaved(false)
    setEditError('')
    setEditName(sim.name)
    setEditMonthly(sim.inputs?.monthly || 5000)
    setEditRate(sim.inputs?.rate || 7.1)
    setEditYears(sim.inputs?.years || 15)
  }

  // Save Edited Saved Simulation Changes
  const handleSaveEditChanges = () => {
    setEditError('')
    if (!selectedSavedSim) return

    // Duplicate check against other saved simulations
    const isDuplicate = mySavedSims.some(
      (s) =>
        s.id !== selectedSavedSim.id &&
        Number(s.inputs?.monthly) === Number(editMonthly) &&
        Number(s.inputs?.rate) === Number(editRate) &&
        Number(s.inputs?.years) === Number(editYears)
    )

    if (isDuplicate) {
      setEditError('A simulation with these exact values already exists.')
      return
    }

    const m = Number(editMonthly)
    const r = Number(editRate)
    const y = Number(editYears)
    const inv = m * y * 12
    const futVal = calcFV(m, r, y)
    const prof = Math.max(0, futVal - inv)
    const profPct = inv > 0 ? ((prof / inv) * 100).toFixed(1) : '0.0'

    const updated = {
      ...selectedSavedSim,
      name: editName.trim() || selectedSavedSim.name,
      inputs: { monthly: m, rate: r, years: y },
      results: {
        invested: inv,
        totalReturns: Math.round(futVal),
        profit: Math.round(prof),
        profitPct: profPct,
      },
    }

    if (onUpdateSavedSimulation) {
      onUpdateSavedSimulation(updated)
    }
    setSelectedSavedSim(updated)
    setIsEditingSaved(false)
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return
    if (onDeleteSavedSimulation) {
      onDeleteSavedSimulation(deleteConfirmTarget.id)
    }
    if (selectedSavedSim?.id === deleteConfirmTarget.id) {
      setSelectedSavedSim(null)
    }
    setDeleteConfirmTarget(null)
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Nav Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn-outline" onClick={goBack || (() => go('intermediate'))}>
          ⬅ Back
        </button>

        {/* View Switcher: Simulator vs. Saved Simulations */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-main, #080705)', padding: 4, borderRadius: 999, border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))' }}>
          <button
            onClick={() => { setActiveTab('calc'); setSelectedSavedSim(null) }}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'calc' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: activeTab === 'calc' ? '#080705' : 'var(--heading-color, #ffffff)',
              border: 'none',
            }}
          >
            🧮 Simulator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'saved' ? 'linear-gradient(135deg, #10b981, #0284c7)' : 'transparent',
              color: activeTab === 'saved' ? '#ffffff' : 'var(--heading-color, #ffffff)',
              border: 'none',
            }}
          >
            📂 Saved ({mySavedSims.length})
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', color: '#6ee7b7', padding: '12px 18px', borderRadius: 14, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
          {saveSuccessMsg}
        </div>
      )}

      {/* ─── TAB 1: SIMULATOR CALCULATOR ─── */}
      {activeTab === 'calc' && (
        <div className="glass-card-deep anim-scale" style={{ padding: '32px', marginBottom: 20 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: 'var(--gold-bg, rgba(245, 158, 11, 0.12))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  border: `2px solid ${mod.color}`,
                }}
              >
                {mod.emoji}
              </div>
              <div>
                <h1 className="font-display" style={{ fontSize: 28, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                  {mod.name}
                </h1>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, margin: '2px 0 0' }}>
                  {mod.rate} • Official Indian Government / Bank Scheme
                </p>
              </div>
            </div>

            {/* Save Simulation Button */}
            <button
              onClick={handleOpenSaveModal}
              style={{
                background: 'var(--gold-bg, rgba(245, 158, 11, 0.15))',
                border: '1.5px solid var(--gold-primary, #f59e0b)',
                color: 'var(--gold-amber, #fbbf24)',
                borderRadius: 999,
                padding: '8px 18px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
              title="Save this simulation for future reference (0 XP)"
            >
              <span>💾</span>
              <span>SAVE SIMULATION</span>
            </button>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
            {/* Monthly */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>MONTHLY INVESTMENT</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)' }}>{fmt(monthly)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>ANNUAL INTEREST RATE</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)' }}>{rate}% p.a.</span>
              </div>
              <input
                type="range"
                min="4"
                max="15"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                <span>4%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Years */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>INVESTMENT DURATION</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)' }}>{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results: 4 Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL INVESTED</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>{fmt(invested)}</div>
            </div>
            <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL RETURNS</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginTop: 4 }}>{fmt(fv)}</div>
            </div>
            <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>PROFIT AMOUNT</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{fmt(gain)}</div>
            </div>
            <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>PROFIT %</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{gainPct}%</div>
            </div>
          </div>

          {/* Breakdown Bar */}
          <div style={{ background: 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
              <span style={{ color: 'var(--heading-color, #ffffff)' }}>INVESTED VS RETURNS BREAKDOWN</span>
              <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Value: {fmt(fv)} (100%)</span>
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
                  INVESTED: <strong style={{ color: '#0284c7' }}>{investedPct.toFixed(1)}%</strong> ({fmt(invested)})
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} />
                <span style={{ fontSize: 11, color: 'var(--text-sub, #d1d5db)', fontWeight: 800 }}>
                  RETURNS (PROFIT): <strong style={{ color: '#10b981' }}>{returnsPct.toFixed(1)}%</strong> ({fmt(gain)})
                </span>
              </div>
            </div>
          </div>

          {/* FR11 & FR13: AI Guided Justification & Recommendation Engine */}
          <div style={{
            background: 'var(--bg-main, rgba(18, 16, 12, 0.95))',
            border: '1.5px solid #f59e0b',
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase' }}>
                AI GUIDED SIMULATION & JUSTIFICATION (REQ 3.1.3 FR11 & FR13)
              </div>
            </div>

            <div style={{ fontSize: 12, color: '#ffffff', lineHeight: 1.5, marginBottom: 10 }}>
              <strong>AI Recommendation:</strong> Investing <strong>{fmt(monthly)}/mo</strong> at <strong>{rate}% p.a.</strong> over <strong>{years} years</strong> generates a net returns profit of <strong>{fmt(gain)}</strong> ({gainPct}% growth on principal).
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderLeft: '3px solid #f59e0b',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 11,
              color: '#d1d5db'
            }}>
              <strong>💡 Investment Justification:</strong>{' '}
              {rate >= 10
                ? 'High wealth-creation potential. Ideal for long-term goals (>7 years) to beat inflation (5.1%), though subject to short-term market fluctuation.'
                : years >= 15
                ? 'Sovereign zero-risk guaranteed option with EEE tax exemption under Section 80C. Strongly justified for risk-averse long-term retirement capital.'
                : 'Excellent liquidity & principal safety for short-term goals (<5 years), but rejected for aggressive wealth building due to post-tax real returns matching inflation.'}
            </div>
          </div>

          {/* Module Completion Button: Hidden if already completed */}
          {done ? (
            <div
              style={{
                textAlign: 'center',
                padding: '16px',
                background: 'var(--emerald-bg, rgba(16,185,129,0.15))',
                borderRadius: 16,
                border: '2px solid var(--emerald-main, #10b981)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
              <div style={{ fontWeight: 900, color: 'var(--emerald-main, #10b981)', fontSize: 15 }}>
                +50 XP EARNED! RETURNING TO MENU...
              </div>
            </div>
          ) : isAlreadyCompleted ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--emerald-bg, rgba(16, 185, 129, 0.12))',
                border: '1.5px solid var(--emerald-main, #10b981)',
                borderRadius: 14,
                padding: '14px 20px',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--emerald-main, #10b981)', fontSize: 14 }}>
                    Module Completed (+50 XP Claimed)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)' }}>
                    You have successfully completed this investment simulation module.
                  </div>
                </div>
              </div>
              <button className="btn-outline" onClick={() => go('intermediate')} style={{ padding: '8px 16px', fontSize: 12 }}>
                ⬅ Back
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleDone} style={{ width: '100%', fontSize: 15, padding: '16px' }}>
              ✅ COMPLETE MODULE (+50 XP)
            </button>
          )}
        </div>
      )}

      {/* ─── TAB 2: IN-SCHEME SAVED SIMULATIONS LIST / DETAIL ─── */}
      {activeTab === 'saved' && (
        <div>
          {selectedSavedSim ? (
            <div className="glass-card-deep anim-scale" style={{ padding: '28px', borderRadius: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, background: isEditingSaved ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.15)', color: isEditingSaved ? '#fde047' : '#6ee7b7', border: `1px solid ${isEditingSaved ? '#eab308' : '#10b981'}`, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>
                    {isEditingSaved ? '✏️ EDITING MODE' : '🔒 READ-ONLY SAVED SIMULATION'}
                  </span>
                  {isEditingSaved ? (
                    <div style={{ marginTop: 8 }}>
                      <input
                        type="text"
                        className="input-light"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ fontSize: 16, fontWeight: 900, padding: '6px 12px' }}
                      />
                    </div>
                  ) : (
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: '6px 0 2px' }}>
                      {selectedSavedSim.name}
                    </h2>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)' }}>
                    Saved on {selectedSavedSim.createdAt || 'Recent'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-outline" onClick={() => setSelectedSavedSim(null)} style={{ padding: '6px 14px', fontSize: 12 }}>
                    ← Back
                  </button>
                  {!isEditingSaved && (
                    <button className="btn-primary" onClick={() => setIsEditingSaved(true)} style={{ padding: '6px 16px', fontSize: 12, fontWeight: 800 }}>
                      ✏️ Edit
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirmTarget(selectedSavedSim)}
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

              {/* Read Only or Editable Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>MONTHLY</div>
                  {isEditingSaved ? (
                    <input type="number" className="input-light" value={editMonthly} onChange={(e) => setEditMonthly(e.target.value)} style={{ padding: 6, fontSize: 14 }} />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>₹{Number(selectedSavedSim.inputs?.monthly).toLocaleString('en-IN')}</div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RATE</div>
                  {isEditingSaved ? (
                    <input type="number" step="0.1" className="input-light" value={editRate} onChange={(e) => setEditRate(e.target.value)} style={{ padding: 6, fontSize: 14 }} />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fbbf24' }}>{selectedSavedSim.inputs?.rate}%</div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TENURE</div>
                  {isEditingSaved ? (
                    <input type="number" className="input-light" value={editYears} onChange={(e) => setEditYears(e.target.value)} style={{ padding: 6, fontSize: 14 }} />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>{selectedSavedSim.inputs?.years} Yrs</div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INVESTED</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0284c7' }}>{fmt(selectedSavedSim.results?.invested || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RETURNS</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>{fmt(selectedSavedSim.results?.totalReturns || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>PROFIT</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#10b981' }}>+{fmt(selectedSavedSim.results?.profit || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>PROFIT %</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#10b981' }}>+{selectedSavedSim.results?.profitPct || 0}%</div>
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
          ) : mySavedSims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
                No Saved Simulations for {mod.name}
              </h3>
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 12, marginBottom: 14 }}>
                Adjust the sliders in the simulator and click "SAVE SIMULATION" to keep models here.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('calc')} style={{ padding: '8px 20px', fontSize: 12 }}>
                Open Simulator
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {mySavedSims.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => handleOpenSavedSim(sim)}
                  className="glass-card-deep anim-scale"
                  style={{
                    padding: 18,
                    borderRadius: 16,
                    background: 'var(--bg-card-deep, #12100c)',
                    border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--gold-primary, #f59e0b)' }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-light, rgba(217,119,6,0.25))' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 900, color: 'var(--heading-color, #ffffff)', fontSize: 14 }}>{sim.name}</div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)' }}>{sim.createdAt}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-sub, #d1d5db)', marginBottom: 10 }}>
                    ₹{Number(sim.inputs?.monthly).toLocaleString('en-IN')}/mo • {sim.inputs?.rate}% • {sim.inputs?.years} Yrs
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 800 }}>
                    <span style={{ color: '#10b981' }}>Returns: {fmt(sim.results?.totalReturns || 0)}</span>
                    <span style={{ color: 'var(--gold-amber, #fbbf24)' }}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Simulation Dialog Modal */}
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
              maxWidth: 440,
              width: '100%',
              borderRadius: 20,
              padding: 24,
              background: 'var(--bg-card-deep, #12100c)',
              border: '2px solid var(--gold-primary, #f59e0b)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
                  SAVE SIMULATION
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0' }}>
                  Give your simulation a memorable name (Saving is optional • 0 XP)
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
                SIMULATION NAME
              </label>
              <input
                type="text"
                className="input-light"
                value={simNameInput}
                onChange={(e) => setSimNameInput(e.target.value)}
                placeholder="e.g. My 15-Year PPF Goal"
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700 }}
                autoFocus
              />
            </div>

            <div style={{ background: 'var(--bg-main, #080705)', padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 11, color: 'var(--text-sub, #d1d5db)' }}>
              <div>• <strong>Scheme:</strong> {mod.name}</div>
              <div>• <strong>Monthly Investment:</strong> {fmt(monthly)}</div>
              <div>• <strong>Rate & Duration:</strong> {rate}% over {years} years</div>
              <div>• <strong>Total Returns:</strong> {fmt(fv)} (+{gainPct}% Profit)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-outline" onClick={() => setShowSaveModal(false)} style={{ padding: '8px 18px', fontSize: 12 }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleConfirmSave} style={{ padding: '8px 22px', fontSize: 12, fontWeight: 900 }}>
                Save Model
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
              CONFIRM SIMULATION DELETION
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
