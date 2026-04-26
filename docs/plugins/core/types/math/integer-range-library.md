---
sidebar_position: 31
sidebar_label: Integer Range Library
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-exposed wrappers around FNIntegerRange's sampling API.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Integer Range Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNIntegerRangeLibrary" typeExtra="" headerFile="NexusCore/Public/Math/NIntegerRangeLibrary.h" />

Blueprint-exposed wrappers around [`Integer Range`](integer-range.md)'s sampling API. Thin passthroughs so that Blueprint authors can reach the same `NextValue` / `RandomValue` / `PercentageValue` helpers that native code uses via `N_IMPLEMENT_RANGE`.

## UFunctions

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Next Value (Integer)")
static int NextValue(const FNIntegerRange& Range);

UFUNCTION(BlueprintCallable, DisplayName="Next Value In Sub-Range (Integer)")
static int NextValueInSubRange(const FNIntegerRange& Range, int MinimumValue, int MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Percentage Value (Integer)")
static float PercentageValue(const FNIntegerRange& Range, float Percentage);

UFUNCTION(BlueprintCallable, DisplayName="Random Value (Integer)")
static int RandomValueFromSeed(const FNIntegerRange& Range);

UFUNCTION(BlueprintCallable, DisplayName="Random Value In Sub-Range (Integer)")
static int RandomValueInSubRangeFromSeed(const FNIntegerRange& Range, int MinimumValue, int MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Random One Shot Value (Integer)")
static int RandomOneShotValue(const FNIntegerRange& Range, const int Seed);

UFUNCTION(BlueprintCallable, DisplayName="Random One Shot Value In Sub-Range (Integer)")
static int RandomOneShotValueInSubRange(const FNIntegerRange& Range, int Seed, int MinimumValue, int MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Value Percentage (Integer)")
static float ValuePercentage(const FNIntegerRange& Range, int Value);
```
