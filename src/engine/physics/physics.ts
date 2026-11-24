import { ARENA_X_MAX, ARENA_X_MIN, DEPTH_MAX, DEPTH_MIN, GRAVITY } from '../constants'
import type { Fighter } from '../fighter/Fighter'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function stepPhysics(fighter: Fighter, dt: number): void {
  fighter.position.x = clamp(fighter.position.x + fighter.velocity.x * dt, ARENA_X_MIN, ARENA_X_MAX)
  fighter.position.z = clamp(fighter.position.z + fighter.velocity.z * dt, DEPTH_MIN, DEPTH_MAX)

  if (fighter.position.y > 0 || fighter.velocity.y > 0) {
    fighter.velocity.y -= GRAVITY * dt
    fighter.position.y += fighter.velocity.y * dt
    if (fighter.position.y <= 0) {
      fighter.position.y = 0
      fighter.velocity.y = 0
    }
  }
}
