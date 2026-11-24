import { airborneLegTuck, drawBlob, drawBlockGuard, drawLimb, easeOutQuad, landingSquash, lerpAngle } from './draw/drawHelpers'
import type { CharacterDef, FighterPose } from './types'

const LEAF_GREEN = '#3f9142'
const LEAF_LIGHT = '#6cc24a'
const TRUNK_BROWN = '#5b3a21'
const BODY_HEIGHT = 96

function drawFighter(ctx: CanvasRenderingContext2D, pose: FighterPose, t: number): void {
  const legSwing = pose.state === 'walk' ? Math.sin(pose.moveCycleT * Math.PI * 2) * 0.35 : 0
  const isAttacking = pose.state === 'attack' || pose.state === 'special'
  const moveT = t / 250
  const armSwing = isAttacking
    ? lerpAngle(0.3, -0.9, easeOutQuad(moveT))
    : Math.sin(pose.moveCycleT * Math.PI * 2 + Math.PI) * 0.15
  const idleBob = pose.state === 'idle' ? Math.sin(t * 0.003) * 2 : 0
  const tuck = airborneLegTuck(pose)
  const legAngleL = lerpAngle(Math.PI / 2 + legSwing, Math.PI / 2 - 0.5, tuck)
  const legAngleR = lerpAngle(Math.PI / 2 - legSwing, Math.PI / 2 + 0.5, tuck)
  const legLength = lerpAngle(26, 16, tuck)

  ctx.save()
  ctx.translate(0, idleBob)
  ctx.scale(1, landingSquash(pose))

  drawLimb(ctx, -10, -26, legAngleL, legLength, 14, TRUNK_BROWN)
  drawLimb(ctx, 10, -26, legAngleR, legLength, 14, TRUNK_BROWN)

  drawLimb(ctx, -4, -70, Math.PI / 2 + 0.6 - armSwing * 0.4, 34, 10, LEAF_GREEN)

  drawBlob(ctx, 0, -58, 24, 30, LEAF_GREEN)
  drawBlob(ctx, 0, -62, 18, 20, LEAF_LIGHT)

  drawLimb(ctx, 6, -70, Math.PI / 2 - 0.6 + armSwing, 38, 11, LEAF_GREEN)

  drawBlob(ctx, 0, -96, 15, 15, LEAF_LIGHT)
  ctx.fillStyle = '#17331a'
  ctx.beginPath()
  ctx.arc(-5, -97, 2, 0, Math.PI * 2)
  ctx.arc(5, -97, 2, 0, Math.PI * 2)
  ctx.fill()

  drawBlockGuard(ctx, pose, BODY_HEIGHT)

  ctx.restore()
}

export const bananaLeafWarrior: CharacterDef = {
  id: 'banana-leaf-warrior',
  name: 'Banana Leaf Warrior',
  tagline: 'Balanced melee fighter',
  description:
    'A steadfast guardian woven from banana leaves, trained in balanced hand-to-hand combat passed down through festival nights.',
  stats: { maxHp: 100, attack: 10, defense: 10, speed: 1 },
  basicAttack: {
    id: 'blw-basic',
    name: 'Leaf Slap',
    startupMs: 120,
    activeMs: 90,
    recoveryMs: 180,
    damage: 8,
    knockback: { x: 0.25, y: 0 },
    hitstunMs: 280,
    blockStunMs: 120,
    hitboxOffset: { x: 38, y: 10, width: 46, height: 50 },
  },
  special: {
    id: 'blw-special',
    name: 'Banana Leaf Spin',
    description: 'A sweeping spin of razor-edged leaves that strikes every foe standing close by.',
    startupMs: 150,
    activeMs: 260,
    recoveryMs: 260,
    damage: 16,
    knockback: { x: 0.35, y: 0 },
    hitstunMs: 380,
    blockStunMs: 160,
    hitboxOffset: { x: 0, y: 5, width: 100, height: 70 },
    cooldownMs: 4500,
    onActivate: (self, world) => {
      world.spawnParticles({ x: self.position.x, y: self.position.y + 40, color: LEAF_LIGHT, count: 14 })
    },
  },
  visual: {
    bodyColor: LEAF_GREEN,
    accentColor: LEAF_LIGHT,
    width: 50,
    height: BODY_HEIGHT,
    drawFighter,
  },
}
