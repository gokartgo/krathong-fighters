import { ARENA_HEIGHT, ARENA_WIDTH, GROUND_SCREEN_Y } from './constants'

// Fractions of ARENA_WIDTH/ARENA_HEIGHT so decorations scale automatically if the arena resizes.
const STAR_FRACTIONS = [
  { fx: 0.05, fy: 0.06 },
  { fx: 0.11, fy: 0.13 },
  { fx: 0.18, fy: 0.07 },
  { fx: 0.25, fy: 0.16 },
  { fx: 0.33, fy: 0.08 },
  { fx: 0.42, fy: 0.14 },
  { fx: 0.51, fy: 0.06 },
  { fx: 0.59, fy: 0.11 },
  { fx: 0.66, fy: 0.07 },
  { fx: 0.09, fy: 0.23 },
  { fx: 0.47, fy: 0.21 },
  { fx: 0.73, fy: 0.1 },
  { fx: 0.8, fy: 0.18 },
  { fx: 0.87, fy: 0.08 },
]

const KRATHONG_X_FRACTIONS = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92]
const LANTERN_FRACTIONS = [
  { fx: 0.07, fy: 0.1 },
  { fx: 0.23, fy: 0.07 },
  { fx: 0.55, fy: 0.09 },
  { fx: 0.78, fy: 0.12 },
]

function drawRoofSilhouette(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, scale: number, mirror: boolean): void {
  const dir = mirror ? -1 : 1
  ctx.save()
  ctx.translate(baseX, baseY)
  ctx.scale(dir, 1)
  ctx.fillStyle = 'rgba(5, 9, 28, 0.85)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(40 * scale, -70 * scale)
  ctx.lineTo(60 * scale, -60 * scale)
  ctx.lineTo(110 * scale, -130 * scale)
  ctx.lineTo(160 * scale, -60 * scale)
  ctx.lineTo(180 * scale, -70 * scale)
  ctx.lineTo(220 * scale, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawKrathong(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, seed: number): void {
  const bob = Math.sin(t * 0.0012 + seed) * 3
  ctx.save()
  ctx.translate(x, y + bob)

  ctx.fillStyle = '#7a4a21'
  ctx.beginPath()
  ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e8c468'
  ctx.beginPath()
  ctx.ellipse(0, -1, 10, 3.2, 0, 0, Math.PI * 2)
  ctx.fill()

  const glow = 0.7 + 0.3 * Math.sin(t * 0.02 + seed * 3)
  ctx.save()
  ctx.globalAlpha = glow
  ctx.fillStyle = '#ffdd8a'
  ctx.shadowColor = '#ffb347'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.ellipse(0, -8, 3, 6, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.restore()
}

function drawLantern(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, seed: number): void {
  const sway = Math.sin(t * 0.0009 + seed) * 6
  ctx.save()
  ctx.translate(x + sway, y)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.moveTo(0, -18)
  ctx.lineTo(0, 0)
  ctx.stroke()
  const glow = 0.75 + 0.25 * Math.sin(t * 0.01 + seed * 2)
  ctx.save()
  ctx.globalAlpha = glow
  ctx.fillStyle = '#ff8f5e'
  ctx.shadowColor = '#ff8f5e'
  ctx.shadowBlur = 14
  ctx.beginPath()
  ctx.ellipse(0, 10, 9, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.restore()
}

export function drawBackground(ctx: CanvasRenderingContext2D, t = 0): void {
  const sky = ctx.createLinearGradient(0, 0, 0, ARENA_HEIGHT)
  sky.addColorStop(0, '#0b1340')
  sky.addColorStop(0.55, '#1b2a6b')
  sky.addColorStop(1, '#2d3f8f')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT)

  for (const star of STAR_FRACTIONS) {
    const x = star.fx * ARENA_WIDTH
    const y = star.fy * ARENA_HEIGHT
    const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.0015 + x))
    ctx.save()
    ctx.globalAlpha = twinkle
    ctx.fillStyle = '#fef9e6'
    ctx.beginPath()
    ctx.arc(x, y, 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.save()
  ctx.fillStyle = '#fff6d8'
  ctx.shadowColor = '#fff6d8'
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.arc(ARENA_WIDTH - 150, ARENA_HEIGHT * 0.12, 48, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  for (const lantern of LANTERN_FRACTIONS) {
    drawLantern(ctx, lantern.fx * ARENA_WIDTH, lantern.fy * ARENA_HEIGHT, t, lantern.fx * 10)
  }

  drawRoofSilhouette(ctx, 0, GROUND_SCREEN_Y, 1.3, false)
  drawRoofSilhouette(ctx, ARENA_WIDTH, GROUND_SCREEN_Y, 1.45, true)

  const river = ctx.createLinearGradient(0, GROUND_SCREEN_Y, 0, ARENA_HEIGHT)
  river.addColorStop(0, '#13306b')
  river.addColorStop(1, '#0a1836')
  ctx.fillStyle = river
  ctx.fillRect(0, GROUND_SCREEN_Y, ARENA_WIDTH, ARENA_HEIGHT - GROUND_SCREEN_Y)

  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, GROUND_SCREEN_Y)
  ctx.lineTo(ARENA_WIDTH, GROUND_SCREEN_Y)
  ctx.stroke()

  KRATHONG_X_FRACTIONS.forEach((fx, i) => {
    drawKrathong(ctx, fx * ARENA_WIDTH, GROUND_SCREEN_Y + 26 + (i % 2) * 10, t, i)
  })
}
