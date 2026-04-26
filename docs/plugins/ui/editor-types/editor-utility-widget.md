---
sidebar_position: 2
sidebar_label: Editor Utility Widget
sidebar_class_name: type ue-widget
description: An extension on UEditorUtilityWidget providing a custom tab icon, deferred post-construct work, and cross-session state persistence via UNEditorUtilityWidgetSubsystem.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Utility Widget

<TypeDetails icon="ue-widget" base="UEditorUtilityWidget" type="UNEditorUtilityWidget" typeExtra="" headerFile="NexusUIEditor/Public/NEditorUtilityWidget.h" />

An extension on `UEditorUtilityWidget` that fills in three gaps in the stock implementation: tab presentation (custom icon and identifier), a deferred construct step that runs one frame after `NativeConstruct` so layout is finished, and integration with [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md) so widget state and tab placement survive editor sessions.

## What It Does

- **Tab Customization**: `TabIconStyle` and `TabIconName` resolve to an `FSlateIcon` applied to the hosting `SDockTab`. `bRemoveWorkspaceItem` controls whether the tab can be re-spawned from the workspace menu after closing.
- **Deferred Construction**: Schedules `DelayedConstructTask` via `UAsyncEditorDelay` to run one frame after `NativeConstruct`, so any widget state restored by the subsystem is applied after the layout has settled. This is also why `UnitScale` is only valid after the construction frame.
- **Persistent State**: When `bIsPersistent` is `true`, the widget registers its `UniqueIdentifier` with [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md) on construct and pulls back any cached [FNWidgetState](../types/widget-state.md). `bHasPermanentState` controls whether the cached state should be discarded when the host tab is closed.

## Spawning In A Tab

```cpp
/**
 * Spawn the editor utility widget asset found at ObjectPath inside its own dock tab.
 * @param ObjectPath Object path to the UEditorUtilityWidgetBlueprint asset to spawn.
 * @param Identifier Optional tab identifier override; defaults to NAME_None meaning the subsystem chooses one.
 * @return The instantiated UEditorUtilityWidget hosted by the spawned tab, or nullptr on failure.
 */
static UEditorUtilityWidget* SpawnTab(const FString& ObjectPath, FName Identifier = NAME_None);
```

Use `SpawnTab` rather than constructing the widget directly when you want it docked alongside other editor tabs — the helper resolves the asset, opens a new `SDockTab`, and asks [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md) to record the tab/widget mapping for later restoration.

## State API

### Is Persistent

```cpp
/** @return True when the widget opts in to cross-session state persistence via the widget subsystem. */
UFUNCTION(BlueprintCallable)
bool IsPersistent() const;
```

### Get Unique Identifier

```cpp
/** @return The widget's stable identifier used as the key when storing/restoring persistent state. */
UFUNCTION(BlueprintCallable)
FName GetUniqueIdentifier() const;
```

### Get Tab Identifier

```cpp
/** @return The tab identifier the widget was most recently hosted under, or NAME_None if not tabbed. */
UFUNCTION(BlueprintCallable)
FName GetTabIdentifier() const;
```

## Class Defaults

The following `UPROPERTY` fields are exposed for editing in any Blueprint subclass:

| Property | Category | Purpose |
| :-- | :-- | :-- |
| `bIsPersistent` | State | Toggle persistent state tracking via [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md). |
| `bHasPermanentState` | State | When `false`, cached state is discarded on tab close. |
| `UniqueIdentifier` | State | Stable `FName` key used by the subsystem to match this widget to its stored state. |
| `TabIconStyle` | Tab | Slate style set that owns the tab icon brush (e.g. `FNUIEditorStyle::GetStyleSetName()`). |
| `TabIconName` | Tab | Brush name inside `TabIconStyle` to use as the dock tab icon. |
| `bRemoveWorkspaceItem` | Tab | When `true`, the tab is removed from the workspace menu on close so it can't be re-spawned accidentally. |
| `UnitScale` | Info | `FVector2D` available after the construction frame; useful for scale-aware widget logic. |

:::warning

`UnitScale` is only valid after `DelayedConstructTask` runs — i.e. one frame after `NativeConstruct`. Reading it during `NativeConstruct` returns the default `FVector2D::One()` rather than the actual scale.

:::
