---
description: Managing the focused cell's side-car asset and the cell actor itself — force save, reset, thumbnails, and removal.
sidebar_position: 3
---

# Cell Data Rail

The focused cell's **side-car asset** and the actor that owns it. Shown under the same condition as the [Cell](cell.md) rail — whenever the level contains a `ANCellActor` — and split off from it because these act on the [Cell](../types/cell.md) *asset* and the actor's existence, not on the geometry the Cell rail authors.

![Cell Data Rail](/assets/images/docs/world-assembly/editor-mode/rail-cell-data.webp)

The four commands arrive as one list — the **Actor** and **Data** headings below are this page's, not the rail's.

Everything here is gated the same way: a cell actor in the focused level, and not in PIE. These mutate and save authored data, which has no meaning against a play world.

## Actor

| Command | Description |
| :-- | :-- |
| **Remove Actor** | Removes the `ANCellActor` from the level and deletes its side-car package, so the level is no longer a cell. |
| **Capture Thumbnails** | Captures the active viewport (minus widgets) as the thumbnails for the level containing the cell, and for the [Cell](../types/cell.md) data asset. |

**Capture Thumbnails** additionally requires the level to have been saved at least once — there is no asset to hang a thumbnail on until it has. The capture draws the viewport several times, once per render mode, and restores what you were looking at afterwards. Only the data asset's thumbnail is badged; the level's is left as an ordinary world thumbnail.

**Add Cell Actor** is deliberately not here — see [World → Create](world.md#create). This category is off the strip until the level has a cell, so the command that puts one there cannot live behind it.

## Data

| Command | Description |
| :-- | :-- |
| **Force Save** | Forcibly write the cell's data out to the side-car asset. |
| **Reset** | Reset the cell to its default authored state, clearing cached bounds, hull, voxel data and junctions. |

**Force Save** waits for the terrain to settle first. Where a level's floor is a Mesh Partition terrain, a save that lands while sections are still building writes data describing a half-built world — and the wait has to happen here, at the last point before the engine's save machinery takes over, rather than inside the save itself.

:::warning

**Reset** is not a revert. It clears the authored state rather than restoring what was last saved, so hand-edited bounds and hull vertices go with it.

:::
