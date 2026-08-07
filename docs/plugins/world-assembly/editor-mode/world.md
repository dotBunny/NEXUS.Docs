---
description: World-scoped tools — the collision visualizer, the actor-ignore tagging toggle, and the entry points that create a cell or organ.
sidebar_position: 1
---

# World Rail

The only category that is **always enabled**. It holds what applies to the level as a whole rather than to a focused cell, which is also why the entry points that create a [Cell](../types/cell.md) or an [Organ](../types/organ-volume.md) live here — they are what turn an empty level into one the other rails have anything to act on.

![World Rail](/assets/images/docs/plugins/world-assembly/editor-mode/rail-world.webp)

## Visualizers

| Command | Description |
| :-- | :-- |
| **Collision** | Creates and destroys a temporary, transient visualizer of the world's collision geometry as an assembly run will see it. A toggle — the button stays lit while the visualizer is alive. Unavailable in PIE. |

The visualizer merges the simple collision of every actor that passes World Assembly's world-actor filter into a single mesh. It spawns in place (move it to see it) and tracks world changes, rebuilding as you add, remove, move, or edit geometry. Rebuilds are coalesced, so a burst of edits costs one rebuild rather than one per change.

![World Collision Visualizer](/assets/images/docs/plugins/world-assembly/editor-mode/world-collision-visualizer.webp)

The captured geometry honours the **World Collisions** options in [Project Settings](../project-settings.md) (actor ignore tags, player starts, and collision-disabled exclusion), and the preview is drawn with the **Collision Visualizer Material** from the [Editor Settings](../editor-settings.md). To exclude a specific actor, select it and use [Ignore World Collision](#tagging).

:::info

The visualizer actor is transient and diagnostic — it is not saved with the level, and it is destroyed when the mode exits.

:::

## Create

| Command | Description |
| :-- | :-- |
| **Add Cell Actor** | Creates the singleton-like `ANCellActor` which facilitates creating a [Cell](../types/cell.md) from the level it is placed in. Enables the [Cell](cell.md) and [Junction](junction.md) rails. |
| **Add Organ Volume** | Places a new [Organ Volume](../types/organ-volume.md) in the current level, bounding where an assembly operation may generate. Enables the [Organ](organ.md) rail. |

Both commands belong to other categories' command sets and are surfaced here deliberately: a category that is greyed out cannot offer the button that would ungrey it.

## Tagging

| Command | Description |
| :-- | :-- |
| **Ignore World Collision** | Toggles the [`NWorldCollision_Ignore`](../tagging.md#world-collision-markup-tags) tag on the selected actors, excluding them from the world collision an assembly run places cells against. |

Available only with actors selected, and **only in a level that is not itself a cell**. World collision is what an assembly operation places cells *against*, so tagging it out is a decision about the destination level rather than about a cell's own geometry — for that, use [Ignore Cell Collision](cell.md#tagging) on the Cell rail.
