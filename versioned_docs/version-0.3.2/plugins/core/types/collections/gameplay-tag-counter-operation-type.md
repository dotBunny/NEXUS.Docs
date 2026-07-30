---
sidebar_class_name: type ue-enum
description: The arithmetic operation an FNGameplayTagCounterOperation applies to a tag's count.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Gameplay Tag Counter Operation Type

<TypeDetails icon="ue-enum" base="enum" type="ENGameplayTagCounterOperationType" typeExtra="" headerFile="NexusCore/Public/Collections/NGameplayTagCounterOperationType.h" />

Selects the arithmetic a [Gameplay Tag Counter Operation](gameplay-tag-counter-operation.md) applies to a tag's count.

```cpp
UENUM(BlueprintType)
enum class ENGameplayTagCounterOperationType : uint8
{
    Add = 0,
    Subtract = 1,
};
```

| Value | Effect |
| :-- | :-- |
| `Add` | Add the operation's `Value` to the tag's current count. |
| `Subtract` | Subtract the operation's `Value` from the tag's current count. |

There is deliberately no `Set` or `Multiply` — every operation is a relative adjustment, which is what keeps a sequence of them order-independent in total and reversible by applying the opposite.

:::note

Counts are **signed**. A `Subtract` that takes a tag below zero is not clamped, so a count may legitimately be negative. That is what makes `Add` and `Subtract` exact inverses of one another.

:::
