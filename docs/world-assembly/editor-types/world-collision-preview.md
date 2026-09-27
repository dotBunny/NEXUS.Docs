---
sidebar_class_name: type native-class
description: The editor's view of a level's world collision, derived solely from its baked pool and memoized per world — what the collision visualizer draws and the bone readout samples.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Preview

<TypeDetails icon="native-class" base="class" type="FNWorldCollisionPreview" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/NWorldCollisionPreview.h" />

How the editor reads a level's [world collision](../world-collision.md). World Assembly has one source of world collision: the [pool](../types/world-collision-pool.md) a level's [cache actor](../types/world-collision-cache-actor.md) holds. This class turns it into:

- a single merged mesh, which the [collision visualizer](../editor-mode/world.md#visualizers) draws,
- a BVH over that mesh, which the [bone penetration readout](visualizers/bone-component-visualizer.md) samples.

Both show exactly the geometry an assembly will collide with, because it **is** that geometry, not a reconstruction of it.

It replaced an earlier cache that gathered the live world itself, behind an asynchronous pipeline built to keep a constantly changing source off the draw thread. A baked pool only changes when you bake, so none of that is needed. The merged mesh and BVH are memoized per world, and rebuilt only when the pool changes or an edit to the world invalidates them.

## State

```cpp
enum class EState : uint8
{
	Available,
	NotBaked,
	Stale
};
```

| State | Meaning |
| :-- | :-- |
| `Available` | A current pool supplied every organ, and landscape if it is captured. The mesh and BVH are usable. |
| `NotBaked` | The level has never been baked, has an empty pool, or holds no organs. There is nothing to show. |
| `Stale` | A pool exists but no longer matches the world, and needs re-baking. |

`GetState` is the check behind **every** status display in the editor: the World rail's badge, the cache actor's status line, the visualizer's wireframe and the bones' `Unverified` color. They all read the same memoized answer, so they can't disagree.

:::note[What "stale" draws]

A `Stale` result keeps the mesh that was last built **in this editor session**, rather than clearing it. Otherwise every geometry edit would blank the visualizer while you author. A partial rebuild is refused: drawing some of the level's collision and silently leaving out the rest would be worse than showing a known-old whole. As a result, a level that is **already stale when opened** has nothing built yet, so it shows nothing until it is baked.

:::

## Reading It

```cpp
static const FNRawMesh& GetMesh(const UWorld* World);
static const FNMeshBVH& GetBVH(const UWorld* World);
static EState GetState(const UWorld* World);
static bool IsAvailable(const UWorld* World);
static uint32 GetGeneration(const UWorld* World);
```

- **`GetMesh`** returns the merged, baked mesh.
- **`GetBVH`** returns a BVH over that mesh. It is built lazily, so a level whose bones are never sampled never pays for it.
- **`GetState`** costs one validation pass over the level's filtered actors the first time. After that it is memoized until an edit or a bake invalidates it, which is why it is safe to call from a viewport redraw or an icon attribute.
- **`GetGeneration`** is a counter that goes up whenever the published mesh could differ from a previous read. Anything that memoizes its own derived values (the bone readout does) should key them on it.

## Keeping It Current

```cpp
static void Invalidate(const UWorld* World = nullptr);
static void Register();
static void Unregister();
```

`Register` subscribes to the editor's change events: actor added, actor deleted, finished moving an object, property changed, and undo/redo. Only changes that could alter what a bake would emit count, and a property change counts only when the edit finishes, not while a slider is being dragged. A bake announces itself through [FNWorldCollisionBaker::OnBaked](../types/world-collision-baker.md). `Invalidate` with no world clears every world's cached result.

## Notifying

```cpp
static void NotifyUnavailable(UWorld* World, EState State);
static bool ShouldNotify(const UWorld* World, EState State);
```

`NotifyUnavailable` shows a notification explaining why collision can't be previewed, and offers to bake. It only appears if [`World Collision Unavailable`](../user-settings.md#notifications) is on, and `ShouldNotify` allows it:

- **It fires on change, not on a timer.** `ShouldNotify` returns true when the level first becomes unbaked or stale, and false every time the same condition is seen again. Previously, a ten-second cooldown kept an eight-second notification on screen for as long as the level stayed stale.
- **A bake resets it.** The next edit that invalidates the cache will notify again.
- **One notification per world.** A new one replaces any still showing, and a bake dismisses it.

The collision visualizer is what calls it, when it is created or refreshed while the level is not `Available`.
