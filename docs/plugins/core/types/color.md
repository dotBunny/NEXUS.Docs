---
sidebar_position: 9
sidebar_label: Color
sidebar_class_name: type native-class
description: A collection of color values used throughout the NEXUS modules.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Color

<TypeDetails icon="native-class" base="class" type="FNColor" typeExtra="" headerFile="NexusCore/Public/NColor.h" />

A collection of color values used throughout the NEXUS modules. `FNColor` centralises the framework's palette so that debug drawing, editor tooling, and runtime UI can share a consistent look. Callers can either use the strongly-typed `FLinearColor` constants (preferred in C++) or resolve a color by `ENColor` value at runtime.

## ENColor

A named enumeration of the colors made available by `FNColor`. Each value maps to a matching `FLinearColor` constant on `FNColor` and is used so Blueprint-facing APIs and pickers can surface the curated NEXUS palette without exposing raw color values.

```cpp
UENUM(BlueprintType)
enum class ENColor : uint8
{
  NC_Black            UMETA(DisplayName = "Black"),
  NC_White            UMETA(DisplayName = "White"),
  NC_GreyLight        UMETA(DisplayName = "Light Grey"),
  NC_GreyDark         UMETA(DisplayName = "Dark Grey"),

  NC_BlueLight        UMETA(DisplayName = "Light Blue"),
  NC_BlueMid          UMETA(DisplayName = "Mid Blue"),
  NC_BlueDark         UMETA(DisplayName = "Dark Blue"),

  NC_GreenLight       UMETA(DisplayName = "Light Green"),
  NC_GreenMid         UMETA(DisplayName = "Mid Green"),
  NC_GreenDark        UMETA(DisplayName = "Dark Green"),

  NC_Red              UMETA(DisplayName = "Red"),
  NC_Orange           UMETA(DisplayName = "Orange"),
  NC_Yellow           UMETA(DisplayName = "Yellow"),
  NC_Green            UMETA(DisplayName = "Green"),
  NC_Pink             UMETA(DisplayName = "Pink"),

  NC_NexusDarkBlue    UMETA(DisplayName = "NEXUS | Dark Blue"),
  NC_NexusLightBlue   UMETA(DisplayName = "NEXUS | Light Blue"),
  NC_NexusBlack       UMETA(DisplayName = "NEXUS | Black"),
  NC_NexusPink        UMETA(DisplayName = "NEXUS | Pink"),

  NC_HalfBlack        UMETA(DisplayName = "Half Black"),
  NC_QuarterBlack     UMETA(DisplayName = "Quarter Black"),

  NC_Transparent      UMETA(DisplayName = "Transparent")
};
```

## Methods

### Get Linear Color

Resolves an `ENColor` enumeration value to its matching linear color.

```cpp
static FLinearColor GetLinearColor(const ENColor& Color);
```

### Get Color

Resolves an `ENColor` enumeration value to its matching sRGB color.

```cpp
static FColor GetColor(const ENColor& Color);
```

## Constants

Strongly-typed `constexpr FLinearColor` constants for the curated NEXUS palette — preferred in C++ over `ENColor` lookups.

| Constant | Use |
| :-- | :-- |
| `BlueDark`, `BlueMid`, `BlueLight` | Branded blue variants |
| `GreenDark`, `GreenMid`, `GreenLight` | Branded green variants |
| `Pink`, `Yellow`, `Orange` | Accent colors |
| `GreyLight`, `GreyDark` | Neutral greys |
| `NexusDarkBlue`, `NexusLightBlue`, `NexusBlack`, `NexusPink` | Logo / brand colors |
| `HalfBlack`, `QuarterBlack` | Translucent overlays |
| `Transparent` | Fully transparent |
| `SortElement`, `FilterElement`, `GetElement` | Tooling-specific accents |
