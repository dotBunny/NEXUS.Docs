---
sidebar_label: Developer Overlay
sidebar_position: 3
description: An overlay showing the Guardian subsystem's baseline, current UObject count, and next threshold.
---

import TypeDetails from '../../../src/components/TypeDetails';

# Developer Overlay

<TypeDetails icon="ue-widget" base="UNDeveloperOverlay" type="UNGuardianDeveloperOverlay" typeExtra="" headerFile="NexusGuardian/Public/NGuardianDeveloperOverlay.h" />

A live readout of the [UNGuardianSubsystem](types/guardian-subsystem.md) suitable for embedding in a debug HUD or running as an [UNEditorUtilityWidget](/docs/plugins/ui/editor-types/editor-utility-widget/). It surfaces three numbers — current `UObject` count, the baseline captured by `SetBaseline()`, and the value of the next threshold the count is approaching.

The class is `Abstract`; the plugin ships a Blueprint subclass at `/NexusGuardian/WB_NGuardianDeveloperOverlay` that you can wrap as an `UNEditorUtilityWidget` from `Tools > NEXUS > Guardian`, or instantiate at runtime in any UMG hierarchy.

## What It Shows

| Element | Source | Meaning |
| :-- | :-- | :-- |
| **Current** count | `UNGuardianSubsystem::GetLastObjectCount()` | The most recent `UObject` count sampled in tick. |
| **Baseline** count | `UNGuardianSubsystem::GetBaseObjectCount()` | The count latched when [`SetBaseline()`](types/guardian-subsystem.md) was called. Zero until baseline is set. |
| **Next** threshold | The lowest of warning / snapshot / compare that has not yet been crossed. | The number the current count is climbing toward. Falls to `0` once all three have been crossed. |

## Color States

The current and next numbers change color as thresholds are crossed, mirroring the action the [UNGuardianSubsystem](types/guardian-subsystem.md) takes:

| State | Current / Next Color | Next Threshold Shown |
| :-- | :-- | :-- |
| Baseline set, no threshold crossed | White | Warning threshold |
| Warning crossed | Yellow | Snapshot threshold |
| Snapshot crossed | Red | Compare threshold |
| Compare crossed | Blue | `0` (no further action will be taken) |

## Idle vs. Runtime

The overlay runs in one of two states depending on whether a game world is active:

- **Runtime** — A `Game` or `PIE` world has been initialized. The overlay binds to that world's [UNGuardianSubsystem](types/guardian-subsystem.md) and the three numbers reflect its live state.
- **Idle** — No game world is active (e.g. main menu, editor between PIE sessions). The count container is hidden and a banner reads `Only Available At Runtime`.

The overlay subscribes to `OnPostWorldInitialization` and `OnWorldBeginTearDown` and re-binds on its own — there is no manual setup required after the widget is constructed. When multiple `Game`/`PIE` worlds are active simultaneously, all of their subsystems are tracked but only the first one's counts are displayed.

:::tip

The overlay is purely a reader — it does not call `SetBaseline()` or alter any thresholds. Configure thresholds in [Project Settings](project-settings.md), then call `SetBaseline()` from gameplay (or via the [N.Developer.CacheSnapshot](/docs/plugins/core/console-commands.md) console command for ad-hoc use) when you want monitoring to start.

:::
