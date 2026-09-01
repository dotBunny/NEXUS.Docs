---
sidebar_class_name: type ue-enum
description: Paired bitflag enums recording whether a derived artifact exists and whether it is still current.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Validation

<TypeDetails icon="ue-enum" base="enum" type="ENBakedValidation" typeExtra=" + ENGeneratedValidation" headerFile="NexusCore/Public/Types/NValidation.h" />

Two bitflag enums that record the state of a **derived artifact** — something produced from authored input, which can be absent, present, or present but stale.

Both have the same shape, and differ only in what the first flag is called: `Baked` for artifacts that are baked down, `Generated` for artifacts that are generated.

## Values

```cpp
UENUM(meta=(Bitflags,UseEnumValuesAsMaskValuesInEditor=true))
enum class ENBakedValidation : uint8
{
    None = 0 UMETA(Hidden),
    Baked = 1,
    UpToDate = 2
};
ENUM_CLASS_FLAGS(ENBakedValidation)

UENUM(meta=(Bitflags,UseEnumValuesAsMaskValuesInEditor=true))
enum class ENGeneratedValidation : uint8
{
    None = 0 UMETA(Hidden),
    Generated = 1,
    UpToDate = 2
};
ENUM_CLASS_FLAGS(ENGeneratedValidation)
```

| Flag | Means |
| :-- | :-- |
| `None` | Neither flag set. Hidden in the editor — it is the empty mask, not a state to pick. |
| `Baked` / `Generated` | The artifact **exists**. |
| `UpToDate` | The artifact **matches the input it was derived from**. |

## Two Flags, Not Three States

Existence and currency are held apart on purpose, because they are independent questions and the interesting answer is the combination:

| Mask | State |
| :-- | :-- |
| `None` | Never produced. |
| `Baked` / `Generated` alone | Produced, but the input has moved on — **stale**. |
| `Baked \| UpToDate` | Produced and current. |
| `UpToDate` alone | Meaningless in practice: nothing exists to be current. |

A single tri-state enum would collapse the first two, which is exactly the distinction a re-bake decision turns on.

## The `ALL` Macros

Each enum ships a companion macro naming the fully-valid mask, so callers testing for "produced **and** current" do not have to spell the combination out:

```cpp
#define D_BAKED_VALIDATION_ALL     static_cast<uint8>(ENBakedValidation::Baked)     | static_cast<uint8>(ENBakedValidation::UpToDate)
#define D_GENERATED_VALIDATION_ALL static_cast<uint8>(ENGeneratedValidation::Generated) | static_cast<uint8>(ENGeneratedValidation::UpToDate)
```

Both cast to `uint8` rather than staying enum-typed, which is what lets them be compared directly against a `uint8` bitmask property — the form a `Bitflags` `UPROPERTY` is stored in.

:::note[The enumerators are literal masks, not bit indices]

`UseEnumValuesAsMaskValuesInEditor=true` is what makes `Baked = 1` and `UpToDate = 2` mean bits 0 and 1. **Without** that meta, Unreal treats a `Bitflags` enumerator as a bit *index*, so a value of `2` would select bit 2 — mask `4` — and the editor's checkboxes would disagree with any C++ that assumed otherwise.

Anything adding a third flag here continues the literal sequence (`4`, `8`, …), not the index one.

:::

`ENUM_CLASS_FLAGS` supplies the bitwise operators, so the enums compose with `|`, `&` and `EnumHasAnyFlags` in C++ without casting at every use site.
