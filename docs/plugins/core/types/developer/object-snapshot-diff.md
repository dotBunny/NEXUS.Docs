---
sidebar_position: 16
sidebar_label: Object Snapshot Diff
sidebar_class_name: type native-struct
description: The result of diffing two FNObjectSnapshots.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Object Snapshot Diff

<TypeDetails icon="native-struct" base="struct" type="FNObjectSnapshotDiff" typeExtra="" headerFile="NexusCore/Public/Developer/NObjectSnapshotDiff.h" />

The result of diffing two [`Object Snapshots`](object-snapshot.md). Produced by [`FNObjectSnapshotUtils::Diff()`](object-snapshot-utils.md), this struct records which `UObjects` were added between captures, which persisted across both captures, and which disappeared. It is the primary data surface used by tests, the [Guardian](../../../guardian/index.mdx) overlay, and developer tools to reason about lifetime churn and suspected leaks.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `UntrackedObjectCountA` | `int32` | Number of untracked objects recorded in the earlier (A) snapshot. |
| `UntrackedObjectCountB` | `int32` | Number of untracked objects recorded in the later (B) snapshot. |
| `ChangeCount` | `int32` | Total of added plus removed entries — the net amount of churn between snapshots. |
| `ObjectCount` | `int32` | Total number of entries examined across both snapshots. |
| `Added` | `TArray<`[`FNObjectSnapshotEntry`](object-snapshot-entry.md)`>` | Entries that appear only in the later snapshot. |
| `AddedCount` | `int32` | Size of the `Added` array. |
| `Maintained` | `TArray<`[`FNObjectSnapshotEntry`](object-snapshot-entry.md)`>` | Entries that appear in both snapshots. |
| `MaintainedCount` | `int32` | Size of the `Maintained` array. |
| `Removed` | `TArray<`[`FNObjectSnapshotEntry`](object-snapshot-entry.md)`>` | Entries that appear only in the earlier snapshot. |
| `RemovedCount` | `int32` | Size of the `Removed` array. |

## Methods

### To String

Returns a one-line summary suitable for logs and overlays.

```cpp
FString ToString() const;
```

```txt title="Example Output"
Total 4287 (24 Changes | 0 Previously Untracked | 0 Currently Untracked) - Added 18 / Maintained 4263 / Removed 6
```

### To Detailed String

Returns a multi-line summary that enumerates every Added, Maintained, and Removed entry.

```cpp
FString ToDetailedString() const;
```

### Dump To Log

Writes a detailed summary of the diff to `LogNexusCore`, one category and one entry per line.

```cpp
void DumpToLog() const;
```
