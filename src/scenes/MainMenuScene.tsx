import { Button } from '../components/Button'
import { useAppDispatch } from '../state/useAppState'
import './MainMenuScene.css'

export function MainMenuScene() {
  const dispatch = useAppDispatch()
  return (
    <div className="kf-scene kf-main-menu">
      <h1 className="kf-main-menu__title">Krathong Fighters</h1>
      <p className="kf-main-menu__subtitle">A Loy Krathong night of festival combat</p>
      <div className="kf-main-menu__actions">
        <Button onClick={() => dispatch({ type: 'START_GAME' })}>Start Game</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'SHOW_HOW_TO_PLAY' })}>
          How to Play
        </Button>
      </div>
    </div>
  )
}
