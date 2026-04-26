---
sidebar_position: 48
sidebar_label: Raw Mesh Utils
sidebar_class_name: type native-class
description: Intersection and containment helpers for FNRawMesh geometry.
tags: [0.2.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh Utils

<TypeDetails icon="native-class" base="class" type="FNRawMeshUtils" typeExtra="" headerFile="NexusCore/Public/Types/NRawMeshUtils.h" />

Intersection and containment helpers for [`Raw Mesh`](raw-mesh.md) geometry.

## Methods

### Combine Mesh

Appends `OtherMesh` into `BaseMesh`, re-expressing every `Other` vertex in `BaseMesh`'s local space so the merged geometry preserves the world-space positional relationship between the two inputs. Each `Other` vertex is transformed `Other`-local → world (via `OtherTransform`) → `Base`-local (via `BaseTransform`'s inverse) before being appended. `Other`'s loop indices are then shifted past `BaseMesh`'s existing vertex count and added to `BaseMesh.Loops`.

:::info

`BaseMesh`'s `bIsChaosGenerated` flag is cleared since the merged result is no longer a single cooked Chaos body.

:::

```cpp
static void CombineMesh(const FTransform& BaseTransform, FNRawMesh& BaseMesh,
  const FTransform& OtherTransform, const FNRawMesh& OtherMesh);
```

### Does Intersect

Tests whether two raw meshes intersect when placed at the given origins and rotations. Uses a transformed-AABB early-out, then a triangle-vs-triangle sweep, then a containment fallback so a fully-enclosed convex mesh is still reported as intersecting.

```cpp
/**
 * Tests whether two raw meshes intersect when placed at the given origins and rotations.
 * @return true when the transformed meshes overlap.
 * @note Returns false (with a log warning) when either mesh has zero loops, or (with a log error) when either mesh contains non-triangle loops.
 */
static bool DoesIntersect(
  const FNRawMesh& LeftMesh, const FVector& LeftOrigin, const FRotator& LeftRotation,
  const FNRawMesh& RightMesh, const FVector& RightOrigin, const FRotator& RightRotation);
```

### Create Raw Mesh Visualizers

Spawns transient [`Debug Actor`](../developer/debug-actor.md) instances that render the supplied `FNRawMesh` entries in-world for visual diagnostics.

Two output modes are supported:

- **Per-mesh (default)** — one debug actor per entry, each spawned at its matching `Transforms[i]`.
- **Single-actor (`bSingleActor=true`)** — every mesh is merged via `CombineMesh` into a single `FNRawMesh` anchored at the world origin (identity transform), then visualized as one actor.

```cpp
static TArray<ANDebugActor*> CreateRawMeshVisualizers(UWorld* World, TArray<FNRawMesh>& Meshes,
  const TArray<FTransform>& Transforms, UMaterialInterface* MaterialInterface,
  bool bSingleActor = false, bool bProcessMeshes = false);
```

### Containment Tests

Tests whether `RelativePoint` (or any of `RelativePoints`) lies inside `Mesh` using the mesh's local space. Implemented as a half-space test against every triangle plane — the point must lie on the same side of each plane as the mesh's pre-computed `Center`.

```cpp
/** @return true when RelativePoint is inside the mesh volume; false when the mesh is not convex, contains non-triangle loops, or the point is outside. */
static bool IsRelativePointInside(const FNRawMesh& Mesh, const FVector& RelativePoint);

/** Tests whether any of RelativePoints are inside Mesh. Short-circuits on the first hit. */
static bool AnyRelativePointsInside(const FNRawMesh& Mesh, const TArray<FVector>& RelativePoints);
```
