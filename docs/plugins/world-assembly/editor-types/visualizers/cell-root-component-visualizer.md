---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a cell's bounds, hull, and voxel overlays into the viewport.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Root Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNCellRootComponentVisualizer" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/Visualizers/NCellRootComponentVisualizer.h" />

Draws the [Cell Root Component](../../types/cell.md#cell-root-component)'s bounds, hull, and voxel overlays into the viewport. **Draw-only** — its single override is `DrawVisualization`.

:::note[This visualizer used to do the editing]

It previously carried hit-proxy editing: dragging hull and bounds vertices, toggling voxel points, and selecting an edge to split. That moved to the [edit mode's interactive tools](../../editor-mode/cell.md#tools) — `UNCellBoundsTool`, `UNCellHullVertexTool` and `UNCellVoxelTool` — along with `HandleInputDelta`, `VisProxyHandleClick`, `GetWidgetLocation`, `EndEditing`, the `ENCellEditMode` enum and the edge-selection accessors, all of which are gone.

What is left is the wireframe pass for when the mode is **not** active, which the tools cannot cover because they only exist while it is.

:::

## What It Draws Depends on the Mode

| Editor mode | Drawn |
| :-- | :-- |
| **Not active** | The component's full debug pass — bounds, hull and voxel overlays — honouring the current voxel visualization style. |
| **Active** | Only the handles for the active cell-edit sub-mode; the mode itself draws the rest. |

While the mode is active, the sub-mode selects which handles appear:

| Sub-mode | Handles drawn |
| :-- | :-- |
| `Bounds` | A point at the bounds `Min` and `Max`. |
| `Hull` | A point per hull vertex, plus the hull edges. |
| `Voxel` | A point per voxel centre, coloured by occupancy. |

Handles are drawn at a fixed **12 units** (`EdModeMetrics::HandleSize`), so they stay visible regardless of camera distance.

## See Also

- [Cell](../../types/cell.md) — the cell actor and root component this visualizer draws.
- [Cell Rail](../../editor-mode/cell.md) — the authoring workflow and the tools that replaced this visualizer's editing.
- [Cell Voxel Data](../../types/cell-voxel-data.md) — the occupancy grid the `Voxel` sub-mode draws.
