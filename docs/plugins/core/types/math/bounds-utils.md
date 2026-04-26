---
sidebar_position: 24
sidebar_label: Bounds Utils
sidebar_class_name: type native-class
description: Native utility methods for working with FBoxSphereBounds and AVolumes.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Bounds Utils

<TypeDetails icon="native-class" base="class" type="FNBoundsUtils" typeExtra="" headerFile="NexusCore/Public/Math/NBoundsUtils.h" />

Native utility methods for working with `FBoxSphereBounds` and `AVolumes`. All bounds helpers treat the box portion of `FBoxSphereBounds` as authoritative; the sphere is used opportunistically as an early-out to avoid the more expensive box check.

## Methods

### Is Bounds Contained In Bounds

Tests whether the inner bounds are fully enclosed by the outer bounds.

```cpp
static FORCEINLINE bool IsBoundsContainedInBounds(const FBoxSphereBounds& InnerBounds, const FBoxSphereBounds& OuterBounds);
```

### Is Point In Bounds

Tests whether a point lies inside the supplied bounds, using the sphere radius as an early-out.

```cpp
static FORCEINLINE bool IsPointInBounds(const FVector& Point, const FBoxSphereBounds& Bounds);
```

### Get Point In Bounds

Returns `Point` if it is inside `Bounds`, otherwise the closest surface point on the box.

```cpp
static FORCEINLINE FVector GetPointInBounds(const FVector& Point, const FBoxSphereBounds& Bounds);
```

### Get Point In Bounds With Margin

Variant of `GetPointInBounds` that shrinks the bounds by `Margin` before clamping.

```cpp
static FORCEINLINE FVector GetPointInBoundsWithMargin(const FVector& Point, const FBoxSphereBounds& Bounds, const FVector& Margin);
```

### Is Volume Contained In Volume

Tests whether an inner volume is fully contained within an outer volume using precise geometry.

```cpp
static bool IsVolumeContainedInVolume(const AVolume* InnerVolume, const AVolume* OuterVolume);
```

### Is Volume Contained In Volume Fast

Fast (bounds-only) variant of `IsVolumeContainedInVolume`.

:::warning

Can return `true` for geometry that is not actually contained; use `IsVolumeContainedInVolume` when precision matters.

:::

```cpp
static bool IsVolumeContainedInVolumeFast(const AVolume* InnerVolume, const AVolume* OuterVolume);
```
