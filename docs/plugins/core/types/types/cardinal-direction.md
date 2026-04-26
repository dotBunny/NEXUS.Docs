---
sidebar_position: 41
sidebar_label: Cardinal Direction
sidebar_class_name: type native-class
description: 16-wind compass direction enum and conversion helpers.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Cardinal Direction

<TypeDetails icon="native-class" base="class" type="FNCardinalDirectionUtils" typeExtra="" headerFile="NexusCore/Public/Types/NCardinalDirection.h" />

Conversion helpers between decimal-degree angles and `ENCardinalDirection` values, plus a namespace of `constexpr` constants for the 16-wind compass rose. Decimal-degree values in `[0, 360)` express the absolute-bearing form; the `*Normalized` variants express the equivalent bearing in `[-180, 180)`, matching how `FRotator` reports yaw.

## ENCardinalDirection

16-wind compass direction enum, ordered clockwise starting at North = 0.

```cpp
UENUM()
enum class ENCardinalDirection : uint8
{
    North = 0,
    NorthNorthEast = 1,
    NorthEast = 2,
    EastNorthEast = 3,
    East = 4,
    EastSouthEast = 5,
    SouthEast = 6,
    SouthSouthEast = 7,
    South = 8,
    SouthSouthWest = 9,
    SouthWest = 10,
    WestSouthWest = 11,
    West = 12,
    WestNorthWest = 13,
    NorthWest = 14,
    NorthNorthWest = 15,
};
```

## NEXUS::Core::CardinalDirection

Decimal-degree constants for the 16-wind compass rose. `North = 0.0f`, each step is `22.5°`.

## Methods

### Is Cardinal Angle

Returns true when `Angle` lies exactly on one of the 16 cardinal headings.

```cpp
static bool IsCardinalAngle(const float Angle);
```

### Get Closest Cardinal Angle

Snaps `Angle` to the nearest 22.5° cardinal heading.

```cpp
static double GetClosestCardinalAngle(const float Angle);
```

### Get Closest Cardinal Rotator

Per-component cardinal snap of `Rotator`'s Pitch, Yaw, and Roll.

```cpp
static FRotator GetClosestCardinalRotator(const FRotator& Rotator);
```

### To Cardinal Direction

Maps a `[0, 360)` angle (or `[-180, 180)` for the normalized variant) to its `ENCardinalDirection` value.

```cpp
static ENCardinalDirection ToCardinalDirection(const float Angle);
static ENCardinalDirection ToCardinalDirectionNormalized(const float NormalizedAngle);
```

### To Decimal Degrees

Returns the decimal-degree bearing of `CardinalDirection`. Use `ToDecimalDegreesNormalized` for signed `[-180, 180)` output.

```cpp
static float ToDecimalDegrees(const ENCardinalDirection CardinalDirection);
static float ToDecimalDegreesNormalized(const ENCardinalDirection CardinalDirection);
```

## See Also

- [Cardinal Rotation](cardinal-rotation.md) — three-component rotation built from `ENCardinalDirection`.
