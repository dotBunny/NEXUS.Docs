---
sidebar_position: 10
description: Per-user editor preferences for World Assembly, persisted outside project config.
---

# User Settings

Per-user editor preferences for World Assembly. Unlike the shared [Project Settings](project-settings.md) and project-shared [Editor Settings](editor-settings.md), these are machine-local and stored in `NexusUserSettings.ini`, so each developer keeps their own values and they do not leak into source control.

From the `Edit > Editor Preferences` window, find the **World Assembly (User)** section.

![World Assembly Editor Preferences User](/assets/images/docs/world-assembly/world-assembly-editor-preferences-user.webp)

Backed by `UNWorldAssemblyEditorUserSettings`; from C++, read it with `UNWorldAssemblyEditorUserSettings::Get()`.

## Configuration Options

### Color Palette

The `Color Palette` groups drive the gizmos and debug markers drawn in the viewport while [editing](editor-mode/index.mdx) and during a [Quick Assembly](editor-mode/index.mdx#quick-assembly) operation — for example colouring junctions differently depending on whether they ended up valid, invalid, or unfilled. Defaults below are shown as their sRGB hex equivalents.

#### Bones

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Valid` | `FLinearColor` | Color of a [bone](types/bone-component.md) that resolved to a valid (matchable) connection. | Cyan `#46FFFF` |
| `Invalid` | `FLinearColor` | Color of a [bone](types/bone-component.md) that could not be matched. | Violet `#8A1EFF` |

#### Cell

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Bounds` | `FLinearColor` | Color used to draw a [cell](types/cell.md)'s bounds. | Red `#B01406` |
| `Hull` | `FLinearColor` | Color used to draw a [cell](types/cell.md)'s hull. | Sky Blue `#00D0FF` |

#### Junctions

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Unfilled` | `FLinearColor` | Color of a [junction](types/junction-component.md) left unfilled during a world assembly operation. Used when `Draw Unfilled Junctions` is enabled. | White `#FFFFFF` |
| `Valid` | `FLinearColor` | Color of a [junction](types/junction-component.md) that resolved to a valid connection. | Spring Green `#1AFFA8` |
| `Invalid` | `FLinearColor` | Color of a [junction](types/junction-component.md) embedded too far into geometry to be matched. | Magenta `#FF58FF` |
| `Connector Corners` | `FLinearColor` | Color of the four socket-corner curves bounding the volume a [junction connector](types/cell-junction-connector.md)'s geometry may occupy. Used when `Draw Junction Connectors` is enabled. | Pale Lilac `#F9E0FB` |

### Debug

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Draw Unfilled Junctions` | `bool` | Draw debug markers for unfilled (unconnected) [junctions](types/junction-component.md) in the world preview. | `true` |
| `Draw Junction Connectors` | `bool` | Draw the [routes](types/cell-junction-connection.md#path) the connector pass proved clear during the last operation — the center curve in the `Valid` junction color, the four socket-corner curves in `Connector Corners`. See [Drawing Connector Routes](#drawing-connector-routes). | `true` |
| `Draw Bounds` | `bool` | Draw the wire box of a [cell](types/cell.md)'s bounds, in the `Bounds` palette color. Applies wherever a cell draws, not only while the [editor mode](editor-mode/index.mdx) is active. Also on the [Cell rail](editor-mode/cell.md#display). | `true` |
| `Draw Hull` | `bool` | Draw a [cell](types/cell.md)'s convex hull — its collision mesh — in the `Hull` palette color. Same terms as `Draw Bounds`. | `true` |
| `Draw Fill Bounds` | `bool` | Draw the grey box extruded from each [junction](types/junction-component.md) socket previewing the volume its [filler](types/cell-junction-filler.md) would occupy, sized and anchored by the junction's own `Fill Depth` and `Fill Depth Mode`. Same terms as `Draw Bounds`. | `true` |

#### Drawing Connector Routes

The [editor mode](editor-mode/index.mdx) draws accepted [connector](types/cell-junction-connector.md) routes, and tints connector-paired junctions distinctly from mated ones.

This works in the **default proxy-only preview**, where there are no junction components at all: `UNWorldAssemblyEditorSubsystem` retains each completed operation's pairings rather than relying on live components to draw from.

What is drawn is the route's **stored samples** — the exact points that were swept for collisions — rather than a re-approximation, so a sharply-bending route reads as a run of flat facets. That is the honest view. For a smoothed read at runtime, see [Draw Junction Connector Path](types/world-assembly-library.md#draw-junction-connector-path).

### Notifications

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Toast Editor Assembly Operations` | `bool` | Show a toast notification when an editor-triggered Assembly Operation completes, and summarize [Quick Assembly](editor-mode/index.mdx#quick-assembly) (including Auto Assembly) runs. | `true` |

### Quick Assembly

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Load Level Instances` | `bool` | Create and load the level instances from the `ANCellProxy`(s) produced by a [Quick Assembly](editor-mode/index.mdx#quick-assembly), carrying the result all the way through to actualized `ANCellLevelInstance`s. | `true` |
| `Auto Assembly` | `bool` | Continuously re-trigger Assembly Operations for the target [Organ](types/organ-volume.md) on a timer until cancelled. | `false` |
| `Auto Assembly Timer` | `float` | Seconds to wait after a run completes before the next Auto Assembly is triggered. Only used when `Auto Assembly` is enabled. Clamped to `2`–`180`. | `2` |

### Editor Mode Panel

Where you dragged the [editor mode's](editor-mode/index.mdx#the-strip-and-the-panel) panel and how wide you made it, remembered between sessions.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Ed Mode Panel Position` | `FToolWidget_DragBoxPosition` | Where the panel sits in the viewport, as an alignment plus a relative offset. | Top-left, offset `(78, 16)` |
| `Ed Mode Panel Width` | `float` | Width the panel was last resized to, or `0` for its default of `200`. Dragging is clamped to `200`–`520`. | `0` |

Both are `config` but **not** `EditAnywhere`, so neither appears in the settings panel. They are layout state you set by dragging the panel rather than preferences to be filled in, and a pair of raw coordinates in the settings list would read as something to configure.

Only the panel is stored — the category strip beside it is pinned, so it has no position to remember. The default offset puts the panel level with the strip's top and one strip-inset clear of its right edge, so the gutter between the two boxes matches the one between the strip and the viewport.

## See Also

- [Project Settings](project-settings.md) — shared, project-wide runtime configuration saved to project config.
- [Editor Settings](editor-settings.md) — project-shared editor defaults for new cells and the collision visualizer.
