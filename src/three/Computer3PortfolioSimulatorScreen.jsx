import React, { useState, useMemo, useEffect } from 'react'
import {
  PORTFOLIO_OPTIONS_CATALOG,
  getNamedPortfolioRows,
  computeSmartMonthlyAllocations,
  calculatePortfolioSimulation,
} from '../data.js'

const fmtINR = (val) => '₹' + Math.round(Number(val) || 0).toLocaleString('en-IN')

export function Computer3PortfolioSimulatorScreen({
  state,
  update,
  addXP,
  savedPortfolioSimulations = [],
  onSavePortfolio,
  onUpdateSavedPortfolio,
  onDeleteSavedPortfolio,
  metricsCompleted,
  onCompleteComputer3,
  onCompleteLevel2,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const handleFinish = onCompleteComputer3 || onCompleteLevel2

  // View state: 'simulator' or 'saved'
  const [subView, setSubView] = useState('simulator')

  // Allocation mode: 'manual' or 'smart'
  const [allocationMode, setAllocationMode] = useState('manual')

  // Smart Allocation total monthly budget pool
  const [smartTotalMonthly, setSmartTotalMonthly] = useState(15000)

  // Visual pulse / highlight flag when smart allocation is freshly calculated/applied
  const [highlightSmart, setHighlightSmart] = useState(false)

  // Selected investment options (rows)
  // Default: Starts with 2 schemes (FD @ 5 yrs, PPF @ 15 yrs) to clearly illustrate gap periods right away
  const [selectedRows, setSelectedRows] = useState([
    {
      rowId: 'row_init_fd_1',
      typeKey: 'FD',
      customName: '',
      monthly: 5000,
      rate: 7.25,
      years: 5,
      smartAllocated: false,
    },
    {
      rowId: 'row_init_ppf_1',
      typeKey: 'PPF',
      customName: '',
      monthly: 5000,
      rate: 7.1,
      years: 15,
      smartAllocated: false,
    },
  ])

  // Track whether simulation has been executed
  const [hasSimulated, setHasSimulated] = useState(false)

  // Simulation results object
  const [simResult, setSimResult] = useState(() => {
    return calculatePortfolioSimulation(
      [
        { rowId: 'row_init_fd_1', typeKey: 'FD', customName: '', monthly: 5000, rate: 7.25, years: 5 },
        { rowId: 'row_init_ppf_1', typeKey: 'PPF', customName: '', monthly: 5000, rate: 7.1, years: 15 },
      ],
      'manual',
      10000
    )
  })

  // Level 2 completion state
  const [showCompletedPage, setShowCompletedPage] = useState(false)
  const [xpClaimed, setXpClaimed] = useState(false)

  // Saving simulation modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [rowNamesToSave, setRowNamesToSave] = useState({})
  const [editingSimId, setEditingSimId] = useState(null)

  // Read-only view modal state for saved simulations
  const [viewingSavedSim, setViewingSavedSim] = useState(null)

  // Delete confirmation modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }

  // Saved Portfolios list resolution (props + localStorage fallback)
  const allSavedPortfolios = useMemo(() => {
    if (Array.isArray(savedPortfolioSimulations) && savedPortfolioSimulations.length > 0) {
      return savedPortfolioSimulations
    }
    try {
      const local = JSON.parse(localStorage.getItem('l2i_savedPortfolioSimulations')) || []
      return Array.isArray(local) ? local : []
    } catch {
      return []
    }
  }, [savedPortfolioSimulations])

  // Computes default and active names using getNamedPortfolioRows (e.g. FD 1, FD 2, or just RD)
  const namedRows = useMemo(() => {
    return getNamedPortfolioRows(selectedRows)
  }, [selectedRows])

  // Total current monthly sum across rows
  const currentMonthlySum = useMemo(() => {
    return selectedRows.reduce((acc, r) => acc + Math.max(0, Math.round(Number(r.monthly) || 0)), 0)
  }, [selectedRows])

  // Keep smartTotalMonthly in sync with current sum if in manual mode
  useEffect(() => {
    if (allocationMode === 'manual' && currentMonthlySum > 0) {
      setSmartTotalMonthly(currentMonthlySum)
    }
  }, [currentMonthlySum, allocationMode])

  // Add an option to the portfolio (can select any option, even same option multiple times)
  const handleAddOption = (opt) => {
    const newRowId = `row_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    setSelectedRows((prev) => [
      ...prev,
      {
        rowId: newRowId,
        typeKey: opt.typeKey,
        customName: '',
        monthly: opt.defaultMonthly || 5000,
        rate: opt.defaultRate || 7.0,
        years: opt.defaultTenure || 5,
        smartAllocated: false,
      },
    ])
    showToast(`Added ${opt.name} (${opt.emoji}) to your portfolio rows!`)
  }

  // Remove a row
  const handleRemoveRow = (rowId) => {
    setSelectedRows((prev) => prev.filter((r) => r.rowId !== rowId))
  }

  // Update a field on a specific row
  const handleUpdateRow = (rowId, field, value) => {
    setSelectedRows((prev) =>
      prev.map((r) => {
        if (r.rowId !== rowId) return r
        let cleanVal = value
        if (field === 'monthly') cleanVal = Math.max(0, Math.round(Number(value) || 0))
        if (field === 'rate') cleanVal = Math.max(0.1, Number(value) || 0.1)
        if (field === 'years') cleanVal = Math.max(1, Math.round(Number(value) || 1))
        return {
          ...r,
          [field]: cleanVal,
          smartAllocated: field === 'monthly' ? false : r.smartAllocated,
        }
      })
    )
  }

  // Apply Smart Allocation:
  // Combines all monthly allocations and divides them to maximize total profit with respect to rate and tenure
  const handleApplySmartAllocation = (customTotalBudget = null) => {
    if (selectedRows.length === 0) {
      showToast('⚠️ Please select at least 1 investment option first.')
      return
    }

    let budget = customTotalBudget
    if (budget === null || budget === undefined) {
      budget = smartTotalMonthly
    }
    budget = Math.max(selectedRows.length * 100, Math.round(Number(budget) || 10000))
    setSmartTotalMonthly(budget)

    const allocations = computeSmartMonthlyAllocations(namedRows, budget)

    const updatedRows = selectedRows.map((r, idx) => ({
      ...r,
      monthly: allocations[idx] || 0,
      smartAllocated: true,
    }))

    setSelectedRows(updatedRows)
    setHighlightSmart(true)
    setTimeout(() => setHighlightSmart(false), 5000)

    const res = calculatePortfolioSimulation(updatedRows, 'smart', budget)
    setSimResult(res)
    setHasSimulated(true)
    showToast(
      `🧠 Smart Allocation applied! Allocated ₹${budget.toLocaleString(
        'en-IN'
      )}/mo across ${selectedRows.length} options to maximize profit.`
    )
  }

  // Run the combined portfolio simulation
  const handleRunSimulation = () => {
    if (selectedRows.length < 2) {
      showToast('⚠️ Please select at least 2 investment options to run a portfolio simulation.')
      return
    }

    const res = calculatePortfolioSimulation(selectedRows, allocationMode, smartTotalMonthly)
    setSimResult(res)
    setHasSimulated(true)

    // Award Level 2 completion XP once
    if (!xpClaimed && addXP) {
      addXP(100)
      setXpClaimed(true)
      if (update) {
        update((prev) => ({
          ...prev,
          metricsCompleted: {
            ...(prev?.metricsCompleted || {}),
            computer3: true,
          },
        }))
      }
      showToast('🎉 Portfolio Simulation Complete! +100 XP Bonus Awarded!')
    } else {
      showToast('✅ Portfolio simulation calculated successfully!')
    }
  }

  // Open Save Modal (Optional • 0 XP)
  const openSaveModal = () => {
    if (editingSimId) {
      const existing = allSavedPortfolios.find((p) => p.id === editingSimId)
      setSaveName(existing?.name || `Portfolio simulation ${allSavedPortfolios.length + 1}`)
    } else {
      setSaveName(`Portfolio simulation ${allSavedPortfolios.length + 1}`)
    }

    // Prepopulate inside row names
    const rowNames = {}
    namedRows.forEach((r) => {
      rowNames[r.rowId] = r.customName || r.defaultName
    })
    setRowNamesToSave(rowNames)
    setSaveModalOpen(true)
  }

  // Confirm Saving (Optional • 0 XP)
  const handleConfirmSave = () => {
    const finalRows = selectedRows.map((r) => ({
      ...r,
      customName: rowNamesToSave[r.rowId]?.trim() || '',
    }))

    const finalNamed = getNamedPortfolioRows(finalRows)
    const currentRes = calculatePortfolioSimulation(finalNamed, allocationMode, smartTotalMonthly)

    const portfolioRecord = {
      id: editingSimId || `port_sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: saveName.trim() || `Portfolio simulation ${allSavedPortfolios.length + 1}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: Date.now(),
      category: 'portfolio',
      allocationMode,
      totalMonthly: currentRes.totalMonthly,
      totalInvested: currentRes.totalInvested,
      totalReturns: currentRes.totalReturns,
      totalProfit: currentRes.totalProfit,
      profitPercentage: currentRes.profitPercentage,
      investedBarPct: currentRes.investedBarPct,
      returnsBarPct: currentRes.returnsBarPct,
      maxHorizon: currentRes.maxHorizon,
      selectedRows: finalRows,
      itemSummaries: currentRes.itemSummaries,
      gapPeriods: currentRes.gapPeriods,
      isEdited: Boolean(editingSimId),
    }

    if (editingSimId) {
      if (onUpdateSavedPortfolio) {
        onUpdateSavedPortfolio(portfolioRecord)
      } else {
        const next = allSavedPortfolios.map((p) => (p.id === editingSimId ? portfolioRecord : p))
        localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
      }
      showToast(`✏️ Changes saved to "${portfolioRecord.name}"!`)
      setEditingSimId(null)
    } else {
      if (onSavePortfolio) {
        onSavePortfolio(portfolioRecord)
      } else {
        const next = [portfolioRecord, ...allSavedPortfolios]
        localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
      }
      showToast(`💾 "${portfolioRecord.name}" saved! (Optional • 0 XP)`)
    }

    setSaveModalOpen(false)
  }

  // Edit an existing saved simulation
  const handleEditSavedSim = (sim) => {
    setEditingSimId(sim.id)
    if (Array.isArray(sim.selectedRows) && sim.selectedRows.length > 0) {
      setSelectedRows(sim.selectedRows)
    }
    setAllocationMode(sim.allocationMode || 'manual')
    setSmartTotalMonthly(sim.totalMonthly || 15000)
    setSimResult(calculatePortfolioSimulation(sim.selectedRows, sim.allocationMode, sim.totalMonthly))
    setHasSimulated(true)
    setSubView('simulator')
    setViewingSavedSim(null)
    showToast(`✏️ Loaded "${sim.name}" for editing. Click 'Save as "Edit changes"' after modifying.`)
  }

  // Delete a saved simulation (with confirmation)
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return
    const id = deleteConfirmTarget.id
    const name = deleteConfirmTarget.name
    if (onDeleteSavedPortfolio) {
      onDeleteSavedPortfolio(id)
    } else {
      const next = allSavedPortfolios.filter((p) => p.id !== id)
      localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
    }
    if (viewingSavedSim?.id === id) {
      setViewingSavedSim(null)
    }
    setDeleteConfirmTarget(null)
    showToast(`🗑️ Deleted "${name}".`)
  }

  // --------------------------------------------------------------------------
  // LEVEL 2 COMPLETED PAGE (CELEBRATION / EXIT MODAL)
  // --------------------------------------------------------------------------
  if (showCompletedPage) {
    return (
      <div
        onWheel={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 30%, #451A03 0%, #090D1A 85%)',
          color: '#F8FAFC',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 36px',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'rgba(14,165,233,0.22)',
              border: '1.5px solid #38BDF8',
              color: '#E0F2FE',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? '🗗 Exit Full Screen' : '⛶ Full Screen'}
          </button>
        )}
        <div style={{ fontSize: '38px', marginBottom: '6px' }}>📊🏆🏦</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              background: 'rgba(245,158,11,0.22)',
              border: '1.5px solid #F59E0B',
              color: '#FDE68A',
              fontSize: '11px',
              fontWeight: 900,
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            ✅ COMPUTER 3 & LEVEL 2 COMPLETED!
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: 900,
              padding: '4px 12px',
              borderRadius: '999px',
              boxShadow: '0 4px 14px rgba(16,185,129,0.45)',
            }}
          >
            ⭐ +100 XP Bonus Claimed!
          </div>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 6px 0', color: '#FFFFFF' }}>
          Portfolio Simulator & Gap Strategy Mastered!
        </h2>
        <p
          style={{
            fontSize: '12.5px',
            color: '#CBD5E1',
            maxWidth: '540px',
            margin: '0 0 16px 0',
            lineHeight: 1.5,
          }}
        >
          Your simulated multi-scheme portfolio achieves a projected maturity of{' '}
          <strong style={{ color: '#34D399' }}>{fmtINR(simResult.totalReturns)}</strong> (+
          {simResult.profitPercentage}% profit). Now walk out of the school entrance and step into the{' '}
          <strong>Level 3 Bank</strong> right beside the school!
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setShowCompletedPage(false)}
            style={{
              background: 'rgba(30,41,59,0.9)',
              color: '#E2E8F0',
              border: '1px solid rgba(148,163,184,0.35)',
              borderRadius: '10px',
              padding: '9px 16px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ← Back to Portfolio
          </button>
          {handleFinish && (
            <button
              onClick={handleFinish}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 20px',
                fontSize: '12.5px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(16,185,129,0.45)',
              }}
            >
              🚶 Walk Out of School → Road → Level 3 Bank →
            </button>
          )}
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // MAIN COMPONENT RENDER
  // --------------------------------------------------------------------------
  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        height: '100%',
        background: '#0B1120',
        color: '#F8FAFC',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1.5px solid #38BDF8',
            color: '#F0F9FF',
            padding: '7px 18px',
            borderRadius: '999px',
            fontSize: '11.5px',
            fontWeight: 800,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER & NAVIGATION */}
      <div
        style={{
          background: 'rgba(15,23,42,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4F46E5, #9333EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
            }}
          >
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                Computer 3: Portfolio Simulator
              </span>
              <span
                style={{
                  background: 'rgba(99,102,241,0.22)',
                  color: '#A5B4FC',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  border: '1px solid rgba(99,102,241,0.4)',
                }}
              >
                LEVEL 2 ADVANCED
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              Multi-Asset Simulation • Smart Allocation Optimization • Gap Periods Analysis
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(30,41,59,0.7)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setSubView('simulator')}
              style={{
                background: subView === 'simulator' ? '#4F46E5' : 'transparent',
                color: subView === 'simulator' ? '#FFF' : '#94A3B8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📊 Simulator Workspace
            </button>
            <button
              onClick={() => setSubView('saved')}
              style={{
                background: subView === 'saved' ? '#4F46E5' : 'transparent',
                color: subView === 'saved' ? '#FFF' : '#94A3B8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📁 Saved Simulations ({allSavedPortfolios.length})
            </button>
          </div>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              style={{
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#CBD5E1',
                borderRadius: '7px',
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? '🗗' : '⛶'}
            </button>
          )}
        </div>
      </div>

      {/* SUB-VIEW 1: SIMULATOR WORKSPACE */}
      {subView === 'simulator' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* STEP 1: HORIZONTAL INVESTMENT OPTIONS CATALOG */}
          <div
            style={{
              background: 'rgba(15,23,42,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '10px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#F1F5F9', letterSpacing: '0.3px' }}>
                  CHOOSE INVESTMENT OPTIONS
                </span>
                <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                  (Click <strong style={{ color: '#34D399' }}>+</strong> beside any option; select 2+ options, or the
                  same option multiple times)
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#64748B' }}>
                {selectedRows.length} Selected • {selectedRows.length >= 2 ? '✅ Ready' : '⚠️ Need 2+'}
              </span>
            </div>

            {/* Horizontal scrollable row of options */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'thin',
              }}
            >
              {PORTFOLIO_OPTIONS_CATALOG.map((opt) => (
                <div
                  key={opt.typeKey}
                  style={{
                    flexShrink: 0,
                    background: 'rgba(30,41,59,0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '135px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{opt.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#F8FAFC', whiteSpace: 'nowrap' }}>
                      {opt.typeKey}
                    </div>
                    <div style={{ fontSize: '9px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {opt.defaultRate}% • {opt.defaultTenure}y
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddOption(opt)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '13px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(16,185,129,0.3)',
                    }}
                    title={`Add ${opt.name}`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ALLOCATION MODE TOGGLES & SMART ALLOCATION POOL */}
          <div
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#F1F5F9' }}>ALLOCATION MODE:</span>
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(30,41,59,0.85)',
                    borderRadius: '7px',
                    padding: '2px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <button
                    onClick={() => setAllocationMode('manual')}
                    style={{
                      background: allocationMode === 'manual' ? '#6366F1' : 'transparent',
                      color: allocationMode === 'manual' ? '#FFF' : '#94A3B8',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '4px 10px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    ✍️ Manual Allocation
                  </button>
                  <button
                    onClick={() => {
                      setAllocationMode('smart')
                      handleApplySmartAllocation(smartTotalMonthly || currentMonthlySum || 15000)
                    }}
                    style={{
                      background:
                        allocationMode === 'smart'
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : 'transparent',
                      color: allocationMode === 'smart' ? '#FFF' : '#94A3B8',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '4px 10px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    🧠 Smart Allocation
                  </button>
                </div>
              </div>

              {editingSimId && (
                <div
                  style={{
                    background: 'rgba(245,158,11,0.18)',
                    border: '1px solid #F59E0B',
                    color: '#FDE68A',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '6px',
                  }}
                >
                  ✏️ Editing Saved Simulation
                </div>
              )}
            </div>

            {/* Smart Allocation Budget Controls (visible in Smart mode or readily usable) */}
            {allocationMode === 'smart' && (
              <div
                style={{
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px dashed rgba(245,158,11,0.35)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#FCD34D', fontWeight: 800 }}>
                    Total Monthly Investment Pool:
                  </span>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '8px',
                        color: '#94A3B8',
                        fontSize: '11px',
                        fontWeight: 900,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min={selectedRows.length * 500}
                      step={500}
                      value={smartTotalMonthly}
                      onChange={(e) => setSmartTotalMonthly(Math.max(100, Number(e.target.value) || 0))}
                      style={{
                        background: '#1E293B',
                        border: '1px solid #F59E0B',
                        color: '#FFF',
                        borderRadius: '6px',
                        padding: '4px 8px 4px 20px',
                        fontSize: '12px',
                        fontWeight: 900,
                        width: '110px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleApplySmartAllocation(smartTotalMonthly)}
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                    }}
                  >
                    ⚡ Calculate & Apply Smart Allocation
                  </button>
                  <span style={{ fontSize: '10px', color: '#CBD5E1' }}>
                    (Automatically optimizes allocations across chosen tenures and rates)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: SELECTED INVESTMENTS SHOWN IN ROWS MANNER */}
          <div
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#F1F5F9', letterSpacing: '0.3px' }}>
                SELECTED INVESTMENTS ({selectedRows.length} ROWS)
              </span>
              <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                You can customize names, monthly deposits, rates, and tenures below
              </span>
            </div>

            {selectedRows.length === 0 ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: '#94A3B8',
                  fontSize: '12px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              >
                No investment options selected yet. Click the <strong style={{ color: '#34D399' }}>+</strong> button in
                the top bar to add schemes!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {namedRows.map((row) => {
                  const isHighlighted = row.smartAllocated || highlightSmart
                  return (
                    <div
                      key={row.rowId}
                      style={{
                        background: isHighlighted ? 'rgba(245,158,11,0.09)' : 'rgba(30,41,59,0.75)',
                        border: isHighlighted
                          ? '1.5px solid #F59E0B'
                          : '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'grid',
                        gridTemplateColumns: 'minmax(140px, 1.3fr) 1fr 0.8fr 0.8fr 28px',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        boxShadow: isHighlighted ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
                      }}
                    >
                      {/* Name & Type */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{row.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <input
                            type="text"
                            value={row.customName || row.defaultName}
                            onChange={(e) => handleUpdateRow(row.rowId, 'customName', e.target.value)}
                            placeholder={row.defaultName}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              borderBottom: '1px solid rgba(255,255,255,0.2)',
                              color: '#F8FAFC',
                              fontSize: '11.5px',
                              fontWeight: 900,
                              width: '100%',
                              padding: '2px 0',
                              outline: 'none',
                            }}
                            title="Click to rename this investment"
                          />
                          <div style={{ fontSize: '9px', color: '#94A3B8' }}>{row.typeKey} Scheme</div>
                        </div>
                      </div>

                      {/* Monthly Investment */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '2px',
                          }}
                        >
                          <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>MONTHLY (₹)</span>
                          {row.smartAllocated && (
                            <span
                              style={{
                                fontSize: '8.5px',
                                background: '#F59E0B',
                                color: '#000',
                                fontWeight: 900,
                                padding: '1px 5px',
                                borderRadius: '4px',
                              }}
                            >
                              ⚡ SMART
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={row.monthly}
                          onChange={(e) => handleUpdateRow(row.rowId, 'monthly', e.target.value)}
                          style={{
                            background: isHighlighted ? 'rgba(245,158,11,0.18)' : '#1E293B',
                            border: isHighlighted
                              ? '1.5px solid #F59E0B'
                              : '1px solid rgba(255,255,255,0.12)',
                            color: isHighlighted ? '#FDE68A' : '#FFF',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            fontSize: '11.5px',
                            fontWeight: 900,
                            width: '100%',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* Rate of Interest */}
                      <div>
                        <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 800, display: 'block' }}>
                          RATE (% P.A.)
                        </span>
                        <input
                          type="number"
                          min={0.5}
                          max={25}
                          step={0.1}
                          value={row.rate}
                          onChange={(e) => handleUpdateRow(row.rowId, 'rate', e.target.value)}
                          style={{
                            background: '#1E293B',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#FFF',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            fontSize: '11.5px',
                            fontWeight: 900,
                            width: '100%',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* Time Period / Tenure */}
                      <div>
                        <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 800, display: 'block' }}>
                          TENURE (YRS)
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={35}
                          step={1}
                          value={row.years}
                          onChange={(e) => handleUpdateRow(row.rowId, 'years', e.target.value)}
                          style={{
                            background: '#1E293B',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#FFF',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            fontSize: '11.5px',
                            fontWeight: 900,
                            width: '100%',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveRow(row.rowId)}
                        style={{
                          background: 'rgba(239,68,68,0.18)',
                          border: '1px solid rgba(239,68,68,0.4)',
                          color: '#F87171',
                          borderRadius: '6px',
                          width: '26px',
                          height: '26px',
                          fontSize: '11px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Remove option"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ACTION BUTTONS BAR */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '6px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRunSimulation}
                  disabled={selectedRows.length < 2}
                  style={{
                    background:
                      selectedRows.length >= 2
                        ? 'linear-gradient(135deg, #10B981, #059669)'
                        : 'rgba(51,65,85,0.6)',
                    color: selectedRows.length >= 2 ? '#FFF' : '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: selectedRows.length >= 2 ? 'pointer' : 'not-allowed',
                    boxShadow:
                      selectedRows.length >= 2 ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
                  }}
                >
                  {selectedRows.length < 2
                    ? '⚠️ Select at least 2 options'
                    : '🚀 Run Portfolio Simulation'}
                </button>

                {/* Smart Allocation button present after selecting options & after simulation has run */}
                <button
                  onClick={() => handleApplySmartAllocation(currentMonthlySum || smartTotalMonthly || 15000)}
                  disabled={selectedRows.length < 1}
                  style={{
                    background:
                      selectedRows.length >= 1
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : 'rgba(51,65,85,0.6)',
                    color: selectedRows.length >= 1 ? '#FFF' : '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: selectedRows.length >= 1 ? 'pointer' : 'not-allowed',
                    boxShadow:
                      selectedRows.length >= 1 ? '0 4px 14px rgba(245,158,11,0.35)' : 'none',
                  }}
                  title="Optimize monthly allocations to maximize profit with respect to interest rate and tenure"
                >
                  🧠 Run Smart Allocation
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={openSaveModal}
                  style={{
                    background: 'rgba(30,41,59,0.85)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: '#E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title="Optional • 0 XP"
                >
                  {editingSimId ? '✏️ Save as "Edit changes"' : '💾 Save Simulation (0 XP)'}
                </button>

                {hasSimulated && (
                  <button
                    onClick={() => setShowCompletedPage(true)}
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #9333EA)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '11.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                    }}
                  >
                    🏆 Level 2 Complete →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* COMBINED SIMULATION RESULTS & ANALYSIS */}
          {simResult && (
            <div
              style={{
                background: 'rgba(15,23,42,0.92)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF' }}>
                    📈 COMBINED PORTFOLIO RESULTS
                  </span>
                  <span
                    style={{
                      background: 'rgba(16,185,129,0.18)',
                      border: '1px solid #10B981',
                      color: '#6EE7B7',
                      fontSize: '10px',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    +{simResult.profitPercentage}% PROFIT
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Horizon: {simResult.maxHorizon} Years • {simResult.itemSummaries?.length} Schemes Combined
                </span>
              </div>

              {/* 4 SUMMARY STAT CARDS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>TOTAL INVESTMENT</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#60A5FA', marginTop: '2px' }}>
                    {fmtINR(simResult.totalInvested)}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>TOTAL PROFIT</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
                    +{fmtINR(simResult.totalProfit)}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>TOTAL RETURNS</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCD34D', marginTop: '2px' }}>
                    {fmtINR(simResult.totalReturns)}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>PROFIT %</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#A78BFA', marginTop: '2px' }}>
                    +{simResult.profitPercentage}%
                  </div>
                </div>
              </div>

              {/* DUAL-COLOR BREAKDOWN BAR (INVESTED VS RETURNS BREAKDOWN) */}
              <div
                style={{
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#CBD5E1' }}>
                    PORTFOLIO BREAKDOWN: INVESTED PRINCIPAL VS PROFIT RETURNS
                  </span>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
                    <span style={{ color: '#60A5FA', fontWeight: 800 }}>
                      ● Principal: {simResult.investedBarPct}% ({fmtINR(simResult.totalInvested)})
                    </span>
                    <span style={{ color: '#34D399', fontWeight: 800 }}>
                      ● Profit: {simResult.returnsBarPct}% (+{fmtINR(simResult.totalProfit)})
                    </span>
                  </div>
                </div>

                {/* The dual-color bar */}
                <div
                  style={{
                    height: '24px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    background: '#1E293B',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    style={{
                      width: `${simResult.investedBarPct}%`,
                      background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 6px',
                      transition: 'width 0.5s ease',
                    }}
                    title={`Invested Principal: ${fmtINR(simResult.totalInvested)} (${simResult.investedBarPct}%)`}
                  >
                    {simResult.investedBarPct}% Principal
                  </div>
                  <div
                    style={{
                      width: `${simResult.returnsBarPct}%`,
                      background: 'linear-gradient(90deg, #10B981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 6px',
                      transition: 'width 0.5s ease',
                    }}
                    title={`Profit Gained: +${fmtINR(simResult.totalProfit)} (${simResult.returnsBarPct}%)`}
                  >
                    +{simResult.returnsBarPct}% Profit
                  </div>
                </div>
              </div>

              {/* GAP PERIODS ANALYSIS & STRATEGY DETAILS */}
              <div
                style={{
                  background:
                    simResult.gapPeriods && simResult.gapPeriods.length > 0
                      ? 'rgba(245,158,11,0.06)'
                      : 'rgba(30,41,59,0.5)',
                  border:
                    simResult.gapPeriods && simResult.gapPeriods.length > 0
                      ? '1px solid rgba(245,158,11,0.25)'
                      : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>🕒</span>
                  <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#FDE68A' }}>
                    MATURITY GAP PERIODS & REINVESTMENT ANALYSIS
                  </span>
                </div>

                {simResult.gapPeriods && simResult.gapPeriods.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {simResult.gapPeriods.map((gap, idx) => (
                      <div
                        key={gap.id || idx}
                        style={{
                          background: 'rgba(30,41,59,0.85)',
                          borderRadius: '7px',
                          padding: '8px 12px',
                          borderLeft: '3px solid #F59E0B',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '4px',
                            marginBottom: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{gap.emoji}</span>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFFFFF' }}>
                              {gap.name} (Matures in {gap.maturesAt} Years)
                            </span>
                          </div>
                          <span
                            style={{
                              background: 'rgba(245,158,11,0.2)',
                              color: '#FCD34D',
                              border: '1px solid #F59E0B',
                              fontSize: '9.5px',
                              fontWeight: 900,
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            🕒 {gap.gapYears}-Year Gap Period Available
                          </span>
                        </div>
                        <p style={{ fontSize: '10.5px', color: '#CBD5E1', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                          {gap.analysisText}
                        </p>
                        <div
                          style={{
                            fontSize: '10px',
                            color: '#93C5FD',
                            background: 'rgba(59,130,246,0.1)',
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: '1px dashed rgba(59,130,246,0.3)',
                          }}
                        >
                          💡 <strong>How to utilize this gap:</strong> {gap.smartTip}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    ✅ All {simResult.itemSummaries?.length} investments have synchronized tenures (
                    {simResult.maxHorizon} Years) and mature together with no intermediate gaps.
                  </div>
                )}
              </div>

              {/* INDIVIDUAL ASSETS SUMMARY TABLE */}
              <div
                style={{
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  overflowX: 'auto',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', marginBottom: '6px' }}>
                  SCHEME-BY-SCHEME CONTRIBUTION BREAKDOWN
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                  <thead>
                    <tr style={{ color: '#64748B', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Scheme</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Monthly</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Rate</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Tenure</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Invested</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Profit</th>
                      <th style={{ textAlign: 'right', padding: '4px' }}>Maturity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simResult.itemSummaries?.map((it, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          color: '#E2E8F0',
                        }}
                      >
                        <td style={{ padding: '6px 4px', fontWeight: 800 }}>
                          {it.emoji} {it.name}
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 4px' }}>₹{it.monthly?.toLocaleString('en-IN')}</td>
                        <td style={{ textAlign: 'right', padding: '6px 4px' }}>{it.rate}%</td>
                        <td style={{ textAlign: 'right', padding: '6px 4px' }}>{it.years}y</td>
                        <td style={{ textAlign: 'right', padding: '6px 4px', color: '#60A5FA' }}>
                          {fmtINR(it.invested)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 4px', color: '#34D399' }}>
                          +{fmtINR(it.profit)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 4px', color: '#FCD34D', fontWeight: 900 }}>
                          {fmtINR(it.returns)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: SAVED SIMULATIONS LIST */}
      {subView === 'saved' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 900, margin: '0 0 2px 0', color: '#FFFFFF' }}>
                📁 Saved Portfolio Simulations ({allSavedPortfolios.length})
              </h3>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Inspect past simulations in read-only mode, edit details, or remove records.
              </div>
            </div>
            <button
              onClick={() => setSubView('simulator')}
              style={{
                background: 'rgba(30,41,59,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#E2E8F0',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ← Back to Simulator
            </button>
          </div>

          {allSavedPortfolios.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#94A3B8',
                background: 'rgba(15,23,42,0.6)',
                border: '1px dashed rgba(255,255,255,0.12)',
                borderRadius: '10px',
              }}
            >
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>📂</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#E2E8F0' }}>No Saved Simulations Yet</div>
              <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '340px', margin: '4px auto 14px auto' }}>
                Run a simulation in the workspace and click &quot;Save Simulation&quot; to keep it here for reference (0 XP).
              </div>
              <button
                onClick={() => setSubView('simulator')}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #9333EA)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '7px 16px',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Go to Simulator Workspace
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {allSavedPortfolios.map((sim) => (
                <div
                  key={sim.id}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#FFFFFF' }}>{sim.name}</div>
                    <span style={{ fontSize: '9.5px', color: '#64748B' }}>{sim.date}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {sim.selectedRows?.map((r, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(30,41,59,0.9)',
                          color: '#CBD5E1',
                          fontSize: '9px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {r.emoji || '💳'} {r.customName || r.defaultName || r.typeKey}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      background: 'rgba(30,41,59,0.5)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '10.5px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#94A3B8' }}>Invested: </span>
                      <strong style={{ color: '#60A5FA' }}>{fmtINR(sim.totalInvested)}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Maturity: </span>
                      <strong style={{ color: '#34D399' }}>{fmtINR(sim.totalReturns)}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button
                      onClick={() => setViewingSavedSim(sim)}
                      style={{
                        flex: 1,
                        background: 'rgba(59,130,246,0.18)',
                        border: '1px solid rgba(59,130,246,0.4)',
                        color: '#93C5FD',
                        borderRadius: '6px',
                        padding: '6px 0',
                        fontSize: '10.5px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      👁️ View Details
                    </button>
                    <button
                      onClick={() => handleEditSavedSim(sim)}
                      style={{
                        flex: 1,
                        background: 'rgba(245,158,11,0.18)',
                        border: '1px solid rgba(245,158,11,0.4)',
                        color: '#FDE68A',
                        borderRadius: '6px',
                        padding: '6px 0',
                        fontSize: '10.5px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmTarget(sim)}
                      style={{
                        background: 'rgba(239,68,68,0.18)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        color: '#F87171',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '10.5px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                      title="Delete simulation"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 1: SAVE SIMULATION (OPTIONAL • 0 XP)                              */}
      {/* ---------------------------------------------------------------------- */}
      {saveModalOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '440px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💾</span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFF' }}>
                  {editingSimId ? 'Save as "Edit changes"' : 'Save Portfolio Simulation'}
                </span>
              </div>
              <button
                onClick={() => setSaveModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '10.5px',
                color: '#93C5FD',
              }}
            >
              ℹ️ Saving simulations is completely optional and awards 0 XP. It is saved in your Saved Simulations
              manager.
            </div>

            {/* Main Portfolio Name */}
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                Portfolio Simulation Name:
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g. Portfolio simulation 1"
                style={{
                  background: '#1E293B',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFF',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Inside Scheme Names Review */}
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                Names for Investment Options Inside:
              </label>
              <div
                style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {namedRows.map((r) => (
                  <div
                    key={r.rowId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(30,41,59,0.7)',
                      padding: '5px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{r.emoji}</span>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8', minWidth: '45px' }}>{r.typeKey}:</span>
                    <input
                      type="text"
                      value={rowNamesToSave[r.rowId] || ''}
                      onChange={(e) =>
                        setRowNamesToSave((prev) => ({
                          ...prev,
                          [r.rowId]: e.target.value,
                        }))
                      }
                      placeholder={r.defaultName}
                      style={{
                        background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFF',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        flex: 1,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => setSaveModalOpen(false)}
                style={{
                  background: 'rgba(30,41,59,0.8)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 18px',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                {editingSimId ? 'Save as "Edit changes"' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 2: READ-ONLY SAVED SIMULATION DETAILS                           */}
      {/* ---------------------------------------------------------------------- */}
      {viewingSavedSim && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90%',
              overflowY: 'auto',
              padding: '18px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#FFF' }}>
                    {viewingSavedSim.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                    Saved on {viewingSavedSim.date} • Read-Only View (Values cannot be edited here)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingSavedSim(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Read-only Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'rgba(30,41,59,0.7)',
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>TOTAL INVESTED</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#60A5FA' }}>
                  {fmtINR(viewingSavedSim.totalInvested)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>TOTAL PROFIT</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#34D399' }}>
                  +{fmtINR(viewingSavedSim.totalProfit)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>TOTAL MATURITY</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#FCD34D' }}>
                  {fmtINR(viewingSavedSim.totalReturns)}
                </div>
              </div>
            </div>

            {/* Breakdown Bar (Read-Only) */}
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>
                Breakdown: Principal ({viewingSavedSim.investedBarPct}%) vs Profit ({viewingSavedSim.returnsBarPct}%)
              </div>
              <div
                style={{
                  height: '20px',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  display: 'flex',
                  background: '#1E293B',
                }}
              >
                <div
                  style={{
                    width: `${viewingSavedSim.investedBarPct}%`,
                    background: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9.5px',
                    color: '#FFF',
                    fontWeight: 900,
                  }}
                >
                  Principal
                </div>
                <div
                  style={{
                    width: `${viewingSavedSim.returnsBarPct}%`,
                    background: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9.5px',
                    color: '#FFF',
                    fontWeight: 900,
                  }}
                >
                  Profit
                </div>
              </div>
            </div>

            {/* Gap Periods Info */}
            {viewingSavedSim.gapPeriods && viewingSavedSim.gapPeriods.length > 0 && (
              <div
                style={{
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: '7px',
                  padding: '8px 10px',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#FDE68A', marginBottom: '4px' }}>
                  🕒 Gap Period Strategy:
                </div>
                {viewingSavedSim.gapPeriods.map((g, idx) => (
                  <div key={idx} style={{ fontSize: '10px', color: '#E2E8F0', marginBottom: '3px' }}>
                    • <strong>{g.name}</strong> matures at Year {g.maturesAt} ({g.gapYears}-year gap available).{' '}
                    <span style={{ color: '#93C5FD' }}>{g.smartTip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Read-Only Items List */}
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>
                Simulated Schemes ({viewingSavedSim.selectedRows?.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {viewingSavedSim.selectedRows?.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                    }}
                  >
                    <span>
                      {r.emoji || '💳'} <strong>{r.customName || r.defaultName || r.typeKey}</strong>
                    </span>
                    <span style={{ color: '#94A3B8' }}>
                      ₹{r.monthly?.toLocaleString('en-IN')}/mo • {r.rate}% p.a. • {r.years} yrs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => setViewingSavedSim(null)}
                style={{
                  background: 'rgba(30,41,59,0.85)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Close View
              </button>
              <button
                onClick={() => handleEditSavedSim(viewingSavedSim)}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 16px',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ✏️ Edit This Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 3: DELETE VERIFICATION MODAL                                     */}
      {/* ---------------------------------------------------------------------- */}
      {deleteConfirmTarget && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '380px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
            }}
          >
            <div style={{ fontSize: '32px' }}>⚠️</div>
            <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFF' }}>
              Delete Portfolio Simulation?
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: 0, lineHeight: 1.45 }}>
              Are you sure you want to delete <strong style={{ color: '#F87171' }}>&quot;{deleteConfirmTarget.name}&quot;</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '6px' }}>
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                style={{
                  background: 'rgba(30,41,59,0.85)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 16px',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Yes, Delete Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { Computer3PortfolioSimulatorScreen as Computer3PortfolioSimScreen }
