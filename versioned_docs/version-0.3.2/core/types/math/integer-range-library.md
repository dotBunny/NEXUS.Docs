---
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-exposed wrappers around FNIntegerRange's sampling API.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Integer Range Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNIntegerRangeLibrary" typeExtra="" headerFile="NexusCore/Public/Math/NIntegerRangeLibrary.h" />

Blueprint-exposed wrappers around [`Integer Range`](integer-range.md)'s sampling API. Thin passthroughs so that Blueprint authors can reach the same `NextValue` / `RandomValue` / `PercentageValue` helpers that native code uses via `N_RANGE_BASE`.

Unlike the [float](float-range-library.md) and [double](double-range-library.md) libraries, integer sampling is **fully inclusive** — `Maximum` is a possible result.

:::warning[Narrow the bounds before sampling]

A default-constructed `FNIntegerRange` spans every `int32`, and `Random*` cannot sample that: the stream evaluates `(Maximum - Minimum) + 1`, which overflows. See [The default span cannot be sampled](integer-range.md#properties).

:::

## UFunctions

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Next Value (Integer)")
static int32 NextValue(const FNIntegerRange& Range, UNMersenneTwisterObject* TwisterObject);

UFUNCTION(BlueprintCallable, DisplayName="Next Value In Sub-Range (Integer)")
static int32 NextValueInSubRange(const FNIntegerRange& Range, UNMersenneTwisterObject* TwisterObject, int32 MinimumValue, int32 MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Percentage Value (Integer)")
static float PercentageValue(const FNIntegerRange& Range, float Percentage);

UFUNCTION(BlueprintCallable, DisplayName="Random Value (Integer)")
static int32 RandomValue(const FNIntegerRange& Range);

UFUNCTION(BlueprintCallable, DisplayName="Random Value In Sub-Range (Integer)")
static int32 RandomValueInSubRange(const FNIntegerRange& Range, int32 MinimumValue, int32 MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Random One-Shot Value (Integer)")
static int32 RandomOneShotValue(const FNIntegerRange& Range, const int32 Seed);

UFUNCTION(BlueprintCallable, DisplayName="Random One-Shot Value In Sub-Range (Integer)")
static int32 RandomOneShotValueInSubRange(const FNIntegerRange& Range, int32 Seed, int32 MinimumValue, int32 MaximumValue);

UFUNCTION(BlueprintCallable, DisplayName="Value Percentage (Integer)")
static float ValuePercentage(const FNIntegerRange& Range, int32 Value);
```

The `Next*` functions draw from a caller-supplied [Mersenne Twister Object](mersenne-twister-object.md), so they advance that stream and stay deterministic. `RandomValue` / `RandomValueInSubRange` take no seed and are **non-deterministic** — they read the framework-wide shared stream. `RandomOneShot*` take an explicit `Seed` and do not advance any persistent stream.
