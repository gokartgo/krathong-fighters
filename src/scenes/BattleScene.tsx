import { useEffect, useRef, type RefObject } from 'react'
import { HUD } from '../components/HUD'
import { ARENA_HEIGHT, ARENA_WIDTH } from '../engine/constants'
import { GameEngine } from '../engine/GameEngine'
import { PLAYER_1_SPECIAL_KEY_LABEL, PLAYER_2_SPECIAL_KEY_LABEL } from '../engine/input/bindings'
import type { HudSnapshot, PlayerHudSnapshot } from '../engine/Match'
import { useAppDispatch, useAppState } from '../state/useAppState'
import './BattleScene.css'

function applyPlayerHud(
  snapshot: PlayerHudSnapshot,
  hpFillRef: RefObject<HTMLDivElement | null>,
  specialFillRef: RefObject<HTMLDivElement | null>,
  specialStatusRef: RefObject<HTMLSpanElement | null>,
): void {
  if (hpFillRef.current) hpFillRef.current.style.width = `${snapshot.hpPercent}%`
  if (specialFillRef.current) {
    specialFillRef.current.style.width = `${snapshot.specialPercent}%`
    specialFillRef.current.classList.toggle('kf-special-bar__fill--ready', snapshot.specialReady)
    specialFillRef.current.classList.toggle('kf-special-bar__fill--reloading', !snapshot.specialReady)
  }
  if (specialStatusRef.current) {
    specialStatusRef.current.textContent = snapshot.specialReady ? 'READY' : 'RELOADING'
    specialStatusRef.current.classList.toggle('kf-special-bar__status--ready', snapshot.specialReady)
    specialStatusRef.current.classList.toggle('kf-special-bar__status--reloading', !snapshot.specialReady)
  }
}

export function BattleScene() {
  const { player1CharacterId, player2CharacterId } = useAppState()
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const p1HpFillRef = useRef<HTMLDivElement>(null)
  const p2HpFillRef = useRef<HTMLDivElement>(null)
  const p1SpecialFillRef = useRef<HTMLDivElement>(null)
  const p2SpecialFillRef = useRef<HTMLDivElement>(null)
  const p1SpecialStatusRef = useRef<HTMLSpanElement>(null)
  const p2SpecialStatusRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !player1CharacterId || !player2CharacterId) return

    const engine = new GameEngine(
      canvas,
      { player1CharacterId, player2CharacterId },
      {
        onHudUpdate: (snapshot: HudSnapshot) => {
          applyPlayerHud(snapshot.player1, p1HpFillRef, p1SpecialFillRef, p1SpecialStatusRef)
          applyPlayerHud(snapshot.player2, p2HpFillRef, p2SpecialFillRef, p2SpecialStatusRef)
          if (timerRef.current) timerRef.current.textContent = String(snapshot.secondsLeft)
        },
        onMatchEnd: (winnerPlayer) => {
          dispatch({ type: 'MATCH_ENDED', result: { winnerPlayer } })
        },
      },
    )
    engine.start()
    return () => engine.stop()
  }, [player1CharacterId, player2CharacterId, dispatch])

  if (!player1CharacterId || !player2CharacterId) return null

  return (
    <div className="kf-battle-scene">
      <HUD
        player1Name="Player 1"
        player2Name="Player 2"
        player1SpecialKeyLabel={PLAYER_1_SPECIAL_KEY_LABEL}
        player2SpecialKeyLabel={PLAYER_2_SPECIAL_KEY_LABEL}
        p1HpFillRef={p1HpFillRef}
        p2HpFillRef={p2HpFillRef}
        p1SpecialFillRef={p1SpecialFillRef}
        p2SpecialFillRef={p2SpecialFillRef}
        p1SpecialStatusRef={p1SpecialStatusRef}
        p2SpecialStatusRef={p2SpecialStatusRef}
        timerRef={timerRef}
      />
      <canvas
        ref={canvasRef}
        width={ARENA_WIDTH}
        height={ARENA_HEIGHT}
        className="kf-battle-canvas"
        style={{ aspectRatio: `${ARENA_WIDTH} / ${ARENA_HEIGHT}` }}
      />
    </div>
  )
}
