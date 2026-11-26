import assert from 'node:assert/strict'
import { test } from 'node:test'

import { detectLang, isLang, LANGS, MESSAGES } from '../hooks/i18n.ts'

test('English is the reference language and every language is listed', () => {
  assert.deepEqual([...LANGS].sort(), ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt'])
})

test('every language has exactly the keys English has', () => {
  const keys = Object.keys(MESSAGES.en).sort()
  for (const lang of LANGS) assert.deepEqual(Object.keys(MESSAGES[lang]).sort(), keys, lang)
})

test('every message function returns text that carries its arguments', () => {
  for (const lang of LANGS) {
    const m = MESSAGES[lang]
    assert.ok(m.usageToast('5h', 91).includes('91'), lang)
    assert.ok(m.hintTight('5h', 82).includes('82'), lang)
    assert.ok(m.themeSet('visual').includes('visual'), lang)
    assert.ok(m.themeCurrent('classic').includes('classic'), lang)
    assert.ok(m.themeUnknown('nope').includes('nope'), lang)
    assert.ok(m.langUnknown('xx').includes('xx'), lang)
    assert.ok(m.hintState('on').includes('on'), lang)
    assert.ok(m.langSet(m.name).includes(m.name), lang)
  }
})

test('the command syntax is never translated', () => {
  for (const lang of LANGS) {
    const m = MESSAGES[lang]
    assert.ok(m.themeChange.includes('/usage-band'), lang)
    assert.ok(m.hintChange.includes('/usage-band hint on|off'), lang)
    assert.ok(m.langChange.includes('/usage-band lang'), lang)
    assert.ok(m.iconsChange.includes('/usage-band icons emoji|beer|fuel|weather|animals'), lang)
    assert.ok(m.runoutChange.includes('/usage-band runout always|off|0-100'), lang)
  }
})

test('no Italian leaks into English', () => {
  const en = JSON.stringify(Object.values(MESSAGES.en).map(v => (typeof v === 'function' ? v('x', 1) : v)))
  for (const word of ['sessione', 'spesa', 'Tema', 'Utilizzo', 'valuta']) assert.ok(!en.includes(word), word)
})

test('isLang accepts known codes only', () => {
  assert.equal(isLang('it'), true)
  assert.equal(isLang('xx'), false)
  assert.equal(isLang(undefined), false)
})

test('detectLang always returns a supported language', () => {
  assert.ok(isLang(detectLang()))
})
