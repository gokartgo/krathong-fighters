import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const PETAL_PINK = '#e868a8'
const PETAL_LIGHT = '#f6b6d2'
const STEM_GREEN = '#4a8f5a'
const CENTER_GOLD = '#f3c969'
const BODY_HEIGHT = 96

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const tuck = airborneLegTuck(pose)
  const hover = Math.sin(t * 0.0025) * 4 + tuck * 10
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 220
  const armSwing = isAttacking
    ? lerpAngle(0.2, -0.8, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2) * 0.12
  const legSway = lerpAngle(Math.sin(pose.moveCycleT * Math.PI * 2) * 0.2, 0.45, tuck)
  const petalPulse = pose.state === 'special' ? 1 + Math.sin(t * 0.02) * 0.08 : 1

  ctx.save()
  ctx.translate(0, -10 + hover)
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -8, -30, Math.PI / 2 + legSway, 22, 8, STEM_GREEN)
  drawLimb(ctx, 8, -30, Math.PI / 2 - legSway, 22, 8, STEM_GREEN)

  drawLimb(ctx, -4, -66, Math.PI / 2 + 0.5 - armSwing * 0.3, 30, 9, PETAL_PINK)

  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2
    ctx.save()
    ctx.translate(0, -58)
    ctx.rotate(angle)
    drawBlob(ctx, 0, -10 * petalPulse, 14 * petalPulse, 22 * petalPulse, i % 2 === 0 ? PETAL_PINK : PETAL_LIGHT)
    ctx.restore()
  }
  drawBlob(ctx, 0, -58, 12, 12, CENTER_GOLD)

  drawLimb(ctx, 6, -66, Math.PI / 2 - 0.5 + armSwing, 32, 10, PETAL_PINK)

  drawBlob(ctx, 0, -92, 13, 13, PETAL_LIGHT)
  ctx.fillStyle = '#5a1f3d'
  ctx.beginPath()
  ctx.arc(-4, -93, 1.8, 0, Math.PI * 2)
  ctx.arc(4, -93, 1.8, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const lotusMage: CharacterDef = {
  id: 'lotus-mage',
  name: 'Lotus Mage',
  tagline: 'Long-range magic',
  description:
    'A serene spellcaster blossomed from a sacred lotus, channeling river water into sweeping waves from a safe distance.',
  stats: { maxHp: 75, attack: 9, defense: 7, speed: 0.95 },
  basicAttack: {
    id: 'lm-basic',
    name: 'Petal Jab',
    startupMs: 140,
    activeMs: 80,
    recoveryMs: 200,
    damage: 6,
    knockback: { x: 0.2, y: 0 },
    hitstunMs: 240,
    blockStunMs: 100,
    hitboxOffset: { x: 34, y: 14, width: 40, height: 46 },
  },
  special: {
    id: 'lm-special',
    name: 'Lotus Water Wave',
    description: 'Channels river water into a rolling wave that surges forward and crashes into the first foe it meets.',
    startupMs: 200,
    activeMs: 0,
    recoveryMs: 320,
    damage: 0,
    knockback: { x: 0, y: 0 },
    hitstunMs: 0,
    hitboxOffset: { x: 0, y: 0, width: 0, height: 0 },
    cooldownMs: 5000,
    onActivate: (self, world) => {
      world.spawnProjectile({
        x: self.position.x + 40 * self.facing,
        y: self.position.y + 35,
        z: self.position.z,
        vx: 0.42,
        width: 34,
        height: 20,
        damage: 14,
        knockback: { x: 0.4, y: 0 },
        hitstunMs: 360,
        color: '#7fd1ff',
        maxLifeMs: 1800,
      })
      world.spawnParticles({ x: self.position.x + 30 * self.facing, y: self.position.y + 35, color: '#bdeaff', count: 10 })
    },
  },
  visual: {
    bodyColor: PETAL_PINK,
    accentColor: PETAL_LIGHT,
    width: 46,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
