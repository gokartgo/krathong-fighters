// Browser default actions these codes trigger (page scroll, mainly) would otherwise fight
// the player's movement input while a match is in progress.
const SCROLL_PREVENTABLE_CODES = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
  'PageUp',
  'PageDown',
  'Home',
  'End',
])

export class InputManager {
  private heldCodes = new Set<string>()
  private pressedCodes = new Set<string>()
  private abortController = new AbortController()

  constructor() {
    const { signal } = this.abortController
    window.addEventListener('keydown', this.handleKeyDown, { signal })
    window.addEventListener('keyup', this.handleKeyUp, { signal })
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (SCROLL_PREVENTABLE_CODES.has(event.code)) {
      event.preventDefault()
    }
    if (!this.heldCodes.has(event.code)) {
      this.pressedCodes.add(event.code)
    }
    this.heldCodes.add(event.code)
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.heldCodes.delete(event.code)
  }

  isHeld(code: string): boolean {
    return this.heldCodes.has(code)
  }

  /** Edge-triggered: true exactly once per physical key press, consumed on read. */
  consumePressed(code: string): boolean {
    if (this.pressedCodes.has(code)) {
      this.pressedCodes.delete(code)
      return true
    }
    return false
  }

  dispose(): void {
    this.abortController.abort()
  }
}
