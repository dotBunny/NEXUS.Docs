---
sidebar_position: 30
sidebar_label: Integer Range
sidebar_class_name: type native-struct
description: A 32-bit integer inclusive range [Minimum, Maximum].
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Integer Range

<TypeDetails icon="native-struct" base="struct" type="FNIntegerRange" typeExtra="" headerFile="NexusCore/Public/Math/NIntegerRange.h" />

A 32-bit integer inclusive range `[Minimum, Maximum]`. Defaults span the entire representable range of `int32`; override either bound at author time. The member API (`NextValue`, `RandomValue`, `PercentageValue`, etc.) is supplied by the `N_IMPLEMENT_RANGE` macro.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Minimum` | `int32` | Lower bound of the range (inclusive). Defaults to `MIN_int32`. |
| `Maximum` | `int32` | Upper bound of the range (inclusive). Defaults to `MAX_int32`. |

## Methods

The struct mixes in the standard NEXUS range API via `N_IMPLEMENT_RANGE(int)`. See [Integer Range Library](integer-range-library.md) for the Blueprint-callable surface, or [Double Range](double-range.md) for the full method list — the integer variant exposes the same shape.

## See Also

- [Double Range](double-range.md) — double-precision counterpart.
- [Float Range](float-range.md) — single-precision counterpart.
- [Random](../random.md) — backing deterministic / non-deterministic streams.
