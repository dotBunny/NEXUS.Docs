---
sidebar_class_name: type native-struct
description: A level's baked world-collision geometry, stored once per element and addressed by key.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Pool

<TypeDetails icon="native-struct" base="struct" type="FNWorldCollisionPool" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionPool.h" />

A level's baked [world collision](../world-collision.md), held by its [cache actor](world-collision-cache-actor.md). It is the single home for every hull an assembly in that level might test against.

- **Stored once, looked up by key.** Organs don't store geometry. Each holds a list of [keys](world-collision-source-key.md) into this pool (see [FNOrganCollisionCache](organ-collision-cache.md)), so overlapping or unbounded organs don't each keep a private copy of the same hulls.
- **Stored ready to use.** Meshes are kept in world space, convex, and validated, exactly as the assembly's processing step would have left them, so reading the pool skips both the gather and the bake.
- **Landscape has its own section.** A landscape is sampled across the whole level by design, not per organ volume, so no key refers to it. It is added to every assembly that asks for landscape, and has its own fingerprint.
- **The origin is recorded.** `BakeOriginLocation` records the world origin the hulls were baked against. A world whose origin has been rebased since then would misplace every hull without any fingerprint noticing, so the reader compares origins and ignores the pool if they differ. For an ordinary level it is zero.

:::warning[Not thread-safe]

The key lookup index is built lazily on first query, and changed by `Add` and `RemoveUnreferenced`.

:::

## Members

| Member | Type | Description |
| :-- | :-- | :-- |
| `Keys` | `TArray<uint64>` | Keys of the pooled elements, parallel to `Meshes`. |
| `Meshes` | `TArray<FNRawMesh>` | Baked world-space hulls, parallel to `Keys`. |
| `LandscapeMeshes` | `TArray<FNRawMesh>` | The level's sampled landscape surface. No key refers to it, and it is empty when landscape isn't being captured. |
| `LandscapeFingerprint` | `uint64` | Fingerprint of the landscape state it was sampled from; `0` when never sampled. |
| `BakeOriginLocation` | `FIntVector` | The world origin the hulls were baked against. |

`CurrentVersion` is written first when serializing, so a pool in an older format is recognized and discarded rather than misread.

## Functions

```cpp
int32 Num() const;
bool IsEmpty() const;
void Reset();
bool Contains(uint64 Key) const;
void Add(uint64 Key, FNRawMesh&& Mesh);
```

`Num()` counts keyed elements. `IsEmpty()` is true only when there are neither keyed elements nor landscape. `Add` replaces an existing key in place.

```cpp
bool Resolve(const TArray<uint64>& InKeys, TArray<FNRawMesh>& OutMeshes) const;
```

Appends the hulls named by `InKeys` to `OutMeshes`. Returns `false` when **any** key is missing, and the caller must then treat the referencing cache as stale and gather fresh. This is why references are keys rather than array indices: an index into a pool that has since changed would silently name whatever geometry now occupies that slot.

```cpp
int32 RemoveUnreferenced(const TSet<uint64>& Referenced);
```

Drops every keyed element not listed in `Referenced` (the combined keys of every organ in the level) and returns how many were removed. This is all the lifetime management the pool needs. A bake recomputes every organ's keys before calling it, so an element whose last user is gone gets collected without reference counting.

## Serialization

The pool writes itself field by field (`WithSerializer`) rather than through reflection. It holds one record per collision element in the level, and tagged serialization would roughly double that. `Identical` (`WithIdentical`) is **required**, not an optimization. None of the struct's state is reflected, so without it the engine would decide every pool equals the empty default and never save it, and a baked level would load back empty.
