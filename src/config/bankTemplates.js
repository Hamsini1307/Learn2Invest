// ─── 15 INDIAN BANK & POST OFFICE FORM TEMPLATES CONFIGURATION ───
// Supports 5 Institutions × 3 Form Categories (Deposit, Withdrawal, Cheque)

export const INSTITUTIONS = [
  { id: 'canara', name: 'Canara Bank', code: 'CNRB0001001', emoji: '🏦' },
  { id: 'karnataka', name: 'Karnataka Bank Ltd.', code: 'KARB0000501', emoji: '🏛️' },
  { id: 'postoffice', name: 'Post Office Savings Bank', code: 'POST560001', emoji: '📮' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB0001200', emoji: '🏢' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN0000840', emoji: '🏬' }
]

export const FORM_CATEGORIES = [
  { id: 'deposit', label: '📜 Cash Deposit / Pay-In Slip' },
  { id: 'withdrawal', label: '💳 Cash Withdrawal Slip' },
  { id: 'cheque', label: '✒️ Cheque Book' }
]

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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 11, y: 6.2, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 11, y: 10.5, fontSize: '0.85rem', renderingMode: 'dateBoxes', gap: 10 },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 14, y: 16.5, fontSize: '0.95rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 11, y: 24.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Left)', x: 14, y: 29.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 26, y: 34.2, fontSize: '0.95rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 11, y: 39.5, width: 24, fontSize: '0.75rem', renderingMode: 'amountInWords' },

      // Center Cash Denomination Table
      { id: 'panNo', bindKey: 'pan', label: 'PAN Number (Center)', x: 38, y: 20.5, fontSize: '0.80rem', renderingMode: 'characterBoxes', letterSpacing: '3px' },
      { id: 'denom500', bindKey: 'notes500', label: '500 Notes Row', x: 45, y: 27.5, fontSize: '0.78rem', renderingMode: 'text' },
      { id: 'denom200', bindKey: 'notes200', label: '200 Notes Row', x: 45, y: 29.8, fontSize: '0.78rem', renderingMode: 'text' },
      { id: 'denom100', bindKey: 'notes100', label: '100 Notes Row', x: 45, y: 32.0, fontSize: '0.78rem', renderingMode: 'text' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Denomination', x: 45, y: 40.5, fontSize: '0.85rem', renderingMode: 'amount' },

      // Right Main Section (Bank Copy)
      { id: 'mainDate', bindKey: 'date', label: 'Date Digits (Right)', x: 74, y: 5.5, fontSize: '0.95rem', gap: 11, renderingMode: 'dateBoxes' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 60, y: 6.2, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 62, y: 16.5, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 60, y: 24.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 62, y: 29.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainEmail', bindKey: 'email', label: 'Email Address (Right)', x: 62, y: 32.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 60, y: 36.5, width: 34, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Figures (Right)', x: 84, y: 42.5, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 80, y: 61.5, width: 14, height: 8, renderingMode: 'signature' }
    ]
  },

  'canara_withdrawal': {
    institution: 'Canara Bank',
    formType: 'withdrawal',
    image: '/slips/canara_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 42, y: 13.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 78, y: 20.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 82, y: 24.5, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 44, y: 24.5, width: 30, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 6.5, y: 41.5, fontSize: '0.95rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 54, y: 47.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 54, y: 38.5, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'canara_cheque': {
    institution: 'Canara Bank',
    formType: 'cheque',
    image: '/slips/canara_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 78, y: 8.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8, y: 24.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 12, y: 35.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 40.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 10, y: 50.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 76, y: 76.0, width: 18, height: 10, renderingMode: 'signature' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch (Left)', x: 21, y: 13.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 31, y: 13.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfName', bindKey: 'name', label: 'Depositor Name (Left)', x: 7, y: 21.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 21, y: 34.0, fontSize: '0.85rem', letterSpacing: '2px', renderingMode: 'characterBoxes' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 21, y: 40.0, fontSize: '0.90rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 7, y: 77.0, width: 25, fontSize: '0.75rem', renderingMode: 'amountInWords' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 71, y: 13.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 84, y: 7.5, fontSize: '0.85rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Depositor Name (Right)', x: 35, y: 13.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 71, y: 13.0, fontSize: '0.90rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 35, y: 23.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 35, y: 57.0, width: 40, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount (Right)', x: 80, y: 48.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainPan', bindKey: 'pan', label: 'PAN/GIR No.', x: 35, y: 64.0, fontSize: '0.80rem', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 54, y: 78.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'karnataka_withdrawal': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'withdrawal',
    image: '/slips/karnataka_withdrawal.jpg', // File visually contains Pay-in/Deposit format
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 71, y: 13.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 84, y: 7.5, fontSize: '0.85rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 35, y: 13.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 71, y: 13.0, fontSize: '0.90rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 35, y: 57.0, width: 40, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 48.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 54, y: 78.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'karnataka_cheque': {
    institution: 'Karnataka Bank Ltd.',
    formType: 'cheque',
    image: '/slips/karnataka_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 78, y: 8.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8, y: 25.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount in Words', x: 12, y: 36.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 41.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 12, y: 51.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 76, y: 76.0, width: 18, height: 10, renderingMode: 'signature' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Post Office (Left)', x: 11, y: 8.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 20, y: 8.5, fontSize: '0.80rem', renderingMode: 'dateBoxes', gap: 6 },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 6, y: 22.5, fontSize: '0.90rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Payee Name (Left)', x: 6, y: 31.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Rupees Words (Left)', x: 6, y: 35.0, width: 30, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount Figures (Left)', x: 27, y: 40.0, fontSize: '0.95rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office (Right)', x: 56, y: 11.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date Digits (Right)', x: 80, y: 15.5, fontSize: '0.85rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 40, y: 15.5, fontSize: '0.90rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Payee Name (Right)', x: 40, y: 25.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees Words (Right)', x: 40, y: 31.0, width: 45, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Amount Figures (Right)', x: 86, y: 36.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 60, y: 91.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 80, y: 78.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'postoffice_withdrawal': {
    institution: 'Post Office Savings Bank',
    formType: 'withdrawal',
    image: '/slips/postoffice_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Post Office Name', x: 18, y: 9.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Application Date', x: 36, y: 9.5, fontSize: '0.85rem', gap: 6, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 6, y: 21.5, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 10, y: 35.5, width: 40, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Sum in Figures', x: 30, y: 35.5, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Account Holder Signature', x: 30, y: 70.5, width: 20, height: 8, renderingMode: 'signature' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 9, y: 20.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 20, y: 22.0, fontSize: '0.80rem', renderingMode: 'dateBoxes', gap: 6 },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 10, y: 30.0, fontSize: '0.85rem', letterSpacing: '4px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Name (Left)', x: 10, y: 38.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfMobile', bindKey: 'mobileNumber', label: 'Tel (Left)', x: 10, y: 42.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Amount (Left)', x: 13, y: 48.0, fontSize: '0.90rem', renderingMode: 'amount' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'Amount Words (Left)', x: 10, y: 57.0, width: 25, fontSize: '0.75rem', renderingMode: 'amountInWords' },

      // Center Cash Denomination Table
      { id: 'denom500', bindKey: 'notes500', label: '500 Notes Row', x: 42, y: 46.0, fontSize: '0.75rem', renderingMode: 'text' },
      { id: 'denomTotal', bindKey: 'amount', label: 'Total Cash', x: 42, y: 62.0, fontSize: '0.85rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 58, y: 14.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 80, y: 11.5, fontSize: '0.85rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 55, y: 24.5, fontSize: '0.90rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Name (Right)', x: 55, y: 33.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number (Right)', x: 55, y: 38.0, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Amount Words (Right)', x: 55, y: 51.0, width: 38, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount (Right)', x: 82, y: 59.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 80, y: 87.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'pnb_withdrawal': {
    institution: 'Punjab National Bank',
    formType: 'withdrawal',
    image: '/slips/pnb_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 15, y: 18.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 76, y: 26.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Sum in Words', x: 33, y: 28.5, width: 35, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Savings A/c No.', x: 7, y: 45.5, fontSize: '0.95rem', letterSpacing: '6px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 70, y: 52.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 70, y: 45.5, width: 18, height: 8, renderingMode: 'signature' }
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
      { id: 'cfBranch', bindKey: 'branch', label: 'Branch Name (Left)', x: 23, y: 29.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfDate', bindKey: 'date', label: 'Date (Left)', x: 23, y: 34.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'cfAccNo', bindKey: 'accountNumber', label: 'Account Number (Left)', x: 9, y: 29.5, fontSize: '0.90rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'cfName', bindKey: 'name', label: 'Account Name (Left)', x: 5, y: 39.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'cfWords', bindKey: 'amountInWords', label: 'In Words (Left)', x: 10, y: 73.0, width: 28, fontSize: '0.75rem', renderingMode: 'amountInWords' },
      { id: 'cfAmount', bindKey: 'amount', label: 'Total Amount (Left)', x: 24, y: 80.0, fontSize: '0.95rem', renderingMode: 'amount' },

      // Right Main Section
      { id: 'mainDate', bindKey: 'date', label: 'Date (Right)', x: 82, y: 29.5, fontSize: '0.85rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name (Right)', x: 68, y: 29.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number (Right)', x: 68, y: 29.5, fontSize: '0.90rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Name (Right)', x: 45, y: 35.0, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'In Words (Right)', x: 40, y: 73.0, width: 35, fontSize: '0.78rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Total Amount (Right)', x: 82, y: 88.0, fontSize: '1.0rem', renderingMode: 'amount' },
      { id: 'mainSig', bindKey: 'signature', label: 'Depositor Signature', x: 67, y: 81.0, width: 18, height: 8, renderingMode: 'signature' }
    ]
  },

  'sbi_withdrawal': {
    institution: 'State Bank of India',
    formType: 'withdrawal',
    image: '/slips/sbi_withdrawal.jpg',
    fields: [
      { id: 'mainBranch', bindKey: 'branch', label: 'Branch Name', x: 10, y: 18.5, fontSize: '0.85rem', renderingMode: 'text' },
      { id: 'mainDate', bindKey: 'date', label: 'Date', x: 80, y: 7.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainName', bindKey: 'name', label: 'Account Holder Name', x: 32, y: 13.5, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 64, y: 25.5, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 11, y: 35.5, width: 60, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 82, y: 43.5, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainPan', bindKey: 'pan', label: 'PAN Number', x: 10, y: 51.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainMobile', bindKey: 'mobileNumber', label: 'Mobile Number', x: 10, y: 55.5, fontSize: '0.80rem', renderingMode: 'text' },
      { id: 'mainSig', bindKey: 'signature', label: 'Holder Signature', x: 67, y: 82.5, width: 22, height: 10, renderingMode: 'signature' }
    ]
  },

  'sbi_cheque': {
    institution: 'State Bank of India',
    formType: 'cheque',
    image: '/slips/sbi_cheque.jpg',
    fields: [
      { id: 'mainDate', bindKey: 'date', label: 'Cheque Date', x: 78, y: 7.5, fontSize: '0.90rem', gap: 8, renderingMode: 'dateBoxes' },
      { id: 'mainPayee', bindKey: 'name', label: 'Payee Name', x: 8, y: 25.0, fontSize: '0.90rem', renderingMode: 'text' },
      { id: 'mainWords', bindKey: 'amountInWords', label: 'Rupees in Words', x: 12, y: 37.0, width: 55, fontSize: '0.85rem', renderingMode: 'amountInWords' },
      { id: 'mainAmount', bindKey: 'amount', label: 'Numeric Amount', x: 80, y: 42.0, fontSize: '1.1rem', renderingMode: 'amount' },
      { id: 'mainAccNo', bindKey: 'accountNumber', label: 'Account Number', x: 8, y: 61.0, fontSize: '0.95rem', letterSpacing: '5px', renderingMode: 'characterBoxes' },
      { id: 'mainSig', bindKey: 'signature', label: 'Sign Above Line', x: 76, y: 78.0, width: 18, height: 10, renderingMode: 'signature' }
    ]
  }

}
