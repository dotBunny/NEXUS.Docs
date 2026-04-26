---
sidebar_position: 3
sidebar_label: Editor Utility Widget Subsystem
sidebar_class_name: type ue-world-subsystem
description: Editor subsystem that persists per-widget state and tab placement for UNEditorUtilityWidgets across editor sessions.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Utility Widget Subsystem

<TypeDetails icon="ue-world-subsystem" base="UEditorSubsystem" type="UNEditorUtilityWidgetSubsystem" typeExtra="" headerFile="NexusUIEditor/Public/NEditorUtilityWidgetSubsystem.h" />

A `UEditorSubsystem` that stores per-widget state ([FNWidgetState](../types/widget-state.md) bags) and widget-to-tab mappings across editor sessions. The state itself is persisted via `UPROPERTY(config)` into the `NexusUserSettings` config, so a [UNEditorUtilityWidget](editor-utility-widget.md) can be torn down and re-spawned (or the editor restarted) with its prior state intact.

The subsystem also tracks which editor tab last hosted each widget so utility widgets can be re-opened into the same tab layout next session — the mapping is stored in [FNWidgetTabIdentifiers](widget-tab-identifiers.md) and the state bags themselves in [FNWidgetStateSnapshot](widget-state-snapshot.md).

## What It Does

- **Persists Widget State**: Each widget identifies itself with a stable `FName` (typically `UNEditorUtilityWidget::UniqueIdentifier`); the subsystem keys an `FNWidgetState` bag against it and writes the lot to the `NexusUserSettings` config.
- **Tracks Live Instances**: Widgets register themselves in `NativeConstruct` and unregister in `NativeDestruct`. The subsystem holds a transient `TMap<FName, TObjectPtr<UNEditorUtilityWidget>>` for currently-alive instances so it can push cached state back into them before they go live.
- **Restores Tab Placement**: The widget-to-tab map lets editor utility widgets reopen into the same docked tab they were closed from.

## Widget State API

### Add Widget State

```cpp
/**
 * Store a new FNWidgetState under Identifier; overwrites any existing entry.
 * @param Identifier   Stable widget key (typically UNEditorUtilityWidget::UniqueIdentifier).
 * @param WidgetState  Key-value bag to persist.
 */
void AddWidgetState(const FName& Identifier, const FNWidgetState& WidgetState);
```

### Update Widget State

```cpp
/**
 * Replace the stored state for Identifier with WidgetState; logs a warning if the widget is unknown.
 */
void UpdateWidgetState(const FName& Identifier, const FNWidgetState& WidgetState);
```

### Remove Widget State

```cpp
/** Discard the stored state associated with Identifier. */
void RemoveWidgetState(const FName& Identifier);
```

### Has Widget State

```cpp
/** @return True when a state bag exists for Identifier. */
bool HasWidgetState(const FName& Identifier) const;
```

### Get Widget State

```cpp
/**
 * Retrieve a reference to the stored state for Identifier.
 * @note Not bounds-checked; callers must ensure HasWidgetState first.
 */
FNWidgetState& GetWidgetState(const FName& Identifier);
```

## Live Instance API

### Register Widget

```cpp
/**
 * Register a live widget instance with the subsystem so state can be pushed into it.
 * Keyed by Widget->GetUniqueIdentifier().
 */
void RegisterWidget(UNEditorUtilityWidget* Widget);
```

### Unregister Widget

```cpp
/** Drop a previously-registered widget; safe to call with widgets that were never registered. */
void UnregisterWidget(const UNEditorUtilityWidget* Widget);
```

### Get Widget

```cpp
/** @return The widget if currently alive and registered, nullptr otherwise. */
UNEditorUtilityWidget* GetWidget(const FName& Identifier);
```

### Has Widget

```cpp
/** @return True when a widget with Identifier is currently registered as live. */
bool HasWidget(const FName& Identifier);
```

## Tab Identifier API

### Get Tab Identifier

```cpp
/**
 * Resolve the tab identifier most recently associated with WidgetIdentifier so the widget can
 * be re-spawned into the same tab on restore.
 * @return The associated tab identifier, or NAME_None if none is known.
 */
FName GetTabIdentifier(FName WidgetIdentifier);
```

### Set Tab Identifier

```cpp
/** Record that a widget is currently hosted under TabIdentifier. */
void SetTabIdentifier(FName WidgetIdentifier, FName TabIdentifier);
```

### Remove Tab Identifier

```cpp
/** Drop any tab-identifier mapping for WidgetIdentifier (e.g. when the user closes the tab permanently). */
void RemoveTabIdentifier(FName WidgetIdentifier);
```

:::warning

`GetWidgetState` is **not** bounds-checked — calling it with an unknown identifier asserts. Always guard with `HasWidgetState` first.

:::
