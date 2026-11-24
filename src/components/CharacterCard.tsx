import { useEffect, useRef } from 'react'
import type { CharacterDef } from '../characters/types'
import { StatBar } from './StatBar'

interface CharacterCardProps {
  character: CharacterDef
  pickedBy: (1 | 2)[]
}

const PREVIEW_SIZE = 140

export function CharacterCard({ character, pickedBy }: CharacterCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height - 16)
    character.visual.drawFighter(ctx, { state: 'idle', facing: 1, moveCycleT: 0, stateElapsedMs: 0 }, 0)
    ctx.restore()
  }, [character])

  return (
    <div className={`kf-character-card${pickedBy.length > 0 ? ' kf-character-card--selected' : ''}`}>
      <canvas ref={canvasRef} width={PREVIEW_SIZE} height={PREVIEW_SIZE} />
      <h3>{character.name}</h3>
      <p className="kf-character-card__tagline">{character.tagline}</p>
      <div className="kf-character-card__stats">
        <StatBar label="HP" value={character.stats.maxHp} max={150} />
        <StatBar label="ATK" value={character.stats.attack} max={20} />
        <StatBar label="DEF" value={character.stats.defense} max={20} />
        <StatBar label="SPD" value={character.stats.speed} max={2} />
      </div>
      <p className="kf-character-card__special">Special: {character.special.name}</p>
      <p className="kf-character-card__special-desc">{character.special.description}</p>
      {pickedBy.length > 0 && (
        <p className="kf-character-card__picked-by">Picked by: {pickedBy.map((player) => `P${player}`).join(', ')}</p>
      )}
    </div>
  )
}
