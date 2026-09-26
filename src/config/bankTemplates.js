// ─── 15 INDIAN BANK & POST OFFICE FORM TEMPLATES CONFIGURATION ───
// Supports 5 Institutions × 3 Form Categories (Deposit, Withdrawal, Cheque)

export const INSTITUTIONS = [
  { id: 'canara', name: 'Canara Bank', code: 'CNRB0001001', emoji: '🏦' },
  { id: 'karnataka', name: 'Karnataka Bank Ltd.', code: 'KARB0000501', emoji: '🏛️' },
  { id: 'postoffice', name: 'Post Office Savings Bank', code: 'IPOS0000001', emoji: '📮' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB0034200', emoji: '🏢' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN0000840', emoji: '🏬' }
]

export const FORM_CATEGORIES = [
  { id: 'deposit', label: '📜 Cash Deposit / Pay-In Slip' },
  { id: 'withdrawal', label: '💳 Cash Withdrawal Slip' },
  { id: 'cheque', label: '✒️ Cheque Book' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 11.5, y: 11.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 13.5, y: 17.2, fontSize: '0.82rem', renderingMode: 'dateBoxes', gap: 6, boxWidth: '14px' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 5.2, y: 30.5, fontSize: '0.85rem', renderingMode: 'characterBoxes', gap: 4, boxWidth: '14px' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 10.0, y: 38.5, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Left)', x: 23.5, y: 46.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 14.5, y: 52.5, fontSize: '0.88rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 11.5, y: 58.5, width: 22, fontSize: '0.72rem', renderingMode: 'amountInWords' },

      // Center Cash Denomination Table
      { id: 'panNo', bindKey: 'pan', label: 'PAN Number (Center)', x: 38.5, y: 20.0, fontSize: '0.78rem', renderingMode: 'characterBoxes', gap: 3, boxWidth: '11px' },
      { id: 'denom500', bindKey: 'notes500', label: '500 Notes Row', x: 41.5, y: 39.5, fontSize: '0.75rem', renderingMode: 'text' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Denomination', x: 45.5, y: 66.0, fontSize: '0.85rem', renderingMode: 'amount' },

      // Right Main Section (Bank Copy)
      { id: 'mainDate', bindKey: 'date', label: 'Date Digits (Right)', x: 77.2, y: 4.2, fontSize: '0.85rem', gap: 6, boxWidth: '14px', renderingMode: 'dateBoxes' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 58.5, y: 7.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 52.8, y: 26.8, fontSize: '0.90rem', renderingMode: 'characterBoxes', gap: 11, boxWidth: '15px' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 57.5, y: 35.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 70.5, y: 42.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainEmail', bindKey: 'email', label: 'Email ID (Right)', x: 62.5, y: 48.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 65.5, y: 55.0, width: 32, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Figures (Right)', x: 81.5, y: 53.5, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 82.0, y: 84.0, width: 15, height: 8, renderingMode: 'signature' }
    ]
  },

  'canara_withdrawal': {
    institution: 'Canara Bank',
    formType: 'withdrawal',
    image: '/slips/canara_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 12.0, y: 15.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 80.0, y: 20.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 46.0, y: 27.0, width: 28, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 77.0, y: 27.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8.5, y: 46.0, fontSize: '0.90rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 56.0, y: 41.5, width: 20, height: 8, renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 56.0, y: 52.0, fontSize: '0.85rem', renderingMode: 'text' }
    ]
  },

  'canara_cheque': {
    institution: 'Canara Bank',
    formType: 'cheque',
    image: '/slips/canara_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 77.5, y: 8.0, fontSize: '0.90rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 7.0, y: 25.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 13.0, y: 35.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.0, y: 39.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 9.5, y: 49.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 78.0, y: 76.0, width: 18, height: 10, renderingMode: 'signature' }
    ]
  },


  // ════════════════════════════════════════════════════════════════
  // 2. KARNATAKA BANK LTD. TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'karnataka_deposit': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'deposit',
    image: '/slips/karnataka_deposit.jpg',
    fields: [
      // Left Section (Counterfoil)
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch (Left)', x: 25, y: 7.2, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 26, y: 9.8, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 18, y: 21.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 18, y: 15.2, fontSize: '0.85rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 22, y: 38.0, fontSize: '0.90rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 10, y: 74.0, width: 25, fontSize: '0.72rem', renderingMode: 'amountInWords' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 67, y: 7.2, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 76, y: 7.2, fontSize: '0.85rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 44, y: 21.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 60, y: 15.2, fontSize: '0.88rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 44, y: 25.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 44, y: 55.0, width: 40, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount (Right)', x: 80, y: 47.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 54, y: 77.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'karnataka_withdrawal': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'withdrawal',
    image: '/slips/karnataka_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 18.0, y: 24.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 76.0, y: 23.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 16.0, y: 39.5, width: 48, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 72.0, y: 48.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 41.0, y: 57.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 50.0, y: 75.0, width: 20, height: 10, renderingMode: 'signature' }
    ]
  },

  'karnataka_cheque': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'cheque',
    image: '/slips/karnataka_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 73.5, y: 8.0, fontSize: '0.90rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 7.5, y: 26.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 14.0, y: 37.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 77.5, y: 38.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 10.5, y: 50.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 78.0, y: 74.0, width: 18, height: 10, renderingMode: 'signature' }
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
      // Left Counterfoil
      { id: 'cfBranch', bindKey: 'branch', label: 'Post Office (Left)', x: 22, y: 8.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 24, y: 8.5, fontSize: '0.80rem', renderingMode: 'dateBoxes', gap: 6 },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 12, y: 21.5, fontSize: '0.88rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Payee Name (Left)', x: 12, y: 30.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Rupees Words (Left)', x: 12, y: 35.0, width: 28, fontSize: '0.72rem', renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 27, y: 39.5, fontSize: '0.90rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office (Right)', x: 58, y: 11.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date Digits (Right)', x: 78, y: 14.5, fontSize: '0.85rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 50, y: 18.0, fontSize: '0.88rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Payee Name (Right)', x: 50, y: 26.5, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees Words (Right)', x: 50, y: 31.5, width: 42, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Figures (Right)', x: 82, y: 36.0, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 60, y: 88.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 76, y: 76.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'postoffice_withdrawal': {
    institution: 'Post Office Savings Bank',
    formType: 'withdrawal',
    image: '/slips/postoffice_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office Name', x: 21.0, y: 9.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Application Date', x: 36.5, y: 9.5, fontSize: '0.85rem', gap: 6, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8.0, y: 21.0, fontSize: '0.90rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Sum in Figures', x: 30.5, y: 35.0, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 8.0, y: 39.5, width: 40, fontSize: '0.80rem', renderingMode: 'amountInWords' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 30.0, y: 73.0, width: 20, height: 8, renderingMode: 'signature' }
    ]
  },

  'postoffice_cheque': {
    institution: 'Post Office Savings Bank',
    formType: 'cheque',
    image: '/slips/postoffice_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 78, y: 10.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8, y: 23.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 12, y: 33.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 43.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8, y: 53.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 76, y: 78.0, width: 18, height: 10, renderingMode: 'signature' }
    ]
  },


  // ════════════════════════════════════════════════════════════════
  // 4. PUNJAB NATIONAL BANK (PNB) TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'pnb_deposit': {
    institution: 'Punjab National Bank',
    formType: 'deposit',
    image: '/slips/pnb_deposit.jpg',
    fields: [
      // Left Counterfoil
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 20, y: 18.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 24, y: 21.5, fontSize: '0.80rem', renderingMode: 'dateBoxes', gap: 6 },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 12, y: 29.0, fontSize: '0.85rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Name (Left)', x: 12, y: 36.5, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Tel (Left)', x: 12, y: 41.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 14, y: 47.5, fontSize: '0.90rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 12, y: 55.0, width: 25, fontSize: '0.72rem', renderingMode: 'amountInWords' },

      // Center Cash Denomination Table
      { id: 'denom500', bindKey: 'notes500', label: '500 Notes Row', x: 42, y: 46.0, fontSize: '0.75rem', renderingMode: 'text' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Cash', x: 42, y: 62.0, fontSize: '0.85rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 58, y: 14.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 78, y: 11.5, fontSize: '0.85rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 56, y: 23.5, fontSize: '0.88rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Name (Right)', x: 56, y: 32.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 56, y: 37.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 56, y: 49.5, width: 38, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount (Right)', x: 80, y: 58.5, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 76, y: 86.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'pnb_withdrawal': {
    institution: 'Punjab National Bank',
    formType: 'withdrawal',
    image: '/slips/pnb_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 76.0, y: 27.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 32.0, y: 28.5, width: 38, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 72.0, y: 32.5, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Savings A/c No.', x: 7.0, y: 47.5, fontSize: '0.90rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 52.0, y: 46.0, width: 18, height: 8, renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 52.0, y: 52.5, fontSize: '0.85rem', renderingMode: 'text' }
    ]
  },

  'pnb_cheque': {
    institution: 'Punjab National Bank',
    formType: 'cheque',
    image: '/slips/pnb_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 78, y: 21.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8, y: 33.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 12, y: 43.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 47.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 11, y: 58.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 78, y: 75.0, width: 18, height: 10, renderingMode: 'signature' }
    ]
  },


  // ════════════════════════════════════════════════════════════════
  // 5. STATE BANK OF INDIA (SBI) TEMPLATES
  // ════════════════════════════════════════════════════════════════
  'sbi_deposit': {
    institution: 'State Bank of India',
    formType: 'deposit',
    image: '/slips/sbi_deposit.jpg',
    fields: [
      // Left Section
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 24, y: 23.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 24, y: 29.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 10, y: 24.5, fontSize: '0.88rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Account Name (Left)', x: 10, y: 35.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'In Words (Left)', x: 10, y: 73.0, width: 28, fontSize: '0.72rem', renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Total Amount (Left)', x: 24, y: 79.5, fontSize: '0.90rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 62, y: 23.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 76, y: 29.5, fontSize: '0.85rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 64, y: 24.5, fontSize: '0.88rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Name (Right)', x: 48, y: 35.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'In Words (Right)', x: 42, y: 73.0, width: 35, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Total Amount (Right)', x: 80, y: 88.0, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 67, y: 80.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'sbi_withdrawal': {
    institution: 'State Bank of India',
    formType: 'withdrawal',
    image: '/slips/sbi_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 81.0, y: 8.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 10.0, y: 18.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 32.0, y: 13.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 65.0, y: 26.0, fontSize: '0.90rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 11.0, y: 37.0, width: 60, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 81.5, y: 44.5, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainPan', bindKey: 'pan', label: 'PAN Number', x: 10.0, y: 53.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 10.0, y: 57.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 65.0, y: 83.0, width: 22, height: 10, renderingMode: 'signature' }
    ]
  },

  'sbi_cheque': {
    institution: 'State Bank of India',
    formType: 'cheque',
    image: '/slips/sbi_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 77.0, y: 4.8, fontSize: '0.90rem', gap: 7, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 9.0, y: 30.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 15.0, y: 41.5, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 77.5, y: 44.5, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 9.5, y: 60.5, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 74.0, y: 75.0, width: 18, height: 10, renderingMode: 'signature' }
    ]
  }

}

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

