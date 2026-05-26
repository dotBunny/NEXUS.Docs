---
sidebar_position: 45
sidebar_label: Raw Mesh
sidebar_class_name: type native-struct
description: Lightweight CPU-side mesh representation used by World Assembly and blockout tools.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh

<TypeDetails icon="native-struct" base="struct" type="FNRawMesh" typeExtra="" headerFile="NexusCore/Public/Types/NRawMesh.h" />

Lightweight CPU-side mesh representation used by [World Assembly](../../../world-assembly/index.mdx) and [Blockout](../../../blockout/index.mdx) tools. Stores a shared vertex buffer plus one or more ordered loops that reference into it. Supports convexity / non-tri validation, rigid-body rotation around a pivot, edge-splitting topology edits, and conversion into Unreal Engine's `FDynamicMesh3` for richer geometry work.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Vertices` | `TArray<FVector>` | The vertices of the mesh. |
| `Center` | `FVector` | The relative center of the mesh. |
| `Bounds` | `FBox` | Relative AABB. |
| `Loops` | `TArray<`[`FNRawMeshLoop`](raw-mesh-loop.md)`>` | Ordered shape-edge definitions. The indices are ordered (1/2/3 for a triangle) and not looped — you must close the loop yourself if line-drawing. |
| `FaceLoops` | `TArray<`[`FNRawMeshLoop`](raw-mesh-loop.md)`>` | Optional pre-triangulation n-gonal face description in winding order. When populated, the convex-check walks these polygonal faces instead of `Loops`, avoiding false negatives from per-triangle plane tests on fan-triangulated coplanar faces. |

## Methods

### Indices

```cpp
/** Flattens Loops into a single contiguous index buffer. */
TArray<int32> GetFlatIndices() const;

/**
 * Extracts every unique undirected edge across all Loops as a (min, max) vertex-index pair.
 * Loops are treated as closed polygons (last vertex wraps back to first); shared edges
 * between adjacent faces collapse to a single entry.
 */
TArray<FIntVector2> GetEdgeIndices() const;

/** Re-triangulates non-triangular loops in place so every loop is a 3-vertex triangle. */
void ConvertToTriangles();
```

### Face Loops

```cpp
/**
 * Rebuilds FaceLoops from a triangulated Loops by grouping coplanar-adjacent triangles back into n-gonal faces.
 * The inverse of ConvertToTriangles for known-polygonal sources, and the only way to get a polygonal face
 * description for triangle-only inputs (static-mesh imports, physics tri meshes).
 * @param AngleToleranceDeg Maximum normal-angle difference for triangles to be considered the same face (default 1°).
 * @param RelativeDistanceTolerance Coplanarity threshold as a fraction of mesh extent (default 1e-4).
 */
void CalculateFaceLoops(double AngleToleranceDeg = 1.0, double RelativeDistanceTolerance = 1e-4);
```

`CalculateFaceLoops` is a no-op when `Loops` is empty or contains any non-triangle, and faces with internal holes are emitted as their outer boundary only. That trade-off is intentional: convex hulls don't have hole-faces, and convexity is the primary consumer.

### Validation

The convex / non-tri / bounds flags are cached and lazy-refreshed — mutators only mark them dirty, and the next query (or an explicit `Validate()` call) re-evaluates them. Friend classes that bypass the built-in mutators must call `InvalidateValidation()` themselves after touching `Vertices` or `Loops`.

```cpp
/** Cached convexity result. Lazily re-evaluated on first read after a mutator marks validation dirty. */
bool IsConvex() const;

/** Cached AABB-set flag. */
bool HasBounds() const;

/** Cached non-triangle-loop flag. */
bool HasNonTris() const;

/** Marks the cached convexity / non-tri / bounds flags stale. */
void InvalidateValidation() const;

/** Runs the convexity / non-tri / bounds checks if the cache is dirty, otherwise no-ops. */
void EnsureValidated() const;

/** Forces an immediate re-evaluation, equivalent to InvalidateValidation() + EnsureValidated(). */
void Validate();
```

### Face-Plane Cache

A transient per-triangle plane cache (raw `Cross` normal, plane offset `D`, and `1/||Normal||`) is populated lazily by the convex-path consumers in [Raw Mesh Utils](raw-mesh-utils.md). Degenerate triangles produce zero entries that consumers treat as "skip this face".

```cpp
/** True when the face-plane cache reflects the current Loops / Vertices state. */
bool HasCachedFacePlanes() const;

/** Lazily populates the face-plane cache; no-ops when already valid. */
void EnsureCachedFacePlanes() const;

/** Per-triangle raw face normals — Cross(V1-V0, V2-V0), un-normalized. */
const TArray<FVector>& GetCachedFaceNormals() const;

/** Per-triangle plane offsets such that PlaneD[i] = Dot(Normal[i], V0[i]). */
const TArray<double>& GetCachedFacePlaneD() const;

/** Per-triangle 1/||Normal||. Zero for degenerate triangles. */
const TArray<double>& GetCachedFaceInvNormalLen() const;

/** Marks the cache stale so the next consumer query rebuilds it. */
void InvalidateCachedFacePlanes() const;
```

### Geometry

```cpp
/** Rotates every vertex and the center around a world-space pivot; refreshes Bounds from the rotated vertices. */
void RotatedAroundPivot(const FVector& WorldPoint, const FRotator& Rotation);

/** Bakes Scale into every vertex, then refreshes Center and Bounds. No-op when Scale is the identity. */
void ApplyScale(const FVector& Scale);

/** Recomputes Center as the mean of Vertices and Bounds as the AABB enclosing them. */
void CalculateCenterAndBounds();

/** Creates an FDynamicMesh3 copy suitable for use with UE's dynamic mesh processing APIs. */
FDynamicMesh3 CreateDynamicMesh(bool bProcessMesh = false) const;
```

`CreateDynamicMesh` no longer crashes on non-triangle-based meshes — it now returns a default `FDynamicMesh3` and logs an error instead. Run `ConvertToTriangles()` first if you need the conversion to succeed.

### Topology Edits

```cpp
/**
 * Inserts a new vertex at the midpoint of the edge between VertexAIndex and VertexBIndex and
 * splices it into every Loop and FaceLoop that owns that edge. Both sides of a shared edge are
 * updated together, which keeps the result T-junction free on a closed mesh.
 * @return Index of the newly inserted midpoint vertex, or INDEX_NONE when an endpoint index is
 *         invalid, the two indices are equal, or no loop/face references the edge.
 */
int32 SplitEdge(int32 VertexAIndex, int32 VertexBIndex);
```

A triangle that owned the edge becomes a quad after the insert and is immediately fan-triangulated from the midpoint, producing the natural geometric split so `Loops` stays triangulated. Non-triangulated loops are spliced but not re-triangulated — call `ConvertToTriangles()` if the caller relies on that invariant. Edge direction is order-agnostic: A→B and B→A both match.

`SplitEdge` clears `bIsChaosGenerated` (the chaos provenance no longer applies after a topology change) and runs `CalculateCenterAndBounds()` and `Validate()` so the cached flags reflect the new state.

### Equality

```cpp
/**
 * Deep equality comparison: vertices, loops, face loops, center, bounds, and the cached validation flags.
 * Two meshes with identical geometry but different cached flags will compare not-equal — call Validate()
 * on both sides first if that matters.
 */
bool operator==(const FNRawMesh& Other) const;
bool operator!=(const FNRawMesh& Other) const;
```

## See Also

- [Raw Mesh Loop](raw-mesh-loop.md) — ordered index list referencing this mesh's vertices.
- [Raw Mesh Factory](raw-mesh-factory.md) — builds raw meshes from collision and rendering primitives.
- [Raw Mesh Utils](raw-mesh-utils.md) — intersection, containment, and convex-hull helpers.
