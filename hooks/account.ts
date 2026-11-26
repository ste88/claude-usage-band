// What $.session.identity() answers, as far as the line beside the prompt needs it.
// `deny` is set when the host refuses the mod (privacy or sec-default in the user tier).
export type Identity = {
  deny?: string
  contextEmail?: string
  email?: string
  organizationType?: string
}

// The login record on disk (~/.claude.json, oauthAccount): the email and the plan the
// login recorded. The person can edit this file, so the line is for display only.
// Null when the file is not readable JSON or holds no login.
export const accountFromConfig = (text: string): Identity | null => {
  try {
    const login = JSON.parse(text)?.oauthAccount
    if (typeof login?.emailAddress !== 'string') return null
    return {
      email: login.emailAddress,
      organizationType: typeof login.organizationType === 'string' ? login.organizationType : undefined,
    }
  } catch {
    return null
  }
}

// The line beside the prompt: the account's email and, under a managed pin, its plan.
// Null when the host refused the identity or there is nothing to show (an API key,
// a cloud provider, no login).
export const accountLabel = (who: Identity): string | null => {
  if (who.deny !== undefined) return null
  const parts = [who.contextEmail ?? who.email, who.organizationType].filter((p): p is string => Boolean(p))
  return parts.length > 0 ? parts.join(' · ') : null
}
