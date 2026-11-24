import { airborneLegTuck, drawBlockGuard, drawLimb, easeOutQuad, flicker, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const FLAME_RED = '#e4472b'
const FLAME_ORANGE = '#f79a3e'
const FLAME_YELLOW = '#ffd24c'
const BODY_HEIGHT = 90

function drawFlameLayer(ctx: CanvasRenderingContext2D, width: number, height: number, color: string, alpha: number): void {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, -height)
  ctx.quadraticCurveTo(width, -height * 0.4, 0, 0)
  ctx.quadraticCurveTo(-width, -height * 0.4, 0, -height)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 180
  const wispSwing = isAttacking
    ? lerpAngle(0.3, -1.1, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2) * 0.25
  const sway = Math.sin(t * 0.004) * 4
  const flick = flicker(t)
  const tuck = airborneLegTuck(pose)
  const stretch = 1 + tuck * 0.22

  ctx.save()
  ctx.translate(sway * 0.3, 0)
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -10, -40, Math.PI / 2 + 0.3 - wispSwing * 0.4, 20, 6, FLAME_ORANGE)
  drawLimb(ctx, 10, -40, Math.PI / 2 - 0.3 + wispSwing, 22, 6, FLAME_ORANGE)

  ctx.save()
  ctx.translate(0, -8)
  ctx.rotate(sway * 0.01)
  ctx.scale(1 / stretch, stretch)
  drawFlameLayer(ctx, 26, 88, FLAME_RED, 0.95 * flick)
  drawFlameLayer(ctx, 19, 72, FLAME_ORANGE, flick)
  drawFlameLayer(ctx, 11, 50, FLAME_YELLOW, 0.9 * flick)
  ctx.restore()

  ctx.fillStyle = '#5a1206'
  ctx.beginPath()
  ctx.arc(-4, -62, 2, 0, Math.PI * 2)
  ctx.arc(4, -62, 2, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const flameSpirit: CharacterDef = {
  id: 'flame-spirit',
  name: 'Flame Spirit',
  tagline: 'Fast and aggressive',
  description:
    'A restless candle-flame given life by the festival night, darting between opponents faster than any other fighter.',
  stats: { maxHp: 70, attack: 9, defense: 6, speed: 1.35 },
  basicAttack: {
    id: 'fs-basic',
    name: 'Ember Jab',
    startupMs: 90,
    activeMs: 70,
    recoveryMs: 120,
    damage: 6,
    knockback: { x: 0.2, y: 0 },
    hitstunMs: 220,
    blockStunMs: 90,
    hitboxOffset: { x: 32, y: 12, width: 36, height: 42 },
  },
  special: {
    id: 'fs-special',
    name: 'Festival Fire Burst',
    description: 'Erupts into a ring of fire around the body, instantly scorching anyone standing too close.',
    startupMs: 80,
    activeMs: 180,
    recoveryMs: 220,
    damage: 15,
    knockback: { x: 0.4, y: 0 },
    hitstunMs: 340,
    blockStunMs: 150,
    hitboxOffset: { x: 0, y: 0, width: 90, height: 80 },
    cooldownMs: 3800,
    onActivate: (self, world) => {
      world.spawnParticles({ x: self.position.x, y: self.position.y + 30, color: FLAME_ORANGE, count: 20 })
    },
  },
  visual: {
    bodyColor: FLAME_RED,
    accentColor: FLAME_YELLOW,
    width: 44,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
