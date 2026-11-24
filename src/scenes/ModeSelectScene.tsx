import { Button } from '../components/Button'
import type { GameModeId } from '../state/types'
import { useAppDispatch } from '../state/useAppState'
import './ModeSelectScene.css'

interface ModeOption {
  id: GameModeId
  name: string
  description: string
  enabled: boolean
}

const MODE_OPTIONS: ModeOption[] = [
  { id: 'classic', name: 'Classic Battle', description: '1 vs 1 — local 2 players, shared keyboard', enabled: true },
  { id: 'team', name: 'Team Battle', description: 'Coming soon', enabled: false },
  { id: 'survival', name: 'Survival Mode', description: 'Coming soon', enabled: false },
  { id: 'tournament', name: 'Tournament Mode', description: 'Coming soon', enabled: false },
]

export function ModeSelectScene() {
  const dispatch = useAppDispatch()
  return (
    <div className="kf-scene kf-mode-select">
      <h1>Choose a Game Mode</h1>
      <div className="kf-mode-select__grid">
        {MODE_OPTIONS.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className="kf-mode-card"
            disabled={!mode.enabled}
            onClick={() => dispatch({ type: 'SELECT_MODE', mode: mode.id })}
          >
            <h2>{mode.name}</h2>
            <p>{mode.description}</p>
          </button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => dispatch({ type: 'BACK_TO_CHARACTER_SELECT' })}>
        Back
      </Button>
    </div>
  )
}
