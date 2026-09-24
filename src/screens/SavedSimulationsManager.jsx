import { useState } from 'react'

function fmt(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function SavedSimulationsManager({
  go,
  goBack,
  savedSimulations = [],
  savedPortfolioSimulations = [],
  onUpdateSavedSimulation,
  onDeleteSavedSimulation,
  onUpdateSavedPortfolio,
  onDeleteSavedPortfolio,
}) {
  const [activeFolder, setActiveFolder] = useState('lab') // 'lab' | 'portfolio'
  const [selectedSim, setSelectedSim] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({})
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)
  const [duplicateError, setDuplicateError] = useState('')

  const handleOpenSim = (sim, type) => {
    setSelectedSim({ ...sim, _category: type })
    setIsEditing(false)
    setDuplicateError('')
    if (type === 'lab') {
      setEditValues({
        name: sim.name,
        monthly: sim.inputs?.monthly || sim.monthly || 5000,
        rate: sim.inputs?.rate || sim.rate || 7.1,
        years: sim.inputs?.years || sim.years || 15,
      })
    } else {
      setEditValues({
        name: sim.name,
        items: JSON.parse(JSON.stringify(sim.items || [])),
      })
    }
  }

  const handleSaveEditChanges = () => {
    setDuplicateError('')
    if (!selectedSim) return

    if (selectedSim._category === 'lab') {
      // Check duplicate
      const isDuplicate = savedSimulations.some(
        (s) =>
          s.id !== selectedSim.id &&
          s.type === selectedSim.type &&
          Number(s.inputs?.monthly) === Number(editValues.monthly) &&
          Number(s.inputs?.rate) === Number(editValues.rate) &&
          Number(s.inputs?.years) === Number(editValues.years)
      )
      if (isDuplicate) {
        setDuplicateError('A simulation with these exact values already exists.')
        return
      }

      const m = Number(editValues.monthly)
      const r = Number(editValues.rate)
      const y = Number(editValues.years)
      const rateMonth = r / 100 / 12
      const months = y * 12
      const invested = m * months
      const fv = rateMonth > 0 ? m * ((Math.pow(1 + rateMonth, months) - 1) / rateMonth) * (1 + rateMonth) : invested
      const profit = Math.max(0, fv - invested)
      const profitPct = invested > 0 ? ((profit / invested) * 100).toFixed(1) : '0.0'

      const updated = {
        ...selectedSim,
        name: editValues.name.trim() || selectedSim.name,
        inputs: { monthly: m, rate: r, years: y },
        results: { invested, totalReturns: Math.round(fv), profit: Math.round(profit), profitPct },
      }

      onUpdateSavedSimulation(updated)
      setSelectedSim({ ...updated, _category: 'lab' })
      setIsEditing(false)
    } else {
      // Portfolio Edit
      const items = editValues.items || []
      let totalInvested = 0
      let totalReturns = 0

      const recalculatedItems = items.map((it) => {
        const m = Number(it.monthly) || 0
        const r = Number(it.rate) || 0
        const y = Number(it.years) || 1
        const rMonth = r / 100 / 12
        const nMonths = y * 12
        const inv = m * nMonths
        const ret = rMonth > 0 ? m * ((Math.pow(1 + rMonth, nMonths) - 1) / rMonth) * (1 + rMonth) : inv
        const prof = Math.max(0, ret - inv)
        totalInvested += inv
        totalReturns += ret
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

      const totalProfit = Math.max(0, totalReturns - totalInvested)
      const profitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0'

      const updated = {
        ...selectedSim,
        name: editValues.name.trim() || selectedSim.name,
        items: recalculatedItems,
        results: {
          totalInvested,
          totalReturns: Math.round(totalReturns),
          totalProfit: Math.round(totalProfit),
          profitPct,
        },
      }

      onUpdateSavedPortfolio(updated)
      setSelectedSim({ ...updated, _category: 'portfolio' })
      setIsEditing(false)
    }
  }

  const handleDeleteConfirmed = () => {
    if (!deleteConfirmTarget) return
    if (deleteConfirmTarget.category === 'lab') {
      onDeleteSavedSimulation(deleteConfirmTarget.id)
    } else {
      onDeleteSavedPortfolio(deleteConfirmTarget.id)
    }
    if (selectedSim?.id === deleteConfirmTarget.id) {
      setSelectedSim(null)
    }
    setDeleteConfirmTarget(null)
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn-outline" onClick={goBack || (() => go('level-map'))} style={{ padding: '8px 18px', fontSize: 13 }}>
          ⬅ Back to Previous Page
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
          📂 SAVED SIMULATIONS HUB
        </div>
      </div>

      {/* Main Title & Folder Switcher */}
      <div className="glass-card-deep" style={{ padding: '28px', borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid var(--border-subtle, rgba(217, 119, 6, 0.35))' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8 }}>
            SECURE PORTFOLIO ARCHIVE
          </div>
          <h1 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', margin: '0 0 6px 0' }}>
            SAVED SIMULATIONS
          </h1>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
            Inspect, edit, and manage your saved investment models across Lab & Portfolio tiers.
          </p>
        </div>

        {/* 2 Main Folders: Lab Simulations vs. Portfolio Simulations */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveFolder('lab'); setSelectedSim(null) }}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              background: activeFolder === 'lab' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--bg-main, #080705)',
              color: activeFolder === 'lab' ? '#080705' : 'var(--heading-color, #ffffff)',
              border: activeFolder === 'lab' ? '2px solid #f59e0b' : '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))',
              boxShadow: activeFolder === 'lab' ? '0 4px 16px rgba(245, 158, 11, 0.35)' : 'none',
            }}
          >
            <span>🧪</span>
            <span>Lab Simulations ({savedSimulations.length})</span>
          </button>

          <button
            onClick={() => { setActiveFolder('portfolio'); setSelectedSim(null) }}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              background: activeFolder === 'portfolio' ? 'linear-gradient(135deg, #10b981, #0284c7)' : 'var(--bg-main, #080705)',
              color: activeFolder === 'portfolio' ? '#ffffff' : 'var(--heading-color, #ffffff)',
              border: activeFolder === 'portfolio' ? '2px solid #10b981' : '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))',
              boxShadow: activeFolder === 'portfolio' ? '0 4px 16px rgba(16, 185, 129, 0.35)' : 'none',
            }}
          >
            <span>🏢</span>
            <span>Portfolio Simulations ({savedPortfolioSimulations.length})</span>
          </button>
        </div>
      </div>

      {/* Detail / Read-Only View or Edit View Modal / Panel */}
      {selectedSim ? (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', borderRadius: 20, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid var(--gold-primary, #f59e0b)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="sticker-badge sticker-yellow">
                  {selectedSim._category === 'lab' ? '🧪 LAB SCHEME' : '🏢 MULTI-ASSET PORTFOLIO'}
                </span>
                <span style={{ fontSize: 11, background: isEditing ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.15)', color: isEditing ? '#fde047' : '#6ee7b7', border: `1px solid ${isEditing ? '#eab308' : '#10b981'}`, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>
                  {isEditing ? '✏️ EDITING MODE' : '🔒 READ-ONLY SAVED SIMULATION'}
                </span>
              </div>

              {isEditing ? (
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                    SIMULATION NAME:
                  </label>
                  <input
                    type="text"
                    className="input-light"
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    style={{ fontSize: 16, fontWeight: 900, padding: '8px 14px', width: '100%', maxWidth: 380 }}
                  />
                </div>
              ) : (
                <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: '8px 0 2px' }}>
                  {selectedSim.name}
                </h2>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)' }}>
                Saved on: {selectedSim.createdAt || 'Recent'} • Type: {selectedSim.typeName || selectedSim.type || 'Portfolio'}
              </div>
            </div>

            {/* Top Action Buttons: Close, Edit, Delete */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn-outline"
                onClick={() => { setSelectedSim(null); setIsEditing(false) }}
                style={{ padding: '8px 16px', fontSize: 12 }}
              >
                ← Back to List
              </button>

              {!isEditing && (
                <button
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                  style={{ padding: '8px 18px', fontSize: 12, fontWeight: 800 }}
                >
                  ✏️ Edit
                </button>
              )}

              <button
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1.5px solid #ef4444',
                  color: '#f87171',
                  borderRadius: 999,
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                onClick={() => setDeleteConfirmTarget({ id: selectedSim.id, name: selectedSim.name, category: selectedSim._category })}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {duplicateError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #ef4444', color: '#fca5a5', padding: '10px 16px', borderRadius: 12, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
              ⚠️ {duplicateError}
            </div>
          )}

          {/* Details / Fields */}
          {selectedSim._category === 'lab' ? (
            <div>
              {/* Parameter Inputs: disabled if not editing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    MONTHLY INVESTMENT
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-light"
                      value={editValues.monthly}
                      onChange={(e) => setEditValues({ ...editValues, monthly: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>
                      ₹{Number(selectedSim.inputs?.monthly || 0).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    ANNUAL INTEREST RATE
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      className="input-light"
                      value={editValues.rate}
                      onChange={(e) => setEditValues({ ...editValues, rate: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24' }}>
                      {selectedSim.inputs?.rate || 0}% p.a.
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    TENURE (YEARS)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-light"
                      value={editValues.years}
                      onChange={(e) => setEditValues({ ...editValues, years: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)' }}>
                      {selectedSim.inputs?.years || 0} Years
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL INVESTED</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#0284c7', marginTop: 2 }}>{fmt(selectedSim.results?.invested || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL RETURNS</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginTop: 2 }}>{fmt(selectedSim.results?.totalReturns || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PROFIT AMOUNT</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{fmt(selectedSim.results?.profit || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PROFIT %</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{selectedSim.results?.profitPct || 0}%</div>
                </div>
              </div>

              {/* Edit Changes Button */}
              {isEditing && (
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="btn-primary" onClick={handleSaveEditChanges} style={{ padding: '12px 28px', fontSize: 14, fontWeight: 900 }}>
                    💾 Edit changes
                  </button>
                  <button className="btn-outline" onClick={() => setIsEditing(false)} style={{ padding: '12px 20px', fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Portfolio Simulation Details */
            <div>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold-amber, #fbbf24)', display: 'block', marginBottom: 10 }}>
                  PORTFOLIO INVESTMENTS ({selectedSim.items?.length || 0}):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(isEditing ? editValues.items : selectedSim.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-main, #080705)',
                        border: '1px solid var(--border-light, rgba(217,119,6,0.25))',
                        borderRadius: 14,
                        padding: 14,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: 12,
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>SCHEME / NAME</div>
                        {isEditing ? (
                          <input
                            type="text"
                            className="input-light"
                            value={item.name}
                            onChange={(e) => {
                              const copy = [...editValues.items]
                              copy[idx].name = e.target.value
                              setEditValues({ ...editValues, items: copy })
                            }}
                            style={{ padding: '6px 10px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 14 }}>
                            {item.emoji} {item.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>MONTHLY (₹)</div>
                        {isEditing ? (
                          <input
                            type="number"
                            className="input-light"
                            value={item.monthly}
                            onChange={(e) => {
                              const copy = [...editValues.items]
                              copy[idx].monthly = e.target.value
                              setEditValues({ ...editValues, items: copy })
                            }}
                            style={{ padding: '6px 10px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: '#0284c7', fontSize: 13 }}>
                            ₹{Number(item.monthly).toLocaleString('en-IN')}/mo
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RATE (%)</div>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            className="input-light"
                            value={item.rate}
                            onChange={(e) => {
                              const copy = [...editValues.items]
                              copy[idx].rate = e.target.value
                              setEditValues({ ...editValues, items: copy })
                            }}
                            style={{ padding: '6px 10px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 13 }}>
                            {item.rate}%
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TENURE</div>
                        {isEditing ? (
                          <input
                            type="number"
                            className="input-light"
                            value={item.years}
                            onChange={(e) => {
                              const copy = [...editValues.items]
                              copy[idx].years = e.target.value
                              setEditValues({ ...editValues, items: copy })
                            }}
                            style={{ padding: '6px 10px', fontSize: 12 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 13 }}>
                            {item.years} Yrs
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>EST. RETURNS</div>
                          <div style={{ fontWeight: 900, color: '#10b981', fontSize: 13 }}>
                            {fmt(item.returns || 0)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PORTFOLIO INVESTED</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#0284c7', marginTop: 2 }}>{fmt(selectedSim.results?.totalInvested || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PORTFOLIO RETURNS</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginTop: 2 }}>{fmt(selectedSim.results?.totalReturns || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL PROFIT</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{fmt(selectedSim.results?.totalProfit || 0)}</div>
                </div>
                <div style={{ background: 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PROFIT %</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{selectedSim.results?.profitPct || 0}%</div>
                </div>
              </div>

              {/* Edit Changes Button */}
              {isEditing && (
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="btn-primary" onClick={handleSaveEditChanges} style={{ padding: '12px 28px', fontSize: 14, fontWeight: 900 }}>
                    💾 Edit changes
                  </button>
                  <button className="btn-outline" onClick={() => setIsEditing(false)} style={{ padding: '12px 20px', fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* List of Saved Simulations in the Active Folder */}
      {!selectedSim && (
        <div>
          {activeFolder === 'lab' ? (
            savedSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🧪</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
                  No Lab Simulations Saved Yet
                </h3>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, marginBottom: 16 }}>
                  Run any scheme simulation in Intermediate Level and click "Save Simulation" to save models here.
                </p>
                <button className="btn-primary" onClick={() => go('intermediate')} style={{ padding: '10px 24px', fontSize: 13 }}>
                  🧪 Go to Intermediate Lab
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {savedSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => handleOpenSim(sim, 'lab')}
                    className="glass-card-deep anim-scale"
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      background: 'var(--bg-card-deep, #12100c)',
                      border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--gold-primary, #f59e0b)' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-light, rgba(217,119,6,0.25))' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>{sim.emoji || '📈'}</span>
                        <div>
                          <div style={{ fontWeight: 900, color: 'var(--heading-color, #ffffff)', fontSize: 15 }}>
                            {sim.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--gold-amber, #fbbf24)', fontWeight: 800 }}>
                            {sim.typeName || sim.type}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>
                        {sim.createdAt || 'Saved'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0', background: 'var(--bg-main, #080705)', padding: 10, borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INVESTED</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#0284c7' }}>{fmt(sim.results?.invested || 0)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>RETURNS</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981' }}>{fmt(sim.results?.totalReturns || 0)}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 800 }}>
                      <span style={{ color: 'var(--gold-amber, #fbbf24)' }}>
                        +{sim.results?.profitPct || 0}% Profit
                      </span>
                      <span style={{ color: 'var(--text-muted, #94a3b8)' }}>View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Portfolio Simulations Folder */
            savedPortfolioSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🏢</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
                  No Portfolio Simulations Saved Yet
                </h3>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, marginBottom: 16 }}>
                  Run a multi-asset portfolio simulation in Advanced Level and save your customized portfolio.
                </p>
                <button className="btn-primary" onClick={() => go('advanced')} style={{ padding: '10px 24px', fontSize: 13 }}>
                  🏢 Go to Portfolio Tower
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {savedPortfolioSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => handleOpenSim(sim, 'portfolio')}
                    className="glass-card-deep anim-scale"
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      background: 'var(--bg-card-deep, #12100c)',
                      border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#10b981' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-light, rgba(217,119,6,0.25))' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 900, color: 'var(--heading-color, #ffffff)', fontSize: 15 }}>
                          🏢 {sim.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>
                          {sim.items?.length || 0} Investment Schemes Combined
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>
                        {sim.createdAt || 'Saved'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0', background: 'var(--bg-main, #080705)', padding: 10, borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TOTAL INVESTED</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#0284c7' }}>{fmt(sim.results?.totalInvested || 0)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TOTAL RETURNS</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981' }}>{fmt(sim.results?.totalReturns || 0)}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 800 }}>
                      <span style={{ color: '#10b981' }}>
                        +{fmt(sim.results?.totalProfit || 0)} (+{sim.results?.profitPct || 0}%)
                      </span>
                      <span style={{ color: 'var(--text-muted, #94a3b8)' }}>View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
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
              maxWidth: 440,
              width: '100%',
              borderRadius: 20,
              padding: 28,
              background: 'var(--bg-card-deep, #12100c)',
              border: '2px solid #ef4444',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 8 }}>
              CONFIRM SIMULATION DELETION
            </h3>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to permanently delete{' '}
              <strong style={{ color: '#f87171' }}>"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                className="btn-outline"
                onClick={() => setDeleteConfirmTarget(null)}
                style={{ padding: '10px 22px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 24px',
                  fontSize: 13,
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
