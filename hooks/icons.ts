export type IconSet = 'emoji' | 'beer' | 'fuel' | 'weather' | 'animals'

// The four marks drawn after a window's percentage: fast = burning it (ahead of the
// clock), calm = plenty of margin, on = on pace, empty = runout estimate.
export type IconGlyphs = { fast: string; calm: string; on: string; empty: string }

// Plain emoji with a width of two cells in terminals (no variation selectors), so
// the bar lines up whichever set is picked.
export const ICON_SETS: Record<IconSet, IconGlyphs> = {
  emoji: { fast: '🔥', calm: '😌', on: '👌', empty: '🪫' },
  beer: { fast: '🍺', calm: '🧊', on: '🍻', empty: '🥴' },
  fuel: { fast: '🚀', calm: '🐢', on: '🎯', empty: '⛽' },
  weather: { fast: '🌀', calm: '🌞', on: '⛅', empty: '🌵' },
  animals: { fast: '🐇', calm: '🐢', on: '🐎', empty: '🦴' },
}

export const ICON_NAMES = Object.keys(ICON_SETS) as IconSet[]

export const isIconSet = (value: unknown): value is IconSet =>
  typeof value === 'string' && Object.hasOwn(ICON_SETS, value)
