---
sidebar_class_name: type native-class
description: The one place that turns a live world into baked, pooled world-collision hulls — and the one implementation of reading them back.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Baker

<TypeDetails icon="native-class" base="class" type="FNWorldCollisionBaker" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionBaker.h" />

The one place that knows how to turn a live world into the hulls a [world-collision](../world-collision.md) cache holds, and the one implementation of reading them back. It performs the **same gather** as the assembly pipeline:

1. `FNCreateVirtualWorldTask`'s actor filter and raw-mesh extraction.
2. The transform bake, convex conversion and face-plane warm-up that `FNProcessVirtualWorldTask` performs.

It then stores the finished result, so a later read skips both stages. Everything that asks "what will an assembly collide with here?" goes through this class: the assembly run, the editor's [preview](../editor-types/world-collision-preview.md), and the bone readout.

Baking only happens at author time, from the editor mode or a level save. The code still lives in the **runtime** module on purpose: the gather half is also what a cache miss falls back to at runtime. Keeping one definition of "what geometry does this organ see" is what guarantees a cache hit and a cache miss produce the same world.

:::warning[Game thread only]

It walks live actors, traces the physics scene to sample landscape, and in editor builds waits for pending static-mesh compilation to finish. `BakeElement` is the exception; see below.

:::

## Reading The Cache

```cpp
static FPooledCollision ResolvePooled(const UWorld* World, const FNWorldAssemblyWorldCollisionSettings& Settings,
	const TArray<UNOrganComponent*>& Organs, bool bValidate, bool bIncludeLandscape);
```

Returns whatever the level's pool can supply for `Organs`, and what is left over. For each call it checks:

1. **Is there a pool?** No [cache actor](world-collision-cache-actor.md) means nothing resolves.
2. **Was it baked at this world origin?** If not, it is ignored, with a log warning.
3. **Is each organ current?** With `bValidate`, each organ's stored [fingerprint](world-collision-fingerprint.md) is compared with a freshly computed one. Without it, the stored cache is trusted as-is.

A stale organ, or one whose keys the pool no longer holds, is added to `MissedOrgans` with a log warning. A stale organ also triggers [`LogLayers`](world-collision-fingerprint.md#diagnosing-a-cache-that-wont-validate). An element that an earlier organ already resolved is not resolved a second time.

`FPooledCollision` carries:

| Field | Meaning |
| :-- | :-- |
| `Meshes` | Baked world-space hulls, ready to use as they are. |
| `ResolvedKeys` | Keys already supplied, so a follow-up gather can skip emitting them again. |
| `MissedOrgans` | Organs the pool couldn't supply; each still needs a fresh gather. |
| `bPoolUsable` | A cache actor exists and was baked at this world's origin. |
| `bLandscapeResolved` | Landscape was requested and its section was current, or landscape capture is off. |

`IsComplete()` is true when the pool was usable and supplied every organ.

```cpp
static TArray<UNOrganComponent*> GetWorldOrgans(const UWorld* World);
static EOrganBoundsKind GetOrganBounds(const UNOrganComponent* Organ, TArray<FBoxSphereBounds>& OutBounds);
```

`GetOrganBounds` returns one of three answers, because an empty bounds list already means "the whole level" everywhere else:

| `EOrganBoundsKind` | Meaning |
| :-- | :-- |
| `Bounded` | The organ's volume bounds, returned in `OutBounds`. |
| `Unbounded` | The whole level. `OutBounds` is empty, which every gather reads as "no filter". |
| `None` | Nothing at all. A bounded organ with no volume to bound it is left out entirely. Treating it as "whole level" would make a cached run see more geometry than a fresh one. |

## Baking

```cpp
static void BakeElement(FNRawMesh& Mesh, const FTransform& Transform);
```

Turns one gathered element into the form the assembly tests against: world-space, convex, with face planes warmed up. It is the **only** definition of that transformation, and public for that reason. While there were two copies, the editor's collision visualizer quietly drifted: it never made meshes convex, so it drew concave geometry that no part of an assembly respects. **Thread-safe**: it is pure mesh math with no `UObject` access.

```cpp
static bool BakeOrgan(const UWorld* World, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings, FOrganResult& OutResult);
static bool BakeLandscape(const UWorld* World, const FNWorldAssemblyWorldCollisionSettings& Settings,
	FNWorldCollisionPool& Pool);
```

- **`BakeOrgan`** gathers and bakes what one organ sees into an `FOrganResult`: a `Fingerprint`, plus `Keys` and `Meshes` in matching order. It returns `false` only for a null world, and it doesn't include landscape.
- **`BakeLandscape`** samples the whole landscape into the pool's landscape section, with one downward physics trace per sample. It is the expensive one, and the separate level-wide section exists so that every organ doesn't pay for it separately. With landscape capture off, it clears the section instead. It returns whether anything changed.

The following are editor-only (`WITH_EDITOR`):

```cpp
static FBakeResult BakeWorld(UWorld* World, const FNWorldAssemblyWorldCollisionSettings& Settings, bool bForce);
static FBakeResult BakeOrgans(UWorld* World, const TArray<UNOrganComponent*>& Organs,
	const FNWorldAssemblyWorldCollisionSettings& Settings, bool bForce);
```

- **`BakeWorld`** bakes every organ in the level, writes the results into the pool, and drops any element nothing refers to any more.
- **`BakeOrgans`** does the same for a subset. Other organs keep whatever cache they have.
- **Without `bForce`**, organs whose fingerprint still matches are skipped. That is what makes a save-time bake cheap on an untouched level: it costs a fingerprint pass, not a re-gather.
- **Progress and cancelling.** Both show a progress dialog that you can cancel, at one step per organ plus one for landscape.

`FBakeResult` reports what happened:

| Field | Meaning |
| :-- | :-- |
| `OrgansBaked` | Organs whose cache was rewritten. Skipped organs aren't counted. |
| `bChanged` | Something was written, so the level needs saving. |
| `bCancelled` | The user cancelled partway. Organs already baked keep their new cache and the rest keep their old one, so every stored fingerprint still matches what it was baked against. A caller must **not** assume the whole level was checked. |

A level with no organs is left alone. It gets no cache actor, although a level that already has one still has its now-unused elements collected.

```cpp
static FNOnWorldCollisionBaked OnBaked;
```

Editor-only. Broadcast after a bake finishes writing to a world's pool. Anything derived from the pool (the editor's merged preview mesh and its BVH, the cache actor's status line) listens to this rather than each bake site having to invalidate it by hand.
