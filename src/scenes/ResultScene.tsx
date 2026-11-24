import { getCharacter } from '../characters'
import { Button } from '../components/Button'
import { useAppDispatch, useAppState } from '../state/useAppState'
import './ResultScene.css'

export function ResultScene() {
  const { matchResult, player1CharacterId, player2CharacterId } = useAppState()
  const dispatch = useAppDispatch()

  if (!matchResult || !player1CharacterId || !player2CharacterId) return null

  const winnerCharacter = getCharacter(matchResult.winnerPlayer === 1 ? player1CharacterId : player2CharacterId)

  return (
    <div className="kf-scene kf-result-scene">
      <h1>Player {matchResult.winnerPlayer} Wins!</h1>
      <p>{winnerCharacter.name} stands victorious among the floating krathongs.</p>
      <div className="kf-result-scene__actions">
        <Button onClick={() => dispatch({ type: 'REMATCH' })}>Rematch</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'BACK_TO_MENU' })}>
          Main Menu
        </Button>
      </div>
    </div>
  )
}
