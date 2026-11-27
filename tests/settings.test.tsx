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
}

const texts = async (ui: { findAll: (q: { type: string }) => Promise<{ text: string }[]> }) =>
  (await ui.findAll({ type: 'Text' })).map(t => t.text).join('|')

test('the beer set draws its marks in the band', async ($, on) => {
  setup(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'usage-band', args: 'icons beer' })
  const ui = await $.ui.mount({ plugin: 'usage-band', component: 'AbovePrompt', props: {}, surface: 'terminal' })
  const text = await texts(ui)
  expect(text).toContain('🍺')
  expect(text).toContain('🥴 ~45m')
  expect(text).not.toContain('🔥')
  await ui.unmount()
})

test('runout off hides the estimate that the default shows at 80%', async ($, on) => {
  setup(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'usage-band', args: 'runout off' })
  const ui = await $.ui.mount({ plugin: 'usage-band', component: 'AbovePrompt', props: {}, surface: 'terminal' })
  expect(await texts(ui)).not.toContain('🪫')
  await ui.unmount()
})
