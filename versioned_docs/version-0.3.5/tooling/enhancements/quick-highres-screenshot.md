---
sidebar_label: Quick HighRes Screenshot
description: One keypress captures the viewport at a preset multiplier, straight into the editor's screenshot folder.
---

# Quick HighRes Screenshot

<kbd>Alt</kbd>+<kbd>F9</kbd> captures whatever viewport you are looking at, at a multiple of its own size, and writes it to the editor's screenshot folder. No dialog, no console command, no chrome in the image.

It is deliberately a *modified* <kbd>F9</kbd> — bare <kbd>F9</kbd> is the engine's own 1× viewport Screen Capture, so the same key with a modifier reads as asking for more pixels.

:::info[Off by default]

Turn it on at `Edit > Editor Preferences > NEXUS > Tooling (User) > Quick High Res Screenshot > Enabled`, then **restart the editor**. See [User Settings](../user-settings.md#quick-highres-screenshot).

It ships off because it claims <kbd>Alt</kbd>+<kbd>F9</kbd> for as long as it is on. Leaving it off keeps the entry out of `Editor Preferences > Keyboard Shortcuts` entirely, so the chord stays free for something else. It is a per-user rather than per-project setting for the same reason: what it costs a developer who does not want it is a keybinding, and keybindings are a personal matter.

:::

## What It Captures

| State | Target |
| :-- | :-- |
| A PIE session is running | The **game** viewport — whether play is hosted in the level viewport, a floating window, or a standalone one. |
| Otherwise | The **active level** viewport. |

The chord works in both. Out of play it fires with focus anywhere in the level editor window, not just the viewport; in play it fires because the command is mapped onto the play-world action list as well — the same list <kbd>F8</kbd>-eject and the pause/step chords live on.

The shot is sized off **whichever viewport it lands on**, times the multiplier. Nothing is pinned to a fixed resolution, so switching between a small floating PIE window and a maximised level viewport gives you appropriately sized images from each.

## What Comes Out

The engine renders the scene offscreen at the multiplied size — the same path the `HighResShot` console command takes — so the image is the **rendered view with no editor chrome in it**. No gizmos, no widgets, no viewport overlay.

Files land in the editor's configured screenshot directory (`Saved/Screenshots` unless you have changed it), named `NEXUS_HighResScreenshot_<timestamp>`. The extension follows the viewport: `.png` normally, `.exr` when the scene has HDR enabled.

The engine raises its own toast naming the written file, with an **Open Folder** link.

## The Multiplier

`Tooling (User) > Quick High Res Screenshot > Multiplier`, default `2.0`, clamped `0.5`–`5.0`.

It is read **at capture time** rather than cached, so an edit takes effect on the very next keypress — set it, shoot, adjust, shoot again without restarting anything.

Below `1.0` downscales instead of enlarging. The engine's own dialog will not offer that, but the console command's parser accepts it and it works, so the floor here is lower than the dialog's.

A multiplier producing an image wider than the GPU's maximum texture dimension is rejected outright, with the engine's existing warning notification. Nothing crashes and nothing is written.

## Why Not Just Use The Dialog

Everything underneath this already ships with the engine. The only way to reach it is the **High Resolution Screenshot** dialog, whose multiplier is runtime state on a global singleton — it resets to `1.0` with every editor restart, and it takes a dialog and several clicks to get a shot.

What this adds is a keybinding, a multiplier that persists per developer, and an output path that lands where you expect. The last one is not cosmetic: the engine's own naming resolves against a directory that is only ever assigned on the game engine instance, so in the editor an un-overridden `HighResShot` writes relative to the process working directory rather than into `Saved/Screenshots`.

:::note[No menu entry]

There is deliberately no Tools menu item for this. The point of the feature is the keypress, and a menu item that captures whatever viewport was active *before the menu opened* reads as a trap.

:::

## See Also

- [User Settings → Quick HighRes Screenshot](../user-settings.md#quick-highres-screenshot) — the two settings.
- [Quick HighRes Screenshot](../editor-types/quick-highres-screenshot.md) — the type that performs the capture.
- [Tooling Editor Bindings](../editor-types/tooling-editor-bindings.md) — the binding context the chord lives in.
