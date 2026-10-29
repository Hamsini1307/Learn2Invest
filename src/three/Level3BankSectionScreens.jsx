import React, { useState } from 'react'
import Advanced from '../screens/Advanced.jsx'
import soundEngine from '../utils/soundEngine.js'

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 BANK — TWO DEDICATED BANK CABINS:
//  Cabin 1 -> Section 1: Banking Slip Writing (paper_slip tab of src/screens/Advanced.jsx)
//  Cabin 2 -> Section 2: Digital Banking Safety (digital_safety tab of src/screens/Advanced.jsx)
// ═══════════════════════════════════════════════════════════════════════════════
export const LEVEL3_BANK_SECTIONS = [
  {
    num: 1,
    cabinLabel: 'CABIN 1',
    badge: 'Cabin 1 of 2 • Section 1',
    title: 'Banking Slip Writing (Deposit, Withdrawal & Cheque)',
    subtitle: 'Select Indian Bank, search accurate Razorpay IFSC/PIN code & preview/print authentic bank slips',
    icon: '📝',
    xpReward: 150,
    tab: 'paper_slip',
  },
  {
    num: 2,
    cabinLabel: 'CABIN 2',
    badge: 'Cabin 2 of 2 • Section 2',
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
  onSelectCabin,
  onFinishAllLevel3,
  onBackSection,
  onBackOneStep,
}) {
  const currentSec = Math.min(2, Math.max(1, activeSection || sectionNumber || 1))
  const handleBack = onBackSection || onBackOneStep
  const secMeta = LEVEL3_BANK_SECTIONS[currentSec - 1] || LEVEL3_BANK_SECTIONS[0]
  const cabin1Done = completedSections.includes(1) || (state?.completedModules || []).includes('paper_slip')
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div
      data-bank-screen="true"
      className="pointer-events-auto flex flex-col rounded-3xl bg-white border-4 border-amber-500 shadow-[0_30px_120px_rgba(0,0,0,0.85)] text-slate-900 overflow-hidden"
      style={
        isFullscreen
          ? {
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              maxHeight: '100vh',
              zIndex: 9999,
              backgroundColor: '#ffffff',
              borderRadius: 0,
            }
          : {
              width: 'calc(100vw - 28px)',
              maxWidth: 'calc(100vw - 28px)',
              height: 'calc(100vh - 20px)',
              maxHeight: 'calc(100vh - 20px)',
              backgroundColor: '#ffffff',
            }
      }
    >
      {/* Top 3D Bank Cabin Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-8 py-7 bg-amber-500/10 border-b-4 border-amber-500/40 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl text-white border-3 border-amber-300 shrink-0">
            {secMeta.icon}
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black uppercase tracking-widest text-amber-800">
              Learn2Invest Bank • {secMeta.badge}
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-tight">
              {secMeta.cabinLabel}: {secMeta.title}
            </div>
          </div>
        </div>

        {/* Active Cabin Status Badge */}
        <div className="flex items-center gap-4 bg-slate-100 px-8 py-4 rounded-3xl border-4 border-slate-300 shadow-md">
          <span className="text-4xl">{secMeta.icon}</span>
          <span className="font-black text-xl sm:text-3xl text-amber-900 tracking-wide">
            {currentSec === 1
              ? 'CABIN 1 • BANK SLIP WRITING ONLY'
              : 'CABIN 2 • DIGITAL BANKING & SAFETY ONLY'}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {handleBack && (
            <button
              onClick={() => {
                soundEngine.playClick()
                handleBack()
              }}
              className="px-8 py-5 rounded-full bg-slate-100 hover:bg-slate-200 border-4 border-slate-300 text-amber-950 font-black text-xl sm:text-2xl transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              ⬅ Back to Bank Lobby
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick()
              setIsFullscreen(!isFullscreen)
            }}
            className="px-8 py-5 rounded-full bg-amber-100 hover:bg-amber-200 border-4 border-amber-400 text-amber-950 font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center gap-3 shadow-md hover:scale-105 active:scale-95"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Expanded View'}
          >
            <span>{isFullscreen ? '🗗 Normal View' : '⛶ Fullscreen'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick()
              if (onCompleteSection) {
                onCompleteSection(currentSec, secMeta.xpReward)
              }
            }}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl sm:text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {currentSec < 2
              ? `✓ Complete Cabin 1 & Walk to Cabin 2 (+${secMeta.xpReward} XP) →`
              : `🏆 Finish Cabin 2 & Complete Level 3 (+${secMeta.xpReward} XP) →`}
          </button>

          {onFinishAllLevel3 && currentSec === 2 && (
            <button
              onClick={() => {
                soundEngine.playClick()
                onFinishAllLevel3()
              }}
              className="px-8 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xl sm:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Complete all 3 levels and view the School-to-Bank Map"
            >
              🗺️ Complete & View Map
            </button>
          )}
        </div>
      </div>

      {/* Cabin 1 = Bank Paper Slip Writer ONLY | Cabin 2 = Digital Banking Safety ONLY */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-50">
        <Advanced
          key={`cabin_${currentSec}_${secMeta.tab}`}
          state={state}
          update={update}
          addXP={addXP}
          goBack={handleBack}
          themeMode="light"
          initialTab={secMeta.tab}
          lockedTab={secMeta.tab}
        />
      </div>
    </div>
  )
}
