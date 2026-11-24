import type { ProjectileSpawnDef } from '../../characters/types'
import type { Rect } from '../types'

export interface Projectile {
  id: string
  ownerId: string
  x: number
  y: number
  z: number
  vx: number
  facing: 1 | -1
  width: number
  height: number
  damage: number
  knockbackX: number
  hitstunMs: number
  attackerAttackStat: number
  color: string
  ageMs: number
  maxLifeMs: number
  spent: boolean
}

let nextProjectileId = 0

export function createProjectile(
  def: ProjectileSpawnDef,
  ownerId: string,
  attackerAttackStat: number,
  facing: 1 | -1,
): Projectile {
  nextProjectileId += 1
  return {
    id: `proj-${nextProjectileId}`,
    ownerId,
    x: def.x,
    y: def.y,
    z: def.z,
    vx: def.vx,
    facing,
    width: def.width,
    height: def.height,
    damage: def.damage,
    knockbackX: def.knockback.x,
    hitstunMs: def.hitstunMs,
    attackerAttackStat,
    color: def.color,
    ageMs: 0,
    maxLifeMs: def.maxLifeMs,
    spent: false,
  }
}

export function updateProjectile(projectile: Projectile, dt: number): void {
  projectile.x += projectile.vx * projectile.facing * dt
  projectile.ageMs += dt
}

export function isProjectileDone(projectile: Projectile, arenaXMin: number, arenaXMax: number): boolean {
  return (
    projectile.spent ||
    projectile.ageMs >= projectile.maxLifeMs ||
    projectile.x < arenaXMin ||
    projectile.x > arenaXMax
  )
}

export function projectileRect(projectile: Projectile): Rect {
  return {
    x: projectile.x - projectile.width / 2,
    y: projectile.y,
    width: projectile.width,
    height: projectile.height,
  }
}
