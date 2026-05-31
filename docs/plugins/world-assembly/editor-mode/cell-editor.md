---
tags: [0.3.0]
---

# Cell Editor

The editor of all things [Cell](../types/cell.md)-related when it comes to a level.

![Mode](cell-edit-mode.webp)

- The red wireframe cube is the cell bounds.
- The blue wireframe is the collision/convex mesh.
- The lego-like rectangles represent the junctions of the cell, where it can connect to other [Cell](../types/cell.md)(s) and [Bone](../types/bone-component.md)(s).

## No ANCellActor Present

When no `ANCellActor` is present in a given level, despite being in World Assembly Mode, a simplified toolbar is present with a button to add a `ANCellActor` to the current level.

![No Data Toolbar](mode-toolbar-no-cell-no-organ.webp)

Once an `ANCellActor` is present in the level, the toolbar will expand out with supported features.

![Cell Editing Toolbar](mode-toolbar-cell.webp)

## Cell Menu

![Cell Menu](cell-edit-cell-menu.webp)

### Asset

| Command | Description |
| --- | --- |
| Capture Thumbnail | Captures the current viewport (minus gizmos) as the thumbnail for the current level, also applies a version to the associated `UNCell` without gizmos. |

### Calculate

| Command | Description |
| --- | --- |
| Calculate All | Calculates all calculatable data for the `ANCellActor`'s `UNCellRootComponent`. |
| Calculate Bounds | Calculate the **bounds** for the `ANCellActor`'s `UNCellRootComponent` which gets propagated to the associated `UNCell`; overwriting any previous edits. |
| Calculate Hull | Calculate a **convex hull** for the `ANCellActor`'s `UNCellRootComponent` which gets propagated to the associated `UNCell`; overwriting any previous edits. |
| Calculate Voxel Data | Calculate the **voxel data** for the `ANCellActor`'s `UNCellRootComponent` which gets propagated to the associated `UNCell`; overwriting any previous edits. |

### Quick Settings

| Command | Description |
| --- | --- |
| Calculate Bounds On Save | Toggles `FNCellBoundsGenerationSettings::bCalculateOnSave` on the `ANCellActor`'s `UNCellRootComponent::Details`. |
| Allow Non-Convex Hull | While editing the convex hull, this option prevents moving edges and vertices into non-convex positions. By enabling this option, non-convex meshes are allowed to be created. This adds a performance cost when evaluating penetration against this mesh as it becomes a complex calculation. By default this remains `false`, use sparingly. |
| Calculate Hull On Save | Toggles `FNCellHullGenerationSettings::bCalculateOnSave` on the `ANCellActor`'s `UNCellRootComponent::Details`. |
| Calculate Voxel Data On Save | Toggles `FNCellVoxelGenerationSettings::bCalculateOnSave` on the `ANCellActor`'s `UNCellRootComponent::Details`. |
| Use Voxel Data w/ Cell | Enables using voxel data with a [Cell](../types/cell.md), `false` by default. |

### Cleanup

| Command | Description |
| --- | --- |
| Reset Cell | Resets the `ANCellActor` in the level, recreating all data back to a default state. |
| Save Cell | Writes out any changed data to the associated `UNCell`. |
| Remove Actor | Removes the `ANCellActor` from the level, and delete the associated sidecar asset (`UNCell`). |

## Junction Menu

![Junction Menu](cell-edit-junction-menu.webp)

| Category | Command | Description |
| --- | --- | --- | 
| | Add Junction | |
| *Select Junction* | | |

## Editing Junctions

## Editing Collision Mesh

![Hull Edge](cell-edit-hull-edge.webp)
