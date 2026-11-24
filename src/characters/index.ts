import { bananaLeafWarrior } from './bananaLeafWarrior'
import { coconutGuardian } from './coconutGuardian'
import { flameSpirit } from './flameSpirit'
import { goldenCandleKnight } from './goldenCandleKnight'
import { jasmineGuardian } from './jasmineGuardian'
import { lotusMage } from './lotusMage'
import { nagaWarrior } from './nagaWarrior'
import { orchidDancer } from './orchidDancer'
import type { CharacterDef, CharacterId } from './types'

export const CHARACTERS: CharacterDef[] = [
  bananaLeafWarrior,
  lotusMage,
  coconutGuardian,
  flameSpirit,
  jasmineGuardian,
  nagaWarrior,
  goldenCandleKnight,
  orchidDancer,
]

export function getCharacter(id: CharacterId): CharacterDef {
  const found = CHARACTERS.find((character) => character.id === id)
  if (!found) throw new Error(`Unknown character id: ${id}`)
  return found
}
