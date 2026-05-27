---
sidebar_position: 48
sidebar_label: Raw Mesh Utils
sidebar_class_name: type native-class
description: Intersection, containment, and convex-hull helpers for FNRawMesh geometry.
tags: [0.2.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh Utils

<TypeDetails icon="native-class" base="class" type="FNRawMeshUtils" typeExtra="" headerFile="NexusCore/Public/Types/NRawMeshUtils.h" />

Intersection, containment, penetration-depth, and convex-hull helpers for [`Raw Mesh`](raw-mesh.md) geometry.

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

Tests whether two raw meshes intersect when placed at the given origins and rotations. Uses a transformed-AABB early-out, then a triangle-vs-triangle sweep, then a containment fallback so a fully-enclosed mesh is still reported as intersecting. Convex inputs use a face-plane containment test; non-convex inputs fall back to an odd-parity ray cast (see [Is Relative Point Inside](#containment-tests)).

Convex-vs-convex pairs with a populated [`FaceLoops`](raw-mesh.md#properties) description take a SAT-rejection fast path before the tri-tri sweep — cheap proof of non-overlap when any face plane separates the two meshes — falling through to the standard sweep when no face normal separates.

```cpp
/**
 * @return true when the transformed meshes overlap.
 * @note Returns false (with a log warning) when either mesh has zero loops, or (with a log error)
 *       when either mesh contains non-triangle loops.
 * @remark Assumes the vertices in the FNRawMesh's are already in position and are not affected
 *         by a Transform's scale.
 * @remark The containment fallback assumes each mesh is a closed manifold. Open / shell meshes
 *         give undefined containment results — surface-crossing detection still works.
 */
static bool DoesIntersect(
  const FNRawMesh& LeftMesh, const FVector& LeftOrigin, const FRotator& LeftRotation,
  const FNRawMesh& RightMesh, const FVector& RightOrigin, const FRotator& RightRotation);
```

### Get Intersect Depth

Measures the maximum penetration depth between two meshes (or between a mesh and a world point) placed at the given origins and rotations. Symmetric vertex-sampling metric — captures both "right poked into left" and "right engulfed a corner of left" with a single value. Convex inputs use a fast face-plane distance metric; non-convex inputs fall back to a parity ray-cast containment probe plus point-to-triangle surface distance.

```cpp
/**
 * Measures the maximum penetration depth between two meshes.
 * @param EarlyExitDepth Optional optimisation hint — when finite, the function may return as soon as it
 *        proves the depth either exceeds or is bounded below this value. The returned value still
 *        produces the correct branch on a >= EarlyExitDepth compare. Default MAX_flt disables shortcuts.
 * @return Deepest measured penetration in mesh units, -1.0 when the AABBs do not overlap (or either
 *         mesh is empty / non-triangle), or 0.0 when AABBs overlap but no vertex of either mesh lies
 *         inside the other.
 */
static float GetIntersectDepth(
  const FNRawMesh& LeftMesh, const FVector& LeftOrigin, const FRotator& LeftRotation,
  const FNRawMesh& RightMesh, const FVector& RightOrigin, const FRotator& RightRotation,
  float EarlyExitDepth = MAX_flt);

/** Mesh-vs-world-point variant of GetIntersectDepth. */
static float GetIntersectDepth(
  const FNRawMesh& LeftMesh, const FVector& LeftOrigin, const FRotator& LeftRotation,
  const FVector& WorldPosition,
  float EarlyExitDepth = MAX_flt);
```

`GetIntersectDepth` is the right tool when iterating many meshes against a threshold ("max allowed penetration of 25 units"). For exact boolean overlap including surface-only crossings without vertex containment, prefer [Does Intersect](#does-intersect).

:::warning[Non-Convex Depth Semantics]

On non-convex meshes "depth" is distance to the nearest triangle surface, not to the AABB. A vertex deep inside a thin arm of the body reports a small depth because a nearby wall is close, even though the AABB extends well past it. This is the correct geometric answer but can surprise callers who expect AABB-relative numbers.

:::

### To Convex Hull

Builds a convex hull from the supplied mesh's vertex cloud using Chaos's hull builder. The source mesh's loop topology is discarded; only its vertices contribute to the hull.

```cpp
/**
 * @return A new convex-hull mesh in the source's local space, triangulated when the builder emits n-gon faces.
 *         When the source is already convex it is returned as-is (with a log warning) and no rebuild is performed.
 *         An empty mesh is returned (with a log warning) when the source has fewer than four vertices or the
 *         builder produces no geometry.
 * @note The result is flagged Chaos-generated and convex; bounds and center are computed directly from the hull output.
 */
static FNRawMesh ToConvexHull(const FNRawMesh& Mesh);
```

### Create Raw Mesh Visualizers

Spawns transient [`Debug Actor`](../developer/debug-actor.md) instances that render the supplied `FNRawMesh` entries in-world for visual diagnostics.

Two output modes are supported:

- **Per-mesh (default)** — one debug actor per entry, each spawned at its matching `Transforms[i]`.
- **Single-actor (`bSingleActor=true`)** — every mesh is merged via [Combine Mesh](#combine-mesh) into a single `FNRawMesh` anchored at the world origin (identity transform), then visualized as one actor.

```cpp
static TArray<ANDebugActor*> CreateRawMeshVisualizers(UWorld* World, const TArray<FNRawMesh>& Meshes,
  const TArray<FTransform>& Transforms, UMaterialInterface* MaterialInterface,
  bool bSingleActor = false, bool bProcessMeshes = false);
```

### Containment Tests

Tests whether `RelativePoint` (or any of `RelativePoints`) lies inside `Mesh` using the mesh's local space. Convex inputs use a half-space test against every triangle plane (`O(faces)` per query). Non-convex inputs fall back to a Möller-Trumbore odd-parity ray cast — the mesh must be a closed manifold for the parity to be meaningful.

```cpp
/** @return true when RelativePoint is inside the mesh volume; false when the mesh contains non-triangle loops or the point is outside. */
static bool IsRelativePointInside(const FNRawMesh& Mesh, const FVector& RelativePoint);

/** Tests whether any of RelativePoints are inside Mesh. Short-circuits on the first hit. */
static bool AnyRelativePointsInside(const FNRawMesh& Mesh, const TArray<FVector>& RelativePoints);
```
