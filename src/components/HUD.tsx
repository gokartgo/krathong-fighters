import type { RefObject } from 'react'
import { HealthBar } from './HealthBar'
import { SpecialBar } from './SpecialBar'

interface HUDProps {
  player1Name: string
  player2Name: string
  player1SpecialKeyLabel: string
  player2SpecialKeyLabel: string
  p1HpFillRef: RefObject<HTMLDivElement | null>
  p2HpFillRef: RefObject<HTMLDivElement | null>
  p1SpecialFillRef: RefObject<HTMLDivElement | null>
  p2SpecialFillRef: RefObject<HTMLDivElement | null>
  p1SpecialStatusRef: RefObject<HTMLSpanElement | null>
  p2SpecialStatusRef: RefObject<HTMLSpanElement | null>
  timerRef: RefObject<HTMLSpanElement | null>
}

export function HUD({
  player1Name,
  player2Name,
  player1SpecialKeyLabel,
  player2SpecialKeyLabel,
  p1HpFillRef,
  p2HpFillRef,
  p1SpecialFillRef,
  p2SpecialFillRef,
  p1SpecialStatusRef,
  p2SpecialStatusRef,
  timerRef,
}: HUDProps) {
  return (
    <div className="kf-hud">
      <div className="kf-hud__player kf-hud__player--left">
        <HealthBar label={player1Name} fillRef={p1HpFillRef} align="left" />
        <SpecialBar
          label="Special"
          keyLabel={player1SpecialKeyLabel}
          fillRef={p1SpecialFillRef}
          statusRef={p1SpecialStatusRef}
          align="left"
        />
      </div>
      <span ref={timerRef} className="kf-hud__timer">
        99
      </span>
      <div className="kf-hud__player kf-hud__player--right">
        <HealthBar label={player2Name} fillRef={p2HpFillRef} align="right" />
        <SpecialBar
          label="Special"
          keyLabel={player2SpecialKeyLabel}
          fillRef={p2SpecialFillRef}
          statusRef={p2SpecialStatusRef}
          align="right"
        />
      </div>
    </div>
  )
}
