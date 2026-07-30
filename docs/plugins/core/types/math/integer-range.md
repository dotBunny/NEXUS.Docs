---
sidebar_class_name: type native-struct
description: A 32-bit integer inclusive range [Minimum, Maximum].
---

import TypeDetails from '@site/src/components/TypeDetails';

# Integer Range

<TypeDetails icon="native-struct" base="struct" type="FNIntegerRange" typeExtra="" headerFile="NexusCore/Public/Math/NIntegerRange.h" />

A 32-bit integer inclusive range `[Minimum, Maximum]`. Defaults span the entire representable range of `int32`; override **both** bounds at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_RANGE_BASE` macro.

Unlike its [float](float-range.md) and [double](double-range.md) counterparts, sampling here is **fully inclusive** — `Maximum` is a possible result.

## Properties

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Minimum` | `int32` | Lower bound of the range (inclusive). | `MIN_int32` |
| `Maximum` | `int32` | Upper bound of the range (inclusive). | `MAX_int32` |

:::warning[The default span cannot be sampled]

The defaults really do cover every `int32`, and that is exactly the problem: `FRandomStream::RandRange` evaluates `(Maximum - Minimum) + 1`, which **overflows `int32`** across the full span. An `FNIntegerRange` left at its defaults will not produce meaningful `Random*` results.

Narrow the bounds before sampling. The defaults exist so an authored range starts unconstrained for *clamping* and percentage work, not so it can be sampled as-is.

:::

## Methods

The struct mixes in the standard NEXUS range API via `N_RANGE_BASE(int32)`. See [Integer Range Library](integer-range-library.md) for the Blueprint-callable surface, or [Double Range](double-range.md#methods) for the full method list — the integer variant exposes the same shape.

Sampling routes through `FNRangeSampler`, which for an integral range selects `FRandomStream::RandRange`. See [Sampler Dispatch](double-range.md#sampler-dispatch) for why that indirection exists and what it fixed.

## See Also

- [Double Range](double-range.md) — double-precision counterpart, and the canonical method list.
- [Float Range](float-range.md) — single-precision counterpart.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
