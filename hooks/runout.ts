// From which share of a window the runout estimate ("🪫 ~45m") is shown:
// a percentage 0-100, 0 for "always", or null for "off".
export type Runout = number | null

export const RUNOUT_DEFAULT: Runout = 70

// Accepts "always", "off" or a whole number from 0 to 100; undefined for anything else.
export const parseRunout = (arg: string): Runout | undefined => {
  if (arg === 'always') return 0
  if (arg === 'off') return null
  if (!/^\d{1,3}$/.test(arg)) return undefined
  const n = Number(arg)
  return n <= 100 ? n : undefined
}

export const isRunout = (value: unknown): value is Runout =>
  value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100)

// How the setting reads back to the user: "always", "off" or "70%".
export const runoutLabel = (r: Runout) => (r === null ? 'off' : r === 0 ? 'always' : `${r}%`)
