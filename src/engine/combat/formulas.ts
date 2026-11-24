import { BLOCK_DAMAGE_MULT, BLOCK_KNOCKBACK_MULT, SHORT_BLOCK_STUN_MS } from '../constants'

export function computeDamage(
  baseDamage: number,
  attackerAttack: number,
  defenderDefense: number,
  blocking: boolean,
): number {
  const raw = baseDamage * (attackerAttack / defenderDefense)
  return Math.max(1, Math.round(blocking ? raw * BLOCK_DAMAGE_MULT : raw))
}

export function computeKnockbackX(baseKnockbackX: number, attackerFacing: 1 | -1, blocking: boolean): number {
  return baseKnockbackX * attackerFacing * (blocking ? BLOCK_KNOCKBACK_MULT : 1)
}

export function computeHitstunMs(baseHitstunMs: number, blockStunMs: number | undefined, blocking: boolean): number {
  return blocking ? (blockStunMs ?? SHORT_BLOCK_STUN_MS) : baseHitstunMs
}

/** A hit only counts as blocked if the defender is guarding AND facing the attacker's side. */
export function isFrontalBlock(
  attackerX: number,
  defenderX: number,
  defenderFacing: 1 | -1,
  defenderIsBlocking: boolean,
): boolean {
  if (!defenderIsBlocking) return false
  const attackerSide: 1 | -1 = attackerX >= defenderX ? 1 : -1
  return attackerSide === defenderFacing
}
