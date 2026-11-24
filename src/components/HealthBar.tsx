import type { Ref } from 'react'

interface HealthBarProps {
  label: string
  fillRef: Ref<HTMLDivElement>
  align: 'left' | 'right'
}

export function HealthBar({ label, fillRef, align }: HealthBarProps) {
  return (
    <div className={`kf-health-bar kf-health-bar--${align}`}>
      <span className="kf-health-bar__label">{label}</span>
      <div className="kf-health-bar__track">
        <div ref={fillRef} className="kf-health-bar__fill" style={{ width: '100%' }} />
      </div>
    </div>
  )
}
