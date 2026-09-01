---
sidebar_class_name: type native-class
description: Static class owning the per-actor selection lock — the meta-data it persists to, the cache it reads from, and the component flag it applies.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Selection Lock

<TypeDetails icon="native-class" base="class" type="FNSelectionLock" typeExtra="" headerFile="NexusToolingEditor/Public/SelectionLock/NSelectionLock.h" />

Static class implementing [Selection Lock](../../enhancements/selection-lock.md): the per-actor flag that keeps an actor from being picked by clicking it in a level viewport. The tooling module initializes it on startup and shuts it down on exit; the [column](selection-lock-column.md) and the [context menu entry](selection-lock-menu.md) are its two front ends.

## How It Works

A locked actor has `bSelectable` cleared on every one of its `UPrimitiveComponent`s. That flag is read into the primitive's scene proxy, and the renderer's hit-proxy pass skips primitives whose proxy reports itself unselectable — so the actor never enters the hit-proxy buffer, and a viewport click resolves to whatever is behind it instead.

This is why marquee selection still catches a locked actor: box and frustum selection are geometry-based and never consult hit proxies. It is also why a locked actor draws no selection outline and does not highlight on hover — both read the same flag.

## Persistence

The authoritative state is package meta-data written against the actor under the key `NexusSelectionLocked`. Meta-data is editor-only, stripped at cook, invisible in the Details panel, and saved with the package the actor lives in — the level, or under **World Partition** the actor's own external package.

The meta-data is the **record** of the lock. `bSelectable` is only ever the live application of it, and the two are deliberately kept from becoming a second, driftable copy of each other: the flag is lifted off the components before a save and put back after, so the cleared value never reaches the package.

A live `TSet<FObjectKey>` sits in front of the meta-data as the read path. Meta-data is keyed by `FSoftObjectPath`, which is too expensive to query once per Outliner row per frame.

### Re-Application

`bSelectable` cannot survive on its own. It is a bare `UPROPERTY` carrying neither `CPF_Edit` nor `CPF_Interp`, and `FComponentInstanceDataCache` skips exactly those — so any rebuild of the components brings them back selectable. The lock is therefore re-asserted from meta-data on every event that rebuilds them:

| Event | Handler | Catches |
| :-- | :-- | :-- |
| Map opened | `OnMapOpened` | The initial restore for the whole world. |
| Actor added | `OnLevelActorAdded` | Spawning, pasting, streaming in. |
| Level added | `OnLevelAddedToWorld` | Sublevels and level instances. |
| Objects replaced | `OnObjectsReplaced` | Blueprint recompile reinstancing, **and construction-script reruns**. |
| Post save | `OnPostSaveWorld` | Putting the flag back after the save lifted it. |
| Post undo/redo | `OnPostUndoRedo` | A rolled-back transaction that happened to capture `bSelectable`. |

Construction-script reruns are the case that matters most, and the easiest to miss — moving a Blueprint actor, editing one of its properties, or simply loading a map while static meshes are still compiling all trigger one.

## Public API

### Can Lock

```cpp
/**
 * Can this actor hold a selection lock?
 * @param Actor The actor to test.
 * @return true when the actor has at least one primitive component for the lock to act on.
 */
static bool CanLock(const AActor* Actor);
```

### Is Locked

```cpp
/**
 * Is this actor currently selection-locked?
 * @param Actor The actor to test.
 * @return true when the actor is locked.
 */
static bool IsLocked(const AActor* Actor);
```

### Set Locked

```cpp
/**
 * Lock or unlock a single actor, writing the change through to package meta-data.
 * @param Actor The actor to change.
 * @param bLocked The lock state to apply.
 */
static void SetLocked(AActor* Actor, bool bLocked);
```

### Toggle Locked

```cpp
/**
 * Flip a group of actors as one. The group locks unless every lockable actor in it is already
 * locked, so a mixed selection resolves to locked rather than splitting.
 * @param Actors The actors to toggle.
 */
static void ToggleLocked(const TArray<AActor*>& Actors);
```

### Unlock All

```cpp
/**
 * Clear every selection lock in a world.
 * @param World The world to sweep; nothing happens when null.
 * @return The number of actors that were unlocked.
 */
static int32 UnlockAll(UWorld* World);
```

:::note

`Initialize` is only called when the `Selection Lock > Enabled` project setting is on. That setting is marked `ConfigRestartRequired`, so it is read once at startup and cannot change while the editor is running. With the feature off nothing is bound and no lock is applied, but the meta-data is left exactly as it is — turning it back on restores every lock.

:::

:::warning

Locking is not undoable. Package meta-data is outside the transaction system, so a lock cleared by mistake has to be set again by hand. That is separate from undo *stripping* a lock, which no longer happens — an undo that rolls back a transaction which happened to capture `bSelectable` is followed by a re-assert from meta-data.

:::

:::warning Nanite

A Nanite mesh cannot be locked against clicking. Nanite resolves hit proxies through its own pass, reading a per-material hit-proxy table rather than the mesh batches `bSelectable` gates, so a locked Nanite mesh still resolves a hit proxy and still selects. The [column](selection-lock-column.md) and [menu](selection-lock-menu.md) tooltips say so.

:::
