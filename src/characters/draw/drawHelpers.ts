import type { FighterPose } from '../types'

export function drawBlob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
): void {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()
}

export function drawLimb(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  angle: number,
  length: number,
  width: number,
  color: string,
): void {
  ctx.save()
  ctx.translate(originX, originY)
  ctx.rotate(angle)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(-width / 2, 0, width, length, width / 2)
  ctx.fill()
  ctx.restore()
}

export function lerpAngle(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export function easeOutQuad(t: number): number {
  const clamped = Math.min(1, Math.max(0, t))
  return 1 - (1 - clamped) * (1 - clamped)
}

/** Slow, uneven pulsing alpha/scale multiplier for candle- and fire-like elements. */
export function flicker(t: number): number {
  return 0.75 + 0.25 * Math.sin(t * 0.02) * Math.sin(t * 0.007 + 1.3)
}

/**
 * Shared jump/fall/landing animation math, reused by every character's drawFighter so the
 * tuck/squash timing is consistent without duplicating it per character.
 */

/** 0 = legs fully extended, 1 = fully tucked — tucks going up, extends again on the way down. */
export function airborneLegTuck(pose: FighterPose): number {
  if (pose.state === 'jump') return Math.min(1, pose.stateElapsedMs / 150)
  if (pose.state === 'fall') return Math.max(0, 1 - pose.stateElapsedMs / 220)
  return 0
}

/** 1 = normal height, briefly dips below 1 right after landing (or recovering from a lock state). */
export function landingSquash(pose: FighterPose): number {
  const LANDING_WINDOW_MS = 140
  if ((pose.state === 'idle' || pose.state === 'walk') && pose.stateElapsedMs < LANDING_WINDOW_MS) {
    return 0.82 + 0.18 * easeOutQuad(pose.stateElapsedMs / LANDING_WINDOW_MS)
  }
  return 1
}

/**
 * Shared "guard shield" shown while blocking, so every character gives the same unmistakable
 * feedback that a block is active, without each one needing its own defensive pose/logic.
 * Called from inside drawFighter — local space, so +x is always "in front" regardless of facing.
 * `bodyHeight` should match that character's own CharacterVisualDef.height.
 */
export function drawBlockGuard(ctx: CanvasRenderingContext2D, pose: FighterPose, bodyHeight: number): void {
  if (pose.state !== 'block') return
  const shimmer = 0.55 + 0.25 * Math.sin(pose.stateElapsedMs * 0.018)
  const guardX = bodyHeight * 0.32
  const guardY = -bodyHeight * 0.56
  ctx.save()
  ctx.globalAlpha = shimmer
  ctx.fillStyle = 'rgba(143, 212, 255, 0.55)'
  ctx.strokeStyle = '#eaf6ff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(guardX, guardY, bodyHeight * 0.16, bodyHeight * 0.32, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}
