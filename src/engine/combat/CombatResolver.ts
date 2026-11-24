import type { MoveDef } from '../../characters/types'
import type { Projectile } from '../effects/Projectile'
import type { Fighter } from '../fighter/Fighter'
import { computeDamage, computeHitstunMs, computeKnockbackX, isFrontalBlock } from './formulas'

export function resolveMeleeHit(attacker: Fighter, defender: Fighter, move: MoveDef): void {
  attacker.activeMoveHitIds.add(defender.id)
  const blocked = isFrontalBlock(attacker.position.x, defender.position.x, defender.facing, defender.state === 'block')
  const damage = computeDamage(move.damage, attacker.def.stats.attack, defender.def.stats.defense, blocked)
  const knockbackX = computeKnockbackX(move.knockback.x, attacker.facing, blocked)
  const hitstunMs = computeHitstunMs(move.hitstunMs, move.blockStunMs, blocked)
  defender.applyHit({ damage, knockbackX, hitstunMs, blocked })
}

export function resolveProjectileHit(projectile: Projectile, defender: Fighter): void {
  const blocked = isFrontalBlock(projectile.x, defender.position.x, defender.facing, defender.state === 'block')
  const damage = computeDamage(projectile.damage, projectile.attackerAttackStat, defender.def.stats.defense, blocked)
  const knockbackX = computeKnockbackX(projectile.knockbackX, projectile.facing, blocked)
  const hitstunMs = computeHitstunMs(projectile.hitstunMs, undefined, blocked)
  defender.applyHit({ damage, knockbackX, hitstunMs, blocked })
}
