---
sidebar_position: 36
sidebar_label: Vector Utils
sidebar_class_name: type native-class
description: A collection of utility methods for working with FVectors.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

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
