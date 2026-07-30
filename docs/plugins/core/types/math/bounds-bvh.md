---
sidebar_class_name: type native-class
description: Immutable bounding-volume hierarchy over an indexed set of axis-aligned boxes, built once and queried many times.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Bounds BVH

<TypeDetails icon="native-class" base="class" type="FNBoundsBVH" typeExtra="" headerFile="NexusCore/Public/Math/NBoundsBVH.h" />

A broadphase over a set of `FBox` bounds: it answers *"which of these N objects could overlap this box"* without touching the other N−1. The object-level counterpart to [Mesh BVH](mesh-bvh.md), which accelerates queries against the triangles *within* a single mesh.

Reach for it when code currently sweeps a whole collection once per query. World Assembly's graph builder is the motivating case — it tests every candidate cell placement against every world-collision mesh and every previously-placed cell.

## What It Is

- **Immutable**: built once in the constructor, never mutated. A built tree is safe to share across threads with no synchronisation. There is no incremental insert — rebuild when the underlying set changes.
- **Space-agnostic**: bounds are consumed in whatever space you supply and are never transformed. Query boxes must be in that same space.
- **Index-preserving**: entries with invalid bounds are dropped at build time — they can never overlap anything — but every surviving entry keeps its **original** index, so results index straight back into your array.

## Building

```cpp
/**
 * Builds a hierarchy over Bounds.
 * @param Bounds Source bounds, indexed by position. Invalid entries are skipped; the rest keep their index.
 */
explicit FNBoundsBVH(TConstArrayView<FBox> Bounds);

/** @return true when the hierarchy holds no entries. */
bool IsEmpty() const;

/** @return The number of indexed entries, excluding any source entry whose bounds were invalid. */
int32 Num() const;

/** @return The AABB enclosing every indexed entry, or an invalid box when empty. */
FBox GetBounds() const;
```

Because invalid entries are dropped, `Num()` may be smaller than the source array — it is a count of indexed entries, not a valid index bound for your own array.

## Querying

```cpp
/**
 * Collects the index of every entry whose bounds overlap QueryBox.
 * @param QueryBox Box to test against, in the same space as the source bounds. An invalid box matches nothing.
 * @param OutIndices Receives the matching source indices.
 */
template <typename AllocatorType>
void QueryOverlaps(const FBox& QueryBox, TArray<int32, AllocatorType>& OutIndices) const;
```

The result is exactly equivalent to sweeping the source array and keeping every index where `FBox::Intersect` holds — traversal only ever prunes subtrees whose enclosing box already fails that test. So swapping a sweep for a BVH cannot change which indices come back.

:::tip[It is built to be called in a loop]

`OutIndices` is **reset, not reallocated**. Pass the same array across queries and it settles at zero allocations per call after the first few. `QueryOverlaps` is templated on the allocator, so a caller in a hot loop can pass a `TArray<int32, TInlineAllocator<N>>` and stay off the heap entirely.

:::

:::warning[Results are not in index order]

Indices arrive in **traversal order** — deterministic for a given tree, but not ascending. Sort if you need a stable order, and do not assume the first result is the lowest index.

:::

## When It Pays Off

A BVH trades build cost for query cost, so it only wins when the same tree is queried many times. The measured threshold in World Assembly was roughly **200 collision primitives** inside an organ's bounds — below that, the sweep it replaces was never the dominant per-candidate cost.
