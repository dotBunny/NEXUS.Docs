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

| Category | Command | Description |
| --- | --- | --- | 
| *Asset* | Capture Thumbnail | |
| *Calculate* | Calculate All | |
| *Calculate* | Calculate Bounds | |
| *Calculate* | Calculate Hull | |
| *Calculate* | Calculate Voxel Data | |
| *Quick Settings* | Calculate Bounds On Save | |
| *Quick Settings* | Allow Non-Convex Hull | |
| *Quick Settings* | Calculate Hull On Save | |
| *Quick Settings* | Calculate Voxel Data On Save | |
| *Quick Settings* | Use Voxel Data w/ Cell | |
| *Cleanup* | Reset Cell | |
| *Cleanup* | Save Cell | |
| *Cleanup* | Remove Actor | |


## Junction Menu

![Junction Menu](cell-edit-junction-menu.webp)

| Category | Command | Description |
| --- | --- | --- | 
| | Add Junction | |
| *Select Junction* | | |

## Editing Junctions

## Editing Collision Mesh

![Hull Edge](cell-edit-hull-edge.webp)
