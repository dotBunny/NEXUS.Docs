---
description: Authoring the focused cell — the bounds, hull and edge tools, the calculate commands, the per-cell auto-calculate options, and what the overlay draws.
sidebar_position: 2
---

# Cell Rail

Everything that authors the level's [Cell](../types/cell.md) geometry. Shown whenever the level contains a `ANCellActor`; the [World](world.md#create) rail's **Add Cell Actor** is what puts one there. Managing the side-car asset and the actor itself is the neighbouring [Cell Data](cell-data.md) rail's job.

![Cell Rail](/assets/images/docs/plugins/world-assembly/editor-mode/rail-cell.webp)

The tools target the mode's **focused cell**, not the editor selection — a level holds at most one `ANCellActor` and the mode resolves it every tick, so you never have to select it first.

In the viewport:

- The red wireframe cube is the cell bounds.
- The blue wireframe is the collision/convex mesh.
- The lego-like rectangles are the junctions, where this cell can connect to other [Cells](../types/cell.md) and [Bones](../types/bone-component.md); the grey box extruded from each one is the volume its filler would occupy.

## Tools

Each tool runs until you press `Esc` or leave the rail. All of them commit every edit as it is made, so there is nothing to accept or discard.

### Bounds

> Drag the min and max corners of the cell's axis-aligned bounds.

Each corner carries its own translate gizmo for as long as the tool runs. A drag is one undo entry rather than one per mouse-move frame, and the gizmos follow the bounds when something else moves them — an undo, or a **Calculate Bounds**.

### Vertices

> Drag the cell's hull vertices (requires a tri-based hull).

Click a vertex to drag it; shift- or ctrl-click to drag several together. A handle is drawn on every vertex while the tool runs, with the selected ones highlighted — which matters once a selection holds more than one, because the gizmo sits at their midpoint rather than on any particular vertex.

The convexity gate is the substantive part: a drag that would make the hull non-convex is **reverted**, and a multi-vertex move is judged as a whole and reverted together, since half of it applied is a shape you never asked for. Turn the gate off with [Allow Non-Convex Hull](#options).

### Edges

> Split Hull Edge: click a hull edge to insert a vertex where you clicked.

Adding vertices is this tool's job rather than the [Vertices](#vertices) tool's. The split lands at the point on the edge nearest your click, not at the edge's midpoint. Only the hovered edge and the prospective split point are drawn — existing vertices are not this tool's subject, and drawing handles on them would advertise a pick it does not offer.

Splits are held clear of either endpoint by 5% of the edge's length; a split arbitrarily close to a corner produces a sliver face and two near-coincident vertices.

:::info

Edge picking is back-face culled, so an edge on a face turned away from you is not offered. That is not true occlusion — it does not account for level geometry in front of the hull, and on a non-convex hull a facing edge can still sit behind another part of the same hull.

:::

:::warning

Editing bounds or hull with these tools **switches the matching auto-calculate off** — the tool clears `bCalculateOnSave` so a save cannot overwrite what you just authored. Turn it back on from [Options](#options), or on the `ANCellActor > UNCellRootComponent > Details`.

:::

## Commands

| Command | Description |
| :-- | :-- |
| **Select Actor** | Select the `ANCellActor` in the level. |
| **Calculate Bounds** | Calculate bounds for the cell. |
| **Calculate Hull** | Calculate convex hull for the cell. |
| **Calculate All** | Calculate all data related to the cell. |

The three calculate commands recalculate from the level's geometry, **overwriting any manual edits**.

They also wait on the terrain. Where a level's floor is a Mesh Partition terrain, its sections land across several frames, and data calculated part-way through describes a half-built world — so all three go unavailable until the terrain geometry has stopped changing, rather than producing a result that quietly disagrees with the one the same button gives a moment later. Which terrain contributes at all is governed per calculation by [Include Landscapes / Include Mesh Terrains](../types/cell.md#terrain-is-two-flags).

## Tagging

| Command | Description |
| :-- | :-- |
| **Ignore Cell Collision** | Toggles the [`NCell_Ignore`](../tagging.md#cell-markup-tags) tag on the selected actors, excluding them when calculating this cell's bounds, hull and voxel data. |

The button's icon reports what the next click will do: any tagged actor in the selection means the click strips the tag from all of them, and it swaps to the remove-tag icon to say so. Available with actors selected, provided the `ANCellActor` itself is not among them.

This is about a cell's own geometry. To exclude an actor from the world collision an assembly run places cells *against*, use [Ignore World Collision](world.md#tagging).

:::note[Tags Cannot Exclude a Terrain]

A Mesh Partition terrain is represented by transient actors that are regenerated on every build, so a tag placed on one does not survive. Use the [Include Landscapes / Include Mesh Terrains](../types/cell.md#terrain-is-two-flags) flags instead — they are the only control over it.

:::

## Options

Persistent settings rather than actions, rendered as checkboxes. Each maps to a field on the `ANCellActor`'s `UNCellRootComponent::Details`.

| Option | Description |
| :-- | :-- |
| **Calculate Bounds On Save** | Calculates the bounds of the cell when the level is saved. Cleared automatically by the [Bounds](#bounds) tool. |
| **Calculate Hull On Save** | Calculates the hull of the cell when the level is saved. Cleared automatically by the [Vertices](#vertices) and [Edges](#edges) tools. |
| **Allow Non-Convex Hull** | Allows a more complex collision mesh instead of an optimized convex hull. This adds a performance cost when evaluating penetration, since it becomes a complex calculation — `false` by default, use sparingly. |

Each one switched off is reported in the panel's [warning footer](index.mdx#warnings) for as long as it stays off.

## Display

Which parts of the cell overlay get drawn — everything in the viewport list at the top of this page, other than the junction rectangles themselves — as checkboxes below [Options](#options).

| Option | Description |
| :-- | :-- |
| **Draw Bounds** | Draw the red wireframe cube of the cell's bounds. |
| **Draw Hull** | Draw the blue wireframe of the collision/convex mesh. |
| **Draw Fill Bounds** | Draw the grey box at each junction previewing the volume its filler would occupy. |

They are ruled off from the Options above them because they persist somewhere else entirely. An Option is authored onto the `ANCellActor` and ships with the cell; these three are **per-user**, stored in `NexusUserSettings.ini` and mirrored in `Edit > Editor Preferences` under [World Assembly (User) > Debug](../user-settings.md#debug), so switching one off changes what you see and nothing that anyone else gets.

They also hold wherever a cell draws, rather than only while this mode is open — a cell viewed with the World Assembly mode closed honours them too.

:::note[Tool Handles Are Not Affected]

Switching the hull off does not disarm the [Vertices](#vertices) or [Edges](#edges) tools, and switching bounds off does not disarm [Bounds](#bounds). A running tool draws its own handles, so it stays usable with the overlay geometry hidden.

:::

## Voxel Data

:::info

**The voxel tooling is currently hidden.** The voxel tool, the **Calculate Voxel** command, and the **Use Voxel Data w/ Cell** and **Calculate Voxel Data On Save** options are all commented out of the rail — voxel data is not used in the World Assembly process today.

The implementation still ships (`UNCellVoxelTool`, `FNCellVoxelGenerationSettings`) and the underlying settings remain on the `UNCellRootComponent::Details`, so nothing authored previously is lost. This section exists so the buttons' absence reads as deliberate rather than as something you failed to find.

:::
