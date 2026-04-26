---
sidebar_position: 47
sidebar_label: Raw Mesh Factory
sidebar_class_name: type native-class
description: Builds FNRawMesh instances from Unreal's collision and rendering primitives.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh Factory

<TypeDetails icon="native-class" base="class" type="FNRawMeshFactory" typeExtra="" headerFile="NexusCore/Public/Types/NRawMeshFactory.h" />

Builds [`Raw Mesh`](raw-mesh.md) instances from Unreal's collision and rendering primitives. Each factory method emits mesh-local vertices plus, where applicable, an accompanying element-to-world transform so the caller can place every emitted mesh back in the correct frame. The class is stateless; every method is `static`.

Two distinct routes are exposed for complex-as-simple bodies — `FromStaticMesh` (route 1, render-data) and `FromChaosBodySetup` (route 2, cooked Chaos tri meshes).

## Methods

### From Actors In Bounds

Walks each supplied actor's registered `UPrimitiveComponents` and extracts their simple-collision representation as `FNRawMesh` entries, along with parallel world-space transforms.

- Only actors whose world-space bounds are fully contained within at least one of the supplied `ContainingBounds` are processed. Passing an empty array skips the containment test entirely.
- Aggregate-geometry path covers `FKConvexElem`, `FKBoxElem`, `FKSphereElem`, and `FKSphylElem` (capsule).
- Complex-as-simple falls back to the source static-mesh render data (route 1) or Chaos `TriMeshGeometries` (route 2).
- `UInstancedStaticMeshComponent` emits one `FNRawMesh` entry per instance.
- Landscape-based primitives are skipped.

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
