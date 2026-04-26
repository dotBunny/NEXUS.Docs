---
sidebar_position: 49
sidebar_label: Rotation Constraints
sidebar_class_name: type native-struct
description: Dual-interval rotation constraints used by ProcGen matching rules.
tags: [0.2.0, 0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Rotation Constraints

<TypeDetails icon="native-struct" base="struct" type="FNRotationConstraints" typeExtra="" headerFile="NexusCore/Public/Types/NRotationConstraints.h" />

Dual-interval rotation constraints used by [ProcGen](../../../procedural-generation/index.mdx) matching rules. The "matching" interval constrains a candidate rotation's own pose, while the "difference" interval constrains the delta between two rotations. Either interval can be enabled independently.

## Properties

### Matching Interval

| Property | Type | Description |
| :-- | :-- | :-- |
| `bEnforceMatchingRotation` | `bool` | Enables the "matching" interval test on the candidate rotation itself. |
| `MinimumMatchingRotation` | `FRotator` | Lower bound of the matching interval (inclusive). |
| `MaximumMatchingRotation` | `FRotator` | Upper bound of the matching interval (inclusive). |

### Difference Interval

| Property | Type | Description |
| :-- | :-- | :-- |
| `bEnforceDifferenceRotation` | `bool` | Enables the "difference" interval test on the delta between two rotations. |
| `MinimumDifferenceRotation` | `FRotator` | Lower bound of the difference interval (inclusive). |
| `MaximumDifferenceRotation` | `FRotator` | Upper bound of the difference interval (inclusive). |

## Methods

### Is Matching Rotation Allowed

Tests whether `Rotation` lies within the matching interval. The `FRotator` overload normalizes axes internally; the three-float overload skips normalization for callers that have already done it.

```cpp
bool IsMatchingRotationAllowed(const FRotator& Rotation) const;
bool IsMatchingRotationAllowed(const float NormalizedRoll, const float NormalizedPitch, const float NormalizedYaw) const;
```

### Is Difference Rotation Allowed

Tests whether `Rotation` (treated as a delta between two rotations) lies within the difference interval.

```cpp
bool IsDifferenceRotationAllowed(const FRotator& Rotation) const;
bool IsDifferenceRotationAllowed(const float NormalizedRoll, const float NormalizedPitch, const float NormalizedYaw) const;
```

### Equality / Copy

```cpp
bool CopyTo(FNRotationConstraints& Other) const;
bool IsEqual(const FNRotationConstraints& Other) const;
```
