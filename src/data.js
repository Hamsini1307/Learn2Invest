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
    q: 'What is the current PPF interest rate?',
    opts: ['6.5%', '7.1%', '8.0%', '7.5%'],
    ans: 1,
    hint: 'It is between 7% and 7.5%, and the interest is completely tax-free.',
    explain: 'PPF currently offers 7.1% per annum — completely tax-free under EEE category.',
    emoji: '🏦',
  },
  {
    q: 'What is the minimum lock-in period for PPF?',
    opts: ['5 years', '10 years', '15 years', '20 years'],
    ans: 2,
    hint: 'PPF is a long-term scheme — think more than 10 years.',
    explain: 'PPF has a mandatory 15-year lock-in. Partial withdrawal allowed from 7th year.',
    emoji: '⏳',
  },
  {
    q: 'Which scheme gives the HIGHEST interest rate?',
    opts: ['PPF', 'Fixed Deposit', 'NSC', 'Sukanya Samriddhi Yojana'],
    ans: 3,
    hint: 'This scheme is designed specifically for the girl child.',
    explain: 'SSY offers 8.2% — highest among all government small savings schemes in India.',
    emoji: '📈',
  },
  {
    q: 'NSC stands for?',
    opts: ['National Savings Certificate', 'National Securities Corporation', 'New Savings Corpus', 'None of the above'],
    ans: 0,
    hint: 'NSC is available at Post Offices across India — think Savings!',
    explain: 'NSC = National Savings Certificate — a 5-year Post Office savings scheme.',
    emoji: '📮',
  },
  {
    q: 'FD interest above ₹40,000 per year is subject to?',
    opts: ['GST', 'TDS', 'Income Tax Return only', 'No tax at all'],
    ans: 1,
    hint: 'Banks deduct this automatically — it stands for Tax Deducted at Source.',
    explain: 'TDS (Tax Deducted at Source) is automatically applied on FD interest above ₹40,000/year.',
    emoji: '💸',
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

export const chatResponses = [
  { keys: ['ppf', 'public provident'], reply: 'PPF offers 7.1% tax-free interest with a 15-year lock-in. Perfect for long-term wealth creation! Invest up to ₹1.5L/year. 💰' },
  { keys: ['fd', 'fixed deposit'], reply: 'Fixed Deposits offer 6.5–7.5% interest. Flexible tenure from 7 days to 10 years. Safe & guaranteed returns! 🏦' },
  { keys: ['nsc', 'national savings'], reply: 'NSC gives 7.7% for 5 years from Post Office. Great tax benefit under Section 80C! 📮' },
  { keys: ['ssy', 'sukanya'], reply: 'Sukanya Samriddhi Yojana gives 8.2% — highest government scheme! For girl children below 10 years. 👧' },
  { keys: ['tax', '80c', 'exempt'], reply: 'PPF, SSY are under EEE category — completely tax free. NSC and FD interest is taxable. 📊' },
  { keys: ['best', 'recommend', 'suggest'], reply: 'For students: Start with ₹500/month in PPF for long-term + ₹500 in RD. Small steps compound to big results! 🚀' },
  { keys: ['risk', 'safe', 'government'], reply: 'All schemes here (PPF, FD, NSC, SSY, RD) are government-backed — ZERO risk! Perfect for first-time investors. 🛡️' },
  { keys: ['start', 'begin', 'new'], reply: 'Start your journey in Beginner Level! Watch 4 videos → Take quiz → Unlock the Investment Simulator. Go! 🌱' },
  { keys: ['hi', 'hello', 'hey'], reply: 'Hello! 👋 I\'m your AI Investment Guide. Ask me about PPF, FD, NSC, SSY, or any investment tip!' },
  { keys: ['xp', 'points', 'score'], reply: 'Earn XP by watching lessons (+30 XP each) and completing the quiz (+150 XP). Unlock levels to earn more! ⭐' },
  { keys: ['video', 'lesson', 'watch'], reply: 'Head to Beginner Level to watch 4 short videos on PPF, FD, NSC and SSY. Each video earns you +30 XP! 🎬' },
  { keys: ['quiz', 'test', 'exam'], reply: 'The quiz has 5 questions. Score 60% or above to unlock the Intermediate level. You can retry if needed! 📝' },
]

export const advRates = { PPF: 7.1, FD: 7.25, NSC: 7.7, SSY: 8.2, RD: 6.5 }

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
