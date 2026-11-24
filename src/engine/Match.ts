import type { CharacterId } from '../characters/types'

export interface MatchConfig {
  player1CharacterId: CharacterId
  player2CharacterId: CharacterId
}

export interface PlayerHudSnapshot {
  hpPercent: number
  specialPercent: number
  specialReady: boolean
}

export interface HudSnapshot {
  player1: PlayerHudSnapshot
  player2: PlayerHudSnapshot
  secondsLeft: number
}

export interface EngineCallbacks {
  onHudUpdate: (snapshot: HudSnapshot) => void
  onMatchEnd: (winnerPlayer: 1 | 2) => void
}

export function decideHigherHpWinner(player1Hp: number, player2Hp: number): 1 | 2 {
  return player1Hp >= player2Hp ? 1 : 2
}
