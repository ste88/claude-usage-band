import assert from 'node:assert/strict'
import { test } from 'node:test'

import { accountFromConfig, accountLabel } from '../hooks/account.ts'

test('shows the email the session was handed', () => {
  assert.equal(accountLabel({ contextEmail: 'a@example.com', isVerified: false }), 'a@example.com')
})

test('falls back to the email of the login', () => {
  assert.equal(accountLabel({ email: 'b@example.com' }), 'b@example.com')
})

test('adds the plan under a managed pin', () => {
  assert.equal(
    accountLabel({ email: 'c@example.com', organizationType: 'claude_team' }),
    'c@example.com · claude_team',
  )
})

test('shows nothing when the host refuses the identity', () => {
  assert.equal(accountLabel({ deny: 'privacy: user tier' }), null)
})

test('shows nothing when there is no email and no plan (API key, cloud provider)', () => {
  assert.equal(accountLabel({}), null)
})

test('reads the email and plan from the login record on disk', () => {
  const text = JSON.stringify({ oauthAccount: { emailAddress: 'd@example.com', organizationType: 'claude_max' } })
  assert.equal(accountLabel(accountFromConfig(text) ?? {}), 'd@example.com · claude_max')
})

test('an unreadable or login-less config gives no line', () => {
  assert.equal(accountFromConfig('not json'), null)
  assert.equal(accountFromConfig('{}'), null)
  assert.equal(accountLabel(accountFromConfig('{"oauthAccount":{}}') ?? {}), null)
})
