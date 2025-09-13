import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { generateHorses } from '../utils'
import { type SpeedMultiplier } from '../constants'
import type { Horse } from '../models/horse.model'
import { Race } from '../models/race.model'

export const useGameStore = defineStore('game', () => {
  const horses = ref<Horse[]>(generateHorses(20))
  const speedMultiplier = ref<SpeedMultiplier>(5)

  const svgMap$ = ref<SVGSVGElement | null>(null)
  const horses$ = ref<HTMLElement[] | null>(null)
  const path$ = ref<SVGPathElement[] | null>(null)

  const race = ref<Race | null>(null)

  function generateNewRace() {
    race.value = Race.generateRace({
      horses: horses.value,
      mapSegments: 5,
      mapWidth: svgMap$.value?.viewBox.baseVal.width || 800,
      mapHeight: svgMap$.value?.viewBox.baseVal.height || 800,
    })
  }

  function startRace() {
    race.value?.startRace()
  }

  function setSpeedMultiplier(multiplier: SpeedMultiplier) {
    speedMultiplier.value = multiplier
  }

  const currentLeg = computed(() => {
    return race.value?.legs.find((leg) => leg.isRunning) || null
  })

  return {
    horses,
    horses$,
    svgMap$,
    path$,
    race,
    speedMultiplier,
    generateNewRace,
    currentLeg,
    startRace,
    setSpeedMultiplier,
  }
})
