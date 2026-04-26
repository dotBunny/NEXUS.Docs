---
sidebar_position: 42
sidebar_label: Cardinal Rotation
sidebar_class_name: type native-struct
description: Rotation expressed as three ENCardinalDirection components (Roll, Pitch, Yaw).
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Cardinal Rotation

<TypeDetails icon="native-struct" base="struct" type="FNCardinalRotation" typeExtra="" headerFile="NexusCore/Public/Types/NCardinalRotation.h" />

Rotation expressed as three [`ENCardinalDirection`](cardinal-direction.md) components (Roll, Pitch, Yaw). Useful for grid-aligned gameplay that only needs 16-wind orientations. Conversion helpers produce either unsigned `[0, 360)` or normalized `[-180, 180)` degree representations.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Roll` | `ENCardinalDirection` | Roll component, in cardinal steps. |
| `Pitch` | `ENCardinalDirection` | Pitch component, in cardinal steps. |
| `Yaw` | `ENCardinalDirection` | Yaw component, in cardinal steps. |

## Methods

### Conversions

```cpp
/** Packs the three cardinal components into an FIntVector3 of underlying enum values. */
FIntVector3 ToIntVector3();

/** Converts this cardinal rotation to an unsigned-degree FRotator. */
FRotator ToRotator() const;

/** Converts this cardinal rotation to a signed-degree FRotator (values in [-180, 180)). */
FRotator ToRotatorNormalized() const;

/** Packs the three components' unsigned-degree bearings into an FVector. */
FVector ToVector() const;

/** Packs the three components' signed-degree bearings into an FVector. */
FVector ToVectorNormalized() const;
```

### Equality / Copy

```cpp
/** Copies this rotation to Other. */
bool CopyTo(FNCardinalRotation& Other) const;

/** Component-wise equality test. */
bool IsEqual(const FNCardinalRotation& Other) const;
```

### Construction

```cpp
/** Builds an FNCardinalRotation by snapping each component of InRotator (unsigned degrees). */
static FNCardinalRotation CreateFrom(const FRotator& InRotator);

/** Builds an FNCardinalRotation by snapping each component of InRotator (signed degrees). */
static FNCardinalRotation CreateFromNormalized(const FRotator& InRotator);
```

### Get Unit Size

Rotates a 2D unit-size footprint by `CardinalDirection`.

```cpp
/**
 * Rotates a 2D unit-size footprint (0, UnitSizeX, UnitSizeY) by CardinalDirection.
 * @param CardinalDirection The cardinal rotation to apply.
 * @param UnitSizeX Size along the local Y axis before rotation.
 * @param UnitSizeY Size along the local Z axis before rotation.
 * @return The footprint vector after applying the rotation.
 */
static FVector GetUnitSize(const FNCardinalRotation& CardinalDirection, const float UnitSizeX, const float UnitSizeY);
```
