import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const NAGA_GREEN = '#1f7a5c'
const NAGA_TEAL = '#2fae8e'
const NAGA_GOLD = '#d4af37'
const SCALE_DARK = '#124a39'
const BODY_HEIGHT = 94

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 220
  const armSwing = isAttacking
    ? lerpAngle(0.3, -0.85, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2) * 0.14
  const tuck = airborneLegTuck(pose)
  const tailSway = Math.sin(pose.moveCycleT * Math.PI * 2) * 0.18 + tuck * 0.3
  const coilLift = tuck * 14

  ctx.save()
  ctx.translate(0, -coilLift)
  ctx.scale(1, landingSquash(pose))

  for (let i = 0; i < 3; i += 1) {
    const segT = i / 2
    const sway = Math.sin(tailSway + segT * 1.4) * 10
    drawBlob(ctx, sway, -10 - segT * 20, 17 - segT * 3, 13, i % 2 === 0 ? NAGA_GREEN : SCALE_DARK)
  }

  drawLimb(ctx, -10, -56, Math.PI / 2 + 0.55 - armSwing * 0.3, 28, 9, NAGA_GREEN)

  drawBlob(ctx, 0, -58, 20, 26, NAGA_GREEN)
  ctx.fillStyle = NAGA_TEAL
  ctx.beginPath()
  ctx.ellipse(0, -66, 26, 16, 0, Math.PI, Math.PI * 2)
  ctx.fill()

  drawLimb(ctx, 10, -56, Math.PI / 2 - 0.55 + armSwing, 30, 10, NAGA_GREEN)

  drawBlob(ctx, 0, -92, 13, 13, NAGA_TEAL)
  ctx.fillStyle = NAGA_GOLD
  ctx.beginPath()
  ctx.arc(-4, -93, 2, 0, Math.PI * 2)
  ctx.arc(4, -93, 2, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const nagaWarrior: CharacterDef = {
  id: 'naga-warrior',
  name: 'Naga Warrior',
  tagline: 'Long-range water attacks',
  description:
    'A serpentine protector drawn from Thai river legend, coiling low to the ground before lashing out with powerful water strikes.',
  stats: { maxHp: 95, attack: 14, defense: 9, speed: 1.0 },
  basicAttack: {
    id: 'nw-basic',
    name: 'Serpent Strike',
    startupMs: 150,
    activeMs: 85,
    recoveryMs: 200,
    damage: 9,
    knockback: { x: 0.28, y: 0 },
    hitstunMs: 280,
    blockStunMs: 120,
    hitboxOffset: { x: 40, y: 8, width: 46, height: 52 },
  },
  special: {
    id: 'nw-special',
    name: 'Naga Water Dragon',
    description: 'Summons a serpent of river water that surges forward, dealing heavy damage to the first foe it strikes.',
    startupMs: 220,
    activeMs: 0,
    recoveryMs: 340,
    damage: 0,
    knockback: { x: 0, y: 0 },
    hitstunMs: 0,
    hitboxOffset: { x: 0, y: 0, width: 0, height: 0 },
    cooldownMs: 5200,
    onActivate: (self, world) => {
      world.spawnProjectile({
        x: self.position.x + 36 * self.facing,
        y: self.position.y + 30,
        z: self.position.z,
        vx: 0.36,
        width: 52,
        height: 32,
        damage: 20,
        knockback: { x: 0.45, y: 0 },
        hitstunMs: 400,
        color: NAGA_TEAL,
        maxLifeMs: 2000,
      })
      world.spawnParticles({ x: self.position.x + 26 * self.facing, y: self.position.y + 30, color: NAGA_TEAL, count: 12 })
    },
  },
  visual: {
    bodyColor: NAGA_GREEN,
    accentColor: NAGA_TEAL,
    width: 48,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
