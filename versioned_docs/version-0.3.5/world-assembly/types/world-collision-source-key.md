---
sidebar_class_name: type native-class
description: Durable identity for one piece of world-collision geometry, plus the stable hash primitives the collision cache shares.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Source Key

<TypeDetails icon="native-class" base="class" type="FNWorldCollisionSourceKey" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionSourceKey.h" />

A stable identity for one piece of [world collision](../world-collision.md): a single mesh produced by `FNRawMeshFactory::FromActorsInBounds`. A later gather produces the same key for the same geometry, whether it runs in another editor session or in a packaged build. That is what lets the [pool](world-collision-pool.md) store each element once, and lets an [organ](organ-collision-cache.md) refer to its elements by key instead of by array index. A key that no longer resolves is a detectable miss. A stale index would silently name whatever now sits in that slot.

A key is built from five values: **level package, actor name, component name, instance index, element ordinal**. All five are saved with the map, so all five are the same after a round trip through disk.

:::info[Keys don't include transforms]

A key only answers *"which element is this"*. Where the element is and what its collision looks like belong to the [fingerprint](world-collision-fingerprint.md), which decides whether a cache is still valid. That separation means moving an actor updates its pool entry instead of orphaning the old one and adding a new one.

:::

## Building Keys

```cpp
static uint64 FromSource(const FNRawMeshSource& Source);
static uint64 FromComponent(const UPrimitiveComponent* Component, int32 InstanceIndex, int32 ElementOrdinal);
static uint64 FromActor(const AActor* Actor);
```

- **`FromSource`** keys a mesh the raw-mesh factory just emitted, from its matching source record. It returns `0` when the record names no component.
- **`FromComponent`** keys one element of one primitive. Pass `INDEX_NONE` as the instance for a primitive that isn't instanced.
- **`FromActor`** is the part of a key identifying its actor: the **level's** package plus the actor's name. It uses the level's package, not the actor's own, so an actor saved to its own external package by World Partition gets the same key as one saved inside the level. A runtime-spawned actor gets a generated name and so correctly matches nothing that was baked.

## Hash Primitives

Shared by everything in the collision cache that needs a hash to be the same across sessions and platforms:

```cpp
static uint64 Mix(uint64 Value);
static uint64 Combine(uint64 Seed, uint64 Value);
static uint64 HashName(const FName& Name);
static uint64 HashString(const FString& Value);
static uint64 HashGuid(const FGuid& Guid);
static uint64 HashTransform(const FTransform& Transform);
static uint64 HashVector(const FVector& Vector);
```

| Function | Notes |
| :-- | :-- |
| `Mix` | A splitmix64 finalizer, so near-identical inputs end up far apart. |
| `Combine` | Combines values **in order**. Use it for building a key step by step, never for set membership, which needs an order-independent fold. |
| `HashName` | Hashes the name's **text**. An `FName`'s comparison index is assigned per session, so it would differ between the editor that baked a cache and the game that reads it. |
| `HashString` | Hashes the UTF-8 encoding, so the result is the same on every platform. |
| `HashTransform` / `HashVector` | Rounded to a fixed precision so floating-point noise doesn't count as a change: positions to 0.01 cm (`LocationQuantum`), rotation and scale components to 1/10000 (`RotationQuantum`, `ScaleQuantum`). A value sitting exactly on a rounding boundary can hash either way between runs. The worst that causes is a spurious miss and a fresh gather, never a wrongly accepted cache. |

The precision constants live in `NEXUS::WorldAssembly::CollisionKey`.
