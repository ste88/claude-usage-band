# Changelog

All notable changes to usage-band are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Runout estimate `🪫 ~45m`: when a window is at 70% or more and ahead of the
  clock, projects when it hits 100% at the pace so far (only if before the reset).

### Changed
- Pace marks are emoji: 🔥 (was ▲), 😌 (was ▼), 👌 (was `=`).

## [0.4.0] - 2026-11-20

### Added
- The band works in the Claude Code VS Code extension (documented).
- `/usage-band hint on|off`: optional line suggesting a lighter model when a
  window is at 70% or more and ahead of the clock. Off by default.
- `/usage-band lang <code|auto>`: English, German, French, Italian, Spanish,
  Portuguese, Dutch and Polish.

### Changed
- All text is now English by default (it was a mix of Italian and English):
  `7d` instead of `7g`, `3d5h` instead of `3g5h`, `session` instead of
  `sessione`. Italian is one command away: `/usage-band lang it`.

## [0.3.1] - 2026-11-19

### Added
- `/usage-band <theme>` switches theme without the word `theme`.

### Changed
- The bar refreshes every 30 seconds, mid-turn included, instead of only at the
  end of a turn. The refresh re-reads figures Claude Code already holds: no
  request, no tokens, no usage spent.

## [0.3.0] - 2026-11-19

### Added
- Selectable themes: `classic` (default), `visual` (solid colored bars, bold
  figures) and `minimal` (figures only), chosen with `/usage-band theme <name>`
  and remembered across sessions.
- `/usage-band` lists the themes and marks the current one.

## [0.2.0] - 2026-11-19

### Added
- Pace mark per window: ▲ when usage runs ahead of the time gone and the window
  may run out before the reset, ▼ with margin, = on pace.

### Changed
- The reset time is shown as a countdown (`42m`, `2h14m`, `3g5h`).

## [0.1.0] - 2026-11-19

### Added
- A row above the prompt with the 5-hour and 7-day usage windows (bar, percent
  used, reset time) and the session's cost.
- Colors by threshold: green below 70%, yellow from 70%, red from 90%.
- A toast once per window when it passes 90%.

[Unreleased]: https://github.com/ste88/claude-usage-band/compare/0.4.0...HEAD
[0.4.0]: https://github.com/ste88/claude-usage-band/compare/0.3.1...0.4.0
[0.3.1]: https://github.com/ste88/claude-usage-band/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/ste88/claude-usage-band/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/ste88/claude-usage-band/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/ste88/claude-usage-band/releases/tag/0.1.0
