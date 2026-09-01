---
sidebar_class_name: type native-class
description: A collection of utility methods for working with FVectors.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Vector Utils

<TypeDetails icon="native-class" base="class" type="FNVectorUtils" typeExtra="" headerFile="NexusCore/Public/Math/NVectorUtils.h" />

A collection of utility methods for working with `FVectors`.

## ENAxis

Identifies a single Cartesian axis (or the absence of one). Used by helpers across the framework that need to express which world axis to operate on.

```cpp
UENUM(BlueprintType)
enum class ENAxis : uint8
{
    None = 0,
    X = 1,
    Y = 2,
    Z = 3,
};
```

## Methods

### Transform / Rotate Helpers

```cpp
/** Rotates Point by Rotation and offsets the result by Origin. */
FORCEINLINE static FVector TransformPoint(const FVector& Point, const FVector& Origin, const FRotator& Rotation);

/** Rotates Point by Rotation and adds Offset. */
FORCEINLINE static FVector RotateAndOffsetPoint(const FVector& Point, const FRotator& Rotation, const FVector& Offset);

/** Rotates WorldVector around WorldPoint using Rotation as the pivot. */
FORCEINLINE static FVector RotatedAroundPivot(const FVector& WorldVector, const FVector& WorldPoint, const FRotator& Rotation);
```

### Batch Helpers

```cpp
/** Batch variant of RotateAndOffsetPoint. */
static TArray<FVector> RotateAndOffsetPoints(const TArray<FVector>& Points, const FRotator& Rotation, const FVector& Offset);

/** Returns a new array where each vector has been rotated by Rotation. */
static TArray<FVector> RotatePoints(const TArray<FVector>& Vectors, const FRotator& Rotation);

/** Returns a new array where each vector has been translated by Offset. */
static TArray<FVector> OffsetPoints(const TArray<FVector>& Vectors, const FVector& Offset);
```

### Grid Snapping

```cpp
/** Snaps Location to the nearest grid intersection defined by GridSize. */
FORCEINLINE static FVector GetClosestGridIntersection(const FVector& Location, const FVector& GridSize);

/** Returns the furthest (ceiling-rounded) grid intersection for each axis. */
FORCEINLINE static FVector GetFurthestGridIntersection(const FVector& Location, const FVector& GridSize);

/** Divides Value by Size and returns the "crunched" unit index, snapping on-grid values down and everything else up. */
FORCEINLINE static int GetCrunchedGridUnit(const double& Value, const double& Size);
```

### Grid Reduce Points

Thin a point cloud onto a grid, keeping at most one point per cell and snapping each **away from a center**.

```cpp
/**
 * Thin a point cloud onto a grid, keeping at most one point per cell and snapping each away from a center.
 * @param Points Source points, in world space.
 * @param Center Point to snap away from — the source geometry's own center.
 * @param GridSize Edge length of a cell, in world units. Values at or below zero return the points unchanged.
 * @param SeenCells Cells already represented; carried across calls so several meshes thin against one grid.
 * @param OutPoints Destination, appended to.
 */
static void GridReducePoints(const TArray<FVector>& Points, const FVector& Center, double GridSize,
  TSet<FIntVector>& SeenCells, TArray<FVector>& OutPoints);
```

Written for terrain, which hands a convex hull builder its entire surface — measured at a million points across four sections, into a build that is superlinear in them. A convex hull is decided by its **extreme points alone**, so nearly all of that is discarded anyway; this discards it first.

`SeenCells` is caller-owned so several meshes can be thinned against **one** grid: pass the same set across calls and a point in a cell another mesh already covered is dropped rather than duplicating it.

:::warning[The Outward Bias Is Not a Containment Proof]

Snapping away from `Center` puts each kept point at or beyond the ones it replaces along each outward axis, so the error is bounded by roughly `GridSize` and biased outward.

That bias **assumes a convex build downstream**. Coordinate-wise domination does not imply membership of an arbitrary hull, so were a consumer's build ever made concave, snapping outward would push a concave surface into the void it is meant to bound.

:::

The World Assembly cell hull is the caller this exists for — see [Terrain Simplification](../../../world-assembly/types/cell.md#terrain-simplification) for what the grid size reads as from the authoring side.
