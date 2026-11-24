import { DEPTH_HIT_TOLERANCE } from '../constants'
import type { Fighter } from '../fighter/Fighter'
import type { Rect } from '../types'

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

export function getHurtbox(fighter: Fighter): Rect {
  const { width, height } = fighter.def.visual
  return {
    x: fighter.position.x - width / 2,
    y: fighter.position.y,
    width,
    height,
  }
}

export function withinDepthRange(zA: number, zB: number): boolean {
  return Math.abs(zA - zB) <= DEPTH_HIT_TOLERANCE
}
