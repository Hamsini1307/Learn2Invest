// ──────────────────────────────────────────────
//  Learn2Invest  –  Data Layer
// ──────────────────────────────────────────────

export const videos = [
  {
    id: 'ppf',
    title: 'What is PPF? — Public Provident Fund',
    duration: '5 min',
    subtitle: "India's most popular long-term tax-free savings scheme",
    emoji: '🏦',
    localPath: '/videos/ppf.mp4',
    thumbnail: null,
    points: [
      'PPF gives 7.1% interest per year — completely tax-free',
      'Minimum lock-in period: 15 years',
      'Maximum investment: ₹1.5 lakh per year',
      'Backed by Government of India — zero risk',
      'Interest is compounded annually and credited on 31st March',
    ],
    color: '#10b981',
    bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
  },
  {
    id: 'fd',
    title: 'Fixed Deposit — Safe & Steady Returns',
    duration: '4 min',
    subtitle: 'Understanding FDs and how to maximize your returns',
    emoji: '💳',
    localPath: '/videos/fd.mp4',
    thumbnail: null,
    points: [
      'FDs offer 6.5–7.5% interest from major banks',
      'Tenure: 7 days to 10 years (highly flexible)',
      'Senior citizens get 0.5% additional interest',
      'TDS is deducted on interest above ₹40,000/year',
      'Premature withdrawal allowed with small penalty',
    ],
    color: '#3b82f6',
    bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  },
  {
    id: 'nsc',
    title: 'NSC — National Savings Certificate',
    duration: '4 min',
    subtitle: 'Post Office scheme with 7.7% guaranteed returns',
    emoji: '📮',
    localPath: '/videos/nsc.mp4',
    thumbnail: null,
    points: [
      'NSC offers 7.7% interest — compounded annually',
      'Lock-in period: 5 years (fixed)',
      'Tax benefit under Section 80C up to ₹1.5 lakh',
      'Interest is reinvested automatically each year',
      'Available at all Post Offices across India',
    ],
    color: '#f59e0b',
    bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
  },
  {
    id: 'ssy',
    title: 'Sukanya Samriddhi Yojana — For Your Daughter',
    duration: '6 min',
    subtitle: 'Government scheme for girl child with highest interest rate',
    emoji: '👧',
    localPath: '/videos/ssy.mp4',
    thumbnail: null,
    points: [
      'Current interest rate: 8.2% (highest govt scheme!)',
      'Can be opened for girl child below 10 years',
      'Account matures when child turns 21',
      'Tax-free: EEE category (exempt-exempt-exempt)',
      'Minimum deposit: ₹250/year, Maximum: ₹1.5L/year',
    ],
    color: '#ec4899',
    bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  },
]

export const quizQuestions = [
  {
    q: 'What is financial literacy mainly about?',
    opts: ['Earning a lot of money', 'Understanding how to manage money', 'Avoiding banks', 'Spending money quickly'],
    ans: 1,
    hint: 'Think about managing money, not just earning it.',
    explain: 'Financial literacy means understanding how to earn, save, spend, and invest money effectively.',
    emoji: '🏦',
  },
  {
    q: 'Which of the following is NOT a part of financial literacy?',
    opts: ['Saving money', 'Investing money', 'Ignoring expenses', 'Managing income'],
    ans: 2,
    hint: 'Financial literacy requires awareness, not ignorance.',
    explain: 'Ignoring expenses is not part of financial literacy. Managing income, saving, and investing are essential.',
    emoji: '⏳',
  },
  {
    q: 'What does "investment" mean?',
    opts: ['Spending money for fun', 'Keeping money idle', 'Using money to earn more money', 'Borrowing money'],
    ans: 2,
    hint: 'Money should grow, not stay idle.',
    explain: 'Investment means putting money into assets or instruments so it grows over time.',
    emoji: '📈',
  },
  {
    q: 'Why is starting investment early beneficial?',
    opts: ['You can spend more', 'Money gets more time to grow', 'Banks give free money', 'No taxes are applied'],
    ans: 1,
    hint: 'Time plays a key role in growth.',
    explain: 'Starting early allows compounding, where money grows over time.',
    emoji: '📮',
  },
  {
    q: 'Why are government bonds considered very safe?',
    opts: ['They give high returns', 'They are backed by the government', 'They are digital', 'They change daily'],
    ans: 1,
    hint: 'Who is guaranteeing the money?',
    explain: 'Government bonds are safe because they are backed by the government.',
    emoji: '💸',
  },
  {
    q: 'What does SIP stand for in mutual funds?',
    opts: ['Systematic Investment Plan', 'Savings Interest Plan', 'Secure Income Portfolio', 'Standard Investment Policy'],
    ans: 0,
    hint: 'You invest a fixed amount regularly — monthly or weekly.',
    explain: 'SIP = Systematic Investment Plan — a method of investing fixed amounts regularly in mutual funds.',
    emoji: '🔄',
  },
  {
    q: 'Under which section of Income Tax can you claim deduction for PPF investments?',
    opts: ['Section 80D', 'Section 80C', 'Section 24B', 'Section 10(14)'],
    ans: 1,
    hint: 'This section covers most popular saving instruments like PPF, ELSS, LIC.',
    explain: 'Section 80C allows deduction of up to ₹1.5 lakh per year for PPF, NSC, SSY and other investments.',
    emoji: '📋',
  },
  {
    q: 'Which of the following is a liability?',
    opts: ['Savings', 'Property investment', 'Loan', 'Mutual fund'],
    ans: 2,
    hint: 'Think about money you owe.',
    explain: 'Liabilities are obligations like loans that reduce your wealth.',
    emoji: '💰',
  },
  {
    q: 'Sukanya Samriddhi Yojana can be opened for a girl child below what age?',
    opts: ['5 years', '8 years', '10 years', '12 years'],
    ans: 2,
    hint: 'The account must be opened before the girl turns double digits in age.',
    explain: 'SSY account can be opened for a girl child below 10 years of age.',
    emoji: '👧',
  },
  {
    q: 'Which of these is considered the SAFEST investment option?',
    opts: ['Stock Market', 'Cryptocurrency', 'Government Bonds / PPF', 'Real Estate'],
    ans: 2,
    hint: 'It is backed by the Government of India — zero risk of default.',
    explain: 'Government bonds and PPF are 100% safe as they are backed by the Government of India with guaranteed returns.',
    emoji: '🛡️',
  },
]

export const modules = [
  { id: 'ppf', emoji: '🏦', name: 'PPF Simulator', desc: 'Public Provident Fund — 15-year tax-free savings', rate: '7.1%', defRate: 7.1, defYears: 15, defMonthly: 2000, color: '#10b981' },
  { id: 'fd', emoji: '💳', name: 'Fixed Deposit', desc: 'Bank FDs — short to long term guaranteed returns', rate: '7.25%', defRate: 7.25, defYears: 5, defMonthly: 5000, color: '#3b82f6' },
  { id: 'nsc', emoji: '📮', name: 'NSC Calculator', desc: 'Post Office NSC — 5-year guaranteed returns', rate: '7.7%', defRate: 7.7, defYears: 5, defMonthly: 3000, color: '#f59e0b' },
  { id: 'ssy', emoji: '👧', name: 'Sukanya Samriddhi', desc: 'Girl child investment — highest government rate', rate: '8.2%', defRate: 8.2, defYears: 21, defMonthly: 2000, color: '#ec4899' },
  { id: 'rd', emoji: '📅', name: 'Recurring Deposit', desc: 'Monthly savings with compounded interest', rate: '6.5%', defRate: 6.5, defYears: 3, defMonthly: 1000, color: '#8b5cf6' },
  { id: 'po', emoji: '🏤', name: 'Post Office MIS', desc: 'Monthly Income Scheme — regular payout', rate: '7.4%', defRate: 7.4, defYears: 5, defMonthly: 10000, color: '#6366f1' },
]

export const advRates = { PPF: 7.1, FD: 7.25, GOLD: 9.5, NSC: 7.7, SSY: 8.2, RD: 6.5 }

export const onboardingSlides = [
  {
    emoji: '🚀',
    title: 'Learn Investing',
    desc: 'Master Indian financial schemes like PPF, FD, NSC and Sukanya Samriddhi through fun bite-sized lessons.',
    gradient: 'linear-gradient(135deg,#c7d2fe,#e0e7ff)',
    accent: '#6366f1',
    illustration: 'rocket',
  },
  {
    emoji: '📊',
    title: 'Track Progress',
    desc: 'Watch your knowledge grow! Complete levels, earn XP points and unlock advanced investment strategies.',
    gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
    accent: '#10b981',
    illustration: 'chart',
  },
  {
    emoji: '🏆',
    title: 'Earn Rewards',
    desc: 'Collect XP, unlock badges and level up from Beginner to Advanced. Your investment journey starts now!',
    gradient: 'linear-gradient(135deg,#fce7f3,#ede9fe)',
    accent: '#ec4899',
    illustration: 'trophy',
  },
]

export const BEGINNER_VIDEO_IDS = ['video1', 'video2', 'video3', 'video4', 'video5']
export const ALL_VIDEO_IDS = ['video1', 'video2', 'video3', 'video4', 'video5', 'ppf', 'fd', 'nsc', 'ssy']

export function isLevel1Completed(state) {
  if (!state) return false
  if (state.level1Completed) return true
  const watched = state.lessonsWatched || []
  const quizPassed = (state.quizScore || 0) >= 60
  if (state.startingLevel === 'intermediate') {
    return quizPassed
  }
  const allVideosWatched = BEGINNER_VIDEO_IDS.every(id => watched.includes(id))
  return allVideosWatched && quizPassed
}

export function isLevel2Unlocked(state) {
  return isLevel1Completed(state)
}

export function isLevel2SimulatorsDone(state) {
  const completed = state?.completedModules || []
  return modules.every(m => completed.includes(m.id))
}

export function isLevel2MixerDone(state) {
  const completed = state?.completedModules || []
  return completed.includes('mixer')
}

export function isLevel2PortfolioDone(state) {
  const completed = state?.completedModules || []
  return completed.includes('portfolio')
}

export function isLevel2Completed(state) {
  if (!state) return false
  if (!isLevel1Completed(state)) return false
  if (state.level2Completed) return true
  return isLevel2SimulatorsDone(state) && isLevel2MixerDone(state) && isLevel2PortfolioDone(state)
}

export function isLevel3Unlocked(state) {
  return isLevel2Completed(state)
}

export function isLevel3Completed(state) {
  if (!state) return false
  if (!isLevel2Completed(state)) return false
  if (state.level3Completed) return true
  const completed = state.completedModules || []
  return completed.includes('paper_slip') && completed.includes('cyber_game')
}

// ──────────────────────────────────────────────
//  Portfolio Simulator Catalog & Calculation Helpers
// ──────────────────────────────────────────────

export const PORTFOLIO_OPTIONS_CATALOG = [
  { typeKey: 'PPF', shortName: 'PPF', fullName: 'Public Provident Fund', emoji: '🏦', defaultRate: 7.1, defaultYears: 15, defaultMonthly: 3000, color: '#10b981' },
  { typeKey: 'FD', shortName: 'FD', fullName: 'Fixed Deposit', emoji: '💳', defaultRate: 7.25, defaultYears: 5, defaultMonthly: 5000, color: '#3b82f6' },
  { typeKey: 'NSC', shortName: 'NSC', fullName: 'National Savings Cert.', emoji: '📮', defaultRate: 7.7, defaultYears: 5, defaultMonthly: 3000, color: '#f59e0b' },
  { typeKey: 'SSY', shortName: 'SSY', fullName: 'Sukanya Samriddhi', emoji: '👧', defaultRate: 8.2, defaultYears: 15, defaultMonthly: 2000, color: '#ec4899' },
  { typeKey: 'RD', shortName: 'RD', fullName: 'Recurring Deposit', emoji: '📅', defaultRate: 6.5, defaultYears: 3, defaultMonthly: 2000, color: '#8b5cf6' },
  { typeKey: 'MIS', shortName: 'MIS', fullName: 'Post Office MIS', emoji: '🏤', defaultRate: 7.4, defaultYears: 5, defaultMonthly: 5000, color: '#6366f1' },
  { typeKey: 'GOLD', shortName: 'GOLD', fullName: 'Sovereign Gold Bond', emoji: '🪙', defaultRate: 9.5, defaultYears: 8, defaultMonthly: 3000, color: '#eab308' },
]

export function fmtINR(num) {
  const val = Math.round(Number(num) || 0)
  if (Math.abs(val) >= 10000000) {
    return '₹' + (val / 10000000).toFixed(2) + ' Cr'
  }
  if (Math.abs(val) >= 100000) {
    return '₹' + (val / 100000).toFixed(2) + ' L'
  }
  return '₹' + val.toLocaleString('en-IN')
}

export function calcSchemeFV(monthly, rate, years) {
  const m = Math.max(0, Number(monthly) || 0)
  const r = Math.max(0, Number(rate) || 0) / 100 / 12
  const n = Math.max(1, Number(years) || 1) * 12
  if (r === 0) return Math.round(m * n)
  return Math.round(m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}

/**
 * Generates default names for investment options inside a portfolio simulation:
 * - If multiple of the same typeKey are selected: "FD 1", "FD 2", etc.
 * - If only one of that typeKey is selected: "RD", "FD", "PPF", etc.
 * - Preserves user-supplied customName if non-empty.
 */
export function getNamedPortfolioRows(rows = []) {
  const counts = {}
  rows.forEach(r => {
    const key = (r.typeKey || r.key || r.type || 'FD').toUpperCase()
    counts[key] = (counts[key] || 0) + 1
  })
  const seen = {}
  return rows.map(r => {
    const key = (r.typeKey || r.key || r.type || 'FD').toUpperCase()
    seen[key] = (seen[key] || 0) + 1
    const defaultName = counts[key] > 1 ? `${key} ${seen[key]}` : key
    const cat = PORTFOLIO_OPTIONS_CATALOG.find(c => c.typeKey === key) || PORTFOLIO_OPTIONS_CATALOG[1]
    const hasCustom = typeof r.customName === 'string' && r.customName.trim() !== ''
    return {
      ...r,
      typeKey: key,
      emoji: r.emoji || cat.emoji || '💳',
      color: r.color || cat.color || '#f59e0b',
      defaultName,
      name: hasCustom ? r.customName.trim() : defaultName,
    }
  })
}

/**
 * Divides the combined monthly investment across all selected investment rows
 * so that overall profit is maximized with respect to each row's Rate of Interest
 * and Time Period (Years), while keeping every selected row active (> 0).
 */
export function computeSmartMonthlyAllocations(rows = [], totalMonthlyBudget = 0) {
  const k = rows.length
  if (k === 0) return []
  const M = Math.max(k, Math.round(Number(totalMonthlyBudget) || 0))
  if (k === 1) return [M]

  // Profit per ₹1/month invested for each row based on its rate & time period
  const unitProfits = rows.map(r => {
    const rate = Math.max(0, Number(r.rate) || 0)
    const years = Math.max(1, Number(r.years ?? r.tenure) || 1)
    const n = years * 12
    const mRate = rate / 100 / 12
    const fv1 = mRate > 0 ? ((Math.pow(1 + mRate, n) - 1) / mRate) * (1 + mRate) : n
    return Math.max(0, fv1 - n)
  })

  const maxP = Math.max(...unitProfits)
  const minP = Math.min(...unitProfits)
  const maxIdx = unitProfits.indexOf(maxP)

  // If all selected options have identical profit multipliers, split equally
  if (maxP - minP < 1e-9) {
    const base = Math.floor(M / k)
    const rem = M - base * k
    return rows.map((_, i) => (i === 0 ? base + rem : base))
  }

  // Reserve a small minimum floor per selected option so every chosen investment remains active,
  // and allocate the remaining budget heavily toward the highest profit-multiplier investment(s).
  const manualSum = rows.reduce((s, r) => s + (Math.max(0, Number(r.monthly) || 0)), 0)
  const hasMatchingManual = Math.abs(manualSum - M) <= k

  const floors = rows.map((r, idx) => {
    const defaultFloor = Math.max(1, Math.floor((M / k) * 0.15))
    if (hasMatchingManual && unitProfits[idx] < maxP) {
      const manualVal = Math.max(1, Math.round(Number(r.monthly) || defaultFloor))
      return Math.max(1, Math.min(defaultFloor, Math.floor(manualVal * 0.5)))
    }
    return defaultFloor
  })

  const floorSum = floors.reduce((s, v) => s + v, 0)
  const distributable = Math.max(0, M - floorSum)

  // Strongly weight toward maximum unit profit
  const weights = unitProfits.map(p => {
    const norm = (p - minP) / (maxP - minP)
    return Math.pow(norm, 4) + (p === maxP ? 0.25 : 0.01 * norm)
  })
  const weightSum = weights.reduce((s, w) => s + w, 0) || 1

  const allocations = floors.map((fl, i) => fl + Math.floor((distributable * weights[i]) / weightSum))
  const currentSum = allocations.reduce((s, v) => s + v, 0)
  allocations[maxIdx] += M - currentSum

  return allocations
}

/**
 * Runs the combined portfolio simulation across all selected rows and generates:
 * - itemSummaries (each row's invested, returns, profit, profitPct)
 * - totalInvested, totalReturns, totalProfit, profitPct
 * - investedBarPct, returnsBarPct (for the Invested vs Returns breakdown bar)
 * - maxHorizon & gapPeriods (detailed gap period analysis for investments maturing earlier)
 */
export function calculatePortfolioSimulation(rows = [], allocationMode = 'manual', totalMonthlyInput = null) {
  const namedRows = getNamedPortfolioRows(rows)
  const manualSum = namedRows.reduce((s, r) => s + Math.max(0, Math.round(Number(r.monthly) || 0)), 0)
  const effectiveTotalMonthly =
    allocationMode === 'smart' && totalMonthlyInput !== null && totalMonthlyInput !== undefined
      ? Math.max(namedRows.length, Math.round(Number(totalMonthlyInput) || 0))
      : manualSum

  const smartAllocations = computeSmartMonthlyAllocations(namedRows, effectiveTotalMonthly)

  let totalInvested = 0
  let totalReturns = 0
  let maxHorizon = 0
  let minHorizon = Infinity

  const itemSummaries = namedRows.map((row, idx) => {
    const monthly =
      allocationMode === 'smart'
        ? smartAllocations[idx]
        : Math.max(0, Math.round(Number(row.monthly) || 0))
    const rate = Math.max(0, Number(row.rate) || 0)
    const years = Math.max(1, Number(row.years ?? row.tenure) || 1)
    const invested = monthly * years * 12
    const returns = calcSchemeFV(monthly, rate, years)
    const profit = Math.max(0, returns - invested)
    const profitPct = invested > 0 ? ((profit / invested) * 100).toFixed(1) : '0.0'

    totalInvested += invested
    totalReturns += returns
    if (years > maxHorizon) maxHorizon = years
    if (years < minHorizon) minHorizon = years

    return {
      ...row,
      monthly,
      manualMonthly: Math.max(0, Math.round(Number(row.monthly) || 0)),
      smartMonthly: smartAllocations[idx],
      rate,
      years,
      tenure: years,
      invested,
      returns,
      profit,
      profitPct,
      profitPercentage: profitPct,
    }
  })

  if (minHorizon === Infinity) minHorizon = 0

  const totalProfit = Math.max(0, totalReturns - totalInvested)
  const profitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0'
  const investedBarPct = totalReturns > 0 ? Math.min(100, Math.max(0, (totalInvested / totalReturns) * 100)).toFixed(1) : '100.0'
  const returnsBarPct = totalReturns > 0 ? Math.max(0, 100 - Number(investedBarPct)).toFixed(1) : '0.0'

  const longestItems = itemSummaries.filter(it => it.years === maxHorizon)
  const longestNames = longestItems.map(it => it.name).join(', ')

  const gapPeriods = itemSummaries
    .filter(item => item.years < maxHorizon)
    .map(item => {
      const gapYears = maxHorizon - item.years
      const analysisText = `${item.name} matures in ${item.years} year${item.years > 1 ? 's' : ''} with a total payout of ${fmtINR(item.returns)} (Invested: ${fmtINR(item.invested)}, Profit: +${fmtINR(item.profit)}), while your longest investment (${longestNames}) runs for ${maxHorizon} years — leaving a ${gapYears}-year gap period.`
      let smartTip = ''
      if (gapYears >= 10) {
        smartTip = `You have a long ${gapYears}-year gap period (Year ${item.years} to Year ${maxHorizon}). You can reinvest the matured amount of ${fmtINR(item.returns)} into long-term instruments like Sovereign Gold Bonds, NSC, or another Fixed Deposit to earn additional compounding returns, or use it for major life goals.`
      } else if (gapYears >= 5) {
        smartTip = `You have a ${gapYears}-year gap period (Year ${item.years} to Year ${maxHorizon}) after ${item.name} matures. You can redeploy the matured ${fmtINR(item.returns)} into a ${gapYears}-year FD, NSC, or Post Office MIS for extra returns while waiting for ${longestNames} to mature, or utilize it for planned medium-term expenses.`
      } else {
        smartTip = `You have a ${gapYears}-year gap period (Year ${item.years} to Year ${maxHorizon}) after ${item.name} matures. You can utilize the matured ${fmtINR(item.returns)} in a short-term RD/FD for ${gapYears} year${gapYears > 1 ? 's' : ''} until ${longestNames} matures, or use the funds for other immediate purposes.`
      }
      return {
        id: item.id,
        name: item.name,
        emoji: item.emoji || '💳',
        maturesAt: item.years,
        maxHorizon,
        gapYears,
        maturedCorpus: item.returns,
        invested: item.invested,
        profit: item.profit,
        longestNames,
        analysisText,
        smartTip,
      }
    })
    .sort((a, b) => a.maturesAt - b.maturesAt)

  return {
    allocationMode,
    totalMonthly: effectiveTotalMonthly,
    totalInvested,
    totalReturns,
    totalProfit,
    profitPct,
    profitPercentage: profitPct,
    investedBarPct,
    investedSharePct: investedBarPct,
    returnsBarPct,
    returnsSharePct: returnsBarPct,
    minHorizon,
    maxHorizon,
    itemSummaries,
    gapPeriods,
  }
}


