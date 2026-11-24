import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const SHELL_BROWN = '#6b4423'
const SHELL_DARK = '#4a2e18'
const FIBER = '#8a6238'
const BODY_HEIGHT = 96

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const legSwing = pose.state === 'walk' ? Math.sin(pose.moveCycleT * Math.PI * 2) * 0.22 : 0
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / (pose.state === 'special' ? 380 : 220)
  const armSwing = isAttacking
    ? lerpAngle(0.25, -0.75, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2 + Math.PI) * 0.1
  const stomp = pose.state === 'idle' ? Math.sin(t * 0.0022) * 1.5 : 0
  const tuck = airborneLegTuck(pose)
  const legAngleL = lerpAngle(Math.PI / 2 + legSwing, Math.PI / 2 - 0.4, tuck)
  const legAngleR = lerpAngle(Math.PI / 2 - legSwing, Math.PI / 2 + 0.4, tuck)
  const legLength = lerpAngle(22, 14, tuck)

  ctx.save()
  ctx.translate(0, stomp)
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -14, -22, legAngleL, legLength, 18, SHELL_DARK)
  drawLimb(ctx, 14, -22, legAngleR, legLength, 18, SHELL_DARK)

  drawLimb(ctx, -16, -58, Math.PI / 2 + 0.5 - armSwing * 0.3, 30, 14, SHELL_BROWN)

  drawBlob(ctx, 0, -56, 32, 36, SHELL_BROWN)
  ctx.strokeStyle = FIBER
  ctx.lineWidth = 2
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath()
    ctx.ellipse(0, -56, 26, 32, i * 0.3, 0, Math.PI * 2)
    ctx.stroke()
  }

  drawLimb(ctx, 16, -58, Math.PI / 2 - 0.5 + armSwing, 34, 16, SHELL_BROWN)

  ctx.fillStyle = SHELL_DARK
  ctx.beginPath()
  ctx.arc(-8, -84, 4, 0, Math.PI * 2)
  ctx.arc(8, -84, 4, 0, Math.PI * 2)
  ctx.arc(0, -76, 4, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const coconutGuardian: CharacterDef = {
  id: 'coconut-guardian',
  name: 'Coconut Guardian',
  tagline: 'Heavy fighter',
  description:
    'A hulking protector carved from a sacred coconut shell, slow to move but devastating once a swing connects.',
  stats: { maxHp: 140, attack: 13, defense: 14, speed: 0.75 },
  basicAttack: {
    id: 'cg-basic',
    name: 'Husk Punch',
    startupMs: 220,
    activeMs: 100,
    recoveryMs: 320,
    damage: 10,
    knockback: { x: 0.3, y: 0 },
    hitstunMs: 320,
    blockStunMs: 140,
    hitboxOffset: { x: 42, y: 5, width: 50, height: 55 },
  },
  special: {
    id: 'cg-special',
    name: 'Coconut Smash',
    description: 'Winds up a single devastating overhead smash, trading a long windup for huge damage and knockback.',
    startupMs: 380,
    activeMs: 140,
    recoveryMs: 420,
    damage: 26,
    knockback: { x: 0.55, y: 0 },
    hitstunMs: 500,
    blockStunMs: 220,
    hitboxOffset: { x: 46, y: 0, width: 60, height: 60 },
    cooldownMs: 6000,
    onActivate: (self, world) => {
      world.spawnParticles({ x: self.position.x + 30 * self.facing, y: self.position.y + 20, color: FIBER, count: 16 })
    },
  },
  visual: {
    bodyColor: SHELL_BROWN,
    accentColor: FIBER,
    width: 58,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
