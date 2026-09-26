import { useState, useEffect } from 'react'
import { modules, advRates } from '../data.js'
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


const SCHEMES = Object.keys(advRates)

const SCHEME_TENURES = { PPF: 15, FD: 5, GOLD: 8, NSC: 5, SSY: 21, RD: 3 }

const COLORS = { PPF: '#f59e0b', FD: '#d97706', GOLD: '#eab308', NSC: '#fbbf24', SSY: '#ec4899', RD: '#10b981' }
const EMOJIS = { PPF: '🏦', FD: '💳', GOLD: '🪙', NSC: '📮', SSY: '👧', RD: '📅' }

const DESCRIPTIONS = {
  PPF: 'Government-backed 15-year tax-free savings. Ideal for long term wealth creation.',
  FD: 'Safe & steady bank deposits. Highly flexible tenures but interest is taxable.',
  GOLD: 'Sovereign Gold Bonds & Digital Gold with market appreciation and fixed annual yield.',
  NSC: 'Post Office 5-year certificate with guaranteed compounded annual returns.',
  SSY: 'High interest savings scheme dedicated for the girl child. Completely tax-free.',
  RD: 'Disciplined monthly savings plan with bank compounded interest payouts.',
}

const DETAILS = {
  PPF: '🔒 15-Year Lock-in · 🍀 EEE Tax Free',
  FD: '🔒 7 Days-10 Yrs · 💸 Taxable Interest',
  GOLD: '🔒 8-Year Maturity · 📈 Capital Appreciation + 2.5% p.a.',
  NSC: '🔒 5-Year Lock-in · 📝 80C Tax Benefit',
  SSY: '🔒 21-Year Lock-in · 🍀 EEE Tax Free',
  RD: '🔒 1-10 Yrs Tenure · 💸 Taxable Interest',
}

const PORTFOLIO_OPTIONS = [
  { id: 'ppf', name: 'Public Provident Fund (PPF)', emoji: '🏛️', rate: 7.1, years: 15, monthly: 5000 },
  { id: 'fd', name: 'Fixed Deposit (FD)', emoji: '🏦', rate: 7.25, years: 5, monthly: 5000 },
  { id: 'gold', name: 'Sovereign Gold Bonds (SGB / Gold)', emoji: '🪙', rate: 9.5, years: 8, monthly: 3000 },
  { id: 'nsc', name: 'National Savings Certificate (NSC)', emoji: '📜', rate: 7.7, years: 5, monthly: 3000 },
  { id: 'ssy', name: 'Sukanya Samriddhi Yojana (SSY)', emoji: '👧', rate: 8.2, years: 15, monthly: 4000 },
  { id: 'rd', name: 'Recurring Deposit (RD)', emoji: '🔄', rate: 6.5, years: 3, monthly: 2000 },
  { id: 'mis', name: 'Post Office MIS', emoji: '📮', rate: 7.4, years: 5, monthly: 3000 }
]

const PORTFOLIO_CATALOG = [
  { key: 'PPF', name: 'PPF', rate: 7.1, tenure: 15, sub: '7.1% • 15 Yrs', icon: '🏰' },
  { key: 'FD', name: 'FD', rate: 7.2, tenure: 5, sub: '7.2% • 5 Yrs', icon: '🔒' },
  { key: 'NSC', name: 'NSC', rate: 7.7, tenure: 5, sub: '7.7% • 5 Yrs', icon: '📜' },
  { key: 'SSY', name: 'SSY', rate: 8.2, tenure: 21, sub: '8.2% • 21 Yrs', icon: '👧' },
  { key: 'RD', name: 'RD', rate: 6.8, tenure: 3, sub: '6.8% • 3 Yrs', icon: '🗓️' },
  { key: 'MIS', name: 'MIS', rate: 7.4, tenure: 5, sub: '7.4% • 5 Yrs', icon: '💵' },
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
  themeMode = 'dark'
}) {

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
  const [selectedVideo, setSelectedVideo] = useState('upi_working')
  // Portfolio Tower / Combined Wealth Metrics 2-Step State Variables
  const [portfolioStep, setPortfolioStep] = useState('select') // 'select' | 'simulate'
  const [selectedSchemes, setSelectedSchemes] = useState(['PPF', 'FD', 'GOLD', 'NSC'])
  const [portfolioAlloc, setPortfolioAlloc] = useState({ PPF: 25, FD: 25, GOLD: 25, NSC: 25 })
  const [monthlyTotal, setMonthlyTotal] = useState(10000)
  const [portfolioYears, setPortfolioYears] = useState(10)
  const [simDone, setSimDone] = useState(false)
  const [allocationMode, setAllocationMode] = useState('manual')

  const [hasRunSim, setHasRunSim] = useState(false)
  const [portfolioResults, setPortfolioResults] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [portfolioName, setPortfolioName] = useState('My Multi-Asset Portfolio')



  const toggleScheme = (k) => {
    if (selectedSchemes.includes(k)) {
      if (selectedSchemes.length === 1) return
      setSelectedSchemes(prev => prev.filter(s => s !== k))
    } else {
      setSelectedSchemes(prev => [...prev, k])
    }
  }

  const handleStartPortfolioSimulation = () => {
    if (selectedSchemes.length === 0) return

    const n = selectedSchemes.length
    const share = Math.floor(100 / n)
    const newAlloc = {}
    
    selectedSchemes.forEach((s, idx) => {
      newAlloc[s] = idx === 0 ? share + (100 - share * n) : share
    })

    setPortfolioAlloc(newAlloc)
    setPortfolioStep('simulate')
  }

  const setSchemeAlloc = (k, v) => {
    const activeSchemes = selectedSchemes
    const others = activeSchemes.filter(s => s !== k)
    
    if (others.length === 0) {
      setPortfolioAlloc({ [k]: 100 })
      return
    }

    const remaining = 100 - v
    const otherTotal = others.reduce((sum, s) => sum + (portfolioAlloc[s] || 0), 0)
    const ratio = otherTotal > 0 ? remaining / otherTotal : 1 / others.length
    
    const newAlloc = { ...portfolioAlloc, [k]: v }
    others.forEach(s => {
      newAlloc[s] = Math.max(0, Math.round((portfolioAlloc[s] || 0) * ratio))
    })

    const sum = activeSchemes.reduce((acc, s) => acc + (newAlloc[s] || 0), 0)
    if (sum !== 100) {
      newAlloc[others[0]] = Math.max(0, (newAlloc[others[0]] || 0) + (100 - sum))
    }

    setPortfolioAlloc(newAlloc)
  }

  const handleRunPortfolioAllocSim = () => {
    if (addXP) addXP(100)
    update({ allocations: portfolioAlloc })
    setSimDone(true)

    let totalInvestedAcc = 0
    let totalReturnsAcc = 0
    let maxHorizonAcc = 0

    const itemSummaries = selectedSchemes.map(k => {
      const rate = advRates[k] || 7.0
      const years = SCHEME_TENURES[k] || portfolioYears
      const monthly = Math.round(((portfolioAlloc[k] || 0) / 100) * monthlyTotal)
      const mRate = (rate / 100) / 12
      const tMonths = years * 12
      const inv = monthly * tMonths
      const ret = mRate > 0
        ? Math.round(monthly * ((Math.pow(1 + mRate, tMonths) - 1) / mRate) * (1 + mRate))
        : inv
      totalInvestedAcc += inv
      totalReturnsAcc += ret
      if (years > maxHorizonAcc) maxHorizonAcc = years
      return {
        id: k.toLowerCase(),
        name: SCHEME_NAMES[k] || k,
        emoji: EMOJIS[k] || '🔒',
        rate,
        years,
        monthly,
        invested: inv,
        returns: ret,
        profit: Math.max(0, ret - inv)
      }
    })

    const totalProfitAcc = Math.max(0, totalReturnsAcc - totalInvestedAcc)
    const profitPctAcc = totalInvestedAcc > 0 ? ((totalProfitAcc / totalInvestedAcc) * 100).toFixed(1) : 0

    const gapPeriods = itemSummaries
      .filter(item => item.years < maxHorizonAcc)
      .map(item => {
        const gapYears = maxHorizonAcc - item.years
        let smartTip = ''
        if (gapYears >= 10) {
          smartTip = `You can redeploy this matured ${fmt(item.returns)} into equity index mutual funds, multi-asset allocation funds, or 10-year Sovereign Gold Bonds to maximize compounding returns over the long ${gapYears}-year window!`
        } else if (gapYears >= 5) {
          smartTip = `You can redeploy this matured ${fmt(item.returns)} into corporate FDs, hybrid conservative mutual funds, or high-yield bonds for steady, low-volatility growth over ${gapYears} gap years!`
        } else {
          smartTip = `You can park this matured ${fmt(item.returns)} into short-term liquid funds, arbitrage funds, or high-yield savings to preserve capital for immediate life goals maturing in ${gapYears} years!`
        }
        return {
          name: item.name,
          emoji: item.emoji || '🔒',
          maturesAt: item.years,
          gapYears: gapYears,
          maturedCorpus: item.returns,
          smartTip
        }
      })
      .sort((a, b) => a.maturesAt - b.maturesAt)

    setPortfolioResults({
      totalInvested: totalInvestedAcc,
      totalReturns: totalReturnsAcc,
      totalProfit: totalProfitAcc,
      profitPct: profitPctAcc,
      maxHorizon: maxHorizonAcc,
      itemSummaries,
      gapPeriods
    })
    setHasRunSim(true)
  }

  const fmt = (num) => {
    const val = Math.round(num || 0)
    if (Math.abs(val) >= 10000000) {
      return '₹' + (val / 10000000).toFixed(2) + ' Cr'
    }
    if (Math.abs(val) >= 100000) {
      return '₹' + (val / 100000).toFixed(2) + ' L'
    }
    return '₹' + val.toLocaleString('en-IN')
  }

  const handleAddPortfolioOption = (opt) => {
    const newItem = {
      ...opt,
      uid: Date.now() + Math.random()
    }
    setPortfolioItems([...portfolioItems, newItem])
  }

  const handleRemovePortfolioOption = (uid) => {
    setPortfolioItems(portfolioItems.filter(item => item.uid !== uid))
  }




  const handleSmartAllocation = () => {
    setAllocationMode('smart')
    if (portfolioItems.length === 0) return
    const totalCurrentMonthly = portfolioItems.reduce((sum, item) => sum + (item.monthly || 0), 0) || 10000
    const sumRates = portfolioItems.reduce((sum, item) => sum + (item.rate || 0), 0) || 1
    const updated = portfolioItems.map(item => {
      const weight = (item.rate || 1) / sumRates
      const allocatedMonthly = Math.round(totalCurrentMonthly * weight)
      return { ...item, monthly: allocatedMonthly }
    })
    setPortfolioItems(updated)
  }

  const runPortfolioSimulation = () => {
    if (portfolioItems.length === 0) return

    let totalInvested = 0
    let totalReturns = 0
    let maxHorizon = 0

    const itemSummaries = portfolioItems.map(item => {
      const mRate = (item.rate / 100) / 12
      const tMonths = item.years * 12
      const inv = item.monthly * tMonths
      const ret = mRate > 0
        ? Math.round(item.monthly * ((Math.pow(1 + mRate, tMonths) - 1) / mRate) * (1 + mRate))
        : inv
      totalInvested += inv
      totalReturns += ret
      if (item.years > maxHorizon) maxHorizon = item.years
      return {
        ...item,
        invested: inv,
        returns: ret,
        profit: Math.max(0, ret - inv)
      }
    })

    const totalProfit = Math.max(0, totalReturns - totalInvested)
    const profitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : 0

    const gapPeriods = itemSummaries
      .filter(item => item.years < maxHorizon)
      .map(item => {
        const gapYears = maxHorizon - item.years
        let smartTip = ''
        if (gapYears >= 10) {
          smartTip = `You can redeploy this matured ${fmt(item.returns)} into equity index mutual funds, multi-asset allocation funds, or 10-year Sovereign Gold Bonds to maximize compounding returns over the long ${gapYears}-year window!`
        } else if (gapYears >= 5) {
          smartTip = `You can redeploy this matured ${fmt(item.returns)} into corporate FDs, hybrid conservative mutual funds, or high-yield bonds for steady, low-volatility growth over ${gapYears} gap years!`
        } else {
          smartTip = `You can park this matured ${fmt(item.returns)} into short-term liquid funds, arbitrage funds, or high-yield savings to preserve capital for immediate life goals maturing in ${gapYears} years!`
        }
        return {
          name: item.name,
          emoji: item.emoji || '🔒',
          maturesAt: item.years,
          gapYears: gapYears,
          maturedCorpus: item.returns,
          smartTip
        }
      })
      .sort((a, b) => a.maturesAt - b.maturesAt)

    setPortfolioResults({
      totalInvested,
      totalReturns,
      totalProfit,
      profitPct,
      maxHorizon,
      itemSummaries,
      gapPeriods
    })
    setHasRunSim(true)
  }

  const handleConfirmSavePortfolio = () => {
    if (onSavePortfolio && portfolioResults) {
      onSavePortfolio({
        id: Date.now(),
        name: portfolioName.trim() || 'My Multi-Asset Portfolio',
        date: new Date().toLocaleDateString('en-IN'),
        results: portfolioResults,
        items: portfolioItems
      })
    }
    setShowSaveModal(false)
  }

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
      if (addXP) addXP(200)
      update({ advancedUnlocked: true })
    }
  }, [allDone, state.advancedUnlocked])
  
  const completedCount = modules.filter(m => modulesDone.includes(m.id)).length + (mixerDone ? 1 : 0) + (cyberDone ? 1 : 0)
  const progressPct = Math.min(100, Math.round((completedCount / 8) * 100))

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
          <span>⬅ Back</span>
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
          🧪 SIMULATOR MODULES 🌟
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
          💼 SAVINGS MIXER 🌟
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
            border: isLight ? '2.5px solid #000000' : '2.5px solid #ffffff',
            boxShadow: activeTab === 'portfolio'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          🏢 COMBINED METRICS 📊
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
                        onClick={() => toggleMatrixScheme(s.key)}
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
                    onChange={e => setMatrixAmount(Number(e.target.value))}
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
                    onChange={e => setMatrixYears(Number(e.target.value))}
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
                    onChange={e => setMatrixInflation(Number(e.target.value))}
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
                          onClick={() => setMatrixFactorChoice(opt.id)}
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
      )}

      {activeTab === 'portfolio' && (
        <div className="anim-fade">
          {portfolioStep === 'select' ? (
            <div className="anim-fade">
              {/* Step 1: Scheme Selector */}
              <div className="glass-card-deep" style={{
                padding: 28, marginBottom: 24,
                background: isLight ? '#ffffff' : '#12100c',
                border: isLight ? '2px solid rgba(234,88,12,0.35)' : '2px solid rgba(217,119,6,0.3)',
                borderRadius: 24,
                boxShadow: isLight ? '0 10px 30px rgba(194,65,12,0.1)' : 'none'
              }}>
                <h2 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 6 }}>
                  STEP 1: CHOOSE ASSET CLASSES
                </h2>
                <p style={{ fontSize: 13, color: isLight ? '#334155' : '#d1d5db', fontWeight: 600, marginBottom: 20 }}>
                  Select the assets you want to include in your portfolio simulator. We recommend selecting at least <strong style={{ color: isLight ? '#ea580c' : '#fbbf24' }}>two</strong> different schemes to diversify your risk.
                </p>


                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {SCHEMES.map(k => {
                    const selected = selectedSchemes.includes(k)
                    return (
                      <div
                        key={k}
                        onClick={() => toggleScheme(k)}
                        style={{
                          padding: '16px 20px', borderRadius: 18, cursor: 'pointer',
                          background: selected
                            ? (isLight ? '#fff7ed' : 'rgba(245,158,11,0.12)')
                            : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'),
                          border: selected
                            ? `2.5px solid ${isLight ? '#ea580c' : '#f59e0b'}`
                            : (isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(217,119,6,0.2)'),
                          boxShadow: selected ? `0 0 20px ${isLight ? 'rgba(234,88,12,0.2)' : 'rgba(245,158,11,0.2)'}` : 'none',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex', alignItems: 'center', gap: 14,
                        }}
                      >
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          border: `2px solid ${selected ? (isLight ? '#ea580c' : '#f59e0b') : (isLight ? '#94a3b8' : '#71717a')}`,
                          background: selected ? (isLight ? '#ea580c' : '#f59e0b') : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: selected ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'), fontWeight: 900, fontSize: 13,
                        }}>
                          {selected ? '✓' : ''}
                        </div>

                        <div style={{
                          width: 46, height: 46, borderRadius: 14,
                          background: isLight ? '#ffffff' : 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, border: `2px solid ${COLORS[k]}`,
                        }}>{EMOJIS[k]}</div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 15 }}>{k}</span>
                            <span className="sticker-badge sticker-yellow" style={{ fontSize: 10, padding: '2px 6px' }}>
                              {advRates[k]}% P.A.
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: isLight ? '#334155' : '#d1d5db', fontWeight: 600, marginTop: 4 }}>
                            {DESCRIPTIONS[k]}
                          </div>
                          <div style={{ fontSize: 10, color: COLORS[k], fontWeight: 800, marginTop: 4 }}>
                            {DETAILS[k]}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleStartPortfolioSimulation}
                  disabled={selectedSchemes.length === 0}
                  className="btn-primary"
                  style={{
                    width: '100%', fontSize: 15, padding: '16px', fontWeight: 900,
                    opacity: selectedSchemes.length === 0 ? 0.5 : 1,
                    cursor: selectedSchemes.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  🚀 CONFIGURE PORTFOLIO ALLOCATION ({selectedSchemes.length} SELECTED)
                </button>
              </div>
            </div>
          ) : (
            <div className="anim-fade">
              {/* Step 2: Allocation & Simulation */}
              <button className="btn-outline" onClick={() => setPortfolioStep('select')} style={{ marginBottom: 20 }}>
                ← MODIFY INVESTMENT TYPES
              </button>

              {/* Global settings */}
              <div className="glass-card-sm anim-fade delay-1" style={{
                padding: '22px', marginBottom: 20,
                background: isLight ? '#ffffff' : '#12100c',
                border: isLight ? '1.5px solid rgba(234,88,12,0.35)' : '1.5px solid rgba(217,119,6,0.3)',
                borderRadius: 20
              }}>
                <h3 style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 14, marginBottom: 16 }}>⚙️ PORTFOLIO SETTINGS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: isLight ? '#334155' : '#d1d5db' }}>MONTHLY BUDGET</span>
                      <span style={{ fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', fontSize: 13 }}>₹{monthlyTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <input type="range" min={1000} max={100000} step={1000} value={monthlyTotal}
                      onChange={e => setMonthlyTotal(Number(e.target.value))}
                      style={{ width: '100%', accentColor: isLight ? '#ea580c' : '#f59e0b' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: isLight ? '#334155' : '#d1d5db' }}>DURATION</span>
                      <span style={{ fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', fontSize: 13 }}>{portfolioYears} YEARS</span>
                    </div>
                    <input type="range" min={1} max={30} step={1} value={portfolioYears}
                      onChange={e => setPortfolioYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: isLight ? '#ea580c' : '#f59e0b' }} />
                  </div>
                </div>

                {/* Total allocation check */}
                {(() => {
                  const totalPct = selectedSchemes.reduce((acc, s) => acc + (portfolioAlloc[s] || 0), 0)
                  return (
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{
                          width: `${Math.min(totalPct, 100)}%`,
                          background: totalPct === 100
                            ? '#f59e0b'
                            : totalPct > 100
                            ? '#e11d48'
                            : '#d97706',
                        }} />
                      </div>
                      <span style={{ fontWeight: 900, fontSize: 13,
                        color: totalPct === 100 ? '#fbbf24' : totalPct > 100 ? '#e11d48' : '#d97706'
                      }}>{totalPct}%</span>
                    </div>
                  )
                })()}
              {/* Allocation Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {selectedSchemes.map((k, i) => (
                  <div key={k} className={`glass-card-sm anim-fade delay-${i+2}`} style={{
                    padding: '20px 22px',
                    background: isLight ? '#ffffff' : '#12100c',
                    border: isLight ? '1.5px solid rgba(234,88,12,0.3)' : '1.5px solid rgba(217,119,6,0.25)',
                    borderRadius: 18
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 14,
                        background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, border: `2px solid ${COLORS[k]}`,
                      }}>{EMOJIS[k]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 14 }}>{k}</span>
                          <span style={{ fontWeight: 900, color: COLORS[k], fontSize: 14 }}>{portfolioAlloc[k] || 0}%</span>
                        </div>
                        <div style={{ fontSize: 11, color: isLight ? '#334155' : '#d1d5db', fontWeight: 600 }}>
                          ₹{Math.round(((portfolioAlloc[k] || 0)/100)*monthlyTotal).toLocaleString('en-IN')}/mo · {advRates[k]}% p.a.
                        </div>
                      </div>
                    </div>
                    <input type="range" min={0} max={100} step={1} value={portfolioAlloc[k] || 0}
                      onChange={e => setSchemeAlloc(k, Number(e.target.value))}
                      style={{ width: '100%', accentColor: COLORS[k], height: 6 }} />

                    <div style={{ marginTop: 10, fontSize: 12, color: isLight ? '#334155' : '#d1d5db', fontWeight: 700 }}>
                      Projected after {portfolioYears}yr: <strong style={{ color: COLORS[k] }}>
                        {fmt((((portfolioAlloc[k] || 0)/100)*monthlyTotal) > 0 ? ((((portfolioAlloc[k] || 0)/100)*monthlyTotal) * ((Math.pow(1 + (advRates[k]/100/12), portfolioYears*12) - 1) / (advRates[k]/100/12)) * (1 + (advRates[k]/100/12))) : 0)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Card */}
              {(() => {
                const totalPct = selectedSchemes.reduce((acc, s) => acc + (portfolioAlloc[s] || 0), 0)
                const totalInvestedVal = monthlyTotal * 12 * portfolioYears
                const schemeResults = selectedSchemes.map(k => {
                  const monthly = ((portfolioAlloc[k] || 0) / 100) * monthlyTotal
                  const r = (advRates[k] || 7) / 100 / 12
                  const n = portfolioYears * 12
                  const fv = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n
                  return { k, fv }
                })
                const totalFVVal = schemeResults.reduce((acc, item) => acc + item.fv, 0)
                const totalGainVal = Math.max(0, totalFVVal - totalInvestedVal)

                return (
                  <div className="glass-card-deep anim-fade" style={{
                    padding: '28px 32px', marginBottom: 24,
                    background: isLight ? '#ffffff' : '#12100c',
                    border: isLight ? '2px solid rgba(234,88,12,0.4)' : '2px solid rgba(217,119,6,0.4)',
                    borderRadius: 24
                  }}>
                    <h3 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 20 }}>
                      📊 PORTFOLIO SUMMARY
                    </h3>

                    {/* Allocation Bar */}
                    <div style={{ display: 'flex', height: 16, borderRadius: 999, overflow: 'hidden', marginBottom: 12, border: isLight ? '1.5px solid rgba(234,88,12,0.3)' : '1.5px solid rgba(217,119,6,0.3)' }}>
                      {selectedSchemes.map(k => (
                        (portfolioAlloc[k] || 0) > 0 && (
                          <div key={k} style={{
                            width: `${portfolioAlloc[k]}%`, background: COLORS[k],
                            transition: 'width 0.3s ease',
                          }} />
                        )
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                      {selectedSchemes.map(k => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[k] }} />
                          <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#334155' : '#d1d5db' }}>{k} {portfolioAlloc[k] || 0}%</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                      {[
                        { label: 'TOTAL INVESTED', value: fmt(totalInvestedVal), color: isLight ? '#0f172a' : '#ffffff' },
                        { label: 'TOTAL VALUE', value: fmt(totalFVVal), color: isLight ? '#ea580c' : '#fbbf24' },
                        { label: 'WEALTH GAINED', value: fmt(totalGainVal), color: '#10b981' },
                      ].map(c => (
                        <div key={c.label} style={{
                          background: isLight ? '#f8fafc' : '#080705', borderRadius: 14, padding: '14px 10px',
                          textAlign: 'center', border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(217,119,6,0.3)',
                        }}>
                          <div className="font-display" style={{ fontSize: 20, color: c.color, lineHeight: 1 }}>{c.value}</div>
                          <div style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 800, marginTop: 4 }}>{c.label}</div>
                        </div>
                      ))}
                    </div>

                    {simDone ? (
                      <div style={{
                        textAlign: 'center', padding: '18px',
                        background: isLight ? '#fff7ed' : 'rgba(245,158,11,0.12)',
                        borderRadius: 16, border: isLight ? '2px solid #ea580c' : '2px solid #f59e0b',
                        marginBottom: 20
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 6 }}>🎊</div>
                        <div style={{ fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', fontSize: 16 }}>+100 XP EARNED! AMAZING WORK!</div>
                      </div>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={handleRunPortfolioAllocSim}
                        disabled={totalPct !== 100}
                        style={{
                          width: '100%', fontSize: 15, padding: '16px', fontWeight: 900, marginBottom: 20,
                          opacity: totalPct !== 100 ? 0.5 : 1,
                          cursor: totalPct !== 100 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {totalPct !== 100 ? `ALLOCATIONS MUST TOTAL 100% (${totalPct}%)` : '🚀 RUN PORTFOLIO SIMULATION (+100 XP)'}
                      </button>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

          {/* COMBINED WEALTH METRICS REPORT BOX */}
          {hasRunSim && portfolioResults && (() => {
            const totalRet = portfolioResults.totalReturns || 1
            const invPctVal = ((portfolioResults.totalInvested / totalRet) * 100).toFixed(1)
            const profPctVal = ((portfolioResults.totalProfit / totalRet) * 100).toFixed(1)
            return (
              <div className="glass-card-deep anim-scale" style={{
                padding: 28, borderRadius: 24, marginBottom: 24,
                background: isLight ? '#ffffff' : 'rgba(8, 20, 36, 0.95)',
                border: '2px solid #0284c7',
                boxShadow: isLight ? '0 10px 30px rgba(2, 132, 199, 0.15)' : '0 0 30px rgba(2, 132, 199, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div className="sticker-badge" style={{ marginBottom: 6, background: isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.2)', color: isLight ? '#0284c7' : '#38bdf8', border: '1px solid #0284c7', padding: '4px 12px', fontSize: 10, fontWeight: 900, borderRadius: 999 }}>
                      OVERALL PORTFOLIO REPORT
                    </div>
                    <h2 className="font-display" style={{ fontSize: 26, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                      COMBINED WEALTH METRICS
                    </h2>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)', padding: '6px 14px', borderRadius: 999, border: isLight ? '1px solid #ea580c' : '1px solid #f59e0b' }}>
                    Longest Investment Horizon: {portfolioResults.maxHorizon} Years
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                  <div style={{ background: isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.15)', border: '1.5px solid #0284c7', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#0369a1' : '#38bdf8', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL INVESTMENT</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8' }}>{fmt(portfolioResults.totalInvested)}</div>
                  </div>

                  <div style={{ background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.06)', border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(255, 255, 255, 0.2)', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#334155' : '#d1d5db', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL RETURNS</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>{fmt(portfolioResults.totalReturns)}</div>
                  </div>

                  <div style={{ background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#047857' : '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL PROFIT</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#059669' : '#10b981' }}>+{fmt(portfolioResults.totalProfit)}</div>
                  </div>

                  <div style={{ background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#047857' : '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>PROFIT PERCENTAGE</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#059669' : '#10b981' }}>+{portfolioResults.profitPct}%</div>
                  </div>
                </div>

                {/* Combined Invested vs Returns Breakdown Bar */}
                <div style={{ background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1.5px solid rgba(2, 132, 199, 0.3)' : '1.5px solid rgba(2, 132, 199, 0.3)', padding: 18, borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
                    <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                    <span style={{ color: isLight ? '#475569' : '#94a3b8' }}>Portfolio Value: {fmt(portfolioResults.totalReturns)} (100%)</span>
                  </div>
                  <div style={{ height: 26, background: '#10b981', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 12, fontWeight: 900, fontSize: 11, color: '#ffffff' }}>
                    <div style={{ width: `${invPctVal}%`, background: '#0284c7', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {invPctVal}%
                    </div>
                    <div style={{ width: `${profPctVal}%`, background: '#10b981', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profPctVal}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11, fontWeight: 800 }}>
                    <span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>🟦 TOTAL INVESTED: {invPctVal}% ({fmt(portfolioResults.totalInvested)})</span>
                    <span style={{ color: isLight ? '#059669' : '#6ee7b7' }}>🟩 TOTAL RETURNS (PROFIT): {profPctVal}% ({fmt(portfolioResults.totalProfit)})</span>
                  </div>
                </div>

                {/* Gap Periods & Reinvestment Analysis */}
                {portfolioResults.gapPeriods && portfolioResults.gapPeriods.length > 0 && (
                  <div style={{ background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1.5px solid rgba(234, 88, 12, 0.3)' : '1.5px solid rgba(245, 158, 11, 0.3)', padding: 20, borderRadius: 18, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 22 }}>⌛</span>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                          GAP PERIODS & REINVESTMENT ANALYSIS
                        </h4>
                        <p style={{ fontSize: 11, color: isLight ? '#475569' : '#9ca3af', margin: '2px 0 0' }}>
                          Understand when earlier investments mature and how to put the matured corpus to work during the remaining gap years.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {portfolioResults.gapPeriods.map((gap, gIdx) => (
                        <div key={gIdx} style={{ background: isLight ? '#ffffff' : 'rgba(18, 16, 12, 0.9)', border: isLight ? '1.5px solid #ea580c' : '1.5px solid #f59e0b', padding: 16, borderRadius: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontSize: 14 }}>
                              {gap.emoji || '🔒'} {gap.name} matures at Year {gap.maturesAt}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 900, color: isLight ? '#c2410c' : '#fbbf24', background: isLight ? '#ffedd5' : 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: 999, border: isLight ? '1px solid #ea580c' : '1px solid #f59e0b' }}>
                              {gap.gapYears} YEARS GAP AVAILABLE
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: isLight ? '#334155' : '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                            At <strong>Year {gap.maturesAt}</strong>, <strong>{gap.name}</strong> will fully mature with an estimated payout corpus of <strong style={{ color: '#10b981' }}>{fmt(gap.maturedCorpus)}</strong>. Because your overall portfolio horizon runs for <strong>{portfolioResults.maxHorizon} years</strong>, you have a <strong>{gap.gapYears}-year gap period</strong> before longer-term investments conclude.
                          </p>
                          <div style={{ marginTop: 10, fontSize: 11, color: isLight ? '#9a3412' : '#fbbf24', fontWeight: 700, background: isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.1)', padding: '10px 14px', borderRadius: 10, border: isLight ? '1px solid rgba(234, 88, 12, 0.3)' : '1.5px solid rgba(245, 158, 11, 0.2)' }}>
                            💡 <strong>Smart Utilization Tip:</strong> {gap.smartTip}
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
            )
          })()}
        </div>
      )}



      {/* Save Portfolio Modal */}
      {showSaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 7, 5, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-card-deep anim-scale" style={{ maxWidth: 460, width: '100%', borderRadius: 20, padding: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>SAVE PORTFOLIO SIMULATION</h3>
                <p style={{ fontSize: 11, color: isLight ? '#475569' : '#9ca3af', margin: '2px 0 0' }}>Name this overall portfolio model</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#334155' : '#9ca3af', display: 'block', marginBottom: 6 }}>PORTFOLIO SIMULATION NAME</label>
              <input
                type="text"
                className="input-light"
                value={portfolioName}
                onChange={e => setPortfolioName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700, background: isLight ? '#fff7ed' : '#1a1610', color: isLight ? '#0f172a' : '#fef3c7', border: isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(217,119,6,0.3)' }}
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
