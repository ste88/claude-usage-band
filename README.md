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
- Runout estimate: when a window is at 70% or more and 🔥, `🪫 ~45m` projects when it
  hits 100% at the pace so far (shown only if that is before the reset).
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

## License

MIT, see [LICENSE](LICENSE). Changes by version are in [CHANGELOG.md](CHANGELOG.md).
