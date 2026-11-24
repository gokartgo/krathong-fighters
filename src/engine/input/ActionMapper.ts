import type { InputManager } from './InputManager'
import type { ActionState, KeyBindingMap } from './types'

export class ActionMapper {
  private input: InputManager
  private bindings: KeyBindingMap

  constructor(input: InputManager, bindings: KeyBindingMap) {
    this.input = input
    this.bindings = bindings
  }

  getAction(): ActionState {
    const b = this.bindings
    const left = this.input.isHeld(b.moveLeft)
    const right = this.input.isHeld(b.moveRight)
    const up = this.input.isHeld(b.moveUp)
    const down = this.input.isHeld(b.moveDown)

    return {
      moveX: right && !left ? 1 : left && !right ? -1 : 0,
      moveZ: down && !up ? 1 : up && !down ? -1 : 0,
      jumpPressed: this.input.consumePressed(b.jump),
      attackPressed: this.input.consumePressed(b.attack),
      specialPressed: this.input.consumePressed(b.special),
      blockHeld: this.input.isHeld(b.block),
    }
  }
}
