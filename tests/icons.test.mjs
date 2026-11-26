import assert from 'node:assert/strict'
import { test } from 'node:test'

import { ICON_NAMES, ICON_SETS, isIconSet } from '../hooks/icons.ts'

const VARIATION_SELECTOR_16 = '\u{FE0F}'

test('the five sets are listed, the emoji one first', () => {
  assert.deepEqual(ICON_NAMES, ['emoji', 'beer', 'fuel', 'weather', 'animals'])
})

test('the emoji set is the original pace marks', () => {
  assert.deepEqual(ICON_SETS.emoji, { fast: '🔥', calm: '😌', on: '👌', empty: '🪫' })
})

test('every set has four non-empty marks, all different inside the set', () => {
  for (const name of ICON_NAMES) {
    const marks = Object.values(ICON_SETS[name])
    assert.equal(marks.length, 4, name)
    assert.ok(marks.every(mark => typeof mark === 'string' && mark.length > 0), name)
    assert.equal(new Set(marks).size, 4, name)
  }
})

test('no mark uses a variation selector, so the bar stays aligned', () => {
  for (const name of ICON_NAMES) {
    for (const mark of Object.values(ICON_SETS[name])) {
      assert.ok(!mark.includes(VARIATION_SELECTOR_16), `${name}: ${mark}`)
    }
  }
})

test('isIconSet accepts known names only', () => {
  assert.equal(isIconSet('beer'), true)
  assert.equal(isIconSet('toString'), false)
  assert.equal(isIconSet('xx'), false)
  assert.equal(isIconSet(undefined), false)
})
