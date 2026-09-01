---
description: World-scoped tools — the collision visualizer, the actor-ignore tagging toggle, and the entry points that create a cell or organ.
sidebar_position: 1
---

# World Rail

The only category that is **always shown**. It holds what applies to the level as a whole rather than to a focused cell, which is also why the entry points that create a [Cell](../types/cell.md) or an [Organ](../types/organ-volume.md) live here — they are what turn an empty level into one the other categories have anything to act on.

Being always shown is what makes it the mode's safe fallback: when the selected category disappears, the strip falls back here.

![World Rail](/assets/images/docs/world-assembly/editor-mode/rail-world.webp)

## Visualizers

| Command | Description |
| :-- | :-- |
| **Collision Visualizer** | Creates and destroys a temporary, transient visualizer of the world's collision geometry as an assembly run will see it. A toggle — the tile stays lit while the visualizer is alive. Unavailable in PIE. |

The visualizer merges the simple collision of every actor that passes World Assembly's world-actor filter into a single mesh, plus the sampled surface of any landscape among them. It spawns in place (move it to see it) and tracks world changes, rebuilding as you add, remove, move, or edit geometry. Rebuilds are coalesced, so a burst of edits costs one rebuild rather than one per change.

![World Collision Visualizer](/assets/images/docs/world-assembly/editor-mode/world-collision-visualizer.webp)

The captured geometry honours the **World Collisions** options in [Project Settings](../project-settings.md) (actor ignore tags, player starts, collision-disabled exclusion, and [Landscape Sample Spacing](../project-settings.md#landscape-is-sampled-rather-than-read)), and the preview is drawn with the **Collision Visualizer Material** from the [Editor Settings](../editor-settings.md). To exclude a specific actor, select it and use [Ignore World Collision](#tagging).

:::info

The visualizer actor is transient and diagnostic — it is not saved with the level, and it is destroyed when the mode exits.

:::

:::note[What the Filter Leaves Out]

Terrain *authoring apparatus* — the modifiers and helpers describing how a terrain is built — is excluded. A modifier's bounds are its region of influence, not a surface to place cells against, so a phantom obstacle here would be drawn as world collision and then avoided during assembly.

The terrain surface itself is not excluded by this. A landscape reaches world collision through sampling, because its collision is a Chaos heightfield behind no body setup and the ordinary geometry gather emits nothing for it.

:::

## Create

| Command | Description |
| :-- | :-- |
| **Add Cell Actor** | Creates the singleton-like `ANCellActor` which facilitates creating a [Cell](../types/cell.md) from the level it is placed in. Brings the [Cell](cell.md), [Cell Data](cell-data.md) and [Junction](junction.md) categories onto the strip. |
| **Add Organ Volume** | Places a new [Organ Volume](../types/organ-volume.md) in the current level, bounding where an assembly operation may generate. Brings the [Organ](organ.md) category onto the strip. |

Both live here deliberately: a category that is hidden cannot offer the button that would bring it back, so the two commands that unlock a category sit on the one that is never hidden.

:::warning[A Level Is Either a Cell or a World, Not Both]

The two commands refuse each other. **Add Cell Actor** is unavailable once the level holds an organ, and **Add Organ Volume** is unavailable once it holds a cell actor.

A cell is a building block an operation places; a level holding organs is the world those blocks are placed into. A level that is both is not something the assembly pipeline can act on, so the button greys out rather than letting it be authored.

Only the cell is a singleton — a level is meant to hold as many organ volumes as you want, so **Add Organ Volume** does not count the ones already there.

:::

## Tagging

| Command | Description |
| :-- | :-- |
| **Ignore World Collision** | Toggles the [`NWorldCollision_Ignore`](../tagging.md#world-collision-markup-tags) tag on the selected actors, excluding them from the world collision an assembly run places cells against. |

Available only with actors selected, and **only in a level that is not itself a cell**. World collision is what an assembly operation places cells *against*, so tagging it out is a decision about the destination level rather than about a cell's own geometry — for that, use [Ignore Cell Collision](cell.md#tagging) on the Cell rail.

As on the Cell rail, the button's icon reports what the next click will do: any tagged actor in the selection means the click strips the tag from all of them.
