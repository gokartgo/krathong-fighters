import { Button } from '../components/Button'
import { useAppDispatch } from '../state/useAppState'
import './HowToPlayScene.css'

export function HowToPlayScene() {
  const dispatch = useAppDispatch()
  return (
    <div className="kf-scene kf-how-to-play">
      <h1>How to Play</h1>
      <div className="kf-how-to-play__columns">
        <section>
          <h2>Player 1</h2>
          <ul>
            <li>A / D — Move left / right</li>
            <li>W / S — Move forward / back</li>
            <li>K — Jump</li>
            <li>J — Basic attack</li>
            <li>L — Special ability</li>
            <li>I — Block</li>
          </ul>
        </section>
        <section>
          <h2>Player 2</h2>
          <ul>
            <li>Arrow Left / Right — Move left / right</li>
            <li>Arrow Up / Down — Move forward / back</li>
            <li>Numpad 2 — Jump</li>
            <li>Numpad 1 — Basic attack</li>
            <li>Numpad 3 — Special ability</li>
            <li>Numpad 4 — Block</li>
          </ul>
        </section>
      </div>
      <Button onClick={() => dispatch({ type: 'BACK_TO_MENU' })}>Back</Button>
    </div>
  )
}
