import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { ThemeName, UsageSnapshot, UsageWindow } from '../types'
import { hint } from './hint'
import { detectLang, isLang, LANGS, MESSAGES } from './i18n'
import type { Lang, Messages } from './i18n'

const snapshot = atom({ plugin: 'usage-band', key: 'snapshot' } as const, null)
const warned = atom({ plugin: 'usage-band', key: 'warned' } as const, [])
const theme = atom({ plugin: 'usage-band', key: 'theme' } as const, 'classic')
// English unless the user picks another language (/usage-band lang <code|auto>).
const lang = atom({ plugin: 'usage-band', key: 'lang' } as const, 'en')
// Off by default: the model suggestion is opt-in (/usage-band hint on).
const hintOn = atom({ plugin: 'usage-band', key: 'hintOn' } as const, false)
// Written by the refresh timer: the drawing reads it, so each tick redraws.
const tick = atom({ plugin: 'usage-band', key: 'tick' } as const, 0)

const REFRESH_MS = 30_000

const THEMES: Record<ThemeName, string> = {
  classic: 'text bars ▓░, compact (default)',
  visual: 'solid colored bars, bold figures',
  minimal: 'figures only, no bars',
}

const isTheme = (value: unknown): value is ThemeName =>
  typeof value === 'string' && Object.hasOwn(THEMES, value)

const label = (kind: string, m: Messages) =>
  kind === 'five_hour' || kind === 'seven_day' || kind === 'spend_limit' ? m[kind] : kind

const BAR = 10

const filledCells = (pct: number) => Math.max(0, Math.min(BAR, Math.round(pct / 10)))

const textBar = (pct: number) => {
  const filled = filledCells(pct)
  return '▓'.repeat(filled) + '░'.repeat(BAR - filled)
}

const HOUR = 3_600_000
const WINDOW_MS: Record<string, number> = { five_hour: 5 * HOUR, seven_day: 7 * 24 * HOUR }

const resetMs = (iso?: string) => {
  if (!iso) return null
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? null : t
}

// Time left until the reset: "42m", "2h14m", "3d5h" (the day unit follows the language).
const countdown = (ms: number, m: Messages) => {
  const minutes = Math.max(0, Math.round(ms / 60_000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h${String(minutes % 60).padStart(2, '0')}m`
  return `${Math.floor(hours / 24)}${m.day}${hours % 24}h`
}

// emptyIn: estimated time until the window hits 100% at the pace so far; only set
// when the window is close to the limit and would run out before it resets.
type Pace = { symbol: string; color: 'warning' | 'success' | 'subtle'; ahead: boolean; emptyIn: number | null }

const EMPTY_FROM = 70

// Compares the share of the window used with the share of time already gone:
// ahead of the clock means the window runs out before it resets.
const pace = (kind: string, pct: number, left: number | null): Pace | null => {
  const length = WINDOW_MS[kind]
  if (length === undefined || left === null) return null
  const elapsed = 100 * (1 - Math.min(length, Math.max(0, left)) / length)
  const gap = pct - elapsed
  // Emoji instead of arrows: 🔥 burning fast, 😌 margin, 👌 on pace.
  if (gap > 5) {
    const spent = length - Math.min(length, Math.max(0, left))
    // Linear projection: pct used in `spent` ms, so the remaining (100 - pct) takes proportionally as long.
    const toEmpty = pct > 0 && pct < 100 ? ((100 - pct) / pct) * spent : pct >= 100 ? 0 : null
    const emptyIn = pct >= EMPTY_FROM && toEmpty !== null && toEmpty < left ? toEmpty : null
    return { symbol: '🔥', color: 'warning', ahead: true, emptyIn }
  }
  if (gap < -5) return { symbol: '😌', color: 'success', ahead: false, emptyIn: null }
  return { symbol: '👌', color: 'subtle', ahead: false, emptyIn: null }
}

// "🪫 ~45m": time left before the limit at the current pace.
const empty = (ms: number, m: Messages) => `🪫 ~${countdown(ms, m)}`

const colorFor = (pct: number) => (pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'success')

const toSnapshot = (rateLimits: UsageWindow[], cost?: { usd: number }): UsageSnapshot => ({
  windows: rateLimits.map(r => ({ kind: r.kind, percentUsed: r.percentUsed, resetsAt: r.resetsAt })),
  usd: cost ? cost.usd : null,
})

type Row = UsageWindow & { left: number | null; pace: Pace | null }

const themeHelp = (current: ThemeName, m: Messages) =>
  [
    m.themeCurrent(current),
    ...Object.entries(THEMES).map(([name, what]) => `  ${name === current ? '●' : '○'} ${name}: ${what}`),
    m.themeChange,
  ].join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)

    await $.command.register({
      name: 'usage-band',
      description:
        'Usage bar: /usage-band [classic|visual|minimal], /usage-band hint [on|off], /usage-band lang [code|auto]',
    })

    const saved = await $.store.get('theme')
    if (isTheme(saved)) await update($, theme, () => saved)
    if ((await $.store.get('hint')) === true) await update($, hintOn, () => true)
    const savedLang = await $.store.get('lang')
    if (isLang(savedLang)) await update($, lang, () => savedLang)
    else if (savedLang === 'auto') await update($, lang, () => detectLang())

    const refresh = async () => {
      // The figures of the last API response, mid-turn included: free to read.
      const u = await $.session.usage()
      await update($, snapshot, () => toSnapshot(u.rateLimits, u.cost))
      await update($, tick, n => n + 1)
    }
    await refresh()
    $.clock.every(REFRESH_MS, () => void refresh())
    return result
  })

  on('command.run', { command: 'usage-band' }, async ($, e) => {
    const words = e.args.trim().split(/\s+/).filter(Boolean)
    // Both "/usage-band theme visual" and "/usage-band visual".
    const name = words[0] === 'theme' ? words[1] : words[0]
    const current = await read($, theme)
    const m = MESSAGES[await read($, lang)]

    if (words[0] === 'lang') {
      const arg = words[1]?.toLowerCase()
      if (!arg) {
        return { text: `${m.langCurrent(m.name)}\n${m.langChange}\n${LANGS.join(', ')}, auto` }
      }
      const next: Lang | null = arg === 'auto' ? detectLang() : isLang(arg) ? arg : null
      if (next === null) return { text: `${m.langUnknown(arg)}\n${LANGS.join(', ')}, auto` }
      await $.store.set('lang', arg)
      await update($, lang, () => next)
      return { text: MESSAGES[next].langSet(MESSAGES[next].name) }
    }

    if (words[0] === 'hint') {
      const arg = words[1]
      if (arg !== 'on' && arg !== 'off') {
        const state = (await read($, hintOn)) ? 'on' : 'off'
        return { text: `${m.hintState(state)}\n${m.hintChange}` }
      }
      await $.store.set('hint', arg === 'on')
      await update($, hintOn, () => arg === 'on')
      return { text: m.hintState(arg) }
    }

    if (!name) return { text: themeHelp(current, m) }
    if (!isTheme(name)) return { text: `${m.themeUnknown(name)}\n${themeHelp(current, m)}` }

    await $.store.set('theme', name)
    await update($, theme, () => name)
    return { text: m.themeSet(name) }
  })

  on('session.measure', async ($, e, next) => {
    await update($, snapshot, () => toSnapshot(e.rateLimits, e.cost))

    const already = await read($, warned)
    const m = MESSAGES[await read($, lang)]
    for (const w of e.rateLimits) {
      const key = `${w.kind}@${w.resetsAt ?? ''}`
      if (w.percentUsed >= 90 && !already.includes(key)) {
        $.ui.toast(m.usageToast(label(w.kind, m), w.percentUsed))
        await update($, warned, list => [...list, key])
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const snap = await read($, snapshot)
    if (e.props.hasSurvey || snap === null || (snap.windows.length === 0 && snap.usd === null)) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    await read($, tick)
    const now = await $.clock.now()
    const style = await read($, theme)
    const m = MESSAGES[await read($, lang)]

    const rows: Row[] = snap.windows.map(w => {
      const at = resetMs(w.resetsAt)
      const left = at === null ? null : at - now
      return { ...w, left, pace: pace(w.kind, w.percentUsed, left) }
    })
    const cost = snap.usd === null ? null : `$${snap.usd.toFixed(2)}`

    const tight = (await read($, hintOn))
      ? hint(rows.map(w => ({ kind: w.kind, percentUsed: w.percentUsed, ahead: w.pace?.ahead === true })))
      : null
    const suggestion = tight ? m.hintTight(label(tight.kind, m), tight.percentUsed) : null
    const finish = <T,>(band: T) =>
      suggestion ? (
        <Box flexDirection="column">
          {band}
          <Text color="warning">{suggestion}</Text>
        </Box>
      ) : (
        band
      )

    if (style === 'visual') {
      return finish(
        <Box flexDirection="row" gap={2} alignItems="center">
          {rows.map(w => {
            const filled = filledCells(w.percentUsed)
            return (
              <Box key={w.kind} flexDirection="row" gap={1} alignItems="center">
                <Text bold>{label(w.kind, m)}</Text>
                <Text>
                  <Text backgroundColor={colorFor(w.percentUsed)}>{' '.repeat(filled)}</Text>
                  <Text backgroundColor="subtle">{' '.repeat(BAR - filled)}</Text>
                </Text>
                <Text bold color={colorFor(w.percentUsed)}>
                  {w.percentUsed}%
                </Text>
                {w.pace ? <Text color={w.pace.color}>{w.pace.symbol}</Text> : null}
                {w.pace?.emptyIn != null ? <Text color="error">{empty(w.pace.emptyIn, m)}</Text> : null}
                {w.left !== null ? (
                  <Text dimColor>
                    ⟳ {countdown(w.left, m)}
                  </Text>
                ) : null}
              </Box>
            )
          })}
          {cost ? (
            <Box flexGrow={1} justifyContent="flex-end">
              <Text dimColor>
                {m.session} {cost}
              </Text>
            </Box>
          ) : null}
        </Box>
      )
    }

    if (style === 'minimal') {
      return finish(
        <Box>
          <Text dimColor>
            {rows.map((w, i) => (
              <Text key={w.kind}>
                {i > 0 ? ' · ' : ''}
                {label(w.kind, m)} <Text color={colorFor(w.percentUsed)}>{w.percentUsed}%</Text>
                {w.pace ? <Text color={w.pace.color}> {w.pace.symbol}</Text> : null}
                {w.pace?.emptyIn != null ? <Text color="error"> {empty(w.pace.emptyIn, m)}</Text> : null}
                {w.left !== null ? ` ${countdown(w.left, m)}` : ''}
              </Text>
            ))}
            {cost ? `${rows.length > 0 ? ' · ' : ''}${cost}` : ''}
          </Text>
        </Box>
      )
    }

    return finish(
      <Box>
        {rows.map((w, i) => (
          <Text key={w.kind}>
            {i > 0 ? <Text dimColor> │ </Text> : null}
            <Text dimColor>{label(w.kind, m)} </Text>
            <Text color={colorFor(w.percentUsed)}>
              {textBar(w.percentUsed)} {w.percentUsed}%
            </Text>
            {w.pace ? <Text color={w.pace.color}> {w.pace.symbol}</Text> : null}
            {w.pace?.emptyIn != null ? <Text color="error"> {empty(w.pace.emptyIn, m)}</Text> : null}
            {w.left !== null ? <Text dimColor> · {countdown(w.left, m)}</Text> : null}
          </Text>
        ))}
        {cost ? (
          <Text dimColor>
            {rows.length > 0 ? ' │ ' : ''}{m.session} {cost}
          </Text>
        ) : null}
      </Box>
    )
  })
}
