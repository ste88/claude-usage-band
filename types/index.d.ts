export type UsageWindow = { kind: string; percentUsed: number; resetsAt?: string }
export type UsageSnapshot = { windows: UsageWindow[]; usd: number | null }
// Kept in step with Lang in hooks/i18n.ts (a contract file imports nothing).
export type Lang = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'nl' | 'pl'
export type ThemeName = 'classic' | 'visual' | 'minimal'
export type IconSet = 'emoji' | 'beer' | 'fuel' | 'weather' | 'animals'

declare module 'claude-code' {
  interface PluginState {
    'usage-band': {
      snapshot: UsageSnapshot | null
      warned: string[]
      theme: ThemeName
      tick: number
      lang: Lang
      hintOn: boolean
      iconSet: IconSet
      runoutFrom: number | null
      account: string | null
    }
  }
}
