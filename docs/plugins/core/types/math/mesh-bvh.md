---
sidebar_class_name: type native-class
description: Immutable bounding-volume hierarchy over the triangles of an FNRawMesh, built once and queried many times.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Mesh BVH

<TypeDetails icon="native-class" base="class" type="FNMeshBVH" typeExtra="" headerFile="NexusCore/Public/Math/NMeshBVH.h" />

A hierarchy over the triangles of one [Raw Mesh](../types/raw-mesh.md), turning point-containment and nearest-surface queries from O(triangles) into roughly O(log triangles) over the geometry a query actually touches. The triangle-level counterpart to [Bounds BVH](bounds-bvh.md), which indexes whole objects instead.

Built for author-time diagnostics that sample a large, static, non-convex mesh at a handful of points per frame — the motivating case being World Assembly's merged world-collision mesh sampled by the bone visualizer.

## What It Is

- **Immutable**: built once, never mutated; safe to share across threads without synchronisation.
- **Triangles only**: non-triangle loops are skipped at build time. The accelerated queries are only equivalent to their brute-force counterparts on a triangle mesh, which is the domain those queries are defined on anyway — run `ConvertToTriangles()` on the source first if needed.
- **Baked space**: the source mesh's vertices are assumed to be in the query space already (world space, for the merged collision mesh), matching the "vertices are baked" convention used throughout [Raw Mesh Utils](../types/raw-mesh-utils.md).

## Building

```cpp
/**
 * Builds a BVH over Mesh's triangle loops.
 * @param Mesh Source mesh; its triangle loops are read in the mesh's (baked) space. Non-triangle loops are skipped.
 */
explicit FNMeshBVH(const FNRawMesh& Mesh);

/** @return true when the hierarchy holds no triangles. */
bool IsEmpty() const;

/** @return The world-space AABB enclosing every triangle, or an invalid box when empty. */
FBox GetBounds() const;
```

An empty hierarchy is not an error — every query returns its documented empty-mesh answer instead.

## Queries

### Is Point Inside

```cpp
/** @return true when Point is enclosed by the surface; false when outside or the hierarchy is empty. */
bool IsPointInside(const FVector& Point) const;
```

An odd-parity ray cast, **bit-identical** to `FNRawMeshUtils::IsRelativePointInside` on the same closed-manifold triangle mesh. The traversal visits every triangle whose AABB the probe ray crosses — a superset of those the ray can actually pierce — and each triangle lives in exactly one leaf, so the parity count matches the brute-force sweep exactly. The probe direction matches the brute-force version too, so a grazed shared edge is missed by both adjacent triangles in either implementation, keeping the count stable.

### Nearest Surface Distance

```cpp
/** @return The nearest surface distance, or 0 when the hierarchy is empty. */
double NearestSurfaceDistance(const FVector& Point) const;
```

Minimum Euclidean distance from the point to any triangle surface, equal to the brute-force minimum — AABB-distance pruning only discards subtrees that provably cannot hold a closer triangle.

Note the empty-mesh answer is `0`, not a sentinel, so check `IsEmpty()` if zero would be ambiguous for your use.

### Get Point Depth

```cpp
/** @return Penetration depth when inside; -1 when outside or empty. */
float GetPointDepth(const FVector& Point) const;
```

The accelerated drop-in for a per-point `GetIntersectDepth` call. Matches `FNRawMeshUtils::ComputePointDepthInside` for a non-convex closed manifold: the distance to the nearest surface when the point is inside, or **`-1`** when it is outside the mesh's AABB, outside the surface, or the hierarchy is empty.

:::note

`-1` is a sentinel meaning "no penetration", not a distance. Test for it explicitly rather than comparing depths numerically — `-1` will otherwise read as the shallowest result in a `min` comparison.

:::
