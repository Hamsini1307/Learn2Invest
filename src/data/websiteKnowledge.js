// ─────────────────────────────────────────────────────────────────────────────
// Learn2Invest — Ground Truth Website Knowledge Layer & Context Registry
// ─────────────────────────────────────────────────────────────────────────────

export const WEBSITE_INFO = {
  name: 'Learn2Invest',
  version: '2.0.0',
  tagline: 'Gamified Indian Investment Learning Simulator – 3D Interactive Edition',
  purpose:
    'Learn2Invest is an interactive educational simulator designed to teach students, young adults, and beginners practical Indian financial literacy. It bridges the gap between theoretical knowledge and real-world execution by letting users explore 3D worlds, run interactive compound interest and portfolio simulations, fill realistic bank slips, and learn digital banking safety — all with 100% risk-free virtual money.',
  targetAudience:
    'School students, college learners, young professionals, and anyone starting their financial journey in India who wants to understand budgeting, government savings schemes, investment diversification, and banking operations safely.',
  currency: 'Indian Rupee (₹)',
  virtualMoneyDisclaimer:
    'All investments, portfolio values, returns, and bank balances displayed in Learn2Invest use educational virtual money for simulation and training. No real money or actual bank accounts are ever involved.',
}

export const SCREEN_KNOWLEDGE = {
  garden: {
    id: 'garden',
    path: '/',
    title: '3D Campus Courtyard & Entrance',
    badge: '🌳 Campus Entrance',
    description:
      'The starting 3D courtyard of Learn2Invest. Here you can explore the campus, choose your 3D character (Luna or Leo), access the sign-in / registration portal, and walk into the School Building.',
    features: [
      'Interactive 3D walking world with camera controls and joystick support',
      'Character selection: Luna (female scholar) or Leo (male explorer)',
      '3D Login / Sign-Up Portal to save and load your learning journey',
      'Walk to the School Entrance door to step into the Level 1 Classroom',
    ],
    howToUse: [
      'Use WASD, arrow keys, or click/drag on the screen to walk around the courtyard.',
      'Click the 3D Auth Portal on the left side to Sign In or Create an Account.',
      'Walk towards the main School building or click the "Enter School" button to start Level 1.',
    ],
    suggestedQuestions: [
      'Explain this website.',
      'Help me navigate.',
      'Explain this page.',
      'How do I enter Level 1?',
      'How do I switch my 3D character?',
    ],
  },
  beginner: {
    id: 'beginner',
    path: '/school',
    title: 'Level 1: School Classroom',
    badge: '🏫 Level 1 School',
    description:
      'The foundational learning hub. Watch 5 bite-sized financial literacy video lessons on Indian savings schemes, then take the 10-question Examination Center quiz to test your knowledge and earn XP.',
    features: [
      '5 Core Video Lessons: PPF, Fixed Deposit (FD), NSC, Sukanya Samriddhi Yojana (SSY), and Financial Literacy Basics',
      '10-Question Examination Center covering interest rates, compounding, tax benefits, and risk',
      'Scoring 60% or higher (6/10) passes the exam, awards +100 XP, and unlocks Level 2 (Government District)',
      'Live animated reaction: Your mentor cheers for correct quiz answers!',
    ],
    howToUse: [
      'Step 1: Click any video card on the classroom screen to watch the lesson and review key bullet points.',
      'Step 2: After completing the videos, click the "Take Exam Quiz" button.',
      'Step 3: Answer the 10 questions. Review the hints and explanations provided for each question.',
      'Step 4: Reach at least 60% score to unlock Level 2: Government District Investment Lab.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'How do I unlock Level 2?',
      'What is PPF and why is it special?',
      'What is Sukanya Samriddhi Yojana?',
      'What score do I need on the quiz?',
    ],
  },
  intermediate: {
    id: 'intermediate',
    path: '/government-district',
    title: 'Level 2: Government District Investment Lab',
    badge: '🏛️ Level 2 Lab',
    description:
      'A hands-on financial simulation laboratory equipped with 3 interactive computer workstations for testing schemes, mixing allocations, and building diversified portfolios.',
    features: [
      'Workstation 1 — 6 Scheme Simulators: PPF (7.1%), FD (7.25%), NSC (7.7%), SSY (8.2%), RD (6.5%), and Post Office MIS (7.4%) with real-time compound interest calculation and interactive charts.',
      'Workstation 2 — Savings Mixer Studio: Sliders to allocate percentages across 5 schemes (must sum to 100%) and calculate blended interest return over 1 to 15 years.',
      'Workstation 3 — Portfolio Simulation: Combine the 6 Indian Government & Bank Schemes (PPF, FD, NSC, SSY, RD, MIS). Features Manual Allocation Mode and Smart Allocation Mode (algorithmic profit maximization) with Gap Period maturity analysis.',
      'Save Simulations: Save your custom lab calculations and portfolio mixes to revisit or edit later in the Saved Simulations manager.',
    ],
    howToUse: [
      'Step 1: Walk to or click Computer 1 to test individual government schemes with different monthly deposits and tenures.',
      'Step 2: Open Computer 2 (Savings Mixer) to distribute your monthly savings across schemes until total equals 100%.',
      'Step 3: Access Computer 3 (Portfolio Sim) to add asset rows, choose "Manual" or "Smart Allocation", and see total returns, profits, and gap periods.',
      'Step 4: Click "Save Simulation" to keep a copy in your personal portfolio vault.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'What is Smart Allocation?',
      'What is a Gap Period in portfolio simulation?',
      'How does the Savings Mixer work?',
      'Which scheme gives the highest guaranteed interest rate?',
    ],
  },
  advanced: {
    id: 'advanced',
    path: '/futuristic-city',
    title: 'Level 3: Futuristic City Banking Hub & Tower',
    badge: '🌆 Level 3 Banking',
    description:
      'The real-world banking operations and cybersecurity center. Practice filling authentic Indian bank slips for top institutions, understand counterfoils, and test your scam detection skills.',
    features: [
      'Authentic Bank Slips Practice: Cash Deposit Pay-In Slips, Cash Withdrawal Slips, and Cheques for 5 institutions: State Bank of India (SBIN0000840), Punjab National Bank (PUNB0034200), Canara Bank (CNRB0001001), Karnataka Bank (KARB0000501), and Post Office Savings Bank (IPOS0000001).',
      'Dual-Part Slips: Understand the Left Counterfoil (customer receipt with cashier seal) vs Right Bank Copy (retained by bank).',
      'Field Validation: Accurate entries for Date, Account Number, IFSC code, Amount in Figures, Amount in Words, and Depositor Signature.',
      'Cyber Safety & Scam Detector: Interactive scenarios teaching safe digital banking — spotting fake SMS, emergency lottery traps, and strict OTP / UPI PIN protection.',
    ],
    howToUse: [
      'Step 1: Select a bank cabin (e.g., State Bank of India or Canara Bank).',
      'Step 2: Choose a slip type: Cash Deposit, Cash Withdrawal, or Cheque.',
      'Step 3: Fill in all designated boxes: Account number, Date, Rupee amount, and Amount in words.',
      'Step 4: Submit to verify your slip for accuracy and receive approval seal and XP.',
      'Step 5: Head to the Cyber Safety station to analyze simulated phishing messages and learn security golden rules.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'How do I fill out a bank deposit slip?',
      'What is a counterfoil and why is it important?',
      'What is an IFSC code?',
      'What are the golden rules of cyber safety?',
    ],
  },
  'level-map': {
    id: 'level-map',
    path: '/campus-map',
    title: 'Campus Map & Progression Roadmap',
    badge: '🗺️ Campus Map',
    description:
      'A bird’s-eye navigation map showing your character’s current location, unlocked levels, completion percentages, and fast-travel portals.',
    features: [
      'Visual path connecting Level 1 School, Level 2 Government District, and Level 3 Futuristic City',
      'Progress meters showing videos watched, quiz scores, and completed modules',
      'Lock/Unlock status indicators for all districts',
      'Direct one-click fast travel to any unlocked area',
    ],
    howToUse: [
      'Click on any unlocked building node (School, Government District, Futuristic City) to travel there directly.',
      'Hover over buildings to inspect completion requirements and locked criteria.',
    ],
    suggestedQuestions: [
      'Help me navigate.',
      'Explain this page.',
      'Where should I go next?',
      'How do I unlock Level 3?',
    ],
  },
  'saved-simulations': {
    id: 'saved-simulations',
    path: '/saved-simulations',
    title: 'Saved Simulations Vault',
    badge: '📁 Saved Vault',
    description:
      'Your personal repository of saved investment calculations and customized portfolios. View, edit inputs, recalculate returns, and manage multiple financial plans.',
    features: [
      'Dual folder organization: Lab Calculations (Computer 1 & 2) and Portfolio Mixes (Computer 3)',
      'Live recalculation engine: update deposit amounts, interest rates, or tenures and see updated returns instantly',
      'Detailed breakdown of total invested, maturity value, net profit, and profit percentage',
      'Delete and rename controls',
    ],
    howToUse: [
      'Switch between the "Lab Simulations" and "Portfolio Simulations" tabs at the top.',
      'Click any saved card to view its complete financial breakdown.',
      'Click "Edit" to adjust monthly deposits, rates, or time horizons and save the updated plan.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'How do I edit a saved simulation?',
      'What is the difference between Lab and Portfolio simulations?',
    ],
  },
  admin: {
    id: 'admin',
    path: '/admin',
    title: 'Admin Control Panel',
    badge: '🛡️ Admin Panel',
    description:
      'Administrative monitoring dashboard restricted to authorized administrators. Provides platform-wide user analytics and account management tools.',
    features: [
      'Authorized access only (emails containing "admin" or designated admin accounts like hamsini@example.com)',
      'Platform statistics: Total registered learners, cumulative XP banked, and average quiz score',
      'User management table with search and filter capabilities',
      'Administrative account deletion with cascade cleanup',
    ],
    howToUse: [
      'Search for any user by name or email using the search bar.',
      'Review user learning status (start level, XP, watched videos, quiz score).',
      'Click "Delete" to permanently remove an account when required.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'Who can access this admin panel?',
      'What user metrics are tracked?',
    ],
  },
  quiz: {
    id: 'quiz',
    path: '/quiz',
    title: 'Level 1 Examination Center',
    badge: '📝 Exam Quiz',
    description:
      'A 10-question multiple choice test evaluating your understanding of savings, compounding, government schemes, and financial planning.',
    features: [
      '10 questions with 4 options each, helpful hints, and full explanations',
      'Real-time scoring and instant feedback on correct/wrong answers',
      'Passing score: 60% (6/10) to pass and earn +100 XP',
    ],
    howToUse: [
      'Read each question carefully and select the best answer.',
      'Click "Submit Answer" to see if you were correct along with the full financial explanation.',
      'Complete all 10 questions to see your final score card.',
    ],
    suggestedQuestions: [
      'Explain this page.',
      'What happens if I fail the quiz?',
      'Can I retake the quiz to improve my score?',
    ],
  },
}

export const INDIAN_SCHEMES_EXPLAINED = {
  PPF: {
    name: 'Public Provident Fund (PPF)',
    rate: '7.1% per annum',
    tenure: '15 years (extendable in 5-year blocks)',
    minDeposit: '₹500 / year',
    maxDeposit: '₹1.5 Lakh / year',
    taxStatus: 'EEE (Exempt-Exempt-Exempt) under Section 80C',
    safety: '100% Sovereign Guarantee (backed by Government of India)',
    summary:
      'PPF is India’s premier long-term savings instrument. The interest is compounded annually and completely tax-free on investment, accrual, and withdrawal.',
  },
  FD: {
    name: 'Fixed Deposit (Bank FD)',
    rate: '6.5% – 7.5% per annum',
    tenure: '7 days to 10 years (highly flexible)',
    minDeposit: '₹1,000',
    maxDeposit: 'No maximum limit',
    taxStatus: 'Interest taxable under your income tax slab; 5-year tax-saving FDs qualify for Section 80C deduction.',
    safety: 'Insured up to ₹5 Lakh per bank by DICGC (RBI subsidiary)',
    summary:
      'A lump-sum deposit with a bank for a fixed period at a guaranteed interest rate. Senior citizens typically receive 0.5% higher interest.',
  },
  NSC: {
    name: 'National Savings Certificate (NSC)',
    rate: '7.7% per annum',
    tenure: '5 years (fixed)',
    minDeposit: '₹1,000',
    maxDeposit: 'No maximum limit',
    taxStatus: 'Eligible for Section 80C deduction; interest is reinvested annually',
    safety: '100% Sovereign Guarantee (Post Office / Government of India)',
    summary:
      'A safe 5-year post office investment scheme with high guaranteed returns and automated compounding.',
  },
  SSY: {
    name: 'Sukanya Samriddhi Yojana (SSY)',
    rate: '8.2% per annum (highest among small savings schemes)',
    tenure: 'Matures when girl child turns 21 (deposits required for 15 years)',
    minDeposit: '₹250 / year',
    maxDeposit: '₹1.5 Lakh / year',
    taxStatus: 'EEE category (Exempt-Exempt-Exempt) under Section 80C',
    safety: '100% Sovereign Guarantee',
    summary:
      'Government initiative exclusively for girl children below 10 years of age, offering the highest government guaranteed interest rate in India.',
  },
  RD: {
    name: 'Recurring Deposit (RD)',
    rate: '6.5% – 7.0% per annum',
    tenure: '6 months to 10 years',
    minDeposit: '₹100 / month',
    maxDeposit: 'No maximum limit',
    taxStatus: 'Interest taxable under investor’s income tax slab',
    safety: 'Bank-backed and DICGC insured up to ₹5 Lakh',
    summary:
      'Ideal for disciplined monthly savings from regular salary or allowance, earning compounded interest each quarter.',
  },
  MIS: {
    name: 'Post Office Monthly Income Scheme (POMIS)',
    rate: '7.4% per annum',
    tenure: '5 years',
    minDeposit: '₹1,000',
    maxDeposit: '₹9 Lakh (single account) or ₹15 Lakh (joint account)',
    taxStatus: 'Monthly interest is taxable',
    safety: '100% Sovereign Guarantee',
    summary:
      'Designed for individuals seeking a dependable monthly payout while keeping the principal deposit completely safe.',
  },
}

export const BANKING_OPERATIONS_KNOWLEDGE = {
  depositSlip: {
    name: 'Cash Deposit Pay-In Slip',
    description:
      'Used to deposit cash or cheques into a savings or current account. It consists of two connected parts:',
    parts: [
      'Left Side (Counterfoil / Customer Copy): Given back to you with the cashier seal and signature as official legal proof that the bank received your money.',
      'Right Side (Bank Copy): Kept by the cashier to debit cash and credit your bank account in the core banking system.',
    ],
    requiredFields: [
      'Date (top right, DD/MM/YYYY)',
      'Account Number (must be written accurately in the designated boxes)',
      'Account Holder Name',
      'IFSC Code (11-character code identifying the bank branch, e.g., SBIN0000840)',
      'Amount in Figures (e.g. ₹5,000/-)',
      'Amount in Words (e.g. "Five Thousand Rupees Only")',
      'Cash Denominations Breakdown (number of ₹500, ₹200, ₹100 notes)',
      'Signature of Depositor',
    ],
  },
  cyberSafety: {
    name: 'Digital Banking Safety Golden Rules',
    rules: [
      'Rule 1: NEVER share your 6-digit One-Time Password (OTP) or UPI PIN with anyone, including bank managers, police, or callers claiming urgent account suspension.',
      'Rule 2: A UPI PIN is ONLY entered to SEND money or check balance. You NEVER need to enter your UPI PIN to RECEIVE money.',
      'Rule 3: Beware of urgent SMS messages containing shortened links (e.g., bit.ly) claiming "Your SIM will be blocked" or "Your electricity will be cut off".',
      'Rule 4: Always verify the bank website URL begins with "https://" and check for the official green security padlock icon.',
    ],
  },
}

export const NAVIGATION_SHORTCUTS = [
  { label: '🌳 Campus Yard', path: '/', screen: 'garden' },
  { label: '🏫 Level 1 School', path: '/school', screen: 'beginner' },
  { label: '🏛️ Level 2 Lab', path: '/government-district', screen: 'intermediate' },
  { label: '🌆 Level 3 Banking', path: '/futuristic-city', screen: 'advanced' },
  { label: '🗺️ Campus Map', path: '/campus-map', screen: 'level-map' },
  { label: '📁 Saved Sims', path: '/saved-simulations', screen: 'saved-simulations' },
  { label: '🛡️ Admin Panel', path: '/admin', screen: 'admin' },
]

/**
 * Returns tailored suggested questions based on the active screen.
 */
export function getContextualSuggestions(screenId) {
  const s = SCREEN_KNOWLEDGE[screenId]
  if (s && s.suggestedQuestions) {
    return s.suggestedQuestions
  }
  return [
    'Explain this website.',
    'Help me navigate.',
    'Explain this page.',
    'Explain the displayed data.',
    'Show me how to use a feature.',
  ]
}
