---
sidebar_position: 8
sidebar_label: Style Library
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-visible style constants for NEXUS-branded warning/error/info UI treatments.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Style Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNStyleLibrary" typeExtra="" headerFile="NexusUI/Public/NStyleLibrary.h" />

A `UBlueprintFunctionLibrary` exposing the canonical NEXUS warning, error, and informational accent colors as `BlueprintPure` getters. Returns `ENColor` values rather than `FLinearColor` so downstream widgets can resolve the exact palette entry through `FNColor` at the last moment — useful when the same swatch needs to render in slightly different contexts.

## What It Is

- **Three Treatments**: Each of `Warning` / `Error` / `Info` exposes an accent color, a paired foreground color (typically text/icons), and a paired background color.
- **Palette-Aware**: All getters return `ENColor` enum values, leaving the final `FLinearColor` resolution to whoever consumes them.
- **Fixed Mappings**: The values below are baked into the library; consumers who need different swatches should build their own palette function rather than overriding these.

## Color Treatments

| Treatment | Accent | Foreground | Background |
| :-- | :-- | :-- | :-- |
| Warning | `NC_Orange` | `NC_White` | `NC_Orange` |
| Error | `NC_Red` | `NC_White` | `NC_Red` |
| Info | `NC_BlueDark` | `NC_White` | `NC_BlueDark` |

## UFunctions

All functions live in the `NEXUS|User Interface|Style` category and are `BlueprintPure`.

### Warning

- `GetWarningColor()` — returns the accent.
- `GetWarningForegroundColor()` — returns the paired foreground.
- `GetWarningBackgroundColor()` — returns the paired background.

### Error

- `GetErrorColor()` — returns the accent.
- `GetErrorForegroundColor()` — returns the paired foreground.
- `GetErrorBackgroundColor()` — returns the paired background.

### Info

- `GetInfoColor()` — returns the accent.
- `GetInfoForegroundColor()` — returns the paired foreground.
- `GetInfoBackgroundColor()` — returns the paired background.
