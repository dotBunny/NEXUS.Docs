---
sidebar_position: 19
sidebar_label: Object Snapshot Utils
sidebar_class_name: type native-class
description: Entry points for capturing and comparing UObject snapshots.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Object Snapshot Utils

<TypeDetails icon="native-class" base="class" type="FNObjectSnapshotUtils" typeExtra="" headerFile="NexusCore/Public/Developer/NObjectSnapshotUtils.h" />

Entry points for capturing and comparing `UObject` snapshots. The full snapshot pipeline is process-global state held as static members on this class: `Snapshot()` walks the global object array to produce an [`Object Snapshot`](object-snapshot.md), `Diff()` compares two snapshots into an [`Object Snapshot Diff`](object-snapshot-diff.md), and the on-disk helpers provide a coarse way to persist a baseline snapshot across editor sessions or commandlet runs.

:::info

To trigger snapshot capture interactively, see the [Console Commands](../../console-commands.md) page.

:::

## Methods

### Take Ticket

Produces the next monotonic ticket number used to tag new snapshots.

```cpp
static int32 TakeTicket();
```

### Snapshot

Walks the global `UObject` array and captures a new [`Object Snapshot`](object-snapshot.md). Game-thread only; this function mutates static state and allocates.

```cpp
/**
 * Walks the global UObject array and captures a new FNObjectSnapshot.
 * @return The captured snapshot; its Ticket field is set from TakeTicket().
 * @note Game-thread only; this function mutates static state and allocates.
 */
static FNObjectSnapshot Snapshot();
```

### Diff

Computes the diff between two snapshots.

```cpp
/**
 * Computes the diff between two snapshots.
 * @param OldSnapshot The earlier (baseline) snapshot.
 * @param NewSnapshot The later snapshot.
 * @param bRemoveKnownLeaks Remove entries classified as known-leaks from the result if true.
 * @return A fully populated FNObjectSnapshotDiff describing the Added/Maintained/Removed sets.
 */
static FNObjectSnapshotDiff Diff(const FNObjectSnapshot& OldSnapshot, const FNObjectSnapshot& NewSnapshot, bool bRemoveKnownLeaks = false);
```

Snapshots are now passed by `const` reference and walked with a consumed-set model — entries are matched and removed from working sets as the diff is built rather than being copied between intermediate arrays. The result is the same `FNObjectSnapshotDiff`, just produced with materially less allocation and copying on large snapshots.

### Remove Known Leaks

Strips known-leak entries from a diff in place so only real churn remains.

```cpp
static void RemoveKnownLeaks(FNObjectSnapshotDiff& Diff);
```

### Persistence Helpers

Coarse helpers that mirror the [`N.Developer.*` console commands](../../console-commands.md) — the on-disk snapshot is shared with that workflow.

```cpp
/** Captures a snapshot and persists it to disk so it can be restored in a later session. */
static void SnapshotToDisk();

/** Releases the in-memory cached snapshot held by CacheSnapshot(). */
static void ClearCachedSnapshot();

/** Captures a snapshot and caches it in memory for later use by CompareSnapshotToDisk(). */
static void CacheSnapshot();

/** Compares the cached in-memory snapshot to the last one written to disk and logs the result. */
static void CompareSnapshotToDisk();
```
