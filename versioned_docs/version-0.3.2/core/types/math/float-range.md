---
sidebar_class_name: type native-struct
description: A single-precision range — inclusive for clamping and interpolation, half-open when sampled.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Float Range

<TypeDetails icon="native-struct" base="struct" type="FNFloatRange" typeExtra="" headerFile="NexusCore/Public/Math/NFloatRange.h" />

A single-precision range `[Minimum, Maximum]`, defaulting to `[-MIN_flt, MAX_flt]`. Override **both** bounds at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_RANGE_BASE` macro.

## Properties

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Minimum` | `float` | Lower bound of the range (inclusive). | `-MIN_flt` |
| `Maximum` | `float` | Upper bound of the range (inclusive). | `MAX_flt` |

:::warning[The default lower bound is effectively zero, not the most negative float]

`MIN_flt` is the smallest **positive normalized** float, not the most negative one — so `-MIN_flt` is a tiny negative value just below zero. A range left at its defaults therefore covers roughly `[0, MAX_flt]`, **not** the full representable span. Set `Minimum` explicitly if you need negative values.

Widening the default to `-MAX_flt` is deliberately avoided: sampling evaluates `(Maximum - Minimum)`, which overflows across the full span. The narrow default is the lesser of two problems.

:::

## Sampling Is Half-Open

The `Random*` methods sample `[Minimum, Maximum)` — **`Maximum` is never returned**. The range stays fully inclusive for `PercentageValue`, `ValuePercentage`, and sub-range clamping.

This is inherited from `FRandomStream::FRandRange` and applies to both floating-point ranges. [Integer Range](integer-range.md) sampling is fully inclusive by contrast. See [Inclusive or Half-Open?](double-range.md#inclusive-or-half-open) for the full picture.

## Methods

The struct mixes in the standard NEXUS range API via `N_RANGE_BASE(float)`. See [Float Range Library](float-range-library.md) for the Blueprint-callable surface, or [Double Range](double-range.md#methods) for the full method list — the float variant exposes the same shape.

Sampling routes through `FNRangeSampler`, which for a floating-point range selects `FRandomStream::FRandRange` rather than the int32-only `RandRange`. See [Sampler Dispatch](double-range.md#sampler-dispatch) for why that indirection exists and what it fixed.

## See Also

- [Double Range](double-range.md) — double-precision counterpart, and the canonical method list.
- [Integer Range](integer-range.md) — `int32` counterpart, fully inclusive sampling.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
