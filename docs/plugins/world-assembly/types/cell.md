---
description: A reusable level wrapper that lets World Assembly reason about placement without loading the source map.
sidebar_class_name: type ue-data-asset
---


import TypeDetails from '@site/src/components/TypeDetails';

# Cell

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-cell-data.svg" iconType="img" base="UDataAsset" type="UNCell" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCell.h" />

:::info[Wikipedia Definition]

The basic structural and functional unit of all living organisms. It is the smallest unit of life classified as a living thing, acting as the fundamental building block of all tissues and organs

:::

![Editing Convex Hull](/assets/images/docs/plugins/world-assembly/types/cell-edit-hull-vertex.webp)

A cell represents a map's meta-data, allowing it to be placed in a World Assembly operation. It is meant to disconnect the actual `UWorld` (Map) from this data, allowing generation to occur without having to load any of the actual map data itself until it is actually used (`FNSpawnCellProxiesTask`).

This allows for an extremely efficient World Assembly operation, off of the Game Thread.

:::tip

Cell-level instances spawned at runtime/author-time are locked out from editing. Open the source level directly when you need to make changes. See the [Cell Rail](../editor-mode/cell.md) as part of the [Editor Mode](../editor-mode/index.mdx).

:::

## Cell Actor

The `ANCellActor` functions as the _root of all evil_, and also houses the level-side data for the `UNCell`.

![Cell Actor Details](/assets/images/docs/plugins/world-assembly/types/cell-actor-details.webp)

| Setting | Description |
|---|---|
| Cell Junctions | Internal mapping of a ticket/identifier to a [Junction](junction-component.md). |
| Author Time Actors | A user-defined list of `AActors` that should be destroyed when a `ANCellLevelInstance` is loaded. Will not effect cell spatial calculations either. |
| Initialize Callback Actors | Reference list to all `AActors` that implement the [INCellInitialized](cell-initialized.md) interface. Populated automatically during the save process to avoid finding at build time. |
| Sidecar | Soft-pointer to the associated side-car data (`UNCell`) for the level. |
| Cell Junction Next Identifier | Storage for the next internal ticket/identifier. |

## Cell Root Component

The `UNCellRootComponent` represents the data which is going to get mirrored into the `UNCell` when saved. Its authored state lives on a single `FNCellRootDetails` struct — the settings groups below are that struct's sections, and it is what the mirror copies.

![Cell Root Details](/assets/images/docs/plugins/world-assembly/types/cell-root-component-details.webp)

### Bounds Settings

| Setting | Type | Description | Default |
|---|---|---|---|
| Calculate On Save | `bool` | Should the bounds of the cell be calculated / updated on save. | `true` |
| Include Non Colliding | `bool` | Include non-colliding `AActors` in bounds calculations. | `false` |
| Include Editor Only | `bool` | Include `AActors` flagged as `EditorOnly` in bounds calculations. | `false` |
| Include Landscapes (EXPERIMENTAL) | `bool` | Landscapes contribute to the bounds. See [Terrain Is Two Flags](#terrain-is-two-flags). | `false` |
| Include Mesh Terrains (EXPERIMENTAL) | `bool` | Mesh Terrain sections contribute to the bounds, **even though they are transient**. | `false` |
| Include Foliage | `bool` | Foliage actors contribute to the bounds. See [Foliage Is Its Own Flag](#foliage-is-its-own-flag). | `false` |
| Actor Ignore Tags | `TArray<FName>` | `AActor`'s with these tags will be ignored during bounds calculations. | `NCell_Ignore`, `NCell_BoundsIgnore` |

### Rotation Constraints

The cell exposes a dual-interval `FNRotationConstraints` set. The _matching_ interval constrains a candidate rotation's own pose; the _difference_ interval constrains the delta between two rotations. Either interval can be enabled independently.

| Setting | Type | Description | Default |
|---|---|---|---|
| Enforce Matching? | `bool` | Enables the matching-interval test on the candidate rotation itself. | `true` |
| Minimum Matching Rotation | `FRotator` | Lower bound (inclusive) of the matching interval. | `(0,0,-180.f)` |
| Maximum Matching Rotation | `FRotator` | Upper bound (inclusive) of the matching interval. | `(0,0,180.f)` |
| Enforce Difference? | `bool` | Enables the difference-interval test on the delta between two rotations. | `false` |
| Minimum Difference Rotation | `FRotator` | Lower bound (inclusive) of the difference interval. | `(0,0,-180.f)` |
| Maximum Difference Rotation | `FRotator` | Upper bound (inclusive) of the difference interval. | `(0,0,180.f)` |

### Hull Settings

| Setting | Type | Description | Default |
|---|---|---|---|
| Calculate On Save | `bool` | Should the hull be calculated / updated on save. | `true` |
| Allow Non Convex | `bool` | Allow the hull to be non-convex; creating a complex collision mesh. There is a **performance cost** to using non-convex meshes inside of an assembly operation, choose wisely. | `false` |
| Include Non Colliding | `bool` | Include non-colliding `AActors` in hull calculations. | `false` |
| Include Editor Only | `bool` | Include `AActors` flagged as `EditorOnly` in hull calculations. | `false` |
| Include Landscapes (EXPERIMENTAL) | `bool` | Landscapes contribute to the hull. See [Terrain Is Two Flags](#terrain-is-two-flags). | `false` |
| Include Mesh Terrains (EXPERIMENTAL) | `bool` | Mesh Terrain sections contribute to the hull, **even though they are transient**. Without it a cell whose floor is a Mesh Terrain gets a hull with no floor in it, and the assembly penetration tests that consume that hull let other cells sink through it. | `false` |
| Include Foliage | `bool` | Foliage actors contribute to the hull. See [Foliage Is Its Own Flag](#foliage-is-its-own-flag). | `false` |
| Terrain Simplification Grid Size | `float` | Grid size, in centimetres, that terrain vertices are thinned onto before the hull is built. `0` keeps every one. See [Terrain Simplification](#terrain-simplification). | `100.f` |
| Build Method | `ENullBuildMethod` | This is the method/version used by Chaos to create the convex hull initially. It is currently locked out due to some of the newer versions of the system producing n-gons. | `Original` |
| Actor Ignore Tags | `TArray<FName>` | `AActor`'s with these tags will be ignored during hull calculations. | `NCell_Ignore`, `NCell_HullIgnore` |

#### Terrain Simplification

`Terrain Simplification Grid Size` reads as **how much slack the envelope is allowed**, not how detailed it is. A convex hull is decided by its extreme points alone, so thinning barely moves the resulting shape — it shifts each supporting plane outward by at most about the grid size. At the default the hull sits within a metre of the one every vertex would give.

Only terrain is thinned. Authored geometry arrives as a handful of collision primitives, but a terrain section hands over its entire surface — four sections have measured at 251,001 vertices each, which is a million points into a convex build that is superlinear in them.

This applies to **generation only**, and assumes the convex build that follows it. A hull hand-edited into a concave shape afterwards is unaffected.

### Proxy Color

### Voxel Settings

| Setting | Type | Description | Default |
|---|---|---|---|
| Use Voxel Data | `bool` | ***Voxel data is currently ignored.*** Should a cell's voxel data be used in assembly operations. | `false` |
| Calculate On Save | `bool` | Should the voxel data of the cell be calculated / updated on save. | `true` |
| Include Non Colliding | `bool` | Include non-colliding `AActors` in voxel data calculations. | `false` |
| Include Editor Only | `bool` | Include `AActors` flagged as `EditorOnly` in voxel data calculations. | `false` |
| Include Landscapes (EXPERIMENTAL) | `bool` | Landscapes contribute to voxel occupancy. See [Terrain Is Two Flags](#terrain-is-two-flags). | `false` |
| Include Mesh Terrains (EXPERIMENTAL) | `bool` | Mesh Terrain sections contribute to voxel occupancy. | `false` |
| Include Foliage | `bool` | Foliage actors contribute to voxel occupancy. See [Foliage Is Its Own Flag](#foliage-is-its-own-flag). | `false` |
| Actor Ignore Tags | `TArray<FName>` | `AActor`'s with these tags will be ignored during voxel data calculations. | `NCell_Ignore`, `NCell_VoxelIgnore` |
| Collision Channel | `ECollisionChannel` | The collision channel used when tracing for collisions to determine occupancy. | `WorldStatic` |

All three voxel include flags govern **two halves at once**: whether the terrain grows the voxel grid's extents, and whether the occupancy sweep can hit it. Excluded terrain joins the ignored-actor list the sweep is issued with, so it cannot register as occupied even though the physics world would otherwise report it.

### Foliage Is Its Own Flag

Each of the three calculations also carries `Include Foliage`, separate from the terrain pair and **off by default**.

It is a setting rather than an unconditional refusal, exactly as landscape is. Foliage is scenery in nearly every case — a cell whose bounds are grown by a tree it happens to contain is a cell that no longer fits where it should — but it is scenery somebody placed, and may legitimately want accounting for. The answer is the author's.

**PCG partition containers get no such flag.** All three calculations drop them outright: a container the generator owns and rewrites holds whatever the graph last happened to spawn, and would shape the cell differently after every regeneration.

:::note[Landscape grass is not foliage]

Grass belongs to its landscape and answers to `Include Landscapes`, not to this flag. See [`FNActorUtils::IsFoliageActor`](../../core/types/actor-utils.md#foliage-and-generated-containers) for why the two are held apart.

:::

### Terrain Is Two Flags

Each of the three calculations carries **both** `Include Landscapes` and `Include Mesh Terrains`. They are separate because the two are different kinds of actor with different reasons to be refused.

:::warning Experimental, and off by default

Terrain support is early. Both flags default to **off** on all three calculations, and turning one on here is only half of it — the [World Collisions](../project-settings.md#terrain-is-opt-in) project settings carry their own `Include Landscapes` and `Include Mesh Terrains`, also off by default. The cell flags decide whether terrain shapes *this cell*; the project flags decide whether terrain exists in the world representation an assembly routes around. Enable the pair that matches what you are trying to affect.

:::

| | Landscape | Mesh Terrain |
| :-- | :-- | :-- |
| In the level | An ordinary **saved** actor. | **Transient** actors Mesh Partition spawns and rebuilds. |
| Why the flag exists | Purely whether landscape geometry counts. | Buys a **transient exemption** the ordinary filters would otherwise deny it. |
| How its surface is read | [Sampled](../../core/types/types/raw-mesh-factory.md#landscape) — its collision is a Chaos heightfield behind no body setup. | Read directly; it has a real body setup. |

The Mesh Terrain half is the one that silently breaks things when off. The editor represents a Mesh Partition terrain as transient actors, which every ordinary actor filter skips — so without it a cell whose floor is a Mesh Terrain gets bounds that omit it and a hull with no floor in it, and the assembly penetration tests that consume that hull then let other cells sink straight through the ground.

`Actor Ignore Tags` cannot substitute for it either. A Mesh Partition terrain's actors are regenerated on every build, so a tag placed on one does not survive; these flags are the only control over it.

Terrain also gates *when* a calculation may run — see [Commands](../editor-mode/cell.md#commands) on the Cell rail.

## Side-Car Data

Each cell is stored as a side-car asset (`<CellName>_NCell.uasset`) that lives next to the source level. The side-car holds the cached bounds, hull, voxel data, junction set, and a thumbnail snapshot of the level — none of which require the level itself to be loaded for the assembly task graph to schedule work against the cell.

When a thumbnail is captured for the `ANCellActor` in the level editor (via the **Capture Thumbnails** command on the [Cell Data rail](../editor-mode/cell-data.md#actor)), it propagates (with gizmos) to the side-car automatically so the cell shows similar preview in the content browser as the source level.

The side-car asset's content-browser context menu includes a **Select Level** action button that jumps to the source level in the content browser — handy when triaging a generation result and you need to open the source map for the cell that produced a particular proxy.

### Schema Version

Each side-car stores the schema version it was written with, readable in native code via `GetVersion()`. Comparing it against the current schema is how stale data is detected after an upgrade — which is why a release that changes what the side-car caches asks you to rebake. The field is `VisibleAnywhere` and written by the save path, not something you set by hand.
