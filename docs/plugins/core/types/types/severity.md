---
sidebar_position: 50
sidebar_label: Severity
sidebar_class_name: type ue-enum
description: Shared severity ladder used across NEXUS for log, message, and developer-overlay classifications.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Severity

<TypeDetails icon="ue-enum" base="UEnum" type="ENSeverity" typeExtra="" headerFile="NexusCore/Public/Types/NSeverity.h" />

A shared severity ladder used across NEXUS for log lines, message classifications, and the [Developer Overlay](../../../ui/types/widgets/developer-overlay.md) border-color resolution in [`FNMultiLineTextBoxCanvasItem`](../../../ui/types/canvas-items/multi-line-text-box-canvas-item.md). Values are ordered from quietest to loudest so callers can do straight numeric comparisons (`if (Current > Threshold)`).

## ENSeverity

```cpp
UENUM(BlueprintType)
enum class ENSeverity : uint8
{
    Info    = 0,
    Message = 1,
    Warning = 2,
    Error   = 3,
    Fatal   = 4
};
```

| Value | Numeric | Typical Use |
| :-- | :-- | :-- |
| `Info` | `0` | Background diagnostic detail — usually not surfaced in UI. |
| `Message` | `1` | Default neutral status. |
| `Warning` | `2` | Recoverable problem worth surfacing. |
| `Error` | `3` | Operation failed; needs developer attention. |
| `Fatal` | `4` | Unrecoverable; the calling subsystem is in a broken state. |

Consumers that aggregate severity across multiple events should track the maximum and reset on the next state transition — see [`FNMultiLineTextBoxCanvasItem::AddSeverity`](../../../ui/types/canvas-items/multi-line-text-box-canvas-item.md) for the canonical pattern.
