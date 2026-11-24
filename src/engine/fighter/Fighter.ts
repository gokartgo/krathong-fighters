import type { CharacterDef, FighterPose, MoveDef } from '../../characters/types'
import {
  ATTACK_LUNGE_DAMPING_PER_MS,
  ATTACK_LUNGE_SPEED,
  BASE_MOVE_SPEED,
  DEPTH_MOVE_SPEED,
  DIAGONAL_SPEED_NORMALIZER,
  JUMP_IMPULSE,
  KNOCKBACK_DAMPING_PER_MS,
  WALK_CYCLE_SPEED,
} from '../constants'
import type { ActionState, Controller } from '../input/types'
import type { PlayerHudSnapshot } from '../Match'
import type { Rect } from '../types'
import type { FighterState } from './FighterState'

export interface FighterInitOptions {
  id: string
  playerSlot: 1 | 2
  teamId: 0 | 1
  def: CharacterDef
  controller: Controller
  spawnX: number
  facing: 1 | -1
}

export interface ApplyHitOptions {
  damage: number
  knockbackX: number
  hitstunMs: number
  blocked: boolean
}

export class Fighter {
  readonly id: string
  readonly playerSlot: 1 | 2
  readonly teamId: 0 | 1
  readonly def: CharacterDef

  controller: Controller
  position: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  facing: 1 | -1
  hp: number
  state: FighterState
  stateElapsedMs: number
  moveCycleT: number
  specialCooldownMs: number
  hitstunDurationMs: number
  activeMoveHitIds: Set<string>

  constructor(options: FighterInitOptions) {
    this.id = options.id
    this.playerSlot = options.playerSlot
    this.teamId = options.teamId
    this.def = options.def
    this.controller = options.controller
    this.position = { x: options.spawnX, y: 0, z: 0 }
    this.velocity = { x: 0, y: 0, z: 0 }
    this.facing = options.facing
    this.hp = options.def.stats.maxHp
    this.state = 'idle'
    this.stateElapsedMs = 0
    this.moveCycleT = 0
    this.specialCooldownMs = 0
    this.hitstunDurationMs = 0
    this.activeMoveHitIds = new Set()
  }

  get isGrounded(): boolean {
    return this.position.y <= 0
  }

  /** Satisfies characters/types.ts's FighterRuntimeHandle structurally, for special-ability callbacks. */
  applyImpulse(vx: number, vy: number): void {
    this.velocity.x += vx
    this.velocity.y += vy
  }

  applyHit(hit: ApplyHitOptions): void {
    if (this.state === 'ko') return
    this.hp = Math.max(0, this.hp - hit.damage)
    this.velocity.x = hit.knockbackX
    if (this.hp <= 0) {
      this.enterState('ko')
      return
    }
    // Blocked hits stay in 'block' (already the precondition for hit.blocked) so the small
    // pushback velocity above survives — re-entering 'block' here would immediately zero it.
    if (hit.blocked) return
    this.hitstunDurationMs = hit.hitstunMs
    this.enterState('hitstun')
  }

  update(dt: number, action: ActionState): void {
    if (this.state === 'ko') return
    this.stateElapsedMs += dt
    this.specialCooldownMs = Math.max(0, this.specialCooldownMs - dt)

    if (action.moveX !== 0 && (this.state === 'idle' || this.state === 'walk')) {
      this.moveCycleT = (this.moveCycleT + dt * WALK_CYCLE_SPEED) % 1
    }

    switch (this.state) {
      case 'idle':
      case 'walk': {
        if (action.blockHeld) {
          this.enterState('block')
          break
        }
        if (action.jumpPressed && this.isGrounded) {
          this.velocity.y = JUMP_IMPULSE
          this.enterState('jump')
          break
        }
        if (action.attackPressed) {
          this.enterState('attack')
          break
        }
        if (action.specialPressed && this.specialCooldownMs <= 0) {
          this.enterState('special')
          break
        }
        this.applyMovement(action)
        this.state = action.moveX !== 0 || action.moveZ !== 0 ? 'walk' : 'idle'
        break
      }
      case 'jump': {
        if (action.attackPressed) {
          this.enterState('attack')
          break
        }
        if (action.specialPressed && this.specialCooldownMs <= 0) {
          this.enterState('special')
          break
        }
        this.applyMovement(action)
        if (this.velocity.y <= 0) this.enterState('fall')
        break
      }
      case 'fall': {
        if (action.attackPressed) {
          this.enterState('attack')
          break
        }
        if (action.specialPressed && this.specialCooldownMs <= 0) {
          this.enterState('special')
          break
        }
        this.applyMovement(action)
        if (this.isGrounded) {
          this.enterState(action.moveX !== 0 || action.moveZ !== 0 ? 'walk' : 'idle')
        }
        break
      }
      case 'attack':
      case 'special': {
        this.velocity.x *= Math.exp(-ATTACK_LUNGE_DAMPING_PER_MS * dt)
        if (this.stateElapsedMs >= this.currentMoveTotalMs()) {
          this.enterState(this.isGrounded ? 'idle' : 'fall')
        }
        break
      }
      case 'block': {
        this.velocity.x *= Math.exp(-KNOCKBACK_DAMPING_PER_MS * dt)
        if (!action.blockHeld) this.enterState('idle')
        break
      }
      case 'hitstun': {
        this.velocity.x *= Math.exp(-KNOCKBACK_DAMPING_PER_MS * dt)
        if (this.stateElapsedMs >= this.hitstunDurationMs) {
          this.enterState(this.isGrounded ? 'idle' : 'fall')
        }
        break
      }
      default:
        break
    }
  }

  getActiveHitbox(): { rect: Rect; move: MoveDef } | null {
    const move = this.currentMove()
    if (!move) return null
    const t = this.stateElapsedMs
    if (t < move.startupMs || t >= move.startupMs + move.activeMs) return null
    const off = move.hitboxOffset
    const centerX = this.position.x + off.x * this.facing
    // The hitbox's floor stays at the move's normal (grounded) height, but its reach extends up
    // to wherever the attacker currently is — so a jumping attack sweeps the gap down to a
    // grounded opponent instead of floating entirely at the attacker's elevated position.
    return {
      rect: { x: centerX - off.width / 2, y: off.y, width: off.width, height: off.height + this.position.y },
      move,
    }
  }

  getHudSnapshot(): PlayerHudSnapshot {
    const specialReady = this.specialCooldownMs <= 0
    const specialPercent = specialReady ? 100 : 100 * (1 - this.specialCooldownMs / this.def.special.cooldownMs)
    return {
      hpPercent: Math.max(0, (this.hp / this.def.stats.maxHp) * 100),
      specialPercent: Math.max(0, Math.min(100, specialPercent)),
      specialReady,
    }
  }

  getPose(): FighterPose {
    return {
      state: this.state,
      facing: this.facing,
      moveCycleT: this.moveCycleT,
      stateElapsedMs: this.stateElapsedMs,
    }
  }

  draw(ctx: CanvasRenderingContext2D, screenX: number, screenY: number, scale: number): void {
    ctx.save()
    ctx.translate(screenX, screenY)
    ctx.scale(this.facing * scale, scale)
    this.def.visual.drawFighter(ctx, this.getPose(), this.stateElapsedMs)
    ctx.restore()
  }

  private enterState(next: FighterState): void {
    this.state = next
    this.stateElapsedMs = 0
    if (next === 'block') {
      this.velocity.x = 0
      this.velocity.z = 0
    }
    if (next === 'attack' || next === 'special') {
      // A brief forward step so attacks have some commitment/reach, not just an arm swinging in place.
      this.velocity.x = ATTACK_LUNGE_SPEED * this.facing * this.def.stats.speed
      this.velocity.z = 0
      this.activeMoveHitIds.clear()
    }
    if (next === 'special') {
      this.specialCooldownMs = this.def.special.cooldownMs
    }
  }

  private currentMove(): MoveDef | null {
    if (this.state === 'attack') return this.def.basicAttack
    if (this.state === 'special') return this.def.special
    return null
  }

  private currentMoveTotalMs(): number {
    const move = this.currentMove()
    return move ? move.startupMs + move.activeMs + move.recoveryMs : 0
  }

  private applyMovement(action: ActionState): void {
    const diagonal = action.moveX !== 0 && action.moveZ !== 0 ? DIAGONAL_SPEED_NORMALIZER : 1
    this.velocity.x = action.moveX * BASE_MOVE_SPEED * this.def.stats.speed * diagonal
    this.velocity.z = action.moveZ * DEPTH_MOVE_SPEED * this.def.stats.speed * diagonal
  }
}
