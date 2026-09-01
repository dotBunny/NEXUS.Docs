---
description: A highlight reel for the Tooling plugin and it's additions over time.
---

# Tooling

## 0.3.5

### Selection Lock

You know the one. The giant floor mesh, the sky sphere, the blocking volume you click through fifty times an hour.
[Lock it](/docs/tooling/enhancements/selection-lock) and it stops being clickable in the viewport — no selection
outline, no hover highlight — while staying perfectly reachable from the Outliner and by marquee.

The toggle sits in a `Selection Lock` column beside the visibility gutter in the Outliner, and `Lock Selection` is in
the actor right-click menu, so it is wherever your hand already is. Flip it on a row that is part of the current
selection and it applies to the whole selection. The lock persists as editor-only package meta-data, which means it
survives construction script reruns and travels with the level through source control, and is stripped at cook.

:::info

Nanite meshes cannot be locked against clicking, because Nanite resolves hit proxies through its own pass.

:::

### Quick HighRes Screenshot

`Alt+F9`. That is the whole feature.
[One keypress](/docs/tooling/enhancements/quick-highres-screenshot) captures the viewport at a preset multiplier
and writes it to the editor's screenshot folder — the rendered view, with no editor chrome in it. During a PIE session
it grabs the game viewport whether play is hosted in the level viewport, a floating window or a standalone one; outside
PIE it grabs the active level viewport.

Off by default (it is a keybind, and keybinds are personal), switched on under `Tooling (User)` with the multiplier
alongside it, and rebindable under Editor Preferences, Keyboard Shortcuts, `NEXUS: Tooling`.