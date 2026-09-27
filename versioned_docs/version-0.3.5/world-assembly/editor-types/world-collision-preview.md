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

`GetState` is the one memoized answer the visualizer and the bone readout both consult, so they can't disagree about whether the level is showable.

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
```

Shows a notification explaining why collision can't be previewed, and offers to bake. In 0.3.5 it is **rate-limited**: at most once every ten seconds per world. The collision visualizer and the bone visualizer both call it whenever they find the level not `Available`, and the bone visualizer does so on every viewport redraw. As a result, a stale level keeps a notification on screen most of the time, even if you are only looking at a selected bone. 0.4.0 changes this to notify once when the level becomes stale.
