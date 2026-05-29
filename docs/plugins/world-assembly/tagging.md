---
description: Tags play an interesting role within World Assembly, providing a cheap and effective way to markup content, drive behavior, and convey information to third-party consumers.
---

# Tagging

Tags play an interesting role within `World Assembly`, providing a cheap and effective way to markup content, drive behavior, and convey information to third-party consumers.

Actor-based tags are available natively in the `NEXUS::WorldAssembly::ActorTags` namespace.


## Cell Markup Tags

Plain `FName` tags added to any `AActor` in a Cell's source level. Each cell-generation pass reads a list of ignore tags from the matching settings struct and skips actors carrying any of them;

| Tag | Native | Consumed By | Effect |
| --- | --- |--- | --- |
| `NCell_Ignore` | `CellIgnore` | [Bounds](concepts/cell/index.md), [Hull](concepts/cell/index.md), [Voxel](concepts/cell/index.md) generation settings | Excludes the actor from every cell-generation pass — bounds, hull, and voxel calculations all skip it. |
| `NCell_BoundsIgnore` | `BoundsIgnore` | Bounds generation settings | Excludes the actor from the cell's axis-aligned bounds calculation only. |
| `NCell_HullIgnore` | `HullIgnore` | Hull generation settings | Excludes the actor from the cell's convex-hull calculation only. |
| `NCell_VoxelIgnore` | `VoxelIgnore`| Voxel generation settings | Excludes the actor from the cell's voxel-occupancy calculation only. |

## World Collision Markup Tags

Plain `FName` tags added to any `AActor`, consumed by the virtual-world capture phase before any cell pass runs in an assembly operation.

| Tag | Native | Consumed By | Effect |
| --- | --- | --- | --- |
| `NWorldCollision_Ignore` | `WorldCollisionIgnore` | `FNCreateVirtualWorldTask` | Excludes the actor from the virtual-world collision capture; the actor is not visible to any subsequent assembly pass at all. |

The edit-mode toolbar in [Editor Mode](editor-mode.md) provides quick-toggle commands for the `NCell_Ignore` and `NWorldCollision_Ignore` tags on the current selection.

## Assembly Gameplay Tags

Native gameplay tags are declared in `NWorldAssemblyGameplayTags.h`. They are evaluated by the organ-assembly graph builder when ranking candidate tissue entries for each position in the graph.

| Tag | Description |
| --- | --- |
| `NEXUS.WorldAssembly.BuiltIn.Starter` | Tagged items can be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or StarterOnly), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.StarterOnly` | Tagged items can ONLY be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or Starter), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.NotStarter` | Tagged items cannot be used at the start of an Organ Assembly node branch. |
| `NEXUS.WorldAssembly.BuiltIn.Finisher` | Tagged items can be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or FinisherOnly), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.FinisherOnly` | Tagged items can ONLY be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or Finisher), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.NotFinisher` | Tagged items cannot be used at the end of an Organ Assembly node branch. |
| `NEXUS.WorldAssembly.BuiltIn.Unique` | Only one of tagged items could be placed in an Organ Assembly. This is just a built-in default unique group, you can make your own to create discrete groups to assign to the `Tag Groups > Unique` option.|
| `NEXUS.WorldAssembly.BuiltIn.Required` | Predefined group that ensure that anything in it must be present in the generated graph, when combined with `Unique`, ensures only one is present, ignoring `MinimalCount`. You can make your own to create discrete groups similar to assign to the `Tag Groups > Required` option. |