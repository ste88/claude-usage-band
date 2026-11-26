# usage-band

A Claude Code mod that keeps your usage in view: a row above the prompt shows the
5-hour and 7-day rate-limit windows (bar, percent used, pace, time to reset) and the
current session's cost, so you don't have to open `/usage`.

```
5h ▓▓▓▓▓▓░░░░ 62% 🔥 · 2h14m │ 7d ▓▓▓░░░░░░░ 31% 😌 · 3d5h │ session $1.84
```

- Green below 70%, yellow from 70%, red from 90%.
- Pace: 🔥 you are using the window faster than time passes (it may run out before
  the reset), 😌 you have margin, 👌 on pace.
- Runout estimate: `🪫 ~45m` projects when a window hits 100% at the pace so far.
  It is shown from 70% of the window by default, only if that is before the reset.
  Change the threshold with `/usage-band runout always|off|<0-100>`, for example
  `/usage-band runout 50`; the choice is remembered across sessions.
- A toast warns once per window when it passes 90%.
- Updates by itself after every turn, whenever a window moves a whole point, and
  every 30 seconds, mid-turn included.

Rate-limit windows appear after the first API response of a session, and only on
a subscription; otherwise just the session cost is shown.

The percentages come from the API responses of the session the bar is in: usage
spent from another session or from claude.ai shows up here with this session's
next response. The 30-second refresh only re-reads figures Claude Code already
holds, so it sends no request and spends no tokens or usage.

## Themes

Pick a look with `/usage-band <name>` (or `/usage-band theme <name>`); the choice
is remembered across sessions. `/usage-band` alone lists the themes and marks the
current one.

- `classic` (default): text bars, compact, as above.
- `visual`: solid colored bars, bold labels and figures, cost aligned right.
- `minimal`: figures only, `5h 62% 🔥 2h14m · 7d 31% 😌 3d5h · $1.84`.

## Icons

The marks after the percentages come from a set picked with
`/usage-band icons <set>`; the choice is remembered across sessions. `/usage-band icons`
alone shows the current set.

| Set       | Burning fast | Margin | On pace | Runout  |
| --------- | ------------ | ------ | ------- | ------- |
| `emoji`   | 🔥           | 😌     | 👌      | 🪫      |
| `beer`    | 🍺           | 🧊     | 🍻      | 🥴      |
| `fuel`    | 🚀           | 🐢     | 🎯      | ⛽      |
| `weather` | 🌀           | 🌞     | ⛅      | 🌵      |
| `animals` | 🐇           | 🐢     | 🐎      | 🦴      |

`emoji` is the default. The sets only change the marks: the colors and the figures
are the same.

## Account

The footer row under the prompt, on the right, shows the account the session is
signed in with: its email. Under a managed organization pin the plan is added after
it. Nothing is shown with an API key, a cloud provider, no login, or when the host
refuses the identity (for example the built-in privacy mod in the user tier). The
line is read when the session starts, so a login made mid-session shows up in the
next session.

## Language

English by default. `/usage-band lang <code>` switches the labels, messages and
suggestions; `/usage-band lang auto` follows the system language, falling back to
English. The choice is remembered across sessions. `/usage-band lang` alone shows
the current language.

| Code | Language   | Code | Language   |
| ---- | ---------- | ---- | ---------- |
| `en` | English    | `es` | Español    |
| `de` | Deutsch    | `pt` | Português  |
| `fr` | Français   | `nl` | Nederlands |
| `it` | Italiano   | `pl` | Polski     |

The translations were machine-written: corrections from native speakers are
welcome. To add a language, add an entry to `MESSAGES` in `hooks/i18n.ts`; the
tests check that it has every key.

## Model hint

Off by default. `/usage-band hint on` adds a line under the band when the 5h or
7-day window is at 70% or more and ahead of the clock (🔥), suggesting a lighter
model. It only uses the figures the band already shows. `/usage-band hint off`
turns it off; the choice is remembered across sessions.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install usage-band --marketplace ste88/claude-usage-band
```

From a shell:

```bash
claude plugin install usage-band --marketplace ste88/claude-usage-band
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box,
then Plugins, Add marketplace with `ste88/claude-usage-band`, then Add plugin.

The band also works in the Claude Code VS Code extension: install it from a
shell with the command above, then reload the window. All three themes render
above the prompt.

## Releasing

Bump `version` in `.claude-plugin/plugin.json` and add the matching entry to
`CHANGELOG.md` in the same PR. When it is merged into `main`, the `Release`
workflow creates the tag and the GitHub release, with that changelog entry as the
notes. A version whose tag already exists is skipped.

## License

MIT, see [LICENSE](LICENSE). Changes by version are in [CHANGELOG.md](CHANGELOG.md).
