---
sidebar_class_name: type native-struct
description: One organ's record of the world collision it was baked against — a fingerprint and keys into the level's pool, with no geometry.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Organ Collision Cache

<TypeDetails icon="native-struct" base="struct" type="FNOrganCollisionCache" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NOrganCollisionCache.h" />

One [organ's](organ-component.md) record of the [world collision](../world-collision.md) it was baked against, stored on `UNOrganComponent::CollisionCache`. It holds **no geometry**. The hulls live once in the level's [pool](world-collision-pool.md), and the organ names the ones it needs by [key](world-collision-source-key.md).

The [fingerprint](world-collision-fingerprint.md) is the entire validity test. It summarizes the region, the settings, and every actor a gather would have read. If it still matches the live world, the cache describes that world exactly. A mismatch is not an error: it means the level changed since the bake, and the assembly gathers fresh for this organ.

The organ's details panel shows this record as its [World Collision Cache](organ-component.md#world-collision-cache) row.

## Members

| Member | Type | Description |
| :-- | :-- | :-- |
| `Fingerprint` | `uint64` | Fingerprint of the world this organ was baked against; `0` when never baked. |
| `SourceKeys` | `TArray<uint64>` | Sorted, duplicate-free keys into the level's pool. |
| `BakeTime` | `FDateTime` | When the bake ran, for the details panel and for diagnosing a cache that keeps missing. |

## Functions

```cpp
bool HasData() const;
bool IsValidFor(const uint64 CurrentFingerprint) const;
void Reset();
void SetBakeResult(uint64 InFingerprint, TArray<uint64>&& InKeys);
```

- `HasData()` is true once any bake has been recorded, whether or not it is still current.
- `IsValidFor()` is true only for a recorded bake whose fingerprint equals the one just computed from the live world.
- `SetBakeResult()` records a bake. It sorts the keys, so re-baking unchanged geometry produces byte-identical data and stays out of your next changelist.

Like the pool, it uses a hand-written serializer and a **required** `Identical`. A `uint64` can't be a `UPROPERTY`, so without `Identical` the engine would compare an empty property list, decide every cache equals the default, and never save it. A baked organ would load back unbaked.
