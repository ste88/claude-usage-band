import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isRunout, parseRunout, RUNOUT_DEFAULT, runoutLabel } from '../hooks/runout.ts'

test('the default shows the estimate from 70%', () => {
  assert.equal(RUNOUT_DEFAULT, 70)
})

test('parses always, off and whole percentages from 0 to 100', () => {
  assert.equal(parseRunout('always'), 0)
  assert.equal(parseRunout('off'), null)
  assert.equal(parseRunout('0'), 0)
  assert.equal(parseRunout('50'), 50)
  assert.equal(parseRunout('100'), 100)
})

test('rejects anything else', () => {
  for (const arg of ['101', '250', '-5', '50%', '7.5', '', 'never', 'Always1']) {
    assert.equal(parseRunout(arg), undefined, arg)
  }
})

test('stored values are checked when the session starts', () => {
  assert.equal(isRunout(null), true)
  assert.equal(isRunout(0), true)
  assert.equal(isRunout(70), true)
  assert.equal(isRunout(101), false)
  assert.equal(isRunout(-1), false)
  assert.equal(isRunout(33.5), false)
  assert.equal(isRunout('70'), false)
  assert.equal(isRunout(undefined), false)
})

test('the setting reads back as always, off or a percentage', () => {
  assert.equal(runoutLabel(0), 'always')
  assert.equal(runoutLabel(null), 'off')
  assert.equal(runoutLabel(70), '70%')
})
