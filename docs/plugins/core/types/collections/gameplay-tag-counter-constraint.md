---
sidebar_class_name: type native-struct
description: A declarative predicate tested against a tag's count within an FNGameplayTagCounter.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Gameplay Tag Counter Constraint

<TypeDetails icon="native-struct" base="struct" type="FNGameplayTagCounterConstraint" typeExtra="" headerFile="NexusCore/Public/Collections/NGameplayTagCounterConstraint.h" />

An authored predicate that gates behaviour on a tag's running total in a [Gameplay Tag Counter](gameplay-tag-counter.md) — for example "this cell may only be placed once `Boss` has reached 1".

## Fields

| Field | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Tag` | `FGameplayTag` | The tag whose count this constraint tests. | `(None)` |
| `Comparison` | [`ENComparisonResult`](../types/comparison-result.md) | How the current count is compared against `Value`. | `GreaterThanOrEqual` |
| `Value` | `int32` | The value the current count is compared against. | `1` |

The defaults form the most common constraint outright — `Comparison = GreaterThanOrEqual` with `Value = 1` reads as "this tag has been counted at least once", so authoring one often means setting only the `Tag`.

## Evaluating

```cpp
/**
 * Tests whether a tag's current count in a counter satisfies this constraint.
 * @param TagCounter The counter whose count for Tag is compared against Value via Comparison.
 * @return true if the comparison holds; false otherwise, including when Comparison is unrecognized.
 */
bool DoesPassComparison(const FNGameplayTagCounter& TagCounter) const;
```

:::note[An absent tag counts as zero]

A tag the counter does not track is compared as a count of **zero** rather than failing outright. `DoesPassComparison` reads the count through `TryGetValue`, which leaves the value at zero for an untracked tag instead of asserting on a missing key.

That makes negative-sense constraints work as you would expect on a fresh counter — `LessThan 1` passes for a tag that has never been counted — but it also means a misspelled tag silently behaves like a zero count rather than erroring.

:::

An unrecognised `Comparison` returns `false`, so the constraint fails closed.

## Where It Is Used

World Assembly attaches these to cell entries as `Tag Counter Constraints`, where **every** constraint must pass for a cell to remain a placement candidate. See [Tissue](../../../world-assembly/types/tissue.md#cells) for authoring, and [Gameplay Tag Counter Operation](gameplay-tag-counter-operation.md) for the mutating side that moves the counts these tests read.
