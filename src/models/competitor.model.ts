import { useGameStore } from '../store/gameStore'
import { hexToFilter, randomRange } from '../utils'
import type { Horse } from './horse.model'

export class Competitor {
  horse: Horse
  position: number
  progress: number
  finished: boolean
  finishTime: number
  rank: number | null
  baseSpeedMultiplier: number
  element$?: HTMLElement | null
  path$?: SVGPathElement | null
  isHovered: boolean = false

  constructor(horse: Horse) {
    this.horse = horse
    this.position = 0
    this.progress = 0
    this.finished = false
    this.finishTime = 0
    this.rank = null
    this.baseSpeedMultiplier = randomRange(0.8, 1.2)
  }

  static fromHorse(horse: Horse): Competitor {
    return new Competitor(horse)
  }

  setElement(el: HTMLElement | null) {
    this.element$ = el
  }

  setPath(el: SVGPathElement | null) {
    this.path$ = el
  }

  getCurrentSpeedMultiplier(): number {
    const conditionMultiplier = 0.6 + (this.horse.condition / 100) * 0.4

    return this.baseSpeedMultiplier * conditionMultiplier
  }

  reduceCondition(amount: number) {
    this.horse.condition = Math.max(0, this.horse.condition - amount)
  }

  move() {
    const gameStore = useGameStore()

    const svgMap$ = gameStore.svgMap$
    const path$ = this.path$
    const horse$ = this.element$
    if (!horse$ || !path$ || !svgMap$) {
      return
    }

    const pathLength = path$.getTotalLength()
    const point = path$.getPointAtLength((this.position / 100) * pathLength)

    if (horse$) {
      // svgnin gerçek boyutlarını al
      const svgRect = svgMap$.getBoundingClientRect()
      const svgViewBox = svgMap$.viewBox.baseVal

      // viewbox koordinatlarını gerçek DOM koordinatlarına dönüştür
      const scaleX = svgRect.width / svgViewBox.width
      const scaleY = svgRect.height / svgViewBox.height

      // Scroll pozisyonunu hesaba kat
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft
      const scrollY = window.pageYOffset || document.documentElement.scrollTop

      const realX = point.x * scaleX + svgRect.left + scrollX
      const realY = point.y * scaleY + svgRect.top + scrollY

      const x = realX - horse$.offsetWidth / 2
      const y = realY - horse$.offsetHeight / 2

      const nextPoint = path$.getPointAtLength(
        Math.min((this.position / 100) * pathLength + 1, pathLength),
      )
      if (nextPoint.x === point.x && nextPoint.y === point.y) {
        return
      }
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI) + 90
      horse$.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(0.15)`
      horse$.style.filter = hexToFilter(this.horse.color)
      horse$.classList.remove('hide')
      if (this.isHovered) {
        horse$.classList.add('hovered')
      } else {
        horse$.classList.remove('hovered')
      }
    }
  }
}
