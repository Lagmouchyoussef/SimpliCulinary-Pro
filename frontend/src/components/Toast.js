import React, { useEffect } from 'react'

// Lightweight toast matching the SimpliCulinary design system.
function Toast({ show, onClose, title, message, type = 'success', delay = 3200 }) {
  useEffect(() => {
    if (!show) return undefined
    const t = setTimeout(onClose, delay)
    return () => clearTimeout(t)
  }, [show, onClose, delay])

  if (!show) return null
  return (
    <div className="sc-toast-wrap" aria-live="polite">
      <div className={`sc-toast ${type === 'error' ? 'error' : ''}`}>
        <i className={`fas ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-check'}`}></i>
        <div>
          <strong>{title}</strong>
          <span>{message}</span>
        </div>
      </div>
    </div>
  )
}

export default Toast
