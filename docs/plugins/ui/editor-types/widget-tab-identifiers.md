---
sidebar_position: 5
sidebar_label: Widget Tab Identifiers
sidebar_class_name: type native-struct
description: Parallel-arrays map of widget identifier to host tab identifier, persisted so editor utility widgets can be restored into the same tab across sessions.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Widget Tab Identifiers

<TypeDetails icon="native-struct" base="struct" type="FNWidgetTabIdentifiers" typeExtra="" headerFile="NexusUIEditor/Public/NWidgetTabIdentifiers.h" />

A parallel-arrays map of widget identifier to host tab identifier. Stored in the `NexusUserSettings` config so that [UNEditorUtilityWidget](editor-utility-widget.md) instances can be restored into the same docked tab across editor sessions. The two arrays are kept index-aligned by [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md), which is the only code that should mutate them directly.

## Layout

```cpp
USTRUCT(BlueprintType)
struct FNWidgetTabIdentifiers
{
    /** Widget identifiers (UNEditorUtilityWidget::UniqueIdentifier); parallel to TabIdentifier. */
    UPROPERTY()
    TArray<FName> WidgetIdentifiers;

    /** Tab identifiers last used to host each widget; parallel to WidgetIdentifiers. */
    UPROPERTY()
    TArray<FName> TabIdentifier;
};
```

The struct itself is intentionally minimal — all reads and writes go through the get / set / remove helpers on [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md), which keep the two arrays in sync.

:::info

The same parallel-array shape used here and in [FNWidgetStateSnapshot](widget-state-snapshot.md) is chosen so that `UPROPERTY(config)` serialization stays simple and the on-disk format remains readable across versions of the engine.

:::
