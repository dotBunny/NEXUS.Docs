---
sidebar_position: 51
sidebar_label: Weighted Integer Array
sidebar_class_name: type native-struct
description: An inline array of integers that are proportionally weighted via repeated entries.
tags: [0.2.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Weighted Integer Array

<TypeDetails icon="native-struct" base="struct" type="FNWeightedIntegerArray" typeExtra="" headerFile="NexusCore/Public/Collections/NWeightedIntegerArray.h" />

An inline array of integers that are proportionally weighted via repeated entries. Rather than storing explicit weight tables, each value is inserted `Weight` times. Picking an entry then becomes a uniform random index lookup while still honoring the relative weights. This keeps selection fast at the cost of a larger memory footprint for heavily weighted entries.

For Blueprint exposure of these methods, see [Collections Library](../collections-library.md).

## Mutation

```cpp
/** Add a value to the array, duplicated according to its weight. */
void Add(const int32 Value, const int32 Weight = 1);

/** Clears all entries from the array. */
void Empty();

/** Removes every copy of the supplied value from the array. */
void Remove(const int32 Value);

/** Removes up to Limit copies of the supplied value from the array. */
void RemoveSome(const int32 Value, int32 Limit = 1);
```

## Pickers

| Method | Stream | Removes Picked? |
| :-- | :-- | :-: |
| `NextValue()` | Deterministic ([`FNRandom::Deterministic`](../random.md)) | No |
| `NextValueAndRemove()` | Deterministic | Yes |
| `RandomValue()` | Non-deterministic ([`FNRandom::NonDeterministic`](../random.md)) | No |
| `RandomValueAndRemove()` | Non-deterministic | Yes |
| `RandomOneShotValue(Seed)` | One-shot `FRandomStream(Seed)` | No |
| `RandomOneShotValueAndRemove(Seed)` | One-shot `FRandomStream(Seed)` | Yes |
| `RandomTrackedValue(Seed&)` | `FRandomStream(Seed)`; `Seed` updated on return | No |
| `RandomTrackedValueAndRemove(Seed&)` | Tracked stream | Yes |
| `TwistedValue(Twister&)` | Caller-supplied [`Mersenne Twister`](../math/mersenne-twister.md) | No |
| `TwistedValueAndRemove(Twister&)` | Caller-supplied Mersenne Twister | Yes |

## Queries

```cpp
/** Is there any data in the array? */
bool HasData() const;

/** Does the array currently contain at least one copy of the supplied value? */
bool HasValue(const int32 Value) const;

/** Return the distinct set of values currently present in the array (deduplicated). */
TArray<int32> GetUniqueValues();

/** Total number of weighted entries currently in the array — equal to the sum of every value's remaining weight. */
int32 WeightedCount() const;
```
