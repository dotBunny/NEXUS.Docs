---
sidebar_position: 6
description: Per-user editor preferences for World Assembly, persisted outside project config.
tags: [0.3.2]
---

import TypeDetails from '../../../src/components/TypeDetails';

# User Settings

Per-user editor preferences for World Assembly. Unlike the shared [Project Settings](project-settings.md), these are machine-local and stored in `NexusUserSettings.ini`, so each developer keeps their own values and they do not leak into source control.

From the `Edit > Editor Preferences` window, find the **World Assembly** section.

![World Assembly Editor Preferences User](world-assembly-editor-preferences-user.webp)

## Configuration Options

### Cell

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Display Viewport Messages` | `bool` | Show alerts and HUD messages in the viewport while editing cells. | `true` |

### Operations

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Show Quick Assembly Section` | `bool` | Show the Quick Assembly section — an Organ dropdown plus a start/cancel button — on the [World Assembly toolbar](editor-mode/organ-editor.md). | `true` |

### Junctions

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Draw Unfilled Junctions` | `bool` | Draw debug markers for unfilled (unconnected) [junctions](types/junction-component.md) in the world preview. | `true` |
| `Unfilled Junctions Color` | `FLinearColor` | Color used to draw the unfilled junction markers when `Draw Unfilled Junctions` is enabled. | `Gray` |

## See Also

- [Project Settings](project-settings.md) — shared, project-wide World Assembly configuration saved to project config.
