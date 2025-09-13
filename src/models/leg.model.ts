import { DEFAULT_HORSE_SPEED } from '../constants'
import { useGameStore } from '../store/gameStore'
import type { Competitor } from './competitor.model'
import type { PathCommand } from './path.model'

export class Leg {
  // meters
  length: number
  // path for map
  pathCommands: PathCommand[]
  // random horses for leg
  competitors: Competitor[] = []
  completed: boolean = false
  isRunning: boolean = false

  constructor(length: number, pathCommands: PathCommand[], competitors: Competitor[]) {
    this.length = length
    this.pathCommands = pathCommands
    this.competitors = competitors
  }

  static generateLegFromLengthAndHorses(
    length: number,
    competitors: Competitor[],
    commands: PathCommand[],
  ) {
    return new Leg(length, commands, competitors)
  }

  async run() {
    const gameStore = useGameStore()

    if (this.competitors.length !== gameStore.horses$?.length) {
      return Promise.reject(new Error('Competitors and horse refs count mismatch'))
    }

    return new Promise<void>((resolve) => {
      const startTime = performance.now()
      let lastTime = startTime

      for (let i = 0; i < this.competitors.length; i++) {
        const competitor = this.competitors[i]
        competitor.setElement(gameStore.horses$?.[i] || null)
        competitor.setPath(gameStore.path$?.[i] || null)
        competitor.element$?.classList.remove('hide')
      }

      const update = () => {
        const currentTime = performance.now()
        const elapsed = currentTime - lastTime
        lastTime = currentTime

        for (const competitor of this.competitors) {
          if (!competitor.finished) {
            const raceProgress = competitor.progress / this.length
            const effortMultiplier = raceProgress * 0.5
            const conditionLoss = (elapsed / 1000) * gameStore.speedMultiplier * effortMultiplier
            competitor.reduceCondition(conditionLoss)

            const speedMultiplier = competitor.getCurrentSpeedMultiplier()

            const timeBasedVariation =
              1 + Math.sin(currentTime * 0.003 + competitor.horse.name.length) * 0.03

            competitor.progress = Math.min(
              competitor.progress +
                (elapsed / 1000) *
                  DEFAULT_HORSE_SPEED *
                  gameStore.speedMultiplier *
                  speedMultiplier *
                  timeBasedVariation,
              this.length,
            )
            competitor.position = (competitor.progress / this.length) * 100

            competitor.finishTime += elapsed * gameStore.speedMultiplier

            if (competitor.progress >= this.length) {
              competitor.finished = true
              competitor.element$?.classList.add('hide')
              console.log(
                `${competitor.horse.name} finished in ${competitor.finishTime / 1000}s with condition: ${competitor.horse.condition.toFixed(1)}%`,
              )
            }
            competitor.move()
          }
        }

        if (this.competitors.every((c) => c.finished)) {
          this.competitors.sort((a, b) => (a.finishTime! < b.finishTime! ? -1 : 1))
          this.competitors.forEach((c, index) => {
            c.rank = index + 1
          })
          resolve()
          return
        }

        this.competitors.sort((a, b) => (a.progress > b.progress ? -1 : 1))
        requestAnimationFrame(update)
      }

      requestAnimationFrame(update)
    })
  }
}
