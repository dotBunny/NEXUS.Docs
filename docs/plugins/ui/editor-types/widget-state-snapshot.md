---
sidebar_position: 4
sidebar_label: Widget State Snapshot
sidebar_class_name: type native-struct
description: Parallel-arrays snapshot mapping widget identifiers to FNWidgetState bags; the persistent payload of UNEditorUtilityWidgetSubsystem.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Widget State Snapshot

<TypeDetails icon="native-struct" base="struct" type="FNWidgetStateSnapshot" typeExtra="" headerFile="NexusUIEditor/Public/NWidgetStateSnapshot.h" />

A parallel-arrays snapshot of per-widget state used by [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md). Maps widget identifiers (`FName`) to [FNWidgetState](../types/widget-state.md) key-value bags via two index-aligned `UPROPERTY` arrays. The unusual shape — two arrays rather than a `TMap` — is chosen so that `UPROPERTY(config)` serialization remains straightforward and stable across editor sessions.

## What It Is

- **Two Parallel Arrays**: `Identifiers` holds the `FName` keys; `WidgetStates` holds the matching [FNWidgetState](../types/widget-state.md) values at the same index.
- **`USTRUCT(BlueprintType)`**: Can be passed across Blueprint boundaries, though most callers go through the [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md) wrapper.
- **Self-Healing**: When `AddWidgetState` detects an index mismatch between the two arrays after appending, it clears the entire snapshot to prevent silently-corrupted data from persisting into config.

## API

| Method | Effect |
| :-- | :-- |
| `GetCount()` | Number of widget entries in the snapshot. |
| `Clear()` | Empties both parallel arrays. |
| `RemoveAtIndex(Index)` | Removes the entry at `Index` in both arrays. Not bounds-checked. |
| `GetIdentifierIndex(Identifier)` | Returns the index for `Identifier`, or `INDEX_NONE`. |
| `AddWidgetState(Identifier, WidgetState)` | Updates in place when the identifier exists, otherwise appends. Returns `true` always. Triggers a `Clear()` if the parallel arrays drift out of sync. |
| `DuplicateWidgetState(Identifier, WidgetState)` | Convenience alias for `AddWidgetState` for code paths that are conceptually cloning state. |
| `RemoveWidgetState(Identifier)` | Returns `true` if an entry was removed, `false` if `Identifier` was unknown. |
| `UpdateWidgetState(Identifier, WidgetState)` | Replaces the existing entry. Returns `false` and logs a warning if `Identifier` is unknown. |
| `HasWidgetState(Identifier)` | Returns `true` when an entry exists. |
| `GetWidgetState(Identifier)` | Returns a mutable reference. **Not bounds-checked** — guard with `HasWidgetState` first. |
| `DumpToLog()` | Writes every identifier and its bag contents to `LogNexusUIEditor`. |

:::info

Most code should not interact with `FNWidgetStateSnapshot` directly — it is the persisted payload that lives behind [UNEditorUtilityWidgetSubsystem](editor-utility-widget-subsystem.md), which exposes the same API as method calls. Reach for the struct only when you need to bulk-mutate or inspect the entire snapshot at once (e.g. for diagnostics or a custom serializer).

:::
