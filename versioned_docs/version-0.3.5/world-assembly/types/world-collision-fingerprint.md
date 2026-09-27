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

## Computing

```cpp
static uint64 Compute(const UWorld* World, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings);

static uint64 ComputeForActors(const TArray<AActor*>& Actors, const TArray<FBoxSphereBounds>& Bounds,
	const FNWorldAssemblyWorldCollisionSettings& Settings);

static uint64 ComputeLandscape(const UWorld* World, const FNWorldAssemblyWorldCollisionSettings& Settings);
```

- **`Compute`** fingerprints what a gather over `Bounds` would see. An empty bounds list means the whole level. It returns `0` for a null world.
- **`ComputeForActors`** does the same for an actor list that has **already** been filtered, so a caller that has just gathered doesn't walk the world twice.
- **Only loaded actors count.** In a World Partition level the walk only sees the regions and data layers that are loaded, so a bake and a run with different regions loaded produce different fingerprints.
- **`ComputeLandscape`** fingerprints the level's landscape section. It is coarser on purpose. Height data isn't available as saved state a packaged build can hash, so it covers the landscape actors' identity, placement and collision-component extents. Sculpting without changing those extents is invisible here. It is caught at author time by the editor's edit-driven dirty flag instead, and author time is the only time a landscape can be sculpted.

## Building Blocks

```cpp
static uint64 HashActor(const AActor* Actor);
static uint64 HashSettings(const FNWorldAssemblyWorldCollisionSettings& Settings);
static bool OverlapsBounds(const AActor* Actor, const TArray<FBoxSphereBounds>& Bounds);
static uint64 HashBounds(const TArray<FBoxSphereBounds>& Bounds);
```

| Function | What It Covers |
| :-- | :-- |
| `HashActor` | One actor: its identity, plus each primitive's name, cooked-collision ID, trace flag, collision setting and placement, including **every instance transform** of an instanced primitive. |
| `HashSettings` | Only the settings that change **what geometry is gathered**: every `World Collisions` field, with `Actor Ignore Tags` hashed regardless of order. The `World Collision Cache` settings are left out deliberately, so toggling one never invalidates every cache in the project. |
| `OverlapsBounds` | True when the actor's bounds overlap any entry, or when `Bounds` is empty. It matches the raw-mesh factory's own test exactly (collision-only bounds, including child actors), so the fingerprint covers exactly the actors a gather would read. |
| `HashBounds` | The bounds themselves, so resizing an organ invalidates its cache. |

## Diagnosing A Cache That Won't Validate

A stale cache found during a run logs both values to `LogNexusWorldAssembly`: `Organ '…' world collision cache is stale (baked …, world is …); gathering fresh for it.` A fingerprint is one number, so it can tell you *that* something changed but not *what*. See [When A Cache Never Validates](../world-collision.md#when-a-cache-never-validates) for the usual causes. 0.4.0 adds an actor count to this message, and a layer-by-layer breakdown that identifies which ingredient changed.
