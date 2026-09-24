import os

# Read original Intermediate.jsx from scratch/intermediate_original.jsx
try:
    with open("c:/Users/kavya/Downloads/Telegram Desktop/learn2invest_project/Learn2Invest/scratch/intermediate_original.jsx", "r", encoding="utf-16") as f:
        orig_lines = f.readlines()
except Exception:
    with open("c:/Users/kavya/Downloads/Telegram Desktop/learn2invest_project/Learn2Invest/scratch/intermediate_original.jsx", "r", encoding="utf-8") as f:
        orig_lines = f.readlines()

header_lines = []
for i, line in enumerate(orig_lines):
    if "setActiveTab('digital')" in line:
        header_lines.append("        <button\n")
        header_lines.append("          onClick={() => setActiveTab('portfolio')}\n")
        header_lines.append("          className={activeTab === 'portfolio' ? 'btn-primary' : 'btn-outline'}\n")
        header_lines.append("          style={{ flex: '1 1 180px', fontSize: 13, padding: '12px 18px' }}\n")
        header_lines.append("        >\n")
        header_lines.append("          📊 COMBINED WEALTH METRICS 📈\n")
        header_lines.append("        </button>\n")
    elif "🌐 DIGITAL BANKING & SAFETY" in line or "className={activeTab === 'digital' ?" in line:
        continue
    elif i < 813:
        header_lines.append(line)

portfolio_tab_code = '''
      {activeTab === 'portfolio' && (
        <div className="anim-fade">
          {/* Top Title Banner */}
          <div className="glass-card-deep" style={{ padding: '24px', borderRadius: 24, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <span style={{ fontSize: 36 }}>📊</span>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom: 4 }}>
                  MULTI-ASSET PORTFOLIO SIMULATOR
                </div>
                <h2 className="font-display" style={{ fontSize: 26, color: '#ffffff', margin: 0 }}>
                  MULTI-ASSET PORTFOLIO SIMULATOR
                </h2>
              </div>
            </div>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, margin: '6px 0 0', fontWeight: 600 }}>
              Select 2 or more investment instruments, simulate combined wealth outcomes, and analyze reinvestment gap periods.
            </p>
          </div>

          {/* Instrument Add Bar */}
          <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 12 }}>
              ➕ CLICK "+" TO ADD INVESTMENT OPTIONS TO YOUR PORTFOLIO:
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PORTFOLIO_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 14,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  <span>{opt.emoji} {opt.name}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{opt.rate}% • {opt.years} Yrs</span>
                  <button
                    onClick={() => handleAddPortfolioOption(opt)}
                    style={{
                      background: '#10b981', color: '#ffffff', border: 'none',
                      borderRadius: '50%', width: 24, height: 24, cursor: 'pointer',
                      fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title={`Add ${opt.name} to portfolio`}
                  >+</button>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Strategy Switcher */}
          <div className="glass-card-deep" style={{ padding: 18, borderRadius: 20, marginBottom: 20, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase' }}>
                ⚙️ PORTFOLIO ALLOCATION STRATEGY
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                Choose how monthly funds are allocated across your selected investments
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setAllocationMode('manual')}
                className={allocationMode === 'manual' ? 'btn-primary' : 'btn-outline'}
                style={{ fontSize: 12, padding: '8px 18px' }}
              >
                🔥 Manual Allocation
              </button>
              <button
                onClick={handleSmartAllocation}
                className={allocationMode === 'smart' ? 'btn-primary' : 'btn-outline'}
                style={{ fontSize: 12, padding: '8px 18px' }}
              >
                ⚡ Smart Allocation
              </button>
            </div>
          </div>

          {/* Selected Portfolio Investments Table Box */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 18, color: '#ffffff', margin: 0 }}>
                  SELECTED PORTFOLIO INVESTMENTS ({portfolioItems.length})
                </h3>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', fontWeight: 600 }}>
                  Configure individual monthly amounts, return expectations, and tenure. You can rename any option.
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: portfolioItems.length >= 2 ? '#10b981' : '#f59e0b' }}>
                {portfolioItems.length >= 2 ? '✓ Ready for Simulation' : '⚠️ Need at least 2 investments'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {portfolioItems.map((item) => (
                <div
                  key={item.uid}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1.5px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: 16,
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr)) auto',
                    gap: 12,
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>SCHEME NAME</label>
                    <input
                      type="text"
                      className="input-light"
                      value={item.name}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'name', e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>MONTHLY (₹)</label>
                    <input
                      type="number"
                      className="input-light"
                      value={item.monthly}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'monthly', Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>RATE (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-light"
                      value={item.rate}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>TENURE (YRS)</label>
                    <input
                      type="number"
                      className="input-light"
                      value={item.years}
                      onChange={e => handleUpdatePortfolioItem(item.uid, 'years', Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 900 }}
                    />
                  </div>

                  <button
                    onClick={() => handleRemovePortfolioOption(item.uid)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1.5px solid #ef4444',
                      color: '#fca5a5',
                      borderRadius: '50%',
                      width: 28, height: 28,
                      cursor: 'pointer',
                      fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Remove investment option"
                  >✕</button>
                </div>
              ))}
            </div>

            <button
              onClick={runPortfolioSimulation}
              className="btn-primary"
              style={{ width: '100%', fontSize: 15, padding: '14px 24px', fontWeight: 900 }}
            >
              🚀 RUN PORTFOLIO SIMULATION
            </button>
          </div>

          {/* COMBINED WEALTH METRICS REPORT BOX */}
          {hasRunSim && portfolioResults && (
            <div className="glass-card-deep anim-scale" style={{ padding: 28, borderRadius: 24, marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="sticker-badge sticker-lime" style={{ marginBottom: 4 }}>
                    OVERALL PORTFOLIO REPORT
                  </div>
                  <h2 className="font-display" style={{ fontSize: 26, color: '#ffffff', margin: 0 }}>
                    COMBINED WEALTH METRICS
                  </h2>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '6px 14px', borderRadius: 999, border: '1px solid #f59e0b' }}>
                  Longest Investment Horizon: {portfolioResults.maxHorizon} Years
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid #38bdf8', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL INVESTMENT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>{fmt(portfolioResults.totalInvested)}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1.5px solid rgba(255, 255, 255, 0.2)', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#d1d5db', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL RETURNS</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff' }}>{fmt(portfolioResults.totalReturns)}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>TOTAL PROFIT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>+{fmt(portfolioResults.totalProfit)}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', padding: 18, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: 4 }}>PROFIT PERCENTAGE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>+{portfolioResults.profitPct}%</div>
                </div>
              </div>

              {/* Combined Invested vs Returns Breakdown Bar */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1.5px solid rgba(255, 255, 255, 0.1)', padding: 18, borderRadius: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                  <span style={{ color: '#ffffff' }}>COMBINED INVESTED VS RETURNS BREAKDOWN</span>
                  <span style={{ color: '#94a3b8' }}>Portfolio Value: {fmt(portfolioResults.totalReturns)} (100%)</span>
                </div>
                <div style={{ height: 16, background: '#10b981', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
                  <div style={{ width: `${(portfolioResults.totalInvested / portfolioResults.totalReturns) * 100}%`, background: '#0284c7', height: '100%' }} />
                  <div style={{ width: `${(portfolioResults.totalProfit / portfolioResults.totalReturns) * 100}%`, background: '#10b981', height: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 11, fontWeight: 800 }}>
                  <span style={{ color: '#38bdf8' }}>🟦 TOTAL INVESTED: {((portfolioResults.totalInvested / portfolioResults.totalReturns) * 100).toFixed(1)}% ({fmt(portfolioResults.totalInvested)})</span>
                  <span style={{ color: '#6ee7b7' }}>🟩 TOTAL RETURNS (PROFIT): {((portfolioResults.totalProfit / portfolioResults.totalReturns) * 100).toFixed(1)}% ({fmt(portfolioResults.totalProfit)})</span>
                </div>
              </div>

              {/* Gap Periods & Reinvestment Analysis */}
              {portfolioResults.gapPeriods && portfolioResults.gapPeriods.length > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1.5px solid rgba(245, 158, 11, 0.3)', padding: 20, borderRadius: 18, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>⌛</span>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                        GAP PERIODS & REINVESTMENT ANALYSIS
                      </h4>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>
                        Understand when earlier investments mature and how to put the matured corpus to work during the remaining gap years.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {portfolioResults.gapPeriods.map((gap, gIdx) => (
                      <div key={gIdx} style={{ background: 'rgba(18, 16, 12, 0.9)', border: '1.5px solid #f59e0b', padding: 16, borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 13 }}>
                            🔒 {gap.name} matures at Year {gap.maturesAt}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: 999, border: '1px solid #f59e0b' }}>
                            {gap.gapYears} YEARS GAP AVAILABLE
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                          At Year {gap.maturesAt}, {gap.name} will fully mature with an estimated payout corpus of <strong style={{ color: '#10b981' }}>{fmt(gap.maturedCorpus)}</strong>. Because your overall portfolio horizon runs for {portfolioResults.maxHorizon} years, you have a <strong>{gap.gapYears}-year gap period</strong> before longer-term investments conclude.
                        </p>
                        <div style={{ marginTop: 8, fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>
                          💡 Smart Utilization Tip: You can redeploy this matured {fmt(gap.maturedCorpus)} into short-term liquid funds, higher-yield corporate FDs, or utilize it for targeted mid-term life goals!
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => setShowSaveModal(true)}
                style={{ width: '100%', fontSize: 14, padding: '12px 20px', fontWeight: 900 }}
              >
                💾 SAVE PORTFOLIO SIMULATION
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Portfolio Modal */}
      {showSaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 7, 5, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-card-deep anim-scale" style={{ maxWidth: 460, width: '100%', borderRadius: 20, padding: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0 }}>SAVE PORTFOLIO SIMULATION</h3>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Name this overall portfolio model</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 6 }}>PORTFOLIO SIMULATION NAME</label>
              <input
                type="text"
                className="input-light"
                value={portfolioName}
                onChange={e => setPortfolioName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-outline" onClick={() => setShowSaveModal(false)} style={{ padding: '8px 18px', fontSize: 12 }}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmSavePortfolio} style={{ padding: '8px 22px', fontSize: 12, fontWeight: 900 }}>Save Portfolio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'''

full_code = "".join(header_lines) + portfolio_tab_code

with open("c:/Users/kavya/Downloads/Telegram Desktop/learn2invest_project/Learn2Invest/src/screens/Intermediate.jsx", "w", encoding="utf-8") as f:
    f.write(full_code)

print("Faithful swap completed!")
