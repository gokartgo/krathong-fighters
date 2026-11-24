import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const JASMINE_WHITE = '#fdfbf3'
const JASMINE_CREAM = '#f0e6c4'
const STEM_GREEN = '#3f7a4a'
const BODY_HEIGHT = 88

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const legSwing = pose.state === 'walk' ? Math.sin(pose.moveCycleT * Math.PI * 2) * 0.4 : 0
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 160
  const armSwing = isAttacking
    ? lerpAngle(0.35, -1.0, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2 + Math.PI) * 0.18
  const tuck = airborneLegTuck(pose)
  const legAngleL = lerpAngle(Math.PI / 2 + legSwing, Math.PI / 2 - 0.5, tuck)
  const legAngleR = lerpAngle(Math.PI / 2 - legSwing, Math.PI / 2 + 0.5, tuck)
  const legLength = lerpAngle(24, 15, tuck)
  const bloomSpin = pose.state === 'special' ? t * 0.012 : 0

  ctx.save()
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -9, -24, legAngleL, legLength, 12, STEM_GREEN)
  drawLimb(ctx, 9, -24, legAngleR, legLength, 12, STEM_GREEN)

  drawLimb(ctx, -5, -62, Math.PI / 2 + 0.55 - armSwing * 0.4, 28, 9, STEM_GREEN)

  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2 + bloomSpin
    ctx.save()
    ctx.translate(0, -54)
    ctx.rotate(angle)
    drawBlob(ctx, 0, -9, 9, 15, i % 2 === 0 ? JASMINE_WHITE : JASMINE_CREAM)
    ctx.restore()
  }
  drawBlob(ctx, 0, -54, 9, 9, '#f3c969')

  drawLimb(ctx, 5, -62, Math.PI / 2 - 0.55 + armSwing, 30, 10, STEM_GREEN)

  drawBlob(ctx, 0, -84, 11, 11, JASMINE_WHITE)
  ctx.fillStyle = '#2c4f33'
  ctx.beginPath()
  ctx.arc(-3.5, -85, 1.6, 0, Math.PI * 2)
  ctx.arc(3.5, -85, 1.6, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const jasmineGuardian: CharacterDef = {
  id: 'jasmine-guardian',
  name: 'Jasmine Guardian',
  tagline: 'Fast melee and combo attacks',
  description:
    'A quick-footed bloom woven from strings of jasmine, darting between strikes faster than the eye can follow.',
  stats: { maxHp: 90, attack: 10, defense: 9, speed: 1.25 },
  basicAttack: {
    id: 'jg-basic',
    name: 'Jasmine Flurry',
    startupMs: 70,
    activeMs: 60,
    recoveryMs: 90,
    damage: 5,
    knockback: { x: 0.15, y: 0 },
    hitstunMs: 160,
    blockStunMs: 70,
    hitboxOffset: { x: 30, y: 12, width: 34, height: 40 },
  },
  special: {
    id: 'jg-special',
    name: 'Jasmine Tornado',
    description: 'Spins into a whirling tornado of jasmine petals that batters every enemy caught in its radius.',
    startupMs: 140,
    activeMs: 300,
    recoveryMs: 260,
    damage: 14,
    knockback: { x: 0.3, y: 0 },
    hitstunMs: 360,
    blockStunMs: 160,
    hitboxOffset: { x: 0, y: 5, width: 95, height: 68 },
    cooldownMs: 4200,
    onActivate: (self, world) => {
      world.spawnParticles({ x: self.position.x, y: self.position.y + 35, color: JASMINE_WHITE, count: 18 })
    },
  },
  visual: {
    bodyColor: JASMINE_WHITE,
    accentColor: STEM_GREEN,
    width: 42,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
