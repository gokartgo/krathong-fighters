import type { Ref } from 'react'

interface SpecialBarProps {
  label: string
  keyLabel: string
  fillRef: Ref<HTMLDivElement>
  statusRef: Ref<HTMLSpanElement>
  align: 'left' | 'right'
}

export function SpecialBar({ label, keyLabel, fillRef, statusRef, align }: SpecialBarProps) {
  return (
    <div className={`kf-special-bar kf-special-bar--${align}`}>
      <div className="kf-special-bar__row">
        <span className="kf-special-bar__label">{label}</span>
        <span ref={statusRef} className="kf-special-bar__status kf-special-bar__status--ready">
          READY
        </span>
      </div>
      <div className="kf-special-bar__row">
        <div className="kf-special-bar__track">
          <div ref={fillRef} className="kf-special-bar__fill kf-special-bar__fill--ready" style={{ width: '100%' }} />
        </div>
        <span className="kf-special-bar__key">{keyLabel}</span>
      </div>
    </div>
  )
}
