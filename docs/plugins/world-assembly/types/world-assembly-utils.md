---
sidebar_class_name: type native-class
description: Static C++ helpers for computing a cell's side-car data, finding cells and organs in a level or world, and the small geometry maths the graph builder relies on.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Utils

<TypeDetails icon="native-class" base="class" type="FNWorldAssemblyUtils" headerFile="NexusWorldAssembly/Public/NWorldAssemblyUtils.h" />

A static, native-only utility class — the C++ counterpart to the Blueprint-facing [World Assembly Library](world-assembly-library.md). It holds three unrelated groups of helpers: the calculators that produce a [Cell](cell.md)'s side-car data, the accessors that find cells and organs in a level or world, and the geometry maths the graph builder and [Debug Draw](world-assembly-debug-draw.md) share.

Not `UCLASS`, not Blueprint-exposed. Everything is `static`.

## Side-Car Calculators

These three produce the derived data a [Cell](cell.md) stores alongside its level — the data the editor recomputes when you re-bake a cell.

```cpp
static FBox CalculatePlayableBounds(ULevel* InLevel, const FNCellBoundsGenerationSettings& Settings);
static FNRawMesh CalculateConvexHull(ULevel* InLevel, const FNCellHullGenerationSettings& Settings);
static FNCellVoxelData CalculateVoxelData(ULevel* InLevel, const FNCellVoxelGenerationSettings& Settings);
```

Each takes the matching generation-settings struct from the cell's root component, so what a bake produces is entirely determined by what is authored on the cell — see [Bounds Settings](cell.md#bounds-settings), [Hull Settings](cell.md#hull-settings), and [Voxel Settings](cell.md#voxel-settings).

## Finding Cells and Organs

Two flavours of each lookup: `…FromLevel` walks a single `ULevel`, `…FromWorld` walks the whole world.

| Function | Returns |
| :-- | :-- |
| `GetCellActorFromLevel` | First [Cell Actor](cell.md#cell-actor) in the level, or `nullptr`. |
| `GetCellActorFromWorld` | First cell actor in the world, or `nullptr`. |
| `GetCellActorCountFromLevel` | Number of cell actors in the level. |
| `GetCellActorCountFromWorld` | Number of cell actors in the world. |
| `GetOrganComponentsFromLevel` | Every [Organ Component](organ-component.md) attached to an actor in the level. |
| `GetOrganVolumesFromLevel` | Every [Organ Volume](organ-volume.md) in the level. |
| `GetOrganVolumesFromWorld` | Every organ volume in the world. |

:::info[Two default arguments worth knowing]

Every `…FromWorld` overload takes `bool bIgnoreInstancedLevels = true`, so by default a world query **skips actors living inside level instances** — the cells a previous generation pass spawned as [Cell Proxies](cell-proxy.md) do not get counted as authored input. Pass `false` when you genuinely want everything, including generated content.

`GetOrganComponentsFromLevel` takes `bool bSorted = true`, and the default is not cosmetic: the graph builder consumes organs in the order this returns them, so a stable sort is what makes generation reproducible. Passing `false` trades determinism for a marginally cheaper query.

:::

## Geometry Helpers

Small `FORCEINLINE` transforms, used constantly enough during placement that the call overhead mattered:

| Function | Purpose |
| :-- | :-- |
| `CreateRotatedBox` | `InBox` rotated and translated by a `FRotator` + `FVector` pair. |
| `OffsetLocation` | `InLocation` rotated then translated. |
| `GetWorldSize2D` | Unit dimensions × per-axis unit size. Two overloads — `FVector2D` and `FVector` unit sizes (the latter uses only XY). |
| `GetSocketPoints2D` | The 2D corner points of a junction socket of the given unit dimensions. |
| `GetCenteredWorldCornerPoints2D` | Four centered world-space corners for a `Width × Height` rectangle, oriented perpendicular to `Axis` (defaults to `ENAxis::Z`). |

### Ray / AABB Intersection

```cpp
/**
 * Axis-aligned box ray intersection detection
 * @remark Slab method (t = (box_coord - ray_origin_coord) / ray_direction_coord)
 */
static bool RayAABBIntersection(const FVector& RayOrigin, const FVector& RayDirection, const FBox& Box, FVector& OutIntersectionPoint);
```

The standard slab method. It returns the **near** hit when the ray origin is outside the box, and the **far** hit when the origin is inside it — so a ray starting within a box still yields an intersection point (its exit) rather than reporting a miss.

:::warning

`RayDirection` is inverted component-wise with **no zero guard**, so any zero component produces an infinity — and if the ray origin also sits exactly on that slab's plane, the resulting `0 * ∞` is `NaN` and the comparisons fail unpredictably. Perfectly axis-aligned rays are the common case here, so nudge the origin off the plane or use a non-degenerate direction; a zero-length direction vector is never safe.

:::

## Voxel Query Points

```cpp
/** Number of sample points emitted by GetVoxelQueryPoints (face + edge + corner neighbours). */
constexpr static size_t VoxelQueryPointCount = 26;

static void GetVoxelQueryPoints(const FVector& WorldCenter, const FVector& VoxelSize, TArray<FVector>& OutPositions);
static void GetVoxelQueryLevelBoundsEndPoints(const FVector& WorldCenter, const FBox& LevelBounds, TArray<FVector>& OutPositions);
```

`GetVoxelQueryPoints` emits the 26 neighbours surrounding a point — 6 faces, 12 edges, 8 corners — which is the full Moore neighbourhood of a voxel excluding the voxel itself. `VoxelQueryPointCount` is exposed so a caller can size its array up front instead of letting `TArray` grow.

`GetVoxelQueryLevelBoundsEndPoints` produces rays outward from a point to the faces of the level bounds, which is how voxelization decides whether a sample sits inside enclosed geometry.
