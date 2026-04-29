---
sidebar_position: 6
sidebar_label: Widget State
sidebar_class_name: type native-struct
description: A lightweight string/bool/float key-value bag used to snapshot and restore UMG widget state across navigation, layer changes, or save/load.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Widget State

<TypeDetails icon="native-struct" base="struct" type="FNWidgetState" typeExtra="" headerFile="NexusUI/Public/NWidgetState.h" />

A lightweight key-value bag for `bool`, `float`, and `FString` values, used to snapshot and restore UMG widget state across navigation, layer changes, or save/load. Keys are stored in three index-aligned `UPROPERTY` array pairs per type, which keeps the struct `USTRUCT`-friendly without needing a container-of-variants.

Blueprint access is provided through [UNWidgetLibrary](widget-library.md). Persisted snapshots of many widget states live in [FNWidgetStateSnapshot](../editor-types/widget-state-snapshot.md), used by the [UNEditorUtilityWidgetSubsystem](../editor-types/editor-utility-widget-subsystem.md) to restore editor utility widgets across sessions.

## What It Is

- **Three Parallel Bags**: Strings, booleans, and floats each live in their own `Keys` / `Values` array pair. Lookups are linear scans over the keys array.
- **`USTRUCT(BlueprintType)`**: Can be passed across Blueprint boundaries and stored on `UPROPERTY` fields.
- **Self-Logging**: `DumpToLog()` writes every entry to `LogNexusUI` for inspection.

## API

| Method | Effect |
| :-- | :-- |
| `HasString` / `HasBoolean` / `HasFloat` | Returns `true` when a value is stored under `Key`. |
| `GetString(Key)` / `GetBoolean(Key, bDefault=false)` / `GetFloat(Key, Default=0.f)` | Returns the stored value, or the default when missing. |
| `AddString` / `AddBoolean` / `AddFloat` | Appends a new entry without checking for an existing one; returns the new index. |
| `SetString` / `SetBoolean` / `SetFloat` | Updates the entry for `Key` if it exists, otherwise appends. |
| `RemoveString` / `RemoveBoolean` / `RemoveFloat` | Drops the entry for `Key` if present. |
| `ClearStrings` / `ClearBooleans` / `ClearFloats` / `ClearAll` | Empties one or all of the bags. |
| `OverlayState(Other, bShouldReplaceKeys)` | Merges every entry in `Other` into this state. When `bShouldReplaceKeys` is `false` (default), only missing keys are copied — existing keys are left untouched. |
| `DumpToLog` | Writes the entire state to `LogNexusUI` as `Display` log entries. |

:::info

`Add*` methods do **not** check for existing keys — calling `AddString` twice with the same key produces two entries, and subsequent `Get*` calls return the first one. Prefer `Set*` unless you specifically need the append-only behavior (e.g. when bulk-loading from a known-clean source).

:::
