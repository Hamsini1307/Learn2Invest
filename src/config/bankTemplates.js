// ─── 15 INDIAN BANK & POST OFFICE FORM TEMPLATES CONFIGURATION ───
// Supports 5 Institutions × 3 Form Categories (Deposit, Withdrawal, Cheque)

export const INSTITUTIONS = [
  { id: 'canara', name: 'Canara Bank', code: 'CNRB0001001', emoji: '🏦' },
  { id: 'karnataka', name: 'Karnataka Bank Ltd.', code: 'KARB0000471', emoji: '🏛️' },
  { id: 'postoffice', name: 'Post Office Savings Bank', code: 'IPOS0000001', emoji: '📮' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB0034200', emoji: '🏢' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN0000840', emoji: '🏬' }
]

export const FORM_CATEGORIES = [
  { id: 'deposit', label: '📜 Cash Deposit / Pay-In Slip' },
  { id: 'withdrawal', label: '💳 Cash Withdrawal Slip' },
  { id: 'cheque', label: '✒️ Cheque Slip' }
]

// ─── CANONICAL FIELD MAPPING DICTIONARY ───
// Maps App-wide Permanent Predefined Fields to Bank-Specific Slip Labels
export const CANONICAL_FIELD_MAPPING = {
  accountNumber: {
    canonicalName: 'Account Number',
    acceptedLabels: [
      'A/c No.',
      'A/c No. / Credit Card No.',
      'SF/CA/OD/CC/RD/TL/DL A/c No.',
      'Account Number',
      'Account Number (Left)',
      'Account Number (Right)',
      'Savings A/c No.'
    ]
  },
  branch: {
    canonicalName: 'Branch Name',
    acceptedLabels: [
      'Branch',
      'Branch Name',
      'Account Maintained with Branch',
      'Post Office',
      'Post Office Name',
      'Branch Name (Left)',
      'Branch Name (Right)'
    ]
  },
  date: {
    canonicalName: 'Date',
    acceptedLabels: [
      'Date',
      'Date (Left)',
      'Date (Right)',
      'Date Digits (Right)',
      'Cheque Date',
      'Application Date'
    ]
  },
  mobileNumber: {
    canonicalName: 'Mobile Number',
    acceptedLabels: [
      'Tel No.',
      'Tel No. / Mobile No.',
      'Mobile No.',
      'Mobile Number',
      'Mobile Number (Left)',
      'Mobile Number (Right)'
    ]
  },
  amount: {
    canonicalName: 'Amount',
    acceptedLabels: [
      'Amount',
      '₹ Amount',
      'Total Amount',
      'Numeric Amount',
      'Amount Figures (Left)',
      'Amount Figures (Right)',
      'Total Cash',
      'Sum in Figures'
    ]
  },
  amountInWords: {
    canonicalName: 'Amount in Words',
    acceptedLabels: [
      'Rupees in words',
      'Total Amount (in words)',
      'Rupees (In words)',
      'Amount Words',
      'Amount Words (Left)',
      'Amount Words (Right)',
      'Sum in Words'
    ]
  },
  signature: {
    canonicalName: 'Depositor Signature',
    acceptedLabels: [
      'Signature of Depositor',
      'Sig. of Depositor',
      'Depositor Signature',
      'Account Holder Signature',
      'Sign Above Line',
      'Holder Signature'
    ]
  },
  name: {
    canonicalName: 'Account Holder Name',
    acceptedLabels: [
      'Name',
      'Name of Account Holder',
      'Depositor Name',
      'Depositor Name (Left)',
      'Depositor Name (Right)',
      'Account Name',
      'Payee Name'
    ]
  }
}

// FIELD MAPPING CONFIGURATION DATABASE FOR ALL 15 TEMPLATES
export const BANK_TEMPLATES_CONFIG = {

  // ════════════════════════════════════════════════════════════════
  // 1. CANARA BANK TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'canara_deposit': {
    institution: 'Canara Bank',
    formType: 'deposit',
    image: '/slips/canara_deposit.jpg',
    fields: [
      // Left Counterfoil (Customer Copy)
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 10.5, y: 11.5, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 13.48, y: 17.2, width: 14.26, height: 5.5, boxCount: 8, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 4.88, y: 30.5, width: 20.02, height: 5.0, boxCount: 14, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 10.0, y: 35.5, width: 22, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Left)', x: 13.5, y: 40.5, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 14.0, y: 46.5, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 9.5, y: 52.0, width: 24, fontSize: 'clamp(16px, 2.0cqi, 24px)', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'panNo', bindKey: 'pan', label: 'PAN Number (Center)', x: 37.5, y: 20.8, width: 14.0, height: 5.0, boxCount: 10, fontSize: 'clamp(16px, 2.0cqi, 24px)', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'denom500', bindKey: 'notes500', label: '500 Notes Row', x: 41.5, y: 39.5, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Denomination', x: 44.5, y: 64.5, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'amount' },
      // Right Main Foil (Bank Copy)
      { id: 'mainDate', bindKey: 'date', label: 'Date Digits (Right)', x: 81.64, y: 9.5, width: 13.18, height: 5.0, boxCount: 8, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 57.5, y: 15.0, fontSize: 'clamp(18px, 2.4cqi, 30px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 52.34, y: 26.6, width: 30.57, height: 5.3, boxCount: 14, fontSize: 'clamp(22px, 2.8cqi, 36px)', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 57.0, y: 33.5, width: 36, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 69.5, y: 37.0, fontSize: 'clamp(18px, 2.3cqi, 28px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainEmail', bindKey: 'email', label: 'Email ID (Right)', x: 63.0, y: 41.5, fontSize: 'clamp(16px, 2.1cqi, 26px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 63.0, y: 46.5, width: 34, fontSize: 'clamp(18px, 2.3cqi, 28px)', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Figures (Right)', x: 81.5, y: 52.0, fontSize: 'clamp(22px, 2.8cqi, 36px)', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 82.0, y: 79.0, width: 16, height: 9, fontSize: 'clamp(22px, 2.8cqi, 36px)', renderingMode: 'signature' }
    ]
  },

  'canara_withdrawal': {
    institution: 'Canara Bank',
    formType: 'withdrawal',
    image: '/slips/canara_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 10.0, y: 12.5, width: 22, fontSize: 'clamp(20px, 2.6cqi, 32px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 76.5, y: 16.5, width: 16, fontSize: 'clamp(20px, 2.5cqi, 30px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 44.5, y: 29.5, width: 30, fontSize: 'clamp(16px, 2.0cqi, 25px)', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 76.8, y: 25.1, width: 17.5, height: 8.2, fontSize: 'clamp(26px, 3.2cqi, 40px)', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8.51, y: 44.5, width: 45.32, height: 6.5, boxCount: 17, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 76.0, y: 35.5, width: 18, height: 7.0, fontSize: 'clamp(22px, 2.8cqi, 36px)', renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 76.0, y: 47.8, width: 18, fontSize: 'clamp(18px, 2.2cqi, 28px)', fontWeight: 900, renderingMode: 'text' }
    ]
  },

  'canara_cheque': {
    institution: 'Canara Bank',
    formType: 'cheque',
    image: '/slips/canara_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 77.34, y: 6.9, width: 18.27, height: 5.7, boxCount: 8, fontSize: 'clamp(20px, 2.5cqi, 32px)', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8.0, y: 21.5, width: 67, height: 5.2, fontSize: 'clamp(22px, 2.8cqi, 36px)', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 13.5, y: 31.0, width: 55, height: 5.2, fontSize: 'clamp(18px, 2.3cqi, 28px)', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 77.2, y: 35.8, width: 20.8, height: 10.0, fontSize: 'clamp(28px, 3.5cqi, 48px)', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 9.8, y: 47.2, width: 32.5, height: 7.3, fontSize: 'clamp(24px, 3.0cqi, 38px)', letterSpacing: '4px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 78.0, y: 70.0, width: 19, height: 9.5, fontSize: 'clamp(22px, 2.8cqi, 36px)', renderingMode: 'signature' }
    ]
  },

  // ════════════════════════════════════════════════════════════════
  // 2. KARNATAKA BANK TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'karnataka_deposit': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'deposit',
    image: '/slips/karnataka_deposit.jpg',
    fields: [
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch (Left)', x: 5.5, y: 14.5, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 20.5, y: 14.5, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 6.5, y: 25.5, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 20.5, y: 36.5, fontSize: '1.15rem', letterSpacing: '2px', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 22.0, y: 73.0, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 6.0, y: 83.0, width: 22, fontSize: '1.05rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 68.0, y: 7.5, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 79.5, y: 7.5, width: 18.2, boxCount: 8, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 67.9, y: 15.0, width: 29.8, boxCount: 14, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 36.0, y: 16.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 44.5, y: 22.5, width: 30.2, boxCount: 10, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 42.0, y: 60.5, width: 33, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount (Right)', x: 88.0, y: 62.5, fontSize: '1.35rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 86.0, y: 76.0, width: 12, height: 6, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  },

  'karnataka_withdrawal': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'withdrawal',
    image: '/slips/karnataka_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 23.0, y: 22.0, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 80.0, y: 22.0, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 16.0, y: 36.5, width: 50, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.5, y: 48.0, fontSize: '1.40rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 38.0, y: 54.5, fontSize: '1.25rem', letterSpacing: '6px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 75.0, y: 78.0, width: 20, height: 10, fontSize: '1.30rem', renderingMode: 'signature' }
    ]
  },

  'karnataka_cheque': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'cheque',
    image: '/slips/karnataka_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 72.5, y: 5.5, width: 23.2, boxCount: 8, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 9.2, y: 20.0, width: 68, height: 6, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 14.5, y: 29.5, width: 56, height: 7, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.0, y: 38.5, width: 18, height: 7, fontSize: '1.40rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 11.5, y: 52.0, width: 28, height: 6, fontSize: '1.30rem', letterSpacing: '2px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 79.0, y: 62.0, width: 20, height: 10, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  },

  // ════════════════════════════════════════════════════════════════
  // 3. POST OFFICE SAVINGS BANK TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'postoffice_deposit': {
    institution: 'Post Office Savings Bank',
    formType: 'deposit',
    image: '/slips/postoffice_deposit.jpg',
    fields: [
      { id: 'cfBranch', bindKey: 'branch', label: 'Post Office (Left)', x: 1.5, y: 8.8, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date Digits (Left)', x: 18.2, y: 7.2, width: 16.5, boxCount: 8, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 13.8, y: 23.0, width: 20.5, boxCount: 10, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Payee Name (Left)', x: 24.5, y: 30.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Rupees Words (Left)', x: 16.0, y: 35.0, width: 20, fontSize: '1.05rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Box (Left)', x: 28.5, y: 41.5, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'cfStampSig', bindKey: 'signature', label: 'Initial of PA (Left)', x: 23.5, y: 83.0, width: 12, height: 7, fontSize: '1.20rem', renderingMode: 'signature' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office (Right)', x: 40.0, y: 11.2, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDateTop', bindKey: 'date', label: 'Date Digits (Top Right)', x: 83.2, y: 15.5, width: 16.0, boxCount: 8, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 52.2, y: 15.5, width: 26.5, boxCount: 10, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Payee Name (Right)', x: 58.5, y: 25.0, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees Words (Right)', x: 46.0, y: 31.2, width: 40, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainDateMid', bindKey: 'date', label: 'Date Digits (Mid Right)', x: 70.0, y: 37.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Box (Right)', x: 89.5, y: 38.5, fontSize: '1.30rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 88.0, y: 71.5, width: 10, height: 6, fontSize: '1.20rem', renderingMode: 'signature' }
    ]
  },

  'postoffice_withdrawal': {
    institution: 'Post Office Savings Bank',
    formType: 'withdrawal',
    image: '/slips/postoffice_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office Name', x: 17.5, y: 10.0, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Application Date', x: 37.5, y: 12.0, width: 15.5, boxCount: 8, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 10.8, y: 23.5, width: 34.0, boxCount: 10, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainType', bindKey: 'accountType', label: 'Withdrawal Checkbox', x: 28.0, y: 29.0, fontSize: '1.30rem', bindValue: 'SB', renderingMode: 'checkbox' },
      { id: 'mainAmountLine1', bindKey: 'amount', label: 'Sum in Figures (Line 1)', x: 7.5, y: 37.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAmountLine2', bindKey: 'amount', label: 'Sum in Figures (Line 2)', x: 39.5, y: 37.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 5.0, y: 41.5, width: 42, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainSig1', bindKey: 'signature', label: 'Account Holder Signature (Left)', x: 30.5, y: 49.0, width: 14, height: 7, fontSize: '1.25rem', renderingMode: 'signature' },
      { id: 'mainSig2', bindKey: 'signature', label: 'Account Holder Signature (Messenger)', x: 31.0, y: 65.5, width: 14, height: 7, fontSize: '1.25rem', renderingMode: 'signature' },
      { id: 'acqAmount', bindKey: 'amount', label: 'Received Amount (Right)', x: 62.5, y: 53.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'acqWords', bindKey: 'amountInWords', label: 'Received Words (Right)', x: 57.5, y: 58.5, width: 35, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'acqDate', bindKey: 'date', label: 'Acquittance Date', x: 58.5, y: 72.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'acqSig', bindKey: 'signature', label: 'Acquittance Signature', x: 84.5, y: 64.5, width: 14, height: 7, fontSize: '1.25rem', renderingMode: 'signature' },
      { id: 'acqMobile', bindKey: 'mobileNumber', label: 'Acquittance Mobile No.', x: 61.0, y: 80.5, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' }
    ]
  },

  'postoffice_cheque': {
    institution: 'Post Office Savings Bank',
    formType: 'cheque',
    image: '/slips/postoffice_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 72.0, y: 11.0, width: 22.5, boxCount: 8, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 10.0, y: 22.5, width: 65, height: 6, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 17.0, y: 32.0, width: 52, height: 7, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.5, y: 40.5, width: 18, height: 7, fontSize: '1.35rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 13.0, y: 48.5, width: 28, height: 6, fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 80.0, y: 63.0, width: 20, height: 10, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  },

  // ════════════════════════════════════════════════════════════════
  // 4. PUNJAB NATIONAL BANK TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'pnb_deposit': {
    institution: 'Punjab National Bank',
    formType: 'deposit',
    image: '/slips/pnb_deposit.jpg',
    fields: [
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 8.5, y: 20.2, width: 8.5, fontSize: '1.05rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 19.8, y: 20.2, width: 13.5, boxCount: 8, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 7.2, y: 30.5, width: 26.5, boxCount: 14, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Name (Left)', x: 10.5, y: 37.2, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Tel (Left)', x: 10.0, y: 42.2, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 15.0, y: 48.8, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 20.0, y: 56.2, width: 11, fontSize: '1.05rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Cash', x: 45.5, y: 81.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 58.0, y: 14.5, width: 16.0, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 80.5, y: 11.5, width: 11.3, boxCount: 8, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 54.2, y: 26.5, width: 36.5, boxCount: 16, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Name (Right)', x: 59.0, y: 32.8, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 66.0, y: 38.2, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainAddress', bindKey: 'address', label: 'Address (Right)', x: 60.5, y: 43.2, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 69.0, y: 51.2, width: 22, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 84.0, y: 82.0, width: 12, height: 6, fontSize: '1.20rem', renderingMode: 'signature' }
    ]
  },

  'pnb_withdrawal': {
    institution: 'Punjab National Bank',
    formType: 'withdrawal',
    image: '/slips/pnb_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 81.5, y: 23.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'dateSlashes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 32.5, y: 24.5, width: 38, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 73.0, y: 31.5, fontSize: '1.35rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Savings Fund A/c No.', x: 6.8, y: 46.5, width: 60.0, boxCount: 16, fontSize: '1.30rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sig. of A/c Holder', x: 66.0, y: 49.5, width: 22, height: 8, fontSize: '1.25rem', renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 66.0, y: 55.0, width: 26, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' }
    ]
  },

  'pnb_cheque': {
    institution: 'Punjab National Bank',
    formType: 'cheque',
    image: '/slips/pnb_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 77.2, y: 22.0, width: 20.5, boxCount: 8, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 10.0, y: 35.0, width: 60, height: 6, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 16.5, y: 43.0, width: 52, height: 7, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.0, y: 50.0, width: 18, height: 7, fontSize: '1.35rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 11.5, y: 64.0, width: 28, height: 6, fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 82.0, y: 77.0, width: 15, height: 8, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  },

  // ════════════════════════════════════════════════════════════════
  // 5. STATE BANK OF INDIA TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'sbi_deposit': {
    institution: 'State Bank of India',
    formType: 'deposit',
    image: '/slips/sbi_deposit.jpg',
    fields: [
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 6.8, y: 29.2, width: 28.0, boxCount: 11, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 24.0, y: 34.5, fontSize: '1.10rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfName', bindKey: 'name', label: 'Account Name (Left)', x: 24.0, y: 39.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'In Words (Left)', x: 17.5, y: 73.8, width: 17, fontSize: '1.05rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 25.5, y: 82.5, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 82.0, y: 22.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 68.2, y: 29.2, width: 28.5, boxCount: 11, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Name (Right)', x: 53.0, y: 35.0, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'In Words (Right)', x: 49.0, y: 74.2, width: 36, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Total Amount (Right)', x: 88.0, y: 87.5, fontSize: '1.35rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 63.0, y: 79.5, width: 14, height: 8, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  },

  'sbi_withdrawal': {
    institution: 'State Bank of India',
    formType: 'withdrawal',
    image: '/slips/sbi_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 82.5, y: 7.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 16.0, y: 17.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 71.5, y: 13.5, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 63.8, y: 26.5, width: 33.5, boxCount: 11, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 21.0, y: 36.0, width: 55, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 82.0, y: 45.0, fontSize: '1.40rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 29.5, y: 56.0, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'homeBranch', bindKey: 'branch', label: 'Home Branch', x: 30.5, y: 60.5, fontSize: '1.15rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 70.0, y: 72.0, width: 22, height: 10, fontSize: '1.30rem', renderingMode: 'signature' }
    ]
  },

  'sbi_cheque': {
    institution: 'State Bank of India',
    formType: 'cheque',
    image: '/slips/sbi_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 76.4, y: 7.2, width: 20.4, boxCount: 8, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 11.0, y: 27.5, width: 62, height: 6, fontSize: '1.25rem', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 17.0, y: 39.0, width: 52, height: 7, fontSize: '1.20rem', fontWeight: 900, renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 79.5, y: 49.5, width: 17, height: 7, fontSize: '1.40rem', fontWeight: 900, renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 11.5, y: 66.5, width: 28, height: 6, fontSize: '1.30rem', letterSpacing: '2px', fontWeight: 900, renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 82.0, y: 81.0, width: 15, height: 8, fontSize: '1.25rem', renderingMode: 'signature' }
    ]
  }

};

// ─── TEMPLATE-SPECIFIC FIELD MAPPING CONFIGURATIONS ───
export const canaraBankFields = {
  deposit: BANK_TEMPLATES_CONFIG['canara_deposit'],
  withdrawal: BANK_TEMPLATES_CONFIG['canara_withdrawal'],
  cheque: BANK_TEMPLATES_CONFIG['canara_cheque']
}

export const karnatakaBankFields = {
  deposit: BANK_TEMPLATES_CONFIG['karnataka_deposit'],
  withdrawal: BANK_TEMPLATES_CONFIG['karnataka_withdrawal'],
  cheque: BANK_TEMPLATES_CONFIG['karnataka_cheque']
}

export const postOfficeFields = {
  deposit: BANK_TEMPLATES_CONFIG['postoffice_deposit'],
  withdrawal: BANK_TEMPLATES_CONFIG['postoffice_withdrawal'],
  cheque: BANK_TEMPLATES_CONFIG['postoffice_cheque']
}

export const pnbFields = {
  deposit: BANK_TEMPLATES_CONFIG['pnb_deposit'],
  withdrawal: BANK_TEMPLATES_CONFIG['pnb_withdrawal'],
  cheque: BANK_TEMPLATES_CONFIG['pnb_cheque']
}

export const sbiFields = {
  deposit: BANK_TEMPLATES_CONFIG['sbi_deposit'],
  withdrawal: BANK_TEMPLATES_CONFIG['sbi_withdrawal'],
  cheque: BANK_TEMPLATES_CONFIG['sbi_cheque']
}

