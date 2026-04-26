---
sidebar_position: 35
sidebar_label: Triangle Utils
sidebar_class_name: type native-class
description: Geometric helpers for working with individual triangles in 3D space.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Triangle Utils

<TypeDetails icon="native-class" base="class" type="FNTriangleUtils" typeExtra="" headerFile="NexusCore/Public/Math/NTriangleUtils.h" />

Geometric helpers for working with individual triangles in 3D space. All routines are header-only and allocation-free.

## Methods

### Is Point In Triangle

Tests whether `Point` lies inside the triangle (`A`, `B`, `C`) using barycentric coordinates.

:::info

`Point` must lie in (or very near) the triangle's plane for a meaningful result.

:::

```cpp
/**
 * Tests whether Point lies inside the triangle (A, B, C) using barycentric coordinates.
 * @param Point The 3D point to test.
 * @param A First triangle vertex.
 * @param B Second triangle vertex.
 * @param C Third triangle vertex.
 * @return true when Point's barycentric coordinates are both non-negative and sum to no more than one.
 */
UE_FORCEINLINE_HINT static bool IsPointInTriangle(const FVector& Point, const FVector& A, const FVector& B, const FVector& C);
```

### Triangles Intersect

Triangle-triangle intersection test using the full Möller 1997 algorithm. Performs plane-distance rejection, coplanar handling, and interval overlap on the intersection line.

```cpp
/**
 * Triangle-triangle intersection test using the full Möller 1997 algorithm.
 * @param V0 First vertex of triangle one.
 * @param V1 Second vertex of triangle one.
 * @param V2 Third vertex of triangle one.
 * @param U0 First vertex of triangle two.
 * @param U1 Second vertex of triangle two.
 * @param U2 Third vertex of triangle two.
 * @return true when the two triangles intersect or are coplanar with an overlap.
 */
static bool TrianglesIntersect(const FVector& V0, const FVector& V1, const FVector& V2,
  const FVector& U0, const FVector& U1, const FVector& U2);
```
