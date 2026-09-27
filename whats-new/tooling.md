---
description: A highlight reel for the Tooling plugin and it's additions over time.
---

# Tooling

## 0.4.0

### Texture Packer

Somewhere in your project there is a folder of `_AO`, `_R` and `_M` textures waiting to become one `_ORM`. There is
also a marketplace pack full of `_ORM` textures you would rather have as separate maps. The
[Texture Packer](/docs/dev/tooling/texture-packer) handles both, inside the editor, under `Tools > NEXUS`.

**Pack** takes up to four maps and writes one texture. **Unpack** takes a packed texture and writes one asset per map
it holds. Both read your asset names to work out what goes where. Select `T_Rock_AO`, `T_Rock_R` and `T_Rock_M`,
right-click, choose **Pack**, and `T_Rock_ORM` appears beside them. Select a folder's worth of `_ORM` textures,
choose **Unpack**, and they all come apart in one go, skipping any whose names say nothing.

The naming conventions are two tables in Editor Preferences, filled in with the common ones (`ORM`, `ARM`, `RMA`,
`MRA`, `MRAO`, `ORMH` and friends), so a studio with its own vocabulary edits a table rather than C++. Color is
handled properly: sources are decoded exactly as a material sampler would decode them, a gamma-encoded source packed
at 8 bits earns a warning pointing at 16-bit, and a color map packed across RGB unpacks as one RGB texture rather
than three grayscales.

Nothing is saved for you. Every generated texture is left dirty for review. The whole thing is scriptable too, through
[UNTexturePackerLibrary](/docs/dev/tooling/editor-types/texture-packer/texture-packer-library), from Blueprint,
Python or C++.

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
