import type { KeyBindingMap } from './types'

export const PLAYER_1_BINDINGS: KeyBindingMap = {
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  moveUp: 'KeyS',
  moveDown: 'KeyW',
  jump: 'KeyK',
  attack: 'KeyJ',
  special: 'KeyL',
  block: 'KeyI',
}

export const PLAYER_2_BINDINGS: KeyBindingMap = {
  moveLeft: 'ArrowLeft',
  moveRight: 'ArrowRight',
  moveUp: 'ArrowDown',
  moveDown: 'ArrowUp',
  jump: 'Numpad2',
  attack: 'Numpad1',
  special: 'Numpad3',
  block: 'Numpad4',
}

export const PLAYER_1_SPECIAL_KEY_LABEL = 'L'
export const PLAYER_2_SPECIAL_KEY_LABEL = 'Num 3'
