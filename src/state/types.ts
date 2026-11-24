import type { CharacterId } from '../characters/types'

export type SceneName =
  | 'mainMenu'
  | 'howToPlay'
  | 'characterSelect'
  | 'modeSelect'
  | 'battle'
  | 'result'

export type GameModeId = 'classic' | 'team' | 'survival' | 'tournament'

export interface MatchResult {
  winnerPlayer: 1 | 2
}

export interface AppState {
  scene: SceneName
  player1CharacterId: CharacterId | null
  player2CharacterId: CharacterId | null
  mode: GameModeId | null
  matchResult: MatchResult | null
}

export type AppAction =
  | { type: 'START_GAME' }
  | { type: 'SHOW_HOW_TO_PLAY' }
  | { type: 'BACK_TO_MENU' }
  | { type: 'SELECT_CHARACTER'; player: 1 | 2; characterId: CharacterId }
  | { type: 'CONFIRM_CHARACTERS' }
  | { type: 'BACK_TO_CHARACTER_SELECT' }
  | { type: 'SELECT_MODE'; mode: GameModeId }
  | { type: 'MATCH_ENDED'; result: MatchResult }
  | { type: 'REMATCH' }

export const INITIAL_APP_STATE: AppState = {
  scene: 'mainMenu',
  player1CharacterId: null,
  player2CharacterId: null,
  mode: null,
  matchResult: null,
}
