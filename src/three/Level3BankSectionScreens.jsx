import React from 'react'
import Advanced from '../screens/Advanced.jsx'
import soundEngine from '../utils/soundEngine.js'

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 BANK — STRICTLY TWO SECTIONS:
//  1. Banking Slip Writing (paper_slip tab of src/screens/Advanced.jsx)
//  2. Digital Banking Safety (digital_safety tab of src/screens/Advanced.jsx)
// ═══════════════════════════════════════════════════════════════════════════════
export const LEVEL3_BANK_SECTIONS = [
  {
    num: 1,
    badge: 'Section 1 / 2 • Counter 1',
    title: 'Banking Slip Writing (Deposit, Withdrawal & Cheque)',
    subtitle: 'Select Indian Bank, locate IFSC/PIN code & preview/print authentic bank slips',
    icon: '📝',
    xpReward: 150,
    tab: 'paper_slip',
  },
  {
    num: 2,
    badge: 'Section 2 / 2 • Counter 2',
    title: 'Digital Banking Safety',
    subtitle: 'Defend your bank account against phishing/UPI scams & analyze suspicious SMS',
    icon: '🛡️',
    xpReward: 150,
    tab: 'digital_safety',
  },
]

export default function Level3BankSectionScreen({
  activeSection,
  sectionNumber,
  completedSections = [],
  state,
  update,
  addXP,
  onCompleteSection,
  onFinishAllLevel3,
  onBackSection,
  onBackOneStep,
}) {
  const currentSec = Math.min(2, Math.max(1, activeSection || sectionNumber || 1))
  const handleBack = onBackSection || onBackOneStep
  const secMeta = LEVEL3_BANK_SECTIONS[currentSec - 1] || LEVEL3_BANK_SECTIONS[0]

  return (
    <div className="pointer-events-auto w-[min(96vw,1120px)] max-h-[86vh] flex flex-col rounded-3xl bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-500/80 shadow-[0_25px_90px_rgba(0,0,0,0.85)] text-white overflow-hidden">
      {/* Top 3D Bank Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-slate-900/95 border-b border-amber-500/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-2xl shadow-md">
            {secMeta.icon}
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-400">
              Learn2Invest Bank • {secMeta.badge}
            </div>
            <div className="text-base sm:text-lg font-black text-white leading-tight">
              {secMeta.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {handleBack && (
            <button
              onClick={() => {
                soundEngine.playClick()
                handleBack()
              }}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-amber-300 font-black text-xs sm:text-sm transition-all cursor-pointer"
            >
              ⬅ Back
            </button>
          )}

          <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs sm:text-sm">
            Section {currentSec} / 2
          </div>

          <button
            onClick={() => {
              soundEngine.playClick()
              if (onCompleteSection) {
                onCompleteSection(currentSec, secMeta.xpReward)
              }
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {currentSec < 2
              ? `✓ Complete Banking Slip Writing & Go to Digital Banking Safety (+${secMeta.xpReward} XP) →`
              : `🏆 Finish Level 3 & Show Campus Map (+${secMeta.xpReward} XP) →`}
          </button>

          {onFinishAllLevel3 && (
            <button
              onClick={() => {
                soundEngine.playClick()
                onFinishAllLevel3()
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Complete all 3 levels and view the School-to-Bank Map"
            >
              🗺️ Complete & View Map
            </button>
          )}
        </div>
      </div>

      {/* Exact Untouched Original Level 3 Content (Bank Paper Slip Writer + Digital Banking & Safety) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Advanced
          state={state}
          update={update}
          addXP={addXP}
          goBack={handleBack}
          themeMode="dark"
          initialTab={secMeta.tab}
        />
      </div>
    </div>
  )
}
