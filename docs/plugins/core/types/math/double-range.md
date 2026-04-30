---
sidebar_position: 26
sidebar_label: Double Range
sidebar_class_name: type native-struct
description: A double-precision inclusive range [Minimum, Maximum].
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Double Range

<TypeDetails icon="native-struct" base="struct" type="FNDoubleRange" typeExtra="" headerFile="NexusCore/Public/Math/NDoubleRange.h" />

A double-precision inclusive range `[Minimum, Maximum]`. Defaults span the entire representable range of `double`; override either bound at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_IMPLEMENT_RANGE` macro.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Minimum` | `double` | Lower bound of the range (inclusive). Defaults to `MIN_dbl`. |
| `Maximum` | `double` | Upper bound of the range (inclusive). Defaults to `MAX_dbl`. |

## Methods

The struct mixes in the standard NEXUS range API via `N_IMPLEMENT_RANGE(double)`. See [Double Range Library](double-range-library.md) for the Blueprint-callable surface; the same methods are accessible directly on the struct in C++:

| Method | Behavior |
| :-- | :-- |
| `NextValue()` | Deterministic sample from the full range. |
| `NextValueInSubRange(Min, Max)` | Deterministic sample clamped to a sub-range. |
| `RandomValue()` | Non-deterministic sample from the full range. |
| `RandomValueInSubRange(Min, Max)` | Non-deterministic sample clamped to a sub-range. |
| `RandomOneShotValue(Seed)` | One-shot seeded sample. |
| `RandomOneShotValueInSubRange(Seed, Min, Max)` | One-shot seeded sample clamped to a sub-range. |
| `PercentageValue(Percentage)` | Linear interpolation between `Minimum` and `Maximum`. |
| `ValuePercentage(Value)` | Inverse of `PercentageValue`. |

## See Also

- [Float Range](float-range.md) — single-precision counterpart.
- [Integer Range](integer-range.md) — `int32` counterpart.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
