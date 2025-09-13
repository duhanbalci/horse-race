import { describe, it, expect } from 'vitest'
import { generateLane, pathFromCommands, getContrastColor, hexToFilter } from '../utils'
import { Move, Curve, SmoothCurve } from '../models/path.model'

describe('Utils', () => {
  describe('generateLane', () => {
    it('should generate different lanes on multiple calls', () => {
      const lane1 = generateLane({ segments: 3 })
      const lane2 = generateLane({ segments: 3 })

      const curve1 = lane1[1] as Curve
      const curve2 = lane2[1] as Curve

      expect(curve1.end.x === curve2.end.x && curve1.end.y === curve2.end.y).toBe(false)
    })
  })

  describe('pathFromCommands', () => {
    it('should convert Move command to SVG path string', () => {
      const commands = [new Move(100, 200)]
      const result = pathFromCommands(commands)
      expect(result).toBe('M 100 200')
    })

    it('should convert Curve command to SVG path string', () => {
      const commands = [new Curve(10, 20, 30, 40, 50, 60)]
      const result = pathFromCommands(commands)
      expect(result).toBe('C 10 20, 30 40, 50 60')
    })

    it('should convert SmoothCurve command to SVG path string', () => {
      const commands = [new SmoothCurve(10, 20, 30, 40)]
      const result = pathFromCommands(commands)
      expect(result).toBe('S 10 20, 30 40')
    })

    it('should handle multiple commands', () => {
      const commands = [
        new Move(0, 0),
        new Curve(10, 10, 20, 20, 30, 30),
        new SmoothCurve(40, 40, 50, 50),
      ]
      const result = pathFromCommands(commands)
      expect(result).toBe('M 0 0 C 10 10, 20 20, 30 30 S 40 40, 50 50')
    })
  })

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      const lightColors = ['#FFFFFF', '#FFFF00', '#00FFFF', '#FFCCCC']

      lightColors.forEach((color) => {
        const result = getContrastColor(color)
        expect(result).toBe('#000000')
      })
    })
  })

  describe('hexToFilter', () => {
    it('should convert hex color to css filter string', () => {
      const hex = '#FF0000'
      const result = hexToFilter(hex)

      expect(typeof result).toBe('string')
      expect(result).toContain('hue-rotate(')
      expect(result).toContain('saturate(')
      expect(result).toContain('brightness(')
      expect(result).toContain('contrast(')
    })
  })
})
