import { CHARACTERS } from '../characters'
import type { CharacterId } from '../characters/types'
import { Button } from '../components/Button'
import { CharacterCard } from '../components/CharacterCard'
import { useAppDispatch, useAppState } from '../state/useAppState'
import './CharacterSelectScene.css'

export function CharacterSelectScene() {
  const { player1CharacterId, player2CharacterId } = useAppState()
  const dispatch = useAppDispatch()
  const bothSelected = Boolean(player1CharacterId && player2CharacterId)

  function pickedByFor(characterId: CharacterId): (1 | 2)[] {
    const pickedBy: (1 | 2)[] = []
    if (player1CharacterId === characterId) pickedBy.push(1)
    if (player2CharacterId === characterId) pickedBy.push(2)
    return pickedBy
  }

  return (
    <div className="kf-scene kf-character-select">
      <h1>Choose Your Fighters</h1>
      <div className="kf-character-select__grid">
        {CHARACTERS.map((character) => (
          <div key={character.id} className="kf-character-select__slot">
            <CharacterCard character={character} pickedBy={pickedByFor(character.id)} />
            <div className="kf-character-select__pick-row">
              <button
                type="button"
                className={`kf-pick-btn${player1CharacterId === character.id ? ' kf-pick-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SELECT_CHARACTER', player: 1, characterId: character.id })}
              >
                Player 1
              </button>
              <button
                type="button"
                className={`kf-pick-btn${player2CharacterId === character.id ? ' kf-pick-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SELECT_CHARACTER', player: 2, characterId: character.id })}
              >
                Player 2
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button disabled={!bothSelected} onClick={() => dispatch({ type: 'CONFIRM_CHARACTERS' })}>
        Confirm
      </Button>
    </div>
  )
}
