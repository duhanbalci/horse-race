import { COLOR_HEXES, HORSE_NAMES } from './constants'
import { Horse } from './models/horse.model'
import { Curve, Move, SmoothCurve, type PathCommand } from './models/path.model'

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function generateLane({
  segments = 4,
  minX = 50,
  maxX = 200,
  width = 800,
  height = 800,
}: {
  segments?: number
  minX?: number
  maxX?: number
  width?: number
  height?: number
}): PathCommand[] {
  const commands: PathCommand[] = [new Move(50, height)]

  let currentX = 50
  let currentY = height
  const segmentHeight = height / segments

  const firstEndX = randomRange(minX, maxX)
  const firstEndY = currentY - segmentHeight
  const firstControl1X = currentX + 50
  const firstControl1Y = currentY - segmentHeight * 0.3
  const firstControl2X = firstEndX - 50
  const firstControl2Y = firstEndY + segmentHeight * 0.3

  commands.push(
    new Curve(firstControl1X, firstControl1Y, firstControl2X, firstControl2Y, firstEndX, firstEndY),
  )

  currentX = firstEndX
  currentY = firstEndY

  for (let i = 1; i < segments; i++) {
    const endX = randomRange(minX, maxX)
    const endY = currentY - segmentHeight
    const controlX = endX + (Math.random() - 0.5) * 80
    const controlY = endY + segmentHeight * 0.4

    commands.push(new SmoothCurve(controlX, controlY, endX, endY))

    currentX = endX
    currentY = endY
  }

  // log max X
  // const xList = commands.map((cmd) =>
  //   cmd instanceof Move
  //     ? cmd.point.x
  //     : cmd instanceof Curve
  //       ? Math.max(cmd.control1.x, cmd.control2.x, cmd.end.x)
  //       : Math.max(cmd.control.x, cmd.end.x),
  // )

  // console.log(Math.min(...xList), Math.max(...xList))

  return commands
}

export function offsetPath(
  commands: PathCommand[],
  offsetX: number,
  offsetY: number,
): PathCommand[] {
  return commands.map((cmd) => {
    if (cmd instanceof Move) {
      return new Move(cmd.point.x + offsetX, cmd.point.y + offsetY)
    } else if (cmd instanceof Curve) {
      return new Curve(
        cmd.control1.x + offsetX,
        cmd.control1.y + offsetY,
        cmd.control2.x + offsetX,
        cmd.control2.y + offsetY,
        cmd.end.x + offsetX,
        cmd.end.y + offsetY,
      )
    }
    return new SmoothCurve(
      cmd.control.x + offsetX,
      cmd.control.y + offsetY,
      cmd.end.x + offsetX,
      cmd.end.y + offsetY,
    )
  })
}

export function pathFromCommands(commands: PathCommand[]): string {
  return commands
    .map((cmd) => {
      if (cmd instanceof Move) {
        return `M ${cmd.point.x} ${cmd.point.y}`
      } else if (cmd instanceof Curve) {
        return `C ${cmd.control1.x} ${cmd.control1.y}, ${cmd.control2.x} ${cmd.control2.y}, ${cmd.end.x} ${cmd.end.y}`
      } else if (cmd instanceof SmoothCurve) {
        return `S ${cmd.control.x} ${cmd.control.y}, ${cmd.end.x} ${cmd.end.y}`
      }
    })
    .join(' ')
}

export function generateHorses(count: number): Horse[] {
  const horses: Horse[] = []
  const usedNames = new Set<string>()
  const usedColors = new Set<string>()

  while (horses.length < count) {
    const name = HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)]
    const color = COLOR_HEXES[Math.floor(Math.random() * COLOR_HEXES.length)]

    if (!usedNames.has(name) && !usedColors.has(color)) {
      horses.push(new Horse(name, color))
      usedNames.add(name)
      usedColors.add(color)
    }
  }

  return horses
}

export const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

export function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = arr.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function hexToFilter(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  const hueRotate = Math.round(h * 360)

  const saturate = Math.max(1.3, Math.min(2.8, l * 3))
  const brightness = Math.max(1.0, Math.min(1.4, l * 2))

  const contrast = Math.max(1.1, Math.min(1.5, l * 1.8))

  return `hue-rotate(${hueRotate}deg) saturate(${saturate.toFixed(1)}) brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(1)})`
}
