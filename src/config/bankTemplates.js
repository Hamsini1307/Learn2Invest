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
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 13.5, y: 12.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 84.5, y: 18.5, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 46.0, y: 24.5, width: 28, fontSize: '0.90rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 81.5, y: 25.5, fontSize: '1.05rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8.2, y: 46.0, gap: 9, boxWidth: '14px', fontSize: '0.92rem', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 80.0, y: 36.0, width: 18, height: 8, renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 79.0, y: 47.5, fontSize: '0.88rem', renderingMode: 'text' }
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
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 23.0, y: 22.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 80.0, y: 22.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 16.0, y: 36.5, width: 50, fontSize: '0.90rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 78.5, y: 48.0, fontSize: '1.05rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 38.0, y: 54.5, fontSize: '0.95rem', letterSpacing: '6px', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 75.0, y: 78.0, width: 20, height: 10, renderingMode: 'signature' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Post Office (Left)', x: 5.5, y: 14.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 13.5, y: 27.0, gap: 7, boxWidth: '13px', fontSize: '0.88rem', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Payee Name (Left)', x: 20.0, y: 33.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Rupees Words (Left)', x: 12.0, y: 38.0, width: 24, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'cfStampSig', bindKey: 'signature', label: 'Initial of PA (Left)', x: 23.5, y: 82.0, width: 18, height: 8, renderingMode: 'signature' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office (Right)', x: 73.0, y: 9.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDateTop', bindKey: 'date', label: 'Date Digits (Top Right)', x: 88.0, y: 7.0, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 52.5, y: 21.5, gap: 8, boxWidth: '14px', fontSize: '0.88rem', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Payee Name (Right)', x: 58.0, y: 28.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees Words (Right)', x: 50.0, y: 33.5, width: 35, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainDateMid', bindKey: 'date', label: 'Date Digits (Mid Right)', x: 88.0, y: 32.5, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Box (Right)', x: 59.0, y: 70.0, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 83.0, y: 70.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'postoffice_withdrawal': {
    institution: 'Post Office Savings Bank',
    formType: 'withdrawal',
    image: '/slips/postoffice_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office Name', x: 18.5, y: 9.5, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Application Date', x: 37.2, y: 12.0, gap: 7, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 11.2, y: 24.2, gap: 9, boxWidth: '13px', fontSize: '0.88rem', renderingMode: 'characterBoxes' },
      { id: 'mainType', bindKey: 'accountType', label: 'Withdrawal Checkbox', x: 29.5, y: 31.0, fontSize: '1.1rem', bindValue: 'SB', renderingMode: 'checkbox' },
      { id: 'mainAmountLine1', bindKey: 'amount', label: 'Sum in Figures (Line 1)', x: 6.0, y: 39.5, fontSize: '0.88rem', renderingMode: 'amount' },
      { id: 'mainAmountLine2', bindKey: 'amount', label: 'Sum in Figures (Line 2)', x: 41.0, y: 39.5, fontSize: '0.88rem', renderingMode: 'amount' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 5.0, y: 43.5, width: 42, fontSize: '0.82rem', renderingMode: 'amountInWords' },
      { id: 'mainSig1', bindKey: 'signature', label: 'Account Holder Signature (Left)', x: 30.0, y: 53.0, width: 18, height: 8, renderingMode: 'signature' },
      { id: 'mainSig2', bindKey: 'signature', label: 'Account Holder Signature (Messenger)', x: 31.0, y: 71.5, width: 18, height: 8, renderingMode: 'signature' },
      { id: 'acqAmount', bindKey: 'amount', label: 'Received Amount (Right)', x: 62.5, y: 55.5, fontSize: '0.88rem', renderingMode: 'amount' },
      { id: 'acqWords', bindKey: 'amountInWords', label: 'Received Words (Right)', x: 57.0, y: 61.5, width: 40, fontSize: '0.82rem', renderingMode: 'amountInWords' },
      { id: 'acqDate', bindKey: 'date', label: 'Acquittance Date', x: 58.5, y: 74.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'acqSig', bindKey: 'signature', label: 'Acquittance Signature', x: 84.0, y: 69.5, width: 18, height: 8, renderingMode: 'signature' },
      { id: 'acqMobile', bindKey: 'mobileNumber', label: 'Acquittance Mobile No.', x: 61.0, y: 84.8, fontSize: '0.85rem', renderingMode: 'text' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 6.0, y: 15.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 23.5, y: 15.5, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 3.0, y: 25.5, gap: 7, boxWidth: '13px', fontSize: '0.85rem', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Name (Left)', x: 7.0, y: 33.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Tel (Left)', x: 6.5, y: 38.5, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 6.5, y: 44.5, fontSize: '0.90rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 3.0, y: 55.0, width: 30, fontSize: '0.75rem', renderingMode: 'amountInWords' },

      // Center Cash Denomination Table
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Cash', x: 52.0, y: 76.5, fontSize: '0.88rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 73.0, y: 6.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 87.0, y: 6.0, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 62.0, y: 18.5, gap: 8, boxWidth: '14px', fontSize: '0.88rem', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Name (Right)', x: 67.0, y: 25.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 73.0, y: 31.0, fontSize: '0.82rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 77.0, y: 47.5, width: 22, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 89.0, y: 81.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'pnb_withdrawal': {
    institution: 'Punjab National Bank',
    formType: 'withdrawal',
    image: '/slips/pnb_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 81.0, y: 25.0, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 33.0, y: 26.0, width: 38, fontSize: '0.88rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 73.0, y: 32.5, fontSize: '1.05rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Savings Fund A/c No.', x: 5.8, y: 48.5, gap: 11, boxWidth: '16px', fontSize: '0.95rem', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 66.0, y: 51.5, width: 20, height: 8, renderingMode: 'signature' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 66.0, y: 55.5, fontSize: '0.85rem', renderingMode: 'text' }
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
      // Left Section (Counterfoil)
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 12.0, y: 20.0, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 22.0, y: 24.0, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Account Name (Left)', x: 20.0, y: 30.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'In Words (Left)', x: 11.0, y: 61.0, width: 22, fontSize: '0.78rem', renderingMode: 'amountInWords' },

      // Right Main Section
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 52.0, y: 4.5, gap: 8, boxWidth: '14px', fontSize: '0.90rem', renderingMode: 'characterBoxes' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 82.0, y: 4.5, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainName', bindKey: 'name', label: 'Account Name (Right)', x: 52.0, y: 26.0, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 82.0, y: 22.0, gap: 5, boxWidth: '12px', fontSize: '0.82rem', renderingMode: 'dateBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'In Words (Right)', x: 48.0, y: 69.0, width: 28, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Total Amount (Right)', x: 88.0, y: 69.0, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 67.0, y: 81.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'sbi_withdrawal': {
    institution: 'State Bank of India',
    formType: 'withdrawal',
    image: '/slips/sbi_withdrawal.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 82.5, y: 7.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 16.0, y: 18.0, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 71.5, y: 13.5, fontSize: '0.88rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 64.5, y: 27.2, gap: 11, boxWidth: '15px', fontSize: '0.92rem', renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 21.0, y: 36.5, width: 55, fontSize: '0.88rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 82.0, y: 46.0, fontSize: '1.05rem', renderingMode: 'amount' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 29.5, y: 56.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'homeBranch', bindKey: 'branch', label: 'Home Branch', x: 30.5, y: 61.2, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 70.0, y: 74.0, width: 22, height: 10, renderingMode: 'signature' }
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

