---
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-exposed wrappers around FNDoubleRange's sampling API.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Double Range Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNDoubleRangeLibrary" typeExtra="" headerFile="NexusCore/Public/Math/NDoubleRangeLibrary.h" />

Blueprint-exposed wrappers around [`Double Range`](double-range.md)'s sampling API. Thin passthroughs so that Blueprint authors can reach the same `NextValue` / `RandomValue` / `PercentageValue` helpers that native code uses via `N_RANGE_BASE`.

:::warning[Two things to know before sampling]

**`Random*` nodes are half-open** — they sample `[Minimum, Maximum)`, so `Maximum` never comes out. See [Inclusive or Half-Open?](double-range.md#inclusive-or-half-open).

**`Percentage Value (Double)` returns a `float`, not a `double`.** The native `PercentageValue` returns full `double` precision; the Blueprint wrapper narrows it. If you are interpolating across a wide range and need the precision, call it from C++ instead.

:::

## UFunctions

```cpp
/** Deterministic sample from Range's full span. */
UFUNCTION(BlueprintCallable, DisplayName="Next Value (Double)")
static double NextValue(const FNDoubleRange& Range, UNMersenneTwisterObject* TwisterObject);

/** Deterministic sample clamped to [MinimumValue, MaximumValue] within Range. */
UFUNCTION(BlueprintCallable, DisplayName="Next Value In Sub-Range (Double)")
static double NextValueInSubRange(const FNDoubleRange& Range, UNMersenneTwisterObject* TwisterObject, double MinimumValue, double MaximumValue);

/** Linearly interpolates between Range's Minimum and Maximum using Percentage (0..1). */
UFUNCTION(BlueprintCallable, DisplayName="Percentage Value (Double)")
static float PercentageValue(const FNDoubleRange& Range, float Percentage);

/** Non-deterministic sample from Range's full span. */
UFUNCTION(BlueprintCallable, DisplayName="Random Value (Double)")
static double RandomValue(const FNDoubleRange& Range);

/** Non-deterministic sample clamped to [MinimumValue, MaximumValue] within Range. */
UFUNCTION(BlueprintCallable, DisplayName="Random Value In Sub-Range (Double)")
static double RandomValueInSubRange(const FNDoubleRange& Range, double MinimumValue, double MaximumValue);

/** One-shot seeded sample from Range's full span; does not advance any persistent stream. */
UFUNCTION(BlueprintCallable, DisplayName="Random One-Shot Value (Double)")
static double RandomOneShotValue(const FNDoubleRange& Range, const int32 Seed);

/** One-shot seeded sample clamped to [MinimumValue, MaximumValue] within Range. */
UFUNCTION(BlueprintCallable, DisplayName="Random One-Shot Value In Sub-Range (Double)")
static double RandomOneShotValueInSubRange(const FNDoubleRange& Range, int32 Seed, double MinimumValue, double MaximumValue);

/** Returns Value's [0..1] position within Range (inverse of PercentageValue). */
UFUNCTION(BlueprintCallable, DisplayName="Value Percentage (Double)")
static float ValuePercentage(const FNDoubleRange& Range, double Value);
```
