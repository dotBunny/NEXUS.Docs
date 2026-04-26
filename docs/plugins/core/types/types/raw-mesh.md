---
sidebar_position: 45
sidebar_label: Raw Mesh
sidebar_class_name: type native-struct
description: Lightweight CPU-side mesh representation used by ProcGen and blockout tools.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh

<TypeDetails icon="native-struct" base="struct" type="FNRawMesh" typeExtra="" headerFile="NexusCore/Public/Types/NRawMesh.h" />

Lightweight CPU-side mesh representation used by [ProcGen](../../../procedural-generation/index.mdx) and [Blockout](../../../blockout/index.mdx) tools. Stores a shared vertex buffer plus one or more ordered loops that reference into it. Supports convexity / non-tri validation, rigid-body rotation around a pivot, and conversion into Unreal Engine's `FDynamicMesh3` for richer geometry work.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Vertices` | `TArray<FVector>` | The vertices of the mesh. |
| `Center` | `FVector` | The relative center of the mesh. |
| `Bounds` | `FBox` | Relative AABB. |
| `Loops` | `TArray<`[`FNRawMeshLoop`](raw-mesh-loop.md)`>` | Ordered shape-edge definitions. The indices are ordered (1/2/3 for a triangle) and not looped — you must close the loop yourself if line-drawing. |

## Methods

### Indices

```cpp
/** Flattens Loops into a single contiguous index buffer. */
TArray<int32> GetFlatIndices();

/** Re-triangulates non-triangular loops in place so every loop is a 3-vertex triangle. */
void ConvertToTriangles();
```

### Validation

```cpp
/** Whether the mesh has been validated as convex. */
bool IsConvex() const;

/** Whether the mesh has an AABB set. */
bool HasBounds() const;

/** Whether any loop in the mesh has more than three vertices. */
bool HasNonTris() const;

/** Re-evaluates convex / non-triangle flags from the current vertex and loop data. */
void Validate();
```

### Geometry

```cpp
/** Rotates every vertex and the center around a world-space pivot. */
void RotatedAroundPivot(const FVector& WorldPoint, const FRotator& Rotation);

/** Recomputes Center as the mean of Vertices and Bounds as the AABB enclosing them. */
void CalculateCenterAndBounds();

/** Creates an FDynamicMesh3 copy suitable for use with UE's dynamic mesh processing APIs. */
FDynamicMesh3 CreateDynamicMesh(bool bProcessMesh = false);
```

### Equality

```cpp
/** Deep equality comparison (vertices, loops, validation flags and center). */
bool IsEqual(const FNRawMesh& Other) const;
```

## See Also

- [Raw Mesh Loop](raw-mesh-loop.md) — ordered index list referencing this mesh's vertices.
- [Raw Mesh Factory](raw-mesh-factory.md) — builds raw meshes from collision and rendering primitives.
- [Raw Mesh Utils](raw-mesh-utils.md) — intersection and containment helpers.
