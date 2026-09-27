import { useState, useEffect } from 'react'
import {
  fmtINR,
  calcSchemeFV,
  getNamedPortfolioRows,
  computeSmartMonthlyAllocations,
  calculatePortfolioSimulation,
} from '../data.js'

const fmt = fmtINR

export default function SavedSimulationsManager({
  go,
  goBack,
  savedSimulations = [],
  savedPortfolioSimulations = [],
  onUpdateSavedSimulation,
  onDeleteSavedSimulation,
  onUpdateSavedPortfolio,
  onDeleteSavedPortfolio,
  themeMode = 'dark',
}) {
  const isLight = themeMode === 'light'

  const [activeFolder, setActiveFolder] = useState(() => {
    const savedTab = localStorage.getItem('l2i_savedFolderTab')
    if (savedTab === 'lab' || savedTab === 'portfolio') {
      localStorage.removeItem('l2i_savedFolderTab')
      return savedTab
    }
    return 'lab'
  })
  const [selectedSim, setSelectedSim] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({})
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)
  const [duplicateError, setDuplicateError] = useState('')
  const [statusToast, setStatusToast] = useState('')

  useEffect(() => {
    const savedTab = localStorage.getItem('l2i_savedFolderTab')
    if (savedTab === 'lab' || savedTab === 'portfolio') {
      setActiveFolder(savedTab)
      localStorage.removeItem('l2i_savedFolderTab')
    }
  }, [])

  const handleOpenSim = (sim, type) => {
    setSelectedSim({ ...sim, _category: type })
    setIsEditing(false)
    setDuplicateError('')
    setStatusToast('')
    if (type === 'lab') {
      setEditValues({
        name: sim.name,
        monthly: sim.inputs?.monthly ?? sim.monthly ?? 5000,
        rate: sim.inputs?.rate ?? sim.rate ?? 7.1,
        years: sim.inputs?.years ?? sim.years ?? 15,
      })
    } else {
      const rawItems = sim.items || sim.results?.itemSummaries || []
      const named = getNamedPortfolioRows(rawItems)
      setEditValues({
        name: sim.name,
        allocationMode: sim.allocationMode || 'manual',
        totalMonthlyBudget:
          sim.totalMonthlyBudget ||
          named.reduce((s, it) => s + (Number(it.monthly) || 0), 0) ||
          10000,
        items: JSON.parse(JSON.stringify(named)),
      })
    }
  }

  const handleApplySmartInEdit = () => {
    const items = editValues.items || []
    if (items.length === 0) return
    const totalM =
      editValues.allocationMode === 'smart'
        ? Number(editValues.totalMonthlyBudget) || 10000
        : items.reduce((s, it) => s + (Number(it.monthly) || 0), 0) || 10000
    const smartList = computeSmartMonthlyAllocations(items, totalM)
    const updatedItems = items.map((it, idx) => ({
      ...it,
      monthly: smartList[idx],
    }))
    setEditValues({
      ...editValues,
      allocationMode: 'smart',
      totalMonthlyBudget: totalM,
      items: updatedItems,
    })
  }

  const handleSaveEditChanges = () => {
    setDuplicateError('')
    if (!selectedSim) return

    if (selectedSim._category === 'lab') {
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

      const m = Math.max(100, Number(editValues.monthly) || 0)
      const r = Math.max(0.1, Number(editValues.rate) || 0)
      const y = Math.max(1, Number(editValues.years) || 1)
      const invested = m * y * 12
      const fv = calcSchemeFV(m, r, y)
      const profit = Math.max(0, fv - invested)
      const profitPct = invested > 0 ? ((profit / invested) * 100).toFixed(1) : '0.0'

      const updated = {
        ...selectedSim,
        name: editValues.name.trim() || selectedSim.name,
        inputs: { monthly: m, rate: r, years: y },
        results: {
          invested,
          totalReturns: Math.round(fv),
          profit: Math.round(profit),
          profitPct,
        },
      }

      onUpdateSavedSimulation(updated)
      setSelectedSim({ ...updated, _category: 'lab' })
      setIsEditing(false)
      setStatusToast('✅ Changes saved! (0 XP)')
      setTimeout(() => setStatusToast(''), 3500)
    } else {
      const rawItems = editValues.items || []
      if (rawItems.length < 2) {
        setDuplicateError('A portfolio simulation requires at least 2 investment options.')
        return
      }

      const mode = editValues.allocationMode || 'manual'
      const budget =
        mode === 'smart'
          ? Number(editValues.totalMonthlyBudget) ||
            rawItems.reduce((s, it) => s + (Number(it.monthly) || 0), 0)
          : null

      const calc = calculatePortfolioSimulation(rawItems, mode, budget)

      const updated = {
        ...selectedSim,
        name: editValues.name.trim() || selectedSim.name,
        allocationMode: mode,
        totalMonthlyBudget: calc.totalMonthly,
        items: calc.itemSummaries,
        results: calc,
      }

      onUpdateSavedPortfolio(updated)
      setSelectedSim({ ...updated, _category: 'portfolio' })
      setIsEditing(false)
      setStatusToast('✅ Portfolio simulation changes saved! (0 XP)')
      setTimeout(() => setStatusToast(''), 3500)
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
      setIsEditing(false)
    }
    setDeleteConfirmTarget(null)
  }

  // Compute full portfolio metrics for the currently selected portfolio simulation
  const portfolioViewCalc =
    selectedSim && selectedSim._category === 'portfolio'
      ? calculatePortfolioSimulation(
          isEditing ? editValues.items || [] : selectedSim.items || selectedSim.results?.itemSummaries || [],
          isEditing ? editValues.allocationMode || 'manual' : selectedSim.allocationMode || 'manual',
          isEditing ? editValues.totalMonthlyBudget : selectedSim.totalMonthlyBudget
        )
      : null

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn-outline" onClick={goBack || (() => go('landing'))} style={{ padding: '8px 18px', fontSize: 13 }}>
          ⬅ Back
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
          📂 SAVED SIMULATIONS HUB (OPTIONAL • 0 XP)
        </div>
      </div>

      {/* Main Title & 2 Folders Switcher */}
      <div
        className="glass-card-deep"
        style={{
          padding: '28px',
          borderRadius: 24,
          marginBottom: 24,
          background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
          border: '2px solid var(--border-subtle, rgba(217, 119, 6, 0.35))',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8 }}>
            SAVED SIMULATIONS ARCHIVE
          </div>
          <h1 className="font-display" style={{ fontSize: 36, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', margin: '0 0 6px 0' }}>
            SAVED SIMULATIONS
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
            Simulations are organized into two main folders: <strong>Lab Simulations</strong> and <strong>Portfolio Simulations</strong>. Click any saved simulation to view its read-only details, edit changes, or delete it.
          </p>
        </div>

        {/* 2 Main Folders: Lab Simulations vs. Portfolio Simulations */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveFolder('lab'); setSelectedSim(null); setIsEditing(false) }}
            style={{
              padding: '14px 30px',
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s',
              background: activeFolder === 'lab' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : (isLight ? '#f8fafc' : 'var(--bg-main, #080705)'),
              color: activeFolder === 'lab' ? '#080705' : (isLight ? '#0f172a' : 'var(--heading-color, #ffffff)'),
              border: activeFolder === 'lab' ? '2px solid #f59e0b' : '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))',
              boxShadow: activeFolder === 'lab' ? '0 4px 16px rgba(245, 158, 11, 0.35)' : 'none',
            }}
          >
            <span>📁</span>
            <span>Lab Simulations ({savedSimulations.length})</span>
          </button>

          <button
            onClick={() => { setActiveFolder('portfolio'); setSelectedSim(null); setIsEditing(false) }}
            style={{
              padding: '14px 30px',
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s',
              background: activeFolder === 'portfolio' ? 'linear-gradient(135deg, #10b981, #0284c7)' : (isLight ? '#f8fafc' : 'var(--bg-main, #080705)'),
              color: activeFolder === 'portfolio' ? '#ffffff' : (isLight ? '#0f172a' : 'var(--heading-color, #ffffff)'),
              border: activeFolder === 'portfolio' ? '2px solid #10b981' : '1.5px solid var(--border-light, rgba(217, 119, 6, 0.25))',
              boxShadow: activeFolder === 'portfolio' ? '0 4px 16px rgba(16, 185, 129, 0.35)' : 'none',
            }}
          >
            <span>📁</span>
            <span>Portfolio Simulations ({savedPortfolioSimulations.length})</span>
          </button>
        </div>
      </div>

      {statusToast && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', color: '#10b981', padding: '12px 18px', borderRadius: 14, marginBottom: 18, fontSize: 13, fontWeight: 800 }}>
          {statusToast}
        </div>
      )}

      {/* Detail / Read-Only View or Edit View Panel */}
      {selectedSim ? (
        <div
          className="anim-scale glass-card-deep"
          style={{
            padding: '32px',
            borderRadius: 20,
            marginBottom: 24,
            background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
            border: '2px solid var(--gold-primary, #f59e0b)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="sticker-badge sticker-yellow">
                  {selectedSim._category === 'lab' ? '📁 LAB SIMULATION' : '📁 PORTFOLIO SIMULATION'}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    background: isEditing ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                    color: isEditing ? (isLight ? '#b45309' : '#fde047') : '#10b981',
                    border: `1px solid ${isEditing ? '#eab308' : '#10b981'}`,
                    padding: '2px 10px',
                    borderRadius: 999,
                    fontWeight: 800,
                  }}
                >
                  {isEditing ? '✏️ EDITING MODE — SAVE BELOW AS "EDIT CHANGES"' : '🔒 SAVED SIMULATION (READ-ONLY)'}
                </span>
              </div>

              {isEditing ? (
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: 4 }}>
                    {selectedSim._category === 'lab' ? 'LAB SIMULATION NAME:' : 'PORTFOLIO SIMULATION NAME:'}
                  </label>
                  <input
                    type="text"
                    className="input-light"
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    style={{ fontSize: 16, fontWeight: 900, padding: '8px 14px', width: '100%', maxWidth: 400 }}
                  />
                </div>
              ) : (
                <h2 style={{ fontSize: 24, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', margin: '8px 0 2px' }}>
                  {selectedSim.name}
                </h2>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
                Saved on: {selectedSim.createdAt || selectedSim.date || 'Recent'} •{' '}
                {selectedSim._category === 'lab'
                  ? `Scheme: ${selectedSim.typeName || selectedSim.type}`
                  : `Mode: ${(selectedSim.allocationMode || 'manual').toUpperCase()} ALLOCATION`}
              </div>
            </div>

            {/* Top Action Buttons: Back, Edit, Delete */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn-outline"
                onClick={() => { setSelectedSim(null); setIsEditing(false) }}
                style={{ padding: '8px 16px', fontSize: 12 }}
              >
                ⬅ Back to Folder
              </button>

              {!isEditing && (
                <button
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                  style={{ padding: '8px 18px', fontSize: 12, fontWeight: 800 }}
                >
                  ✏️ Edit Simulation
                </button>
              )}

              <button
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1.5px solid #ef4444',
                  color: '#ef4444',
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
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #ef4444', color: '#ef4444', padding: '10px 16px', borderRadius: 12, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
              ⚠️ {duplicateError}
            </div>
          )}

          {/* ─── LAB SIMULATION DETAILS ─── */}
          {selectedSim._category === 'lab' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    MONTHLY INVESTMENT (₹)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-light"
                      value={editValues.monthly}
                      onChange={(e) => setEditValues({ ...editValues, monthly: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)' }}>
                      ₹{Number(selectedSim.inputs?.monthly || 0).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    ANNUAL INTEREST RATE (% P.A.)
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
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>
                      {selectedSim.inputs?.rate || 0}% p.a.
                    </div>
                  )}
                </div>

                <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217, 119, 6, 0.2))' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    TIME PERIOD (YEARS)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-light"
                      value={editValues.years}
                      onChange={(e) => setEditValues({ ...editValues, years: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)' }}>
                      {selectedSim.inputs?.years || 0} Years
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Summary Metrics */}
              {(() => {
                const inv = selectedSim.results?.invested || 0
                const ret = selectedSim.results?.totalReturns || 0
                const prof = selectedSim.results?.profit || Math.max(0, ret - inv)
                const profPct = selectedSim.results?.profitPct || (inv > 0 ? ((prof / inv) * 100).toFixed(1) : '0.0')
                const invBar = ret > 0 ? ((inv / ret) * 100).toFixed(1) : '100.0'
                const profBar = ret > 0 ? ((prof / ret) * 100).toFixed(1) : '0.0'

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                      <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL INVESTMENT</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: '#0284c7', marginTop: 2 }}>{fmt(inv)}</div>
                      </div>
                      <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL PROFIT</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{fmt(prof)}</div>
                      </div>
                      <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL RETURNS</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginTop: 2 }}>{fmt(ret)}</div>
                      </div>
                      <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 14, borderRadius: 14, border: '1px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PROFIT PERCENTAGE</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: '#10b981', marginTop: 2 }}>+{profPct}%</div>
                      </div>
                    </div>

                    {/* Invested vs Returns Breakdown Bar */}
                    <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1px solid var(--border-light, rgba(217,119,6,0.25))', marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                        <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>INVESTED VS RETURNS BREAKDOWN</span>
                        <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Returns: {fmt(ret)} (100%)</span>
                      </div>
                      <div style={{ height: 26, borderRadius: 999, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ width: `${invBar}%`, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: 11, fontWeight: 900 }}>
                          {Number(invBar) >= 15 && `${invBar}%`}
                        </div>
                        <div style={{ width: `${profBar}%`, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: 11, fontWeight: 900 }}>
                          {Number(profBar) >= 15 && `${profBar}%`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 10, fontSize: 11, fontWeight: 800 }}>
                        <span style={{ color: '#0284c7' }}>🟦 INVESTED: {invBar}% ({fmt(inv)})</span>
                        <span style={{ color: '#10b981' }}>🟩 RETURNS (PROFIT): {profBar}% ({fmt(prof)})</span>
                      </div>
                    </div>
                  </>
                )
              })()}

              {/* Edit Changes Button */}
              {isEditing && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1.5px solid #f59e0b', padding: 14, borderRadius: 14, marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: isLight ? '#92400e' : '#fbbf24', marginBottom: 10 }}>
                    💡 You have edited this saved simulation. Click <strong>"Edit changes"</strong> below to save your updated simulation:
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-primary" onClick={handleSaveEditChanges} style={{ padding: '12px 28px', fontSize: 14, fontWeight: 900 }}>
                      💾 Edit changes
                    </button>
                    <button className="btn-outline" onClick={() => setIsEditing(false)} style={{ padding: '12px 20px', fontSize: 13 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─── PORTFOLIO SIMULATION DETAILS ─── */
            portfolioViewCalc && (
              <div>
                {/* Allocation Mode Controls when Editing */}
                {isEditing && (
                  <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 16, border: '1.5px solid rgba(245, 158, 11, 0.35)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditValues({ ...editValues, allocationMode: 'manual' })}
                          style={{
                            padding: '8px 18px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: 'pointer',
                            background: editValues.allocationMode === 'manual' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                            color: editValues.allocationMode === 'manual' ? '#080705' : (isLight ? '#0f172a' : '#ffffff'),
                            border: '1.5px solid #f59e0b',
                          }}
                        >
                          ✍️ Manual Allocation
                        </button>
                        <button
                          onClick={handleApplySmartInEdit}
                          style={{
                            padding: '8px 18px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: 'pointer',
                            background: editValues.allocationMode === 'smart' ? 'linear-gradient(135deg, #10b981, #0284c7)' : 'transparent',
                            color: editValues.allocationMode === 'smart' ? '#ffffff' : '#10b981',
                            border: '1.5px solid #10b981',
                          }}
                        >
                          🧠 Smart Allocation (Max Profit)
                        </button>
                      </div>

                      {editValues.allocationMode === 'smart' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>TOTAL MONTHLY INVESTMENT (₹):</span>
                          <input
                            type="number"
                            className="input-light"
                            value={editValues.totalMonthlyBudget}
                            onChange={(e) => {
                              const nextBudget = Number(e.target.value) || 0
                              const smartList = computeSmartMonthlyAllocations(editValues.items || [], nextBudget)
                              setEditValues({
                                ...editValues,
                                totalMonthlyBudget: e.target.value,
                                items: (editValues.items || []).map((it, idx) => ({ ...it, monthly: smartList[idx] })),
                              })
                            }}
                            style={{ width: 140, padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Investment Options Rows */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--gold-amber, #fbbf24)', display: 'block', marginBottom: 10 }}>
                    SELECTED INVESTMENT OPTIONS ({portfolioViewCalc.itemSummaries.length}):
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {portfolioViewCalc.itemSummaries.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)',
                          border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                          borderRadius: 14,
                          padding: 14,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                          gap: 12,
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INVESTMENT NAME</div>
                          {isEditing ? (
                            <input
                              type="text"
                              className="input-light"
                              value={editValues.items[idx]?.customName ?? item.name}
                              onChange={(e) => {
                                const copy = [...editValues.items]
                                copy[idx] = { ...copy[idx], customName: e.target.value, name: e.target.value }
                                setEditValues({ ...editValues, items: copy })
                              }}
                              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 800 }}
                            />
                          ) : (
                            <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', fontSize: 14 }}>
                              {item.emoji} {item.name}
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
                            MONTHLY INVESTMENT (₹)
                          </div>
                          {isEditing && editValues.allocationMode !== 'smart' ? (
                            <input
                              type="number"
                              className="input-light"
                              value={editValues.items[idx]?.monthly}
                              onChange={(e) => {
                                const copy = [...editValues.items]
                                copy[idx] = { ...copy[idx], monthly: e.target.value }
                                setEditValues({ ...editValues, items: copy })
                              }}
                              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 800 }}
                            />
                          ) : (
                            <div style={{ fontWeight: 900, color: '#0284c7', fontSize: 13 }}>
                              ₹{Number(item.monthly).toLocaleString('en-IN')}/mo
                              {isEditing && editValues.allocationMode === 'smart' && (
                                <span style={{ display: 'block', fontSize: 9, color: '#10b981' }}>🧠 Auto-Allocated</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INTEREST RATE (% P.A.)</div>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              className="input-light"
                              value={editValues.items[idx]?.rate}
                              onChange={(e) => {
                                const copy = [...editValues.items]
                                copy[idx] = { ...copy[idx], rate: e.target.value }
                                if (editValues.allocationMode === 'smart') {
                                  const smartList = computeSmartMonthlyAllocations(copy, editValues.totalMonthlyBudget)
                                  copy.forEach((it, i) => { it.monthly = smartList[i] })
                                }
                                setEditValues({ ...editValues, items: copy })
                              }}
                              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 800 }}
                            />
                          ) : (
                            <div style={{ fontWeight: 900, color: '#f59e0b', fontSize: 13 }}>
                              {item.rate}% p.a.
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TIME PERIOD (YEARS)</div>
                          {isEditing ? (
                            <input
                              type="number"
                              className="input-light"
                              value={editValues.items[idx]?.years ?? editValues.items[idx]?.tenure}
                              onChange={(e) => {
                                const copy = [...editValues.items]
                                copy[idx] = { ...copy[idx], years: e.target.value, tenure: e.target.value }
                                if (editValues.allocationMode === 'smart') {
                                  const smartList = computeSmartMonthlyAllocations(copy, editValues.totalMonthlyBudget)
                                  copy.forEach((it, i) => { it.monthly = smartList[i] })
                                }
                                setEditValues({ ...editValues, items: copy })
                              }}
                              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 800 }}
                            />
                          ) : (
                            <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', fontSize: 13 }}>
                              {item.years} Years
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>INVESTED / PROFIT</div>
                          <div style={{ fontWeight: 800, color: '#0284c7', fontSize: 12 }}>
                            {fmt(item.invested)} <span style={{ color: '#10b981' }}>(+{fmt(item.profit)})</span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TOTAL RETURNS</div>
                          <div style={{ fontWeight: 900, color: '#10b981', fontSize: 14 }}>
                            {fmt(item.returns)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Combined Summary Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 14, border: '1.5px solid #0284c7' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL INVESTMENT</div>
                    <div style={{ fontSize: 19, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>{fmt(portfolioViewCalc.totalInvested)}</div>
                  </div>
                  <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 14, border: '1.5px solid #10b981' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL PROFIT</div>
                    <div style={{ fontSize: 19, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{fmt(portfolioViewCalc.totalProfit)}</div>
                  </div>
                  <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 14, border: '1.5px solid var(--border-light, rgba(217,119,6,0.3))' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>TOTAL RETURNS</div>
                    <div style={{ fontSize: 19, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginTop: 4 }}>{fmt(portfolioViewCalc.totalReturns)}</div>
                  </div>
                  <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 16, borderRadius: 14, border: '1.5px solid #10b981' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted, #94a3b8)' }}>PROFIT PERCENTAGE</div>
                    <div style={{ fontSize: 19, fontWeight: 900, color: '#10b981', marginTop: 4 }}>+{portfolioViewCalc.profitPct}%</div>
                  </div>
                </div>

                {/* Combined Invested vs Returns Breakdown Bar */}
                <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 18, borderRadius: 16, border: '1.5px solid rgba(2, 132, 199, 0.35)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                    <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                    <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Returns: {fmt(portfolioViewCalc.totalReturns)} (100%)</span>
                  </div>
                  <div style={{ height: 28, borderRadius: 999, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      style={{
                        width: `${portfolioViewCalc.investedBarPct}%`,
                        background: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {Number(portfolioViewCalc.investedBarPct) >= 14 && `${portfolioViewCalc.investedBarPct}%`}
                    </div>
                    <div
                      style={{
                        width: `${portfolioViewCalc.returnsBarPct}%`,
                        background: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {Number(portfolioViewCalc.returnsBarPct) >= 14 && `${portfolioViewCalc.returnsBarPct}%`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 10, fontSize: 11, fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>
                      🟦 TOTAL INVESTED: {portfolioViewCalc.investedBarPct}% ({fmt(portfolioViewCalc.totalInvested)})
                    </span>
                    <span style={{ color: '#10b981' }}>
                      🟩 TOTAL RETURNS (PROFIT): {portfolioViewCalc.returnsBarPct}% ({fmt(portfolioViewCalc.totalProfit)})
                    </span>
                  </div>
                </div>

                {/* Gap Periods Analysis */}
                <div style={{ background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 20, borderRadius: 18, border: '1.5px solid rgba(245, 158, 11, 0.35)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>⏳</span>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                        GAP PERIODS ANALYSIS (LONGEST HORIZON: {portfolioViewCalc.maxHorizon} YEARS)
                      </h4>
                      <p style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0' }}>
                        Identifies when shorter-tenure investments mature and how many gap years are available before your longest investment finishes.
                      </p>
                    </div>
                  </div>

                  {portfolioViewCalc.gapPeriods.length === 0 ? (
                    <div style={{ fontSize: 12, color: isLight ? '#334155' : '#d1d5db', fontWeight: 700, padding: '10px 14px', borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
                      ✅ All selected investments in this portfolio have the same time period ({portfolioViewCalc.maxHorizon} years), so they mature together with 0 gap years.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {portfolioViewCalc.gapPeriods.map((gap, gIdx) => (
                        <div key={gIdx} style={{ background: isLight ? '#ffffff' : 'rgba(18, 16, 12, 0.9)', border: '1.5px solid #f59e0b', padding: 14, borderRadius: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 13 }}>
                              {gap.emoji} {gap.name} matures in {gap.maturesAt} Years
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '3px 10px', borderRadius: 999, border: '1px solid #f59e0b' }}>
                              {gap.gapYears} {gap.gapYears === 1 ? 'YEAR' : 'YEARS'} GAP AVAILABLE
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: isLight ? '#334155' : '#d1d5db', margin: '0 0 8px', lineHeight: 1.5 }}>
                            <strong>{gap.name}</strong> matures at <strong>Year {gap.maturesAt}</strong> with a matured amount of <strong style={{ color: '#10b981' }}>{fmt(gap.maturedCorpus)}</strong>, leaving a <strong>{gap.gapYears}-year gap period</strong> until Year {gap.maxHorizon}.
                          </p>
                          <div style={{ fontSize: 11, color: isLight ? '#92400e' : '#fbbf24', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: 8 }}>
                            💡 {gap.smartTip}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Edit Changes Save Prompt & Button */}
                {isEditing && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1.5px solid #f59e0b', padding: 16, borderRadius: 14, marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: isLight ? '#92400e' : '#fbbf24', marginBottom: 10 }}>
                      💡 Please save your edited portfolio simulation by clicking <strong>"Edit changes"</strong> below:
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn-primary" onClick={handleSaveEditChanges} style={{ padding: '12px 28px', fontSize: 14, fontWeight: 900 }}>
                        💾 Edit changes
                      </button>
                      <button className="btn-outline" onClick={() => setIsEditing(false)} style={{ padding: '12px 20px', fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : null}

      {/* List of Saved Simulations in the Active Folder */}
      {!selectedSim && (
        <div>
          {activeFolder === 'lab' ? (
            savedSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🧪</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
                  No Lab Simulations Saved Yet
                </h3>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, marginBottom: 16 }}>
                  Run any scheme simulation in Level 2 Simulator Modules and click "Save Simulation" to save it here.
                </p>
                <button className="btn-primary" onClick={() => go('intermediate')} style={{ padding: '10px 24px', fontSize: 13 }}>
                  🧪 Go to Level 2 Lab Simulators
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
                      background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                      border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>{sim.emoji || '📈'}</span>
                        <div>
                          <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', fontSize: 15 }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0', background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 10, borderRadius: 12 }}>
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
                      <span style={{ color: '#10b981' }}>
                        +{sim.results?.profitPct || 0}% Profit
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            handleOpenSim(sim, 'lab')
                            setIsEditing(true)
                          }}
                          style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget({ id: sim.id, name: sim.name, category: 'lab' })}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Portfolio Simulations Folder */
            savedPortfolioSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', borderRadius: 20, border: '1.5px solid var(--border-light, rgba(217,119,6,0.2))' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🏢</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 6 }}>
                  No Portfolio Simulations Saved Yet
                </h3>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 13, marginBottom: 16 }}>
                  Run a portfolio simulation in Level 2 Portfolio Simulator and save your customized portfolio here.
                </p>
                <button className="btn-primary" onClick={() => go('intermediate')} style={{ padding: '10px 24px', fontSize: 13 }}>
                  🏢 Go to Portfolio Simulator
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
                      background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                      border: '1.5px solid var(--border-light, rgba(217,119,6,0.25))',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', fontSize: 15 }}>
                          🏢 {sim.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>
                          {(sim.items || sim.results?.itemSummaries || []).length} Investment Options ({(sim.items || sim.results?.itemSummaries || []).map(i => i.name).join(', ')})
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>
                        {sim.createdAt || sim.date || 'Saved'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0', background: isLight ? '#f8fafc' : 'var(--bg-main, #080705)', padding: 10, borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>TOTAL INVESTMENT</div>
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
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            handleOpenSim(sim, 'portfolio')
                            setIsEditing(true)
                          }}
                          style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget({ id: sim.id, name: sim.name, category: 'portfolio' })}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
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
              background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
              border: '2px solid #ef4444',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 8 }}>
              CONFIRM SIMULATION DELETION
            </h3>
            <p style={{ color: isLight ? '#334155' : 'var(--text-sub, #d1d5db)', fontSize: 13, lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to permanently delete{' '}
              <strong style={{ color: '#ef4444' }}>"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
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
