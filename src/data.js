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

// ──────────────────────────────────────────────
//  Level 1 Quiz — 20-Question Validated Bank
//  • Q1–Q7:  7 Common Questions (always included)
//  • Q8–Q20: 13 Alternative Questions (randomly select 3 per attempt)
//  • Total displayed per attempt: 10 questions
// ──────────────────────────────────────────────

const RAW_LEVEL1_QUESTION_BANK = [
  // ─── COMMON QUESTIONS (Q1–Q7: Always Included) ───
  {
    id: 'Q1',
    isCommon: true,
    videoId: 'video2',
    difficulty: 'easy',
    icon: '📚',
    emoji: '📚',
    tag: 'Video 2 • Financial Literacy',
    question: 'What does financial literacy mean?',
    options: [
      'Understanding how to earn, save, invest, and manage money',
      'Learning only how to calculate interest',
      'Knowing only how to open a bank account',
      'Spending money without planning',
    ],
    answer: 0,
    hint: 'Think about the complete set of skills needed to handle money wisely.',
    explanation:
      'Financial literacy means understanding how to earn, save, invest, and manage money wisely across daily life and future goals.',
  },
  {
    id: 'Q2',
    isCommon: true,
    videoId: 'video1',
    difficulty: 'easy',
    icon: '📈',
    emoji: '📈',
    tag: 'Video 1 • Money & Investment',
    question: 'What is the main purpose of investing?',
    options: [
      'To spend money immediately',
      'To grow money over time',
      'To avoid keeping financial records',
      'To eliminate every financial risk',
    ],
    answer: 1,
    hint: 'Investing puts money into assets with a long-term goal in mind.',
    explanation:
      'The main purpose of investing is to put money into assets or opportunities so that it grows and earns returns over time.',
  },
  {
    id: 'Q3',
    isCommon: true,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '🎈',
    emoji: '🎈',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'What is inflation?',
    options: [
      'A decrease in all expenses',
      'An increase in savings account balances',
      'An increase in prices over time',
      'A fixed return on investments',
    ],
    answer: 2,
    hint: 'Think about why goods and services cost more over the years.',
    explanation:
      'Inflation is the general increase in prices over time, which reduces the purchasing power of money.',
  },
  {
    id: 'Q4',
    isCommon: true,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '🐷',
    emoji: '🐷',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'Which term describes money kept aside for future use?',
    options: ['Liability', 'Expense', 'Return', 'Savings'],
    answer: 3,
    hint: 'This is the portion of income you set aside rather than spend immediately.',
    explanation:
      'Savings refers to money set aside from current income for future needs, emergencies, or goals.',
  },
  {
    id: 'Q5',
    isCommon: true,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '📋',
    emoji: '📋',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'What is a budget used for?',
    options: [
      'Planning income and expenses',
      'Predicting guaranteed investment profits',
      'Removing all financial obligations',
      'Increasing prices in the market',
    ],
    answer: 0,
    hint: 'A budget tracks how much money comes in and how much goes out.',
    explanation:
      'A budget is a financial plan used for tracking and planning your income and expenses wisely.',
  },
  {
    id: 'Q6',
    isCommon: true,
    videoId: 'video4',
    difficulty: 'medium',
    icon: '🧾',
    emoji: '🧾',
    tag: 'Video 4 • Tax-Saving Investments',
    question: 'Which of the following is a tax-saving investment option mentioned in the video?',
    options: [
      'Cryptocurrency trading',
      'ELSS',
      'Everyday shopping',
      'Personal entertainment expenses',
    ],
    answer: 1,
    hint: 'Look for the Equity Linked Savings Scheme discussed alongside PPF, NPS, and NSC.',
    explanation:
      'ELSS (Equity Linked Savings Scheme) is an eligible tax-saving investment option mentioned alongside PPF, NPS, NSC, and tax-saving FDs.',
  },
  {
    id: 'Q7',
    isCommon: true,
    videoId: 'video5',
    difficulty: 'medium',
    icon: '🧭',
    emoji: '🧭',
    tag: 'Video 5 • Smart Asset Allocation',
    question: 'What should you consider when choosing an investment?',
    options: [
      'Only the highest advertised return',
      'Only what your friends invest in',
      'Financial goals, risk tolerance, and investment duration',
      'Only the name of the investment provider',
    ],
    answer: 2,
    hint: 'Smart asset allocation matches investments to your personal situation and timeline.',
    explanation:
      'When choosing an investment, you should evaluate your financial goals, risk tolerance, and investment duration (time horizon).',
  },

  // ─── ALTERNATIVE QUESTIONS (Q8–Q20: Randomly Choose 3 Per Attempt) ───
  {
    id: 'Q8',
    isCommon: false,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '💰',
    emoji: '💰',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'What is capital in investing?',
    options: [
      'The initial money invested',
      'Money spent on entertainment',
      'A loan repayment date',
      'The increase in market prices',
    ],
    answer: 0,
    hint: 'It is the starting principal amount you put into an investment.',
    explanation:
      'Capital is the initial amount of money or financial principal that you put into an investment or business.',
  },
  {
    id: 'Q9',
    isCommon: false,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '🏦',
    emoji: '🏦',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'What is interest?',
    options: [
      'Money paid for groceries',
      'The extra money earned or paid on an amount of money',
      'The total amount of monthly expenses',
      'The value of a physical asset only',
    ],
    answer: 1,
    hint: 'Banks pay this on savings/FDs and charge it on loans.',
    explanation:
      'Interest is the extra money earned on savings/investments or paid as the cost of borrowing money.',
  },
  {
    id: 'Q10',
    isCommon: false,
    videoId: 'video3',
    difficulty: 'easy',
    icon: '⚖️',
    emoji: '⚖️',
    tag: 'Video 3 • Basic Financial Terms',
    question: 'Which is an example of a liability?',
    options: [
      'Savings kept for emergencies',
      'An investment account',
      'A loan that must be repaid',
      'Money received as salary',
    ],
    answer: 2,
    hint: 'Liabilities are financial obligations or debts that you owe to others.',
    explanation:
      'A loan that must be repaid is a liability because it represents a financial obligation owed to a lender.',
  },
  {
    id: 'Q11',
    isCommon: false,
    videoId: 'video1',
    difficulty: 'easy',
    icon: '💵',
    emoji: '💵',
    tag: 'Video 1 • Money & Investment',
    question: 'What does lump-sum investment mean?',
    options: [
      'Investing a large amount at one time',
      'Saving a small amount every week',
      'Paying monthly household bills',
      'Borrowing money for daily expenses',
    ],
    answer: 0,
    hint: 'Contrast a single one-time deposit with regular periodic installments.',
    explanation:
      'A lump-sum investment means investing a single large amount of money all at one time rather than in periodic installments.',
  },
  {
    id: 'Q12',
    isCommon: false,
    videoId: 'video2',
    difficulty: 'easy',
    icon: '🏛️',
    emoji: '🏛️',
    tag: 'Video 2 • Investment Options',
    question: 'Which investment generally offers a fixed interest rate for a chosen period?',
    options: ['Cryptocurrency', 'Individual stocks', 'Gold prices', 'Fixed Deposit'],
    answer: 3,
    hint: 'Its name directly describes locking in a deposit at a predetermined rate.',
    explanation:
      'A Fixed Deposit (FD) generally offers a fixed interest rate over a chosen tenure with lower risk.',
  },
  {
    id: 'Q13',
    isCommon: false,
    videoId: 'video2',
    difficulty: 'medium',
    icon: '📊',
    emoji: '📊',
    tag: 'Video 2 • Investment Options',
    question: 'What is a mutual fund?',
    options: [
      'A loan from a government office',
      "An investment pool managed according to a fund's strategy",
      'A bank account with no investment exposure',
      'A guaranteed method of earning profits',
    ],
    answer: 1,
    hint: 'Money from many investors is pooled together and invested according to a stated objective.',
    explanation:
      "A mutual fund pools money from multiple investors and invests it across assets such as stocks or bonds according to the fund's strategy.",
  },
  {
    id: 'Q14',
    isCommon: false,
    videoId: 'video2',
    difficulty: 'medium',
    icon: '⚡',
    emoji: '⚡',
    tag: 'Video 2 • Risk & Return',
    question: 'Which investment can experience rapid price fluctuations?',
    options: [
      'A fixed interest rate agreed in an FD',
      'A household budget',
      'Cryptocurrency',
      'A record of monthly expenses',
    ],
    answer: 2,
    hint: 'Digital currencies are known for high volatility and sharp price swings.',
    explanation:
      'Cryptocurrency is highly volatile and can experience rapid price fluctuations, carrying higher risk than fixed-income options.',
  },
  {
    id: 'Q15',
    isCommon: false,
    videoId: 'video4',
    difficulty: 'medium',
    icon: '🛡️',
    emoji: '🛡️',
    tag: 'Video 4 • Tax-Saving Investments',
    question: 'What is a possible purpose of a tax-saving investment?',
    options: [
      'Reducing eligible taxable income under applicable rules',
      'Removing every tax obligation automatically',
      'Guaranteeing the highest return',
      'Avoiding the need to understand an investment',
    ],
    answer: 0,
    hint: 'Eligible tax-saving instruments help lower tax liability legally within statutory limits.',
    explanation:
      'Tax-saving investments help reduce eligible taxable income and tax liability under applicable tax rules while building long-term savings.',
  },
  {
    id: 'Q16',
    isCommon: false,
    videoId: 'video4',
    difficulty: 'medium',
    icon: '🔒',
    emoji: '🔒',
    tag: 'Video 4 • Lock-in & Rules',
    question: "Why should investors check an investment's lock-in period?",
    options: [
      'It determines their monthly salary',
      'It guarantees a profit',
      'It removes market risk',
      'It indicates when withdrawals may be restricted',
    ],
    answer: 3,
    hint: 'During a lock-in period, you cannot freely withdraw your invested funds.',
    explanation:
      "An investment's lock-in period indicates the duration during which withdrawals are restricted or not permitted.",
  },
  {
    id: 'Q17',
    isCommon: false,
    videoId: 'video4',
    difficulty: 'easy',
    icon: '👧',
    emoji: '👧',
    tag: 'Video 4 • Government Schemes',
    question: 'Which scheme is designed to support savings for a girl child in India?',
    options: [
      'ELSS',
      'Sukanya Samriddhi Yojana',
      'Cryptocurrency',
      'An ordinary monthly budget',
    ],
    answer: 1,
    hint: 'This government-backed small savings scheme is specifically named for a girl child.',
    explanation:
      'Sukanya Samriddhi Yojana (SSY) is a Government of India savings scheme specifically designed to support the future education and savings of a girl child.',
  },
  {
    id: 'Q18',
    isCommon: false,
    videoId: 'video5',
    difficulty: 'medium',
    icon: '💧',
    emoji: '💧',
    tag: 'Video 5 • Smart Asset Allocation',
    question: 'What does liquidity refer to in investing?',
    options: [
      'How quickly an asset can be converted into cash without a significant loss in value',
      'The amount of tax automatically saved',
      'The total number of investments owned',
      'The guaranteed annual profit',
    ],
    answer: 0,
    hint: 'Think about how easily you can access your money when you need cash.',
    explanation:
      'Liquidity refers to how quickly and easily an asset can be converted into cash without a significant loss in value.',
  },
  {
    id: 'Q19',
    isCommon: false,
    videoId: 'video5',
    difficulty: 'medium',
    icon: '🧺',
    emoji: '🧺',
    tag: 'Video 5 • Smart Asset Allocation',
    question: 'Why might an investor diversify their investments?',
    options: [
      'To guarantee that every investment earns a profit',
      'To avoid setting financial goals',
      'To spread exposure across different investments',
      'To make every investment equally risky',
    ],
    answer: 2,
    hint: "Don't put all your eggs in one basket.",
    explanation:
      'Diversification spreads investment exposure across different asset classes to help manage and reduce overall portfolio risk.',
  },
  {
    id: 'Q20',
    isCommon: false,
    videoId: 'video5',
    difficulty: 'medium',
    icon: '🎯',
    emoji: '🎯',
    tag: 'Video 5 • Smart Asset Allocation',
    question: 'What is a key consideration when investing for a long-term goal?',
    options: [
      "Choosing solely based on a friend's recommendation",
      'Ignoring investment risk',
      'Selecting only assets that can be sold immediately',
      'Matching investment choices to the goal and time horizon',
    ],
    answer: 3,
    hint: 'Your investment choices should align with when you need the money and what the goal requires.',
    explanation:
      'When investing for a long-term goal, it is essential to match your investment choices to your specific goal, time horizon, and risk tolerance.',
  },
]

export function validateQuestionItem(item) {
  if (!item || typeof item !== 'object') return false
  if (!item.id || typeof item.question !== 'string' || !item.question.trim()) return false
  if (!Array.isArray(item.options) || item.options.length !== 4) return false
  if (item.options.some((opt) => typeof opt !== 'string' || !opt.trim())) return false
  if (typeof item.answer !== 'number' || item.answer < 0 || item.answer > 3) return false
  if (typeof item.explanation !== 'string' || !item.explanation.trim()) return false
  return true
}

export const LEVEL1_QUESTION_BANK = RAW_LEVEL1_QUESTION_BANK.filter(validateQuestionItem).map(
  (item, idx) => ({
    ...item,
    number: idx + 1,
    q: item.question,
    opts: item.options,
    ans: item.answer,
    explain: item.explanation,
    correctOptionText: item.options[item.answer],
  })
)

export const COMMON_QUIZ_QUESTIONS = LEVEL1_QUESTION_BANK.filter((q) => q.isCommon)
export const ALTERNATIVE_QUIZ_QUESTIONS = LEVEL1_QUESTION_BANK.filter((q) => !q.isCommon)

// Default 10-question export for backward compatibility
export const quizQuestions = [
  ...COMMON_QUIZ_QUESTIONS,
  ...ALTERNATIVE_QUIZ_QUESTIONS.slice(0, Math.max(0, 10 - COMMON_QUIZ_QUESTIONS.length)),
]

const QUIZ_ATTEMPT_STORAGE_KEY = 'l2i_quiz_attempt_v1'
export const QUIZ_QUESTIONS_PER_ATTEMPT = 10
export const QUIZ_COMMON_COUNT = 7
export const QUIZ_VARIED_COUNT = 3

/**
 * Preserves the exact correct-answer index mapping even if answer options are shuffled/reordered.
 */
export function resolveQuestionWithOptionOrder(question, optionOrder = [0, 1, 2, 3]) {
  if (!question) return null
  const validOrder =
    Array.isArray(optionOrder) &&
    optionOrder.length === 4 &&
    [0, 1, 2, 3].every((n) => optionOrder.includes(n))
      ? optionOrder
      : [0, 1, 2, 3]

  const mappedOptions = validOrder.map((origIdx) => question.options[origIdx])
  const mappedAnswer = validOrder.indexOf(question.answer)
  const safeAnswer =
    mappedAnswer >= 0
      ? mappedAnswer
      : Math.max(0, mappedOptions.indexOf(question.correctOptionText))

  return {
    ...question,
    options: mappedOptions,
    opts: mappedOptions,
    answer: safeAnswer,
    ans: safeAnswer,
    optionOrder: validOrder,
  }
}

/**
 * Reliable random-selection helper that picks:
 * - 7 common questions (Q1–Q7)
 * - 3 varied alternative questions from Q8–Q20
 * Ensures:
 * - No duplicate questions within a single quiz
 * - Varied selection across attempts (prioritizes least-recently-used alternatives & avoids repeating the last combination)
 * - Balanced coverage across the 5 videos and difficulty levels
 * - Graceful fallback if the question bank has fewer than 20 questions
 */
export function selectQuestionsForQuizAttempt(
  attemptHistory = [],
  bank = LEVEL1_QUESTION_BANK,
  options = { shuffleOptions: false }
) {
  const seenIds = new Set()
  const deduplicatedBank = (Array.isArray(bank) ? bank : LEVEL1_QUESTION_BANK).filter((q) => {
    if (!validateQuestionItem(q) || seenIds.has(q.id)) return false
    seenIds.add(q.id)
    return true
  })

  const commonPool = deduplicatedBank.filter((q) => q.isCommon)
  const alternativePool = deduplicatedBank.filter((q) => !q.isCommon)

  const selectedCommon = commonPool.slice(0, QUIZ_COMMON_COUNT)
  const targetTotal = Math.min(QUIZ_QUESTIONS_PER_ATTEMPT, deduplicatedBank.length)
  const neededVaried = Math.max(0, targetTotal - selectedCommon.length)

  // Count how many times each alternative question ID appeared in previous attempts
  const usageCounts = {}
  const recentSet = new Set()
  const safeHistory = Array.isArray(attemptHistory) ? attemptHistory : []
  if (safeHistory.length > 0) {
    const lastAttemptIds = safeHistory[safeHistory.length - 1]
    if (Array.isArray(lastAttemptIds)) {
      lastAttemptIds.forEach((id) => recentSet.add(id))
    }
  }
  safeHistory.forEach((idList) => {
    if (Array.isArray(idList)) {
      idList.forEach((id) => {
        usageCounts[id] = (usageCounts[id] || 0) + 1
      })
    }
  })

  // Track video coverage already provided by the 7 common questions
  const videoCounts = { video1: 0, video2: 0, video3: 0, video4: 0, video5: 0 }
  selectedCommon.forEach((q) => {
    if (q.videoId) videoCounts[q.videoId] = (videoCounts[q.videoId] || 0) + 1
  })

  // Fisher-Yates shuffle helper for unbiased randomness within equal-priority tiers
  const shuffleArray = (arr) => {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
    }
    return copy
  }

  const remainingAlternatives = shuffleArray(
    alternativePool.filter((q) => !selectedCommon.some((c) => c.id === q.id))
  )

  const selectedVaried = []
  while (selectedVaried.length < neededVaried && remainingAlternatives.length > 0) {
    // Score candidates: prefer unseen in immediately previous attempt, lower historical usage, and underrepresented videoId
    remainingAlternatives.sort((a, b) => {
      const aRecent = recentSet.has(a.id) ? 1 : 0
      const bRecent = recentSet.has(b.id) ? 1 : 0
      if (aRecent !== bRecent) return aRecent - bRecent

      const aUsage = usageCounts[a.id] || 0
      const bUsage = usageCounts[b.id] || 0
      if (aUsage !== bUsage) return aUsage - bUsage

      const aVidCount = videoCounts[a.videoId] || 0
      const bVidCount = videoCounts[b.videoId] || 0
      return aVidCount - bVidCount
    })

    const picked = remainingAlternatives.shift()
    selectedVaried.push(picked)
    if (picked.videoId) {
      videoCounts[picked.videoId] = (videoCounts[picked.videoId] || 0) + 1
    }
  }

  // Sort the 3 picked alternatives by their natural question bank order (Q8..Q20)
  selectedVaried.sort((a, b) => (a.number || 0) - (b.number || 0))

  // Combine 7 common + 3 varied (if bank had fewer common questions, top up gracefully without duplicates)
  const combined = [...selectedCommon, ...selectedVaried]
  if (combined.length < targetTotal) {
    for (const q of deduplicatedBank) {
      if (combined.length >= targetTotal) break
      if (!combined.some((item) => item.id === q.id)) {
        combined.push(q)
      }
    }
  }

  const optionOrders = {}
  const finalizedQuestions = combined.map((q) => {
    const order = options?.shuffleOptions
      ? shuffleArray([0, 1, 2, 3])
      : [0, 1, 2, 3]
    optionOrders[q.id] = order
    return resolveQuestionWithOptionOrder(q, order)
  })

  const selectedQuestionIds = finalizedQuestions.map((q) => q.id)
  const questionOrder = [...selectedQuestionIds]

  return {
    selectedQuestionIds,
    questionOrder,
    optionOrders,
    variedQuestionIds: selectedVaried.map((q) => q.id),
    questions: finalizedQuestions,
  }
}

/**
 * Reconstructs the ordered list of question objects from persisted questionOrder & optionOrders.
 */
export function hydrateQuestionsFromAttempt(attempt, bank = LEVEL1_QUESTION_BANK) {
  if (!attempt || !Array.isArray(attempt.questionOrder) || attempt.questionOrder.length === 0) {
    return null
  }
  const byId = new Map((Array.isArray(bank) ? bank : LEVEL1_QUESTION_BANK).map((q) => [q.id, q]))
  const seen = new Set()
  const hydrated = []

  for (const qId of attempt.questionOrder) {
    if (seen.has(qId)) continue
    const baseQ = byId.get(qId)
    if (!baseQ) continue
    seen.add(qId)
    const optOrder = attempt.optionOrders?.[qId] || [0, 1, 2, 3]
    hydrated.push(resolveQuestionWithOptionOrder(baseQ, optOrder))
  }

  const expectedCount = Math.min(QUIZ_QUESTIONS_PER_ATTEMPT, byId.size)
  if (hydrated.length !== expectedCount) {
    return null
  }
  return hydrated
}

/**
 * Calculates the quiz score accurately from the actual selected questions and recorded answers.
 * Supports answers keyed by question index (0..9) or question ID ('Q1'..'Q20').
 */
export function calculateQuizAttemptScore(questions = [], answers = {}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return { correctCount: 0, answeredCount: 0, totalQuestions: 0, score: 0 }
  }
  let correctCount = 0
  let answeredCount = 0

  questions.forEach((q, idx) => {
    const rawAns =
      answers[idx] !== undefined
        ? answers[idx]
        : answers[String(idx)] !== undefined
          ? answers[String(idx)]
          : answers[q.id]
    if (rawAns !== undefined && rawAns !== null) {
      answeredCount += 1
      if (Number(rawAns) === Number(q.answer)) {
        correctCount += 1
      }
    }
  })

  const totalQuestions = questions.length
  const score = Math.min(100, Math.round((correctCount / totalQuestions) * 100))
  return { correctCount, answeredCount, totalQuestions, score }
}

export function loadPersistedQuizAttempt(externalAttempt = null) {
  let candidate = externalAttempt
  if (!candidate || typeof candidate !== 'object' || !candidate.attemptId) {
    try {
      const raw = localStorage.getItem(QUIZ_ATTEMPT_STORAGE_KEY)
      if (raw) candidate = JSON.parse(raw)
    } catch {
      candidate = null
    }
  }
  if (!candidate || typeof candidate !== 'object' || !candidate.attemptId) {
    return null
  }

  const questions = hydrateQuestionsFromAttempt(candidate)
  if (!questions) return null

  const normalizedAnswers =
    candidate.answers && typeof candidate.answers === 'object' ? { ...candidate.answers } : {}
  const { correctCount, answeredCount, totalQuestions, score } = calculateQuizAttemptScore(
    questions,
    normalizedAnswers
  )
  const safeCurrentIdx = Math.max(
    0,
    Math.min(
      questions.length - 1,
      typeof candidate.currentQuestionIdx === 'number'
        ? candidate.currentQuestionIdx
        : answeredCount < questions.length
          ? answeredCount
          : questions.length - 1
    )
  )

  return {
    attemptId: String(candidate.attemptId),
    status: candidate.status === 'completed' ? 'completed' : 'in_progress',
    selectedQuestionIds: candidate.selectedQuestionIds || questions.map((q) => q.id),
    questionOrder: candidate.questionOrder || questions.map((q) => q.id),
    optionOrders: candidate.optionOrders || {},
    variedQuestionIds:
      candidate.variedQuestionIds ||
      questions.filter((q) => !q.isCommon).map((q) => q.id),
    answers: normalizedAnswers,
    currentQuestionIdx: safeCurrentIdx,
    score: typeof candidate.score === 'number' ? candidate.score : score,
    correctCount:
      typeof candidate.correctCount === 'number' ? candidate.correctCount : correctCount,
    totalQuestions,
    startedAt: candidate.startedAt || Date.now(),
    completedAt: candidate.completedAt || null,
    history: Array.isArray(candidate.history) ? candidate.history.slice(-15) : [],
    questions,
  }
}

export function savePersistedQuizAttempt(attempt, updateFn = null) {
  if (!attempt || !attempt.attemptId) return null
  const { questions, ...serializable } = attempt
  const payload = {
    attemptId: serializable.attemptId,
    status: serializable.status || 'in_progress',
    selectedQuestionIds:
      serializable.selectedQuestionIds ||
      (Array.isArray(questions) ? questions.map((q) => q.id) : []),
    questionOrder:
      serializable.questionOrder ||
      (Array.isArray(questions) ? questions.map((q) => q.id) : []),
    optionOrders: serializable.optionOrders || {},
    variedQuestionIds: serializable.variedQuestionIds || [],
    answers: serializable.answers || {},
    currentQuestionIdx: Number(serializable.currentQuestionIdx) || 0,
    score: Number(serializable.score) || 0,
    correctCount: Number(serializable.correctCount) || 0,
    totalQuestions:
      Number(serializable.totalQuestions) ||
      (Array.isArray(questions) ? questions.length : QUIZ_QUESTIONS_PER_ATTEMPT),
    startedAt: serializable.startedAt || Date.now(),
    completedAt: serializable.completedAt || null,
    updatedAt: Date.now(),
    history: Array.isArray(serializable.history) ? serializable.history.slice(-15) : [],
  }

  try {
    localStorage.setItem(QUIZ_ATTEMPT_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore storage errors
  }

  if (typeof updateFn === 'function') {
    updateFn({ quizAttempt: payload })
  }
  return payload
}

/**
 * Restores an existing in-progress (or completed, if allowCompleted=true) attempt on refresh/resume,
 * OR generates a brand-new attempt with 7 common + 3 varied questions when starting a new attempt.
 */
export function getOrCreateQuizAttempt(
  externalAttempt = null,
  options = { forceNew: false, allowCompleted: false, shuffleOptions: false }
) {
  const existing = loadPersistedQuizAttempt(externalAttempt)

  if (!options?.forceNew && existing) {
    if (existing.status === 'in_progress' || (options?.allowCompleted && existing.status === 'completed')) {
      return existing
    }
  }

  const prevHistory = existing?.history ? [...existing.history] : []
  if (existing?.variedQuestionIds?.length) {
    prevHistory.push(existing.variedQuestionIds)
  }

  const selection = selectQuestionsForQuizAttempt(prevHistory, LEVEL1_QUESTION_BANK, {
    shuffleOptions: Boolean(options?.shuffleOptions),
  })

  const newAttempt = {
    attemptId: `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'in_progress',
    selectedQuestionIds: selection.selectedQuestionIds,
    questionOrder: selection.questionOrder,
    optionOrders: selection.optionOrders,
    variedQuestionIds: selection.variedQuestionIds,
    answers: {},
    currentQuestionIdx: 0,
    score: 0,
    correctCount: 0,
    totalQuestions: selection.questions.length,
    startedAt: Date.now(),
    completedAt: null,
    history: prevHistory.slice(-15),
    questions: selection.questions,
  }

  savePersistedQuizAttempt(newAttempt)
  return newAttempt
}

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
        smartTip = `You have a long ${gapYears}-year gap period (Year ${item.years} to Year ${maxHorizon}). You can reinvest the matured amount of ${fmtINR(item.returns)} into long-term instruments like PPF, NSC, or another Fixed Deposit to earn additional compounding returns, or use it for major life goals.`
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


