import type { FighterState } from '../engine/fighter/FighterState'

export type CharacterId =
  | 'banana-leaf-warrior'
  | 'lotus-mage'
  | 'coconut-guardian'
  | 'flame-spirit'
  | 'jasmine-guardian'
  | 'naga-warrior'
  | 'golden-candle-knight'
  | 'orchid-dancer'

export interface Vector2 {
  x: number
  y: number
}

export interface CharacterStats {
  maxHp: number
  attack: number
  defense: number
  speed: number
}

export interface MoveDef {
  id: string
  name: string
  startupMs: number
  activeMs: number
  recoveryMs: number
  damage: number
  knockback: Vector2
  hitstunMs: number
  blockStunMs?: number
  hitboxOffset: { x: number; y: number; width: number; height: number }
}

export interface ProjectileSpawnDef {
  x: number
  y: number
  z: number
  vx: number
  width: number
  height: number
  damage: number
  knockback: Vector2
  hitstunMs: number
  color: string
  maxLifeMs: number
}

export interface ParticleBurstDef {
  x: number
  y: number
  color: string
  count: number
}

// Narrow contract only. characters/*.ts must never import engine/fighter/Fighter.ts — Fighter
// satisfies this structurally, which is what keeps characters/ decoupled from the engine.
export interface FighterRuntimeHandle {
  position: { x: number; y: number; z: number }
  facing: 1 | -1
  applyImpulse(vx: number, vy: number): void
}

export interface AbilityWorldApi {
  spawnProjectile(def: ProjectileSpawnDef): void
  spawnParticles(def: ParticleBurstDef): void
}

export interface SpecialAbilityDef extends MoveDef {
  description: string
  cooldownMs: number
  onActivate: (self: FighterRuntimeHandle, world: AbilityWorldApi) => void
}

export interface FighterPose {
  state: FighterState
  facing: 1 | -1
  moveCycleT: number
  stateElapsedMs: number
}

export interface CharacterVisualDef {
  bodyColor: string
  accentColor: string
  width: number
  height: number
  drawFighter: (ctx: CanvasRenderingContext2D, pose: FighterPose, t: number) => void
}

export interface CharacterDef {
  id: CharacterId
  name: string
  tagline: string
  description: string
  stats: CharacterStats
  basicAttack: MoveDef
  special: SpecialAbilityDef
  visual: CharacterVisualDef
}
