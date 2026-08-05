---
sidebar_class_name: type native-class
description: Static C++ helpers for computing a cell's side-car data, finding cells and organs in a level or world, and the small geometry maths the graph builder relies on.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Utils

<TypeDetails icon="native-class" base="class" type="FNWorldAssemblyUtils" headerFile="NexusWorldAssembly/Public/NWorldAssemblyUtils.h" />

A static, native-only utility class — the C++ counterpart to the Blueprint-facing [World Assembly Library](world-assembly-library.md). It holds three unrelated groups of helpers: the calculators that produce a [Cell](cell.md)'s side-car data, the accessors that find cells and organs in a level or world, and the geometry maths the graph builder and [Debug Draw](world-assembly-debug-draw.md) share.

Not `UCLASS`, not Blueprint-exposed. Everything is `static`.

## Side-Car Calculators

These three produce the derived data a [Cell](cell.md) stores alongside its level — the data the editor recomputes when you re-bake a cell.

```cpp
static FBox CalculatePlayableBounds(ULevel* InLevel, const FNCellBoundsGenerationSettings& Settings);
static FNRawMesh CalculateConvexHull(ULevel* InLevel, const FNCellHullGenerationSettings& Settings);
static FNCellVoxelData CalculateVoxelData(ULevel* InLevel, const FNCellVoxelGenerationSettings& Settings);
```

Each takes the matching generation-settings struct from the cell's root component, so what a bake produces is entirely determined by what is authored on the cell — see [Bounds Settings](cell.md#bounds-settings), [Hull Settings](cell.md#hull-settings), and [Voxel Settings](cell.md#voxel-settings).

## Finding Cells and Organs

Two flavours of each lookup: `…FromLevel` walks a single `ULevel`, `…FromWorld` walks the whole world.

| Function | Returns |
| :-- | :-- |
| `GetCellActorFromLevel` | First [Cell Actor](cell.md#cell-actor) in the level, or `nullptr`. |
| `GetCellActorFromWorld` | First cell actor in the world, or `nullptr`. |
| `GetCellActorCountFromLevel` | Number of cell actors in the level. |
| `GetCellActorCountFromWorld` | Number of cell actors in the world. |
| `GetOrganComponentsFromLevel` | Every [Organ Component](organ-component.md) attached to an actor in the level. |
| `GetOrganVolumesFromLevel` | Every [Organ Volume](organ-volume.md) in the level. |
| `GetOrganVolumesFromWorld` | Every organ volume in the world. |

:::info[Two default arguments worth knowing]

Every `…FromWorld` overload takes `bool bIgnoreInstancedLevels = true`, so by default a world query **skips actors living inside level instances** — the cells a previous generation pass spawned as [Cell Proxies](cell-proxy.md) do not get counted as authored input. Pass `false` when you genuinely want everything, including generated content.

`GetOrganComponentsFromLevel` takes `bool bSorted = true`, and the default is not cosmetic: the graph builder consumes organs in the order this returns them, so a stable sort is what makes generation reproducible. Passing `false` trades determinism for a marginally cheaper query.

:::

## Geometry Helpers

Small `FORCEINLINE` transforms, used constantly enough during placement that the call overhead mattered:

| Function | Purpose |
| :-- | :-- |
| `CreateRotatedBox` | `InBox` rotated and translated by a `FRotator` + `FVector` pair. |
| `OffsetLocation` | `InLocation` rotated then translated. |
| `GetWorldSize2D` | Unit dimensions × per-axis unit size. Two overloads — `FVector2D` and `FVector` unit sizes (the latter uses only XY). |
| `GetSocketPoints2D` | The 2D corner points of a junction socket of the given unit dimensions. |
| `GetCenteredWorldCornerPoints2D` | Four centered world-space corners for a `Width × Height` rectangle, oriented perpendicular to `Axis` (defaults to `ENAxis::Z`). |

### Ray / AABB Intersection

```cpp
/**
 * Axis-aligned box ray intersection detection
 * @remark Slab method (t = (box_coord - ray_origin_coord) / ray_direction_coord)
 */
static bool RayAABBIntersection(const FVector& RayOrigin, const FVector& RayDirection, const FBox& Box, FVector& OutIntersectionPoint);
```

The standard slab method. It returns the **near** hit when the ray origin is outside the box, and the **far** hit when the origin is inside it — so a ray starting within a box still yields an intersection point (its exit) rather than reporting a miss.

:::warning

`RayDirection` is inverted component-wise with **no zero guard**, so any zero component produces an infinity — and if the ray origin also sits exactly on that slab's plane, the resulting `0 * ∞` is `NaN` and the comparisons fail unpredictably. Perfectly axis-aligned rays are the common case here, so nudge the origin off the plane or use a non-degenerate direction; a zero-length direction vector is never safe.

:::

## Voxel Query Points

```cpp
/** Number of sample points emitted by GetVoxelQueryPoints (face + edge + corner neighbours). */
constexpr static size_t VoxelQueryPointCount = 26;

static void GetVoxelQueryPoints(const FVector& WorldCenter, const FVector& VoxelSize, TArray<FVector>& OutPositions);
static void GetVoxelQueryLevelBoundsEndPoints(const FVector& WorldCenter, const FBox& LevelBounds, TArray<FVector>& OutPositions);
```

`GetVoxelQueryPoints` emits the 26 neighbours surrounding a point — 6 faces, 12 edges, 8 corners — which is the full Moore neighbourhood of a voxel excluding the voxel itself. `VoxelQueryPointCount` is exposed so a caller can size its array up front instead of letting `TArray` grow.

`GetVoxelQueryLevelBoundsEndPoints` produces rays outward from a point to the faces of the level bounds, which is how voxelization decides whether a sample sits inside enclosed geometry.

## Junction Conventions

Two helpers that exist to state a convention **in exactly one place** rather than have every call site re-derive it.

### Outward Direction

```cpp
FORCEINLINE static FVector GetJunctionOutwardDirection(const FRotator& Rotation);
FORCEINLINE static FVector GetJunctionOutwardDirection(const FNCellJunctionDetails& Details);
```

The direction a junction **opens onto** — away from the cell that owns it, into the space a mating cell would fill.

A junction's rotation faces *into* its own cell (the socket gizmo's arrow, drawn along the rotation's forward vector, points [inward](junction-component.md#directionality)), so this is simply the **negated forward**. Every consumer that needs "which way is out" goes through here rather than negating at the call site.

### Socket Corner Points

```cpp
static TArray<FVector> GetJunctionWorldCornerPoints(const FVector& Location, const FRotator& Rotation,
	const FIntVector2& Units, const FVector2D& UnitSize);

static TArray<FVector> GetJunctionWorldCornerPoints(const FNCellJunctionDetails& Details, const FVector2D& UnitSize);
```

The four world-space corners of a junction's socket rectangle, in **top-left, bottom-left, bottom-right, top-right** order. `UnitSize` is normally `UNWorldAssemblySettings::SocketSize`.

The rectangle is built in the local XZ plane then yaw-composed into the YZ plane, which leaves the socket normal on the junction's local **+X**. Both [`UNCellJunctionComponent::GetWorldCornerPoints`](junction-component.md) and [`FNWorldAssemblyDebugDraw::DrawSocket`](world-assembly-debug-draw.md) now derive from this rather than each rebuilding it, so the three cannot drift apart.

## Junction Pairing Predicates

Two predicates the [connector pass](../architecture/tasks.md#junction-connecting) gates candidate pairings on. Both operate purely on world-space junction details — no world, no objects, no randomness.

### Inverse Coincidence

```cpp
static bool AreJunctionsInverseCoincident(const FNCellJunctionDetails& A, const FNCellJunctionDetails& B,
	const FVector2D& UnitSize, float Tolerance);
```

Do these two junctions already occupy the **same opening, facing opposite ways**?

This is exactly the geometry the graph builder produces when it mates two cells: it flips the target 180 degrees about the junction's local up axis and places it so the two junction world locations coincide, leaving the two socket rectangles exactly on top of each other with opposed normals.

Two junctions that satisfy this **without being linked** are a mating the builder never made — it only ever grows a *new* cell off an open junction, so a graph that loops back on itself leaves both ends open. That is what [Connect Coincidences](../project-settings.md#coincident-mating) picks up.

:::tip[Why the Test Is on the Rectangles]

Testing the socket **rectangles** rather than the centers and normals alone settles position, facing, roll and socket dimensions in one go.

A rectangle that maps onto another has to share its plane — so a **non-square** socket rolled against its partner is correctly rejected, while a **square** one rolled 90 degrees (a real mating) is not.

:::

`Tolerance` is the maximum world-space distance between two corners that still counts as the same point.

### Connection Angles

```cpp
static bool AreJunctionsWithinConnectionAngles(const FNCellJunctionDetails& A, const FNCellJunctionDetails& B,
	float DefaultMaximumFacingAngle, float DefaultMaximumApproachAngle, float DefaultMaximumElevationDifference);
```

Are these two junctions oriented sensibly enough with respect to each other to be worth connecting?

The graph builder gates the cells it places on `FNRotationConstraints`, but the connector pass runs over cells that are **already down**: nothing is being rotated, so what is left to judge is the world-space relationship between two fixed openings. A pair must clear all three angles:

| Angle | Measured Between |
| :-- | :-- |
| **Facing** | One socket's outward direction and the other's inward. Zero is the head-on pairing the builder makes itself; 180 is two sockets opening away from one another. |
| **Approach** | Each socket's outward direction and the line to its partner, tested at **both** ends. Past 90 degrees the partner sits behind the socket plane, so the route would have to leave the opening and double back around its own cell. |
| **Elevation difference** | How steeply the two face up or down. This is what separates a right-angle corridor bend from a ceiling hatch joined to a wall door — both are 90 degrees of *facing*, but two wall openings differ in elevation by nothing while a hatch and a wall door differ by the full 90. |

The three `Default*` parameters supply the limit for either end that carries no override of its own. Either junction may carry its own via [`FNCellJunctionConnectionConstraints`](cell-junction-connection-constraints.md); where both ends supply one, the **stricter wins**, so an override never loosens what its partner will accept. A limit of `180` opts that test out.

:::note[Coincident Pairs Skip the Approach Test]

Two junctions in the same place have no line between them to measure an approach against, so that test is skipped for them. The pair is then left to be rejected as `Degenerate` by the [solver](junction-connector-solver.md#route-results) — or picked up ahead of it by [inverse matching](#inverse-coincidence), which does not consult this predicate at all.

:::
