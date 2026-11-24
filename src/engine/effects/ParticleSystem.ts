import type { ParticleBurstDef } from '../../characters/types'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  ageMs: number
  maxLifeMs: number
}

export function createParticleBurst(def: ParticleBurstDef): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < def.count; i += 1) {
    const angle = (Math.PI * 2 * i) / def.count + Math.random() * 0.4
    const speed = 0.08 + Math.random() * 0.12
    particles.push({
      x: def.x,
      y: def.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: def.color,
      size: 3 + Math.random() * 3,
      ageMs: 0,
      maxLifeMs: 300 + Math.random() * 200,
    })
  }
  return particles
}

export function updateParticle(particle: Particle, dt: number): void {
  particle.x += particle.vx * dt
  particle.y -= particle.vy * dt
  particle.ageMs += dt
}

export function isParticleDone(particle: Particle): boolean {
  return particle.ageMs >= particle.maxLifeMs
}

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, screenX: number, screenY: number): void {
  const lifeRatio = 1 - particle.ageMs / particle.maxLifeMs
  ctx.save()
  ctx.globalAlpha = Math.max(0, lifeRatio)
  ctx.fillStyle = particle.color
  ctx.beginPath()
  ctx.arc(screenX, screenY, particle.size * lifeRatio, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
