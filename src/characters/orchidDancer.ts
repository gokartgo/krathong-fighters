import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const ORCHID_PURPLE = '#9b4fc0'
const ORCHID_PINK = '#d68fe0'
const ORCHID_WHITE = '#f3e6fa'
const ORCHID_CENTER = '#e0c84a'
const BODY_HEIGHT = 92

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 170
  const armSwing = isAttacking
    ? lerpAngle(0.3, -0.95, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2) * 0.16
  const tuck = airborneLegTuck(pose)
  const sway = Math.sin(pose.moveCycleT * Math.PI * 2) * 0.22
  const skirtFlare = 1 + tuck * 0.25
  const hover = tuck * 8

  ctx.save()
  ctx.translate(0, -hover)
  ctx.scale(1, landingSquash(pose))

  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + sway * 0.3
    ctx.save()
    ctx.translate(0, -26)
    ctx.rotate(angle)
    drawBlob(ctx, 0, -14 * skirtFlare, 13 * skirtFlare, 20 * skirtFlare, i % 2 === 0 ? ORCHID_PURPLE : ORCHID_PINK)
    ctx.restore()
  }
  drawBlob(ctx, 0, -26, 8, 8, ORCHID_CENTER)

  drawLimb(ctx, -6, -62, Math.PI / 2 + 0.5 - armSwing * 0.3, 32, 7, ORCHID_PINK)

  drawBlob(ctx, 0, -58, 14, 22, ORCHID_WHITE)

  drawLimb(ctx, 6, -62, Math.PI / 2 - 0.5 + armSwing, 34, 8, ORCHID_PINK)

  drawBlob(ctx, 0, -90, 11, 11, ORCHID_WHITE)
  ctx.fillStyle = '#4a1f5c'
  ctx.beginPath()
  ctx.arc(-3.5, -91, 1.6, 0, Math.PI * 2)
  ctx.arc(3.5, -91, 1.6, 0, Math.PI * 2)
  ctx.fill()
  drawBlob(ctx, 8, -98, 6, 9, ORCHID_PURPLE)

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const orchidDancer: CharacterDef = {
  id: 'orchid-dancer',
  name: 'Orchid Dancer',
  tagline: 'Agile fighter with ranged and melee combos',
  description:
    'A graceful performer draped in orchid petals, weaving between melee combos and bursts of magical petals from a distance.',
  stats: { maxHp: 65, attack: 9, defense: 6, speed: 1.3 },
  basicAttack: {
    id: 'od-basic',
    name: 'Petal Kick',
    startupMs: 100,
    activeMs: 75,
    recoveryMs: 130,
    damage: 7,
    knockback: { x: 0.2, y: 0 },
    hitstunMs: 220,
    blockStunMs: 90,
    hitboxOffset: { x: 34, y: 10, width: 40, height: 46 },
  },
  special: {
    id: 'od-special',
    name: 'Orchid Petal Storm',
    description: 'Launches a spread of three magical orchid petals that fan out across the battlefield depth.',
    startupMs: 170,
    activeMs: 0,
    recoveryMs: 300,
    damage: 0,
    knockback: { x: 0, y: 0 },
    hitstunMs: 0,
    hitboxOffset: { x: 0, y: 0, width: 0, height: 0 },
    cooldownMs: 4800,
    onActivate: (self, world) => {
      for (const depthOffset of [-28, 0, 28]) {
        world.spawnProjectile({
          x: self.position.x + 30 * self.facing,
          y: self.position.y + 32,
          z: self.position.z + depthOffset,
          vx: 0.44,
          width: 20,
          height: 16,
          damage: 8,
          knockback: { x: 0.28, y: 0 },
          hitstunMs: 260,
          color: ORCHID_PINK,
          maxLifeMs: 1500,
        })
      }
      world.spawnParticles({ x: self.position.x + 24 * self.facing, y: self.position.y + 32, color: ORCHID_PINK, count: 14 })
    },
  },
  visual: {
    bodyColor: ORCHID_PURPLE,
    accentColor: ORCHID_PINK,
    width: 44,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
