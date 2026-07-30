---
sidebar_class_name: type native-struct
description: A single tag paired with its count.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Gameplay Tag Count

<TypeDetails icon="native-struct" base="struct" type="FNGameplayTagCount" typeExtra="" headerFile="NexusCore/Public/Collections/NGameplayTagCount.h" />

One tag paired with its count — a flat, Blueprint-friendly representation of a single entry in a [Gameplay Tag Counter](gameplay-tag-counter.md).

## Fields

| Field | Type | Purpose |
| :-- | :-- | :-- |
| `Tag` | `FGameplayTag` | The tag this count applies to. |
| `Count` | `int32` | The number of times the tag has been counted. Defaults to `0`. |

Both are `BlueprintReadOnly, VisibleInstanceOnly` — this is a read-out type, not something you author. Mutate counts through the counter itself.

## Why It Exists

A [Gameplay Tag Counter](gameplay-tag-counter.md) stores its data as a map, which is inconvenient to pass across boundaries that prefer flat arrays — Blueprint pins, replication, and serialization among them. `FNGameplayTagCount` is that map flattened to one entry, so a `TArray<FNGameplayTagCount>` can carry the same information anywhere a `TMap` cannot go comfortably.

This is why [`UNWorldAssemblyLibrary`](../../../world-assembly/types/world-assembly-library.md) offers both a map-returning `Get Tag Counter` and an array-returning `Get Tag Counter (Array)`: the second yields these.
