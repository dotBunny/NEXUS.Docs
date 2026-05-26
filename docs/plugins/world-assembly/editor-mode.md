---
description: The editor sub-mode used to author and inspect cells and organs without leaving the level viewport.
title: Editor Mode
---

# Editor Mode

World Assembly ships an editor mode (`FNWorldAssemblyEdMode`) that takes over the active level editor when a cell actor or organ component is in focus. It surfaces a context-sensitive viewport toolbar and switches the transform-widget mode based on what is currently selected so a designer can move between hull editing, bounds tweaking, and proxy generation without leaving the level.

## Level Toolbar

A single entry point lives on the standard level-editor toolbar — switching into World Assembly Mode replaces the normal selection tools with the cell / organ workflow described below.

![Switch To Mode Toolbar](mode-toolbar-switch-to-mode.webp)

## Non-World Assembly Mode

When nothing assembly-related is selected — the mode is technically active but no `ANCellActor` or `UNOrganComponent` is in focus — the toolbar collapses to the minimal "switch back" surface.

![No Data Toolbar](mode-toolbar-no-cell-no-organ.webp)

## World Assembly Mode

Once the mode is active, the toolbar reshapes itself based on what's currently selected. The selection drives which actor / component the per-command actions target, and the transform widget switches automatically (e.g. junction edits use the rotation widget, hull edits use translation).

### Cell Selected

![Cell Editing Toolbar](mode-toolbar-cell.webp)

| Group | Commands |
| :-- | :-- |
| **Sub-Mode** | Switch between Hull / Bounds / Voxel editing views. |
| **Calculate** | Recompute All, Bounds, Hull, or Voxel data for the focused cell. |
| **Hull** | Toggle **Allow Non-Convex** (let the hull retain concavities), **Split Edge** (insert a midpoint vertex on the highlighted edge), and visualize the cached convex face description. |
| **Cell** | Save the cell side-car immediately, capture a viewport thumbnail, reset the cell, remove the actor. |
| **Auto-Calculate** | Per-cell toggles: recompute Bounds / Hull / Voxel data automatically on world save. |
| **Junction** | Add a new junction component to the focused cell, or select an existing junction by clicking its tool-menu entry. |

### Organ Selected

![Organ Editing Toolbar](mode-toolbar-organ.webp)

| Group | Commands |
| :-- | :-- |
| **Proxies** | Generate proxies for the selected organ, or for every organ in the level (Generate All / Clear / Clear All). |
| **Levels** | Load or unload the streaming proxy levels for the selected organ, or for every organ in the level. |

Only one generation pass runs at a time — repeatedly clicking **Generate** is debounced into a single in-flight operation so the editor cannot pile up overlapping passes.

## Selection-Aware Tagging

Two toolbar buttons toggle tags on whatever actors are currently selected in the level outliner — these are quick-access wrappers around the [Actor Tags](tags.md#actor-tags) checked during generation.

| Button | Tag |
| :-- | :-- |
| **Cell Ignore** | `NCell_Ignore` — excluded from every cell-generation pass. |
| **World Collision Ignore** | `NWorldCollision_Ignore` — excluded from the virtual-world collision capture. |

The button's icon reflects the current state: **Ignored** (every selected actor has the tag), **Not Ignored** (none of them do), or **Unknown** (mixed selection).

## User Settings

`Edit > Editor Preferences > Plugins > World Assembly (User)` houses per-developer preferences that are stored in `NexusUserSettings.ini` so each contributor keeps their own values.

| Setting | Description | Default |
| :-- | :-- | :-- |
| **Display Viewport Messages** | Show alerts and informational messages directly in the viewport while editing cells. | `true` |
