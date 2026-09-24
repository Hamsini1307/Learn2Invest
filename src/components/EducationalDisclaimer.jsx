import React from 'react'
import { TRANSLATIONS } from '../data/translations.js'

export default function EducationalDisclaimer({ lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  return (
    <div style={{
      background: 'rgba(245, 158, 11, 0.08)',
      borderTop: '1px solid rgba(245, 158, 11, 0.25)',
      padding: '10px 20px',
      fontSize: '11px',
      fontWeight: 700,
      color: '#f59e0b',
      textAlign: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      letterSpacing: '0.3px'
    }}>
      <span>🛡️</span>
      <span>{t.disclaimer}</span>
    </div>
  )
}
