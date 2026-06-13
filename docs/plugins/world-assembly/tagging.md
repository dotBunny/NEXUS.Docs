---
description: Tags play an interesting role within World Assembly, providing a cheap and effective way to markup content, drive behavior, and convey information to third-party consumers.
sidebar_position: 3
tags: [0.3.0, 0.3.1, 0.3.2]
---

# Tagging

Tags play a powerful role within `World Assembly`, providing a cheap and effective way to markup content, drive behavior, and convey information to third-party consumers.

:::tip

Actor-based tags are available natively in the `NEXUS::WorldAssembly::ActorTags` namespace.

:::

## Cell Markup Tags

By adding pre-defined `FName` tags to any `AActor` in a Cell's source level it will alter how the `UNCell` spatial calculations apply to it.

| Tag | Native | Effect |
| --- | --- |--- |
| `NCell_Ignore` | `CellIgnore` | Excludes the actor from every cell-generation spatial calculation. |
| `NCell_BoundsIgnore` | `BoundsIgnore` | Excludes the actor from the cell's axis-aligned bounds calculation only. |
| `NCell_HullIgnore` | `HullIgnore` | Excludes the actor from the cell's convex-hull calculation only. |
| `NCell_VoxelIgnore` | `VoxelIgnore` | Excludes the actor from the cell's voxel-occupancy calculation only. |

## World Collision Markup Tags

Plain `FName` tags added to any `AActor`, consumed by the virtual-world capture phase before any cell pass runs in an assembly operation.

| Tag | Native| Effect |
| --- | --- | --- |
| `NWorldCollision_Ignore` | `WorldCollisionIgnore` | Excludes the actor from the virtual-world collision capture; the actor is not visible to any subsequent assembly pass at all. |

The edit-mode toolbar in [Editor Mode](editor-mode/index.mdx) provides quick-toggle commands for the `NCell_Ignore` and `NWorldCollision_Ignore` tags on the current selection.

## Assembly Gameplay Tags

Native gameplay tags are declared in `NWorldAssemblyGameplayTags.h`. They are evaluated by the organ-assembly graph builder when ranking candidate tissue entries for each position in the graph.

### Behavior Modifiers

#### `NEXUS.WorldAssembly.Behavior.Starter`

Tagged items can be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or StarterOnly), any can be used instead in their place.

#### `NEXUS.WorldAssembly.Behavior.StarterOnly`

Tagged items can ONLY be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or Starter), any can be used instead in their place.

#### `NEXUS.WorldAssembly.Behavior.NotStarter`

Tagged items cannot be used at the start of an Organ Assembly node branch.

#### `NEXUS.WorldAssembly.Behavior.Finisher`

Tagged items can be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or FinisherOnly), any can be used instead in their place.

#### `NEXUS.WorldAssembly.Behavior.FinisherOnly`

Tagged items can ONLY be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or Finisher), any can be used instead in their place.

#### `NEXUS.WorldAssembly.Behavior.NotFinisher`

Tagged items cannot be used at the end of an Organ Assembly node branch.

### Flags

#### `NEXUS.WorldAssembly.Flag.AlwaysRelevant`

Tagged items are considered `Always Relevant` for networking purposes. Think of this as something you want to always have syncronized, regardless of how far away a client may be.

#### `NEXUS.WorldAssembly.Flag.Hotpath`

Tagged items are treated as **goals** inside the cell graph. Starting from the start cell — the root, or the first cell linked to the root Bone — the assembly graph builder threads a path through every `Hotpath`-flagged cell and then branches out to any additional Bones, so the flagged cells are guaranteed to sit on a continuous connected route through the generated space.

Two variants are resolved for every cell, both using an unweighted (hop-count) breadth-first search over the graph's connectivity:

- **Shortest** — the union of the independent shortest path from the start cell to each goal (spokes radiating from the start).
- **Sequential** — a greedy nearest-first chain that threads `start → nearest goal → next-nearest → …`, visiting the goals in turn.

A cell is considered "on the hot path" if it lies on *either* variant, and any junction connecting two hot-path cells is flagged the same way. Anything implementing [Cell Initialized](types/cell-initialized.md) can read this membership off its `ANCellLevelInstance` once the cell is initialized, and the [World Assembly Library](types/world-assembly-library.md) exposes matching `Is HotPath` queries for both Blueprint and C++.

:::note

`Hotpath` only influences routing when at least one cell in the assembly carries the tag. With no flagged cells there is no hot path and every cell's hot-path flags stay `false` — the graph builds exactly as it did before.

:::


### Pre-Made Groups

These tags are here as example content, or first-usage type tags. They are automatically added to their respective `Tag Groups`, so you don't have to worry about adding them — they are just here to get you started.

#### `NEXUS.WorldAssembly.Behavior.Unique`

Only one of the tagged items can be placed in an Organ Assembly. This is just a built-in default unique group, you can make your own to create discrete groups to assign to the `Tag Groups > Unique` option.

#### `NEXUS.WorldAssembly.Behavior.RequiredAny`

Predefined group that ensures anything in it must be present in the generated graph; when combined with `Unique`, ensures only one is present, ignoring `MinimalCount`. You can make your own to create discrete groups to assign to the `Tag Groups > Required (Any)` option.

#### `NEXUS.WorldAssembly.Behavior.BadNeighbors`

Predefined group that makes it so any member cell entry of that group cannot be placed beside each other, making them bad neighbors. You can make your own to create discrete groups to assign to the `Tag Groups > Bad Neighbors` option.

### Pre-Made Counters

There are a few built-in counter tags `NEXUS.WorldAssembly.Counter.Alpha`, `NEXUS.WorldAssembly.Counter.Beta` and `NEXUS.WorldAssembly.Counter.Charlie` that are used for demonstration purposes, but might also be useful.