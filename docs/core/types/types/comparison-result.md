---
sidebar_class_name: type ue-enum
description: Relational operator selector used to test a value against a configured threshold.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Comparison Result

<TypeDetails icon="ue-enum" base="enum" type="ENComparisonResult" typeExtra="" headerFile="NexusCore/Public/Types/NComparisonResult.h" />

Names which relational operator to apply between a queried value and an operand.

:::warning[The name is misleading]

Despite reading like an outcome, `ENComparisonResult` selects the **operation to perform**, not the result of one. `Equal` does not mean "the values were equal" — it means "test these values for equality". Treat it as a comparison *operator*, not a comparison *result*.

:::

## Values

```cpp
UENUM(BlueprintType)
enum class ENComparisonResult : uint8
{
    Equal = 0,
    GreaterThan = 1,
    GreaterThanOrEqual = 2   UMETA(DisplayName = "Greater Than Or Equal"),
    LessThan = 3,
    LessThanOrEqual = 4      UMETA(DisplayName = "Less Than Or Equal"),
    NotEqual = 5
};
```

| Value | Passes when |
| :-- | :-- |
| `Equal` | The value equals the operand. |
| `GreaterThan` | The value is strictly greater than the operand. |
| `GreaterThanOrEqual` | The value is greater than or equal to the operand. |
| `LessThan` | The value is strictly less than the operand. |
| `LessThanOrEqual` | The value is less than or equal to the operand. |
| `NotEqual` | The value differs from the operand. |

## Where It Is Used

Consumed by predicate checks that compare a running value against an authored threshold — most visibly [`FNGameplayTagCounterConstraint`](../collections/gameplay-tag-counter-constraint.md), where each constraint pairs a tag, an operator from this enum, and a value to compare the tag's count against.
