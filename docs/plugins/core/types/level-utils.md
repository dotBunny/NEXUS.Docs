---
sidebar_class_name: type native-class
description: A collection of native utility methods for working with levels and level instances.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Level Utils

<TypeDetails icon="native-class" base="class" type="FNLevelUtils" typeExtra="" headerFile="NexusCore/Public/NLevelUtils.h" />

A collection of native utility methods for working with levels and level instances. These helpers are only accessible from C++ code; for Blueprint-callable equivalents see [Level Library](level-library.md).

## Methods

### Get Actor Level Instance

Walk up the attachment hierarchy of the supplied actor to find its owning level instance.

```cpp
/**
 * Walk up the attachment hierarchy of the supplied actor to find its owning level instance.
 * @param Actor The actor to trace back to a level instance.
 * @return The level instance the actor belongs to, or nullptr if the actor is not owned by one.
 */
static ILevelInstanceInterface* GetActorLevelInstance(const AActor* Actor);
```

### Get Actor Component Level Instance

Convenience accessor that resolves the owning level instance via the component's owning actor.

```cpp
/**
 * Convenience accessor that resolves the owning level instance via the component's owning actor.
 * @param ActorComponent The component whose owner's level instance should be returned.
 * @return The level instance the component's owner belongs to, or nullptr if there isn't one.
 */
FORCEINLINE static ILevelInstanceInterface* GetActorComponentLevelInstance(const UActorComponent* ActorComponent);
```

### Get All Map Names

Enumerates all known map package names reachable from the supplied search paths.

```cpp
/**
 * Enumerates all known map package names reachable from the supplied search paths.
 * @param SearchPaths A list of content-root relative paths (e.g. "/Game/Maps") to scan for maps.
 * @return An array of package names of all maps found underneath the search paths.
 */
static TArray<FString> GetAllMapNames(TArray<FString> SearchPaths);
```

### Determine Level Bounds

Calculates an axis-aligned bounding box that encompasses all relevant actors in a level.

```cpp
/**
 * Calculates an axis-aligned bounding box that encompasses all relevant actors in a level.
 * @param InLevel The level whose contents should be considered.
 * @param OutBounds The calculated bounds; reset on entry and grown by each included actor.
 * @param OutIgnoredActors Populated with the actors that were skipped during the calculation. Prefill it to
 *        exclude actors the caller has already ruled out.
 * @param Filter Criteria deciding which actors contribute (see FNLevelBoundsFilter).
 */
static void DetermineLevelBounds(ULevel* InLevel, FBox& OutBounds, TArray<const AActor*>& OutIgnoredActors,
  const FNLevelBoundsFilter& Filter);
```

`OutIgnoredActors` is an in/out parameter rather than purely a report: **prefill it** to exclude actors the caller has already ruled out for reasons this function knows nothing about.

#### FNLevelBoundsFilter

The criteria used to be four trailing parameters; they are now one struct, which is what let the terrain flag be added without another positional `bool`.

| Field | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `ActorIgnoreTags` | `TArray<FName>` | Any actor carrying one of these tags is ignored. | *(empty)* |
| `bIncludeEditorOnly` | `bool` | Editor-only actors contribute to the bounds. | `false` |
| `bIncludeNonColliding` | `bool` | Actors without collision also contribute. | `false` |
| `bIncludeTransientActors` | `bool` | Transient actors also contribute. | `false` |
| `bIncludeLandscapes` | `bool` | Landscape actors contribute. | `false` |
| `bIncludeMeshTerrains` | `bool` | Mesh Terrain sections contribute, **even though they are transient**. | `false` |
| `bIncludeFoliage` | `bool` | Foliage actors contribute. | `false` |

Transient actors are excluded by default — flip `bIncludeTransientActors` to `true` only when you specifically need throwaway/runtime-only actors (e.g. debug markers) to influence the resulting bounds.

The two terrain flags are separate because only one of them is about transience. A landscape is an **ordinary saved actor**, so `bIncludeLandscapes` buys no exemption — it is purely whether landscape geometry counts. `bIncludeMeshTerrains` is the one that is deliberately **narrower** than `bIncludeTransientActors`: Mesh Partition represents an authored terrain in the editor as transient `APreviewSection` actors, so a level whose floor is a Mesh Terrain produces bounds that omit it entirely unless something admits them — and admitting *every* transient actor to get the floor back is far too broad.

Both are classified by [FNActorUtils](actor-utils.md#terrain-classification).

`bIncludeFoliage` follows the landscape pattern rather than the terrain one: a flag, not an exemption. Foliage is scenery in nearly every case, but a level whose only occupants are trees still has bounds worth measuring, so the answer is the caller's. **PCG partition containers get no such flag** — this filter drops them outright, because a container the generator rewrites has no stable bounds to contribute in the first place. See [Foliage And Generated Containers](actor-utils.md#foliage-and-generated-containers).

Note that landscape grass is **not** foliage under this flag; it belongs to its landscape and answers to `bIncludeLandscapes`.
