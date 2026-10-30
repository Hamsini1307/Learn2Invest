// ═══════════════════════════════════════════════════════════════════════════════
// Comprehensive Indian Financial Knowledge Engine for Learn2Invest Server
// ═══════════════════════════════════════════════════════════════════════════════

export function getFinancialKnowledgeAnswer(query, currentScreen = 'Campus') {
  if (!query || typeof query !== 'string') return null
  const q = query.toLowerCase().trim()

  // ─── 0. NUMERIC INVESTMENT ALLOCATION PROMPTS ───
  const numMatch = query.replace(/,/g, '').match(/\b(\d{3,9})\b/)
  if (
    numMatch &&
    (q.includes('invest') ||
      q.includes('put') ||
      q.includes('have') ||
      q.includes('allocate') ||
      q.includes('money') ||
      q.includes('rupee'))
  ) {
    const total = parseFloat(numMatch[1])
    if (total > 0) {
      const eq = Math.round(total * 0.5)
      const debt = Math.round(total * 0.3)
      const liq = total - eq - debt
      return `Here is your smart asset allocation for **₹${total.toLocaleString('en-IN')}**:

* **50% (~₹${eq.toLocaleString('en-IN')})** — **Index Mutual Funds** (e.g. Nifty 50) for long-term compounding and beating inflation.
* **30% (~₹${debt.toLocaleString('en-IN')})** — **Safe Fixed Income** (PPF at 7.1% or Bank FD at 7.25%) for guaranteed capital protection.
* **20% (~₹${liq.toLocaleString('en-IN')})** — **Liquid Cash / Emergency Savings** (Liquid Mutual Fund or High-yield Savings) for unexpected needs.

💡 *Rule of Thumb*: Invest equity for 5+ year horizons, and keep debt/cash for near-term stability.`
    }
  }

  // ─── 1. ELSS (Equity Linked Savings Scheme) ───
  if (
    /\belss\b/.test(q) ||
    q.includes('equity linked') ||
    (q.includes('tax saving') && q.includes('fund'))
  ) {
    return `**Equity Linked Savings Scheme (ELSS)** 📈🏛️
ELSS is an equity-oriented mutual fund that qualifies for tax deduction under **Section 80C** of the Indian Income Tax Act.

* **Tax Benefit**: Deduct up to **₹1.5 Lakh per year** from your taxable income (saving up to ₹46,800 in tax in the old tax regime).
* **Shortest Lock-in Period**: Only **3 years** — the shortest lock-in among all Section 80C investments (Tax FD is 5 yrs, NSC is 5 yrs, PPF is 15 yrs).
* **High Growth Potential**: Invests 65%+ in Indian equity stocks. Historically delivers **~12% – 15% long-term annualized returns**.
* **Tax on Gains (LTCG)**: Long-Term Capital Gains up to ₹1.25 Lakh per financial year are **100% tax-free**. Gains above ₹1.25 Lakh are taxed at 12.5%.
* **How to Invest**: You can invest via monthly **SIP** (e.g., ₹500 to ₹5,000/month) or as a lump sum.`
  }

  // ─── 2. SIP (Systematic Investment Plan) ───
  if (
    /\bsip\b/.test(q) ||
    q.includes('systematic investment') ||
    q.includes('monthly investment')
  ) {
    return `**Systematic Investment Plan (SIP)** 🔄
A disciplined method of investing a fixed sum into mutual funds at regular intervals (monthly or quarterly).

* **Rupee-Cost Averaging**: You buy more mutual fund units when markets fall, and fewer units when markets rise. You never have to time the market!
* **Power of Compounding**: Investing just **₹2,000/month** for 15 years at an expected 12% return can grow to **over ₹10 Lakhs** (on ₹3.6 Lakhs deposited).
* **Low Minimum**: Start investing with as little as **₹100 to ₹500 per month**.
* **Flexibility**: You can pause, modify, step up (increase by 10% each year), or stop your SIP anytime without penalty.`
  }

  // ─── 3. MUTUAL FUNDS & INDEX FUNDS ───
  if (
    q.includes('mutual fund') ||
    q.includes('index fund') ||
    q.includes('nifty 50') ||
    q.includes('sensex') ||
    /\bnav\b/.test(q) ||
    q.includes('expense ratio')
  ) {
    return `**Mutual Funds & Index Funds Guide** 📊
* **What is a Mutual Fund?**: A trust that pools money from thousands of investors to purchase a diversified portfolio of stocks, bonds, or government securities managed by professional Fund Managers.
* **Index Funds (e.g. Nifty 50 / Sensex)**: Passively replicate India's top 50 largest companies. They have **ultra-low fees (expense ratio ~0.1% to 0.3%)** and historically beat most actively managed funds over 10+ year periods.
* **NAV (Net Asset Value)**: The per-unit market price of the fund, recalculated at the end of every trading day.
* **Diversification**: Instead of risking all money on one single company stock, a mutual fund spreads risk across 40 to 60 blue-chip companies.`
  }

  // ─── 4. DIRECT STOCKS VS MUTUAL FUNDS & DEMAT ───
  if (
    /\bstock\b/.test(q) ||
    /\bshares\b/.test(q) ||
    /\bdemat\b/.test(q) ||
    /\bsebi\b/.test(q) ||
    q.includes('stock market')
  ) {
    return `**Stocks, Demat & The Stock Market** 🏢📈
* **Shares / Stocks**: Buying a share means purchasing fractional equity ownership in a company (e.g., Tata Motors, Infosys, Reliance). If the company profits grow, share prices rise and they may pay dividends.
* **Demat Account**: A digital depository account (managed by NSDL or CDSL) that holds your shares and bonds in electronic form instead of paper certificates.
* **SEBI**: The **Securities and Exchange Board of India** — the apex market regulator safeguarding retail investor interests and enforcing strict financial disclosures.
* **Stocks vs. Mutual Funds**: Direct stocks offer higher potential gains but require deep research and carry individual company risk. Mutual funds offer instant diversification for beginners.`
  }

  // ─── 5. PPF (Public Provident Fund) ───
  if (
    /\bppf\b/.test(q) ||
    q.includes('public provident')
  ) {
    return `**Public Provident Fund (PPF)** 🏦
A government-backed long-term small savings scheme designed for retirement capital accumulation.

* **Interest Rate**: **7.1% per annum** (compounded annually, backed by Government of India).
* **Tenure**: 15-year lock-in period (can be extended indefinitely in 5-year blocks).
* **Deposit Limits**: Minimum ₹500/year, Maximum ₹1.5 Lakh/year.
* **Exempt-Exempt-Exempt (EEE) Status**:
  1. Deposits qualify for Section 80C tax deduction.
  2. Interest earned is **100% tax-free**.
  3. Entire maturity proceeds are **100% tax-free**.
* **Safety**: 100% Sovereign Guarantee with complete legal immunity from debt attachment.`
  }

  // ─── 6. FIXED DEPOSIT (FD) ───
  if (
    /\bfd\b/.test(q) ||
    q.includes('fixed deposit') ||
    q.includes('term deposit')
  ) {
    return `**Bank Fixed Deposit (FD)** 💳
A traditional deposit where you park a lump sum for a predetermined period at a guaranteed interest rate.

* **Interest Rate**: Typically **6.5% to 7.5% per annum** depending on the bank and tenure.
* **Senior Citizens**: Receive an extra **+0.50% interest rate bonus** (up to 8.0%+).
* **Tenure**: Flexible from 7 days to 10 years.
* **Safety (DICGC Insurance)**: Deposits up to **₹5 Lakh** (principal + interest) per bank are guaranteed by the Reserve Bank of India subsidiary (DICGC).
* **Taxation**: Regular FD interest is added to your income and taxed according to your slab. 5-Year Tax Saver FDs qualify under Section 80C.`
  }

  // ─── 7. SUKANYA SAMRIDDHI YOJANA (SSY) ───
  if (
    /\bssy\b/.test(q) ||
    q.includes('sukanya') ||
    q.includes('girl child scheme')
  ) {
    return `**Sukanya Samriddhi Yojana (SSY)** 👧✨
A high-interest government savings initiative specifically created for the welfare and higher education of girl children.

* **Highest Interest Rate**: **8.2% per annum** — the highest interest among all Indian small savings schemes!
* **Eligibility**: Opened for any girl child below the age of **10 years** (max 2 accounts per family).
* **Maturity**: 21 years from account opening (deposits required only for the first 15 years).
* **Deposit Limits**: Minimum ₹250/year, Maximum ₹1.5 Lakh/year.
* **Tax Status**: Fully **EEE (Exempt-Exempt-Exempt)** — tax-free investment under 80C, tax-free interest, tax-free maturity.`
  }

  // ─── 8. NSC (National Savings Certificate) ───
  if (
    /\bnsc\b/.test(q) ||
    q.includes('national savings certificate')
  ) {
    return `**National Savings Certificate (NSC)** 📮
A 5-year post office fixed income security backed by the Government of India.

* **Interest Rate**: **7.7% per annum** (compounded annually, paid at maturity).
* **Tenure**: Fixed 5-year lock-in period.
* **Tax Deduction**: Deposits qualify under Section 80C up to ₹1.5 Lakh.
* **Reinvestment Feature**: The interest accrued during the first 4 years is deemed reinvested and also qualifies under Section 80C!
* **Safety**: Sovereign guarantee with zero market volatility.`
  }

  // ─── 9. RD (Recurring Deposit) ───
  if (
    /\brd\b/.test(q) ||
    q.includes('recurring deposit')
  ) {
    return `**Recurring Deposit (RD)** 📅
A systematic savings account offered by Indian banks and Post Offices for salaried individuals and students.

* **How it Works**: You deposit a fixed amount (e.g. ₹1,000, ₹5,000) every month on a set date for a chosen tenure (6 months to 10 years).
* **Interest Rate**: Similar to bank FDs (**6.5% – 7.1% p.a.**).
* **Ideal For**: Building disciplined monthly saving habits for short-term goals (festivals, school fees, buying a gadget).`
  }

  // ─── 10. NPS (National Pension System) ───
  if (
    /\bnps\b/.test(q) ||
    q.includes('national pension') ||
    q.includes('pension scheme')
  ) {
    return `**National Pension System (NPS)** 🏛️👴
A government-sponsored, market-linked retirement scheme regulated by PFRDA.

* **Exclusive Tax Benefit**:
  1. Standard **₹1.5 Lakh** under Section 80CCD(1).
  2. **Additional exclusive ₹50,000 tax deduction** under Section 80CCD(1B) — allowing a total deduction of up to **₹2 Lakhs**!
* **Asset Choice**: You decide asset allocation across Equity (E, up to 75%), Corporate Bonds (C), and Government Securities (G).
* **At Retirement (Age 60)**:
  * **60%** of the accumulated corpus can be withdrawn completely **tax-free**.
  * **40%** is used to purchase an Annuity plan for guaranteed monthly pension for life.`
  }

  // ─── 11. SOVEREIGN GOLD BONDS (SGB) & GOLD ───
  if (
    /\bsgb\b/.test(q) ||
    q.includes('sovereign gold') ||
    q.includes('gold bond') ||
    q.includes('gold etf') ||
    q.includes('digital gold')
  ) {
    return `**Sovereign Gold Bonds (SGB) & Gold ETFs** 🪙✨
The smartest and safest way to invest in gold in India without physical jewelry making charges or storage lockers.

* **Issued by**: Reserve Bank of India (RBI) on behalf of the Government of India.
* **Extra 2.5% Annual Interest**: You earn **2.50% interest per year** on your initial investment amount, paid half-yearly into your bank account!
* **Tax-Free Capital Gains**: If held until full maturity (8 years), all capital appreciation is **100% exempt from capital gains tax**!
* **Pure Gold Value**: The bond value tracks 999 purity gold prices. No jeweler deduction, no GST on making charges.`
  }

  // ─── 12. INFLATION & PURCHASING POWER ───
  if (
    q.includes('inflation') ||
    q.includes('purchasing power') ||
    q.includes('price rise') ||
    q.includes('cost of living')
  ) {
    return `**What is Inflation & Why Must You Beat It?** 📉💸
Inflation is the rate at which the general prices of goods and services rise over time, eroding your money's buying power.

* **The Reality**: In India, consumer inflation averages around **~5% to 6% per year**. An item costing ₹100 today will cost ~₹180 in 10 years!
* **The Savings Account Trap**: A regular bank savings account pays ~2.7% – 3.0% interest. After 6% inflation, you **lose ~3% real wealth every year**!
* **How to Beat Inflation**:
  * Keep emergency funds in Bank FDs or Liquid Funds.
  * Invest wealth meant for 5+ years into **Equity Index Mutual Funds (12-14% historical returns)** and **PPF (7.1% tax-free)**.`
  }

  // ─── 13. COMPOUNDING & RULE OF 72 ───
  if (
    q.includes('compounding') ||
    q.includes('compound interest') ||
    q.includes('rule of 72') ||
    q.includes('double money')
  ) {
    return `**The Magic of Compounding & Rule of 72** 🪄📈
Compounding is earning interest on your interest, creating an exponential growth curve over time.

* **The Rule of 72**: A fast mental formula to calculate how many years it takes for your investment to double!
  $$\\text{Years to Double} = \\frac{72}{\\text{Annual Interest Rate}}$$
* **Real-World Examples**:
  * **At 12% (Equity Mutual Funds)**: $72 \\div 12 =$ **6 years** to double!
  * **At 7.2% (PPF / Senior FD)**: $72 \\div 7.2 =$ **10 years** to double.
  * **At 3.6% (Savings Account)**: $72 \\div 3.6 =$ **20 years** to double!
* **Takeaway**: Starting early is far more important than investing large sums later.`
  }

  // ─── 14. 50-30-20 BUDGETING & EMERGENCY FUND ───
  if (
    q.includes('50 30 20') ||
    q.includes('50/30/20') ||
    q.includes('emergency fund') ||
    q.includes('how to budget') ||
    q.includes('how much to save')
  ) {
    return `**50-30-20 Rule & The Emergency Fund** 🛡️💰
* **The 50-30-20 Golden Budget**:
  1. **50% Needs**: Essential living expenses (Rent, groceries, utility bills, EMI, medicines).
  2. **30% Wants**: Lifestyle choices (Dining out, streaming subscriptions, shopping, travel).
  3. **20% Savings & Wealth**: Compulsory investments (SIPs, PPF, emergency fund, debt paydown).
* **The Emergency Fund**:
  * Set aside **3 to 6 months of mandatory living expenses** in a safe, instantly accessible account (High-yield Savings or Sweep-in FD).
  * Never invest your emergency money in volatile stocks or locked-in schemes!`
  }

  // ─── 15. CIBIL & CREDIT SCORE ───
  if (
    /\bcibil\b/.test(q) ||
    q.includes('credit score') ||
    q.includes('credit report')
  ) {
    return `**CIBIL Score & Credit Health** 💳📊
Your CIBIL score is a 3-digit numerical summary (ranging from **300 to 900**) of your credit and loan repayment history.

* **Score Ranges**:
  * **750 – 900 (Excellent)**: Instant loan approvals, lowest home loan interest rates, pre-approved credit cards.
  * **650 – 749 (Fair/Good)**: Standard rates, requires scrutiny.
  * **Below 650 (Poor)**: High risk of loan rejection or penal interest rates.
* **How to Maintain a 750+ Score**:
  1. Always pay **100% of your credit card bill on time** before the due date.
  2. Keep credit utilization below **30% of your total credit limit**.
  3. Avoid applying for multiple credit cards or loans simultaneously.`
  }

  // ─── 16. DEBIT CARD VS CREDIT CARD ───
  if (
    q.includes('debit card') ||
    q.includes('credit card') ||
    (q.includes('difference') && q.includes('card'))
  ) {
    return `**Debit Card vs. Credit Card Explained** 💳⚡
* **Debit Card (Your Own Money)**:
  * Deducts money directly from your linked bank savings balance.
  * Zero debt or interest risk. Ideal for daily cash withdrawals at ATMs.
* **Credit Card (Bank's Pre-Approved Credit Line)**:
  * The bank pays on your behalf; you receive a monthly statement with a **45 to 50 day interest-free period**.
  * Offers reward points, flight discounts, cashback, and fraud protection.
* **⚠️ The Golden Rule**: Always pay the **Total Amount Due** in full. If you only pay the "Minimum Amount Due", banks charge **36% to 42% annualized interest**!`
  }

  // ─── 17. BANK TRANSFERS: UPI, NEFT, RTGS, IMPS ───
  if (
    /\bupi\b/.test(q) ||
    /\bneft\b/.test(q) ||
    /\brtgs\b/.test(q) ||
    /\bimps\b/.test(q) ||
    q.includes('money transfer')
  ) {
    return `**Indian Electronic Money Transfers Comparison** 📲🏛️
1. **UPI (Unified Payments Interface)**:
   * **Speed**: Instant 24/7/365.
   * **Identifier**: Mobile number or VPA (e.g., name@okhdfcbank).
   * **Limit**: Standard limit up to **₹1 Lakh/day** (₹5 Lakhs for hospital and educational fees).
2. **IMPS (Immediate Payment Service)**:
   * **Speed**: Instant 24/7 transfer up to **₹5 Lakhs** using Account Number + IFSC.
3. **NEFT (National Electronic Funds Transfer)**:
   * **Speed**: Settles in half-hourly batches 24/7.
   * **Limits**: No minimum or maximum limit. Zero charges for retail online users.
4. **RTGS (Real Time Gross Settlement)**:
   * **Speed**: Continuous, immediate gross settlement for large sums.
   * **Minimum Amount**: **₹2,00,000 (₹2 Lakhs)**.`
  }

  // ─── 18. IFSC & MICR CODES ───
  if (
    /\bifsc\b/.test(q) ||
    /\bmicr\b/.test(q)
  ) {
    return `**IFSC & MICR Codes Explained** 🏦🔍
* **IFSC (Indian Financial System Code)**:
  * An **11-character alphanumeric code** uniquely identifying a specific bank branch for NEFT, RTGS, and IMPS.
  * Format: First 4 characters = Bank name (e.g. \`SBIN\`), 5th character = \`0\` (reserved), last 6 characters = Specific branch identifier.
* **MICR (Magnetic Ink Character Recognition)**:
  * A **9-digit numeric code** printed on the bottom of cheque leaves.
  * Used for automated optical reading and processing of paper cheques in the RBI's Cheque Truncation System (CTS-2010).`
  }

  // ─── 19. BANK DEPOSIT SLIPS & COUNTERFOIL (CABIN 1) ───
  if (
    q.includes('slip') ||
    q.includes('counterfoil') ||
    q.includes('bank form') ||
    (q.includes('fill') && q.includes('deposit'))
  ) {
    return `**How to Fill an Indian Bank Deposit Slip** 🏛️✍️
In [Level 3 Banking Cabin 1], you can practice filling real bank deposit slips for SBI, PNB, Canara Bank, and Karnataka Bank!

1. **Left Counterfoil (Customer Copy)**:
   * The bank teller stamps and initials this part with the bank seal and returns it to you.
   * It is your **legal proof and receipt** that the bank received your cash/cheque!
2. **Right Section (Bank Copy)**:
   * Retained by the cashier/teller to credit your account.
3. **Key Required Fields**:
   * **Date**: Top right corner.
   * **Account Number**: Write clearly in the account grid.
   * **Account Holder Name**: Enter your registered name.
   * **Cash Denominations**: Break down the note count (e.g. 10 notes of ₹500 = ₹5,000).
   * **Amount in Words**: e.g., "Five Thousand Rupees Only".
   * **Depositor Signature**: Sign at the bottom right.`
  }

  // ─── 20. CHEQUES & CTS-2010 ───
  if (
    q.includes('cheque') ||
    q.includes('check') ||
    q.includes('cts') ||
    q.includes('bearer') ||
    q.includes('crossed cheque')
  ) {
    return `**Cheques & Cheque Truncation System (CTS-2010)** 📑
* **Crossed Cheque (Account Payee)**: Drawing two parallel transverse lines on the top left with "A/C PAYEE" ensures the money can **only be credited into the payee's bank account** — nobody can cash it over the counter!
* **Bearer Cheque**: Can be cashed over the counter by whoever holds the physical paper (risky if lost!).
* **Post-Dated Cheque (PDC)**: Bears a future date; the bank will only honor and clear it on or after that specified date.
* **CTS-2010**: India's standard electronic clearing system. Rather than physically transporting paper cheques, high-resolution digital scans are transmitted to clear cheques within 1 business day.`
  }

  // ─── 21. CYBER SAFETY, PHISHING & 1930 HELPLINE (CABIN 2) ───
  if (
    q.includes('otp') ||
    q.includes('scam') ||
    q.includes('phishing') ||
    q.includes('vishing') ||
    q.includes('smishing') ||
    q.includes('cyber') ||
    q.includes('fraud') ||
    q.includes('1930')
  ) {
    return `**Golden Rules of Digital Banking Cyber Safety** 🛡️🚨
Practice scam defense in [Level 3 Banking Cabin 2] with our interactive Cyber Simulator & SMS Scanner!

1. **The QR Code Golden Rule**:
   * Scanning a QR code or entering your UPI PIN **DEDUCTS money from your account**.
   * You **NEVER** need to enter a UPI PIN or scan a QR code to **RECEIVE money**!
2. **Never Share OTP or UPI PIN**:
   * No bank official, RBI manager, police officer, or utility provider will ever ask for your 6-digit OTP or UPI PIN.
3. **Beware of Suspicious SMS Links**:
   * Fraudsters send urgent messages like *"Your SBI account/SIM card is suspended today! Click here to update KYC"*. Never click unknown short-links (\`.top\`, \`.xyz\`, \`.apk\`).
4. **Emergency National Helpline (1930)**:
   * If you suspect money was stolen from your account, immediately dial **1930** (Indian Cyber Crime Helpline) or report at **cybercrime.gov.in** within 2 hours to freeze the funds in the scammer's beneficiary account!`
  }

  // ─── 22. TAX SECTIONS: 80C VS 80D VS NEW TAX REGIME ───
  if (
    q.includes('80c') ||
    q.includes('80d') ||
    q.includes('tax regime') ||
    q.includes('income tax') ||
    q.includes('tax saving')
  ) {
    return `**Indian Income Tax Deductions & Regimes** 📑🧾
* **Section 80C (Max ₹1.5 Lakh/year)**:
  * Eligible investments: PPF, ELSS Mutual Funds, EPF, SSY, NSC, 5-Yr Tax FD, Home Loan Principal repayment.
* **Section 80D (Health Insurance)**:
  * Deduct up to ₹25,000 for self/family health insurance (+₹50,000 for senior citizen parents).
* **Section 80CCD(1B)**:
  * Exclusive additional **₹50,000 deduction for NPS** above the 80C limit!
* **Old vs. New Tax Regime**:
  * **New Regime (Default)**: Lower tax slab rates + standard deduction of ₹75,000, but eliminates Section 80C/80D deductions.
  * **Old Regime**: Beneficial if your total deductions (80C, 80D, HRA, Home Loan Interest) exceed ~₹3.75 Lakhs to ₹4 Lakhs.`
  }

  // ─── 23. TERM INSURANCE VS HEALTH INSURANCE VS ULIP ───
  if (
    q.includes('insurance') ||
    q.includes('term life') ||
    q.includes('health insurance') ||
    /\bulip\b/.test(q)
  ) {
    return `**Essential Insurance Guide** 🏥☂️
* **Term Life Insurance (Pure Protection)**:
  * If you have family members dependent on your income, term insurance is non-negotiable.
  * Very low cost: A 25-year-old can get **₹1 Crore life cover for ~₹800 to ₹1,000/month**.
* **Health Insurance (Mediclaim)**:
  * Covers hospitalization and medical treatments, ensuring a family illness doesn't wipe out your investments.
* **⚠️ Avoid ULIPs & Traditional Endowment Plans**:
  * Never mix investment with insurance! Traditional LIC money-back or ULIP policies offer mediocre returns (~4% to 5%) and inadequate life coverage.
  * **Best Strategy**: Buy pure Term Insurance + invest the remainder in Equity Index Funds / PPF!`
  }

  // ─── 24. LEARN2INVEST LEVEL PROGRESSION & HOW TO UNLOCK ───
  if (
    q.includes('unlock') ||
    q.includes('how to reach') ||
    q.includes('next level') ||
    q.includes('how to unlock') ||
    q === 'level 1' ||
    q === 'level 2' ||
    q === 'level 3'
  ) {
    return `**How to Unlock Levels in Learn2Invest** 🚀
1. **Level 1 (School Classroom & Courtyard)**:
   * Unlocked by default. Watch 5 financial literacy video lessons on PPF, FD, NSC, and SSY.
   * Pass the 10-Question Examination Center with **60%+ score** to earn **+100 XP** and unlock Level 2.
2. **Level 2 (Floor 2 Government District Lab)**:
   * Features 3 interactive computer workstations:
     * *PC 1*: Government Scheme Compound Return Simulators.
     * *PC 2*: Savings Mixer Studio (rebalance 100% allocation).
     * *PC 3*: Smart Portfolio Allocation with gap period analysis.
3. **Level 3 (Futuristic Banking & Cyber Hub)**:
   * Cabin 1: Realistic bank deposit slip & cheque leaf generator with dual counterfoils.
   * Cabin 2: Cyber safety scenario challenge & real-time OCR SMS Scam Analyzer!

Check [Campus Map] to track your interactive roadmap anytime.`
  }

  // ─── 25. CAMPUS NAVIGATION ───
  if (
    q.includes('navigate') ||
    q.includes('where to go') ||
    q.includes('help me navigate') ||
    q.includes('roadmap') ||
    q.includes('campus map')
  ) {
    return `**Learn2Invest Campus Navigation Guide** 🗺️
You can navigate across the campus easily:
* **School Yard Courtyard**: The 3D campus entrance with 3 interactive garden stalls.
* **Level 1 Classroom**: Watch video lessons and take the Examination Center quiz.
* **Level 2 Lab (Floor 2)**: Test real-time simulators on Computer 1, 2, and 3.
* **Level 3 Banking Hub**: Practice filling physical bank deposit slips and cyber safety challenges.
* **Top Bar Controls**: Access [Campus Map], check [Leaderboard] for XP rankings, or view your [Badges]!`
  }

  // ─── 26. ABOUT THE PLATFORM ───
  if (
    q.includes('about') ||
    q.includes('website') ||
    q.includes('what is this') ||
    q.includes('what is learn2invest')
  ) {
    return `**Welcome to Learn2Invest!** 🎓🇮🇳
Learn2Invest is an interactive 3D gamified educational simulator designed to teach practical, real-world Indian financial literacy to students and beginners.

* **Hands-on Learning**: From understanding the power of compounding in Level 1, testing multi-asset portfolios in Level 2, to filling realistic bank deposit slips and detecting SMS phishing in Level 3.
* **100% Safe Virtual Environment**: All money, balances, and returns used in Learn2Invest are educational virtual money — zero risk, pure learning!`
  }

  // ─── 27. WHAT IS MONEY & CURRENCY ───
  if (
    q.includes('what is money') ||
    q === 'money' ||
    q.includes('meaning of money') ||
    q.includes('definition of money') ||
    q.includes('fiat money') ||
    q.includes('currency') ||
    q.includes('rupee') ||
    q.includes('time value of money')
  ) {
    return `**Understanding Money & Currency** 💵🪙
Money is a universally accepted medium of exchange, store of value, and unit of measurement that allows people to trade goods and services efficiently without the friction of bartering.

* **3 Core Functions of Money**:
  * **Medium of Exchange**: Facilitates buying and selling without needing direct item swaps (e.g. trading cows for wheat).
  * **Store of Value**: Can be saved and retrieved in the future with predictable purchasing power (protected against inflation through smart investing!).
  * **Unit of Account**: Provides a common standard (e.g., ₹ Indian Rupee) to price goods, services, assets, and liabilities.
* **Fiat Money**: The Indian Rupee (₹) is **fiat currency** — backed by the trust and legal sovereign decree of the Government of India and the Reserve Bank of India (RBI).
* **Time Value of Money (TVM)**: ₹100 today is worth MORE than ₹100 in the future because today's money can earn interest and compounding returns!
* **Golden Rule**: Money sitting idle in cash loses purchasing power to inflation (~6%/year). Money invested in productive assets (Equity, Debt, Gold) grows and works for you 24/7!`
  }

  // ─── 28. GREETINGS & INTRODUCTIONS ───
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('how are you') ||
    q.includes('who are you') ||
    q.includes('good morning') ||
    q.includes('good afternoon') ||
    q.includes('good evening')
  ) {
    return `**Hello there! I'm Leo, your AI Financial Mentor!** 🤖💼
I'm doing great and excited to help you navigate Learn2Invest and master Indian personal finance!

Here's how I can help you:
* **Ask any financial question**: Try *"What is SIP?"*, *"What is money?"*, *"What is ELSS?"*, or *"Explain Rule of 72"*.
* **Smart Asset Allocation**: Tell me an amount (e.g., *"I have ₹10,000, where should I invest?"*) for an instant personalized portfolio strategy.
* **Campus & Level Quests**: Ask me how to unlock Level 2 or master bank slips in Level 3!

What would you like to explore?`
  }

  // ─── 29. BANKING & ACCOUNTS ───
  if (
    q.includes('what is a bank') ||
    q.includes('what is banking') ||
    q.includes('types of bank accounts') ||
    q.includes('savings account vs current')
  ) {
    return `**What is a Bank & Bank Accounts** 🏦
A bank is a regulated financial institution authorized by the Reserve Bank of India (RBI) to accept customer deposits, pay interest, and extend loans.

* **Savings Account**: For individuals to keep liquid cash safely while earning ~2.7% – 4% annual interest with UPI and debit card access.
* **Current Account**: For businesses with daily high-volume transactions. No interest earned, but includes overdraft protection and zero transaction caps.
* **Fixed Deposit (FD) & Recurring Deposit (RD)**: Guaranteed fixed-return options (~6.5% – 7.5%) for specific time periods.
* **DICGC Deposit Insurance**: Every depositor in an RBI-regulated bank is legally insured up to **₹5,00,000** by the DICGC.`
  }

  // ─── 30. LOANS, INTEREST & EMI ───
  if (
    q.includes('what is emi') ||
    q.includes('what is a loan') ||
    q.includes('home loan') ||
    q.includes('personal loan') ||
    q.includes('interest rate')
  ) {
    return `**Understanding Loans & EMI** 💳📑
* **What is a Loan?**: Capital borrowed from a financial institution that must be paid back with interest over an agreed duration.
* **Equated Monthly Installment (EMI)**: The fixed monthly repayment you make until the loan is fully paid off.
  * **EMI = Principal Component + Interest Component**.
* **Good Debt vs Bad Debt**:
  * **Good Debt**: Low-interest loans taken to purchase appreciating or career assets (e.g., Education Loan, Home Loan with tax benefits).
  * **Bad Debt**: High-interest loans for consumable purchases (e.g., Credit Card debt compounding at 36%–42% APR, Personal Loans at 15%+).`
  }


  // ─── 31. LEVEL 2 COMPUTER 3: PORTFOLIO SIMULATOR USER MANUAL ───
  if (
    q.includes('computer 3') ||
    q.includes('pc 3') ||
    q.includes('workstation 3') ||
    q.includes('portfolio simulator') ||
    q.includes('smart allocation') ||
    q.includes('gap period') ||
    q.includes('gap periods')
  ) {
    return `**📖 User Manual: Level 2 Computer 3 (Portfolio Simulator)** 💻📊

Computer 3 lets you simulate combining multiple Indian government and bank savings schemes into a single diversified portfolio. **Here is the complete step-by-step guide on how it works:**

---

### 1️⃣ Step 1: Select Your Schemes (Catalog)
* Choose from the **6 Indian Schemes**: **PPF** (7.1%), **FD** (7.25%), **NSC** (7.7%), **SSY** (8.2%), **RD** (6.5%), or **Post Office MIS** (7.4%).
* Click **"+ Add Scheme"** to add any scheme row. You can add multiple rows of the same scheme (e.g. one FD for 3 years, another FD for 5 years).
* **Customize**: You can edit the scheme name (e.g. *"Emergency Fund FD"* or *"Child Education PPF"*), monthly deposit, rate of interest, and time period in years.

---

### 2️⃣ Step 2: Choose Allocation Mode
* **Manual Mode**: You manually type the monthly deposit amount (e.g. ₹5,000 in FD, ₹5,000 in PPF).
* **🧠 Smart Allocation Mode**: 
  * Enter your **Total Monthly Budget** (e.g. ₹15,000/month).
  * Click **"Apply Smart Allocation"**. 
  * The smart algorithm automatically distributes your money across your chosen schemes to **maximize total compound interest return** based on interest rates and compounding tenures, while keeping every scheme active!

---

### 3️⃣ Step 3: Run the Simulation (+100 XP)
* Click **"🚀 Run Portfolio Simulation"**.
* You will instantly see:
  * **Total Invested**: The combined principal you deposited.
  * **Total Wealth**: The total maturity amount across all schemes.
  * **Total Profit**: The combined interest earned.
  * **+100 XP Bonus**: Earned on your first completed portfolio simulation!

---

### 4️⃣ Step 4: Understand the "Gap Period Analysis"
* Why are there gap periods? Shorter schemes (like a 5-year FD or 3-year RD) mature **earlier** than long-term schemes (like a 15-year PPF or SSY).
* The Gap Period analysis highlights when each scheme ends so you can plan to reinvest the matured cash and keep your money compounding!

---

### 5️⃣ Step 5: Save & Proceed to Level 3 Bank
* **Save Simulation**: Click *"💾 Save Simulation"* to store your custom portfolio in your Saved Portfolios tab.
* **Unlock Level 3**: Once complete, click *"✅ Complete Level 2 & Head to Bank"* to stand up and walk outside to the **Level 3 Banking Hub**!`;
  }

  // ─── 32. LEVEL 2 COMPUTERS OVERVIEW ───
  if (
    q.includes('computer 1') ||
    q.includes('computer 2') ||
    q.includes('savings mixer') ||
    q.includes('what is in level 2') ||
    q.includes('level 2 lab') ||
    q.includes('floor 2 lab')
  ) {
    return `**Level 2: Government District Investment Lab Overview** 🏛️🔬

In Level 2, you test real Indian savings and fixed income investment strategies across 3 interactive computer workstations:

* **Computer 1 (Scheme Simulators)**:
  * Test individual returns for 6 Indian schemes: PPF (7.1%), FD (7.25%), NSC (7.7%), SSY (8.2%), RD (6.5%), and Post Office MIS (7.4%).
  * See year-by-year compounding growth charts.

* **Computer 2 (Savings Mixer Studio)**:
  * Move interactive percentage sliders across schemes until the total equals 100%.
  * Analyze your blended portfolio interest rate over 1 to 15 years.

* **Computer 3 (Portfolio Simulator & Smart Allocation)**:
  * Combine multiple schemes into a single customized portfolio.
  * Test Manual vs 🧠 Smart Allocation (algorithmic profit maximization).
  * Check Gap Period maturity timing and save portfolios to your vault.
  * Awards **+100 XP** and unlocks the route to Level 3 Bank!`;
  }

  return null
}
