import { ActionMapper } from './ActionMapper'
import type { InputManager } from './InputManager'
import type { ActionState, Controller, KeyBindingMap } from './types'

export class HumanController implements Controller {
  private mapper: ActionMapper

  constructor(input: InputManager, bindings: KeyBindingMap) {
    this.mapper = new ActionMapper(input, bindings)
  }

  getAction(): ActionState {
    return this.mapper.getAction()
  }
}
