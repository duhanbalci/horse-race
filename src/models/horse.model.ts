export class Horse {
  name: string
  color: string
  condition: number

  constructor(name: string, color: string) {
    this.name = name
    this.color = color
    this.condition = 100
  }

  reset() {
    this.condition = 100
  }
}
