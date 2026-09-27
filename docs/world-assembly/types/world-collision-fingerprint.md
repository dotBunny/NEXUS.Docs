---
sidebar_class_name: type native-class
description: Decides whether a baked world-collision cache still describes the world, as an order-independent 64-bit summary of everything a gather would read.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Fingerprint

<TypeDetails icon="native-class" base="class" type="FNWorldCollisionFingerprint" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionFingerprint.h" />

Decides whether a baked [world-collision](../world-collision.md) cache still describes the world. A fingerprint is a 64-bit summary of everything a gather would read:

- the region asked for,
- the settings that decide which actors qualify,
- the identity, placement and collision geometry of every actor that passes.

Two gathers that would produce the same meshes produce the same fingerprint, and any change that would produce different meshes changes it. [What Makes A Cache Stale](../world-collision.md#what-makes-a-cache-stale) lists what that means in practice.

- **Order-independent.** Each actor's contribution is combined in a way that doesn't depend on order, because the order a level is walked in differs between the editor that bakes a cache and the game that reads it. A fingerprint that depended on order would mismatch on every run and quietly switch the whole cache off.
- **Game thread only.** It walks live actors and their registered components.
- **Cheap compared with the gather.** It reads transforms and body-setup identity rather than extracting, converting and merging geometry, but it is still O(actors).
- **Records decisions, not tags.** For each component it records whether the gather's ignore list **excludes** it, not which tags it carries. Tools that rewrite component tags every time they run (PCG stamps every component it spawns) would otherwise make a level's fingerprint change every session, and its cache could never validate.

## Computing

```cpp
static uint64 Compute(const UWorld* World, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings, int32* OutContributors = nullptr);

static uint64 ComputeForActors(const TArray<AActor*>& Actors, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings, int32* OutContributors = nullptr);

static uint64 ComputeLandscape(const UWorld* World, const FNWorldAssemblyWorldCollisionSettings& Settings);
```

- **`Compute`** fingerprints what a gather over `Bounds` would see. An empty bounds list means the whole level. It returns `0` for a null world.
- **`ComputeForActors`** does the same for an actor list that has **already** been filtered, so a caller that has just gathered doesn't walk the world twice.
- **`OutContributors`** reports how many actors went into the result. It is worth logging beside a mismatch, because the most common reason two fingerprints of the "same" level differ is that they covered a different number of actors: in World Partition, the walk only sees what is loaded.
- **`ComputeLandscape`** fingerprints the level's landscape section. It is coarser on purpose. Height data isn't available as saved state a packaged build can hash, so it covers the landscape actors' identity, placement and collision-component extents. Sculpting without changing those extents is invisible here. It is caught at author time by the editor's edit-driven dirty flag instead, and author time is the only time a landscape can be sculpted.

## Building Blocks

```cpp
static uint64 HashActor(const AActor* Actor, const TArray<FName>& ComponentIgnoreTags,
	FLayers* OutLayers = nullptr);
static uint64 HashSettings(const FNWorldAssemblyWorldCollisionSettings& Settings);
static bool OverlapsBounds(const AActor* Actor, const TArray<FBoxSphereBounds>& Bounds);
static uint64 HashBounds(const TArray<FBoxSphereBounds>& Bounds);
```

| Function | What It Covers |
| :-- | :-- |
| `HashActor` | One actor: its identity, plus the placement and collision geometry of every primitive the raw-mesh factory would read, including **every instance transform** of an instanced primitive. It covers more than a gather emits: a primitive the gather would skip still contributes the state that caused it to be skipped (its collision setting, and whether the ignore list excludes it), so changing either shows up. `ComponentIgnoreTags` is the gather's component ignore list. |
| `HashSettings` | Only the settings that change **what geometry is gathered**: every `World Collisions` field, including both ignore-tag lists. The `World Collision Cache` settings are left out deliberately, so toggling one never invalidates every cache in the project. |
| `OverlapsBounds` | True when the actor's bounds overlap any entry, or when `Bounds` is empty. It matches the raw-mesh factory's own test exactly (collision-only bounds, including child actors), so the fingerprint covers exactly the actors a gather would read. |
| `HashBounds` | The bounds themselves, so resizing an organ invalidates its cache. |

## Diagnosing A Cache That Won't Validate

```cpp
static void LogLayers(const UWorld* World, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings);
```

A fingerprint is one number, and any change scrambles all of it, so it can tell you *that* something changed but never *what*. `LogLayers` logs the same calculation broken into `FLayers`, a series of steps that each add one more ingredient:

| Layer | Adds |
| :-- | :-- |
| `Identity` | Actor and component names |
| `Bodies` | Each body's cooked-collision ID, trace flag and collision setting |
| `Tags` | Whether each component is excluded by the gather's ignore list |
| `Placement` | Every transform, ignoring order |
| `Transforms` | Every transform in index order. This is the fingerprint itself. |

`FLayers` also reports how many `Primitives` and `Instances` contributed.

A stale cache found during a run logs this automatically, at Warning. Capture it from two sessions and compare: the **first layer that differs** tells you what changed. [When A Cache Never Validates](../world-collision.md#when-a-cache-never-validates) explains how to read each result. `Placement` and `Transforms` are two views of the same data: if `Placement` matches and `Transforms` doesn't, instances were **reordered**, not moved.
