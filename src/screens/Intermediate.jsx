import { useState, useEffect } from 'react'
import {
  modules,
  advRates,
  PORTFOLIO_OPTIONS_CATALOG,
  fmtINR,
  calcSchemeFV,
  getNamedPortfolioRows,
  computeSmartMonthlyAllocations,
  calculatePortfolioSimulation,
} from '../data.js'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'
import MessageScamAnalyzer from '../components/MessageScamAnalyzer.jsx'

const fmt = fmtINR

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

export default function Intermediate({
  go,
  goBack,
  canGoBack,
  state,
  update,
  addXP,
  aiGuideAvatar = 'female',
  aiGuideName,
  openAvatarModal,
  savedPortfolioSimulations = [],
  onSavePortfolio,
  onUpdateSavedPortfolio,
  onDeleteSavedPortfolio,
  themeMode = 'dark'
}) {

  const isLight = themeMode === 'light'

  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const modulesDone = state.completedModules || []
  const [activeTab, setActiveTab] = useState('simulators')

  // ─── NEW LEVEL 2 PORTFOLIO SIMULATOR STATE ───
  const [portfolioSubView, setPortfolioSubView] = useState('simulator') // 'simulator' | 'saved'
  const [portfolioRows, setPortfolioRows] = useState([
    { id: 'row_init_1', typeKey: 'FD', customName: '', monthly: 5000, rate: 7.25, years: 5, emoji: '💳', color: '#3b82f6' },
    { id: 'row_init_2', typeKey: 'RD', customName: '', monthly: 3000, rate: 6.5, years: 7, emoji: '📅', color: '#8b5cf6' },
  ])
  const [allocationMode, setAllocationMode] = useState('manual') // 'manual' | 'smart'
  const [smartTotalMonthly, setSmartTotalMonthly] = useState(8000)
  const [customPortfolioName, setCustomPortfolioName] = useState('')
  const [hasRunSim, setHasRunSim] = useState(false)
  const [manualBaselineProfit, setManualBaselineProfit] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveModalPortName, setSaveModalPortName] = useState('')
  const [saveModalItemNames, setSaveModalItemNames] = useState({})
  const [portfolioToast, setPortfolioToast] = useState('')
  const [portfolioError, setPortfolioError] = useState('')

  // In-window Saved Portfolio Simulations State (Read-Only / Edit / Delete)
  const [selectedSavedPort, setSelectedSavedPort] = useState(null)
  const [isEditingSavedPort, setIsEditingSavedPort] = useState(false)
  const [editPortDraft, setEditPortDraft] = useState({ name: '', allocationMode: 'manual', totalMonthlyBudget: 10000, items: [] })
  const [deletePortConfirm, setDeletePortConfirm] = useState(null)

  const defaultPortfolioName = `Portfolio simulation ${(savedPortfolioSimulations?.length || 0) + 1}`
  const effectivePortfolioName = customPortfolioName.trim() !== '' ? customPortfolioName.trim() : defaultPortfolioName

  // Live computed portfolio simulation (for current rows & allocationMode)
  const namedPortfolioRows = getNamedPortfolioRows(portfolioRows)
  const currentPortfolioCalc = calculatePortfolioSimulation(
    namedPortfolioRows,
    allocationMode,
    allocationMode === 'smart' ? smartTotalMonthly : null
  )

  // Add an investment option from the horizontal top bar (+ button)
  const handleAddInvestmentOption = (opt) => {
    setPortfolioError('')
    const newRow = {
      id: `row_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      typeKey: opt.typeKey,
      customName: '',
      monthly: opt.defaultMonthly || 3000,
      rate: opt.defaultRate,
      years: opt.defaultYears,
      emoji: opt.emoji,
      color: opt.color,
    }
    const nextRows = [...portfolioRows, newRow]
    setPortfolioRows(nextRows)
    if (allocationMode === 'smart') {
      // Keep smartTotalMonthly or add default if it was 0
      if (!smartTotalMonthly || smartTotalMonthly <= 0) {
        setSmartTotalMonthly(nextRows.reduce((s, r) => s + (Number(r.monthly) || 0), 0))
      }
    }
  }

  // Remove a row
  const handleRemoveInvestmentRow = (rowId) => {
    setPortfolioError('')
    const nextRows = portfolioRows.filter(r => r.id !== rowId)
    setPortfolioRows(nextRows)
    if (nextRows.length < 2) {
      setHasRunSim(false)
    }
  }

  // Update a field in a row
  const handleUpdateRowField = (rowId, field, value) => {
    setPortfolioError('')
    setPortfolioRows(prev =>
      prev.map(r => {
        if (r.id !== rowId) return r
        if (field === 'customName') {
          return { ...r, customName: value }
        }
        return { ...r, [field]: value }
      })
    )
  }

  // Switch to Manual Allocation
  const handleSwitchToManual = () => {
    setAllocationMode('manual')
  }

  // Switch to Smart Allocation (combines all monthly allocations and divides them optimally for max profit)
  const handleSwitchToSmart = (fromPostSimulation = false) => {
    const combinedMonthly = portfolioRows.reduce((s, r) => s + Math.max(0, Math.round(Number(r.monthly) || 0)), 0) || 10000
    if (fromPostSimulation && allocationMode === 'manual') {
      const manualCalc = calculatePortfolioSimulation(portfolioRows, 'manual', null)
      setManualBaselineProfit(manualCalc.totalProfit)
    }
    const totalToUse = allocationMode === 'smart' ? (Number(smartTotalMonthly) || combinedMonthly) : combinedMonthly
    setSmartTotalMonthly(totalToUse)
    setAllocationMode('smart')
    if (fromPostSimulation) {
      setHasRunSim(true)
      setPortfolioToast(`🧠 Smart Allocation applied! Combined ₹${totalToUse.toLocaleString('en-IN')}/mo divided across your selected investments for maximum overall profit.`)
      setTimeout(() => setPortfolioToast(''), 4500)
    }
  }

  // Run Portfolio Simulation
  const handleRunPortfolioSimulator = () => {
    setPortfolioError('')
    if (portfolioRows.length < 2) {
      setPortfolioError('Please select at least 2 investment options using the + buttons above to run a Portfolio Simulation.')
      return
    }
    if (allocationMode === 'manual') {
      const manualCalc = calculatePortfolioSimulation(portfolioRows, 'manual', null)
      setManualBaselineProfit(manualCalc.totalProfit)
    }
    setHasRunSim(true)

    // Complete Level 2 Section 3 ('portfolio') on first simulation run
    const currentCompleted = state.completedModules || []
    if (!currentCompleted.includes('portfolio')) {
      if (addXP) addXP(100)
      const nextCompleted = [...currentCompleted, 'portfolio']
      const allSims = modules.every(m => nextCompleted.includes(m.id))
      const allThreeDone = allSims && nextCompleted.includes('mixer') && nextCompleted.includes('portfolio')
      update({
        completedModules: nextCompleted,
        ...(allThreeDone ? { advancedUnlocked: true, level2Completed: true } : {}),
      })
    }
  }

  // Open Save Portfolio Simulation Modal (Saving is optional and gives 0 XP)
  const handleOpenSavePortfolioModal = () => {
    if (portfolioRows.length < 2) {
      setPortfolioError('Please select at least 2 investment options before saving.')
      return
    }
    setSaveModalPortName(effectivePortfolioName)
    const itemMap = {}
    currentPortfolioCalc.itemSummaries.forEach(it => {
      itemMap[it.id] = it.name
    })
    setSaveModalItemNames(itemMap)
    setShowSaveModal(true)
  }

  // Confirm Save Portfolio Simulation (0 XP awarded)
  const handleConfirmSavePortfolio = () => {
    const finalPortName = (saveModalPortName || '').trim() || defaultPortfolioName
    const updatedRows = namedPortfolioRows.map(r => {
      const editedItemName = (saveModalItemNames[r.id] || '').trim()
      const nextCustom = editedItemName && editedItemName !== r.defaultName ? editedItemName : r.customName
      return {
        ...r,
        customName: nextCustom,
      }
    })
    setPortfolioRows(updatedRows)

    const finalCalc = calculatePortfolioSimulation(
      updatedRows,
      allocationMode,
      allocationMode === 'smart' ? smartTotalMonthly : null
    )

    const newSavedPortfolio = {
      id: `port_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: finalPortName,
      allocationMode,
      totalMonthlyBudget: finalCalc.totalMonthly,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      date: new Date().toLocaleDateString('en-IN'),
      items: finalCalc.itemSummaries,
      results: finalCalc,
    }

    if (onSavePortfolio) {
      onSavePortfolio(newSavedPortfolio)
    }

    setShowSaveModal(false)
    setCustomPortfolioName('')
    setPortfolioToast(`✅ "${finalPortName}" saved to Portfolio Simulations! (Optional • 0 XP awarded)`)
    setTimeout(() => setPortfolioToast(''), 4500)
  }

  // Saved Portfolio Simulations Handlers inside Portfolio Simulator Window
  const handleOpenSavedPortInWindow = (sim, startEditing = false) => {
    const rawItems = sim.items || sim.results?.itemSummaries || []
    const named = getNamedPortfolioRows(rawItems)
    setSelectedSavedPort(sim)
    setIsEditingSavedPort(startEditing)
    setEditPortDraft({
      name: sim.name,
      allocationMode: sim.allocationMode || 'manual',
      totalMonthlyBudget:
        sim.totalMonthlyBudget ||
        named.reduce((s, it) => s + (Number(it.monthly) || 0), 0) ||
        10000,
      items: JSON.parse(JSON.stringify(named)),
    })
  }

  const handleSaveEditedPortInWindow = () => {
    if (!selectedSavedPort) return
    const items = editPortDraft.items || []
    if (items.length < 2) {
      alert('A portfolio simulation requires at least 2 investment options.')
      return
    }
    const mode = editPortDraft.allocationMode || 'manual'
    const budget =
      mode === 'smart'
        ? Number(editPortDraft.totalMonthlyBudget) ||
          items.reduce((s, it) => s + (Number(it.monthly) || 0), 0)
        : null
    const recalc = calculatePortfolioSimulation(items, mode, budget)
    const updated = {
      ...selectedSavedPort,
      name: (editPortDraft.name || '').trim() || selectedSavedPort.name,
      allocationMode: mode,
      totalMonthlyBudget: recalc.totalMonthly,
      items: recalc.itemSummaries,
      results: recalc,
    }
    if (onUpdateSavedPortfolio) {
      onUpdateSavedPortfolio(updated)
    }
    setSelectedSavedPort(updated)
    setIsEditingSavedPort(false)
    setPortfolioToast(`✅ Saved changes to "${updated.name}"! (0 XP)`)
    setTimeout(() => setPortfolioToast(''), 4000)
  }

  const handleConfirmDeleteSavedPortInWindow = () => {
    if (!deletePortConfirm) return
    if (onDeleteSavedPortfolio) {
      onDeleteSavedPortfolio(deletePortConfirm.id)
    }
    if (selectedSavedPort?.id === deletePortConfirm.id) {
      setSelectedSavedPort(null)
      setIsEditingSavedPort(false)
    }
    setDeletePortConfirm(null)
  }

  // Mixer State Variables
  const [alloc, setAlloc] = useState({
    PPF: 25, FD: 25, NSC: 20, SSY: 10, RD: 10, MIS: 10
  })
  const [customRates, setCustomRates] = useState({
    PPF: 7.1, FD: 7.25, NSC: 7.7, SSY: 8.2, RD: 6.5, MIS: 7.4
  })
  const [monthlySavings, setMonthlySavings] = useState(5000)
  const [years, setYears] = useState(5)

  // Risk vs. Reward Safety Matrix State Variables
  const [matrixSelected, setMatrixSelected] = useState(['PPF', 'FD', 'NSC', 'GOLD'])
  const [matrixAmount, setMatrixAmount] = useState(5000)
  const [matrixYears, setMatrixYears] = useState(5)
  const [matrixInflation, setMatrixInflation] = useState(6.0)
  const [matrixFactorChoice, setMatrixFactorChoice] = useState(null)

  const toggleMatrixScheme = (k) => {
    if (matrixSelected.includes(k)) {
      if (matrixSelected.length <= 2) return
      setMatrixSelected(prev => prev.filter(s => s !== k))
    } else {
      if (matrixSelected.length >= 4) return
      setMatrixSelected(prev => [...prev, k])
    }
  }

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
  const portfolioDone = modulesDone.includes('portfolio')
  const allDone = Boolean(state.level2Completed || (simulationsDone && mixerDone && portfolioDone))
  const sectionsDoneCount = (simulationsDone ? 1 : 0) + (mixerDone ? 1 : 0) + (portfolioDone ? 1 : 0)

  useEffect(() => {
    if (simulationsDone && mixerDone && portfolioDone && (!state.advancedUnlocked || !state.level2Completed)) {
      if (!state.level2Completed && addXP) addXP(200)
      update({ advancedUnlocked: true, level2Completed: true })
    }
  }, [simulationsDone, mixerDone, portfolioDone, state.advancedUnlocked, state.level2Completed])
  
  const completedCount = modules.filter(m => modulesDone.includes(m.id)).length + (mixerDone ? 1 : 0) + (portfolioDone ? 1 : 0)
  const progressPct = allDone ? 100 : Math.min(100, Math.round((completedCount / 8) * 100))

  const colors = {
    PPF: '#f59e0b', FD: '#d97706', NSC: '#fbbf24',
    SSY: '#eab308', RD: '#10b981', MIS: '#0284c7'
  }

  // Growth Projector Calculations
  const yieldRate = 7.1

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
      const nextCompleted = [...modulesDone, 'mixer']
      const allSims = modules.every(m => nextCompleted.includes(m.id))
      const allThreeDone = allSims && nextCompleted.includes('portfolio')
      if (addXP) addXP(50)
      update({
        completedModules: nextCompleted,
        ...(allThreeDone ? { advancedUnlocked: true, level2Completed: true } : {}),
      })
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
          onClick={goBack || (() => go('level-map'))}
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
          <span>⬅ Back</span>
        </button>
      </div>

      {/* Level 2 Overall Status & 3-Section Tracker */}
      <div className="glass-card-sm anim-fade" style={{
        padding: '16px 22px',
        marginBottom: 18,
        borderRadius: 18,
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
        border: `2px solid ${allDone ? '#10b981' : '#f59e0b'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
              LEVEL 2: INVESTMENT LAB
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 999,
              background: allDone ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
              border: `1.5px solid ${allDone ? '#10b981' : '#f59e0b'}`,
              color: allDone ? '#10b981' : '#fbbf24',
            }}>
              Status: {allDone ? 'Completed ✓' : `In Progress (${sectionsDoneCount}/3 Sections)`}
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: isLight ? '#475569' : '#d1d5db' }}>
            {allDone
              ? '🎉 All 3 sections of Level 2 are completed! Level 3 (Portfolio Tower) is now unlocked!'
              : 'Complete all 3 sections below (Simulator Modules, Savings Mixer, and Portfolio Simulator) to unlock Level 3.'}
          </div>
        </div>
        {allDone && (
          <button
            onClick={() => go('advanced')}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
            }}
          >
            🏢 OPEN LEVEL 3 →
          </button>
        )}
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
            border: simulationsDone ? '2.5px solid #10b981' : (isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'),
            boxShadow: activeTab === 'simulators'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          🧪 1. SIMULATOR MODULES {simulationsDone ? '✅' : `(${modules.filter(m => modulesDone.includes(m.id)).length}/6)`}
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
            border: mixerDone ? '2.5px solid #10b981' : (isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'),
            boxShadow: activeTab === 'mixer'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          💼 2. SAVINGS MIXER {mixerDone ? '✅' : '🌟'}
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            flex: '1 1 200px',
            fontSize: 14,
            fontWeight: 900,
            padding: '14px 20px',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'portfolio'
              ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
              : (isLight ? '#ffedd5' : '#1e1b18'),
            color: activeTab === 'portfolio' ? '#ffffff' : (isLight ? '#9a3412' : '#fbbf24'),
            border: portfolioDone ? '2.5px solid #10b981' : (isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'),
            boxShadow: activeTab === 'portfolio'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          🏢 3. PORTFOLIO SIMULATOR {portfolioDone ? '✅' : '📊'}
        </button>
      </div>

      {activeTab === 'simulators' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header Card */}
          <div className="glass-card anim-fade" style={{ padding: '26px 30px', border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#080705',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 0 20px rgba(245,158,11,0.3)',
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
                <h1 className="font-display" style={{ fontSize: 32, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 2 }}>
                  INVESTMENT LAB
                </h1>
                <p style={{ fontSize: 13, color: isLight ? '#475569' : '#d1d5db', fontWeight: 600, margin: 0 }}>
                  Explore all investment simulators & build real financial models!
                </p>
              </div>
            </div>

            {/* Modules Progress Bar */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 6 }}>
                <span>MODULES: {modules.filter(m => modulesDone.includes(m.id)).length}/6 COMPLETED</span>
                <span>{Math.round((modules.filter(m => modulesDone.includes(m.id)).length / 6) * 100)}%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${(modules.filter(m => modulesDone.includes(m.id)).length / 6) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>

          {/* 6 Simulator Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {modules.map((mod) => {
              const done = modulesDone.includes(mod.id)
              return (
                <div
                  key={mod.id}
                  className="glass-card-deep anim-fade"
                  style={{
                    position: 'relative',
                    padding: '24px',
                    borderRadius: 20,
                    background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                    border: done
                      ? '2.5px solid #10b981'
                      : (isLight ? '2.5px solid #000000' : '2.5px solid #ffffff'),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="sticker-badge sticker-yellow" style={{
                    position: 'absolute', top: 14, right: 14, fontSize: 9, padding: '2px 8px',
                    background: done ? 'rgba(16, 185, 129, 0.15)' : undefined,
                    color: done ? '#10b981' : undefined,
                    borderColor: done ? '#10b981' : undefined,
                  }}>
                    {done ? '✓ DONE' : '▶ OPEN'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, marginTop: 8 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 16,
                        background: `var(--gold-bg, rgba(245, 158, 11, 0.12))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, border: `1.5px solid ${mod.color || '#d97706'}`,
                      }}>
                        {mod.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 16 }}>{mod.name}</div>
                        <div style={{ fontSize: 11, color: isLight ? '#ea580c' : '#fbbf24', fontWeight: 800 }}>{mod.rate}</div>
                      </div>
                    </div>

                    <p style={{ fontSize: 12, color: isLight ? '#475569' : '#d1d5db', fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
                      {mod.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleModule(mod)}
                    className={done ? 'btn-outline' : 'btn-primary'}
                    style={{
                      width: '100%', padding: 12, fontSize: 13, fontWeight: 900, marginTop: 'auto',
                      border: isLight ? '2px solid #000000' : '2px solid #ffffff'
                    }}
                  >
                    {done ? '🔄 REVISIT' : '▶ OPEN SIMULATOR'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'mixer' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
                    {/* 🛡️ Risk vs. Reward Safety Matrix Card */}
          <div className="glass-card-deep" style={{ padding: '32px', borderRadius: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff', color: isLight ? '#0f172a' : '#fef3c7' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10, display: 'inline-block', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: '#10b981' }}>
                🛡️ SIDE-BY-SIDE SCHEME EVALUATOR
              </div>
              <h2 className="font-display" style={{ fontSize: 30, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 4 }}>
                🛡️ Risk vs. Reward Safety Matrix
              </h2>
              <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 13, fontWeight: 600, margin: 0 }}>
                Compare investment schemes beyond just the return percentage. Evaluate Risk, Lock-in, Tax Benefits, and Real Yield side-by-side!
              </p>
            </div>

            {/* Controls Header: Select Schemes & Adjust Assumptions */}
            <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 20, border: isLight ? '2px solid #000000' : '2px solid #ffffff', marginBottom: 24 }}>
              {/* Scheme Picker Checkboxes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>SELECT SCHEMES TO COMPARE (2 TO 4 SCHEMES):</span>
                  <span style={{ fontSize: 11, color: isLight ? '#475569' : '#9ca3af', fontWeight: 700 }}>{matrixSelected.length}/4 Selected</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {[
                    { key: 'PPF', label: 'PPF (7.1% EEE)', emoji: '🏛️', color: '#f59e0b' },
                    { key: 'FD', label: 'Fixed Deposit (7.25%)', emoji: '🏦', color: '#d97706' },
                    { key: 'NSC', label: 'NSC (7.7% Sec 80C)', emoji: '📜', color: '#fbbf24' },
                    { key: 'GOLD', label: 'Sovereign Gold (9.5%)', emoji: '🪙', color: '#eab308' },
                    { key: 'SSY', label: 'Sukanya Samriddhi (8.2%)', emoji: '👧', color: '#ec4899' },
                    { key: 'RD', label: 'Recurring Deposit (6.5%)', emoji: '🔄', color: '#10b981' }
                  ].map(s => {
                    const isChecked = matrixSelected.includes(s.key)
                    return (
                      <button
                        key={s.key}
                        onClick={() => { toggleMatrixScheme(s.key); trackMixerInteraction() }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 900,
                          border: isChecked ? `2px solid ${s.color}` : (isLight ? '2px solid #cbd5e1' : '2px solid rgba(255,255,255,0.15)'),
                          background: isChecked ? (isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.03)'),
                          color: isChecked ? (isLight ? '#7c2d12' : '#fbbf24') : (isLight ? '#64748b' : '#9ca3af'),
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <span>{isChecked ? '☑' : '☐'}</span>
                        <span>{s.emoji} {s.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Assumption Sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                    <span>Monthly Investment</span>
                    <span style={{ color: isLight ? '#ea580c' : '#fbbf24', fontWeight: 900 }}>₹{matrixAmount.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input
                    type="range" min="1000" max="50000" step="1000" value={matrixAmount}
                    onChange={e => { setMatrixAmount(Number(e.target.value)); trackMixerInteraction() }}
                    style={{ width: '100%', accentColor: '#f59e0b', height: 6, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                    <span>Investment Period</span>
                    <span style={{ color: isLight ? '#ea580c' : '#fbbf24', fontWeight: 900 }}>{matrixYears} Years</span>
                  </div>
                  <input
                    type="range" min="1" max="15" step="1" value={matrixYears}
                    onChange={e => { setMatrixYears(Number(e.target.value)); trackMixerInteraction() }}
                    style={{ width: '100%', accentColor: '#f59e0b', height: 6, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                    <span>Assumed Inflation Rate</span>
                    <span style={{ color: '#ef4444', fontWeight: 900 }}>{matrixInflation}% p.a.</span>
                  </div>
                  <input
                    type="range" min="3" max="10" step="0.5" value={matrixInflation}
                    onChange={e => { setMatrixInflation(Number(e.target.value)); trackMixerInteraction() }}
                    style={{ width: '100%', accentColor: '#ef4444', height: 6, cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Brief Educational Note on Nominal vs Real Return */}
            <div style={{
              background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.12)',
              border: isLight ? '2px solid #000000' : '2px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 14, padding: '12px 16px', marginBottom: 20, fontSize: 12,
              color: isLight ? '#7c2d12' : '#fef3c7', fontWeight: 700
            }}>
              💡 <strong>Educational Note:</strong> <em>Nominal return</em> shows total growth before considering inflation. <em>Inflation-adjusted return</em> estimates real purchasing-power growth after accounting for a <strong>{matrixInflation}% p.a.</strong> price rise.
            </div>

            {/* Comparison Matrix Table */}
            {(() => {
              const MATRIX_DB = {
                PPF: { key: 'PPF', name: 'PPF', fullName: 'Public Provident Fund', emoji: '🏛️', rate: advRates.PPF || 7.1, risk: 'Low (Govt)', riskBadge: '🟢 Low', lockin: '15 Years', lockinBadge: '🔒 15 Yrs', tax: 'EEE (100% Tax Free)', taxBadge: '🍀 EEE Tax-Free', liquidity: 'Low (Partial after 7 Yrs)', liquidityBadge: '💧 Low' },
                FD: { key: 'FD', name: 'FD', fullName: 'Fixed Deposit', emoji: '🏦', rate: advRates.FD || 7.25, risk: 'Low/Med (Bank Insured)', riskBadge: '🟢 Low', lockin: '7 Days – 10 Yrs', lockinBadge: '🔒 Flexible', tax: 'Taxable as per Income Slab', taxBadge: '💸 Taxable', liquidity: 'Medium (Premature penalty)', liquidityBadge: '💧 Medium' },
                NSC: { key: 'NSC', name: 'NSC', fullName: 'National Savings Cert.', emoji: '📜', rate: advRates.NSC || 7.7, risk: 'Low (Post Office)', riskBadge: '🟢 Low', lockin: '5 Years Fixed', lockinBadge: '🔒 5 Yrs', tax: 'Sec 80C Tax Deduction', taxBadge: '📝 Sec 80C', liquidity: 'Low (Locked till maturity)', liquidityBadge: '💧 Low' },
                GOLD: { key: 'GOLD', name: 'Gold', fullName: 'Sovereign / Digital Gold', emoji: '🪙', rate: 9.5, risk: 'Medium (Market Volatility)', riskBadge: '🟡 Moderate', lockin: '8 Years (SGB)', lockinBadge: '🔒 8 Yrs / Flex', tax: 'Capital Gains Tax', taxBadge: '📈 Capital Gains', liquidity: 'High (Traded on exchange)', liquidityBadge: '💧 High' },
                SSY: { key: 'SSY', name: 'SSY', fullName: 'Sukanya Samriddhi', emoji: '👧', rate: advRates.SSY || 8.2, risk: 'Low (Govt Backed)', riskBadge: '🟢 Low', lockin: '21 Years', lockinBadge: '🔒 21 Yrs', tax: 'EEE (100% Tax Free)', taxBadge: '🍀 EEE Tax-Free', liquidity: 'Low (Locked for girl child)', liquidityBadge: '💧 Low' },
                RD: { key: 'RD', name: 'RD', fullName: 'Recurring Deposit', emoji: '🔄', rate: advRates.RD || 6.5, risk: 'Low (Bank Deposit)', riskBadge: '🟢 Low', lockin: '1 – 5 Years', lockinBadge: '🔒 1–5 Yrs', tax: 'Taxable Interest', taxBadge: '💸 Taxable', liquidity: 'Medium (Monthly plan)', liquidityBadge: '💧 Medium' }
              }

              const activeSchemes = matrixSelected.map(k => MATRIX_DB[k]).filter(Boolean)
              const totalMonths = matrixYears * 12
              const totalInvested = matrixAmount * totalMonths

              return (
                <div>
                  <div style={{ background: isLight ? '#ffffff' : '#080705', padding: 20, borderRadius: 20, border: isLight ? '2px solid #000000' : '2px solid #ffffff', overflowX: 'auto', marginBottom: 24 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: isLight ? '2px solid #000000' : '2px solid rgba(255,255,255,0.2)', color: isLight ? '#0f172a' : '#fbbf24' }}>
                          <th style={{ padding: '12px 14px', fontSize: 13, fontWeight: 900 }}>COMPARISON METRIC</th>
                          {activeSchemes.map(s => (
                            <th key={s.key} style={{ padding: '12px 14px', fontSize: 14, fontWeight: 900, textAlign: 'center' }}>
                              <div>{s.emoji} {s.name}</div>
                              <div style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 700 }}>{s.fullName}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* 1. Risk / Safety Level */}
                        <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>🛡️ Risk / Safety Level</td>
                          {activeSchemes.map(s => (
                            <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: isLight ? '#334155' : '#cbd5e1' }}>
                              <span style={{ padding: '4px 10px', borderRadius: 8, background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {s.riskBadge}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* 2. Lock-in Period */}
                        <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>🔒 Lock-in Period</td>
                          {activeSchemes.map(s => (
                            <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: isLight ? '#334155' : '#cbd5e1' }}>
                              <div>{s.lockinBadge}</div>
                              <div style={{ fontSize: 10, color: isLight ? '#64748b' : '#9ca3af', marginTop: 2 }}>{s.lockin}</div>
                            </td>
                          ))}
                        </tr>

                        {/* 3. Tax Benefits */}
                        <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>🧾 Tax Treatment</td>
                          {activeSchemes.map(s => (
                            <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>
                              <span style={{ padding: '4px 8px', borderRadius: 8, background: s.tax.includes('EEE') ? 'rgba(16, 185, 129, 0.15)' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'), color: s.tax.includes('EEE') ? '#10b981' : (isLight ? '#334155' : '#cbd5e1') }}>
                                {s.taxBadge}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* 4. Liquidity */}
                        <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>💧 Liquidity</td>
                          {activeSchemes.map(s => (
                            <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: isLight ? '#334155' : '#cbd5e1' }}>
                              <div>{s.liquidityBadge}</div>
                            </td>
                          ))}
                        </tr>

                        {/* 5. Expected / Nominal Return */}
                        <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24' }}>📈 Nominal Return (% p.a.)</td>
                          {activeSchemes.map(s => {
                            const rMonthly = (s.rate / 100) / 12
                            const projNominal = Math.round(matrixAmount * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly) * (1 + rMonthly))
                            return (
                              <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24' }}>{s.rate}% p.a.</div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginTop: 2 }}>₹{projNominal.toLocaleString('en-IN')}</div>
                              </td>
                            )
                          })}
                        </tr>

                        {/* 6. Real Return (Inflation-Adjusted) */}
                        <tr>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: '#ef4444' }}>📉 Real Return (After {matrixInflation}% Inf)</td>
                          {activeSchemes.map(s => {
                            const rMonthly = (s.rate / 100) / 12
                            const projNominal = Math.round(matrixAmount * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly) * (1 + rMonthly))
                            const projReal = Math.round(projNominal / Math.pow(1 + matrixInflation / 100, matrixYears))
                            const realRate = (s.rate - matrixInflation).toFixed(2)
                            const isPos = Number(realRate) >= 0

                            return (
                              <td key={s.key} style={{ padding: '12px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: 14, fontWeight: 900, color: isPos ? '#10b981' : '#ef4444' }}>
                                  {isPos ? `+${realRate}%` : `${realRate}%`} p.a.
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#475569' : '#d1d5db', marginTop: 2 }}>
                                  Real Power: ₹{projReal.toLocaleString('en-IN')}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 💡 What You Should Notice (Dynamic Observations) */}
                  <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 18, border: isLight ? '2px solid #000000' : '2.5px solid #ffffff', marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginTop: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>💡</span>
                      <span>What Should You Notice?</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, fontWeight: 700, color: isLight ? '#334155' : '#d1d5db', lineHeight: 1.6 }}>
                      {matrixSelected.includes('PPF') && (
                        <div>• <strong>Long-term Lock-in vs Tax Exemption:</strong> PPF locks your funds for 15 years, but offers 100% tax-free growth (EEE), making it a powerful long-term compounder.</div>
                      )}
                      {matrixSelected.includes('FD') && (
                        <div>• <strong>Tax Impact on FD Returns:</strong> Fixed Deposit offers guaranteed bank security and flexible tenures, but interest earned is taxable under your income tax slab.</div>
                      )}
                      {matrixSelected.includes('GOLD') && (
                        <div>• <strong>Inflation Hedging vs Volatility:</strong> Sovereign/Digital Gold yields a higher return (~9.5%) and hedges against inflation, but carries short-term market price fluctuations.</div>
                      )}
                      <div>• <strong>Purchasing Power Erosion:</strong> At <strong>{matrixInflation}%</strong> assumed inflation, fixed-rate schemes with ~7% yield produce an effective real purchasing power gain of only <strong>~{(7.25 - matrixInflation).toFixed(2)}% p.a.</strong></div>
                    </div>
                  </div>

                  {/* 🎯 Learning Challenge (Interactive Trade-off Question) */}
                  <div style={{ background: isLight ? '#ffffff' : '#080705', padding: 20, borderRadius: 18, border: isLight ? '2px solid #000000' : '2px solid #ffffff' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginTop: 0, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🎯</span>
                      <span>Learning Challenge: Which factor matters most for your goal?</span>
                    </h3>
                    <p style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', fontWeight: 600, marginBottom: 14 }}>
                      Select a primary priority to explore its financial trade-offs:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
                      {[
                        { id: 'safety', label: '🛡️ Safety & Capital Protection', tradeOff: 'Focusing on Safety keeps your principal 100% risk-free, but may yield lower real growth when inflation spikes.' },
                        { id: 'liquidity', label: '💧 Instant Liquidity & Access', tradeOff: 'Prioritizing Liquidity ensures immediate cash for unexpected emergencies (FD/Liquid), but often comes with taxable interest or premature withdrawal penalties.' },
                        { id: 'growth', label: '📈 High Long-Term Wealth Growth', tradeOff: 'Targeting Growth (Gold/Equity) beats inflation over long horizons, but requires surviving short-term price fluctuations.' },
                        { id: 'tax', label: '🧾 Tax Exemption (EEE Status)', tradeOff: 'Maximizing Tax Benefits (PPF/SSY) keeps 100% of compound interest in your pocket, but requires committing to multi-year lock-in tenures.' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setMatrixFactorChoice(opt.id); trackMixerInteraction() }}
                          style={{
                            padding: '12px 14px', borderRadius: 12, fontSize: 12, fontWeight: 900, textAlign: 'left',
                            border: matrixFactorChoice === opt.id ? '2px solid #f59e0b' : (isLight ? '2px solid #cbd5e1' : '2px solid rgba(255,255,255,0.15)'),
                            background: matrixFactorChoice === opt.id ? (isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'),
                            color: matrixFactorChoice === opt.id ? (isLight ? '#7c2d12' : '#fbbf24') : (isLight ? '#334155' : '#d1d5db'),
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Trade-off Educational Feedback Box */}
                    {matrixFactorChoice && (() => {
                      const tradeOffs = {
                        safety: '🛡️ Capital Protection preserves your money from loss, but low-yield safe assets can lag behind high inflation.',
                        liquidity: '💧 High Liquidity guarantees instant emergency access, but flexible accounts often carry lower net yields.',
                        growth: '📈 High Growth protects real buying power against inflation, but requires patience through market ups and downs.',
                        tax: '🧾 Tax-Free EEE Status maximizes net returns, but requires committing to long-term lock-in timelines (15 yrs).'
                      }
                      return (
                        <div className="anim-fade" style={{ background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.12)', padding: 14, borderRadius: 12, border: '2px solid #f59e0b' }}>
                          <div style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#7c2d12' : '#fbbf24', marginBottom: 4 }}>
                            💡 EDUCATIONAL TRADE-OFF ANALYSIS:
                          </div>
                          <div style={{ fontSize: 12, color: isLight ? '#0f172a' : '#d1d5db', fontWeight: 700, lineHeight: 1.5 }}>
                            {tradeOffs[matrixFactorChoice]}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )
            })()}
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
                        onChange={(e) => { setMonthlySavings(parseInt(e.target.value)); trackMixerInteraction() }}
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
                        onChange={(e) => { setYears(parseInt(e.target.value)); trackMixerInteraction() }}
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

                  <button
                    className="btn-primary"
                    onClick={() => {
                      trackMixerInteraction()
                      if (!portfolioDone) setActiveTab('portfolio')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      fontSize: 14,
                      fontWeight: 900,
                      background: mixerDone
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #ea580c, #f59e0b)',
                      color: '#ffffff',
                    }}
                  >
                    {mixerDone
                      ? '✅ SAVINGS MIXER SECTION COMPLETED — PROCEED TO PORTFOLIO SIMULATOR →'
                      : '✅ COMPLETE SAVINGS MIXER SECTION (+50 XP) →'}
                  </button>
                </div>
              </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Portfolio Simulator Header & In-Window Saved Simulations Switcher */}
          <div className="glass-card-deep" style={{
            padding: '24px 28px',
            borderRadius: 24,
            background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8, display: 'inline-block' }}>
                LEVEL 2 · SECTION 3 · MULTI-ASSET ENGINE
              </div>
              <h2 className="font-display" style={{ fontSize: 30, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                🏢 PORTFOLIO SIMULATOR
              </h2>
              <p style={{ fontSize: 13, color: isLight ? '#475569' : '#d1d5db', fontWeight: 600, margin: '4px 0 0' }}>
                Select 2 or more investment options (including multiple of the same type), compare Manual vs. Smart Allocation, and analyze combined returns & maturity gap periods.
              </p>
            </div>

            {/* Sub-View Switcher: Simulator vs Saved Portfolio Simulations */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setPortfolioSubView('simulator')
                  setSelectedSavedPort(null)
                  setIsEditingSavedPort(false)
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: portfolioSubView === 'simulator'
                    ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
                    : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)'),
                  color: portfolioSubView === 'simulator' ? '#ffffff' : (isLight ? '#0f172a' : '#fbbf24'),
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                }}
              >
                🧮 Portfolio Simulator
              </button>
              <button
                onClick={() => setPortfolioSubView('saved')}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: portfolioSubView === 'saved'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)'),
                  color: portfolioSubView === 'saved' ? '#ffffff' : (isLight ? '#0f172a' : '#6ee7b7'),
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                }}
              >
                📂 Saved Simulations ({savedPortfolioSimulations.length})
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {portfolioToast && (
            <div className="anim-fade" style={{
              padding: '14px 18px',
              borderRadius: 14,
              background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.18)',
              border: '2px solid #10b981',
              color: isLight ? '#065f46' : '#6ee7b7',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{portfolioToast}</span>
              <button
                onClick={() => setPortfolioToast('')}
                style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 900, cursor: 'pointer', fontSize: 14 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* SUB-VIEW 1: ACTIVE PORTFOLIO SIMULATOR */}
          {portfolioSubView === 'simulator' && (
            <>
              {/* Top Horizontal Investment Options Bar */}
              <div className="glass-card-deep" style={{
                padding: '22px 24px',
                borderRadius: 22,
                background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', textTransform: 'uppercase' }}>
                      1. SELECT INVESTMENT OPTIONS (CLICK + TO ADD ROW BELOW)
                    </div>
                    <div style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', fontWeight: 600 }}>
                      Choose 2 or more investment options. You can click <strong>+</strong> on the same option multiple times (e.g., FD 1, FD 2)!
                    </div>
                  </div>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 900,
                    background: portfolioRows.length >= 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: portfolioRows.length >= 2 ? '#10b981' : '#f59e0b',
                    border: `1.5px solid ${portfolioRows.length >= 2 ? '#10b981' : '#f59e0b'}`
                  }}>
                    {portfolioRows.length} Option{portfolioRows.length === 1 ? '' : 's'} Selected (Min 2)
                  </span>
                </div>

                {/* Horizontal Order Investment Option Pills with + Symbol */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  alignItems: 'center',
                }}>
                  {PORTFOLIO_OPTIONS_CATALOG.map(opt => {
                    const countSelected = portfolioRows.filter(r => r.typeKey === opt.typeKey).length
                    return (
                      <div
                        key={opt.typeKey}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderRadius: 14,
                          background: countSelected > 0
                            ? (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.12)')
                            : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'),
                          border: countSelected > 0
                            ? `2px solid ${opt.color || '#f59e0b'}`
                            : (isLight ? '2px solid #000000' : '2px solid rgba(255,255,255,0.2)'),
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                              {opt.shortName}
                            </span>
                            {countSelected > 0 && (
                              <span style={{
                                fontSize: 10,
                                fontWeight: 900,
                                padding: '1px 6px',
                                borderRadius: 999,
                                background: opt.color || '#f59e0b',
                                color: '#080705'
                              }}>
                                ×{countSelected}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: isLight ? '#64748b' : '#9ca3af' }}>
                            {opt.defaultRate}% p.a. · {opt.defaultYears}Y
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddInvestmentOption(opt)}
                          title={`Add ${opt.name} to Portfolio`}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                            background: 'linear-gradient(135deg, #ea580c, #f59e0b)',
                            color: '#ffffff',
                            fontSize: 18,
                            fontWeight: 900,
                             lineHeight: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 10px rgba(234, 88, 12, 0.3)',
                          }}
                        >
                          +
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Allocation Mode (Manual vs Smart at the beginning) & Selected Investment Rows */}
              <div className="glass-card-deep" style={{
                padding: '24px',
                borderRadius: 22,
                background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
              }}>
                {/* Portfolio Simulation Name & Allocation Mode Selector Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 16,
                  marginBottom: 20,
                  paddingBottom: 18,
                  borderBottom: isLight ? '1.5px solid #e2e8f0' : '1.5px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ flex: '1 1 240px' }}>
                    <label style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', display: 'block', marginBottom: 6 }}>
                      PORTFOLIO SIMULATION NAME (DEFAULT: {defaultPortfolioName.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={customPortfolioName}
                      placeholder={defaultPortfolioName}
                      onChange={e => setCustomPortfolioName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 800,
                        background: isLight ? '#f8fafc' : '#1a1610',
                        color: isLight ? '#0f172a' : '#fef3c7',
                        border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                      }}
                    />
                  </div>

                  {/* Manual Allocation vs Smart Allocation Toggle at the Beginning */}
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 6 }}>
                      2. CHOOSE ALLOCATION MODE (AVAILABLE BEFORE & AFTER SIMULATION)
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={handleSwitchToManual}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: allocationMode === 'manual'
                            ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
                            : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)'),
                          color: allocationMode === 'manual' ? '#ffffff' : (isLight ? '#334155' : '#d1d5db'),
                          border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        }}
                      >
                        ✍️ Manual Allocation
                      </button>
                      <button
                        onClick={() => handleSwitchToSmart(false)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: allocationMode === 'smart'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)'),
                          color: allocationMode === 'smart' ? '#ffffff' : (isLight ? '#334155' : '#d1d5db'),
                          border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        }}
                      >
                        🧠 Smart Allocation (Max Profit)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Smart Allocation Banner & Total Monthly Investment Input when Smart Allocation is active */}
                {allocationMode === 'smart' && (
                  <div className="anim-fade" style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    marginBottom: 20,
                    background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
                    border: '2px solid #10b981',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}>
                    <div style={{ flex: '1 1 280px' }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#065f46' : '#6ee7b7', marginBottom: 4 }}>
                        🧠 SMART ALLOCATION MODE ACTIVE
                      </div>
                      <div style={{ fontSize: 12, color: isLight ? '#047857' : '#d1fae5', fontWeight: 600 }}>
                        Enter only your <strong>Total Monthly Investment</strong> below and fill Rate of Interest & Time Period manually. The system automatically divides your monthly investment across the selected options to <strong>maximize overall profit</strong>!
                      </div>
                    </div>
                    <div style={{ minWidth: 220 }}>
                      <label style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#065f46' : '#6ee7b7', display: 'block', marginBottom: 4 }}>
                        TOTAL MONTHLY INVESTMENT (₹/MO)
                      </label>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={smartTotalMonthly}
                        onChange={e => setSmartTotalMonthly(Math.max(0, Number(e.target.value)))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 12,
                          fontSize: 16,
                          fontWeight: 900,
                          background: isLight ? '#ffffff' : '#080705',
                          color: '#10b981',
                          border: '2px solid #10b981',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Selected Investment Rows Table/List */}
                {portfolioRows.length === 0 ? (
                  <div style={{
                    padding: '36px 20px',
                    textAlign: 'center',
                    borderRadius: 16,
                    background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                    border: isLight ? '2px dashed #94a3b8' : '2px dashed rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>➕</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                      No Investment Options Selected Yet
                    </div>
                    <p style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', margin: '4px 0 0' }}>
                      Click the <strong>+</strong> button beside any investment option in the horizontal bar above to add rows here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                      SELECTED INVESTMENT ROWS ({portfolioRows.length}) — ENTER VALUES IN THIS WINDOW:
                    </div>

                    {currentPortfolioCalc.itemSummaries.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '16px 18px',
                          borderRadius: 16,
                          background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                          border: isLight ? '2px solid #000000' : '2px solid rgba(255,255,255,0.2)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
                          gap: 12,
                          alignItems: 'center',
                        }}
                      >
                        {/* Option Name Input (Default: FD 1, FD 2 or RD) */}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>
                            ROW #{idx + 1} NAME ({item.typeKey})
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 18 }}>{item.emoji}</span>
                            <input
                              type="text"
                              value={portfolioRows[idx]?.customName ?? ''}
                              placeholder={item.defaultName}
                              onChange={e => handleUpdateRowField(item.id, 'customName', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 800,
                                background: isLight ? '#ffffff' : '#12100c',
                                color: isLight ? '#0f172a' : '#fef3c7',
                                border: isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.25)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Monthly Investment Input (Manual editable vs Smart auto-optimized) */}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 900, color: allocationMode === 'smart' ? '#10b981' : (isLight ? '#475569' : '#9ca3af'), display: 'block', marginBottom: 4 }}>
                            {allocationMode === 'smart' ? '🧠 SMART MONTHLY (₹)' : 'MONTHLY INVEST (₹)'}
                          </label>
                          <input
                            type="number"
                            min="100"
                            step="500"
                            disabled={allocationMode === 'smart'}
                            value={allocationMode === 'smart' ? item.monthly : (portfolioRows[idx]?.monthly ?? item.monthly)}
                            onChange={e => handleUpdateRowField(item.id, 'monthly', Math.max(0, Number(e.target.value)))}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 900,
                              background: allocationMode === 'smart'
                                ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)')
                                : (isLight ? '#ffffff' : '#12100c'),
                              color: allocationMode === 'smart' ? '#10b981' : (isLight ? '#0f172a' : '#ffffff'),
                              border: allocationMode === 'smart'
                                ? '2px solid #10b981'
                                : (isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.25)'),
                              cursor: allocationMode === 'smart' ? 'not-allowed' : 'text',
                            }}
                          />
                        </div>

                        {/* Rate of Interest (% p.a.) */}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>
                            INTEREST RATE (% P.A.)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            step="0.1"
                            value={portfolioRows[idx]?.rate ?? item.rate}
                            onChange={e => handleUpdateRowField(item.id, 'rate', Math.max(0.1, Number(e.target.value)))}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 900,
                              background: isLight ? '#ffffff' : '#12100c',
                              color: isLight ? '#ea580c' : '#fbbf24',
                              border: isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.25)',
                            }}
                          />
                        </div>

                        {/* Time Period (Years) */}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>
                            TIME PERIOD (YEARS)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            step="1"
                            value={portfolioRows[idx]?.years ?? item.years}
                            onChange={e => handleUpdateRowField(item.id, 'years', Math.max(1, parseInt(e.target.value) || 1))}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 900,
                              background: isLight ? '#ffffff' : '#12100c',
                              color: isLight ? '#0f172a' : '#ffffff',
                              border: isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.25)',
                            }}
                          />
                        </div>

                        {/* Row Preview & Remove Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>
                              MATURITY ({item.years}Y)
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#10b981' }}>
                              {fmtINR(item.returns)}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: isLight ? '#475569' : '#9ca3af' }}>
                              Profit: +{fmtINR(item.profit)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveInvestmentRow(item.id)}
                            title="Remove row"
                            style={{
                              padding: '7px 10px',
                              borderRadius: 10,
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1.5px solid #ef4444',
                              color: '#ef4444',
                              fontWeight: 900,
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {portfolioError && (
                  <div style={{
                    marginTop: 14,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1.5px solid #ef4444',
                    color: '#ef4444',
                    fontSize: 12,
                    fontWeight: 800
                  }}>
                    ⚠️ {portfolioError}
                  </div>
                )}

                {/* Run Portfolio Simulation CTA Button */}
                <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={handleRunPortfolioSimulator}
                    disabled={portfolioRows.length < 2}
                    className="btn-primary"
                    style={{
                      flex: '1 1 280px',
                      padding: '15px 24px',
                      fontSize: 15,
                      fontWeight: 900,
                      opacity: portfolioRows.length < 2 ? 0.5 : 1,
                      cursor: portfolioRows.length < 2 ? 'not-allowed' : 'pointer',
                      border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                    }}
                  >
                    🚀 {portfolioRows.length < 2
                      ? 'SELECT AT LEAST 2 INVESTMENT OPTIONS ABOVE'
                      : `RUN PORTFOLIO SIMULATION (${portfolioDone ? 'COMPLETED ✅' : '+100 XP'})`}
                  </button>
                </div>
              </div>

              {/* Step 3: Combined Portfolio Results, Breakdown Bar, Post-Run Smart Allocation, Gap Periods Analysis & Optional Save */}
              {hasRunSim && portfolioRows.length >= 2 && (
                <div className="glass-card-deep anim-fade" style={{
                  padding: '28px',
                  borderRadius: 24,
                  background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
                  border: '2.5px solid #10b981',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    <div>
                      <div className="sticker-badge sticker-yellow" style={{ marginBottom: 6, display: 'inline-block' }}>
                        {allocationMode === 'smart' ? '🧠 SMART ALLOCATION RESULTS' : '✍️ MANUAL ALLOCATION RESULTS'}
                      </div>
                      <h3 className="font-display" style={{ fontSize: 26, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                        📊 {effectivePortfolioName.toUpperCase()} — COMBINED ANALYSIS
                      </h3>
                    </div>
                    <div style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)',
                      border: '1.5px solid #f59e0b',
                      color: isLight ? '#9a3412' : '#fbbf24',
                      fontSize: 12,
                      fontWeight: 900
                    }}>
                      Total Monthly: {fmtINR(currentPortfolioCalc.totalMonthly)}/mo · Max Horizon: {currentPortfolioCalc.maxHorizon} Yrs
                    </div>
                  </div>

                  {/* Post-Simulation Manual vs Smart Allocation Optimizer Bar */}
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    marginBottom: 22,
                    background: allocationMode === 'smart'
                      ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)')
                      : (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.12)'),
                    border: `2px solid ${allocationMode === 'smart' ? '#10b981' : '#f59e0b'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                  }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 4 }}>
                        {allocationMode === 'manual'
                          ? '💡 Want to see how your monthly investments can be smartly allocated for maximum profit?'
                          : '🧠 Smart Allocation Applied! Monthly investments have been optimally divided for maximum profit.'}
                      </div>
                      <div style={{ fontSize: 12, color: isLight ? '#475569' : '#d1d5db', fontWeight: 600 }}>
                        {allocationMode === 'manual'
                          ? `Clicking "Smart Allocation" combines all your monthly investments (${fmtINR(currentPortfolioCalc.totalMonthly)}/mo) and divides them across your selected options to maximize overall profit with respect to interest rate and time period.`
                          : (manualBaselineProfit !== null && currentPortfolioCalc.totalProfit >= manualBaselineProfit
                              ? `Smart Allocation boosted your overall portfolio profit by +${fmtINR(currentPortfolioCalc.totalProfit - manualBaselineProfit)} compared to your manual allocation!`
                              : 'Only the monthly investment per row was adjusted to maximize your combined portfolio return.')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={handleSwitchToManual}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: allocationMode === 'manual' ? '#ea580c' : (isLight ? '#ffffff' : '#12100c'),
                          color: allocationMode === 'manual' ? '#ffffff' : (isLight ? '#0f172a' : '#fef3c7'),
                          border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        }}
                      >
                        ✍️ Manual Allocation
                      </button>
                      <button
                        onClick={() => handleSwitchToSmart(true)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: allocationMode === 'smart'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #ea580c, #f59e0b)',
                          color: '#ffffff',
                          border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                        }}
                      >
                        🧠 Smart Allocation (Optimize Profit)
                      </button>
                    </div>
                  </div>

                  {/* 4 Combined Metric Summary Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 14,
                    marginBottom: 22
                  }}>
                    <div style={{
                      background: isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.15)',
                      border: '2px solid #0284c7',
                      padding: 18,
                      borderRadius: 16,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#0369a1' : '#38bdf8', marginBottom: 4 }}>
                        TOTAL INVESTMENT
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8' }}>
                        {fmtINR(currentPortfolioCalc.totalInvested)}
                      </div>
                    </div>

                    <div style={{
                      background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
                      border: '2px solid #10b981',
                      padding: 18,
                      borderRadius: 16,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#047857' : '#6ee7b7', marginBottom: 4 }}>
                        TOTAL PROFIT
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#059669' : '#10b981' }}>
                        +{fmtINR(currentPortfolioCalc.totalProfit)}
                      </div>
                    </div>

                    <div style={{
                      background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                      border: '2px solid #f59e0b',
                      padding: 18,
                      borderRadius: 16,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#92400e' : '#fbbf24', marginBottom: 4 }}>
                        TOTAL RETURNS
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#b45309' : '#fbbf24' }}>
                        {fmtINR(currentPortfolioCalc.totalReturns)}
                      </div>
                    </div>

                    <div style={{
                      background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
                      border: '2px solid #10b981',
                      padding: 18,
                      borderRadius: 16,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#047857' : '#6ee7b7', marginBottom: 4 }}>
                        PROFIT PERCENTAGE
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#059669' : '#10b981' }}>
                        +{currentPortfolioCalc.profitPercentage ?? currentPortfolioCalc.profitPct ?? '0.0'}%
                      </div>
                    </div>
                  </div>

                  {/* Invested vs Returns Breakdown Bar (Combined across all investments) */}
                  {(() => {
                    const invShare = currentPortfolioCalc.investedSharePct ?? currentPortfolioCalc.investedBarPct ?? (currentPortfolioCalc.totalReturns > 0 ? ((currentPortfolioCalc.totalInvested / currentPortfolioCalc.totalReturns) * 100).toFixed(1) : '100.0')
                    const retShare = currentPortfolioCalc.returnsSharePct ?? currentPortfolioCalc.returnsBarPct ?? (currentPortfolioCalc.totalReturns > 0 ? (100 - Number(invShare)).toFixed(1) : '0.0')
                    return (
                      <div style={{
                        background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                        border: isLight ? '2px solid #000000' : '2px solid rgba(255,255,255,0.2)',
                        padding: 20,
                        borderRadius: 18,
                        marginBottom: 22
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                          <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            📊 INVESTED VS RETURNS BREAKDOWN (ALL INVESTMENTS COMBINED)
                          </span>
                          <span style={{ color: isLight ? '#475569' : '#9ca3af' }}>
                            Combined Maturity Value: {fmtINR(currentPortfolioCalc.totalReturns)} (100%)
                          </span>
                        </div>

                        <div style={{
                          width: '100%',
                          height: 30,
                          borderRadius: 999,
                          overflow: 'hidden',
                          display: 'flex',
                          marginBottom: 12,
                          fontWeight: 900,
                          fontSize: 11,
                          color: '#ffffff',
                          background: '#10b981',
                          border: isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.3)'
                        }}>
                          <div style={{
                            width: `${invShare}%`,
                            background: '#0284c7',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'width 0.3s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                          }}>
                            {Number(invShare) >= 10 ? `${invShare}%` : ''}
                          </div>
                          <div style={{
                            width: `${retShare}%`,
                            background: '#10b981',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'width 0.3s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                          }}>
                            {Number(retShare) >= 10 ? `${retShare}%` : ''}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, fontWeight: 800 }}>
                          <span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>
                            🟦 Total Invested Principal: {invShare}% ({fmtINR(currentPortfolioCalc.totalInvested)})
                          </span>
                          <span style={{ color: isLight ? '#059669' : '#6ee7b7' }}>
                            🟩 Total Profit Earned: {retShare}% (+{fmtINR(currentPortfolioCalc.totalProfit)})
                          </span>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Gap Periods Analysis & Details */}
                  <div style={{
                    background: isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.08)',
                    border: isLight ? '2px solid #ea580c' : '2px solid #f59e0b',
                    padding: 20,
                    borderRadius: 18,
                    marginBottom: 22
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 24 }}>⏳</span>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                          GAP PERIODS ANALYSIS & DETAILS
                        </h4>
                        <p style={{ fontSize: 12, color: isLight ? '#475569' : '#d1d5db', margin: '2px 0 0', fontWeight: 600 }}>
                          When selected investments have different time horizons, shorter investments mature earlier—creating a gap period where matured funds can be reinvested or used for intermediate goals.
                        </p>
                      </div>
                    </div>

                    {currentPortfolioCalc.gapPeriods.length === 0 ? (
                      <div style={{
                        padding: '14px 16px',
                        borderRadius: 12,
                        background: isLight ? '#ffffff' : 'rgba(0,0,0,0.35)',
                        border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(255,255,255,0.15)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: isLight ? '#334155' : '#d1d5db'
                      }}>
                        ✅ All selected investments share the same maturity period of <strong>{currentPortfolioCalc.maxHorizon} years</strong>. There are <strong>0 gap years</strong> between maturities—all payouts arrive together at Year {currentPortfolioCalc.maxHorizon}. Try setting different time periods (e.g., 5 years and 7 years) to analyze maturity gap periods!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {currentPortfolioCalc.gapPeriods.map((gap, gIdx) => (
                          <div
                            key={gIdx}
                            style={{
                              padding: 16,
                              borderRadius: 14,
                              background: isLight ? '#ffffff' : 'rgba(18, 16, 12, 0.92)',
                              border: isLight ? '1.5px solid #ea580c' : '1.5px solid #f59e0b',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                                {gap.emoji} {gap.name} — Matures in {gap.maturesAt} Years
                              </span>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 900,
                                background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.2)',
                                color: isLight ? '#c2410c' : '#fbbf24',
                                border: '1px solid #f59e0b'
                              }}>
                                ⏳ {gap.gapYears}-Year Gap Period (Yr {gap.maturesAt} → Yr {gap.maxHorizon})
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: isLight ? '#334155' : '#d1d5db', fontWeight: 600, lineHeight: 1.5, margin: '0 0 8px' }}>
                              {gap.analysisText || `${gap.name} matures at Year ${gap.maturesAt} with a total payout of ${fmtINR(gap.maturedCorpus)}, leaving a ${gap.gapYears}-year gap period until Year ${gap.maxHorizon}.`}
                            </p>
                            <div style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: isLight ? '#065f46' : '#6ee7b7',
                              background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
                              padding: '8px 12px',
                              borderRadius: 10,
                              border: '1px solid #10b981'
                            }}>
                              💡 <strong>Gap Period Utilization:</strong> {gap.smartTip}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Optional Save Portfolio Simulation Button (0 XP) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isLight ? '#475569' : '#9ca3af' }}>
                      📌 Saving this simulation is optional (0 XP) and lets you view or edit it anytime in Saved Simulations.
                    </div>
                    <button
                      onClick={handleOpenSavePortfolioModal}
                      className="btn-primary"
                      style={{
                        padding: '12px 22px',
                        fontSize: 13,
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        border: isLight ? '2px solid #000000' : '2px solid #ffffff',
                      }}
                    >
                      💾 Save Portfolio Simulation (Optional)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* SUB-VIEW 2: SAVED PORTFOLIO SIMULATIONS IN THIS WINDOW */}
          {portfolioSubView === 'saved' && (
            <div className="glass-card-deep anim-fade" style={{
              padding: '24px',
              borderRadius: 22,
              background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
              border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                    📂 SAVED PORTFOLIO SIMULATIONS ({savedPortfolioSimulations.length})
                  </h3>
                  <p style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', fontWeight: 600, margin: '4px 0 0' }}>
                    Click any saved simulation to inspect its details and results. Values are locked in read-only mode until you click <strong>Edit</strong>.
                  </p>
                </div>
                <button
                  onClick={() => go('savedSimulations')}
                  className="btn-outline"
                  style={{ padding: '8px 14px', fontSize: 12, fontWeight: 900 }}
                >
                  📁 Open Full Saved Simulations Manager →
                </button>
              </div>

              {savedPortfolioSimulations.length === 0 ? (
                <div style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  borderRadius: 16,
                  background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                  border: isLight ? '2px dashed #94a3b8' : '2px dashed rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontSize: 34, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                    No Saved Portfolio Simulations Yet
                  </div>
                  <p style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', margin: '4px 0 14px' }}>
                    Run a simulation in the Portfolio Simulator tab and click &ldquo;Save Portfolio Simulation&rdquo; to store it here.
                  </p>
                  <button
                    onClick={() => setPortfolioSubView('simulator')}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: 12, fontWeight: 900 }}
                  >
                    ← Back to Portfolio Simulator
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Saved List */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    {savedPortfolioSimulations.map(sim => {
                      const isSelected = selectedSavedPort?.id === sim.id
                      const res = calculatePortfolioSimulation(sim.items || sim.results?.itemSummaries || [], sim.allocationMode || 'manual', sim.totalMonthlyBudget)
                      return (
                        <div
                          key={sim.id}
                          onClick={() => handleOpenSavedPortInWindow(sim, false)}
                          style={{
                            padding: 16,
                            borderRadius: 16,
                            cursor: 'pointer',
                            background: isSelected
                              ? (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.14)')
                              : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'),
                            border: isSelected
                              ? '2.5px solid #f59e0b'
                              : (isLight ? '2px solid #000000' : '2px solid rgba(255,255,255,0.2)'),
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                                📊 {sim.name}
                              </div>
                              <div style={{ fontSize: 11, color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700, marginTop: 2 }}>
                                {(sim.items || []).length} Options · {fmtINR(res.totalReturns)} Returns (+{res.profitPercentage ?? res.profitPct}%)
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenSavedPortInWindow(sim, true)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: 8,
                                  fontSize: 11,
                                  fontWeight: 900,
                                  background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.2)',
                                  color: isLight ? '#9a3412' : '#fbbf24',
                                  border: '1px solid #f59e0b',
                                  cursor: 'pointer'
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => setDeletePortConfirm(sim)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: 8,
                                  fontSize: 11,
                                  fontWeight: 900,
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#ef4444',
                                  border: '1px solid #ef4444',
                                  cursor: 'pointer'
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Saved Simulation Detail & Read-Only / Edit View */}
                  {selectedSavedPort && (() => {
                    const liveCalc = isEditingSavedPort
                      ? calculatePortfolioSimulation(
                          editPortDraft.items || [],
                          editPortDraft.allocationMode || 'manual',
                          editPortDraft.allocationMode === 'smart' ? editPortDraft.totalMonthlyBudget : null
                        )
                      : calculatePortfolioSimulation(
                          selectedSavedPort.items || selectedSavedPort.results?.itemSummaries || [],
                          selectedSavedPort.allocationMode || 'manual',
                          selectedSavedPort.totalMonthlyBudget
                        )
                    const savedInvShare = liveCalc.investedSharePct ?? liveCalc.investedBarPct ?? '100.0'
                    const savedRetShare = liveCalc.returnsSharePct ?? liveCalc.returnsBarPct ?? '0.0'

                    return (
                      <div style={{
                        marginTop: 8,
                        padding: 22,
                        borderRadius: 18,
                        background: isLight ? '#f8fafc' : 'rgba(0,0,0,0.35)',
                        border: isEditingSavedPort ? '2.5px solid #f59e0b' : '2.5px solid #10b981'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                          <div>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 900,
                              padding: '3px 10px',
                              borderRadius: 999,
                              background: isEditingSavedPort ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                              color: isEditingSavedPort ? '#f59e0b' : '#10b981',
                              border: `1px solid ${isEditingSavedPort ? '#f59e0b' : '#10b981'}`
                            }}>
                              {isEditingSavedPort ? '✏️ EDIT MODE ENABLED' : '🔒 READ-ONLY VIEW (CLICK EDIT TO MODIFY)'}
                            </span>
                            {isEditingSavedPort ? (
                              <input
                                type="text"
                                value={editPortDraft.name}
                                onChange={e => setEditPortDraft(prev => ({ ...prev, name: e.target.value }))}
                                style={{
                                  display: 'block',
                                  marginTop: 8,
                                  padding: '8px 12px',
                                  borderRadius: 10,
                                  fontSize: 16,
                                  fontWeight: 900,
                                  background: isLight ? '#ffffff' : '#12100c',
                                  color: isLight ? '#0f172a' : '#ffffff',
                                  border: '2px solid #f59e0b'
                                }}
                              />
                            ) : (
                              <h4 style={{ fontSize: 20, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '8px 0 0' }}>
                                {selectedSavedPort.name}
                              </h4>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {!isEditingSavedPort ? (
                              <button
                                onClick={() => setIsEditingSavedPort(true)}
                                className="btn-primary"
                                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 900 }}
                              >
                                ✏️ Edit
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={handleSaveEditedPortInWindow}
                                  className="btn-primary"
                                  style={{
                                    padding: '8px 18px',
                                    fontSize: 12,
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#ffffff'
                                  }}
                                >
                                  💾 Edit changes
                                </button>
                                <button
                                  onClick={() => handleOpenSavedPortInWindow(selectedSavedPort, false)}
                                  className="btn-outline"
                                  style={{ padding: '8px 14px', fontSize: 12, fontWeight: 800 }}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setDeletePortConfirm(selectedSavedPort)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 900,
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                border: '1.5px solid #ef4444',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>

                        {/* Items inside saved simulation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                          {liveCalc.itemSummaries.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              style={{
                                padding: 12,
                                borderRadius: 12,
                                background: isLight ? '#ffffff' : '#12100c',
                                border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(255,255,255,0.15)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                gap: 10,
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>OPTION ({item.typeKey})</div>
                                {isEditingSavedPort ? (
                                  <input
                                    type="text"
                                    value={editPortDraft.items[idx]?.customName || editPortDraft.items[idx]?.name || item.name}
                                    onChange={e => {
                                      const val = e.target.value
                                      setEditPortDraft(prev => ({
                                        ...prev,
                                        items: prev.items.map((it, i) => i === idx ? { ...it, customName: val, name: val } : it)
                                      }))
                                    }}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}
                                  />
                                ) : (
                                  <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                                    {item.emoji} {item.name}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>MONTHLY (₹)</div>
                                {isEditingSavedPort && editPortDraft.allocationMode !== 'smart' ? (
                                  <input
                                    type="number"
                                    value={editPortDraft.items[idx]?.monthly ?? item.monthly}
                                    onChange={e => {
                                      const val = Math.max(0, Number(e.target.value))
                                      setEditPortDraft(prev => ({
                                        ...prev,
                                        items: prev.items.map((it, i) => i === idx ? { ...it, monthly: val } : it)
                                      }))
                                    }}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}
                                  />
                                ) : (
                                  <div style={{ fontSize: 13, fontWeight: 900, color: '#0284c7' }}>{fmtINR(item.monthly)}/mo</div>
                                )}
                              </div>

                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>RATE (% P.A.)</div>
                                {isEditingSavedPort ? (
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editPortDraft.items[idx]?.rate ?? item.rate}
                                    onChange={e => {
                                      const val = Math.max(0.1, Number(e.target.value))
                                      setEditPortDraft(prev => ({
                                        ...prev,
                                        items: prev.items.map((it, i) => i === idx ? { ...it, rate: val } : it)
                                      }))
                                    }}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}
                                  />
                                ) : (
                                  <div style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b' }}>{item.rate}% p.a.</div>
                                )}
                              </div>

                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>YEARS</div>
                                {isEditingSavedPort ? (
                                  <input
                                    type="number"
                                    min="1"
                                    value={editPortDraft.items[idx]?.years ?? item.years}
                                    onChange={e => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1)
                                      setEditPortDraft(prev => ({
                                        ...prev,
                                        items: prev.items.map((it, i) => i === idx ? { ...it, years: val } : it)
                                      }))
                                    }}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}
                                  />
                                ) : (
                                  <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>{item.years} Yrs</div>
                                )}
                              </div>

                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#64748b' : '#9ca3af' }}>MATURITY</div>
                                <div style={{ fontSize: 13, fontWeight: 900, color: '#10b981' }}>{fmtINR(item.returns)}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Combined Summary in Saved Detail */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
                          <div style={{ padding: 12, borderRadius: 12, background: isLight ? '#e0f2fe' : 'rgba(2,132,199,0.15)', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#0284c7' }}>TOTAL INVESTED</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#0284c7' }}>{fmtINR(liveCalc.totalInvested)}</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 12, background: isLight ? '#d1fae5' : 'rgba(16,185,129,0.15)', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981' }}>TOTAL PROFIT</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>+{fmtINR(liveCalc.totalProfit)}</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 12, background: isLight ? '#fef3c7' : 'rgba(245,158,11,0.15)', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#f59e0b' }}>TOTAL RETURNS</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b' }}>{fmtINR(liveCalc.totalReturns)}</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 12, background: isLight ? '#d1fae5' : 'rgba(16,185,129,0.15)', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981' }}>PROFIT PERCENTAGE</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>+{liveCalc.profitPercentage ?? liveCalc.profitPct}%</div>
                          </div>
                        </div>

                        {/* Combined Invested vs Returns Breakdown Bar in Saved Detail */}
                        <div style={{
                          background: isLight ? '#ffffff' : '#12100c',
                          border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(255,255,255,0.15)',
                          padding: 14,
                          borderRadius: 14
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, marginBottom: 8 }}>
                            <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>📊 INVESTED VS RETURNS BREAKDOWN (ALL INVESTMENTS COMBINED)</span>
                            <span style={{ color: isLight ? '#475569' : '#9ca3af' }}>{fmtINR(liveCalc.totalReturns)} (100%)</span>
                          </div>
                          <div style={{ width: '100%', height: 24, borderRadius: 999, overflow: 'hidden', display: 'flex', background: '#10b981', marginBottom: 8, fontSize: 10, fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ width: `${savedInvShare}%`, background: '#0284c7', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {Number(savedInvShare) >= 10 ? `${savedInvShare}%` : ''}
                            </div>
                            <div style={{ width: `${savedRetShare}%`, background: '#10b981', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {Number(savedRetShare) >= 10 ? `${savedRetShare}%` : ''}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800 }}>
                            <span style={{ color: '#0284c7' }}>🟦 Invested: {savedInvShare}% ({fmtINR(liveCalc.totalInvested)})</span>
                            <span style={{ color: '#10b981' }}>🟩 Profit: {savedRetShare}% (+{fmtINR(liveCalc.totalProfit)})</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Save Portfolio Simulation Modal (Names for Main Portfolio Simulation & Each Investment Option Inside It) */}
      {showSaveModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 7, 5, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div className="glass-card-deep anim-scale" style={{
            maxWidth: 520,
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            borderRadius: 22,
            padding: 26,
            background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
            border: '2.5px solid #10b981'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 26 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  SAVE PORTFOLIO SIMULATION (OPTIONAL · 0 XP)
                </h3>
                <p style={{ fontSize: 12, color: isLight ? '#475569' : '#9ca3af', margin: '2px 0 0', fontWeight: 600 }}>
                  Customize the name of your main portfolio simulation and each investment option inside it.
                </p>
              </div>
            </div>

            {/* Main Portfolio Simulation Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#0f172a' : '#fbbf24', display: 'block', marginBottom: 6 }}>
                MAIN PORTFOLIO SIMULATION NAME
              </label>
              <input
                type="text"
                value={saveModalPortName}
                placeholder={defaultPortfolioName}
                onChange={e => setSaveModalPortName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontWeight: 800,
                  borderRadius: 12,
                  background: isLight ? '#f8fafc' : '#1a1610',
                  color: isLight ? '#0f172a' : '#fef3c7',
                  border: isLight ? '2px solid #000000' : '2px solid #ffffff'
                }}
              />
            </div>

            {/* Individual Investment Option Names Inside Portfolio */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#0f172a' : '#fbbf24', display: 'block', marginBottom: 8 }}>
                INVESTMENT OPTIONS INSIDE THIS PORTFOLIO (DEFAULT: FD 1, FD 2 OR RD)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {namedPortfolioRows.map((row, rIdx) => (
                  <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{row.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#475569' : '#9ca3af', minWidth: 65 }}>
                      #{rIdx + 1} ({row.typeKey})
                    </span>
                    <input
                      type="text"
                      value={saveModalItemNames[row.id] ?? row.name}
                      placeholder={row.defaultName}
                      onChange={e => setSaveModalItemNames(prev => ({ ...prev, [row.id]: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: 13,
                        fontWeight: 800,
                        borderRadius: 10,
                        background: isLight ? '#f8fafc' : '#1a1610',
                        color: isLight ? '#0f172a' : '#fef3c7',
                        border: isLight ? '1.5px solid #000000' : '1.5px solid rgba(255,255,255,0.3)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className="btn-outline"
                onClick={() => setShowSaveModal(false)}
                style={{ padding: '10px 18px', fontSize: 12, fontWeight: 800 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmSavePortfolio}
                style={{
                  padding: '10px 22px',
                  fontSize: 13,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff'
                }}
              >
                💾 Confirm & Save Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Verification Modal inside Portfolio Simulator Window */}
      {deletePortConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 7, 5, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div className="glass-card-deep anim-scale" style={{
            maxWidth: 420,
            width: '100%',
            borderRadius: 20,
            padding: 24,
            background: isLight ? '#ffffff' : '#12100c',
            border: '2.5px solid #ef4444'
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 8px' }}>
              Delete Saved Portfolio Simulation?
            </h3>
            <p style={{ fontSize: 13, color: isLight ? '#475569' : '#d1d5db', fontWeight: 600, margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>&ldquo;{deletePortConfirm.name}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className="btn-outline"
                onClick={() => setDeletePortConfirm(null)}
                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 800 }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteSavedPortInWindow}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 900,
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🗑️ Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
