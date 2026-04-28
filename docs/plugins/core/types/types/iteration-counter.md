---
sidebar_position: 51
sidebar_label: Iteration Counter
sidebar_class_name: type native-struct
description: Bucketed integer counter that records a running tally per iteration.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Iteration Counter

<TypeDetails icon="native-struct" base="struct" type="FNIterationCounter" typeExtra="" headerFile="NexusCore/Public/Types/NIterationCounter.h" />

Bucketed integer counter that records a running tally per iteration. Each call to `NextIteration()` opens a fresh bucket; `Increment()` and `Decrement()` always apply to the current (most recent) bucket. The full history is preserved in `Counter`, allowing per-iteration values to be inspected after the fact.

Useful for analytics that need to attribute counts to a retry pass, generation step, or other discrete phase rather than a single cumulative total.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Iteration` | `int` | Index of the current bucket; always equals `Counter.Num() - 1`. |
| `Counter` | `TArray<int32>` | Per-iteration tallies; index `0` is the first iteration, the last entry is the current bucket. |

## Methods

```cpp
/** Add one to the current iteration's tally. */
void Increment();

/** Subtract one from the current iteration's tally. */
void Decrement();

/** Open a new bucket initialized to zero and make it the current iteration. */
void NextIteration();

/** Sum every iteration's tally and return the cumulative total across all buckets. */
int32 GetTotal();
```
