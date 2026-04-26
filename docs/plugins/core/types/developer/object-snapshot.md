---
sidebar_position: 15
sidebar_label: Object Snapshot
sidebar_class_name: type native-struct
description: A captured, point-in-time record of the UObjects alive in the global object array.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Object Snapshot

<TypeDetails icon="native-struct" base="struct" type="FNObjectSnapshot" typeExtra="" headerFile="NexusCore/Public/Developer/NObjectSnapshot.h" />

A captured, point-in-time record of the `UObjects` alive in the global object array. Created by [`FNObjectSnapshotUtils::Snapshot()`](object-snapshot-utils.md). Pairs of snapshots can be diffed via [`FNObjectSnapshotUtils::Diff()`](object-snapshot-utils.md) to produce a [`Object Snapshot Diff`](object-snapshot-diff.md) describing what appeared or disappeared between captures — the core primitive used by the framework's leak-detection tooling.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Ticket` | `int32` | Monotonic identifier assigned when the snapshot was produced; `-1` for an uninitialized snapshot. |
| `CapturedObjectCount` | `int32` | Number of `UObjects` whose details were recorded in `CapturedObjects`. |
| `UntrackedObjectCount` | `int32` | Number of `UObjects` that were visible to the scan but deliberately not tracked. |
| `CapturedObjects` | `TArray<`[`FNObjectSnapshotEntry`](object-snapshot-entry.md)`>` | The recorded per-`UObject` entries captured at snapshot time. |

## Methods

### Reset

Restores the snapshot to an empty, uninitialized state, freeing the `CapturedObjects` array.

```cpp
void Reset();
```

### To String

Returns a one-line textual summary of the snapshot's capture counts.

```cpp
FString ToString() const;
```

```txt title="Example Output"
Captured 4287 Objects (12 Untracked)
```

### To Detailed String

Returns a multi-line textual summary that includes every captured entry's description.

```cpp
FString ToDetailedString() const;
```

### Dump To Log

Writes a detailed summary of the snapshot to `LogNexusCore`, one entry per line.

```cpp
void DumpToLog();
```
