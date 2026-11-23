import { expect, test } from 'claude-code/testing'

const NOW = Date.parse('2026-11-19T12:00:00Z')
const USAGE = {
  startedAt: NOW,
  context: {},
  rateLimits: [
    // 3h of the 5h window gone (60%), 80% used: ahead of the clock.
    { kind: 'five_hour', percentUsed: 80, resetsAt: '2026-11-19T14:00:00Z' },
    // 1 of 7 days gone (~14%), 5% used: margin.
    { kind: 'seven_day', percentUsed: 5, resetsAt: '2026-11-25T12:00:00Z' },
  ],
  cost: { usd: 1.5 },
}

const setup = (on: Parameters<Parameters<typeof test>[1]>[1]) => {
  on('command.register', () => ({ value: { command: 'usage-band' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.usage', () => ({ value: USAGE }))
  on('clock.now', () => ({ value: NOW }))
  on('clock.every', () => ({ value: {} }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('command.run', () => ({ text: 'engine' }))
}

for (const theme of ['classic', 'visual', 'minimal'] as const) {
  test(`theme ${theme} draws both windows with pace and countdown`, async ($, on) => {
    setup(on)
    await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
    const res = await $.command.run({ command: 'usage-band', args: theme === 'classic' ? `theme ${theme}` : theme })
    expect(JSON.stringify(res)).toContain(theme)

    for (const surface of ['terminal', 'desktop'] as const) {
      const ui = await $.ui.mount({ plugin: 'usage-band', component: 'AbovePrompt', props: {}, surface })
      const all = await ui.findAll({ type: 'Text' })
      const text = all.map(t => t.text).join('|')
      expect(text).toContain('80%')
      expect(text).toContain('🔥')
      expect(text).toContain('😌')
      expect(text).toContain('🪫 ~45m')
      expect(text).toContain('2h00m')
      expect(text).toContain('6d0h')
      expect(text).toContain('$1.50')
      await ui.unmount()
    }
  })
}
