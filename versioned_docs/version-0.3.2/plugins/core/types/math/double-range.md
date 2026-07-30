---
sidebar_class_name: type native-struct
description: A double-precision range — inclusive for clamping and interpolation, half-open when sampled.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Double Range

<TypeDetails icon="native-struct" base="struct" type="FNDoubleRange" typeExtra="" headerFile="NexusCore/Public/Math/NDoubleRange.h" />

A double-precision range `[Minimum, Maximum]`, defaulting to `[-MIN_dbl, MAX_dbl]`. Override **both** bounds at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_RANGE_BASE` macro.

This page carries the full method list for all three range types — [Float Range](float-range.md) and [Integer Range](integer-range.md) expose the same shape.

## Properties

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Minimum` | `double` | Lower bound of the range (inclusive). | `-MIN_dbl` |
| `Maximum` | `double` | Upper bound of the range (inclusive). | `MAX_dbl` |

:::warning[The default lower bound is effectively zero, not the most negative double]

`MIN_dbl` is the smallest **positive normalized** double, not the most negative one — so `-MIN_dbl` is a tiny negative value just below zero. A range left at its defaults therefore covers roughly `[0, MAX_dbl]`, **not** the full representable span. Set `Minimum` explicitly if you need negative values.

Widening the default to `-MAX_dbl` is deliberately avoided: sampling evaluates `(Maximum - Minimum)`, which overflows to infinity across the full span. The narrow default is the lesser of two problems.

:::

## Inclusive or Half-Open?

Both — it depends on which method you call, and this is the distinction most likely to catch you out:

| Methods | Interval |
| :-- | :-- |
| `Random*` (every variant) | **Half-open** `[Minimum, Maximum)` — `Maximum` is never returned. |
| `PercentageValue`, `ValuePercentage`, sub-range clamping | **Inclusive** `[Minimum, Maximum]`. |

The half-open behaviour comes from `FRandomStream::FRandRange`, which builds on `FRand`. It applies to the floating-point ranges only; [Integer Range](integer-range.md) sampling is fully inclusive.

So `PercentageValue(1.0)` returns `Maximum` exactly, while no number of `RandomValue()` calls ever will.

## Sampler Dispatch

`N_RANGE_BASE` routes every `Random*` call through `FNRangeSampler::Sample<Type>` rather than calling the stream directly:

```cpp
template <typename Type>
FORCEINLINE static Type Sample(const FRandomStream& RandomStream, const Type MinimumValue, const Type MaximumValue)
{
    if constexpr (TIsFloatingPoint<Type>::Value)
    {
        return static_cast<Type>(RandomStream.FRandRange(MinimumValue, MaximumValue));
    }
    else
    {
        return RandomStream.RandRange(MinimumValue, MaximumValue);
    }
}
```

:::info[Why the indirection exists]

`FRandomStream` splits its samplers by **name**, not by overload: `RandRange` takes `int32` only, and the floating-point equivalent is separately named `FRandRange`. Handing a `double` to `RandRange` therefore compiles silently while narrowing both bounds to `int32` — so every sample lands on a whole number, and bounds outside `int32`'s range make the conversion undefined.

Dispatching on `TIsFloatingPoint` is what makes each range type pick the right sampler. If you add a method to `N_RANGE_BASE` that samples an `FRandomStream`, route it through `FNRangeSampler::Sample` as well — calling `RandRange` directly reintroduces the truncation.

:::

The `Next*` methods need none of this: they sample through [Mersenne Twister](mersenne-twister.md), which *does* overload `RandRange` per scalar type.

## Methods

Supplied by `N_RANGE_BASE(double)`. See [Double Range Library](double-range-library.md) for the Blueprint-callable subset.

### Deterministic — Mersenne Twister

| Method | Behavior |
| :-- | :-- |
| `NextValue(FNMersenneTwister&)` | Deterministic sample from the full range. |
| `NextValueInSubRange(FNMersenneTwister&, Min, Max)` | Deterministic sample clamped to a sub-range. |

Both take the twister **by reference** — the range holds no stream of its own, so determinism is the caller's to own.

### Non-deterministic

| Method | Behavior |
| :-- | :-- |
| `RandomValue()` | Sample from the full range using the shared non-deterministic stream. |
| `RandomValueInSubRange(Min, Max)` | Same, clamped to a sub-range. |

### Seeded, one-shot

| Method | Behavior |
| :-- | :-- |
| `RandomOneShotValue(int32 Seed)` | Builds a throwaway stream from `Seed` and samples once. |
| `RandomOneShotValue(FRandomStream&)` | Samples from a caller-supplied stream. |
| `RandomOneShotValueInSubRange(int32 Seed, Min, Max)` | Seeded one-shot, clamped to a sub-range. |

### Seeded, tracked

| Method | Behavior |
| :-- | :-- |
| `RandomTrackedValue(int& Seed)` | Samples, then **writes the stream's advanced seed back** into `Seed`. |
| `RandomTrackedValueInSubRange(int& Seed, Min, Max)` | Same, clamped to a sub-range. |
| `RandomTrackedValueInSubRange(FRandomStream&, Min, Max)` | Advances a caller-owned stream instead of a seed value. |

The tracked variants are how you get a reproducible *sequence* without holding a stream object: pass the same `int` back in on each call and it walks forward deterministically.

### Interpolation

| Method | Behavior |
| :-- | :-- |
| `PercentageValue(float Percentage)` | Linear interpolation between `Minimum` and `Maximum`. Returns `double`. |
| `ValuePercentage(double Value)` | Inverse of `PercentageValue` — `Value`'s `[0..1]` position in the range. Returns `float`, and `0.f` when `Maximum == Minimum`. |

## Sub-Range Clamping

Every `…InSubRange` method **clamps rather than validates**. A `MinimumValue` below the range's `Minimum` is raised to it, and a `MaximumValue` above `Maximum` is lowered — silently, with no error returned. A sub-range entirely outside the parent collapses onto the nearest bound, so you get a degenerate sample rather than a warning.

## See Also

- [Float Range](float-range.md) — single-precision counterpart, same half-open sampling.
- [Integer Range](integer-range.md) — `int32` counterpart, fully inclusive sampling.
- [Mersenne Twister](mersenne-twister.md) — the deterministic stream the `Next*` methods take.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
