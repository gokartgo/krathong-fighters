import { useContext } from 'react'
import { AppDispatchContext, AppStateContext } from './contexts'

export function useAppState() {
  const state = useContext(AppStateContext)
  if (!state) throw new Error('useAppState must be used within an AppStateProvider')
  return state
}

export function useAppDispatch() {
  const dispatch = useContext(AppDispatchContext)
  if (!dispatch) throw new Error('useAppDispatch must be used within an AppStateProvider')
  return dispatch
}
