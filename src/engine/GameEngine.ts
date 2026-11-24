import { getCharacter } from '../characters'
import type { AbilityWorldApi } from '../characters/types'
import { drawBackground } from './Arena'
import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  ARENA_X_MAX,
  ARENA_X_MIN,
  DEPTH_SCALE_FACTOR,
  DEPTH_Y_PARALLAX,
  ESTIMATED_MAX_JUMP_HEIGHT,
  GROUND_SCREEN_Y,
  MAX_DT_MS,
  PIXELATION_SCALE,
  ROUND_DURATION_MS,
} from './constants'
import { resolveMeleeHit, resolveProjectileHit } from './combat/CombatResolver'
import { createParticleBurst, drawParticle, isParticleDone, updateParticle, type Particle } from './effects/ParticleSystem'
import { createProjectile, isProjectileDone, projectileRect, updateProjectile, type Projectile } from './effects/Projectile'
import { Fighter } from './fighter/Fighter'
import { HumanController } from './input/HumanController'
import { PLAYER_1_BINDINGS, PLAYER_2_BINDINGS } from './input/bindings'
import { InputManager } from './input/InputManager'
import { decideHigherHpWinner, type EngineCallbacks, type MatchConfig } from './Match'
import { getHurtbox, rectsOverlap, withinDepthRange } from './physics/collision'
import { stepPhysics } from './physics/physics'

interface ScreenTransform {
  x: number
  y: number
  scale: number
}

export class GameEngine {
  private displayCtx: CanvasRenderingContext2D
  private ctx: CanvasRenderingContext2D
  private offscreenCanvas: HTMLCanvasElement
  private callbacks: EngineCallbacks
  private input: InputManager
  private fighters: [Fighter, Fighter]
  private projectiles: Projectile[] = []
  private particles: Particle[] = []
  private rafId = 0
  private lastTime = 0
  private elapsedMs = 0
  private remainingMs = ROUND_DURATION_MS
  private matchEnded = false

  constructor(canvas: HTMLCanvasElement, config: MatchConfig, callbacks: EngineCallbacks) {
    const displayCtx = canvas.getContext('2d')
    if (!displayCtx) throw new Error('Canvas 2D context unavailable')
    this.displayCtx = displayCtx

    this.offscreenCanvas = document.createElement('canvas')
    this.offscreenCanvas.width = ARENA_WIDTH * PIXELATION_SCALE
    this.offscreenCanvas.height = ARENA_HEIGHT * PIXELATION_SCALE
    const offscreenCtx = this.offscreenCanvas.getContext('2d')
    if (!offscreenCtx) throw new Error('Canvas 2D context unavailable')
    this.ctx = offscreenCtx

    this.callbacks = callbacks
    this.input = new InputManager()

    this.fighters = [
      new Fighter({
        id: 'p1',
        playerSlot: 1,
        teamId: 0,
        def: getCharacter(config.player1CharacterId),
        controller: new HumanController(this.input, PLAYER_1_BINDINGS),
        spawnX: ARENA_WIDTH * 0.32,
        facing: 1,
      }),
      new Fighter({
        id: 'p2',
        playerSlot: 2,
        teamId: 1,
        def: getCharacter(config.player2CharacterId),
        controller: new HumanController(this.input, PLAYER_2_BINDINGS),
        spawnX: ARENA_WIDTH * 0.68,
        facing: -1,
      }),
    ]
  }

  start(): void {
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    cancelAnimationFrame(this.rafId)
    this.input.dispose()
  }

  private tick = (now: number): void => {
    const dt = Math.min(now - this.lastTime, MAX_DT_MS)
    this.lastTime = now
    this.update(dt)
    this.render()
    this.rafId = requestAnimationFrame(this.tick)
  }

  private worldApiFor(fighter: Fighter): AbilityWorldApi {
    return {
      spawnProjectile: (def) => {
        this.projectiles.push(createProjectile(def, fighter.id, fighter.def.stats.attack, fighter.facing))
      },
      spawnParticles: (def) => {
        this.particles.push(...createParticleBurst(def))
      },
    }
  }

  private endMatch(winnerPlayer: 1 | 2): void {
    if (this.matchEnded) return
    this.matchEnded = true
    this.callbacks.onMatchEnd(winnerPlayer)
  }

  private update(dt: number): void {
    this.elapsedMs += dt
    if (this.matchEnded) return
    this.remainingMs = Math.max(0, this.remainingMs - dt)

    const [f1, f2] = this.fighters
    f1.facing = f1.position.x <= f2.position.x ? 1 : -1
    f2.facing = f2.position.x <= f1.position.x ? 1 : -1

    for (const fighter of this.fighters) {
      const action = fighter.controller.getAction()
      const wasSpecial = fighter.state === 'special'
      fighter.update(dt, action)
      stepPhysics(fighter, dt)
      if (fighter.state === 'special' && !wasSpecial) {
        fighter.def.special.onActivate(fighter, this.worldApiFor(fighter))
      }
    }

    this.resolveMeleeHits()
    this.resolveProjectiles(dt)
    this.updateParticles(dt)
    this.checkMatchEnd(f1, f2)

    this.callbacks.onHudUpdate({
      player1: f1.getHudSnapshot(),
      player2: f2.getHudSnapshot(),
      secondsLeft: Math.ceil(this.remainingMs / 1000),
    })
  }

  private resolveMeleeHits(): void {
    for (const attacker of this.fighters) {
      const active = attacker.getActiveHitbox()
      if (!active) continue
      for (const defender of this.fighters) {
        if (defender === attacker || defender.state === 'ko') continue
        if (attacker.activeMoveHitIds.has(defender.id)) continue
        if (!withinDepthRange(attacker.position.z, defender.position.z)) continue
        if (!rectsOverlap(active.rect, getHurtbox(defender))) continue
        resolveMeleeHit(attacker, defender, active.move)
      }
    }
  }

  private resolveProjectiles(dt: number): void {
    for (const projectile of this.projectiles) {
      updateProjectile(projectile, dt)
      if (projectile.spent) continue
      for (const defender of this.fighters) {
        if (defender.id === projectile.ownerId || defender.state === 'ko') continue
        if (!withinDepthRange(projectile.z, defender.position.z)) continue
        if (!rectsOverlap(projectileRect(projectile), getHurtbox(defender))) continue
        resolveProjectileHit(projectile, defender)
        projectile.spent = true
      }
    }
    this.projectiles = this.projectiles.filter((p) => !isProjectileDone(p, ARENA_X_MIN, ARENA_X_MAX))
  }

  private updateParticles(dt: number): void {
    for (const particle of this.particles) updateParticle(particle, dt)
    this.particles = this.particles.filter((p) => !isParticleDone(p))
  }

  private checkMatchEnd(f1: Fighter, f2: Fighter): void {
    if (f1.state === 'ko' || f2.state === 'ko') {
      if (f1.state === 'ko' && f2.state === 'ko') {
        this.endMatch(decideHigherHpWinner(f1.hp, f2.hp))
      } else {
        this.endMatch(f1.state === 'ko' ? 2 : 1)
      }
    } else if (this.remainingMs <= 0) {
      this.endMatch(decideHigherHpWinner(f1.hp, f2.hp))
    }
  }

  private drawGroundShadow(fighter: Fighter): void {
    if (fighter.state === 'ko') return
    const jumpRatio = Math.min(1, fighter.position.y / ESTIMATED_MAX_JUMP_HEIGHT)
    const ground = this.worldToScreen(fighter.position.x, 0, fighter.position.z)
    const radiusX = fighter.def.visual.width * 0.42 * ground.scale * (1 - jumpRatio * 0.3)

    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = 0.35 * (1 - jumpRatio * 0.6)
    ctx.fillStyle = '#000814'
    ctx.beginPath()
    ctx.ellipse(ground.x, ground.y, radiusX, radiusX * 0.32, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  private worldToScreen(x: number, y: number, z: number): ScreenTransform {
    return {
      x,
      y: GROUND_SCREEN_Y - y - z * DEPTH_Y_PARALLAX,
      scale: 1 + z * DEPTH_SCALE_FACTOR,
    }
  }

  private render(): void {
    const ctx = this.ctx
    ctx.save()
    ctx.scale(PIXELATION_SCALE, PIXELATION_SCALE)
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT)
    drawBackground(ctx, this.elapsedMs)

    const sortedFighters = [...this.fighters].sort((a, b) => a.position.z - b.position.z)
    for (const fighter of sortedFighters) {
      this.drawGroundShadow(fighter)
    }
    for (const fighter of sortedFighters) {
      const screen = this.worldToScreen(fighter.position.x, fighter.position.y, fighter.position.z)
      fighter.draw(ctx, screen.x, screen.y, screen.scale)
    }

    for (const projectile of this.projectiles) {
      const screen = this.worldToScreen(projectile.x, projectile.y, projectile.z)
      ctx.save()
      ctx.fillStyle = projectile.color
      ctx.beginPath()
      ctx.ellipse(
        screen.x,
        screen.y,
        (projectile.width / 2) * screen.scale,
        (projectile.height / 2) * screen.scale,
        0,
        0,
        Math.PI * 2,
      )
      ctx.fill()
      ctx.restore()
    }

    for (const particle of this.particles) {
      const screen = this.worldToScreen(particle.x, particle.y, 0)
      drawParticle(ctx, particle, screen.x, screen.y)
    }

    ctx.restore()

    this.displayCtx.imageSmoothingEnabled = false
    this.displayCtx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT)
    this.displayCtx.drawImage(this.offscreenCanvas, 0, 0, ARENA_WIDTH, ARENA_HEIGHT)
  }
}
