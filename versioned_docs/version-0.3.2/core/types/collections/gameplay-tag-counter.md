---
sidebar_class_name: type native-struct
description: Tracks a running signed integer count per FGameplayTag.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Gameplay Tag Counter

<TypeDetails icon="native-struct" base="struct" type="FNGameplayTagCounter" typeExtra="" headerFile="NexusCore/Public/Collections/NGameplayTagCounter.h" />

A running count per `FGameplayTag`, backed by a `TMap<FGameplayTag, int32>`. Where an `FGameplayTagContainer` answers "is this tag present", a counter answers "how many times" — which is what lets rules be written against quantities rather than mere membership.

## Two Rules That Shape Everything

Almost every question about this type is answered by two design decisions:

**An absent tag reads as zero.** Querying a tag the counter has never seen is not an error and does not insert anything — it returns `0`. So a fresh counter satisfies `LessThan 1` for every conceivable tag, and misspelling a tag yields a silent zero rather than a failure.

**Counts are signed and never floored.** `Subtract` will take a count below zero and leave it there. This is deliberate: it makes `ApplyOperation` and `ReverseOperation` exact inverses, so a sequence of operations can be wound back precisely, and it keeps the type consistent with `GetDifference` and `Combine`, which already produce signed values.

:::warning

If you rely on a count never going negative, clamp at the point of use. The counter will not do it for you, and a count of `-3` is a legitimate state rather than a bug.

:::

## Construction

```cpp
/** Constructs an empty counter. */
FNGameplayTagCounter() = default;

/** Constructs a counter seeded with an existing set of tag counts. */
explicit FNGameplayTagCounter(const TMap<FGameplayTag, int32>& ExistingCounters);

/** Constructs a counter seeded from a flat array of tag/count pairs. */
explicit FNGameplayTagCounter(const TArray<FNGameplayTagCount>& Counts);

/** Constructs a counter with a single tag already incremented to one. */
explicit FNGameplayTagCounter(const FGameplayTag& Tag);
```

The array constructor **sums duplicate tags** rather than letting the last entry win, so a flattened list carrying the same tag twice round-trips to the total you would expect. The single-tag constructor is a shorthand for the common "seed with one occurrence" case.

## Mutating

| Method | Effect |
| :-- | :-- |
| `Increment(Tag)` | Adds one to the tag's count. |
| `Decrement(Tag)` | Subtracts one from the tag's count. |
| `Add(Tag, Value)` | Adds `Value` to the tag's count. |
| `Subtract(Tag, Value)` | Subtracts `Value` from the tag's count. |
| `Combine(Other)` | Merges another counter in, summing values for tags present in both. |
| `ApplyOperation(Operation)` | Applies a declarative [operation](gameplay-tag-counter-operation.md) to its target tag. |
| `ReverseOperation(Operation)` | Applies the **inverse** of an operation — an `Add` is subtracted, a `Subtract` added — undoing a prior `ApplyOperation`. |

`ApplyOperation` / `ReverseOperation` are the pair to use when mutations are authored data rather than code, and the reason counts are unfloored: reversing is exact.

## Reading

| Method | Returns |
| :-- | :-- |
| `GetValue(Tag)` | The tracked count, or `0` when the tag is absent. |
| `TryGetValue(Tag, OutValue)` | `true` when the tag is tracked; leaves `OutValue` at zero when it is not. |
| `Has(Tag)` | Whether the tag is tracked at all — distinct from its count being non-zero. |
| `ToTagCount()` | A flat `TArray<`[`FNGameplayTagCount`](gameplay-tag-count.md)`>` for passing across Blueprint or serialization boundaries. |
| `GetDifference(Other)` | A new counter holding this counter's counts **minus** `Other`'s. |

Note the distinction between `Has` and a non-zero count. A tag explicitly counted down to `0` is still *tracked* — `Has` returns `true` while `GetValue` returns `0`. Use `Has` to ask whether a tag was ever involved, and `GetValue` to ask about quantity.

`GetDifference` treats an absent tag as zero on either side and is **antisymmetric**: `A.GetDifference(B)` is the exact negation of `B.GetDifference(A)`.

## Where It Is Used

World Assembly threads a counter through an assembly operation: cells carry [operations](gameplay-tag-counter-operation.md) that mutate it when placed, and [constraints](gameplay-tag-counter-constraint.md) that test it to decide whether a cell is a candidate at all. See [Tissue](../../../world-assembly/types/tissue.md#cells) for authoring both, and [`UNWorldAssemblyLibrary`](../../../world-assembly/types/world-assembly-library.md) for the Blueprint surface that reads and mutates the operation's counter at runtime.
