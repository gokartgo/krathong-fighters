export const ARENA_WIDTH = 1280
export const ARENA_HEIGHT = 720

export const ARENA_X_MIN = 90
export const ARENA_X_MAX = ARENA_WIDTH - 90

export const DEPTH_MIN = -140
export const DEPTH_MAX = 140
export const DEPTH_HIT_TOLERANCE = 70

export const GROUND_SCREEN_Y = 560
export const DEPTH_Y_PARALLAX = 0.55
// Kept at 0 so moving along the depth axis (forward/back) no longer changes a character's size.
export const DEPTH_SCALE_FACTOR = 0
export const PIXELATION_SCALE = 0.5

export const GRAVITY = 0.00195
// Positive: position.y increases while airborne (0 = grounded). See physics.ts.
export const JUMP_IMPULSE = 0.88
export const ESTIMATED_MAX_JUMP_HEIGHT = (JUMP_IMPULSE * JUMP_IMPULSE) / (2 * GRAVITY)
export const BASE_MOVE_SPEED = 0.32
export const DEPTH_MOVE_SPEED = 0.24
export const DIAGONAL_SPEED_NORMALIZER = Math.SQRT1_2
export const WALK_CYCLE_SPEED = 0.0028
export const KNOCKBACK_DAMPING_PER_MS = 0.006

// A brief forward step on every attack/special, scaled by the character's own speed stat, so
// attacks have some real commitment/reach instead of just swinging an arm in place.
export const ATTACK_LUNGE_SPEED = 0.22
export const ATTACK_LUNGE_DAMPING_PER_MS = 0.006

export const MAX_DT_MS = 50
export const ROUND_DURATION_MS = 99000

export const BLOCK_DAMAGE_MULT = 0.2
export const BLOCK_KNOCKBACK_MULT = 0.3
export const SHORT_BLOCK_STUN_MS = 150
