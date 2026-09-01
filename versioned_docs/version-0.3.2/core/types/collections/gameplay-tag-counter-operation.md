---
sidebar_class_name: type native-struct
description: A declarative mutation to apply to a tag's count within an FNGameplayTagCounter.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Gameplay Tag Counter Operation

<TypeDetails icon="native-struct" base="struct" type="FNGameplayTagCounterOperation" typeExtra="" headerFile="NexusCore/Public/Collections/NGameplayTagCounterOperation.h" />

An authored description of how a tag's running total in a [Gameplay Tag Counter](gameplay-tag-counter.md) should change — the mutating counterpart to [Gameplay Tag Counter Constraint](gameplay-tag-counter-constraint.md), which only reads.

## Fields

| Field | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Tag` | `FGameplayTag` | The tag whose count this operation mutates. | `(None)` |
| `Operation` | [`ENGameplayTagCounterOperationType`](gameplay-tag-counter-operation-type.md) | The arithmetic applied to the current count using `Value`. | `Add` |
| `Value` | `int32` | The right-hand operand combined with the current count. | `0` |

All three are `EditAnywhere`, so these are authored in the editor rather than built in code.

:::note

`Value` defaults to `0`, which makes a freshly added operation a no-op for either `Add` or `Subtract`. Set it when you author the entry — an operation left at its default will not change any count.

:::

## Equality

The struct implements `operator==` and `operator!=` as exact field-wise comparisons across all three fields. Two operations are equal only when tag, operation, and value all match — useful for de-duplicating authored lists.

## Where It Is Used

World Assembly attaches these to cell entries as `Tag Counter Operations`: when a cell is placed, its operations are applied to the assembly operation's counter, which subsequent [constraints](gameplay-tag-counter-constraint.md) then test against. See [Tissue](../../../world-assembly/types/tissue.md#cells) for how they are authored.

Because the counter's mutation API produces **signed** values, a `Subtract` that takes a count below zero is no longer clamped — the result may legitimately be negative.
