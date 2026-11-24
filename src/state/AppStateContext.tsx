import { useReducer, type ReactNode } from 'react'
import { AppDispatchContext, AppStateContext } from './contexts'
import type { AppAction, AppState } from './types'
import { INITIAL_APP_STATE } from './types'

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, scene: 'characterSelect' }
    case 'SHOW_HOW_TO_PLAY':
      return { ...state, scene: 'howToPlay' }
    case 'BACK_TO_MENU':
      return { ...INITIAL_APP_STATE }
    case 'SELECT_CHARACTER':
      return action.player === 1
        ? { ...state, player1CharacterId: action.characterId }
        : { ...state, player2CharacterId: action.characterId }
    case 'CONFIRM_CHARACTERS':
      if (!state.player1CharacterId || !state.player2CharacterId) return state
      return { ...state, scene: 'modeSelect' }
    case 'BACK_TO_CHARACTER_SELECT':
      return { ...state, scene: 'characterSelect' }
    case 'SELECT_MODE':
      return { ...state, mode: action.mode, scene: 'battle' }
    case 'MATCH_ENDED':
      return { ...state, matchResult: action.result, scene: 'result' }
    case 'REMATCH':
      return { ...state, matchResult: null, scene: 'battle' }
    default:
      return state
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE)
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}
