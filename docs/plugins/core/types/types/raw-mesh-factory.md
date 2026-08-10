---
sidebar_class_name: type native-class
description: Builds FNRawMesh instances from Unreal's collision and rendering primitives.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Raw Mesh Factory

<TypeDetails icon="native-class" base="class" type="FNRawMeshFactory" typeExtra="" headerFile="NexusCore/Public/Types/NRawMeshFactory.h" />

Builds [`Raw Mesh`](raw-mesh.md) instances from Unreal's collision and rendering primitives. Each factory method emits mesh-local vertices plus, where applicable, an accompanying element-to-world transform so the caller can place every emitted mesh back in the correct frame. The class is stateless; every method is `static`.

Two distinct routes are exposed for complex-as-simple bodies — `FromStaticMesh` (route 1, render-data) and `FromChaosBodySetup` (route 2, cooked Chaos tri meshes).

## Methods

### From Actors In Bounds

Walks each supplied actor's registered `UPrimitiveComponents` and extracts their simple-collision representation as `FNRawMesh` entries, along with parallel world-space transforms.

- Only actors whose world-space bounds **intersect** at least one of the supplied `ContainingBounds` are processed. Passing an empty array skips the overlap test entirely.
- Aggregate-geometry path covers `FKConvexElem`, `FKBoxElem`, `FKSphereElem`, and `FKSphylElem` (capsule).
- Complex-as-simple falls back to the source static-mesh render data (route 1) or Chaos `TriMeshGeometries` (route 2).
- A body that emits **no simple geometry** falls back to its complex tri mesh, so a mesh whose only collision is the complex one — the default for a sculpted or imported asset — is not silently skipped.
- `UInstancedStaticMeshComponent` emits one `FNRawMesh` entry per instance.
- Landscape-based primitives are skipped; [From Landscape](#from-landscape) is the way to obtain their surface.

```cpp
static void FromActorsInBounds(const TArray<AActor*>& Actors, const TArray<FBoxSphereBounds>& ContainingBounds,
  TArray<FNRawMesh>& OutMeshes, TArray<FTransform>& OutTransforms);
```

### Per-Element Emitters

Each emits a single collision element as a mesh-local `FNRawMesh` plus the world transform required to place it.

```cpp
/** 8-vertex / 12-triangle box from FKBoxElem. */
static bool FromChaosBox(const FKBoxElem& Box, const FTransform& CompToWorld, FNRawMesh& OutMesh, FTransform& OutTransform);

/** Convex hull from cooked FKConvexElem VertexData/IndexData. Caller must combine FKConvexElem::GetTransform() with component-to-world. */
static bool FromChaosConvexHull(const FKConvexElem& ConvexHull, FNRawMesh& OutMesh);

/** UV sphere tessellation from FKSphereElem. */
static bool FromChaosSphere(const FKSphereElem& Sphere, const FTransform& CompToWorld, FNRawMesh& OutMesh, FTransform& OutTransform);

/** Capsule (cylindrical band + hemispherical caps) from FKSphylElem. */
static bool FromChaosSphyl(const FKSphylElem& Sphyl, const FTransform& CompToWorld, FNRawMesh& OutMesh, FTransform& OutTransform);
```

### Complex-As-Simple

```cpp
/** Reads triangles directly from a Chaos triangle-mesh implicit object. */
static bool FromChaosTriMeshes(const Chaos::FTriangleMeshImplicitObjectPtr& TriMesh, FNRawMesh& OutMesh);

/** Route 2: reads triangles from UBodySetup::TriMeshGeometries. */
static bool FromChaosBodySetup(const UBodySetup* Body, const FTransform& ToWorld,
  TArray<FNRawMesh>& OutMeshes, TArray<FTransform>& OutTransforms);

/** Route 1: pulls LOD 0 positions and indices directly from a UStaticMesh's render data. */
static bool FromStaticMesh(const UStaticMesh* StaticMesh, FNRawMesh& OutMesh);
```

:::info

Caller must ensure the body setup's physics meshes have been built (`UBodySetup::CreatePhysicsMeshes`) before invoking `FromChaosBodySetup`.

:::

## Landscape

Landscape is the one terrain [From Actors In Bounds](#from-actors-in-bounds) cannot read. Its collision is a Chaos heightfield behind **no `UBodySetup`**, so the factory skips landscape primitives outright and anything built from it sees a hole where the ground is.

These two reconstruct a usable surface by **tracing down onto it**, without taking a Landscape module dependency. Sampling suits the shape: a heightfield is single-valued in Z, so one downward trace per grid point misses nothing.

### From Landscape

```cpp
/**
 * Sample a landscape's surface into a triangulated grid mesh, by tracing down onto it.
 * @param LandscapeActor Landscape to sample. Its own bounds set the sampled area unless SampleBounds narrows it.
 * @param GridSize Spacing between samples, in world units. Values at or below zero sample nothing.
 * @param OutMesh Destination, in world space — the caller pairs it with an identity transform.
 * @param SampleBounds Optional region of interest, clipping the sampled area in XY. Pass an invalid box (the
 *        default) to sample the whole landscape.
 * @return true when at least one triangle was produced.
 */
static bool FromLandscape(const AActor* LandscapeActor, double GridSize, FNRawMesh& OutMesh,
  const FBox& SampleBounds = FBox(ForceInit));
```

`SampleBounds` is worth supplying whenever the caller is already gathering against a region: a landscape spans the level, so the unclipped cost is set by the landscape's size rather than by how much of it the caller cares about.

It clips in **XY only**. The traces still span the landscape's own vertical extent, because the ground beneath a region of interest routinely sits below the box describing it, and a trace clipped to that box would report a hole where there is solid ground.

The result is approximate by construction: the surface is reproduced to within `GridSize`, and a sample that hits nothing — a hole in the landscape — drops the quads around it rather than guessing at them.

### From Landscapes In Bounds

```cpp
/**
 * Sample every landscape among a set of actors, as the landscape counterpart to FromActorsInBounds.
 * @param Actors Candidate actors; anything FNActorUtils::IsLandscapeActor rejects is skipped.
 * @param ContainingBounds Regions of interest, narrowing the sampled area. Skipped when empty, as in FromActorsInBounds.
 * @param GridSize Spacing between samples, in world units. Values at or below zero emit nothing.
 * @param OutMeshes Each sampled surface, in world space, appended to the array.
 * @param OutTransforms Matching transform per entry — always identity, since the samples are already placed.
 */
static void FromLandscapesInBounds(const TArray<AActor*>& Actors, const TArray<FBoxSphereBounds>& ContainingBounds,
  double GridSize, TArray<FNRawMesh>& OutMeshes, TArray<FTransform>& OutTransforms);
```

The two entry points are **complements over the same actor list**, and a caller wanting all of a level's geometry runs both: `FromActorsInBounds` covers everything a `UBodySetup` can describe, this covers the one terrain that has none.

The sampled area is the **union** of `ContainingBounds`, not one pass per entry — regions routinely overlap, and a pass each would emit the shared ground once per overlap for the caller to carry.

:::warning[Game Thread Only]

Both trace the live physics scene, so they must run on the game thread and yield nothing where none is initialized. That is why they are separate entry points rather than a branch inside `FromActorsInBounds`, which carries no such constraint.

:::

:::note[Single-Valued Surfaces Only]

One downward trace per grid point keeps the first hit belonging to the actor, so a surface folding back over itself — an overhang, a cave roof, the underside of a closed shape — contributes only its **topmost face**.

That is not a limitation for landscape, which is a heightfield and cannot be authored any other way, and it is why these are named for landscape rather than for terrain. Terrain that *can* be two-sided — a Mesh Partition sphere — has a `UBodySetup` and belongs in [From Actors In Bounds](#from-actors-in-bounds), which reads its cooked triangles whole and makes no assumption about topology.

:::

The World Assembly world-collision cache is the caller these exist for; see [Landscape Is Sampled Rather Than Read](../../../world-assembly/project-settings.md#landscape-is-sampled-rather-than-read).
