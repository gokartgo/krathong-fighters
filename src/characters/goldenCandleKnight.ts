import { airborneLegTuck, drawBlockGuard, drawLimb, easeOutQuad, flicker, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const GOLD_BODY = '#d4af37'
const GOLD_DARK = '#9c7a1f'
const CANDLE_WAX = '#f7e9b0'
const FLAME_ORANGE = '#ffb347'
const BODY_HEIGHT = 108

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const legSwing = pose.state === 'walk' ? Math.sin(pose.moveCycleT * Math.PI * 2) * 0.16 : 0
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / (pose.state === 'special' ? 420 : 240)
  const armSwing = isAttacking
    ? lerpAngle(0.22, -0.65, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2 + Math.PI) * 0.08
  const tuck = airborneLegTuck(pose)
  const legAngleL = lerpAngle(Math.PI / 2 + legSwing, Math.PI / 2 - 0.35, tuck)
  const legAngleR = lerpAngle(Math.PI / 2 - legSwing, Math.PI / 2 + 0.35, tuck)
  const legLength = lerpAngle(20, 13, tuck)
  const flameFlicker = flicker(t)

  ctx.save()
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -13, -20, legAngleL, legLength, 16, GOLD_DARK)
  drawLimb(ctx, 13, -20, legAngleR, legLength, 16, GOLD_DARK)

  drawLimb(ctx, -15, -58, Math.PI / 2 + 0.45 - armSwing * 0.3, 28, 13, GOLD_BODY)

  ctx.fillStyle = CANDLE_WAX
  ctx.beginPath()
  ctx.moveTo(-20, -24)
  ctx.lineTo(-16, -84)
  ctx.lineTo(16, -84)
  ctx.lineTo(20, -24)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = GOLD_BODY
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(-18, -40)
  ctx.lineTo(18, -40)
  ctx.moveTo(-17, -60)
  ctx.lineTo(17, -60)
  ctx.stroke()

  drawLimb(ctx, 15, -58, Math.PI / 2 - 0.45 + armSwing, 30, 14, GOLD_BODY)

  ctx.save()
  ctx.globalAlpha = flameFlicker
  ctx.fillStyle = FLAME_ORANGE
  ctx.beginPath()
  ctx.moveTo(0, -112)
  ctx.quadraticCurveTo(9, -98, 0, -84)
  ctx.quadraticCurveTo(-9, -98, 0, -112)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const goldenCandleKnight: CharacterDef = {
  id: 'golden-candle-knight',
  name: 'Golden Candle Knight',
  tagline: 'Heavy defensive fighter',
  description:
    'An armored pillar of golden wax and candlelight, standing firm against any assault before answering with overwhelming force.',
  stats: { maxHp: 130, attack: 14, defense: 15, speed: 0.7 },
  basicAttack: {
    id: 'gck-basic',
    name: 'Candle Guard Strike',
    startupMs: 230,
    activeMs: 110,
    recoveryMs: 330,
    damage: 11,
    knockback: { x: 0.32, y: 0 },
    hitstunMs: 340,
    blockStunMs: 150,
    hitboxOffset: { x: 42, y: 5, width: 52, height: 58 },
  },
  special: {
    id: 'gck-special',
    name: 'Golden Light Explosion',
    description: 'Charges up, then unleashes a blinding circular burst of golden light that devastates everything nearby.',
    startupMs: 340,
    activeMs: 140,
    recoveryMs: 400,
    damage: 24,
    knockback: { x: 0.5, y: 0 },
    hitstunMs: 460,
    blockStunMs: 210,
    hitboxOffset: { x: 0, y: 0, width: 115, height: 95 },
    cooldownMs: 6500,
    onActivate: (self, world) => {
      world.spawnParticles({ x: self.position.x, y: self.position.y + 30, color: GOLD_BODY, count: 22 })
    },
  },
  visual: {
    bodyColor: GOLD_BODY,
    accentColor: CANDLE_WAX,
    width: 56,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
