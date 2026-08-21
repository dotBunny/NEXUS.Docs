---
sidebar_class_name: type native-class
description: A collection of utility methods for working with actors, accessible from C++ only.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Actor Utils

<TypeDetails icon="native-class" base="class" type="FNActorUtils" typeExtra="" headerFile="NexusCore/Public/NActorUtils.h" />

A collection of utility methods for working with actors. These helpers are only accessible from C++ code; for Blueprint-callable equivalents see [Actor Library](actor-library.md).

## Filter Settings

`FNWorldActorFilterSettings` configures actor collection in [`GetWorldActors`](#get-world-actors).

```cpp
/**
 * Filter criteria consumed by FNActorUtils::GetWorldActors when collecting actors from a UWorld.
 */
struct NEXUSCORE_API FNWorldActorFilterSettings
{
  /** When true, actors flagged as editor-only (AActor::IsEditorOnly) are skipped during iteration. */
  bool bExcludeEditorOnly = true;

  /** When true, actors whose AActor::GetActorEnableCollision() returns false are skipped. */
  bool bExcludeNonCollisionEnabledActors = false;

  /**
   * When true, Mesh Terrain sections are skipped.
   * @note Matched on the actor rather than only its primitives, so a section still awaiting the collision component
   *       Mesh Partition attaches in a later pass is excluded too — see FNActorUtils::IsMeshTerrainActor.
   */
  bool bExcludeMeshTerrains = false;

  /**
   * When true, landscape actors are skipped.
   * @remark Callers that sample a landscape rather than read it (FNRawMeshFactory::FromLandscapesInBounds) need the
   *         actor to survive this filter in order to find it at all, so leave this false whenever that pass will run.
   */
  bool bExcludeLandscapes = false;

  /**
   * When true, terrain authoring apparatus is skipped — the definitions and modifiers describing how a terrain is
   * built, rather than the terrain itself.
   * @note Deliberately independent of bExcludeMeshTerrains. A modifier's bounds are its region of influence, which
   *       reaches far past the surface it produces, so it is not geometry under either answer to that flag.
   */
  bool bExcludeTerrainAuthoring = false;

  /** When true, AVolume actors are skipped. */
  bool bExcludeVolumes = false;

  /** When true, ANDebugActor actors are skipped. */
  bool bExcludeDebugActors = false;

  /**
   * When true, APlayerStart actors are unconditionally included — they bypass the editor-only, collision, and predicate
   * filters. Useful when callers need spawn locations even though the player-start actor would otherwise be filtered out.
   */
  bool bIncludePlayerStarts = false;

  /** Any actor carrying one of these tags is skipped. */
  TArray<FName> WorldCollisionActorIgnoreTags;

  /**
   * Optional caller-supplied predicate evaluated per actor. Return true to keep the actor, false to exclude it.
   * @note Owned by value, so safe to assign a temporary lambda. Leave default-constructed (empty) to skip the predicate check entirely.
   */
  TFunction<bool(const AActor*)> ExclusionFunction;
};
```

### The Exclusion Flags

Every `bExclude…` flag is a plain skip, and they compose — an actor has to survive all of them. Two are less obvious than they look.

**`bExcludeLandscapes` is not "should landscape count".** It removes the actor from the result, and a caller that *samples* a landscape rather than reading it — [`FNRawMeshFactory::FromLandscapesInBounds`](types/raw-mesh-factory.md#from-landscape) — has to find the actor in order to sample it. Leave it `false` whenever a sampling pass will run, and refuse the geometry at the gather site instead. This is exactly what World Assembly's [`Include Landscapes`](../../world-assembly/project-settings.md#terrain-is-opt-in) does, and it is why that flag behaves differently from its Mesh Terrain neighbour, which *is* enforced here.

**`bExcludeTerrainAuthoring` is independent of `bExcludeMeshTerrains`,** deliberately. Authoring apparatus is not geometry under either answer to that flag — see [Terrain Authoring Apparatus](#terrain-authoring-apparatus) for why a modifier's bounds make it actively harmful to include.

`bExcludeMeshTerrains` matches on the **actor**, not merely its primitives, so a section still waiting on the collision component Mesh Partition attaches in a later pass is excluded too. Matching on primitives alone would let a half-built section through.

`WorldCollisionActorIgnoreTags` is a tag denylist applied on top of everything above; an actor carrying any of them is skipped.

## Methods

### Get Root Component From Default Object

Find the `RootComponent` (`USceneComponent`) on a default object.

```cpp
/**
  * Find the RootComponent (USceneComponent) on a Default Object.
  * @param ActorClass The target class to search for the root component.
  * @return The root USceneComponent of the specified Actor class, or nullptr if none is found.
  * @note This has a flaw when navigating through the CDO of a Blueprint-generated class. The first found USceneComponent
  *		 will be treated as the root component. When combined with the NActorPool system, that found components scale
  *		 is then used as the base scale for the actor. The point here is to do your actor-wide scaling on the root
  *		 component.
  * 
  * @details For Blueprint-generated classes, this function attempts to find the first USceneComponent in the
  *          SimpleConstructionScript hierarchy. If the class is not Blueprint-generated or no USceneComponent
  *          is found in the SCS, it falls back to the default object's root component.
  */
static USceneComponent* GetRootComponentFromDefaultObject(const TSubclassOf<AActor>& ActorClass);
```

### Get World Actors

Collect every actor in a world that satisfies the supplied filter settings. Null and pending-kill actors are always skipped.

```cpp
/**
 * Collect every actor in the supplied world that satisfies the provided filter settings.
 * @param World The world to iterate. A null world yields an empty array.
 * @param Settings Filter criteria applied to each candidate actor (see FNWorldActorFilterSettings).
 * @return The set of actors that survived all filtering checks, in iteration order.
 * @note Null and pending-kill actors are always skipped. APlayerStart actors are short-circuited into the result when
 *       bIncludePlayerStarts is set, bypassing every other filter. Otherwise, an actor is kept only when it passes
 *       every bExclude flag the settings raise and (when set) the ExclusionFunction predicate.
 */
static TArray<AActor*> GetWorldActors(const UWorld* World, const FNWorldActorFilterSettings& Settings);
```

## Testing A Single Actor

`GetWorldActors` applies its filter while walking the world. To ask the same question about one actor you already hold — without gathering a whole array — use the predicate directly:

```cpp
/**
 * Tests a single actor against the same rules GetWorldActors applies.
 * @return true if the actor would be kept by GetWorldActors under these settings.
 */
static bool PassesFilter(const AActor* Actor, const FNWorldActorFilterSettings& Settings);
```

The two share one implementation, so a `true` here guarantees the actor appears in the corresponding `GetWorldActors` result. Two behaviours are worth knowing:

- A null or pending-kill actor (anything failing `IsValid`) returns `false` rather than asserting.
- An `APlayerStart` **short-circuits to `true`** when `bIncludePlayerStarts` is set, bypassing every other filter — including the editor-only and collision checks and any `ExclusionFunction`. That matches `GetWorldActors` exactly, but it does mean a player start can pass a filter that would otherwise reject it.

## Terrain Classification

A second, separate family: not "does this actor pass a filter", but "what *kind* of thing is this". Terrain needs asking about specially because the ordinary filters get it wrong in both directions — a terrain's geometry is dropped when it should be kept, and its authoring apparatus is kept when it should be dropped.

### Terrain

```cpp
/**
 * Identify a primitive that carries terrain geometry — a landscape component, or a Mesh Partition section's
 * collision component.
 */
static bool IsTerrainPrimitive(const UPrimitiveComponent* Primitive);

/**
 * Identify an actor that carries terrain geometry, by inspecting the primitives it owns.
 * @return true when any primitive the actor owns satisfies IsTerrainPrimitive.
 */
static bool IsTerrainActor(const AActor* Actor);
```

This exists so bounds and hull generation can **admit** terrain their ordinary filters would drop. Mesh Partition represents an authored terrain in the editor as transient `APreviewSection` actors, and a blanket transient skip would silently omit a cell's entire floor.

### Terrain Authoring Apparatus

```cpp
/**
 * Identify an actor that describes how a terrain is built rather than being terrain itself — a Mesh Partition
 * definition, or one of the modifiers that sculpt it.
 */
static bool IsTerrainAuthoringActor(const AActor* Actor);
```

The opposite job: these must **never** contribute to a bounds or hull calculation, at any setting. A modifier's bounds are its *region of influence*, which reaches far past the surface it produces — measured against a real level, a single modifier's box was larger than every piece of geometry in it put together.

### The Two Halves

`IsTerrainActor` covers both representations. Callers that need to admit one **without** the other ask for it by name:

```cpp
/**
 * Identify an actor whose terrain is a landscape.
 * @return true when the actor owns a landscape primitive.
 */
static bool IsLandscapeActor(const AActor* Actor);

/**
 * Identify an actor whose terrain is a Mesh Terrain section.
 * @return true when the actor is a built terrain section, or owns a Mesh Terrain collision primitive.
 */
static bool IsMeshTerrainActor(const AActor* Actor);
```

They are worth telling apart because the two are refused for **different reasons**:

| | Landscape | Mesh Terrain |
| :-- | :-- | :-- |
| In the level | An ordinary **saved** actor. | **Transient** actors, respawned on every build. |
| What admitting it buys | Only that its geometry counts. | A **transient exemption** the ordinary filters would otherwise deny. |
| How its surface is read | Sampled — see below. | Read directly; it has a real `UBodySetup`. |

Landscape geometry **cannot be extracted the way every other terrain can**: its collision is a Chaos heightfield reached through no `UBodySetup`, so there is nothing for [FNRawMeshFactory](types/raw-mesh-factory.md) to read and it skips landscape primitives outright. Callers that need the surface have to sample it — see [From Landscape](types/raw-mesh-factory.md#from-landscape).

That split is why consumers carry a flag each rather than one "include terrain": [FNLevelBoundsFilter](level-utils.md#fnlevelboundsfilter), and the cell [bounds, hull and voxel settings](../../world-assembly/types/cell.md#terrain-is-two-flags).

### Matched On Class Name

Every classifier above resolves through a string-matching layer, exposed in its own right:

```cpp
static bool IsTerrainPrimitiveClassName(const FString& ClassName);
static bool IsTerrainSectionClassName(const FString& ClassName);
static bool IsTerrainAuthoringClassName(const FString& ClassName);
static bool IsLandscapeClassName(const FString& ClassName);
static bool IsMeshTerrainPrimitiveClassName(const FString& ClassName);
```

`IsTerrainPrimitiveClassName` is the union of the last two — the landscape half has always been separable, and `IsMeshTerrainPrimitiveClassName` is the other half.

Class names rather than types, so `NexusCore` takes **no dependency on the Landscape module**, nor on MeshPartition — an experimental engine plugin that may not be enabled at all.

The string form is public for two reasons. It lets the matching be tested without the plugins that define these types, and it makes an engine upgrade that renames one of them fail a test rather than silently classifying a level's entire floor as ordinary geometry. Epic has renamed this family once already — MegaMesh to MeshPartition — which is precisely the event this guards.

`IsTerrainSectionClassName` matches **exactly**, and the interactive section is deliberately not one of its matches: it is a working copy of whatever is being sculpted, duplicating geometry a preview section already describes.

## Built Geometry

Two helpers for the placeholder bounds the engine substitutes while a build is in flight.

```cpp
/**
 * Test whether a primitive is reporting real geometry rather than the engine's placeholder bounds.
 * @return false when the component's bounds are the near-zero box the engine substitutes for empty geometry.
 */
static bool HasBuiltGeometry(const UPrimitiveComponent* Primitive);

/**
 * Union of an actor's registered primitive bounds, skipping any primitive still reporting placeholder bounds.
 * @param bIncludeNonColliding When true, primitives with collision disabled also contribute.
 * @return The combined bounds, or an invalid box when nothing qualified.
 */
static FBox GetBuiltComponentsBoundingBox(const AActor* Actor, bool bIncludeNonColliding);
```

A Mesh Partition component returns a deliberately **tiny** box — not an invalid one — while a section has no geometry to describe, either because its build has not finished or because it covers nothing. Both `UMeshPartitionCollisionComponent::CalcBounds` and `UPreviewMeshComponent::CalcBounds` do this, each explaining that an empty box would spam other engine systems.

That is exactly what makes it dangerous. `AActor::GetComponentsBoundingBox` treats the tiny box as a valid point and folds it in, pulling the result out to wherever the empty component happens to sit. `GetBuiltComponentsBoundingBox` differs from it in that one respect and no other.

This pair is what [FNTerrainUtils::ComputeFingerprint](../editor-types/terrain-utils.md#compute-fingerprint) is built on, which is how a terrain build still landing sections is told from a finished one.
