interface StatBarProps {
  label: string
  value: number
  max: number
}

export function StatBar({ label, value, max }: StatBarProps) {
  const percent = Math.round((value / max) * 100)
  return (
    <div className="kf-stat-bar">
      <span className="kf-stat-bar__label">{label}</span>
      <div className="kf-stat-bar__track">
        <div className="kf-stat-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
