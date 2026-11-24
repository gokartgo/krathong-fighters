import { useAppState } from '../state/useAppState'
import { BattleScene } from './BattleScene'
import { CharacterSelectScene } from './CharacterSelectScene'
import { HowToPlayScene } from './HowToPlayScene'
import { MainMenuScene } from './MainMenuScene'
import { ModeSelectScene } from './ModeSelectScene'
import { ResultScene } from './ResultScene'

export function SceneRouter() {
  const { scene } = useAppState()
  switch (scene) {
    case 'mainMenu':
      return <MainMenuScene />
    case 'howToPlay':
      return <HowToPlayScene />
    case 'characterSelect':
      return <CharacterSelectScene />
    case 'modeSelect':
      return <ModeSelectScene />
    case 'battle':
      return <BattleScene />
    case 'result':
      return <ResultScene />
    default:
      return null
  }
}
