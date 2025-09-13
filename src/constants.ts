export const COLOR_HEXES = [
  '#e622a8',
  '#627420',
  '#5d3f01',
  '#20e1d5',
  '#e0c207',
  '#b138cb',
  '#6982c6',
  '#9029e1',
  '#e08c94',
  '#6b5e55',
  '#c84fdc',
  '#e75a74',
  '#144091',
  '#1d4ab8',
  '#908e43',
  '#98506a',
  '#eece85',
  '#ec656c',
  '#995415',
  '#8b85d5',
]

export const HORSE_NAMES = [
  'Şahbatur',
  'Gülbatur',
  'Altaha',
  'Anka',
  'Araslı',
  'Asilzade',
  'Ateştopu',
  'Ayabakan',
  'Baba Mevlüt',
  'Ben Anadolu',
  'Besleney',
  'Bilgin',
  'Gürgökçe',
  'Hızlıtay',
  'Hisarbey',
  'Kafkas Şahı',
  'Kara Yağız',
  'Kurtel',
  'Onurkan',
  'Özduran',
]

export const DEFAULT_HORSE_SPEED = 12.5 // m/s ~ 45 km/h

export const SPEED_MULTIPLIERS = [5, 10, 20, 50, 150] as const
export type SpeedMultiplier = (typeof SPEED_MULTIPLIERS)[number]
