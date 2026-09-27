---
description: World-scoped tools — the collision visualizer, the world-collision bake, the collision-ignore tagging toggle, and the entry points that create a cell or organ.
sidebar_position: 1
---

# World Rail

The only category that is **always shown**. It holds what applies to the level as a whole rather than to a focused cell, which is also why the entry points that create a [Cell](../types/cell.md) or an [Organ](../types/organ-volume.md) live here — they are what turn an empty level into one the other categories have anything to act on.

Being always shown is what makes it the mode's safe fallback: when the selected category disappears, the strip falls back here.

![World Rail](/assets/images/docs/world-assembly/editor-mode/rail-world.webp)

## Visualizers

| Command | Description |
| :-- | :-- |
| **Collision Visualizer** | Creates and destroys a temporary, transient visualizer of the level's [world collision](../world-collision.md), exactly as an assembly run will collide with it. A toggle: the tile stays lit while the visualizer is alive. Unavailable in PIE. |

The visualizer draws the level's **baked** collision pool as one merged mesh, and never gathers the world itself. What you see is the geometry an assembly reads, not a separate reconstruction of it. It spawns in place (move it to see it) and is selected on its own. It is drawn with the **Collision Visualizer Material** from the [Editor Settings](../editor-settings.md).

It watches the level for edits (adding, removing, moving or changing geometry) and refreshes in place, grouping a burst of edits into one refresh. A refresh can't show geometry that hasn't been baked yet. When an edit leaves the cache **stale**, the visualizer keeps drawing what it was already showing and adds a **wireframe overlay** in the `Stale` color from [User Settings](../user-settings.md#world-collision), so you can see it is out of date. [Cache](#cache) the level to bring it current.

If there is nothing current to draw, the visualizer isn't created. That covers a level that was never baked, and a level that was **already stale when you opened it**, because the editor hasn't drawn a current bake of it this session. A notification says why and offers to bake.

![World Collision Visualizer](/assets/images/docs/world-assembly/editor-mode/world-collision-visualizer.webp)

What counts as world collision (tags, collision-disabled actors, player starts, terrain) is set by the **World Collisions** options in [Project Settings](../project-settings.md#assembly). See [What Counts As World Collision](../world-collision.md#what-counts-as-world-collision). To exclude a specific actor or component, select it and use the [World Collision](#tagging) tag button.

:::info

The visualizer actor is transient and diagnostic, and is not saved with the level. It is owned by the editor rather than by this mode, so it can also be created from the [cache actor's details panel](../types/world-collision-cache-actor.md#details-panel) without the mode being open. Leaving the mode still removes it, and so do starting PIE, changing map, and closing the editor.

:::

:::note[What the Filter Leaves Out]

Terrain *authoring apparatus* — the modifiers and helpers describing how a terrain is built — is excluded. A modifier's bounds are its region of influence, not a surface to place cells against, so a phantom obstacle here would be drawn as world collision and then avoided during assembly.

The terrain surface itself is not excluded by this. A landscape reaches world collision through sampling, because its collision is a Chaos heightfield behind no body setup and the ordinary geometry gather emits nothing for it.

:::

## Cache

| Command | Description |
| :-- | :-- |
| **Cache World Collision** | Bakes the [world collision](../world-collision.md) the level's organs assemble against, so a run reads it instead of gathering the level again. Acts on the **selected organs**, or on **every organ** in the level when none are selected. Always a forced re-bake: organs whose cache still matches are baked again anyway. |

While the level's world collision is unbaked or out of date, the tile shows a **warning badge**. Staleness is a condition of the level, not an event, so it stays on the button that fixes it for as long as it is true.

Saving the level bakes whatever has changed anyway, with `Cache On Save` on by default, so this button is for when you want the cache current **now**: before a Quick Assembly, or when you don't trust what is there. The bake shows a progress dialog and can be cancelled. It is one undoable transaction, and it logs how many organs it baked to `LogNexusWorldAssembly`.

Available only in a level that holds an organ and is not itself a cell, and not in PIE.

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
| **World Collision** | Toggles the [`NWorldCollision_Ignore`](../tagging.md#world-collision-markup-tags) tag on the selected components — or on the selected actors, when no component is selected — excluding them from the world collision an assembly run places cells against. |

Available only with actors selected, and **only in a level that is not itself a cell**. World collision is what an assembly operation places cells *against*, so tagging it out is a decision about the destination level rather than about a cell's own geometry — for that, use the [Cell Collision](cell.md#tagging) tag button on the Cell rail.

As on the Cell rail, the button's icon reports what the next click will do: any tagged entry in the selection means the click strips the tag from all of them. Selecting a component in the level editor leaves its owning actor selected too, so the component selection is what wins when both are present.
