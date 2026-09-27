---
sidebar_class_name: type ue-actor
description: Level-scoped holder for the baked world-collision pool — one per level, created by a bake, never placed by hand.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Cache Actor

<TypeDetails icon="ue-actor" base="AInfo" type="ANWorldCollisionCacheActor" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionCacheActor.h" />

The level's holder for its baked [world collision](../world-collision.md): one per level, holding one [FNWorldCollisionPool](world-collision-pool.md). Its class displays as **NEXUS | World Collision Cache**.

- **It is created by a bake.** The class is `NotPlaceable` and `NotBlueprintable`. A bake (from the [World rail](../editor-mode/world.md#cache), a level save, or an organ's details panel) creates it when needed and finds it again by searching the level.
- **It holds no authored state.** Deleting it loses nothing you made. It costs one re-bake.
- **It is an actor so that it gets its own package.** The cache could have lived on `AWorldSettings`, but as an actor, World Partition gives it its own external package. Otherwise every bake would check out the persistent level, which is the most contested file in a team's stream.
- **Only levels that assemble get one.** Saving a level with no organs (a cell level, or one opened for level-instance editing) doesn't create a cache actor.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Pool` | [FNWorldCollisionPool](world-collision-pool.md) | The level's baked collision geometry. Reflected so it is saved, but not editable. |

## Finding It

```cpp
static ANWorldCollisionCacheActor* Find(const UWorld* World);
```

Returns the cache actor in `World`, or `nullptr` when the level has never been baked. Instanced levels are skipped, so a level opened as a level instance reads its own cache rather than its host's.

```cpp
static ANWorldCollisionCacheActor* FindOrCreate(UWorld* World);
```

Editor-only (`WITH_EDITOR`). Returns the cache actor, spawning one into the persistent level if there is none. Only a bake calls it, and bakes only happen at author time.

## Details Panel

Selecting the cache actor shows a **World Collision Cache** category instead of an empty panel. The pool itself isn't editable, so the panel offers what is useful when looking at it:

| Control | What It Does |
| :-- | :-- |
| Status | Read-only. How many elements the pool holds, and whether it is **current**, **stale** (a run will gather fresh), or **not baked** (the world is gathered on every run). |
| `Create Visualizer` / `Remove Visualizer` | Toggles the [collision visualizer](../editor-mode/world.md#visualizers) for this level. The label follows the visualizer's state even when you toggle it from the World rail instead. |
| `Select Visualizer` | Selects the live visualizer actor, replacing the current selection. Enabled only while one exists. |
| `Bake World Collision` | Forces a bake of **every** organ in the level. It always bakes the whole level, because this actor represents the whole level's pool. Unavailable in PIE, or when the level holds no organs. |

These are the World rail's actions, run through the same code, but the difference is reach: this panel is one Outliner click away **whether or not** the World Assembly editor mode is open. Creating the visualizer from here doesn't change your selection, so the panel you clicked in stays open. The status comes from the same memoized check as the rail's badge and the visualizer, so all three agree.

The panel acts on a single level. With cache actors from several levels selected, it says so and does nothing.
