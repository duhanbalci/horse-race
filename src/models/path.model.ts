export type PathCommand = Move | Curve | SmoothCurve

export class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export class Move {
  point: Vec2

  constructor(x: number, y: number) {
    this.point = new Vec2(x, y)
  }
}

export class Curve {
  control1: Vec2
  control2: Vec2
  end: Vec2

  constructor(c1x: number, c1y: number, c2x: number, c2y: number, ex: number, ey: number) {
    this.control1 = new Vec2(c1x, c1y)
    this.control2 = new Vec2(c2x, c2y)
    this.end = new Vec2(ex, ey)
  }
}

export class SmoothCurve {
  control: Vec2
  end: Vec2

  constructor(cx: number, cy: number, ex: number, ey: number) {
    this.control = new Vec2(cx, cy)
    this.end = new Vec2(ex, ey)
  }
}
