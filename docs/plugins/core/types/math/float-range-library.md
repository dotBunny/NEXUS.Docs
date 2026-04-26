---
sidebar_position: 29
sidebar_label: Float Range Library
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-exposed wrappers around FNFloatRange's sampling API.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Float Range Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNFloatRangeLibrary" typeExtra="" headerFile="NexusCore/Public/Math/NFloatRangeLibrary.h" />

Blueprint-exposed wrappers around [`Float Range`](float-range.md)'s sampling API. Thin passthroughs so that Blueprint authors can reach the same `NextValue` / `RandomValue` / `PercentageValue` helpers that native code uses via `N_IMPLEMENT_RANGE`.

## UFunctions

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Next Value (Float)")
static float NextValue(const FNFloatRange& Range);

UFUNCTION(BlueprintCallable, DisplayName="Next Value In Sub-Range (Float)")
static float NextValueInSubRange(const FNFloatRange& Range, float MinimumValue, float MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Percentage Value (Float)")
static float PercentageValue(const FNFloatRange& Range, float Percentage);

UFUNCTION(BlueprintCallable, DisplayName="Random Value (Float)")
static float RandomValue(const FNFloatRange& Range);

UFUNCTION(BlueprintCallable, DisplayName="Random Value In Sub-Range (Float)")
static float RandomValueInSubRange(const FNFloatRange& Range, float MinimumValue, float MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Random Value One Shot (Float)")
static float RandomOneShotValue(const FNFloatRange& Range, float Seed);

UFUNCTION(BlueprintCallable, DisplayName="Random One Shot Value In Sub-Range (Float)")
static float RandomOneShotValueInSubRange(const FNFloatRange& Range, int32 Seed, float MinimumValue, float MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Value Percentage (Float)")
static float ValuePercentage(const FNFloatRange& Range, float Value);
```
