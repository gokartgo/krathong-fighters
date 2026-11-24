export type GameAction =
  | 'moveLeft'
  | 'moveRight'
  | 'moveUp'
  | 'moveDown'
  | 'jump'
  | 'attack'
  | 'block'
  | 'special'

export type KeyBindingMap = Record<GameAction, string>

export interface ActionState {
  moveX: -1 | 0 | 1
  moveZ: -1 | 0 | 1
  jumpPressed: boolean
  attackPressed: boolean
  specialPressed: boolean
  blockHeld: boolean
}

export interface Controller {
  getAction(): ActionState
}
