---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a cell's bounds, hull, and voxel overlays and accepts the drag input that edits them.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Root Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNCellRootComponentVisualizer" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/Visualizers/NCellRootComponentVisualizer.h" />

The only visualizer in World Assembly that is also an **editing tool**. It draws the [Cell Root Component](../../types/cell.md#cell-root-component)'s bounds, hull, and voxel overlays into the viewport, and it handles the clicks and drags that modify them — so the direct manipulation described in [Cell Editor](../../editor-mode/cell-editor.md) is implemented here rather than by a separate tool class.

## What a Click Does Depends on the Sub-Mode

This is the part worth internalising. The visualizer does **not** decide from what you clicked; it asks the editor mode which cell sub-mode is active and routes accordingly. The same vertex hit proxy therefore behaves differently depending on the Cell Editor's current sub-mode:

| Hit proxy | Sub-mode `Bounds` | Sub-mode `Hull` | Sub-mode `Voxel` |
| :-- | :-- | :-- | :-- |
| Index (a vertex or voxel point) | Select the [bounds](../../editor-mode/cell-editor.md#editing-bounds) vertex for dragging | Select the [hull](../../editor-mode/cell-editor.md#editing-convex-hull) vertex for dragging | **Toggle** the [voxel](../../editor-mode/cell-editor.md#editing-voxel-data) on or off |
| Edge (a hull edge) | — | Select the whole hull edge | — |

Clicks are only handled for the **left** mouse button, and only when the proxy resolves to a live cell root component.

The voxel case is the outlier: it is an immediate toggle rather than the start of a drag, so there is nothing to drag afterwards.

## Edit Modes

`ENCellEditMode` records what is currently being dragged, between the click that started it and `EndEditing`.

| Mode | Meaning | Viewport gizmo |
| :-- | :-- | :-- |
| `None` | Nothing selected. | unchanged |
| `HullVertex` | A single hull vertex is selected. | `Translate` |
| `BoundsVertex` | A single bounds vertex is selected. | `Translate` |
| `HullEdge` | A whole hull edge (both endpoints) is selected. | **`None`** |

:::note[An edge selection deliberately hides the gizmo]

Selecting a vertex sets the level editor's widget mode to `Translate`, because a vertex is a point you move. Selecting a hull **edge** sets it to `None` instead — an edge is a selection for edge-level operations, not something dragged by a translation gizmo, and leaving a gizmo on screen would invite a drag that means nothing.

:::

## Reading Selection State

| Member | Returns |
| :-- | :-- |
| `GetMode()` | The active `ENCellEditMode`. |
| `HasEdgeSelected()` | `true` only when **both** edge endpoints are set. |
| `GetEdgeSelection()` | The selected edge as `(start index, end index)`. |
| `ClearSelection()` | Resets the vertex and both edge indices to `-1`. |

Indices use `-1`, not `INDEX_NONE`-checked containers, so treat `-1` as "nothing selected" when reading these directly.

## Input Handling

| Override | Role |
| :-- | :-- |
| `DrawVisualization` | Draws the bounds, hull, and voxel overlays plus the selectable points. |
| `VisProxyHandleClick` | Routes a click through the sub-mode table above. |
| `HandleInputDelta` | Applies a drag to the selected hull or bounds vertex. |
| `HandleInputKey` | **`Escape` cancels** the current selection. Returns early when nothing is selected. |
| `GetWidgetLocation` | Places the transform gizmo on the selected vertex. |
| `EndEditing` | Clears the mode and drops the cached component reference. |

Selectable points are drawn at a fixed **12px** size, so they stay clickable regardless of camera distance.

## See Also

- [Cell](../../types/cell.md) — the cell actor and root component this visualizer draws and edits.
- [Cell Editor](../../editor-mode/cell-editor.md) — the authoring workflow, including how sub-modes are selected.
- [Cell Voxel Data](../../types/cell-voxel-data.md) — the occupancy grid the `Voxel` sub-mode toggles into.
