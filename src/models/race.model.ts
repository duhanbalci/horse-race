import { nextTick } from 'vue'
import { generateLane, pickRandom } from '../utils'
import { Competitor } from './competitor.model'
import type { Horse } from './horse.model'
import { Leg } from './leg.model'

export class Race {
  legs: Leg[]
  over: boolean = false

  constructor(legs: Leg[]) {
    this.legs = legs
  }

  static generateRace({
    horses,
    mapSegments,
    mapWidth,
    mapHeight,
    legLengths = [1200, 1400, 1600, 1800, 2000, 2200],
  }: {
    horses: Horse[]
    mapSegments: number
    mapWidth: number
    mapHeight: number
    legLengths?: number[]
  }): Race {
    const legs: Leg[] = []

    horses.forEach((horse) => horse.reset())

    for (const length of legLengths) {
      const commands = generateLane({
        segments: mapSegments,
        width: mapWidth,
        height: mapHeight,
      })
      const competitors = pickRandom(horses, 10).map((horse) => Competitor.fromHorse(horse))
      const leg = Leg.generateLegFromLengthAndHorses(length, competitors, commands)
      legs.push(leg)
    }

    return new Race(legs)
  }

  async startRace() {
    for (let i = 0; i < this.legs.length; i++) {
      const leg = this.legs[i]
      leg.isRunning = true
      await nextTick()
      await leg.run()
      leg.isRunning = false
      leg.completed = true
    }

    this.over = true
  }
}
