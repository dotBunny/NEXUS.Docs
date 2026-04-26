---
sidebar_position: 28
sidebar_label: Float Range
sidebar_class_name: type native-struct
description: A single-precision inclusive range [Minimum, Maximum].
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Float Range

<TypeDetails icon="native-struct" base="struct" type="FNFloatRange" typeExtra="" headerFile="NexusCore/Public/Math/NFloatRange.h" />

A single-precision inclusive range `[Minimum, Maximum]`. Defaults span the entire representable range of `float`; override either bound at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_IMPLEMENT_RANGE` macro.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Minimum` | `float` | Lower bound of the range (inclusive). Defaults to `MIN_flt`. |
| `Maximum` | `float` | Upper bound of the range (inclusive). Defaults to `MAX_flt`. |

## Methods

The struct mixes in the standard NEXUS range API via `N_IMPLEMENT_RANGE(float)`. See [Float Range Library](float-range-library.md) for the Blueprint-callable surface, or [Double Range](double-range.md) for the full method list — the float variant exposes the same shape.

## See Also

- [Double Range](double-range.md) — double-precision counterpart.
- [Integer Range](integer-range.md) — `int32` counterpart.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
