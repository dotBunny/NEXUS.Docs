---
sidebar_class_name: type native-class
description: Entry points for capturing and comparing UObject snapshots.
---

import TypeDetails from '@site/src/components/TypeDetails';

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

Two kinds of entry are dropped. The first is a short list of named engine singletons that appear once and never go away — `/Script/Engine`, `/Script/InputCore`, `ChaosEventRelay`, `NiagaraComponentPool`, and the `UBodySetup` a `UBoxComponent` lazily creates in the transient package the first time one registers with physics.

The second is anything carrying `RF_WasLoaded` — an object the engine serialised off disk. A test that touches an asset for the first time pays to load it, and the asset then stays resident for the rest of the editor session by design: `RF_Standalone` is exactly the flag that survives the garbage collection pass [`WorldTestChecked`](test-utils.md) runs before it compares snapshots. The most common source is a component whose `OnRegister` pulls in its editor icon via `N_WORLD_ICON_ON_REGISTER`, which drags in the texture, its package, and the texture's import metadata.

:::note[Loaded assets give themselves away by being order-dependent]

If an asset really were leaking, every test that touched it would report it. Instead only the *first* one does — every test after it passes, because the package is already resident. That asymmetry is the signature of a first-touch load, and no real leak has it.

The rule only ever covers the asset and its package. Objects a test allocates — spawned actors, `NewObject`'d components, the body setups above — are never loaded, so they never carry the flag and stay reportable.

:::

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
